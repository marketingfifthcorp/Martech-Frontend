"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";

type TopBarProps = {
  title?: string;
  breadcrumb?: React.ReactNode;
  onToggleSidebar?: () => void;
  actionButton?: React.ReactNode;
};

export function TopBar({ title = "Dashboard", breadcrumb, onToggleSidebar, actionButton }: TopBarProps) {
  const api = useApi();
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef(api);
  apiRef.current = api;

  useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.classList.contains("dark"));
  }, []);

  // Poll unread count every 30s
  useEffect(() => {
    const fetch = () =>
      apiRef.current.notifications.unreadCount()
        .then(({ count }) => setUnreadCount(count))
        .catch(() => {});
    fetch();
    const iv = setInterval(fetch, 30_000);
    return () => clearInterval(iv);
  }, []);

  // Core fetch function — always uses the latest api via ref
  const fetchNotifications = () => {
    setNotifLoading(true);
    setNotifError(null);
    apiRef.current.notifications.list()
      .then((list) => {
        setNotifications(list);
        setNotifLoading(false);
      })
      .catch((err) => {
        console.error("[Notifications] list failed:", err);
        setNotifError(err?.message ?? "Failed to load");
        setNotifLoading(false);
      });
  };

  // Fetch immediately when dropdown opens, then poll every 10s while open
  useEffect(() => {
    if (!notifOpen) return;
    fetchNotifications();
    const iv = setInterval(fetchNotifications, 10_000);
    return () => clearInterval(iv);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifOpen]);

  // Re-fetch if count bumps while dropdown is already open
  useEffect(() => {
    if (notifOpen && unreadCount > 0) fetchNotifications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unreadCount]);

  // Close on outside click
  useEffect(() => {
    function handleOut(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleOut);
    return () => document.removeEventListener("mousedown", handleOut);
  }, []);

  function toggleTheme() {
    const html = document.documentElement;
    const goLight = html.classList.contains("dark");
    html.classList.toggle("dark", !goLight);
    html.classList.toggle("light", goLight);
    setIsDark(!goLight);
  }

  async function markAllRead() {
    try {
      await apiRef.current.notifications.markAllRead();
      setNotifications((p) => p.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  }

  async function clickNotif(n: any) {
    if (!n.isRead) {
      try {
        await apiRef.current.notifications.markRead(n.id);
        setNotifications((p) => p.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {}
    }
    setNotifOpen(false);
    if (n.link) router.push(n.link);
  }

  const ICON: Record<string, string> = {
    strategy_ready: "ti-flag",
    post_approved: "ti-circle-check",
    revision_requested: "ti-refresh",
    calendar_ready: "ti-calendar",
  };

  return (
    <div className="tb">
      {/* Left: hamburger + page title */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={onToggleSidebar}
          className="gb gbg"
          style={{ width: 32, height: 32, padding: 0, justifyContent: "center", borderRadius: 8, flexShrink: 0 }}
          aria-label="Toggle sidebar"
        >
          <i className="ti ti-menu-2" style={{ fontSize: 15 }} />
        </button>
        <div>
          <div className="pgt">{title}</div>
          {breadcrumb && <div className="pgb">{breadcrumb}</div>}
        </div>
      </div>

      {/* Right: action button + notifications + theme */}
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        {actionButton}

        {/* Notifications */}
        <div style={{ position: "relative" }} ref={dropRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="gb gbg"
            style={{ width: 32, height: 32, padding: 0, justifyContent: "center", borderRadius: 8, position: "relative" }}
          >
            <i className="ti ti-bell" style={{ fontSize: 14 }} />
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: 4, right: 4,
                minWidth: 14, height: 14, background: "var(--green)",
                color: "#000", borderRadius: "50%", fontSize: 8, fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center", padding: "0 2px",
              }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="dropdown-enter" style={{
              position: "absolute", right: 0, top: "calc(100% + 8px)",
              width: 320, background: "rgba(12,12,20,.97)", border: "1px solid rgba(255,255,255,.10)",
              borderRadius: 12, boxShadow: "0 24px 64px rgba(0,0,0,.55)", zIndex: 9999,
              backdropFilter: "blur(32px)", overflow: "hidden",
            }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 12, fontWeight: 400, color: "#e8e8f0" }}>Notifications</span>
                  {notifLoading && (
                    <span style={{ display: "inline-block", width: 10, height: 10, border: "1.5px solid var(--gbb)", borderTopColor: "var(--green)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} style={{ fontSize: 9, color: "var(--green)", background: "none", border: "none", cursor: "pointer", letterSpacing: ".06em", textTransform: "uppercase", fontFamily: "Inter,system-ui" }}>
                      Mark all read
                    </button>
                  )}
                  <button onClick={fetchNotifications} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b6b80", padding: 0, lineHeight: 1 }} title="Refresh">
                    <i className="ti ti-refresh" style={{ fontSize: 11 }} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div style={{ maxHeight: 340, overflowY: "auto" }}>
                {notifError ? (
                  <div style={{ padding: "24px 14px", textAlign: "center" }}>
                    <i className="ti ti-alert-triangle" style={{ fontSize: 22, color: "var(--amber)", display: "block", marginBottom: 8 }} />
                    <div style={{ fontSize: 11, color: "#ababbc", marginBottom: 10 }}>{notifError}</div>
                    <button className="gb gbs" onClick={fetchNotifications}>Retry</button>
                  </div>
                ) : notifLoading && notifications.length === 0 ? (
                  <div style={{ padding: "36px 14px", textAlign: "center" }}>
                    <span style={{ display: "inline-block", width: 22, height: 22, border: "2px solid var(--gbb)", borderTopColor: "var(--green)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  </div>
                ) : notifications.length === 0 ? (
                  <div style={{ padding: "32px 14px", textAlign: "center", fontSize: 11, color: "#6b6b80" }}>
                    <i className="ti ti-bell-off" style={{ fontSize: 24, display: "block", marginBottom: 8 }} />
                    All caught up
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => clickNotif(n)}
                      style={{
                        width: "100%", textAlign: "left", padding: "12px 14px",
                        display: "flex", alignItems: "flex-start", gap: 10,
                        background: !n.isRead ? "rgba(52,217,123,.07)" : "transparent",
                        border: "none", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,.05)",
                        fontFamily: "Inter,system-ui",
                      }}
                    >
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(52,217,123,.12)", border: "1px solid rgba(52,217,123,.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <i className={`ti ${ICON[n.type] ?? "ti-bell"}`} style={{ fontSize: 12, color: "var(--green)" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 400, color: "#e8e8f0", marginBottom: 3 }}>{n.title}</div>
                        <div style={{ fontSize: 10, color: "#ababbc", lineHeight: 1.55 }}>{n.message}</div>
                        <div style={{ fontSize: 9, color: "#6b6b80", marginTop: 5 }}>
                          {new Date(n.createdAt).toLocaleString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      {!n.isRead && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", flexShrink: 0, marginTop: 5 }} />}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <div className="tt" onClick={toggleTheme}>
          <span className="ttl">{isDark ? "Dark" : "Light"}</span>
          <div className="ttk">
            <i className={`ti ${isDark ? "ti-moon" : "ti-sun"}`} style={{ fontSize: 11 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
