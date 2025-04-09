// app/auth/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      window.location.href = "/dashboard"; // Redireciona manualmente após login
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-2xl">Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 bg-gray-800 rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 bg-gray-800 rounded"
        />
        <Button type="submit">Sign In</Button>
      </form>
    </div>
  );
}