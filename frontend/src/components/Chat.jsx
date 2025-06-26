import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const socket = io("http://localhost:5000");

export default function Chat() {
  const { userId, token, role } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const receiverId = role === "admin" ? "USER_OBJECT_ID" : "ADMIN_OBJECT_ID";

  const chatBoxRef = useRef();

  useEffect(() => {
    if (userId) {
      socket.emit("addUser", userId);
    }
  }, [userId]);

  useEffect(() => {
    socket.on("getMessage", ({ sender, message }) => {
      setMessages((prev) => [
        ...prev,
        { sender, message, timestamp: new Date() },
      ]);
    });

    return () => socket.off("getMessage");
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/chat/conversation",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch chat history", err);
      }
    };
    fetchChats();
  }, [token]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const msgObj = {
      sender: userId,
      receiver: receiverId,
      message,
    };

    try {
      await axios.post("http://localhost:5000/api/chat/send", msgObj, {
        headers: { Authorization: `Bearer ${token}` },
      });

      socket.emit("sendMessage", msgObj);
      setMessages((prev) => [...prev, { ...msgObj, timestamp: new Date() }]);
      setMessage("");
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  useEffect(() => {
    chatBoxRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Live Chat</h2>

      <div className="border h-96 overflow-y-auto p-3 bg-gray-50 rounded">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded max-w-xs ${
              msg.sender === userId
                ? "bg-green-100 self-end ml-auto"
                : "bg-blue-100"
            }`}
          >
            <div className="text-sm">{msg.message}</div>
            <div className="text-xs text-gray-500 text-right">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={chatBoxRef}></div>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow border rounded p-2"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
