// app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) router.push("/dashboard");
    else alert("Invalid login credentials");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6 text-center">
          Cyber Risk Portal
        </h1>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary-dark"
            onClick={handleLogin}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
