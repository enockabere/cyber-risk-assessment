"use client";

import DataTable, { TableColumn } from "react-data-table-component";
import { Pencil, Trash2, ShieldAlert, Server } from "lucide-react";

type Asset = {
  id: string;
  name: string;
  description?: string;
};

interface Props {
  assets: Asset[];
  loading: boolean;
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
  onManageThreats: (asset: Asset) => void;
}

const customStyles = {
  headRow: {
    style: {
      backgroundColor: "#f8fafc",
      borderBottom: "1px solid #e2e8f0",
      fontWeight: "700",
    },
  },
  headCells: {
    style: {
      color: "#374151",
      fontSize: "14px",
      fontWeight: "600",
    },
  },
  rows: {
    style: {
      borderBottom: "1px solid #f1f5f9",
      "&:hover": {
        backgroundColor: "#f8fafc",
      },
    },
  },
  pagination: {
    style: {
      borderTop: "1px solid #e2e8f0",
    },
  },
};

export default function AssetTable({
  assets,
  onEdit,
  onDelete,
  onManageThreats,
  loading,
}: Props) {
  const columns: TableColumn<Asset>[] = [
    {
      name: "Asset",
      cell: (row) => (
        <div className="flex items-center gap-3 py-2">
          <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            <Server className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 truncate">{row.name}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Description",
      cell: (row) => (
        <div className="text-sm text-gray-600">
          {row.description || <span className="italic text-gray-400">N/A</span>}
        </div>
      ),
      sortable: false,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(row)}
            title="Edit Asset"
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md p-2 text-sm"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(row.id)}
            title="Delete Asset"
            className="bg-red-600 text-white hover:bg-red-700 rounded-md p-2 text-sm"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onManageThreats(row)}
            title="Manage Threats"
            className="bg-green-600 text-white hover:bg-green-700 rounded-md p-2 text-sm"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      width: "180px",
    },
  ];

  if (loading) {
    const skeletons = Array(5).fill(0);
    return (
      <div className="w-full space-y-2">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 animate-pulse bg-gray-50 rounded-md border border-gray-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div className="w-32 h-4 bg-gray-200 rounded" />
            </div>
            <div className="w-40 h-4 bg-gray-100 rounded" />
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded" />
              <div className="w-8 h-8 bg-gray-200 rounded" />
              <div className="w-8 h-8 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={assets}
      highlightOnHover
      pagination
      responsive
      customStyles={customStyles}
      className="w-full"
      noDataComponent={
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Server className="h-12 w-12 mb-4 opacity-30" />
          <div className="text-lg font-medium">No assets found</div>
          <div className="text-sm">Start by adding your first asset</div>
        </div>
      }
    />
  );
}
