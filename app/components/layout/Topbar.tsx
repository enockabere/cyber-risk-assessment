"use client";

import { useSession, signOut } from "next-auth/react";
import { useTopbar } from "@/app/context/TopbarContext";
import { UserCircle, School, ChevronDown, LogOut, User } from "lucide-react";
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
  const { data: session } = useSession();
  const user = session?.user;
  const role = user?.role || "Unknown";

  return (
    <header className="w-full bg-gradient-to-r from-indigo-50 to-white border-b border-indigo-100 px-6 py-4 flex items-center justify-between shadow-sm">
      <h1 className="text-2xl font-bold text-indigo-900 tracking-tight">
        {title}
      </h1>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
          {role.toLowerCase() === "respondent" && (
            <School className="w-5 h-5 text-indigo-600" />
          )}
          <UserCircle className="w-8 h-8 text-indigo-500" />
          <ChevronDown className="w-4 h-4 text-indigo-500" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>
            <div className="text-sm font-medium text-indigo-900">
              {user?.name || user?.email}
            </div>
            <div className="text-xs text-indigo-600 truncate">
              {user?.email}
            </div>
            <span className="inline-block mt-2 px-2 py-0.5 text-xs font-semibold bg-indigo-200 text-indigo-800 rounded">
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
