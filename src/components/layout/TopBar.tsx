"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useApi } from "@/hooks/useApi";

type TopBarProps = {
  searchPlaceholder?: string;
  contextLabel?: string;
};

const TYPE_ICON: Record<string, string> = {
  strategy_ready: "auto_awesome",
  approval_needed: "pending_actions",
  post_approved: "check_circle",
  published: "public",
  revision_requested: "edit_note",
};

export function TopBar({
  searchPlaceholder = "Search clients or campaigns...",
  contextLabel = "All Clients",
}: TopBarProps) {
  const api = useApi();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const [me, { count }] = await Promise.all([
          api.users.me(),
          api.notifications.unreadCount(),
        ]);
        setUser(me);
        setUnreadCount(count);
      } catch {}
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const items = await api.notifications.list();
        setNotifications(items);
      } catch {}
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleMarkAllRead() {
    try {
      await api.notifications.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  }

  async function handleClickNotification(n: any) {
    if (!n.isRead) {
      try {
        await api.notifications.markRead(n.id);
        setNotifications((prev) =>
          prev.map((item) => item.id === n.id ? { ...item, isRead: true } : item)
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {}
    }
    setOpen(false);
    if (n.link) router.push(n.link);
  }

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
    : "—";
  const displayRole = user?.role || "";

  return (
    <header className="fixed top-0 right-0 left-64 z-30 h-16 bg-white/80 glass-nav px-8 flex justify-between items-center shadow-sm shadow-emerald-900/5">
      <div className="flex items-center flex-1 max-w-2xl">
        <div className="relative w-full max-w-md">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-xl text-sm focus:ring-1 focus:ring-primary transition-all"
            placeholder={searchPlaceholder}
            type="text"
          />
        </div>
        <div className="ml-6 h-8 w-px bg-outline-variant/30" />
        <button className="ml-6 flex items-center space-x-2 text-emerald-900 font-headline font-semibold text-sm hover:opacity-70 transition-opacity">
          <span>{contextLabel}</span>
          <Icon name="expand_more" className="text-sm" />
        </button>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4">

          {/* Notification bell */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="p-2 text-stone-500 hover:bg-emerald-50/50 rounded-full transition-colors relative"
            >
              <Icon name="notifications" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-primary text-white rounded-full text-[9px] font-bold flex items-center justify-center px-0.5 border-2 border-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-outline-variant/10 overflow-hidden z-50">
                <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant/10">
                  <span className="font-headline font-bold text-sm text-on-surface">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-70 transition-opacity"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/10">
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center">
                      <Icon name="notifications_none" className="text-3xl text-on-surface-variant/30 mb-2" />
                      <p className="text-xs text-on-surface-variant">All caught up!</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleClickNotification(n)}
                        className={`w-full text-left px-5 py-3.5 flex items-start gap-3 hover:bg-surface-container-low transition-colors ${
                          !n.isRead ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          !n.isRead ? "bg-primary/10 text-primary" : "bg-surface-container text-on-surface-variant"
                        }`}>
                          <Icon name={TYPE_ICON[n.type] || "circle_notifications"} className="text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold leading-tight mb-0.5 ${!n.isRead ? "text-on-surface" : "text-on-surface-variant"}`}>
                            {n.title}
                          </p>
                          <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-2">
                            {n.message}
                          </p>
                          <p className="text-[10px] text-stone-400 mt-1">
                            {new Date(n.createdAt).toLocaleDateString("en", {
                              month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Settings link */}
          <Link
            href="/settings"
            className="p-2 text-stone-500 hover:bg-emerald-50/50 rounded-full transition-colors"
          >
            <Icon name="settings" />
          </Link>
        </div>

        {/* User info */}
        <div className="flex items-center space-x-3 pl-6 border-l border-outline-variant/30">
          <div className="text-right">
            <p className="text-xs font-bold font-headline tracking-tight text-emerald-900">
              {displayName}
            </p>
            <p className="text-[10px] text-stone-500 font-label uppercase tracking-widest">
              {displayRole}
            </p>
          </div>
          {user?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={displayName}
              className="w-9 h-9 rounded-full object-cover border border-emerald-900/10"
              src={user.avatarUrl}
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-headline font-bold text-sm">
              {displayName.charAt(0) || "A"}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
