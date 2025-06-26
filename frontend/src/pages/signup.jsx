import { useState } from "react";
import { encryptData } from "../utils/crypto";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const encryptedPayload = encryptData({ email, password });

      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        data: encryptedPayload,
      });

      if (res?.data?.message === "Signup success") {
        alert("Signup successful! Please log in.");
        navigate("/");
      } else {
        alert("Signup may have failed. Please try again.");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      console.error("Signup error:", errorMsg);
      alert(`Signup failed: ${errorMsg}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-xl shadow-md space-y-4 w-80"
      >
        <h2 className="text-2xl font-semibold text-center">Sign Up</h2>

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
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
