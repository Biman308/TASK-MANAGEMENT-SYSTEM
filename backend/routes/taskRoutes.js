import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getTasks);
router.post("/", verifyToken, isAdmin, createTask);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, isAdmin, deleteTask);

export default router;
