"use client";

import { useSession, signOut } from "next-auth/react";
import { useTopbar } from "@/app/context/TopbarContext";
import { useBreadcrumbs } from "@/app/context/BreadcrumbContext";
import {
  UserCircle,
  School,
  ChevronDown,
  LogOut,
  User,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Topbar() {
  const { title } = useTopbar();
  const { breadcrumbs } = useBreadcrumbs(); // ✅ FIXED: get breadcrumbs from context
  const { data: session } = useSession();
  const user = session?.user;
  const role = user?.role || "Unknown";

  return (
    <header className="w-full bg-gradient-to-r from-green-50 to-white border-b border-green-100 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Title & Breadcrumbs */}
      <div className="flex flex-col gap-1">
        <h4 className="text-2xl font-bold text-green-900 tracking-tight">
          {title}
        </h4>
        <nav className="flex items-center text-sm text-gray-500">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:underline text-green-600 hover:text-green-800"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-600">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
          {role.toLowerCase() === "respondent" && (
            <School className="w-5 h-5 text-green-600" />
          )}
          <UserCircle className="w-8 h-8 text-green-500" />
          <ChevronDown className="w-4 h-4 text-green-500" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>
            <div className="text-sm font-medium text-green-900">
              {user?.name || user?.email}
            </div>
            <div className="text-xs text-green-600 truncate">{user?.email}</div>
            <span className="inline-block mt-2 px-2 py-0.5 text-xs font-semibold bg-green-200 text-green-800 rounded">
              {role}
            </span>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
