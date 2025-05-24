"use client";

import { Pencil, Trash2 } from "lucide-react";
import DataTable, { TableColumn } from "react-data-table-component";

interface Section {
  id: string;
  title: string;
  description: string | null;
  parentId?: string | null;
  position: string;
}

interface Props {
  data: Section[];
  onEdit: (section: Section) => void;
  onDelete: (id: string) => void;
}

export default function SectionTable({ data, onEdit, onDelete }: Props) {
  // Build a map of section ID to section
  const sectionMap = new Map<string, Section>();
  data.forEach((section) => sectionMap.set(section.id, section));

  // Group sections by parentId
  const groupedByParent = new Map<string | null, Section[]>();
  data.forEach((section) => {
    const key = section.parentId || null;
    if (!groupedByParent.has(key)) groupedByParent.set(key, []);
    groupedByParent.get(key)?.push(section);
  });

  groupedByParent.forEach((list) =>
    list.sort((a, b) =>
      String(a.position || "").localeCompare(
        String(b.position || ""),
        undefined,
        { numeric: true }
      )
    )
  );

  // Generate a flat list with prefixed titles
  const numberedSections: (Section & { displayTitle: string })[] = [];
  function buildHierarchy(parentId: string | null, prefix: string = "") {
    const siblings = groupedByParent.get(parentId);
    if (!siblings) return;

    siblings.forEach((section, index) => {
      const currentPrefix = prefix ? `${prefix}.${index + 1}` : `${index + 1}`;
      numberedSections.push({
        ...section,
        displayTitle: `${currentPrefix}. ${section.title}`,
      });

      buildHierarchy(section.id, currentPrefix);
    });
  }

  buildHierarchy(null); // Start from root sections

  const parentMap = new Map(data.map((s) => [s.id, s.title]));

  const columns: TableColumn<Section & { displayTitle: string }>[] = [
    {
      name: "Section",
      selector: (row) => row.displayTitle,
      sortable: false,
      wrap: true,
    },
    {
      name: "Description",
      selector: (row) => row.description || "No description",
      wrap: true,
    },
    {
      name: "Parent",
      selector: (row) =>
        row.parentId ? parentMap.get(row.parentId) || "Unknown" : "None",
    },
    {
      name: "Position",
      selector: (row) => row.position,
      sortable: true,
      style: { textAlign: "center" },
      width: "120px",
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
      data={numberedSections}
      pagination
      highlightOnHover
      noDataComponent={
        <div className="text-gray-500 py-6">No sections found</div>
      }
    />
  );
}
