"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Icon } from "@/components/ui/Icon";
import { useApi } from "@/hooks/useApi";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { useToast } from "@/components/ui/Toast";

const ROLES = ["ADMIN", "DESIGNER", "CLIENT"];

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: "camera",     color: "from-rose-500 to-pink-600" },
  { id: "linkedin",  label: "LinkedIn",  icon: "work",       color: "from-blue-600 to-blue-700" },
  { id: "tiktok",    label: "TikTok",    icon: "music_video",color: "from-stone-900 to-stone-800" },
  { id: "x",         label: "X",         icon: "tag",        color: "from-stone-700 to-stone-900" },
];

// Map platform ID → social-auth platform key
const PLATFORM_AUTH_KEY: Record<string, string> = {
  instagram: "meta",
  linkedin:  "linkedin",
  tiktok:    "tiktok",
  x:         "x",
};

function SettingsInner() {
  const api = useApi();
  const toast = useToast();
  const searchParams = useSearchParams();
  const { checking, user: me } = useRoleGuard(["ADMIN", "DESIGNER", "CLIENT"]);

  // Tab
  const defaultTab = searchParams.get("tab") as "team" | "profile" | "platforms" || "team";
  const [activeTab, setActiveTab] = useState<"team" | "profile" | "platforms">(defaultTab);

  // OAuth feedback from callback redirect
  const connectedPlatform = searchParams.get("connected");
  const errorPlatform     = searchParams.get("error");
  const errorMsg          = searchParams.get("msg");

  // Team tab
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  // Platform tab
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [connections, setConnections] = useState<any[]>([]);
  const [loadingConnections, setLoadingConnections] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const isAdmin = me?.role === "ADMIN";

  // ── Initial data load ──────────────────────────────────────
  useEffect(() => {
    if (checking) return;

    (async () => {
      if (isAdmin) {
        try {
          const [usersData, clientsData] = await Promise.all([
            api.users.list(),
            api.clients.list(),
          ]);
          setUsers(usersData);
          setClients(clientsData);
          if (clientsData.length > 0) setSelectedClientId(clientsData[0].id);
        } catch (e) { console.error(e); }
        setLoadingUsers(false);
      } else {
        // CLIENT/DESIGNER: fetch their own client record
        try {
          const clientsData = await api.clients.list();
          if (clientsData.length > 0) {
            setClients(clientsData);
            setSelectedClientId(clientsData[0].id);
          }
        } catch {}
        setLoadingUsers(false);
        setActiveTab("profile");
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking]);

  // ── Load connections when client or tab changes ────────────
  const loadConnections = useCallback(async (clientId: string) => {
    if (!clientId) return;
    setLoadingConnections(true);
    try {
      const data = await api.socialAuth.listConnections(clientId);
      setConnections(data);
    } catch {} finally {
      setLoadingConnections(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === "platforms" && selectedClientId) {
      loadConnections(selectedClientId);
    }
  }, [activeTab, selectedClientId, loadConnections]);

  // ── Role management ────────────────────────────────────────
  async function handleRoleChange(userId: string, role: string) {
    setUpdatingRole(userId);
    try {
      const updated = await api.users.updateRole(userId, role);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u)));
    } catch (e: any) {
      toast.error("Error", e.message);
    } finally {
      setUpdatingRole(null);
    }
  }

  // ── Platform connect ───────────────────────────────────────
  async function handleConnect(platformId: string) {
    if (!selectedClientId) return;
    const authKey = PLATFORM_AUTH_KEY[platformId];
    setConnectingPlatform(platformId);
    try {
      const { url } = await api.socialAuth.connectUrl(authKey, selectedClientId);
      window.location.href = url;
    } catch (e: any) {
      toast.error("Error", e.message);
      setConnectingPlatform(null);
    }
  }

  // ── Platform disconnect ────────────────────────────────────
  async function handleDisconnect(connectionId: string) {
    setDisconnecting(connectionId);
    try {
      await api.socialAuth.disconnect(connectionId, selectedClientId);
      setConnections((prev) => prev.filter((c) => c.id !== connectionId));
    } catch (e: any) {
      toast.error("Error", e.message);
    } finally {
      setDisconnecting(null);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = isAdmin
    ? [
        { id: "team",      label: "Team",      icon: "group"  },
        { id: "profile",   label: "Profile",   icon: "person" },
        { id: "platforms", label: "Platforms", icon: "share"  },
      ]
    : [
        { id: "profile",   label: "Profile",   icon: "person" },
        { id: "platforms", label: "Platforms", icon: "share"  },
      ];

  return (
    <DashboardShell contextLabel="Settings">
      <div className="p-8 md:p-12 max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <span className="text-[11px] uppercase tracking-[0.3em] text-primary font-semibold mb-2 block">
            Configuration
          </span>
          <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">
            Settings
          </h1>
        </div>

        {/* OAuth feedback banners */}
        {connectedPlatform && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <Icon name="check_circle" className="text-emerald-600" />
            <p className="text-sm font-semibold text-emerald-700 capitalize">
              {connectedPlatform} connected successfully!
            </p>
          </div>
        )}
        {errorPlatform && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
            <Icon name="error" className="text-red-500" />
            <div>
              <p className="text-sm font-semibold text-red-700">
                Failed to connect {errorPlatform}
              </p>
              {errorMsg && (
                <p className="text-xs text-red-600 mt-0.5">
                  {decodeURIComponent(errorMsg)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-surface-container-low rounded-xl p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold font-headline transition-all
                ${activeTab === tab.id
                  ? "bg-white text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"}`}
            >
              <Icon name={tab.icon} className="text-sm" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Team ── */}
        {activeTab === "team" && isAdmin && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-headline font-bold text-on-surface">Team Members</h2>
              <span className="text-xs text-on-surface-variant">{users.length} users</span>
            </div>

            {loadingUsers ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-surface-container-lowest rounded-xl p-5 animate-pulse h-20" />
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-16">
                <Icon name="group" className="text-5xl text-primary/20 mb-4" />
                <p className="text-on-surface-variant">No users yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((u) => {
                  const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email;
                  const isMe = u.id === me?.id;
                  return (
                    <div key={u.id} className="flex items-center gap-4 p-5 bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-headline font-bold text-sm shrink-0">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-headline font-bold text-sm text-on-surface">
                          {name}
                          {isMe && (
                            <span className="ml-2 text-[10px] font-normal text-primary bg-primary/10 px-2 py-0.5 rounded-full">you</span>
                          )}
                        </p>
                        <p className="text-xs text-on-surface-variant truncate">{u.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                          u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-surface-container text-on-surface-variant"
                        }`}>
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                        {isMe ? (
                          <span className="text-xs text-on-surface-variant px-3 py-2">{u.role}</span>
                        ) : (
                          <select
                            value={u.role}
                            disabled={updatingRole === u.id}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="text-xs bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2 font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 cursor-pointer"
                          >
                            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                          </select>
                        )}
                        {updatingRole === u.id && (
                          <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Profile ── */}
        {activeTab === "profile" && (
          <div className="max-w-lg space-y-6">
            <h2 className="text-xl font-headline font-bold text-on-surface mb-6">Your Profile</h2>
            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 shadow-sm">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-headline font-bold text-2xl">
                  {(([me?.firstName, me?.lastName].filter(Boolean).join(" ").charAt(0)) || me?.email?.charAt(0) || "?").toUpperCase()}
                </div>
                <div>
                  <p className="font-headline font-bold text-lg text-on-surface">
                    {[me?.firstName, me?.lastName].filter(Boolean).join(" ") || me?.email || "—"}
                  </p>
                  <p className="text-xs text-on-surface-variant">{me?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 bg-primary/10 text-primary rounded-full">
                    {me?.role}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "First Name", value: me?.firstName },
                  { label: "Last Name",  value: me?.lastName  },
                  { label: "Email",      value: me?.email     },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1.5 block">
                      {f.label}
                    </label>
                    <div className="px-4 py-3 bg-surface-container-low rounded-xl text-sm text-on-surface">
                      {f.value || "—"}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-on-surface-variant mt-6 flex items-center gap-1.5">
                <Icon name="info" className="text-sm" />
                Profile details are managed through your Clerk account.
              </p>
            </div>
          </div>
        )}

        {/* ── Platforms ── */}
        {activeTab === "platforms" && (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-headline font-bold text-on-surface mb-1">Social Accounts</h2>
              <p className="text-sm text-on-surface-variant">
                Connect client social accounts to enable automated publishing.
              </p>
            </div>

            {/* Client selector (ADMIN with multiple clients) */}
            {isAdmin && clients.length > 1 && (
              <div className="mb-6">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2 block">
                  Viewing accounts for
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-2.5 text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-[220px]"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            {!selectedClientId ? (
              <div className="text-center py-16">
                <Icon name="people" className="text-5xl text-primary/20 mb-4" />
                <p className="text-on-surface-variant">No client selected.</p>
              </div>
            ) : loadingConnections ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-surface-container-lowest rounded-2xl p-6 animate-pulse h-28" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {PLATFORMS.map((platform) => {
                  const connection = connections.find((c) => c.platform === platform.id);
                  const isConnected = !!connection;
                  const isConnecting = connectingPlatform === platform.id;
                  const isDisconnecting = disconnecting === connection?.id;

                  return (
                    <div
                      key={platform.id}
                      className={`p-6 rounded-2xl border transition-all ${
                        isConnected
                          ? "bg-surface-container-lowest border-emerald-200 shadow-sm"
                          : "bg-surface-container-lowest border-outline-variant/10 shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Platform icon */}
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center shrink-0`}>
                          <Icon name={platform.icon} className="text-white text-xl" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-headline font-bold text-sm text-on-surface">{platform.label}</p>
                            {isConnected && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Connected
                              </span>
                            )}
                          </div>

                          {isConnected ? (
                            <>
                              <p className="text-xs text-on-surface-variant truncate mb-3">
                                {connection.accountName || connection.accountId || "Account linked"}
                              </p>
                              {connection.tokenExpiry && (
                                <p className="text-[10px] text-stone-400 mb-3">
                                  Token expires: {new Date(connection.tokenExpiry).toLocaleDateString()}
                                </p>
                              )}
                              <button
                                onClick={() => handleDisconnect(connection.id)}
                                disabled={isDisconnecting}
                                className="text-[11px] font-bold text-stone-500 hover:text-red-500 transition-colors uppercase tracking-widest disabled:opacity-50"
                              >
                                {isDisconnecting ? "Disconnecting…" : "Disconnect"}
                              </button>
                            </>
                          ) : (
                            <>
                              <p className="text-xs text-on-surface-variant mb-3">Not connected</p>
                              <button
                                onClick={() => handleConnect(platform.id)}
                                disabled={isConnecting}
                                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-primary to-primary-container text-white text-[11px] font-bold font-headline uppercase tracking-widest rounded-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
                              >
                                {isConnecting ? (
                                  <>
                                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Redirecting…
                                  </>
                                ) : (
                                  <><Icon name="add_link" className="text-sm" /> Connect</>
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* How it works */}
            <div className="mt-8 p-5 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-3">How it works</p>
              <div className="space-y-2">
                {[
                  "Click Connect on any platform above",
                  "Log in and grant posting permissions on the platform's auth page",
                  "You'll be redirected back here with the account linked",
                  "Approved posts will publish automatically at their scheduled time",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-xs text-on-surface-variant">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface">
    <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

export default function SettingsPage() {
  return <Suspense fallback={<Spinner />}><SettingsInner /></Suspense>;
}
