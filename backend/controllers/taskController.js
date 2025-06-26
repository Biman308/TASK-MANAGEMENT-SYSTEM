import Task from "../models/Task.js";
import { decrypt, encrypt } from "../utils/crypto.js";
import { notifyAdmin } from "../utils/mailer.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "email")
      .populate("createdBy", "email");

    return res.json({ data: encrypt({ tasks }) });
  } catch (err) {
    console.error("Error fetching tasks:", err.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const createTask = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create tasks" });
    }

    const data = decrypt(req.body.data);

    if (!data.title || !data.dueDate || !data.assignedTo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const task = await Task.create({
      ...data,
      createdBy: req.user.id,
    });

    return res.status(201).json({ data: encrypt(task) });
  } catch (err) {
    console.error("Error creating task:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const data = decrypt(req.body.data);

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role === "user") {
      task.status = data.status || task.status;
      await task.save({ validateBeforeSave: false });

      await notifyAdmin(task);
      return res.json({ data: encrypt(task) });
    }

    if (req.user.role === "admin") {
      task.title = data.title || task.title;
      task.description = data.description || task.description;
      task.status = data.status || task.status;
      task.dueDate = data.dueDate || task.dueDate;

      await task.save({ validateBeforeSave: false });
      return res.json({ data: encrypt(task) });
    }

    return res.status(403).json({ message: "Unauthorized user" });
  } catch (err) {
    console.error("Error updating task:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete tasks" });
    }

    const taskId = req.params.id;
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(204).send();
  } catch (err) {
    console.error("Error deleting task:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
