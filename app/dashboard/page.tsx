"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { useTopbar } from "@/app/context/TopbarContext";

export default function DashboardPage() {
  const { setTitle } = useTopbar();

  useEffect(() => {
    setTitle("Dashboard");
  }, [setTitle]);
  useEffect(() => {
    const success = localStorage.getItem("login_success");
    if (success) {
      toast.success("Login successful");
      localStorage.removeItem("login_success");
    }
  }, []);

  return <div className="p-4">Welcome to the Dashboard 🎉</div>;
}
