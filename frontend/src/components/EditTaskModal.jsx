import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { encryptData, decryptData } from "../utils/crypto";
import axios from "axios";

export default function EditTaskModal({ task, onClose, onTaskUpdated }) {
  const { token, role } = useAuth();

  const formatDate = (isoDate) => new Date(isoDate).toISOString().split("T")[0];

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [dueDate, setDueDate] = useState(formatDate(task.dueDate));

  const handleUpdate = async () => {
    try {
      const payload =
        role === "user" ? { status } : { title, description, status, dueDate };

      const encrypted = encryptData(payload);

      const res = await axios.put(
        `http://localhost:5000/api/tasks/${task._id}`,
        { data: encrypted },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      decryptData(res.data.data);
      alert("Task updated successfully");
      onTaskUpdated();
      onClose();
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update task");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={role !== "admin"}
          placeholder="Title"
          className="w-full border p-2 mb-3 rounded"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={role !== "admin"}
          placeholder="Description"
          className="w-full border p-2 mb-3 rounded"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        >
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={role !== "admin"}
          className="w-full border p-2 mb-4 rounded"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
