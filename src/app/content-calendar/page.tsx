"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useApi } from "@/hooks/useApi";
import { useRoleGuard } from "@/hooks/useRoleGuard";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const TODAY = new Date();

const CLIENT_COLORS: Record<string, string> = {
  0: "cof", 1: "cbl", 2: "cns", 3: "ckr", 4: "caw",
};

function buildCalendarCells(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const prevDays = new Date(year, month, 0).getDate();
  const cells: { day: number; current: boolean; today: boolean }[] = [];
  for (let i = offset - 1; i >= 0; i--) cells.push({ day: prevDays - i, current: false, today: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true, today: d === TODAY.getDate() && month === TODAY.getMonth() && year === TODAY.getFullYear() });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - (offset + daysInMonth) + 1, current: false, today: false });
  return cells;
}

export default function ContentCalendarPage() {
  const api = useApi();
  const { checking } = useRoleGuard(["ADMIN"]);
  const [clients, setClients] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [calView, setCalView] = useState<"grid" | "list">("grid");
  const [filterClient, setFilterClient] = useState("all");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFormat, setFilterFormat] = useState("all");
  const [filterDesigner, setFilterDesigner] = useState("all");
  const [curYear, setCurYear] = useState(TODAY.getFullYear());
  const [curMonth, setCurMonth] = useState(TODAY.getMonth());
  const [drawerPost, setDrawerPost] = useState<any>(null);
  const [postActionLoading, setPostActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (checking) return;
    (async () => {
      try {
        const clientData = await api.clients.list();
        setClients(clientData);
        const allPosts: any[] = [];
        for (const c of clientData.slice(0, 5)) {
          try { const p = await api.posts.listByClient(c.id); allPosts.push(...p.map((x: any) => ({ ...x, clientName: c.name }))); } catch {}
        }
        setPosts(allPosts);
      } catch {}
      finally { setLoading(false); }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking]);

  if (checking) return null;

  const filteredPosts = posts.filter((p) => {
    if (filterClient !== "all" && p.clientName !== filterClient) return false;
    if (filterPlatform !== "all" && p.platform !== filterPlatform) return false;
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    if (filterFormat !== "all" && p.format !== filterFormat) return false;
    if (filterDesigner !== "all" && p.designer !== filterDesigner) return false;
    if (p.scheduledDate) {
      const d = new Date(p.scheduledDate);
      return d.getFullYear() === curYear && d.getMonth() === curMonth;
    }
    return true;
  });

  const cells = buildCalendarCells(curYear, curMonth);

  function getPostsForDay(day: number) {
    return filteredPosts.filter((p) => {
      if (!p.scheduledDate) return false;
      const d = new Date(p.scheduledDate);
      return d.getDate() === day && d.getMonth() === curMonth && d.getFullYear() === curYear;
    });
  }

  const clientColorMap: Record<string, string> = {};
  clients.forEach((c, i) => { clientColorMap[c.name] = CLIENT_COLORS[i % 5] ?? "cof"; });

  function prevMonth() { if (curMonth === 0) { setCurMonth(11); setCurYear((y) => y - 1); } else { setCurMonth((m) => m - 1); } }
  function nextMonth() { if (curMonth === 11) { setCurMonth(0); setCurYear((y) => y + 1); } else { setCurMonth((m) => m + 1); } }

  async function calApprovePost(postId: string) {
    setPostActionLoading(`approve-${postId}`);
    try {
      await api.posts.approve(postId, "APPROVED", "");
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, status: "APPROVED" } : p));
      setDrawerPost((d: any) => d?.id === postId ? { ...d, status: "APPROVED" } : d);
    } catch {}
    setPostActionLoading(null);
  }

  async function calRevisePost(postId: string) {
    setPostActionLoading(`revise-${postId}`);
    try {
      await api.posts.approve(postId, "CHANGES_REQUESTED", "");
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, status: "REVISION_REQUIRED" } : p));
      setDrawerPost((d: any) => d?.id === postId ? { ...d, status: "REVISION_REQUIRED" } : d);
    } catch {}
    setPostActionLoading(null);
  }

  return (
    <DashboardShell title="Calendars">
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        {/* Filters */}
        <div className="fst">
          <div className="fg2">
            <div className="fgl">Client</div>
            <select className="fs" value={filterClient} onChange={(e) => setFilterClient(e.target.value)}>
              <option value="all">All clients</option>
              {clients.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="fg2">
            <div className="fgl">Channel</div>
            <select className="fs" value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)}>
              <option value="all">All channels</option>
              {["instagram","linkedin","facebook","tiktok","x"].map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
          </div>
          <div className="fg2">
            <div className="fgl">Status</div>
            <select className="fs" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All statuses</option>
              {["PUBLISHED","SCHEDULED","IN_DESIGN","AWAITING_APPROVAL","REVISION_REQUIRED"].map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </select>
          </div>
          <div className="fg2">
            <div className="fgl">Format</div>
            <select className="fs" value={filterFormat} onChange={(e) => setFilterFormat(e.target.value)}>
              <option value="all">All formats</option>
              {["Static","Reel","Carousel","Story"].map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="fg2">
            <div className="fgl">Designer</div>
            <select className="fs" value={filterDesigner} onChange={(e) => setFilterDesigner(e.target.value)}>
              <option value="all">All designers</option>
              <option value="AI">AI agents</option>
              <option value="Dana M.">Dana M.</option>
            </select>
          </div>
          <div className="fg2">
            <div className="fgl">Month</div>
            <select className="fs" value={`${curYear}-${curMonth}`} onChange={(e) => { const [y, m] = e.target.value.split("-"); setCurYear(Number(y)); setCurMonth(Number(m)); }}>
              {[-1,0,1,2,3].map((offset) => {
                let m = TODAY.getMonth() + offset, y = TODAY.getFullYear();
                if (m < 0) { m += 12; y -= 1; } if (m > 11) { m -= 12; y += 1; }
                return <option key={`${y}-${m}`} value={`${y}-${m}`}>{MONTHS[m]} {y}</option>;
              })}
            </select>
          </div>
          <div className="vt" style={{ alignSelf: "flex-end" }}>
            <button className={`vtb${calView === "grid" ? " on" : ""}`} onClick={() => setCalView("grid")}><i className="ti ti-calendar" /></button>
            <button className={`vtb${calView === "list" ? " on" : ""}`} onClick={() => setCalView("list")}><i className="ti ti-list" /></button>
          </div>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 22px" }}>
            {/* Month navigation */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button className="gb gbg gbs" onClick={prevMonth}><i className="ti ti-chevron-left" /></button>
                <div style={{ fontSize: 15, fontWeight: 300, color: "var(--t1)" }}>{MONTHS[curMonth]} {curYear}</div>
                <button className="gb gbg gbs" onClick={nextMonth}><i className="ti ti-chevron-right" /></button>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {clients.slice(0, 5).map((c, i) => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "var(--t4)" }}>
                    <div style={{ width: 7, height: 7, borderRadius: 2, background: ["var(--blue)","var(--green)","var(--purple)","var(--amber)","var(--red)"][i % 5] }} />
                    {c.name.split(" ")[0]}
                  </div>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
                <div style={{ width: 28, height: 28, border: "2px solid rgba(52,217,123,.2)", borderTopColor: "#34d97b", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              </div>
            ) : calView === "grid" ? (
              <div className="cg">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <div key={d} className="dh">{d}</div>)}
                {cells.map((cell, i) => {
                  const dayPosts = cell.current ? getPostsForDay(cell.day) : [];
                  return (
                    <div key={i} className={`dc${!cell.current ? " om" : ""}${cell.today ? " td" : ""}`}>
                      <div className="dnw"><div className="dn">{cell.day}</div></div>
                      {dayPosts.slice(0, 3).map((p, j) => (
                        <div key={j} className={`pc ${clientColorMap[p.clientName] ?? "cof"}`} onClick={() => setDrawerPost(p)}>
                          <i className={`ti ti-brand-${p.platform}`} style={{ fontSize: 6 }} />
                          {(p.clientName ?? "").split(" ")[0]}·{(p.topic ?? p.format ?? "").slice(0, 6)}
                        </div>
                      ))}
                      {dayPosts.length > 3 && <div style={{ fontSize: 7, color: "var(--t4)", padding: "1px 4px" }}>+{dayPosts.length - 3} more</div>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="cd" style={{ padding: 0, overflow: "hidden" }}>
                {filteredPosts.length === 0 ? (
                  <div style={{ padding: "24px 14px", textAlign: "center", fontSize: 11, color: "var(--t4)" }}>No posts this month</div>
                ) : filteredPosts.sort((a, b) => new Date(a.scheduledDate ?? 0).getTime() - new Date(b.scheduledDate ?? 0).getTime()).map((p) => (
                  <div key={p.id} className="clr" style={{ cursor: "pointer" }} onClick={() => setDrawerPost(p)}>
                    <div className="cld">{p.scheduledDate ? new Date(p.scheduledDate).toLocaleDateString("en", { month: "short", day: "numeric" }) : "—"}</div>
                    <span className={`ctg ct${(clientColorMap[p.clientName] ?? "of").replace("c","").replace("of","of").slice(0, 2)}`} style={{ fontSize: 10 }}>{(p.clientName ?? "").split(" ").map((w: string) => w[0]).join("").slice(0, 2)}</span>
                    <div className="clt">{p.topic ?? p.hook ?? "Post"}</div>
                    <span className="pl plb" style={{ fontSize: 9 }}>{p.platform}</span>
                    <span style={{ fontSize: 10, color: "var(--t3)", fontWeight: 300 }}>{p.format}</span>
                    <span className={`pl ${p.status === "PUBLISHED" ? "plg" : p.status === "SCHEDULED" ? "plb" : p.status === "REVISION_REQUIRED" ? "plr" : "pla"}`} style={{ fontSize: 9 }}>{p.status?.replace(/_/g," ")}</span>
                    <button className="gb gbs">View</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Side drawer */}
          {drawerPost && (
            <div className="sd">
              <div className="sdh">
                <div className="sdt">{drawerPost.topic ?? "Post detail"}</div>
                <button className="sdc" onClick={() => setDrawerPost(null)}><i className="ti ti-x" style={{ fontSize: 10 }} /></button>
              </div>
              <div className="sdb">
                <div className="sdr"><span className="sdl">Post</span><span className="sdv">{drawerPost.topic ?? drawerPost.hook ?? "—"}</span></div>
                <div className="sdr"><span className="sdl">Client</span><span className="sdv">{drawerPost.clientName}</span></div>
                <div className="sdr"><span className="sdl">Platform</span><span className="sdv">{drawerPost.platform}</span></div>
                <div className="sdr"><span className="sdl">Format</span><span className="sdv">{drawerPost.format}</span></div>
                <div className="sdr"><span className="sdl">Status</span><span className="sdv" style={{ color: drawerPost.status === "PUBLISHED" ? "var(--green)" : drawerPost.status === "REVISION_REQUIRED" ? "var(--red)" : "var(--amber)" }}>{drawerPost.status?.replace(/_/g," ")}</span></div>
                {drawerPost.caption && (<><div className="fll">Caption</div><div className="ib" style={{ fontSize: 10 }}>{drawerPost.caption}</div></>)}
              </div>
              <div className="sda">
                <button className="gb gbp" style={{ justifyContent: "center" }} disabled={!!postActionLoading} onClick={() => calApprovePost(drawerPost.id)}>
                  {postActionLoading === `approve-${drawerPost.id}` ? <><span style={{ display: "inline-block", width: 11, height: 11, border: "2px solid rgba(0,0,0,.2)", borderTopColor: "#000", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Approving…</> : <><i className="ti ti-check" />{drawerPost.status === "APPROVED" ? "Approved ✓" : "Approve"}</>}
                </button>
                <button className="gb gba" style={{ justifyContent: "center" }} disabled={!!postActionLoading}>
                  <i className="ti ti-send" />Send to client
                </button>
                <button className="gb gbr" style={{ justifyContent: "center" }} disabled={!!postActionLoading} onClick={() => calRevisePost(drawerPost.id)}>
                  {postActionLoading === `revise-${drawerPost.id}` ? <><span style={{ display: "inline-block", width: 11, height: 11, border: "2px solid rgba(255,107,107,.3)", borderTopColor: "var(--red)", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Requesting…</> : <><i className="ti ti-refresh" />Request revision</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
