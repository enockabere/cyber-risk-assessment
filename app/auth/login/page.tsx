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
    <div className="min-h-screen flex items-stretch bg-background transition-all duration-700 ease-smooth">
      {/* Left side info section */}
      <div className="hidden md:flex w-1/2 bg-primary text-white flex-col justify-center px-10 py-12 transition duration-700 ease-smooth">
        <h1 className="text-4xl font-display font-semibold mb-4 leading-tight">
          Welcome to the Cyber Risk Portal
        </h1>
        <p className="text-lg font-light text-white/90">
          A powerful platform for assessing cybersecurity posture in
          universities. Complete the questionnaire, visualize your risk profile,
          and take action.
        </p>
      </div>

      {/* Login card */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white transition-all duration-700">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-xl p-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-foreground text-center mb-6">
            Login to Continue
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1"
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
                className="mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              className="w-full bg-primary text-white hover:bg-primary-dark transition duration-300"
              onClick={handleLogin}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
