"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  ListChecks,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { usePageLoader } from "@/app/context/PageLoaderContext";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { showLoader } = usePageLoader();

  const [expandedMenu, setExpandedMenu] = useState<string | null>(
    pathname.startsWith("/dashboard/admin/questionnaire")
      ? "questionnaire"
      : null
  );

  const handleNavClick = (href: string) => {
    if (pathname !== href) {
      showLoader();
      router.push(href);
    }
  };

  const toggleMenu = (menu: string) => {
    setExpandedMenu((prev) => (prev === menu ? null : menu));
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64 p-4 space-y-2">
      <div className="text-xl font-bold text-indigo-600 px-2">CRAP</div>

      <nav className="flex-1 flex flex-col space-y-1 mt-6">
        {/* Dashboard */}
        <button
          onClick={() => handleNavClick("/dashboard")}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full text-left transition ${
            pathname === "/dashboard"
              ? "bg-indigo-100 text-indigo-700 font-semibold"
              : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>

        {/* User Management */}
        <button
          onClick={() => handleNavClick("/dashboard/admin/users")}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full text-left transition ${
            pathname.startsWith("/dashboard/admin/users")
              ? "bg-indigo-100 text-indigo-700 font-semibold"
              : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
          }`}
        >
          <Users className="w-4 h-4" />
          User Management
        </button>
        <button
          onClick={() => toggleMenu("questionnaire")}
          className="flex items-center justify-between px-3 py-2 rounded-md text-sm w-full text-left text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
        >
          <span className="flex items-center gap-3">
            <ListChecks className="w-4 h-4" />
            Risk Descriptions
          </span>
          {expandedMenu === "questionnaire" ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedMenu === "questionnaire" && (
          <div className="pl-8 flex flex-col space-y-1">
            <button
              onClick={() =>
                handleNavClick("/dashboard/admin/questionnaire/create")
              }
              className={`text-sm px-3 py-2 rounded-md text-left transition ${
                pathname.startsWith("/dashboard/admin/questionnaire/create")
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              Create
            </button>
          </div>
        )}
      </nav>

      {/* Logout */}
      <Button
        variant="ghost"
        className="text-red-500 hover:bg-red-100 justify-start"
        onClick={() => {
          showLoader();
          signOut({ callbackUrl: "/" });
        }}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block">
        <SidebarContent />
      </aside>
    </>
  );
}
