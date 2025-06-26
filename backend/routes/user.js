import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/users", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find({ role: "user" }).select("_id email");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/user-by-role/:role", verifyToken, async (req, res) => {
  try {
    const role = req.params.role;
    const user = await User.findOne({ role }).select("_id email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user by role:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
