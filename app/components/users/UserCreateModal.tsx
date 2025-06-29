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
      let data: { user?: AppUser; message?: string };

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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create user";
      console.error("❌ Error during registration:", error);
      Swal.fire("Error", message, "error");
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
            <Label className="my-2" htmlFor="name">
              University
            </Label>
            <select
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm px-3 py-2"
            >
              <option value="">Select University</option>
              <option value="University of Nairobi">
                University of Nairobi
              </option>
              <option value="Kenyatta University">Kenyatta University</option>
              <option value="Strathmore University">
                Strathmore University
              </option>
              <option value="Jomo Kenyatta University of Agriculture and Technology">
                JKUAT
              </option>
              <option value="United States International University - Africa">
                USIU-Africa
              </option>
              <option value="Africa Nazarene University">
                Africa Nazarene University
              </option>
              <option value="Catholic University of Eastern Africa">
                CUEA
              </option>
            </select>
          </div>

          <div className="space-y-1">
            <Label className="my-2" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="pl-8 h-9 text-sm text-black rounded-md bg-gray-50 focus:bg-white border-gray-200 focus:ring-2 focus:ring-green-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <Label className="my-2" htmlFor="role">
              Role
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger
                id="role"
                className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm px-3 py-2"
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
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? "Creating..." : "Create User"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
