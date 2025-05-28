"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  LayoutDashboard,
  ShieldCheck,
  FileBarChart2,
  ScrollText,
  UsersRound,
  LogOut,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { usePageLoader } from "@/app/context/PageLoaderContext";
import { signOut, useSession } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { showLoader } = usePageLoader();
  const { data: session } = useSession();

  const handleNavClick = (href: string) => {
    if (pathname !== href) {
      showLoader();
      router.push(href);
    }
  };

  const isAdmin =
    session?.user?.role === "ADMIN" ||
    session?.user?.email === "abereenock95@gmail.com";

  const isRespondent = session?.user?.role === "RESPONDENT";

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64 p-4 space-y-2">
      <div className="text-xl font-bold text-green-600 px-2">CRAP</div>

      <nav className="flex-1 flex flex-col space-y-1 mt-6">
        {/* Dashboard */}
        <button
          onClick={() => handleNavClick("/dashboard")}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full text-left transition ${
            pathname === "/dashboard"
              ? "bg-green-100 text-green-700 font-semibold"
              : "text-gray-700 hover:bg-green-50 hover:text-green-600"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>

        {/* Risk Assessment */}
        {isRespondent && (
          <button
            onClick={() => handleNavClick("/dashboard/assessment")}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full text-left transition ${
              pathname.startsWith("/dashboard/assessment") ||
              pathname === "/dashboard/questions"
                ? "bg-green-100 text-green-700 font-semibold"
                : "text-gray-700 hover:bg-green-50 hover:text-green-600"
            }`}
          >
            <ScrollText className="w-4 h-4" />
            Risk Assessment
          </button>
        )}

        {/* Assessment Results */}
        {isRespondent && (
          <button
            onClick={() => handleNavClick("/dashboard/responses")}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full text-left transition ${
              pathname.startsWith("/dashboard/responses")
                ? "bg-green-100 text-green-700 font-semibold"
                : "text-gray-700 hover:bg-green-50 hover:text-green-600"
            }`}
          >
            <FileBarChart2 className="w-4 h-4" />
            Assessment Results
          </button>
        )}

        {/* Admin-only links */}
        {isAdmin && (
          <>
            <button
              onClick={() => handleNavClick("/dashboard/admin/background")}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full text-left transition ${
                pathname.startsWith("/dashboard/admin/background")
                  ? "bg-green-100 text-green-700 font-semibold"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Risk Descriptions
            </button>

            <button
              onClick={() => handleNavClick("/dashboard/admin/users")}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full text-left transition ${
                pathname.startsWith("/dashboard/admin/users")
                  ? "bg-green-100 text-green-700 font-semibold"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              <UsersRound className="w-4 h-4" />
              User Management
            </button>
          </>
        )}
      </nav>

      {session?.user && (
        <div className="flex items-center gap-3 mt-4 px-3 py-2 rounded-md bg-gray-100">
          <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold uppercase">
            {session.user.name?.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 truncate">
              {session.user.name}
            </span>
            <span className="text-xs text-gray-500 truncate">
              {/* {session.user.email} */}
              nairobiuniversity@ac.ke
            </span>
          </div>
        </div>
      )}

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
