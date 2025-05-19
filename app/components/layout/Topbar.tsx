"use client";

import { useSession, signOut } from "next-auth/react";
import { UserCircle, School, ChevronDown, LogOut, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Topbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const user = session?.user;
  const role = user?.role || "Unknown";

  // Handle hover events
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 300);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <header className="w-full bg-gradient-to-r from-indigo-50 to-white border-b border-indigo-100 px-6 py-4 flex items-center justify-between shadow-sm">
      <h1 className="text-2xl font-bold text-indigo-900 tracking-tight">
        Dashboard
      </h1>
      <div className="relative">
        <div
          className="group flex items-center space-x-2"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="button"
          aria-haspopup="true"
          aria-expanded={isOpen}
          tabIndex={0}
          onFocus={handleMouseEnter}
          onBlur={handleMouseLeave}
        >
          {role.toLowerCase() === "respondent" && (
            <School className="w-5 h-5 text-indigo-600 group-hover:text-indigo-800 transition-colors" />
          )}
          <div className="relative flex items-center">
            <UserCircle className="w-9 h-9 text-indigo-500 group-hover:text-indigo-700 transition-colors" />
            <ChevronDown className="w-4 h-4 ml-1 text-indigo-500 group-hover:text-indigo-700 transition-transform group-hover:rotate-180" />
          </div>
        </div>

        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-64 bg-white shadow-xl border border-indigo-100 rounded-lg z-50 opacity-0 animate-fadeIn transition-opacity duration-200"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="px-5 py-4 border-b border-indigo-100 bg-indigo-50 rounded-t-lg">
              <p className="text-sm font-semibold text-indigo-900">
                {user?.name || user?.email}
              </p>
              <p className="text-xs text-indigo-600 truncate">{user?.email}</p>
              <span className="mt-2 inline-block px-3 py-1 text-xs font-medium bg-indigo-200 text-indigo-800 rounded-full">
                {role}
              </span>
            </div>
            <ul className="py-2 text-sm text-indigo-900">
              <li>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center px-5 py-2 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left flex items-center px-5 py-2 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </header>
  );
}
