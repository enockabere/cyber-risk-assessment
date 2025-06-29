"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import GeneralReport from "@/app/components/reports/GeneralReport";
import AssetReport from "@/app/components/reports/AssetReport";
import { FileText, ShieldCheck } from "lucide-react";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<"general" | "asset">("general");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Generate Cybersecurity Risk Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Download detailed reports based on recent risk assessments.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={reportType === "general" ? "default" : "outline"}
              onClick={() => setReportType("general")}
            >
              <FileText className="w-4 h-4 mr-1" />
              General Report
            </Button>
            <Button
              variant={reportType === "asset" ? "default" : "outline"}
              onClick={() => setReportType("asset")}
            >
              <ShieldCheck className="w-4 h-4 mr-1" />
              Asset-Based Report
            </Button>
          </div>
        </div>

        {/* Report View */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          {reportType === "general" && <GeneralReport />}
          {reportType === "asset" && <AssetReport />}
        </div>
      </div>
    </div>
  );
}
