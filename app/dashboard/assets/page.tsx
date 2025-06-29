"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import Swal from "sweetalert2";
import { useTopbar } from "@/app/context/TopbarContext";
import { useBreadcrumbs } from "@/app/context/BreadcrumbContext";
import {
  Shield,
  Server,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Package,
  Eye,
  ShieldAlert,
} from "lucide-react";

interface Asset {
  id: string;
  name: string;
  description?: string;
}

interface Threat {
  id: string;
  title: string;
  description?: string;
  riskLevel: string;
  mitigations: { description: string }[];
}

interface AssignedAsset {
  id: string;
  asset: {
    id: string;
    name: string;
    description?: string;
    threats: Threat[];
  };
}

const getRiskLevelColor = (riskLevel: string) => {
  switch (riskLevel.toUpperCase()) {
    case "VERY_HIGH":
    case "CRITICAL":
      return "bg-red-100 text-red-800 border-red-200";
    case "HIGH":
    case "SEVERE":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "MEDIUM":
    case "MODERATE":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "LOW":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "VERY_LOW":
    case "SUSTAINABLE":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatRiskLevel = (riskLevel: string) => {
  return riskLevel
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function AssetSelectionPage() {
  const [allAssets, setAllAssets] = useState<Asset[]>([]);
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(
    new Set()
  );
  const [assignedAssets, setAssignedAssets] = useState<AssignedAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setTitle } = useTopbar();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setTitle("My Assets");
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Assets", href: "/dashboard/assets" },
    ]);
  }, []);

  const fetchAssets = async () => {
    try {
      console.log("🔍 Fetching available assets...");
      const res = await fetch("/api/assets/available");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("📦 Available assets:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      setAllAssets(data);
    } catch (err) {
      console.error("❌ Failed to fetch available assets:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch available assets"
      );
    }
  };

  const fetchAssignedAssets = async () => {
    try {
      console.log("🔍 Fetching assigned assets...");
      const res = await fetch("/api/assets/selected");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("🎯 Assigned assets:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      setAssignedAssets(data);
      setSelectedAssetIds(new Set(data.map((a: AssignedAsset) => a.asset.id)));
    } catch (err) {
      console.error("❌ Failed to fetch assigned assets:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch assigned assets"
      );
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log("💾 Saving assets:", Array.from(selectedAssetIds));
      const res = await fetch("/api/assets/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetIds: Array.from(selectedAssetIds) }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      await fetchAssignedAssets();

      Swal.fire({
        icon: "success",
        title: "Assets Saved!",
        text: `Successfully assigned ${data.assignedCount} assets.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("❌ Failed to save assets:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err instanceof Error ? err.message : "Failed to save assets",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleAsset = (id: string) => {
    setSelectedAssetIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([fetchAssets(), fetchAssignedAssets()]);
      } catch (err) {
        console.error("❌ Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <strong className="font-semibold">Error:</strong> {error}
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white"
              size="sm"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-600">Loading assets...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Asset Selection Section */}
            <Card className="bg-white shadow-xl border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-7 h-7" />
                  <h1 className="text-2xl font-bold">Asset Management</h1>
                </div>
                <p className="text-blue-100">
                  Select the IT assets your organization owns to begin risk
                  assessment
                </p>
              </div>

              <div className="p-6 bg-white">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">
                      Available Assets
                    </h2>
                    <p className="text-slate-600 text-sm mt-1">
                      {allAssets.length} assets available •{" "}
                      {selectedAssetIds.size} selected
                    </p>
                  </div>

                  {selectedAssetIds.size > 0 && (
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                    >
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Saving...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Save Selection ({selectedAssetIds.size})
                        </span>
                      )}
                    </Button>
                  )}
                </div>

                {allAssets.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-xl">
                    <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">
                      No assets available to select.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allAssets.map((asset) => (
                      <label
                        key={asset.id}
                        className={`group relative flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedAssetIds.has(asset.id)
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <Checkbox
                          checked={selectedAssetIds.has(asset.id)}
                          onCheckedChange={() => toggleAsset(asset.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2">
                            <Server className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-medium text-slate-800 group-hover:text-blue-700 transition-colors">
                                {asset.name}
                              </p>
                              {asset.description && (
                                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                  {asset.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Assigned Assets Section */}
            {assignedAssets.length > 0 && (
              <Card className="bg-white shadow-xl border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-7 h-7" />
                    <h2 className="text-2xl font-bold">
                      Your Assets & Threats
                    </h2>
                  </div>
                  <p className="text-emerald-100">
                    {assignedAssets.length} assets assigned • View threats and
                    risk levels
                  </p>
                </div>

                <div className="p-6 space-y-6 bg-white">
                  {assignedAssets.map((ua) => (
                    <Card
                      key={ua.id}
                      className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="p-6 bg-green-100">
                        {/* Asset Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Server className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-slate-800">
                                {ua.asset.name}
                              </h3>
                              {ua.asset.description && (
                                <p className="text-slate-600 mt-1">
                                  {ua.asset.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                  <ShieldAlert className="w-4 h-4" />
                                  {ua.asset.threats.length} threats identified
                                </span>
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                            onClick={async () => {
                              const confirmed = await Swal.fire({
                                title: "Remove Asset?",
                                text: `Are you sure you want to remove "${ua.asset.name}" from your assets?`,
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#dc2626",
                                cancelButtonColor: "#6b7280",
                                confirmButtonText: "Yes, remove it",
                              });

                              if (confirmed.isConfirmed) {
                                try {
                                  const updatedSet = new Set(selectedAssetIds);
                                  updatedSet.delete(ua.asset.id);
                                  setSelectedAssetIds(updatedSet);

                                  const res = await fetch(
                                    "/api/assets/assign",
                                    {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        assetIds: Array.from(updatedSet),
                                      }),
                                    }
                                  );

                                  if (!res.ok) {
                                    throw new Error(
                                      `HTTP error! status: ${res.status}`
                                    );
                                  }

                                  setAssignedAssets((prev) =>
                                    prev.filter(
                                      (a) => a.asset.id !== ua.asset.id
                                    )
                                  );

                                  Swal.fire({
                                    icon: "success",
                                    title: "Removed!",
                                    text: `"${ua.asset.name}" has been removed.`,
                                    timer: 2000,
                                    showConfirmButton: false,
                                  });
                                } catch (err) {
                                  console.error("Failed to remove asset", err);
                                  Swal.fire({
                                    icon: "error",
                                    title: "Error",
                                    text: "Something went wrong while removing the asset.",
                                  });
                                }
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>

                        {/* Threats Section */}
                        {ua.asset.threats.length > 0 ? (
                          <div className="bg-slate-50 rounded-lg p-4">
                            <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                              Security Threats
                            </h4>
                            <div className="space-y-3">
                              {ua.asset.threats.map((threat) => (
                                <div
                                  key={threat.id}
                                  className="bg-white rounded-lg p-4 border border-slate-200"
                                >
                                  <div className="flex items-start justify-between gap-3 mb-2">
                                    <h5 className="font-medium text-slate-800">
                                      {threat.title}
                                    </h5>
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskLevelColor(
                                        threat.riskLevel
                                      )}`}
                                    >
                                      {formatRiskLevel(threat.riskLevel)}
                                    </span>
                                  </div>

                                  {threat.description && (
                                    <p className="text-sm text-slate-600 mb-3">
                                      {threat.description}
                                    </p>
                                  )}

                                  {threat.mitigations.length > 0 && (
                                    <div className="bg-green-50 rounded-md p-3 border border-green-200">
                                      <h6 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-1">
                                        <Shield className="w-4 h-4" />
                                        Mitigation Strategies
                                      </h6>
                                      <ul className="space-y-1">
                                        {threat.mitigations.map((m, i) => (
                                          <li
                                            key={i}
                                            className="text-sm text-green-700 flex items-start gap-2"
                                          >
                                            <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                            {m.description}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-slate-50 rounded-lg p-6 text-center">
                            <Eye className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-slate-600">
                              No threats identified for this asset
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
