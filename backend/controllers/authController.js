import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import { encrypt, decrypt } from "../utils/crypto.js";

dotenv.config();

export const signup = async (req, res) => {
  try {
    if (!req.body || !req.body.data) {
      return res.status(400).json({ message: "No data received" });
    }

    const data = decrypt(req.body.data);
    const { email, password } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
      role: "user",
    });

    return res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup Error:", err.message);
    return res.status(500).json({
      message: "Signup failed",
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    if (!req.body || !req.body.data) {
      return res.status(400).json({ message: "No data received" });
    }

    const data = decrypt(req.body.data);
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const encryptedToken = encrypt({ token, role: user.role });

    return res.status(200).json({ data: encryptedToken });
  } catch (err) {
    console.error("Login Error:", err.message);
    return res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
};
