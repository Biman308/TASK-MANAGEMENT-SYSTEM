import { useState } from "react";
import { encryptData, decryptData } from "../utils/crypto";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const encrypted = encryptData({ email, password });

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        data: encrypted,
      });

      if (!res.data || !res.data.data) {
        throw new Error("Empty or invalid response from server");
      }

      const decrypted = decryptData(res.data.data);
      const token = decrypted.token;
      login(token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err.message || err);
      alert("Invalid credentials or server error. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md space-y-4 w-80"
      >
        <h2 className="text-2xl font-semibold text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Log In
        </button>

        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
