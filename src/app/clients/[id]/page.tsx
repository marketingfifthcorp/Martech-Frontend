"use client";

import { Fragment, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useApi } from "@/hooks/useApi";

const WORKFLOW_STEPS = [
  "Setup", "Strategy", "Approval", "Calendar",
  "Design", "Review", "Publishing", "Analytics",
];

const STATUS_STEP: Record<string, number> = {
  ONBOARDING: 0, BRIEF_UPLOADED: 1, STRATEGY_PENDING: 1,
  STRATEGY_IN_REVIEW: 1, STRATEGY_SENT: 2, STRATEGY_APPROVED: 2,
  CALENDAR_PENDING: 3, ACTIVE: 6, PAUSED: 6, ARCHIVED: 7,
};

const TABS = ["Overview", "Strategy", "Calendars", "Design queue", "Publishing", "Analytics", "Settings"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const TODAY = new Date();

const CHANNELS = [
  { label: "Instagram", dbPlatform: "instagram", oauthPlatform: "meta",    icon: "ti-brand-instagram", color: "#e1306c" },
  { label: "LinkedIn",  dbPlatform: "linkedin",  oauthPlatform: "linkedin", icon: "ti-brand-linkedin",  color: "#0077b5" },
  { label: "TikTok",    dbPlatform: "tiktok",    oauthPlatform: "tiktok",   icon: "ti-brand-tiktok",    color: "#5dcaa5" },
  { label: "X",         dbPlatform: "x",         oauthPlatform: "x",        icon: "ti-brand-x",         color: "var(--t2)" },
];

const PLATFORM_COLOR: Record<string, string> = {
  instagram: "#e1306c", linkedin: "#0077b5", tiktok: "#5dcaa5", x: "var(--t2)",
};
const PLATFORM_BG: Record<string, string> = {
  instagram: "rgba(225,48,108,.13)", linkedin: "rgba(0,119,181,.13)",
  tiktok: "rgba(93,202,165,.13)", x: "rgba(255,255,255,.06)",
};

function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return String(n);
}

function timelineToPath(
  timeline: { date: string; value: number }[],
): { line: string; area: string } {
  if (!timeline.length) return { line: "M0,64 L560,64", area: "" };
  // Scale y relative to actual max so the chart never clips or flattens
  const maxVal = Math.max(...timeline.map((t) => t.value), 1);
  const W = 560, yTop = 8, yBot = 64;
  const pts = timeline.map((t, i) => ({
    x: (i / Math.max(timeline.length - 1, 1)) * W,
    y: yBot - (t.value / maxVal) * (yBot - yTop),
  }));
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cpX = (pts[i - 1].x + pts[i].x) / 2;
    d += ` C${cpX},${pts[i - 1].y} ${cpX},${pts[i].y} ${pts[i].x},${pts[i].y}`;
  }
  const last = pts[pts.length - 1];
  return { line: d, area: `${d} L${last.x},72 L${pts[0].x},72Z` };
}

