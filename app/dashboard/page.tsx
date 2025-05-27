"use client";

import { useEffect, useState } from "react";
import { useTopbar } from "@/app/context/TopbarContext";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { ClipboardList, BarChart2, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import RespondentStats from "../components/users/RespondentStats";

export default function DashboardPage() {
  const { setTitle } = useTopbar();
  const { data: session } = useSession();

  const [stats, setStats] = useState({
    totalSubmissions: 0,
    averageRiskScore: 0,
    flaggedAlerts: 0,
  });

  useEffect(() => {
    setTitle("Dashboard");

    const success = localStorage.getItem("login_success");
    if (success) {
      toast.success("Login successful");
      localStorage.removeItem("login_success");
    }

    if (session?.user.role === "ADMIN") {
      fetch("/api/dashboard/summary")
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch((err) => console.error("Failed to load stats:", err));
    }
  }, [setTitle, session]);

  return (
    <div className="p-6 space-y-6">
      {session?.user.role === "ADMIN" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Submissions"
            value={stats.totalSubmissions}
            icon={<ClipboardList className="text-indigo-600" />}
          />
          <StatCard
            title="Average Risk Score"
            value={stats.averageRiskScore.toFixed(2)}
            icon={<BarChart2 className="text-amber-500" />}
          />
          <StatCard
            title="Flagged Alerts"
            value={stats.flaggedAlerts}
            icon={<AlertTriangle className="text-red-600" />}
          />
        </div>
      ) : (
        <RespondentStats />
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="flex items-center space-x-4">
        <div className="p-3 rounded-full bg-gray-100">{icon}</div>
        <div>
          <CardTitle className="text-sm text-gray-500">{title}</CardTitle>
          <CardContent className="text-2xl font-semibold text-gray-800 p-0 mt-1">
            {value}
          </CardContent>
        </div>
      </CardHeader>
    </Card>
  );
}
