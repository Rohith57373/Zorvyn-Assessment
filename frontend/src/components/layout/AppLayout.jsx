import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 lg:px-6">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="min-h-[calc(100vh-6.5rem)] rounded-[24px] border border-white/10 bg-slate-950/40 p-3 shadow-2xl shadow-slate-950/40 backdrop-blur sm:rounded-[28px] sm:p-4 xl:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
