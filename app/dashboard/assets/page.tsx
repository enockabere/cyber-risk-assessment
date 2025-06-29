"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import Swal from "sweetalert2";
import { useTopbar } from "@/app/context/TopbarContext";
import { useBreadcrumbs } from "@/app/context/BreadcrumbContext";

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

export default function AssetSelectionPage() {
  const [allAssets, setAllAssets] = useState<Asset[]>([]);
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(
    new Set()
  );
  const [assignedAssets, setAssignedAssets] = useState<AssignedAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    const res = await fetch("/api/assets/available");
    const data = await res.json();
    setAllAssets(data);
  };

  const fetchAssignedAssets = async () => {
    const res = await fetch("/api/assets/selected");
    const data = await res.json();
    setAssignedAssets(data);
    setSelectedAssetIds(new Set(data.map((a: AssignedAsset) => a.asset.id)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/assets/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetIds: Array.from(selectedAssetIds) }),
      });
      await fetchAssignedAssets();
    } catch (err) {
      console.error("Failed to save assets", err);
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
    setLoading(true);
    Promise.all([fetchAssets(), fetchAssignedAssets()]).finally(() =>
      setLoading(false)
    );
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-10">
      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading assets...</div>
      ) : (
        <>
          {/* Asset selection */}
          <div className="bg-white p-6 rounded-md shadow-sm border">
            <h2 className="text-xl font-bold text-green-700 mb-4">
              Select Assets You Own
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allAssets.map((asset) => (
                <label
                  key={asset.id}
                  className="flex items-start gap-3 p-3 border rounded-md bg-gray-50 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedAssetIds.has(asset.id)}
                    onCheckedChange={() => toggleAsset(asset.id)}
                  />
                  <div>
                    <p className="font-medium text-gray-800">{asset.name}</p>
                    <p className="text-sm text-gray-500">{asset.description}</p>
                  </div>
                </label>
              ))}
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="mt-4 bg-green-600 text-white"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save My Assets"
              )}
            </Button>
          </div>

          {/* Asset threats */}
          {assignedAssets.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-green-700 mb-4">
                Your Asset Threats
              </h2>
              <div className="space-y-6">
                {assignedAssets.map((ua) => (
                  <Card
                    key={ua.id}
                    className="p-5 border border-gray-200 shadow-sm rounded-md bg-white space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {ua.asset.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {ua.asset.description}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          const confirmed = await Swal.fire({
                            title: "Remove Asset?",
                            text: `Are you sure you want to remove "${ua.asset.name}" from your assets?`,
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#d33",
                            cancelButtonColor: "#aaa",
                            confirmButtonText: "Yes, remove it",
                          });

                          if (confirmed.isConfirmed) {
                            try {
                              const updatedSet = new Set(selectedAssetIds);
                              updatedSet.delete(ua.asset.id);
                              setSelectedAssetIds(updatedSet);

                              await fetch("/api/assets/assign", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  assetIds: Array.from(updatedSet),
                                }),
                              });

                              // Optimistically update the list
                              setAssignedAssets((prev) =>
                                prev.filter((a) => a.asset.id !== ua.asset.id)
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
                        Remove
                      </Button>
                    </div>

                    {ua.asset.threats.length > 0 ? (
                      <ul className="space-y-4 mt-3">
                        {ua.asset.threats.map((threat) => (
                          <li
                            key={threat.id}
                            className="pl-3 border-l-4 border-red-500"
                          >
                            <p className="text-md font-medium text-red-600">
                              {threat.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              {threat.description}
                            </p>
                            <p className="text-xs text-gray-500 italic">
                              Risk Level: {threat.riskLevel}
                            </p>
                            {threat.mitigations.length > 0 && (
                              <ul className="list-disc list-inside mt-1 text-sm text-green-700">
                                {threat.mitigations.map((m, i) => (
                                  <li key={i}>{m.description}</li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 mt-2">
                        No threats linked.
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
