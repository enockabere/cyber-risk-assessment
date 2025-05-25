"use client";

import { useEffect } from "react";
import { useTopbar } from "@/app/context/TopbarContext";
import { useBreadcrumbs } from "@/app/context/BreadcrumbContext";
import BackgroundInfoSetup from "@/app/components/background/BackgroundInfoSetup";

export default function BackgroundViewer() {
  const { setTitle } = useTopbar();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setTitle("Background Information");
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      {
        label: `Background Information`,
        href: `/dashboard/admin/background`,
      },
    ]);
  }, []);

  const today = new Date();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md space-y-4">
      <h1 className="text-3xl font-bold text-indigo-700">
        🎉 Welcome to cyber security risk assessment
      </h1>

      <div className="mt-6 border-t pt-4 space-y-2">
        <p className="text-sm text-gray-500">
          Created At:{" "}
          {today.toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
        <p className="text-sm text-gray-500">
          Status: <span className="text-green-600">Active</span>
        </p>
      </div>

      <div className="pt-6">
        <h3 className="text-sm text-indigo-800 italic mb-2">
          Start setting up background information below:
        </h3>
        <BackgroundInfoSetup />
      </div>
    </div>
  );
}
