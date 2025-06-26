import React, { useState, useEffect } from "react";
import axios from "axios";
import { encryptData } from "../utils/crypto";
import { useAuth } from "../context/AuthContext";

const CreateTaskModal = ({ onClose, onTaskCreated }) => {
  const { token, role } = useAuth();

  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "todo",
    dueDate: "",
    assignedTo: "",
  });

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (role === "admin") {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const res = await axios.get("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(res.data);

          if (res.data.length > 0 && !task.assignedTo) {
            setTask((prev) => ({ ...prev, assignedTo: res.data[0]._id }));
          }
        } catch (err) {
          console.error("Error fetching users:", err);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [role, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!task.title || !task.dueDate || !task.description) {
      alert("All fields are required");
      return;
    }

    if (role === "admin" && !task.assignedTo) {
      alert("Please assign this task to a user");
      return;
    }

    try {
      const encrypted = encryptData(task);

      await axios.post(
        "http://localhost:5000/api/tasks",
        { data: encrypted },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Task created successfully");
      setTask({
        title: "",
        description: "",
        status: "todo",
        dueDate: "",
        assignedTo: "",
      });

      onTaskCreated();
      onClose();
    } catch (err) {
      console.error("Error creating task:", err.response || err);
      alert("Failed to create task. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            type="text"
            placeholder="Title"
            value={task.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={task.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          ></textarea>

          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <input
            name="dueDate"
            type="date"
            value={task.dueDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          {role === "admin" && (
            <select
              name="assignedTo"
              value={task.assignedTo}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Assign to User</option>
              {loadingUsers ? (
                <option disabled>Loading users...</option>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.email}
                  </option>
                ))
              ) : (
                <option disabled>No users available</option>
              )}
            </select>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
