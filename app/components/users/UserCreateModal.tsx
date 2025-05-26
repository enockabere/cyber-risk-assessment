"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AppUser } from "@/app/types/users";
import Swal from "sweetalert2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (newUser: AppUser) => void;
}

export default function UserCreateModal({ open, onClose, onCreate }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("respondent");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !name) {
      Swal.fire("Missing fields", "Name and email are required", "warning");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          password: "password123",
          role,
        }),
      });
      const contentType = res.headers.get("content-type") || "";
      let data: any;

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { message: text };
      }

      console.log("📥 Response data:", data);

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      onCreate(data.user);

      Swal.fire({
        icon: "success",
        title: "User Created",
        text: "User was created with default password: password123",
      });

      setEmail("");
      setName("");
      setRole("respondent");
      onClose();
    } catch (error: any) {
      console.error("❌ Error during registration:", error);
      Swal.fire("Error", error.message || "Failed to create user", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-6 space-y-5">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            The user will be created with a default password:{" "}
            <strong>password123</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="bg-white"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="name">University</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="bg-white"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger
                id="role"
                className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm px-3 py-2"
              >
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-md rounded-md">
                <SelectItem value="respondent">Respondent</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {loading ? "Creating..." : "Create User"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
