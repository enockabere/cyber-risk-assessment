"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Settings, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { usePageLoader } from "@/app/context/PageLoaderContext";
import { signOut } from "next-auth/react";

const navLinks = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    href: "/dashboard/users",
    label: "User Management",
    icon: <Settings className="w-4 h-4" />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { showLoader } = usePageLoader();

  const handleNavClick = (href: string) => {
    if (pathname !== href) {
      showLoader();
      router.push(href);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64 p-4 space-y-2">
      <div className="text-xl font-bold text-indigo-600 px-2">CRAP</div>
      <nav className="flex-1 flex flex-col space-y-1 mt-6">
        {navLinks.map(({ href, label, icon }) => (
          <button
            key={href}
            onClick={() => handleNavClick(href)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition text-sm text-left w-full ${
              pathname === href
                ? "bg-indigo-100 text-indigo-700 font-semibold"
                : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </nav>

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
