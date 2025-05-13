"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";

export default function DashboardPage() {
  useEffect(() => {
    const success = localStorage.getItem("login_success");
    if (success) {
      toast.success("Login successful");
      localStorage.removeItem("login_success");
    }
  }, []);

  return <div className="p-4">Welcome to the Dashboard 🎉</div>;
}
