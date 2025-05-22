import Topbar from "../components/layout/Topbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import { TopbarProvider } from "../context/TopbarContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TopbarProvider>
      <div className="flex h-screen overflow-hidden bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1 w-full">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
          <Footer />
        </div>
      </div>
    </TopbarProvider>
  );
}
