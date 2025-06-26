import http from "http";
import { Server } from "socket.io";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(5000, () => {
      console.log("Server + Socket running on port 5000");
    });
  })
  .catch((err) => console.error("MongoDB Connection Error:", err.message));

// SOCKET.IO
let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("addUser", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log(`User ${userId} is online`);
  });

  socket.on("sendMessage", ({ sender, receiver, message }) => {
    const receiverSocket = onlineUsers[receiver];
    if (receiverSocket) {
      io.to(receiverSocket).emit("getMessage", { sender, message });
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    for (const [userId, socketId] of Object.entries(onlineUsers)) {
      if (socketId === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
  });
});
