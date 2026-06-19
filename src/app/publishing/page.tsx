"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useApi } from "@/hooks/useApi";
import { useRoleGuard } from "@/hooks/useRoleGuard";

export default function PublishingPage() {
  const api = useApi();
  const { checking } = useRoleGuard(["ADMIN"]);
  const [clients, setClients] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [log, setLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterClient, setFilterClient] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (checking) return;
    (async () => {
      try {
        const [queueData, logData, clientData] = await Promise.all([
          api.publishing.getQueue(),
          api.publishing.getLog(),
          api.clients.list(),
        ]);
        setQueue(queueData ?? []);
        setLog(logData ?? []);
        setClients(clientData ?? []);
      } catch {}
      finally { setLoading(false); }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking]);

  if (checking) return null;

  const allPosts = [...queue, ...log];
  const filtered = allPosts.filter((p) => {
    if (filterStatus !== "all") {
      const s = p.publishLog?.status ?? p.status;
      if (s !== filterStatus) return false;
    }
    return true;
  });

  const published = filtered.filter((p) => (p.publishLog?.status ?? p.status) === "PUBLISHED").length;
  const scheduled = filtered.filter((p) => (p.publishLog?.status ?? p.status) === "SCHEDULED").length;
  const pending = filtered.filter((p) => ["DRAFT","IN_DESIGN","AWAITING_APPROVAL"].includes(p.status)).length;
  const failed = filtered.filter((p) => (p.publishLog?.status ?? p.status) === "FAILED").length;

  async function retry(postId: string) {
    try { await api.publishing.retryFailed(postId); } catch {}
  }

  return (
    <DashboardShell title="Publishing">
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        {/* Filters */}
        <div className="fst">
          <div className="fg2">
            <div className="fgl">Client</div>
            <select className="fs" value={filterClient} onChange={(e) => setFilterClient(e.target.value)}>
              <option value="all">All clients</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="fg2">
            <div className="fgl">Status</div>
            <select className="fs" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="PUBLISHED">Published</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="FAILED">Failed</option>
              <option value="IN_DESIGN">Pending design</option>
            </select>
          </div>
          <div className="fg2">
            <div className="fgl">Platform</div>
            <select className="fs">
              <option>All platforms</option>
              {["Instagram","LinkedIn","TikTok","X"].map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="fg2">
            <div className="fgl">Month</div>
            <select className="fs">
              <option>June 2026</option>
              <option>July 2026</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="sbar" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
          <div className="sc2"><div className="sv" style={{ color: "var(--green)" }}>{loading ? "—" : published}</div><div className="sl2">Published</div></div>
          <div className="sc2"><div className="sv" style={{ color: "var(--blue)" }}>{loading ? "—" : scheduled}</div><div className="sl2">Scheduled</div></div>
          <div className="sc2"><div className="sv" style={{ color: "var(--amber)" }}>{loading ? "—" : pending}</div><div className="sl2">Pending design</div></div>
          <div className="sc2"><div className="sv" style={{ color: "var(--red)" }}>{loading ? "—" : failed}</div><div className="sl2">Failed</div></div>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
              <div style={{ width: 28, height: 28, border: "2px solid rgba(52,217,123,.2)", borderTopColor: "#34d97b", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            </div>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Platform</th>
                  <th>Scheduled</th>
                  <th>Status</th>
                  <th>Live</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: "center", padding: "32px 12px", color: "var(--t4)" }}><i className="ti ti-send" style={{ fontSize: 28, display: "block", marginBottom: 8 }} />No posts in publishing queue</td></tr>
                ) : filtered.map((p, i) => {
                  const status = p.publishLog?.status ?? p.status;
                  const cls = status === "PUBLISHED" ? "plg" : status === "SCHEDULED" ? "plb" : status === "FAILED" ? "plr" : "pla";
                  return (
                    <tr key={p.id ?? i}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ fontSize: 12, fontWeight: 300, color: "var(--t1)" }}>{p.topic ?? p.hook ?? p.post?.topic ?? "Post"}</div>
                        </div>
                      </td>
                      <td><i className={`ti ti-brand-${p.platform ?? p.post?.platform ?? "instagram"}`} style={{ fontSize: 13, color: "var(--t3)" }} /></td>
                      <td style={{ fontSize: 11, color: "var(--t3)" }}>
                        {(p.scheduledAt ?? p.scheduledDate) ? new Date(p.scheduledAt ?? p.scheduledDate).toLocaleString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                      </td>
                      <td><span className={`pl ${cls}`}>{status?.replace(/_/g, " ")}</span></td>
                      <td>
                        {status === "PUBLISHED" && p.publishLog?.liveUrl ? (
                          <a href={p.publishLog.liveUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: "var(--green)", textDecoration: "none" }}>View live</a>
                        ) : status === "FAILED" ? (
                          <span style={{ fontSize: 10, color: "var(--red)", cursor: "pointer" }} onClick={() => retry(p.id)}>Retry now</span>
                        ) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
