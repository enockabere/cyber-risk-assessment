"use client";

import { useEffect, useState } from "react";
import { Users, User, Shield, UserPlus, Plus, Download } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserStatsCard } from "@/app/components/users/UserStatsCard";
import { UserTable } from "@/app/components/users/UserTable";

import {
  showUserViewModal,
  showUserEditModal,
} from "@/app/components/users/UserModals";
import { AppUser } from "@/app/types/users";
import { useTopbar } from "@/app/context/TopbarContext";
import { useBreadcrumbs } from "@/app/context/BreadcrumbContext";
import UserCreateModal from "@/app/components/users/UserCreateModal";
import Swal from "sweetalert2";

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  const { setTitle } = useTopbar();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    setTitle("User Management");
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Users", href: "/dashboard/admin/users" },
    ]);
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleEdit = (user: AppUser) => {
    showUserEditModal(user, async (updatedFields) => {
      try {
        const res = await fetch(`/api/users/${user.id}/edit`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFields),
        });

        if (!res.ok) throw new Error("Failed to update user");

        const updatedUser = await res.json();

        setUsers((prevUsers) => {
          const newUsers = prevUsers.map((u) =>
            u.id === updatedUser.id ? updatedUser : u
          );
          setFilteredUsers(newUsers);
          return newUsers;
        });

        Swal.fire("Success", "User updated successfully", "success");
      } catch (error) {
        console.error("Failed to update user:", error);
        Swal.fire("Error", "Failed to update user", "error");
      }
    });
  };

  const handleView = (user: AppUser) => {
    showUserViewModal(user);
  };

  const uniqueRoles = Array.from(new Set(users.map((user) => user.role)));

  return (
    <div className="p-9 rounded-md space-y-9 bg-white min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-gray-600">
              Manage and monitor all users in your system
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <UserStatsCard
          title="Total Users"
          value={users.length}
          description="All registered users"
          icon={Users}
          iconColor="indigo"
          bgColor="indigo"
          borderColor="indigo"
        />
        <UserStatsCard
          title="Active Users"
          value={users.filter((u) => u.status === "active").length}
          description="Currently active"
          icon={User}
          iconColor="emerald"
          bgColor="emerald"
          borderColor="emerald"
        />
        <UserStatsCard
          title="Admins"
          value={users.filter((u) => u.role === "admin").length}
          description="Admin privileges"
          icon={Shield}
          iconColor="amber"
          bgColor="amber"
          borderColor="amber"
        />
        <UserStatsCard
          title="New This Month"
          value={
            users.filter(
              (u) =>
                u.createdAt &&
                new Date(u.createdAt) >
                  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            ).length
          }
          description="Last 30 days"
          icon={UserPlus}
          iconColor="violet"
          bgColor="violet"
          borderColor="violet"
        />
      </div>
      {/* Main Table Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30">
              <User className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              All Users
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              size="sm"
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="px-6 py-3 bg-gray-50 border-b text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>

          <UserTable
            data={filteredUsers}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>
      <UserCreateModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={(newUser) => setUsers((prev) => [...prev, newUser])}
      />
    </div>
  );
}
