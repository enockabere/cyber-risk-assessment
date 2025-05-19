import { LayoutDashboard, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full hidden md:block">
      <div className="p-6 font-bold text-lg text-indigo-600">CRAP</div>
      <nav className="flex flex-col space-y-1 px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        <button className="flex items-center gap-3 px-3 py-2 mt-10 text-sm text-red-500 hover:bg-red-50 rounded-md">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </nav>
    </aside>
  );
}
