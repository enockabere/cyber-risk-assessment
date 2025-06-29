"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AssetTable from "@/app/components/assets/AssetTable";
import AssetModal from "@/app/components/assets/AssetModal";
import Swal from "sweetalert2";
import ThreatModal from "@/app/components/assets/ThreatModal";
import { RiskLevel } from "@/app/lib/utils/risk-rating";

type Asset = {
  id: string;
  name: string;
  description?: string;
};

type Threat = {
  id: string;
  title: string;
  description?: string;
  riskLevel: RiskLevel;
  mitigations: { id: string; description: string }[];
};

export default function AdminAssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editAsset, setEditAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  const [showThreatModal, setShowThreatModal] = useState(false);
  const [selectedAssetForThreats, setSelectedAssetForThreats] =
    useState<Asset | null>(null);
  const [threats, setThreats] = useState<Threat[]>([]);

  const fetchAssets = async () => {
    try {
      setLoading(true); // 👈 start loading
      const res = await fetch("/api/assets");
      if (!res.ok) throw new Error("Failed to fetch assets");
      const data: Asset[] = await res.json();
      setAssets(data);
    } catch (err) {
      console.error("❌ Error fetching assets:", err);
    } finally {
      setLoading(false); // 👈 stop loading
    }
  };
  const handleSaveAsset = async (data: {
    name: string;
    description?: string;
  }) => {
    try {
      const method = editAsset ? "PATCH" : "POST";
      const url = editAsset ? `/api/assets/${editAsset.id}` : "/api/assets";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save asset");
      }

      const result = await res.json();
      console.log("✅ Asset saved:", result);
      await fetchAssets();
      setEditAsset(null);
    } catch (err) {
      if (err instanceof Error) {
        console.error("❌ Error saving asset:", err.message);
        alert(err.message);
      } else {
        console.error("❌ Unknown error:", err);
        alert("Something went wrong.");
      }
    }
  };

  const handleDeleteAsset = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Asset?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/assets/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Failed to delete asset");

      await fetchAssets();

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "The asset has been removed.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("❌ Error deleting asset:", err);
      Swal.fire("Error", "Failed to delete asset.", "error");
    }
  };

  const handleManageThreats = async (asset: Asset) => {
    try {
      setThreats([]); // Clear previous threats
      setSelectedAssetForThreats(asset); // Set new selected asset

      const res = await fetch(`/api/assets/${asset.id}/threats`);
      if (!res.ok) throw new Error("Failed to load threats");

      const data = await res.json();
      setThreats(data);
      // ❌ DO NOT call setShowThreatModal(true) here — you're now using the `useEffect` below instead
    } catch (err) {
      console.error("❌ Failed to load threats", err);
      Swal.fire("Error", "Unable to load threats for this asset.", "error");
    }
  };

  const handleAddThreat = async (data: {
    title: string;
    description?: string;
    riskLevel: RiskLevel;
  }) => {
    if (!selectedAssetForThreats) return;

    try {
      const res = await fetch(
        `/api/assets/${selectedAssetForThreats.id}/threats`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error("Failed to add threat");

      const newThreat = await res.json();
      setThreats((prev) => [...prev, newThreat]);

      Swal.fire({
        icon: "success",
        title: "Threat added",
        text: "The threat has been successfully added.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("❌ Failed to add threat", err);
      Swal.fire("Error", "Failed to add threat.", "error");
    }
  };

  useEffect(() => {
    if (selectedAssetForThreats && Array.isArray(threats)) {
      setShowThreatModal(true);
    }
  }, [selectedAssetForThreats, threats]);

  useEffect(() => {
    fetchAssets();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-white rounded-md shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Asset Registry</h2>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2 w-4 h-4" /> Add Asset
        </Button>
      </div>

      <AssetTable
        assets={assets}
        loading={loading}
        onEdit={(asset) => {
          setEditAsset(asset);
          setShowModal(true);
        }}
        onDelete={handleDeleteAsset}
        onManageThreats={handleManageThreats}
      />

      <AssetModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditAsset(null);
        }}
        onSave={handleSaveAsset}
        initialData={editAsset}
      />

      {selectedAssetForThreats && (
        <ThreatModal
          open={showThreatModal}
          onClose={() => {
            setShowThreatModal(false);
            setSelectedAssetForThreats(null);
            setThreats([]);
          }}
          assetName={selectedAssetForThreats.name}
          threats={threats}
          onAddThreat={handleAddThreat}
        />
      )}
    </div>
  );
}
