import DataTable, { TableColumn } from "react-data-table-component";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Calendar, Users } from "lucide-react";
import { RoleBadge, StatusBadge } from "../../dashboard/users/UserBadges";
import { UserActionsDropdown } from "../../dashboard/users/UserActionsDropdown";
import { AppUser } from "@/app/types/users";

interface UserTableProps {
  data: AppUser[];
  loading: boolean;
  onView: (user: AppUser) => void;
  onEdit: (user: AppUser) => void;
  onDelete: (user: AppUser) => void;
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

export function UserTable({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
}: UserTableProps) {
  const columns: TableColumn<AppUser>[] = [
    {
      name: "User",
      cell: (row) => (
        <div className="flex items-center gap-3 py-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium">
              {(row.name || row.email).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 truncate">
              {row.name || "Unnamed User"}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-1 truncate">
              <Mail size={12} />
              {row.email}
            </div>
          </div>
        </div>
      ),
      sortable: true,
      width: "300px",
    },
    {
      name: "Role",
      cell: (row) => <RoleBadge role={row.role} />,
      sortable: true,
      width: "130px",
    },
    {
      name: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
      sortable: true,
      width: "120px",
    },
    {
      name: "Created",
      cell: (row) => (
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-1 mb-1">
            <Calendar size={12} />
            {row.createdAt
              ? new Date(row.createdAt).toLocaleDateString()
              : "Unknown"}
          </div>
          <div className="text-xs text-gray-400">
            {row.lastLogin
              ? `Last login: ${new Date(row.lastLogin).toLocaleDateString()}`
              : "Never logged in"}
          </div>
        </div>
      ),
      sortable: true,
      width: "150px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <UserActionsDropdown
          onView={() => onView(row)}
          onEdit={() => onEdit(row)}
          onDelete={() => onDelete(row)}
        />
      ),
      ignoreRowClick: true,
      width: "70px",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      progressPending={loading}
      pagination
      paginationPerPage={10}
      paginationRowsPerPageOptions={[10, 25, 50]}
      highlightOnHover
      responsive
      customStyles={customStyles}
      noDataComponent={
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Users className="h-12 w-12 mb-4 opacity-30" />
          <div className="text-lg font-medium">No users found</div>
          <div className="text-sm">
            Try adjusting your search or filter criteria
          </div>
        </div>
      }
    />
  );
}