function CalendarGrid({ posts, onPostClick }: { posts: any[]; onPostClick: (p: any) => void }) {
  const y = TODAY.getFullYear(), m = TODAY.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const prevDays = new Date(y, m, 0).getDate();
  const cells: { day: number; current: boolean; today: boolean }[] = [];
  for (let i = offset - 1; i >= 0; i--) cells.push({ day: prevDays - i, current: false, today: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true, today: d === TODAY.getDate() });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - (offset + daysInMonth) + 1, current: false, today: false });

  // Index posts by day-of-month for this month
  const byDay: Record<number, any[]> = {};
  posts.forEach((p) => {
    if (!p.scheduledDate) return;
    const d = new Date(p.scheduledDate);
    if (d.getFullYear() === y && d.getMonth() === m) {
      const day = d.getDate();
      (byDay[day] ??= []).push(p);
    }
  });

  return (
    <div className="cg">
      {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <div key={d} className="dh">{d}</div>)}
      {cells.map((c, i) => {
        const dayPosts = c.current ? (byDay[c.day] ?? []) : [];
        return (
          <div key={i} className={`dc${!c.current ? " om" : ""}${c.today ? " td" : ""}`}>
            <div className="dnw"><div className="dn">{c.day}</div></div>
            {dayPosts.slice(0, 3).map((p) => (
              <div key={p.id} className="pc" onClick={() => onPostClick(p)} style={{
                background: PLATFORM_BG[p.platform] ?? "var(--in)",
                border: `1px solid ${PLATFORM_COLOR[p.platform] ?? "var(--in-b)"}`,
                color: PLATFORM_COLOR[p.platform] ?? "var(--t3)",
                fontSize: 7, padding: "2px 5px", borderRadius: 3, marginBottom: 1,
                overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
                display: "block", cursor: "pointer",
              }}>
                {p.topic ?? p.hook ?? "Post"}
              </div>
            ))}
            {dayPosts.length > 3 && (
              <div style={{ fontSize: 7, color: "var(--t4)", paddingLeft: 2, marginTop: 1 }}>
                +{dayPosts.length - 3} more
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ClientDetailPage() {
  const api = useApi();
  const params = useParams();
  const clientId = params.id as string;
  const [tab, setTab] = useState(0);
  const [client, setClient] = useState<any>(null);
  const [strategy, setStrategy] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [calView, setCalView] = useState<"grid" | "list">("grid");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [approveModal, setApproveModal] = useState(false);
  const [sendModal, setSendModal] = useState(false);
  const [connections, setConnections] = useState<any[]>([]);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [connectionToast, setConnectionToast] = useState<{ type: "success" | "error"; platform: string; msg?: string } | null>(null);
  const [project, setProject] = useState<any>(null);
  const [queueing, setQueueing] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [approving, setApproving] = useState(false);
  const [postActionLoading, setPostActionLoading] = useState<"approve" | "revise" | null>(null);
  const [sendModalContext, setSendModalContext] = useState<"strategy" | "post">("strategy");
  const [sendLoading, setSendLoading] = useState(false);
  const [retryingPostId, setRetryingPostId] = useState<string | null>(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadPostId, setUploadPostId] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [designFilter, setDesignFilter] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<"15d" | "30d" | "60d" | "90d">("30d");

  useEffect(() => {
    (async () => {
      try {
        const c = await api.clients.get(clientId);
        setClient(c);
        try { const strats = await api.strategy.listByClient(clientId); if (strats.length) setStrategy(strats[0]); } catch {}
        try { setPosts(await api.posts.listByClient(clientId)); } catch {}
        try {
          const projs = await api.projects.listByClient(clientId);
          const cur = projs.find((p: any) => p.month === TODAY.getMonth() + 1 && p.year === TODAY.getFullYear());
          if (cur) setProject(cur);
        } catch {}
      } catch {}
      finally { setLoading(false); }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  useEffect(() => {
    if (tab !== 5) return;
    let cancelled = false;
    (async () => {
      setAnalyticsLoading(true);
      try {
        const data = await api.analytics.get(clientId, analyticsPeriod);
        if (!cancelled) setAnalytics(data);
      } catch {}
      finally { if (!cancelled) setAnalyticsLoading(false); }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, analyticsPeriod, clientId]);

  async function generateStrategy() {
    if (!client?.briefs?.[0]?.id) return;
    setGenerating(true);
    // Fire generation — it takes ~30-60s and the HTTP connection may timeout, but the
    // backend will complete regardless. We poll for the result instead of awaiting inline.
    api.strategy.generate(client.briefs[0].id).catch(() => {});
    for (let i = 0; i < 22; i++) {
      await new Promise((r) => setTimeout(r, 4000));
      try {
        const strats = await api.strategy.listByClient(clientId);
        if (strats.length) { setStrategy(strats[0]); setGenerating(false); return; }
      } catch {}
    }
    setGenerating(false);
  }

  async function approveStrategy() {
    if (!strategy) return;
    setApproving(true);
    try {
      await api.strategy.approve(strategy.id, "APPROVED", "");
      setStrategy((s: any) => ({ ...s, status: "APPROVED" }));
      setApproveModal(false);
      setTab(2); // Jump to Calendar tab
      generateCalendar(); // Fire calendar generation (manages its own `generating` state)
    } catch {
      setApproving(false);
    }
    setApproving(false);
  }

  async function generateCalendar() {
    if (!strategy) return;
    setGenerating(true);

    // Ensure project exists
    let proj = project;
    if (!proj) {
      try {
        proj = await api.projects.create({
          clientId, strategyId: strategy.id,
          title: `${MONTHS[TODAY.getMonth()]} ${TODAY.getFullYear()}`,
          month: TODAY.getMonth() + 1, year: TODAY.getFullYear(),
        });
      } catch {
        try {
          const projs = await api.projects.listByClient(clientId);
          proj = projs.find((p: any) => p.month === TODAY.getMonth() + 1 && p.year === TODAY.getFullYear()) ?? null;
        } catch {}
      }
      if (proj) setProject(proj);
    }
    if (!proj) { setGenerating(false); return; }

    // Fire generation — takes 15-60s; connection may time out but backend still completes
    api.projects.generateCalendar(proj.id).catch(() => {});

    // Poll until posts appear (max 80s)
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 4000));
      try {
        const fetched = await api.posts.listByClient(clientId);
        if (fetched.length) { setPosts(fetched); setGenerating(false); return; }
      } catch {}
    }
    setGenerating(false);
  }

  async function approvePost(postId: string) {
    setPostActionLoading("approve");
    try {
      await api.posts.approve(postId, "APPROVED", "");
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, status: "APPROVED" } : p));
      setSelectedPost((s: any) => s ? { ...s, status: "APPROVED" } : s);
    } catch {}
    setPostActionLoading(null);
  }

  async function requestRevision(postId: string) {
    setPostActionLoading("revise");
    try {
      await api.posts.approve(postId, "CHANGES_REQUESTED", "");
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, status: "REVISION_REQUIRED" } : p));
      setSelectedPost((s: any) => s ? { ...s, status: "REVISION_REQUIRED" } : s);
    } catch {}
    setPostActionLoading(null);
  }

  async function queueForPublishing() {
    if (!project) {
      // Project might not be loaded yet — refetch and try once more
      try {
        const projs = await api.projects.listByClient(clientId);
        const cur = projs.find((p: any) => p.month === TODAY.getMonth() + 1 && p.year === TODAY.getFullYear())
          ?? projs[projs.length - 1]; // fall back to most recent project
        if (!cur) { alert("No project found for this client. Generate a calendar first."); return; }
        setProject(cur);
        setQueueing(true);
        await api.publishing.queueProject(cur.id);
        setPosts(await api.posts.listByClient(clientId));
      } catch (e: any) {
        alert(e?.message ?? "Failed to queue posts");
      } finally { setQueueing(false); }
      return;
    }
    setQueueing(true);
    try {
      await api.publishing.queueProject(project.id);
      setPosts(await api.posts.listByClient(clientId));
    } catch (e: any) {
      alert(e?.message ?? "Failed to queue posts");
    } finally { setQueueing(false); }
  }

  async function handleSendToClient() {
    setSendLoading(true);
    try {
      if (sendModalContext === "strategy" && strategy) {
        await api.strategy.sendToClient(strategy.id);
        setStrategy((s: any) => ({ ...s, status: "SENT_TO_CLIENT" }));
      }
    } catch {}
    setSendLoading(false);
    setSendModal(false);
  }

  async function retryPost(postId: string) {
    setRetryingPostId(postId);
    try {
      await api.publishing.retryFailed(postId);
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, status: "SCHEDULED" } : p));
    } catch {}
    setRetryingPostId(null);
  }

  async function handleUploadAsset() {
    if (!uploadPostId || !uploadFile) return;
    setUploading(true);
    try {
      await api.assets.upload(uploadPostId, uploadFile, "");
      setPosts((prev) => prev.map((p) => p.id === uploadPostId ? { ...p, status: "CREATIVE_UPLOADED" } : p));
      setUploadModal(false);
      setUploadPostId(null);
      setUploadFile(null);
    } catch {}
    setUploading(false);
  }

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get("tab");
    if (t) setTab(Math.min(parseInt(t, 10), TABS.length - 1));
    const connected = p.get("connected");
    const error = p.get("error");
    const msg = p.get("msg");
    if (connected) setConnectionToast({ type: "success", platform: connected });
    else if (error) setConnectionToast({ type: "error", platform: error, msg: msg ?? undefined });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab !== 6 || !clientId) return;
    api.socialAuth.listConnections(clientId).then(setConnections).catch(() => {});
    api.users.list().then(setAllUsers).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, clientId]);

  async function connectPlatform(oauthPlatform: string) {
    setConnectingPlatform(oauthPlatform);
    try {
      const { url } = await api.socialAuth.connectUrl(oauthPlatform, clientId);
      window.location.href = url;
    } catch {
      setConnectingPlatform(null);
    }
  }

  async function disconnectPlatform(connectionId: string) {
    try {
      await api.socialAuth.disconnect(connectionId, clientId);
      setConnections((prev) => prev.filter((c) => c.id !== connectionId));
    } catch {}
  }

  const stepIdx = client ? (STATUS_STEP[client.status] ?? 0) : 0;

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f1a" }}>
      <div style={{ width: 32, height: 32, border: "2px solid rgba(52,217,123,.2)", borderTopColor: "#34d97b", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    </div>
  );

  if (!client) return (
    <DashboardShell title="Client not found"><div className="sa" style={{ textAlign: "center", paddingTop: 60 }}><i className="ti ti-user-off" style={{ fontSize: 40, color: "var(--t4)", display: "block", marginBottom: 12 }} /><div style={{ fontSize: 14, color: "var(--t2)" }}>Client not found</div></div></DashboardShell>
  );

  return (
    <DashboardShell
      title={client.name}
      breadcrumb={<><Link href="/clients" style={{ color: "var(--green)", textDecoration: "none" }}>Clients</Link> / {client.name}</>}
      actionButton={
        <div style={{ display: "flex", gap: 8 }}>
          <button className="gb gbg" onClick={() => window.open('/client-portal', '_blank')}><i className="ti ti-external-link" /> Client portal</button>
          <button className="gb gbp" onClick={() => setTab(2)}><i className="ti ti-calendar" /> Generate calendar</button>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        {/* Client header */}
        <div className="ch">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div className="ci" style={{ width: 38, height: 38, background: "var(--bb)", color: "var(--blue)", border: "1px solid var(--bbb)", fontSize: 13, fontWeight: 400 }}>
                {client.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 300, color: "var(--t1)" }}>{client.name}</div>
                <div style={{ fontSize: 10, color: "var(--t4)", marginTop: 3, display: "flex", gap: 10, fontWeight: 300 }}>
                  <span>{client.industry ?? "—"}</span><span>{client.contactName ?? "—"}</span><span>{client.postingFrequency ?? 12} posts/mo</span>
                </div>
              </div>
            </div>
          </div>
          {/* Workflow steps */}
          <div style={{ display: "flex", alignItems: "center", paddingBottom: 4 }}>
            {WORKFLOW_STEPS.map((ws, i) => (
              <Fragment key={ws}>
                <div className="std" style={{ minWidth: 68, flexShrink: 0 }}>
                  <div className="stdd" style={{ background: i < stepIdx ? "var(--gb)" : i === stepIdx ? "var(--green)" : "var(--in)", border: `1px solid ${i < stepIdx ? "var(--gbb)" : i === stepIdx ? "var(--green)" : "var(--in-b)"}`, color: i < stepIdx ? "var(--green)" : i === stepIdx ? "#000" : "var(--t4)" }}>
                    {i < stepIdx ? <i className="ti ti-check" style={{ fontSize: 10 }} /> : i + 1}
                  </div>
                  <div className="stdl" style={{ color: i === stepIdx ? "var(--t1)" : "var(--t4)" }}>{ws}</div>
                </div>
                {i < WORKFLOW_STEPS.length - 1 && <div className="stdli" style={{ flex: 1, minWidth: 8 }} />}
              </Fragment>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="stabs">
          {TABS.map((t, i) => <div key={t} className={`stab${tab === i ? " on" : ""}`} onClick={() => setTab(i)} style={{ cursor: "pointer" }}>{t}</div>)}
        </div>

        {connectionToast && (
          <div style={{ margin: "10px 22px 0", padding: "10px 14px", borderRadius: 8, display: "flex", alignItems: "center", gap: 10, background: connectionToast.type === "success" ? "var(--gb)" : "var(--rb)", border: `1px solid ${connectionToast.type === "success" ? "var(--gbb)" : "var(--rbb)"}`, flexShrink: 0 }}>
            <i className={`ti ${connectionToast.type === "success" ? "ti-circle-check" : "ti-alert-triangle"}`} style={{ fontSize: 14, color: connectionToast.type === "success" ? "var(--green)" : "var(--red)", flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 300, color: "var(--t1)", flex: 1 }}>
              {connectionToast.type === "success"
                ? `${connectionToast.platform.charAt(0).toUpperCase() + connectionToast.platform.slice(1)} connected successfully.`
                : connectionToast.msg ?? `Failed to connect ${connectionToast.platform}.`}
            </span>
            <button onClick={() => setConnectionToast(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--t4)", padding: 0, lineHeight: 1 }}><i className="ti ti-x" style={{ fontSize: 11 }} /></button>
          </div>
        )}

        {/* ── Overview ── */}
        {tab === 0 && (
          <div className="sa">
            <div className="g2">
              <div>
                <div className="g3" style={{ marginBottom: 12 }}>
                  <div className="mt"><div className="ml">Posts published</div><div className="mv" style={{ color: "var(--green)" }}>{posts.filter((p) => p.status === "PUBLISHED").length}/{client.postingFrequency ?? 12}</div></div>
                  <div className="mt"><div className="ml">Stage</div><div className="mv" style={{ fontSize: 12, color: "var(--blue)", marginTop: 4 }}>{client.status?.replace(/_/g, " ")}</div></div>
                  <div className="mt"><div className="ml">Strategy</div><div className="mv" style={{ fontSize: 12, color: strategy ? "var(--green)" : "var(--amber)", marginTop: 4 }}>{strategy ? strategy.status.replace(/_/g, " ") : "Not generated"}</div></div>
                </div>
                {!strategy && (
                  <div style={{ background: client.briefs?.[0] ? "var(--gb)" : "var(--ab)", border: `1px solid ${client.briefs?.[0] ? "var(--gbb)" : "var(--abb)"}`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 300, color: "var(--t1)", marginBottom: 8 }}>
                      {client.briefs?.[0] ? "Brief uploaded — ready to generate strategy" : "No brief uploaded yet"}
                    </div>
                    {client.briefs?.[0] ? (
                      <button className="gb gbp" onClick={generateStrategy} disabled={generating}>
                        <i className="ti ti-robot" /> {generating ? "Generating…" : "Generate strategy"}
                      </button>
                    ) : (
                      <Link href={`/clients/${clientId}/brief`} className="gb gba">
                        <i className="ti ti-upload" /> Upload brief
                      </Link>
                    )}
                  </div>
                )}
                {strategy && ["GENERATING", "INTERNAL_REVIEW", "DRAFT"].includes(strategy.status) && (
                  <div style={{ background: "var(--gb)", border: "1px solid var(--gbb)", borderRadius: 12, padding: 14, marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 300, color: "var(--t1)", marginBottom: 4 }}>Strategy draft ready for review</div>
                    <button className="gb gbp" onClick={() => setTab(1)}><i className="ti ti-flag" /> Review strategy</button>
                  </div>
                )}
                <div className="cd">
                  <div className="cdt">Recent activity</div>
                  <div className="ait"><div className="adot" style={{ background: "var(--green)" }} /><div className="atx">Client created and channels configured</div><div className="atm">Today</div></div>
                </div>
              </div>
              <div>
                <div className="cd">
                  <div className="cdt">Client info <button className="gb gbs" onClick={() => setTab(6)}>Edit</button></div>
                  <div className="ir"><span className="irl">Business</span><span className="irv">{client.name}</span></div>
                  <div className="ir"><span className="irl">Industry</span><span className="irv">{client.industry ?? "—"}</span></div>
                  <div className="ir"><span className="irl">POC</span><span className="irv">{client.contactName ?? "—"}</span></div>
                  <div className="ir"><span className="irl">Email</span><span className="irv g">{client.contactEmail ?? "—"}</span></div>
                  <div className="ir"><span className="irl">Website</span><span className="irv g">{client.websiteUrl ?? "—"}</span></div>
                  <div className="ir"><span className="irl">Posts/mo</span><span className="irv">{client.postingFrequency ?? 12}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Strategy ── */}
        {tab === 1 && (
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div className="sa">
              {!strategy ? (
                <div style={{ textAlign: "center", paddingTop: 48 }}>
                  <i className="ti ti-flag-off" style={{ fontSize: 40, color: "var(--t4)", display: "block", marginBottom: 12 }} />
                  <div style={{ fontSize: 14, color: "var(--t2)", marginBottom: 16 }}>No strategy generated yet</div>
                  <button className="gb gbp" onClick={generateStrategy} disabled={generating || !client.briefs?.[0]}>
                    <i className="ti ti-robot" /> {generating ? "Generating…" : "Generate AI Strategy"}
                  </button>
                  {!client.briefs?.[0] && <div style={{ fontSize: 10, color: "var(--t4)", marginTop: 8 }}><Link href={`/clients/${clientId}/brief`} style={{ color: "var(--green)" }}>Upload a brief first</Link></div>}
                </div>
              ) : (
                <div className="g2">
                  <div>
                    {/* Status */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "12px 16px", background: "var(--in)", border: "1px solid var(--in-b)", borderRadius: 10 }}>
                      <span style={{ fontSize: 12, color: "var(--t3)", flex: 1, fontWeight: 300 }}>Status</span>
                      <span className="pl plb" style={{ fontSize: 11, padding: "3px 10px" }}>{strategy.status?.replace(/_/g, " ")}</span>
                    </div>

                    {/* Strategy card */}
                    <div className="ais" style={{ padding: "20px 22px" }}>
                      <div className="aih" style={{ marginBottom: 16 }}>
                        <div className="aid" />
                        <span style={{ fontSize: 13, fontWeight: 400, color: "var(--green)", letterSpacing: ".02em" }}>AI strategy — {client.name}</span>
                      </div>

                      {/* Summary */}
                      <div style={{ fontSize: 10, color: "var(--t4)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10, fontWeight: 400 }}>Positioning / Summary</div>
                      <textarea
                        className="ea"
                        defaultValue={strategy.summary || strategy.messagingDirection || "Edit positioning…"}
                        rows={10}
                        style={{ fontSize: 13, lineHeight: 1.75, padding: "14px 16px", minHeight: 220, borderColor: "var(--abb)", background: "var(--ab)" }}
                      />

                      {/* Tone of voice */}
                      {strategy.toneRecommendation && (
                        <>
                          <div style={{ fontSize: 10, color: "var(--t4)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10, marginTop: 18, fontWeight: 400 }}>Tone of voice</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                            {(strategy.toneRecommendation as string).split(",").map((t: string) => (
                              <span key={t} className="tg" style={{ fontSize: 12, padding: "6px 14px", lineHeight: 1.5 }}>{t.trim()}</span>
                            ))}
                          </div>
                        </>
                      )}

                      {/* Key messages */}
                      {strategy.keyMessages?.length > 0 && (
                        <>
                          <div style={{ fontSize: 10, color: "var(--t4)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10, marginTop: 18, fontWeight: 400 }}>Key messages</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {strategy.keyMessages.map((m: string) => (
                              <div key={m} style={{ padding: "12px 16px", background: "var(--gb)", border: "1px solid var(--gbb)", borderRadius: 8, fontSize: 13, color: "var(--t1)", fontWeight: 300, lineHeight: 1.65 }}>{m}</div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Approval sidebar */}
                  <div>
                    <div className="cd" style={{ padding: "16px 18px" }}>
                      <div className="cdt" style={{ fontSize: 10, marginBottom: 12 }}>Approval flow</div>
                      {[
                        { label: "AI draft generated", done: true },
                        { label: "Internal review", act: !["SENT_TO_CLIENT","APPROVED"].includes(strategy.status) },
                        { label: "Send to client",    act: strategy.status === "SENT_TO_CLIENT" },
                        { label: "Strategy approved", act: strategy.status === "APPROVED" },
                      ].map((a, i) => (
                        <div key={i} className={`aps${a.done ? " done" : a.act ? " act" : ""}`} style={{ padding: "10px 12px", marginBottom: 4 }}>
                          <div className="apn">{a.done ? <i className="ti ti-check" style={{ fontSize: 9 }} /> : i + 1}</div>
                          <div><div className="apt" style={{ fontSize: 12 }}>{a.label}</div></div>
                        </div>
                      ))}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}>
                        <button className="gb gbp" style={{ justifyContent: "center", padding: "10px 14px", fontSize: 12 }} onClick={() => setApproveModal(true)}><i className="ti ti-check" />Approve internally</button>
                        <button className="gb gba" style={{ justifyContent: "center", padding: "10px 14px", fontSize: 12 }} onClick={() => { setSendModalContext("strategy"); setSendModal(true); }}><i className="ti ti-send" />Send to client</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {strategy && (
              <div className="abar">
                <button className="gb gbg"><i className="ti ti-device-floppy" />Save changes</button>
                <button className="gb gbp" onClick={() => setApproveModal(true)}><i className="ti ti-check" />Approve &amp; generate calendar</button>
              </div>
            )}
          </div>
        )}

        {/* ── Calendars ── */}
        {tab === 2 && (
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 22px", borderBottom: "1px solid var(--tb-b)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0, boxSizing: "border-box" }}>
              <select className="fs"><option>{MONTHS[TODAY.getMonth()]} {TODAY.getFullYear()}</option></select>
              <div style={{ fontSize: 11, color: "var(--t3)", fontWeight: 300 }}>{posts.length} posts</div>
              <div className="vt" style={{ marginLeft: "auto" }}>
                <button className={`vtb${calView === "grid" ? " on" : ""}`} onClick={() => setCalView("grid")}><i className="ti ti-calendar" /></button>
                <button className={`vtb${calView === "list" ? " on" : ""}`} onClick={() => setCalView("list")}><i className="ti ti-list" /></button>
              </div>
              {strategy?.status === "APPROVED" && <button className="gb gbp" style={{ padding: "9px 18px", fontSize: 12 }} onClick={generateCalendar} disabled={generating}><i className="ti ti-robot" />{generating ? "Generating…" : `Generate ${MONTHS[TODAY.getMonth()]}`}</button>}
            </div>
            <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
              <div style={{ flex: 1, overflowY: "auto", padding: "14px 22px" }}>
                {calView === "grid" ? (
                  posts.length === 0 ? (
                    <div style={{ border: "1px dashed var(--in-b)", borderRadius: 8, padding: 28, textAlign: "center" }}>
                      <i className="ti ti-calendar-off" style={{ fontSize: 28, display: "block", marginBottom: 8, color: "var(--t4)" }} />
                      <div style={{ fontSize: 11, color: "var(--t4)", fontWeight: 300 }}>Calendar not generated — {strategy ? "approve strategy first" : "strategy required"}</div>
                    </div>
                  ) : <CalendarGrid posts={posts} onPostClick={(p) => { setSelectedPost(p); setDrawerOpen(true); }} />
                ) : (
                  <div className="cd" style={{ padding: 0, overflow: "hidden" }}>
                    {posts.length === 0 ? <div style={{ padding: "24px 14px", textAlign: "center", fontSize: 11, color: "var(--t4)" }}>No posts yet</div> : posts.map((p) => (
                      <div key={p.id} className="clr" style={{ cursor: "pointer" }} onClick={() => { setSelectedPost(p); setDrawerOpen(true); }}>
                        <div className="cld">{p.scheduledDate ? new Date(p.scheduledDate).toLocaleDateString("en", { month: "short", day: "numeric" }) : "—"}</div>
                        <div className="clt">{p.topic ?? p.hook ?? "Post"}</div>
                        <span className="pl plb" style={{ fontSize: 9 }}>{p.platform}</span>
                        <span style={{ fontSize: 10, color: "var(--t3)", fontWeight: 300 }}>{p.format}</span>
                        <button className="gb gbs">View</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {drawerOpen && selectedPost && (
                <div className="sd">
                  <div className="sdh"><div className="sdt">{selectedPost.topic ?? "Post"}</div><button className="sdc" onClick={() => setDrawerOpen(false)}><i className="ti ti-x" style={{ fontSize: 10 }} /></button></div>
                  <div className="sdb">
                    <div className="sdr"><span className="sdl">Platform</span><span className="sdv">{selectedPost.platform}</span></div>
                    <div className="sdr"><span className="sdl">Format</span><span className="sdv">{selectedPost.format}</span></div>
                    <div className="sdr"><span className="sdl">Status</span><span className="sdv">{selectedPost.status}</span></div>
                    {selectedPost.caption && (<><div className="fll">Caption</div><div className="ib" style={{ fontSize: 10 }}>{selectedPost.caption}</div></>)}
                    {selectedPost.hook && (<><div className="fll">Hook</div><div className="ib" style={{ fontSize: 10 }}>{selectedPost.hook}</div></>)}
                  </div>
                  <div className="sda">
                    <button className="gb gbp" style={{ justifyContent: "center" }} disabled={!!postActionLoading} onClick={() => selectedPost && approvePost(selectedPost.id)}>
                      {postActionLoading === "approve" ? <><span style={{ display: "inline-block", width: 11, height: 11, border: "2px solid rgba(0,0,0,.2)", borderTopColor: "#000", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Approving…</> : <><i className="ti ti-check" />{selectedPost?.status === "APPROVED" ? "Approved ✓" : "Approve"}</>}
                    </button>
                    <button className="gb gba" style={{ justifyContent: "center" }} disabled={!!postActionLoading} onClick={() => { setSendModalContext("post"); setSendModal(true); }}>
                      <i className="ti ti-send" />Send to client
                    </button>
                    <button className="gb gbr" style={{ justifyContent: "center" }} disabled={!!postActionLoading} onClick={() => selectedPost && requestRevision(selectedPost.id)}>
                      {postActionLoading === "revise" ? <><span style={{ display: "inline-block", width: 11, height: 11, border: "2px solid rgba(255,107,107,.3)", borderTopColor: "var(--red)", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Requesting…</> : <><i className="ti ti-refresh" />Request revision</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Design queue ── */}
        {tab === 3 && (
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "8px 22px", borderBottom: "1px solid var(--tb-b)", display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center", flexShrink: 0 }}>
              {[["All", null], ["Published", "PUBLISHED"], ["Generating", "IN_DESIGN"], ["Awaiting review", "AWAITING_APPROVAL"], ["Revision", "REVISION_REQUIRED"]].map(([label, st]) => {
                const count = st ? posts.filter((p) => p.status === st).length : posts.length;
                const isActive = designFilter === (st ?? null);
                return (
                  <span
                    key={label as string}
                    className={`flt${isActive ? " act" : ""}`}
                    onClick={() => setDesignFilter(st as string | null)}
                    style={{ cursor: "pointer", color: !isActive && st === "REVISION_REQUIRED" ? "var(--red)" : undefined }}
                  >
                    {label as string} ({count})
                  </span>
                );
              })}
              <button className="gb gbp gbs" style={{ marginLeft: "auto" }} onClick={() => setDrawerOpen(true)}><i className="ti ti-upload" style={{ fontSize: 10 }} />Upload creative</button>
            </div>
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {(() => {
                  const visible = designFilter ? posts.filter((p) => p.status === designFilter) : posts;
                  if (visible.length === 0) return (
                    <div style={{ padding: "48px 22px", textAlign: "center", color: "var(--t4)" }}>
                      <i className="ti ti-photo-off" style={{ fontSize: 32, display: "block", marginBottom: 10 }} />
                      <div style={{ fontSize: 12 }}>{designFilter ? `No ${designFilter.replace(/_/g, " ").toLowerCase()} posts` : "No design items yet"}</div>
                    </div>
                  );
                  return visible.map((p) => {
                  const isRevision = p.status === "REVISION_REQUIRED";
                  const isReview = ["AWAITING_APPROVAL","CREATIVE_UPLOADED"].includes(p.status);
                  const isPublished = p.status === "PUBLISHED";
                  const isGenerating = ["DRAFT","IN_DESIGN"].includes(p.status);
                  const { cls, icon, color } = isPublished ? { cls: "dqtp", icon: "ti-check", color: "var(--green)" }
                    : isReview ? { cls: "dqtw", icon: "ti-photo", color: "var(--blue)" }
                    : isRevision ? { cls: "dqtr", icon: "ti-alert-circle", color: "var(--red)" }
                    : isGenerating ? { cls: "dqta", icon: "ti-robot", color: "var(--green)" }
                    : { cls: "dqti", icon: "ti-upload", color: "var(--amber)" };
                  const pillCls = isPublished ? "plg" : isReview ? "plb" : isRevision ? "plr" : isGenerating ? "pla" : "plp";
                  return (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: "1px solid var(--row-b)", cursor: "pointer", background: isRevision ? "var(--rb)" : selectedPost?.id === p.id ? "var(--in)" : undefined }}
                      onClick={() => { setSelectedPost(p); setDrawerOpen(true); }}>
                      <div className={`dqt ${cls}`}><i className={`ti ${icon}`} style={{ color, fontSize: 14 }} /></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 300, color: "var(--t1)" }}>{p.topic ?? p.hook ?? "Post"}</div>
                        <div style={{ fontSize: 10, color: "var(--t4)", marginTop: 2, fontWeight: 300 }}>
                          {p.scheduledDate ? new Date(p.scheduledDate).toLocaleDateString("en", { month: "short", day: "numeric" }) : "—"} · {p.platform} · {p.format} · {p.status?.replace(/_/g, " ")}
                        </div>
                      </div>
                      <span className={`pl ${pillCls}`}>{p.status?.replace(/_/g, " ")}</span>
                      {isReview && <div style={{ display: "flex", gap: 4 }}><button className="gb gbs gbp" onClick={(e) => { e.stopPropagation(); approvePost(p.id); }}>Approve</button><button className="gb gbs gba" onClick={(e) => { e.stopPropagation(); setSelectedPost(p); setSendModalContext("post"); setSendModal(true); }}>Client</button><button className="gb gbs gbr" onClick={(e) => { e.stopPropagation(); requestRevision(p.id); }}>Revise</button></div>}
                      {isRevision && <div style={{ display: "flex", gap: 4 }}><button className="gb gbs" onClick={(e) => { e.stopPropagation(); setSelectedPost(p); setDrawerOpen(true); }}>Notes</button><button className="gb gbs gbbl" onClick={(e) => { e.stopPropagation(); setUploadPostId(p.id); setUploadModal(true); }}><i className="ti ti-upload" style={{ fontSize: 9 }} />Re-upload</button></div>}
                      {!isReview && !isRevision && <button className="gb gbs" onClick={(e) => e.stopPropagation()}>View</button>}
                    </div>
                  );
                  });
                })()}
              </div>
              {/* Side drawer */}
              {drawerOpen && selectedPost && (
                <div className="sd">
                  <div className="sdh">
                    <div className="sdt">{selectedPost.topic ?? selectedPost.hook ?? "Post"}</div>
                    <button className="sdc" onClick={() => setDrawerOpen(false)}><i className="ti ti-x" style={{ fontSize: 10 }} /></button>
                  </div>
                  <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--row-b)" }}>
                    <div className="cpv">
                      <div className="cpb">{(client?.name ?? "CLIENT").toUpperCase()}</div>
                      <div className="cph">{selectedPost.hook ?? selectedPost.topic ?? "Post"}</div>
                      {selectedPost.caption && <div className="cps">{selectedPost.caption.slice(0, 60)}</div>}
                      <div className="cpbg"><i className="ti ti-robot" style={{ fontSize: 9 }} /> AI v1</div>
                    </div>
                  </div>
                  <div className="sdb">
                    {selectedPost.caption && <><div className="fll">Caption</div><div className="ib" style={{ fontSize: 10, marginBottom: 8 }}>{selectedPost.caption}</div></>}
                    {selectedPost.creativeNote && <><div className="fll">Creative direction</div><div className="ib" style={{ fontSize: 10, marginBottom: 8 }}>{selectedPost.creativeNote}</div></>}
                    {selectedPost.hook && <><div className="fll">Hook</div><div className="ib" style={{ fontSize: 10, marginBottom: 10 }}>{selectedPost.hook}</div></>}
                  </div>
                  <div className="sda">
                    <button className="gb gbp" style={{ justifyContent: "center" }} disabled={!!postActionLoading} onClick={() => selectedPost && approvePost(selectedPost.id)}>
                      {postActionLoading === "approve" ? <><span style={{ display: "inline-block", width: 11, height: 11, border: "2px solid rgba(0,0,0,.2)", borderTopColor: "#000", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Approving…</> : <><i className="ti ti-check" style={{ fontSize: 11 }} />{selectedPost?.status === "APPROVED" ? "Approved ✓" : "Approve"}</>}
                    </button>
                    <button className="gb gba" style={{ justifyContent: "center" }} disabled={!!postActionLoading} onClick={() => { setSendModalContext("post"); setSendModal(true); }}>
                      <i className="ti ti-send" style={{ fontSize: 11 }} />Send to client
                    </button>
                    <button className="gb gbr" style={{ justifyContent: "center" }} disabled={!!postActionLoading} onClick={() => selectedPost && requestRevision(selectedPost.id)}>
                      {postActionLoading === "revise" ? <><span style={{ display: "inline-block", width: 11, height: 11, border: "2px solid rgba(255,107,107,.3)", borderTopColor: "var(--red)", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Requesting…</> : <><i className="ti ti-refresh" style={{ fontSize: 11 }} />Request revision</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Publishing ── */}
        {tab === 4 && (
          <div className="sa">
            <div className="g4" style={{ marginBottom: 14 }}>
              {[["Published","PUBLISHED","var(--green)"],["Scheduled","SCHEDULED","var(--blue)"],["Pending design","IN_DESIGN","var(--amber)"],["Failed","FAILED","var(--red)"]].map(([label, st, color]) => (
                <div key={label as string} className="mt"><div className="ml">{label as string}</div><div className="mv" style={{ color: color as string }}>{posts.filter((p) => p.status === st).length}</div></div>
              ))}
            </div>
            {posts.some((p) => p.status === "APPROVED") && (
              <div style={{ marginBottom: 10, display: "flex", justifyContent: "flex-end" }}>
                <button className="gb gbp" onClick={queueForPublishing} disabled={queueing}>
                  <i className="ti ti-send" />
                  {queueing ? "Queuing…" : `Queue ${posts.filter((p) => p.status === "APPROVED").length} approved post${posts.filter((p) => p.status === "APPROVED").length !== 1 ? "s" : ""}`}
                </button>
              </div>
            )}
            <div className="cd" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--row-b)", background: "var(--in)" }}>
                <span style={{ fontSize: 9, color: "var(--t4)", letterSpacing: ".07em", textTransform: "uppercase", fontWeight: 400 }}>
                  {MONTHS[TODAY.getMonth()]} {TODAY.getFullYear()} schedule
                </span>
              </div>
              <table className="tbl">
                <thead><tr><th>Post</th><th>Platform</th><th>Scheduled</th><th>Status</th><th>Live</th><th /></tr></thead>
                <tbody>
                  {posts.length === 0 ? <tr><td colSpan={6} style={{ textAlign: "center", padding: "24px 12px", color: "var(--t4)" }}>No posts in publishing queue</td></tr> : posts.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontSize: 12, fontWeight: 300, color: "var(--t1)" }}>{p.topic ?? p.hook ?? "Post"}</td>
                      <td><i className={`ti ti-brand-${p.platform ?? "instagram"}`} style={{ fontSize: 13, color: "var(--t3)" }} /></td>
                      <td style={{ fontSize: 11, color: "var(--t3)" }}>{p.scheduledDate ? new Date(p.scheduledDate).toLocaleDateString("en", { month: "short", day: "numeric" }) + " · " + new Date(p.scheduledDate).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                      <td><span className={`pl ${p.status === "PUBLISHED" ? "plg" : p.status === "SCHEDULED" ? "plb" : p.status === "FAILED" ? "plr" : "pla"}`}>{p.status?.replace(/_/g, " ")}</span></td>
                      <td>{p.status === "PUBLISHED" ? <a href={p.postUrl ?? "#"} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: "var(--green)", textDecoration: "none" }}>View</a> : p.status === "FAILED" ? <span style={{ fontSize: 10, color: retryingPostId === p.id ? "var(--t4)" : "var(--red)", cursor: retryingPostId === p.id ? "default" : "pointer", fontWeight: 300 }} onClick={() => !retryingPostId && retryPost(p.id)}>{retryingPostId === p.id ? "Retrying…" : "Retry now"}</span> : null}</td>
                      <td>{p.status === "SCHEDULED" && <span style={{ fontSize: 10, color: "var(--t4)", cursor: "pointer", fontWeight: 300 }}>Edit time</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Analytics ── */}
        {tab === 5 && (() => {
          const v = (val: number | null | undefined, fmt?: (n: number) => string) =>
            analyticsLoading ? "…" : val != null ? (fmt ? fmt(val) : String(val)) : "—";
          const { line: chartLine, area: chartArea } = timelineToPath(analytics?.timeline ?? []);

          const PLATFORM_ICON: Record<string, string> = {
            instagram: "ti-brand-instagram", linkedin: "ti-brand-linkedin",
            tiktok: "ti-brand-tiktok", x: "ti-brand-x",
          };
          const FORMAT_COLOR: Record<string, string> = {
            carousel: "var(--green)", static: "var(--blue)", reel: "var(--amber)",
            story: "var(--bar-tr)", thread: "var(--t3)",
          };

          const platforms: { platform: string; count: number }[] = analytics?.postsByPlatform ?? [];
          const platformTotal = platforms.reduce((s: number, p: any) => s + p.count, 0) || 1;

          const formats: { format: string; count: number }[] = analytics?.postsByFormat ?? [];
          const formatMax = Math.max(...formats.map((f: any) => f.count), 1);

          return (
          <div className="sa">
            {/* Period selector + action buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 3 }}>
                {(["15d","30d","60d","90d"] as const).map((p) => (
                  <span key={p} onClick={() => setAnalyticsPeriod(p)} style={{
                    padding: "4px 10px", fontSize: 10, borderRadius: 20, cursor: "pointer", fontWeight: 300,
                    border: `1px solid ${analyticsPeriod === p ? "var(--gbb)" : "var(--in-b)"}`,
                    color: analyticsPeriod === p ? "var(--green)" : "var(--t4)",
                    background: analyticsPeriod === p ? "var(--gb)" : "transparent",
                  }}>{p}</span>
                ))}
              </div>
              <button className="gb gbp" style={{ marginLeft: "auto" }}><i className="ti ti-robot" style={{ fontSize: 11 }} />AI report</button>
              <button className="gb"><i className="ti ti-download" style={{ fontSize: 11 }} />Export</button>
            </div>

            {/* Stat cards */}
            <div className="g5" style={{ marginBottom: 14 }}>
              <div className="mt">
                <div className="ml">Total reach</div>
                <div className="mv">{v(analytics?.totalReach, fmtNum)}</div>
                <div className="ms">{analytics?.totalReach != null ? "Instagram" : "Need manage_insights"}</div>
              </div>
              <div className="mt">
                <div className="ml">Engagement</div>
                <div className="mv" style={{ color: analytics?.engagementRate != null ? "var(--green)" : undefined }}>
                  {v(analytics?.engagementRate, (n) => `${n}%`)}
                </div>
                <div className="ms" style={{ color: analytics?.engagementRate != null ? "var(--green)" : undefined }}>
                  {analytics?.engagementRate != null ? "avg per post" : "—"}
                </div>
              </div>
              <div className="mt">
                <div className="ml">Posts</div>
                <div className="mv">{analyticsLoading ? "…" : analytics?.postsPublished ?? posts.filter((p) => p.status === "PUBLISHED").length}</div>
                <div className="ms">published</div>
              </div>
              <div className="mt">
                <div className="ml">Followers</div>
                <div className="mv" style={{ color: analytics?.followersGained != null && analytics.followersGained > 0 ? "var(--green)" : undefined }}>
                  {analyticsLoading ? "…" : analytics?.followersGained != null ? (analytics.followersGained >= 0 ? "+" : "") + analytics.followersGained : "—"}
                </div>
                <div className="ms">{analytics?.followersGained != null ? `last ${analyticsPeriod}` : "Need 2+ days"}</div>
              </div>
              <div className="mt">
                <div className="ml">Publish rate</div>
                <div className="mv" style={{ color: analytics?.publishSuccessRate >= 80 ? "var(--green)" : undefined }}>
                  {v(analytics?.publishSuccessRate, (n) => `${n}%`)}
                </div>
                <div className="ms">success rate</div>
              </div>
            </div>

            {/* Chart */}
            <div className="cd" style={{ marginBottom: 10 }}>
              <div className="cdt">Posts published — last {analyticsPeriod}</div>
              <svg className="csvg" viewBox="0 0 560 76" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gfcd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d97b" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#34d97b" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="14" x2="560" y2="14" stroke="rgba(255,255,255,.05)" strokeWidth="1" />
                <line x1="0" y1="38" x2="560" y2="38" stroke="rgba(255,255,255,.05)" strokeWidth="1" />
                {chartArea && <path d={chartArea} fill="url(#gfcd)" />}
                <path d={chartLine} fill="none" stroke="#34d97b" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            <div className="g2e" style={{ marginBottom: 10 }}>
              {/* Format performance */}
              <div className="cd">
                <div className="cdt">Format performance</div>
                <div className="bch">
                  {formats.length > 0 ? formats.map((f: any) => (
                    <div key={f.format} className="bw">
                      <div className="bv">{f.count}</div>
                      <div className="bar" style={{ height: `${Math.round((f.count / formatMax) * 100)}%`, background: FORMAT_COLOR[f.format] ?? "var(--t3)" }} />
                      <div className="bl">{f.format.charAt(0).toUpperCase() + f.format.slice(1)}</div>
                    </div>
                  )) : (
                    <div style={{ color: "var(--t4)", fontSize: 10, padding: "8px 0" }}>No published posts yet</div>
                  )}
                </div>
              </div>

              {/* Posts by platform */}
              <div className="cd">
                <div className="cdt">Posts by platform</div>
                {platforms.length > 0 ? platforms.map((p: any) => (
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
                  <div style={{ color: "var(--t4)", fontSize: 10, padding: "8px 0" }}>No data yet</div>
                )}
              </div>
            </div>

            {/* Competitor benchmark — static placeholder */}
            <div className="cd">
              <div className="cdt">Competitor benchmark</div>
              {[{ name: client?.name ?? "Client", v: "—", pct: 0, own: true }, { name: "Competitor A", v: "—", pct: 0 }, { name: "Competitor B", v: "—", pct: 0 }].map((c) => (
                <div key={c.name} className={`cr${c.own ? " own" : ""}`}>
                  <div className="cn">{c.name}{c.own ? " ✦" : ""}</div>
                  <div className="ctr"><div className="cbr" style={{ width: `${c.pct}%`, background: c.own ? "var(--green)" : "var(--bar-tr)" }} /></div>
                  <div className="cv">{c.v}</div>
                </div>
              ))}
            </div>
          </div>
          );
        })()}

        {/* ── Settings ── */}
        {tab === 6 && (
          <div className="sa">
            <div className="g2e">
              <div>
                <div className="slb" style={{ marginBottom: 8 }}>Client details</div>
                {[{ label: "Business name", value: client.name },{ label: "POC email", value: client.contactEmail, green: true },{ label: "Posts/month", value: client.postingFrequency ?? 12 }].map((row) => (
                  <div key={row.label} className="sr2">
                    <div><div className="srl">{row.label}</div></div>
                    <div style={{ display: "flex", gap: 7, alignItems: "center" }}><span style={{ fontSize: 11, color: row.green ? "var(--green)" : "var(--t2)", fontWeight: 300 }}>{row.value ?? "—"}</span><button className="gb gbs">Edit</button></div>
                  </div>
                ))}
                <div className="slb" style={{ marginBottom: 8, marginTop: 14 }}>Client portal access</div>
                <div className="sr2">
                  <div>
                    <div className="srl">Portal user</div>
                    <div className="srls">This person logs in as CLIENT to approve content</div>
                  </div>
                  <select
                    value={client.clientUserId ?? ""}
                    onChange={async (e) => {
                      const v = e.target.value;
                      await api.clients.update(clientId, { clientUserId: v || null });
                      setClient((prev: any) => ({ ...prev, clientUserId: v || null }));
                    }}
                    style={{ background: "var(--fi)", border: "1px solid var(--fi-b)", borderRadius: 7, padding: "5px 8px", fontSize: 10, color: "var(--t2)", outline: "none", cursor: "pointer", fontFamily: "Inter,system-ui", maxWidth: 180 }}
                  >
                    <option value="">— Not assigned —</option>
                    {allUsers.filter((u: any) => u.role === "CLIENT").map((u: any) => (
                      <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <div className="slb" style={{ marginBottom: 8, marginTop: 14 }}>Connected channels</div>
                {CHANNELS.map((ch) => {
                  const conn = connections.find((c) => c.platform === ch.dbPlatform);
                  return (
                    <div key={ch.label} className="sr2">
                      <div>
                        <div className="srl"><i className={`ti ${ch.icon}`} style={{ color: ch.color, fontSize: 12 }} /> {ch.label}</div>
                        {conn?.accountName && <div className="srls">{conn.accountName}</div>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        {conn
                          ? <span className="pl plg" style={{ fontSize: 9 }}>Connected</span>
                          : <span style={{ fontSize: 10, color: "var(--t4)", fontWeight: 300 }}>Not connected</span>}
                        {conn
                          ? <button className="gb gbs gbr" onClick={() => disconnectPlatform(conn.id)}>Disconnect</button>
                          : <button className="gb gbs" disabled={connectingPlatform === ch.oauthPlatform} onClick={() => connectPlatform(ch.oauthPlatform)}>
                              {connectingPlatform === ch.oauthPlatform ? "Redirecting…" : "Connect"}
                            </button>}
                      </div>
                    </div>
                  );
                })}
                <div className="slb" style={{ marginBottom: 8, marginTop: 14, color: "var(--red)" }}>Danger zone</div>
                <div className="sr2" style={{ border: "1px solid var(--rbb)" }}><div><div className="srl">Archive client</div><div className="srls">Hides from dashboard, keeps data</div></div><button className="gb gbs gbr">Archive</button></div>
                <div className="sr2" style={{ border: "1px solid var(--rbb)" }}><div><div className="srl">Delete client</div><div className="srls">Permanent — irreversible</div></div><button className="gb gbs gbr">Delete</button></div>
              </div>
              <div>
                <div className="slb" style={{ marginBottom: 8 }}>Notifications</div>
                {["Strategy approval alerts","Client feedback alerts","Publishing failure alerts","Monthly report to client"].map((n) => (
                  <div key={n} className="sr2">
                    <div><div className="srl">{n}</div></div>
                    <div className="tsw on" onClick={(e) => { const t = e.currentTarget; t.classList.toggle("on"); t.classList.toggle("off"); }} />
                  </div>
                ))}
                <div className="slb" style={{ marginBottom: 8, marginTop: 14 }}>Design team</div>
                <div className="sr2">
                  <div><div className="srl">Current team type</div></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ fontSize: 11, color: "var(--green)", fontWeight: 300 }}>AI agents</span><button className="gb gbs">Change</button></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Approve modal */}
      {approveModal && (
        <div className="mo" onClick={(e) => { if (e.target === e.currentTarget && !approving) setApproveModal(false); }}>
          <div className="mb">
            <div className="mbt">Approve strategy &amp; generate calendar</div>
            <div className="mbs">This approves the strategy and immediately kicks off calendar generation for {client?.name}.</div>
            <div className="mbb">
              <button className="gb gbg" onClick={() => setApproveModal(false)} disabled={approving}>Cancel</button>
              <button className="gb gbp" onClick={approveStrategy} disabled={approving}>
                {approving ? (
                  <><span style={{ display: "inline-block", width: 12, height: 12, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Approving…</>
                ) : (
                  <><i className="ti ti-check" /> Approve &amp; generate calendar</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send modal */}
      {sendModal && (
        <div className="mo" onClick={(e) => { if (e.target === e.currentTarget) setSendModal(false); }}>
          <div className="mb">
            <div className="mbt">Send to client for approval</div>
            <div className="mbs">{client.contactName ?? "Client"} ({client.contactEmail ?? "—"}) will receive an email with a link to their portal.</div>
            <div className="fl" style={{ marginBottom: 12 }}><label>Optional message</label><textarea placeholder="Add a note…" style={{ minHeight: 52 }} /></div>
            <div className="mbb">
              <button className="gb gbg" onClick={() => setSendModal(false)} disabled={sendLoading}>Cancel</button>
              <button className="gb gbp" onClick={handleSendToClient} disabled={sendLoading}>
                {sendLoading ? <><span style={{ display: "inline-block", width: 12, height: 12, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Sending…</> : <><i className="ti ti-send" /> Send</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload creative modal */}
      {uploadModal && (
        <div className="mo" onClick={(e) => { if (e.target === e.currentTarget && !uploading) { setUploadModal(false); setUploadPostId(null); setUploadFile(null); } }}>
          <div className="mb">
            <div className="mbt">Upload creative file</div>
            <div className="mbs">Upload the final creative. Accepted: JPG, PNG, MP4, MOV, ZIP. Max 200 MB.</div>
            <div style={{ border: `2px dashed ${uploadFile ? "var(--green)" : "var(--gbb)"}`, borderRadius: 12, padding: 28, textAlign: "center", background: "var(--gb)", marginBottom: 12, transition: "border-color .15s" }}>
              <input id="client-upload-creative" type="file" accept=".jpg,.jpeg,.png,.mp4,.mov,.zip" style={{ display: "none" }}
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)} />
              <label htmlFor="client-upload-creative" style={{ cursor: "pointer", display: "block" }}>
                <i className="ti ti-upload" style={{ fontSize: 28, color: "var(--green)", display: "block", marginBottom: 8 }} />
                {uploadFile ? (
                  <div style={{ fontSize: 12, color: "var(--t1)", fontWeight: 300 }}>{uploadFile.name}</div>
                ) : (
                  <>
                    <div style={{ fontSize: 13, fontWeight: 300, color: "var(--t1)" }}>Drop file here or click to browse</div>
                    <div style={{ fontSize: 10, color: "var(--t4)", marginTop: 4 }}>JPG · PNG · MP4 · MOV · ZIP up to 200 MB</div>
                  </>
                )}
              </label>
            </div>
            <div className="mbb">
              <button className="gb gbg" onClick={() => { setUploadModal(false); setUploadPostId(null); setUploadFile(null); }} disabled={uploading}>Cancel</button>
              <button className="gb gbp" onClick={handleUploadAsset} disabled={!uploadFile || uploading}>
                {uploading ? <><span style={{ display: "inline-block", width: 12, height: 12, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Uploading…</> : <><i className="ti ti-upload" /> Upload &amp; submit</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
