import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { decryptData } from "../utils/crypto";
import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import Chat from "../components/Chat";

const columns = {
  todo: "To Do",
  inprogress: "In Progress",
  completed: "Completed",
};

const Dashboard = () => {
  const { token, role, userId } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchTasks = async () => {
    try {
      if (!token) {
        console.warn("No token found. Aborting fetch.");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.data || !res.data.data) {
        throw new Error("No encrypted data returned");
      }

      const decrypted = decryptData(res.data.data);
      const taskList = Array.isArray(decrypted.tasks) ? decrypted.tasks : [];
      setTasks(taskList);
    } catch (err) {
      console.error("Error loading tasks:", err.response?.data || err.message);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center w-full">
          Task Dashboard
        </h1>
        {role === "admin" && (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setShowCreateModal(true)}
          >
            + New Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(columns).map(([status, label]) => (
          <div key={status} className="bg-white rounded-xl shadow p-4">
            <h2 className="text-xl font-semibold mb-4">{label}</h2>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status?.toLowerCase() === status)
                .map((task) => (
                  <div
                    key={task._id}
                    className="border rounded p-2 bg-gray-50 shadow-sm cursor-pointer hover:bg-gray-100"
                    onClick={() => setEditTask(task)}
                  >
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Live Chat</h2>
        <Chat />
      </div>

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onTaskCreated={fetchTasks}
        />
      )}
      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onTaskUpdated={fetchTasks}
        />
      )}
    </div>
  );
};

export default Dashboard;
