"use client";

import Topbar from "../components/layout/Topbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import PageLoader from "../components/layout/PageLoader";

import { TopbarProvider } from "../context/TopbarContext";
import { BreadcrumbProvider } from "@/app/context/BreadcrumbContext";
import { PageLoaderProvider } from "../context/PageLoaderContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageLoaderProvider>
      <TopbarProvider>
        <BreadcrumbProvider>
          <div className="flex h-screen overflow-hidden bg-gray-100">
            <Sidebar />
            <div className="flex flex-col flex-1 w-full relative">
              <Topbar />
              <PageLoader />
              <main className="flex-1 overflow-y-auto p-6">{children}</main>
              <Footer />
            </div>
          </div>
        </BreadcrumbProvider>
      </TopbarProvider>
    </PageLoaderProvider>
  );
}
