import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  uniqueRoles: string[];
}

export function UserFilters({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  uniqueRoles,
}: UserFiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 w-full">
      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
        <Input
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400"
        />
      </div>

      {/* Role Filter */}
      <Select value={roleFilter} onValueChange={onRoleFilterChange}>
        <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 dark:focus:ring-indigo-400">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
          <SelectItem
            value="all"
            className="hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-indigo-50 dark:focus:bg-indigo-900/30"
          >
            All Roles
          </SelectItem>
          {uniqueRoles.map((role) => (
            <SelectItem
              key={role}
              value={role}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-indigo-50 dark:focus:bg-indigo-900/30"
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
