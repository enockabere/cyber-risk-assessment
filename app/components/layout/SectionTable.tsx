"use client";

import { Pencil, Trash2 } from "lucide-react";
import DataTable, { TableColumn } from "react-data-table-component";

interface Section {
  id: string;
  title: string;
  description: string | null;
  parentId?: string | null;
}

interface Props {
  data: Section[];
  onEdit: (section: Section) => void;
  onDelete: (id: string) => void;
}

export default function SectionTable({ data, onEdit, onDelete }: Props) {
  // Build a lookup map of section ID to title
  const parentMap = new Map(data.map((section) => [section.id, section.title]));

  const columns: TableColumn<Section>[] = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description || "No description",
      wrap: true,
    },
    {
      name: "Parent Section",
      selector: (row) =>
        row.parentId ? parentMap.get(row.parentId) || "Unknown" : "None",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-3">
          <span
            onClick={() => onEdit(row)}
            className="cursor-pointer text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <Pencil size={18} />
          </span>
          <span
            onClick={() => onDelete(row.id)}
            className="cursor-pointer text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 size={18} />
          </span>
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      pagination
      highlightOnHover
      noDataComponent={
        <div className="text-gray-500 py-6">No sections found</div>
      }
    />
  );
}
