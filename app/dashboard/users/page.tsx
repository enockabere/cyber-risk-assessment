"use client";

import { useEffect, useState } from "react";
import { Users, User, Shield, UserPlus, Plus, Download } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserStatsCard } from "@/app/components/users/UserStatsCard";
import { UserTable } from "@/app/components/users/UserTable";
import { UserFilters } from "@/app/components/users/UserFilters";
import {
  showUserViewModal,
  showUserEditModal,
  showUserDeleteModal,
} from "@/app/components/users/UserModals";
import { AppUser } from "@/app/types/users";
import { useTopbar } from "@/app/context/TopbarContext";

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const { setTitle } = useTopbar();

  useEffect(() => {
    setTitle("User Management");
  }, [setTitle]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        const enhancedData = data.map((user: AppUser) => ({
          ...user,
          status:
            Math.random() > 0.2
              ? "active"
              : Math.random() > 0.5
              ? "inactive"
              : "pending",
          createdAt: new Date(
            Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
          ).toISOString(),
          lastLogin:
            Math.random() > 0.3
              ? new Date(
                  Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
                ).toISOString()
              : null,
        }));

        setUsers(enhancedData);
        setFilteredUsers(enhancedData);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  const handleEdit = (user: AppUser) => {
    showUserEditModal(user, (updatedUser) => {
      setUsers(
        users.map((u) => (u.id === user.id ? { ...u, ...updatedUser } : u))
      );
    });
  };

  const handleDelete = (user: AppUser) => {
    showUserDeleteModal(user, () => {
      setUsers(users.filter((u) => u.id !== user.id));
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
          <Users className="h-5 w-5 text-indigo-600" />
          <div>
            <p className="text-gray-600">
              Manage and monitor all users in your system
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
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
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
              <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              All Users
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm hover:shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <UserFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            uniqueRoles={uniqueRoles}
          />

          {/* Results Info */}
          <div className="px-6 py-3 bg-gray-50 border-b text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>

          <UserTable
            data={filteredUsers}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
