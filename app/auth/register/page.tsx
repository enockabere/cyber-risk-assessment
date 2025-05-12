"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Register</h2>
        <input
          type="email"
          className="w-full mb-3 p-2 border rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-3 p-2 border rounded"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleRegister}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Register
        </button>
      </div>
    </div>
  );
}
