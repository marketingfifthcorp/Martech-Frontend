"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

type DashboardShellProps = {
  children: React.ReactNode;
  title?: string;
  /** @deprecated use title instead */
  contextLabel?: string;
  breadcrumb?: React.ReactNode;
  actionButton?: React.ReactNode;
};

export function DashboardShell({
  children,
  title,
  contextLabel,
  breadcrumb,
  actionButton,
}: DashboardShellProps) {
  const pageTitle = title ?? contextLabel;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Ambient orb decorations */}
      <div style={{ position: "absolute", top: -80, right: -60, width: 320, height: 320, background: "radial-gradient(circle,var(--orb1),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: -60, left: 80, width: 280, height: 280, background: "radial-gradient(circle,var(--orb2),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      <div style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0, position: "relative", zIndex: 1 }}>
        <TopBar
          title={pageTitle}
          breadcrumb={breadcrumb}
          actionButton={actionButton}
          onToggleSidebar={() => setCollapsed((v) => !v)}
        />
        {children}
      </div>
    </div>
  );
}
