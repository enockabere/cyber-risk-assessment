"use client";

import { usePageLoader } from "@/app/context/PageLoaderContext";
import { Loader } from "lucide-react";

export default function PageLoader() {
  const { isLoading } = usePageLoader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
      <Loader className="h-8 w-8 animate-spin text-indigo-600" />
    </div>
  );
}
