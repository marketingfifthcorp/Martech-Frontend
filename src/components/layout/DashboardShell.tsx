"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

type DashboardShellProps = {
  children: React.ReactNode;
  searchPlaceholder?: string;
  contextLabel?: string;
};

export function DashboardShell({
  children,
  searchPlaceholder,
  contextLabel,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="lg:ml-64 min-h-screen">
        <TopBar
          searchPlaceholder={searchPlaceholder}
          contextLabel={contextLabel}
          onMenuClick={() => setSidebarOpen((v) => !v)}
        />
        <div className="pt-16">{children}</div>
      </main>

      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-secondary-container/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
    </>
  );
}
