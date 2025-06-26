import express from "express";
import { saveMessage, getMessages } from "../controllers/chatController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/conversation", verifyToken, getMessages);
router.post("/send", verifyToken, saveMessage);

export default router;
