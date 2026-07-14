"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useApi } from "@/hooks/useApi";
import { useRoleGuard } from "@/hooks/useRoleGuard";

const TODAY = new Date();
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const TABS = [
  { key: "strategy", label: "Strategy", icon: "ti-flag" },
  { key: "creative", label: "Creative approvals", icon: "ti-photo" },
  { key: "calendar", label: "Content calendar", icon: "ti-calendar" },
  { key: "reports", label: "Reports", icon: "ti-chart-bar" },
];

function ClientPortalLayout({ children, activeTab, onTabChange, user, isDark, onToggleTheme, onSignOut, signingOut }: any) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row", overflow: "hidden", background: "var(--bg)" }}>
      {/* Sidebar */}
      <div style={{ width: 220, minWidth: 220, height: "100%", background: "var(--sb)", borderRight: "1px solid var(--sb-b)", display: "flex", flexDirection: "column", flexShrink: 0, backdropFilter: "blur(24px)", position: "relative", zIndex: 10 }}>
        <div style={{ padding: "22px 18px 16px", borderBottom: "1px solid var(--sb-b)", userSelect: "none" }}>
          <div style={{ fontSize: 16, fontWeight: 300, letterSpacing: ".28em", color: "var(--green)" }}>ZŸR</div>
          <div style={{ fontSize: 9, color: "var(--t4)", letterSpacing: ".14em", marginTop: 2, fontWeight: 300 }}>Client Portal</div>
        </div>
        {/* Client badge */}
        <div style={{ padding: "10px 12px 8px" }}>
          <div style={{ background: "var(--gb)", border: "1px solid var(--gbb)", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--bb)", border: "1px solid var(--bbb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--blue)", fontWeight: 400, flexShrink: 0 }}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 400, color: "var(--t1)" }}>{user?.firstName ?? "Client"}</div>
                <div style={{ fontSize: 9, color: "var(--green)" }}>Active client</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: "8px 6px", flex: 1, overflowY: "auto" }}>
          {TABS.map((t) => (
            <div key={t.key} className={`ni${activeTab === t.key ? " act" : ""}`} onClick={() => onTabChange(t.key)} style={{ cursor: "pointer" }}>
              <i className={`ti ${t.icon}`} />
              <span>{t.label}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "10px 6px", borderTop: "1px solid var(--sb-b)" }}>
          <div className="ur" style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
              <div className="av">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
              <div style={{ minWidth: 0 }}>
                <div className="un" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {[user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Client"}
                </div>
                <div className="uro">Client</div>
              </div>
            </div>
            <button
              onClick={onSignOut}
              disabled={signingOut}
              title="Sign out"
              style={{
                width: 28, height: 28, borderRadius: 7, border: "1px solid var(--fi-b)",
                background: "transparent", color: "var(--t4)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all .15s",
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.color = "var(--red)"; b.style.borderColor = "var(--rbb)"; b.style.background = "var(--rb)";
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.color = "var(--t4)"; b.style.borderColor = "var(--fi-b)"; b.style.background = "transparent";
              }}
            >
              {signingOut
                ? <i className="ti ti-loader-2" style={{ fontSize: 12, animation: "spin 1s linear infinite" }} />
                : <i className="ti ti-logout" style={{ fontSize: 12 }} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Topbar */}
        <div className="tb">
          <div>
            <div className="pgt">{TABS.find((t) => t.key === activeTab)?.label ?? "Portal"}</div>
            <div className="pgb">June {TODAY.getFullYear()}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div className="tt" onClick={onToggleTheme}>
              <span className="ttl">{isDark ? "Dark" : "Light"}</span>
              <div className="ttk"><i className={`ti ${isDark ? "ti-moon" : "ti-sun"}`} style={{ fontSize: 11 }} /></div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function ClientPortalPage() {
  const api = useApi();
  const router = useRouter();
  const { signOut } = useClerk();
  const { checking, user } = useRoleGuard(["CLIENT", "ADMIN"]);
  const [activeTab, setActiveTab] = useState("strategy");
  const [isDark, setIsDark] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [strategy, setStrategy] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [strategyApproved, setStrategyApproved] = useState(false);
  const [approvedModal, setApprovedModal] = useState(false);
  const [revisionModal, setRevisionModal] = useState(false);
  const [revisionContext, setRevisionContext] = useState<"strategy" | "post">("strategy");
  const [revisionPost, setRevisionPost] = useState<any>(null);
  const [revisionComment, setRevisionComment] = useState("");
  const [creativeFilter, setCreativeFilter] = useState<"all" | "pending" | "approved">("all");
  const [portalClientId, setPortalClientId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    if (checking) return;
    (async () => {
      try {
        const me = await api.users.me();
        if (me.clientOf?.id) {
          setPortalClientId(me.clientOf.id);
          try { const strats = await api.strategy.listByClient(me.clientOf.id); if (strats.length) setStrategy(strats[0]); } catch {}
          try { setPosts(await api.posts.listByClient(me.clientOf.id)); } catch {}
        }
      } catch {}
      finally { setLoading(false); }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking]);

  useEffect(() => {
    if (activeTab !== "reports" || !portalClientId) return;
    let cancelled = false;
    (async () => {
      setAnalyticsLoading(true);
      try {
        const data = await api.analytics.get(portalClientId, "30d");
        if (!cancelled) setAnalytics(data);
      } catch {}
      finally { if (!cancelled) setAnalyticsLoading(false); }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, portalClientId]);

  function toggleTheme() {
    const html = document.documentElement;
    const goLight = html.classList.contains("dark");
    html.classList.toggle("dark", !goLight);
    html.classList.toggle("light", goLight);
    setIsDark(!goLight);
  }

  async function approveStrategy() {
    if (!strategy) return;
    try { await api.strategy.approve(strategy.id, "APPROVED", ""); } catch {}
    setStrategyApproved(true);
    setApprovedModal(true);
  }

  async function approvePost(post: any) {
    try { await api.posts.approve(post.id, "APPROVED", ""); setPosts((p) => p.map((x) => x.id === post.id ? { ...x, status: "APPROVED" } : x)); } catch {}
  }

  async function handleRevision() {
    if (revisionContext === "strategy" && strategy) {
      try {
        await api.strategy.approve(strategy.id, "CHANGES_REQUESTED", revisionComment);
        setStrategy((s: any) => ({ ...s, status: "CHANGES_REQUESTED" }));
      } catch {}
    } else if (revisionContext === "post" && revisionPost) {
      try {
        await api.posts.approve(revisionPost.id, "CHANGES_REQUESTED", revisionComment);
        setPosts((p) => p.map((x) => x.id === revisionPost.id ? { ...x, status: "REVISION_REQUIRED" } : x));
      } catch {}
    }
    setRevisionComment("");
    setRevisionPost(null);
    setRevisionModal(false);
  }

  if (checking || loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f1a" }}>
      <div style={{ width: 32, height: 32, border: "2px solid rgba(52,217,123,.2)", borderTopColor: "#34d97b", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    </div>
  );

  const pendingPosts = posts.filter((p) => p.status === "AWAITING_APPROVAL");

  return (
    <ClientPortalLayout
      activeTab={activeTab} onTabChange={setActiveTab}
      user={user} isDark={isDark} onToggleTheme={toggleTheme}
      signingOut={signingOut}
      onSignOut={async () => { setSigningOut(true); await signOut(); router.replace("/login"); }}
    >
      {/* ── Strategy ── */}
      {activeTab === "strategy" && (
        <div className="sa">
          {(strategyApproved || strategy?.status === "APPROVED") ? (
            <div style={{ background: "var(--gb)", border: "1px solid var(--gbb)", borderRadius: 12, padding: 16, marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <i className="ti ti-circle-check" style={{ fontSize: 24, color: "var(--green)" }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 400, color: "var(--green)" }}>Strategy approved</div>
                <div style={{ fontSize: 10, color: "var(--t3)", fontWeight: 300 }}>Your agency will proceed with the content calendar.</div>
              </div>
            </div>
          ) : strategy ? (
            <div style={{ background: "var(--gb)", border: "1px solid var(--gbb)", borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)" }} />
                <div style={{ fontSize: 12, fontWeight: 400, color: "var(--green)" }}>New strategy ready for your review</div>
                <div style={{ marginLeft: "auto", fontSize: 10, color: "var(--t4)" }}>{(() => {
                  const ts = strategy.updatedAt ?? strategy.createdAt;
                  if (!ts) return "";
                  const diff = Date.now() - new Date(ts).getTime();
                  const mins = Math.floor(diff / 60000);
                  const hrs  = Math.floor(diff / 3600000);
                  const days = Math.floor(diff / 86400000);
                  if (mins < 1)  return "Just now";
                  if (mins < 60) return `${mins}m ago`;
                  if (hrs  < 24) return `${hrs}h ago`;
                  return `${days}d ago`;
                })()}</div>
              </div>
              <div style={{ fontSize: 11, color: "var(--t2)", lineHeight: 1.6, fontWeight: 300 }}>Your agency has prepared a social media strategy. Please review each section below and approve or request changes.</div>
            </div>
          ) : null}

          <div className="g2">
            <div>
              {strategy ? (
                <>
                  <div className="cd" style={{ marginBottom: 12 }}>
                    <div className="cdt">Positioning statement</div>
                    <div style={{ fontSize: 13, color: "var(--t1)", lineHeight: 1.7, fontWeight: 300, padding: "10px 12px", background: "var(--in)", borderRadius: 8, border: "1px solid var(--in-b)" }}>
                      {strategy.summary || strategy.messagingDirection || "Your positioning statement from the strategy agent."}
                    </div>
                  </div>
                  {strategy.toneRecommendation && (
                    <div className="cd" style={{ marginBottom: 12 }}>
                      <div className="cdt">Tone of voice</div>
                      <div className="tr">{(strategy.toneRecommendation as string).split(",").map((t: string) => <span key={t} className="tg">{t.trim()}</span>)}</div>
                    </div>
                  )}
                  {strategy.keyMessages?.length > 0 && (
                    <div className="cd">
                      <div className="cdt">Key messages</div>
                      <div className="tr">{strategy.keyMessages.map((m: string) => <span key={m} className="tg g">{m}</span>)}</div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ border: "1px dashed var(--in-b)", borderRadius: 10, padding: 32, textAlign: "center" }}>
                  <i className="ti ti-flag-off" style={{ fontSize: 32, display: "block", marginBottom: 8, color: "var(--t4)" }} />
                  <div style={{ fontSize: 12, color: "var(--t4)", fontWeight: 300 }}>No strategy sent to you yet</div>
                </div>
              )}
            </div>
            <div>
              {!strategyApproved && strategy?.status !== "APPROVED" && strategy && (
                <div className="cd" style={{ marginBottom: 12 }}>
                  <div className="cdt">Your feedback</div>
                  <div style={{ fontSize: 10, color: "var(--t4)", marginBottom: 8, fontWeight: 300 }}>Add a comment before approving</div>
                  <textarea className="ea" placeholder="e.g. Please adjust the tone…" style={{ minHeight: 80, marginBottom: 10 }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <button className="gb gbp" style={{ justifyContent: "center", padding: 10 }} onClick={approveStrategy}><i className="ti ti-check" />Approve strategy</button>
                    <button className="gb gba" style={{ justifyContent: "center" }} onClick={() => { setRevisionContext("strategy"); setRevisionModal(true); }}><i className="ti ti-message" />Request changes</button>
                  </div>
                </div>
              )}
              <div className="cd">
                <div className="cdt">Approval history</div>
                {[{ label: "Strategy generated by AI", done: true }, { label: "Internal review by agency", done: true }, { label: "Client approval (you)", act: !strategyApproved && strategy?.status !== "APPROVED" }, { label: "Calendar generation unlocked", act: false }].map((a, i) => (
                  <div key={i} className={`aps${a.done ? " done" : a.act ? " act" : ""}`}>
                    <div className="apn">{a.done ? <i className="ti ti-check" style={{ fontSize: 8 }} /> : i + 1}</div>
                    <div><div className="apt">{a.label}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Creative approvals ── */}
      {activeTab === "creative" && (
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "10px 22px", borderBottom: "1px solid var(--tb-b)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {([["all", `All (${posts.length})`], ["pending", `Pending (${pendingPosts.length})`], ["approved", `Approved (${posts.filter((p) => p.status === "APPROVED").length})`]] as [string, string][]).map(([key, label]) => (
                <span key={key} className={`flt${creativeFilter === key ? " act" : ""}`} style={{ cursor: "pointer" }} onClick={() => setCreativeFilter(key as any)}>{label}</span>
              ))}
            </div>
            <div style={{ marginLeft: "auto", fontSize: 11, color: "var(--t4)", fontWeight: 300 }}>June {TODAY.getFullYear()} · {posts.length} posts</div>
          </div>
          <div className="sa">
            <div className="g4" style={{ marginBottom: 4 }}>
              {[["Pending review", pendingPosts.length, "var(--amber)"], ["Approved", posts.filter((p) => p.status === "APPROVED").length, "var(--green)"], ["Revision sent", posts.filter((p) => p.status === "REVISION_REQUIRED").length, "var(--blue)"], ["Published", posts.filter((p) => p.status === "PUBLISHED").length, undefined]].map(([label, val, color]) => (
                <div key={label as string} className="mt"><div className="ml">{label as string}</div><div className="mv" style={{ color: (color as string) ?? undefined }}>{String(val)}</div></div>
              ))}
            </div>
            <div className="g5" style={{ gap: 12, marginTop: 14 }}>
              {(() => {
                const shown = posts.filter((p) => creativeFilter === "all" ? true : creativeFilter === "pending" ? p.status === "AWAITING_APPROVAL" : p.status === "APPROVED");
                if (shown.length === 0) return (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 14px", color: "var(--t4)" }}>
                    <i className="ti ti-photo-off" style={{ fontSize: 32, display: "block", marginBottom: 8 }} />
                    <div style={{ fontSize: 12 }}>No creatives sent for approval yet</div>
                  </div>
                );
                return shown.map((p) => (
                  <div key={p.id} className="cd" style={{ padding: 0, overflow: "hidden" }}>
                    <div className="cpv" style={{ borderRadius: 0, border: "none", minHeight: 130 }}>
                      <div className="cpb">{p.platform?.toUpperCase() ?? "POST"}</div>
                      <div className="cph" style={{ fontSize: 10 }}>{p.topic ?? p.hook ?? "Post"}</div>
                      <div className="cps">{p.format} · {p.scheduledDate ? new Date(p.scheduledDate).toLocaleDateString("en", { month: "short", day: "numeric" }) : "—"}</div>
                      <div className="cpbg">{p.status === "APPROVED" ? <i className="ti ti-check" style={{ fontSize: 9 }} /> : "Pending"}</div>
                    </div>
                    <div style={{ padding: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 400, color: "var(--t2)", marginBottom: 2 }}>{p.topic ?? p.hook ?? "Post"}</div>
                      <div style={{ fontSize: 9, color: "var(--t4)", marginBottom: 8 }}>{p.scheduledDate ? new Date(p.scheduledDate).toLocaleDateString("en", { month: "short", day: "numeric" }) : "—"} · {p.platform} · {p.format}</div>
                      {p.status === "APPROVED" ? (
                        <span className="pl plg" style={{ fontSize: 9 }}>Approved</span>
                      ) : p.status === "REVISION_REQUIRED" ? (
                        <span className="pl plr" style={{ fontSize: 9 }}>Revision sent</span>
                      ) : (
                        <div style={{ display: "flex", gap: 5 }}>
                          <button className="gb gbs gbp" style={{ flex: 1, justifyContent: "center" }} onClick={() => approvePost(p)}><i className="ti ti-check" style={{ fontSize: 9 }} />Approve</button>
                          <button className="gb gbs gbr" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setRevisionContext("post"); setRevisionPost(p); setRevisionModal(true); }}><i className="ti ti-refresh" style={{ fontSize: 9 }} />Revise</button>
                        </div>
                      )}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── Content calendar ── */}
      {activeTab === "calendar" && (
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "10px 22px", borderBottom: "1px solid var(--tb-b)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <select className="fs"><option>June {TODAY.getFullYear()}</option></select>
            <div style={{ fontSize: 11, color: "var(--t3)", fontWeight: 300 }}>{posts.length} posts scheduled · Read-only</div>
          </div>
          <div className="sa">
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              {[["var(--green)","Approved"],["var(--amber)","Pending approval"],["var(--red)","Revision requested"],["var(--blue)","Published"]].map(([color, label]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "var(--t4)" }}>
                  <div style={{ width: 7, height: 7, borderRadius: 2, background: color }} />{label}
                </div>
              ))}
            </div>
            <div className="cg">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <div key={d} className="dh">{d}</div>)}
              {(() => {
                const y = TODAY.getFullYear(), m = TODAY.getMonth();
                const firstDay = new Date(y, m, 1).getDay();
                const daysInMonth = new Date(y, m + 1, 0).getDate();
                const offset = firstDay === 0 ? 6 : firstDay - 1;
                const prevDays = new Date(y, m, 0).getDate();
                const cells: { day: number; current: boolean; today: boolean }[] = [];
                for (let i = offset - 1; i >= 0; i--) cells.push({ day: prevDays - i, current: false, today: false });
                for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true, today: d === TODAY.getDate() });
                while (cells.length % 7 !== 0) cells.push({ day: cells.length - (offset + daysInMonth) + 1, current: false, today: false });
                return cells.map((c, i) => {
                  const dayPosts = c.current ? posts.filter((p) => p.scheduledDate && new Date(p.scheduledDate).getDate() === c.day && new Date(p.scheduledDate).getMonth() === m) : [];
                  return (
                    <div key={i} className={`dc${!c.current ? " om" : ""}${c.today ? " td" : ""}`}>
                      <div className="dnw"><div className="dn">{c.day}</div></div>
                      {dayPosts.slice(0, 2).map((p, j) => (
                        <div key={j} className={`pc ${p.status === "APPROVED" ? "cbl" : p.status === "REVISION_REQUIRED" ? "caw" : "cof"}`}>
                          <i className={`ti ti-brand-${p.platform}`} style={{ fontSize: 6 }} />{(p.format ?? "Post").slice(0, 6)}
                        </div>
                      ))}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── Reports ── */}
      {activeTab === "reports" && (() => {
        const v = (val: number | null | undefined, fmt?: (n: number) => string) =>
          analyticsLoading ? "…" : val != null ? (fmt ? fmt(val) : String(val)) : "—";
        const fmtNum = (n: number) =>
          n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M" : n >= 1_000 ? (n / 1_000).toFixed(1) + "k" : String(n);

        const PLATFORM_COLOR: Record<string, string> = {
          instagram: "#e1306c", linkedin: "#0077b5", tiktok: "#5dcaa5", x: "var(--t2)",
        };
        const PLATFORM_ICON: Record<string, string> = {
          instagram: "ti-brand-instagram", linkedin: "ti-brand-linkedin",
          tiktok: "ti-brand-tiktok", x: "ti-brand-x",
        };

        const timeline: { date: string; value: number }[] = analytics?.timeline ?? [];
        const maxVal = Math.max(...timeline.map((t) => t.value), 1);
        const W = 560, yTop = 8, yBot = 64;
        const pts = timeline.map((t, i) => ({
          x: (i / Math.max(timeline.length - 1, 1)) * W,
          y: yBot - (t.value / maxVal) * (yBot - yTop),
        }));
        let chartLine = "M0,64 L560,64";
        let chartArea = "";
        if (pts.length > 0) {
          chartLine = `M${pts[0].x},${pts[0].y}`;
          for (let i = 1; i < pts.length; i++) {
            const cpX = (pts[i - 1].x + pts[i].x) / 2;
            chartLine += ` C${cpX},${pts[i - 1].y} ${cpX},${pts[i].y} ${pts[i].x},${pts[i].y}`;
          }
          chartArea = `${chartLine} L${pts[pts.length - 1].x},72 L${pts[0].x},72Z`;
        }

        const platforms: { platform: string; count: number }[] = analytics?.postsByPlatform ?? [];
        const platformTotal = platforms.reduce((s, p) => s + p.count, 0) || 1;

        return (
        <div className="sa">
          <div className="g4" style={{ marginBottom: 16 }}>
            <div className="mt"><div className="ml">Total reach</div><div className="mv">{v(analytics?.totalReach, fmtNum)}</div></div>
            <div className="mt">
              <div className="ml">Engagement rate</div>
              <div className="mv" style={{ color: analytics?.engagementRate != null ? "var(--green)" : undefined }}>
                {v(analytics?.engagementRate, (n) => `${n}%`)}
              </div>
            </div>
            <div className="mt">
              <div className="ml">Posts published</div>
              <div className="mv">{analyticsLoading ? "…" : analytics?.postsPublished ?? posts.filter((p) => p.status === "PUBLISHED").length}</div>
            </div>
            <div className="mt">
              <div className="ml">Followers gained</div>
              <div className="mv" style={{ color: analytics?.followersGained != null && analytics.followersGained > 0 ? "var(--green)" : undefined }}>
                {analyticsLoading ? "…" : analytics?.followersGained != null ? (analytics.followersGained >= 0 ? "+" : "") + analytics.followersGained : "—"}
              </div>
            </div>
          </div>

          <div className="g2e">
            <div className="cd">
              <div className="cdt">Posts published over time</div>
              <svg className="csvg" viewBox="0 0 560 76" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cpgf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d97b" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#34d97b" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {chartArea && <path d={chartArea} fill="url(#cpgf)" />}
                <path d={chartLine} fill="none" stroke="#34d97b" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="cd">
              <div className="cdt">Posts by platform</div>
              {platforms.length > 0 ? platforms.map((p) => (
                <div key={p.platform} className="hbr">
                  <div className="hbl">
                    <i className={`ti ${PLATFORM_ICON[p.platform] ?? "ti-brand-instagram"}`} style={{ fontSize: 11, color: PLATFORM_COLOR[p.platform] ?? "var(--t3)" }} />
                    {p.platform.charAt(0).toUpperCase() + p.platform.slice(1)}
                  </div>
                  <div className="hbt">
                    <div className="hbf" style={{ width: `${Math.round((p.count / platformTotal) * 100)}%`, background: PLATFORM_COLOR[p.platform] ?? "var(--t3)" }} />
                  </div>
                  <div className="hbv">{p.count}</div>
                </div>
              )) : (
                <div style={{ color: "var(--t4)", fontSize: 10, padding: "8px 0" }}>No published posts yet</div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <button className="gb gbg" title="Coming soon"><i className="ti ti-download" />Download PDF report</button>
          </div>
        </div>
        );
      })()}

      {/* Revision modal */}
      {revisionModal && (
        <div className="mo" onClick={(e) => { if (e.target === e.currentTarget) setRevisionModal(false); }}>
          <div className="mb">
            <div className="mbt">Request changes</div>
            <div className="mbs">Describe what you&apos;d like changed. Your agency will be notified immediately.</div>
            <div className="fl" style={{ marginBottom: 12 }}><label>What needs to change?</label><textarea style={{ minHeight: 80 }} placeholder="e.g. Please make the headline more direct…" value={revisionComment} onChange={(e) => setRevisionComment(e.target.value)} /></div>
            <div className="fl" style={{ marginBottom: 16 }}><label>Priority</label><select><option>Normal</option><option>High — needed before publish date</option></select></div>
            <div className="mbb">
              <button className="gb gbg" onClick={() => { setRevisionModal(false); setRevisionComment(""); setRevisionPost(null); }}>Cancel</button>
              <button className="gb gba" onClick={handleRevision}><i className="ti ti-send" />Send revision request</button>
            </div>
          </div>
        </div>
      )}

      {/* Approved modal */}
      {approvedModal && (
        <div className="mo" onClick={(e) => { if (e.target === e.currentTarget) setApprovedModal(false); }}>
          <div className="mb" style={{ textAlign: "center", maxWidth: 360 }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: "var(--gb)", border: "2px solid var(--gbb)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <i className="ti ti-check" style={{ fontSize: 22, color: "var(--green)" }} />
            </div>
            <div className="mbt">Strategy approved!</div>
            <div className="mbs">Your agency has been notified. They&apos;ll proceed with generating the content calendar.</div>
            <div className="mbb" style={{ justifyContent: "center" }}>
              <button className="gb gbp" onClick={() => { setApprovedModal(false); setActiveTab("calendar"); }}><i className="ti ti-calendar" />View calendar</button>
            </div>
          </div>
        </div>
      )}
    </ClientPortalLayout>
  );
}
