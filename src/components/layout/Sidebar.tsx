"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";

type NavItem = { href: string; label: string; icon: string };

const ADMIN_PRIMARY: NavItem[] = [
  { href: "/dashboard",        label: "Dashboard",    icon: "ti-layout-dashboard" },
  { href: "/clients",          label: "Clients",      icon: "ti-users" },
  { href: "/content-calendar", label: "Calendars",    icon: "ti-calendar" },
  { href: "/analytics",        label: "Analytics",    icon: "ti-chart-bar" },
];
const ADMIN_WORKFLOW: NavItem[] = [
  { href: "/design-queue", label: "Design queue", icon: "ti-photo" },
  { href: "/publishing",   label: "Publishing",   icon: "ti-send" },
];
const ADMIN_AGENCY: NavItem[] = [
  { href: "/team",     label: "Team",     icon: "ti-user-plus" },
  { href: "/settings", label: "Settings", icon: "ti-settings" },
];

const DESIGNER_NAV: NavItem[] = [
  { href: "/designer", label: "Design workspace", icon: "ti-photo" },
];
const DESIGNER_SECONDARY: NavItem[] = [
  { href: "/settings", label: "Settings", icon: "ti-settings" },
];

type SidebarProps = {
  collapsed?: boolean;
  onToggle?: () => void;
};

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const api = useApi();
  const [user, setUser] = useState<any>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    api.users.me().then(setUser).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/" && href !== "/dashboard" && pathname?.startsWith(href)) ||
    (href === "/dashboard" && pathname === "/dashboard");

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "AA"
    : "AA";

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
    : "Loading…";

  const role: string = user?.role ?? "ADMIN";

  const renderNav = (items: NavItem[]) =>
    items.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className={`ni${isActive(item.href) ? " act" : ""}`}
      >
        <i className={`ti ${item.icon}`} />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    ));

  return (
    <aside
      style={{
        width: collapsed ? 52 : 196,
        minWidth: collapsed ? 52 : 196,
        height: "100%",
        background: "var(--sb)",
        borderRight: "1px solid var(--sb-b)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "relative",
        zIndex: 10,
        backdropFilter: "blur(24px)",
        transition: "width .25s ease, min-width .25s ease",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        onClick={onToggle}
        style={{
          padding: "22px 18px 16px",
          borderBottom: "1px solid var(--sb-b)",
          cursor: "pointer",
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        {!collapsed ? (
          <>
            <div style={{ fontSize: 16, fontWeight: 300, letterSpacing: ".28em", color: "var(--green)", whiteSpace: "nowrap" }}>
              ZŸR
            </div>
            <div style={{ fontSize: 9, color: "var(--t4)", letterSpacing: ".14em", marginTop: 2, fontWeight: 300, whiteSpace: "nowrap" }}>
              Marketing OS
            </div>
          </>
        ) : (
          <div style={{ fontSize: 14, fontWeight: 300, letterSpacing: ".28em", color: "var(--green)", textAlign: "center" }}>
            Z
          </div>
        )}
      </div>

      {/* Nav — role-filtered */}
      <div style={{ padding: collapsed ? "8px 4px" : "8px 6px", flex: 1, overflowY: "auto" }}>
        {role === "DESIGNER" ? (
          <>
            {!collapsed && <div className="ns">Workspace</div>}
            {renderNav(DESIGNER_NAV)}
            {!collapsed && <div className="ns">Account</div>}
            {renderNav(DESIGNER_SECONDARY)}
          </>
        ) : (
          <>
            {renderNav(ADMIN_PRIMARY)}
            {!collapsed && <div className="ns">Workflow</div>}
            {renderNav(ADMIN_WORKFLOW)}
            {!collapsed && <div className="ns">Agency</div>}
            {renderNav(ADMIN_AGENCY)}
          </>
        )}
      </div>

      {/* User + Logout */}
      <div style={{ padding: "10px 6px", borderTop: "1px solid var(--sb-b)", flexShrink: 0 }}>
        <div className="ur" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
            <div className="av" style={{ flexShrink: 0 }}>{initials}</div>
            {!collapsed && (
              <div style={{ minWidth: 0 }}>
                <div className="un" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</div>
                <div className="uro">{role === "DESIGNER" ? "Designer" : role === "CLIENT" ? "Client" : "Admin"}</div>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={async () => {
                setSigningOut(true);
                await signOut();
                router.replace("/login");
              }}
              disabled={signingOut}
              title="Sign out"
              style={{
                width: 28, height: 28, borderRadius: 7, border: "1px solid var(--fi-b)",
                background: "transparent", color: "var(--t4)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all .15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--red)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--rbb)"; (e.currentTarget as HTMLButtonElement).style.background = "var(--rb)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--t4)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--fi-b)"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              {signingOut
                ? <i className="ti ti-loader-2" style={{ fontSize: 12, animation: "spin 1s linear infinite" }} />
                : <i className="ti ti-logout" style={{ fontSize: 12 }} />}
            </button>
          )}
        </div>
        {/* Collapsed state: just show a logout icon */}
        {collapsed && (
          <button
            onClick={async () => { setSigningOut(true); await signOut(); router.replace("/login"); }}
            disabled={signingOut}
            title="Sign out"
            style={{ width: "100%", marginTop: 4, height: 28, borderRadius: 7, border: "1px solid transparent", background: "transparent", color: "var(--t4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--red)"; (e.currentTarget as HTMLButtonElement).style.background = "var(--rb)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--t4)"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            <i className="ti ti-logout" style={{ fontSize: 13 }} />
          </button>
        )}
      </div>
    </aside>
  );
}
