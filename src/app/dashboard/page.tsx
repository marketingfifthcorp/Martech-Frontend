"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useApi } from "@/hooks/useApi";
import { useRoleGuard } from "@/hooks/useRoleGuard";

const STAGE_LABEL: Record<string, string> = {
  ONBOARDING: "Onboarding",
  BRIEF_UPLOADED: "Brief ready",
  STRATEGY_PENDING: "Strategy generating",
  STRATEGY_IN_REVIEW: "Strategy review",
  STRATEGY_SENT: "Awaiting approval",
  STRATEGY_APPROVED: "Strategy approved",
  CALENDAR_PENDING: "Calendar pending",
  ACTIVE: "Publishing live",
  PAUSED: "Paused",
  ARCHIVED: "Archived",
};

const STAGE_CLASS: Record<string, string> = {
  ACTIVE: "plg",
  STRATEGY_APPROVED: "plg",
  STRATEGY_IN_REVIEW: "plb",
  STRATEGY_SENT: "plb",
  ONBOARDING: "plb",
  BRIEF_UPLOADED: "pla",
  STRATEGY_PENDING: "pla",
  CALENDAR_PENDING: "pla",
  PAUSED: "plr",
  ARCHIVED: "plr",
};

const STAGE_PROGRESS: Record<string, number> = {
  ONBOARDING: 5, BRIEF_UPLOADED: 15, STRATEGY_PENDING: 25,
  STRATEGY_IN_REVIEW: 35, STRATEGY_SENT: 45, STRATEGY_APPROVED: 55,
  CALENDAR_PENDING: 65, ACTIVE: 90, PAUSED: 80, ARCHIVED: 100,
};

const CLIENT_COLORS = [
  { bg: "var(--pb)", color: "var(--purple)", border: "var(--pbb)" },
  { bg: "var(--gb)", color: "var(--green)", border: "var(--gbb)" },
  { bg: "var(--bb)", color: "var(--blue)", border: "var(--bbb)" },
  { bg: "var(--ab)", color: "var(--amber)", border: "var(--abb)" },
  { bg: "var(--rb)", color: "var(--red)", border: "var(--rbb)" },
];

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function DashboardPage() {
  const api = useApi();
  const { checking } = useRoleGuard(["ADMIN"]);
  const [clients, setClients] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, onboarding: 0, pendingApproval: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (checking) return;
    (async () => {
      try {
        const [clientData, statsData] = await Promise.all([
          api.clients.list(),
          api.clients.stats(),
        ]);
        setClients(clientData);
        setStats(statsData);
      } catch {}
      finally { setLoading(false); }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking]);

  if (checking) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f1a" }}>
      <div style={{ width: 32, height: 32, border: "2px solid rgba(52,217,123,.2)", borderTopColor: "#34d97b", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    </div>
  );

  return (
    <DashboardShell
      title="Dashboard"
      actionButton={
        <Link href="/onboarding" className="gb gbp">
          <i className="ti ti-plus" /> New client
        </Link>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <div className="sa">
          {/* Metrics */}
          <div className="g4" style={{ marginBottom: 16 }}>
            <div className="mt"><div className="ml">Active clients</div><div className="mv">{loading ? "—" : stats.active}</div><div className="ms">{loading ? "" : `${stats.onboarding} onboarding`}</div></div>
            <div className="mt"><div className="ml">Posts this month</div><div className="mv" style={{ color: "var(--green)" }}>148</div><div className="ms">92 published · 56 pending</div></div>
            <div className="mt"><div className="ml">Awaiting approval</div><div className="mv" style={{ color: "var(--amber)" }}>{loading ? "—" : stats.pendingApproval}</div><div className="ms">Strategy & creative</div></div>
            <div className="mt"><div className="ml">Publishing today</div><div className="mv" style={{ color: "var(--blue)" }}>14</div><div className="ms">Across all clients</div></div>
          </div>

          <div className="g2">
            {/* Client pipeline table */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div className="slb">Client pipeline</div>
                <Link href="/clients" style={{ padding: "3px 10px", fontSize: 10, borderRadius: 20, background: "var(--gb)", border: "1px solid var(--gbb)", color: "var(--green)", cursor: "pointer", fontWeight: 300, textDecoration: "none" }}>View all</Link>
              </div>
              <div className="cd" style={{ padding: 0, overflow: "hidden", marginBottom: 10 }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Stage</th>
                      <th>Progress</th>
                      <th>Channels</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [1, 2, 3].map((i) => (
                        <tr key={i}>
                          <td colSpan={5}><div style={{ height: 28, background: "var(--in)", borderRadius: 6, animation: "pulse 1.5s ease infinite" }} /></td>
                        </tr>
                      ))
                    ) : clients.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", padding: "28px 12px", color: "var(--t4)" }}>
                          <i className="ti ti-users" style={{ fontSize: 24, display: "block", marginBottom: 8 }} />
                          No clients yet — <Link href="/onboarding" style={{ color: "var(--green)" }}>onboard your first</Link>
                        </td>
                      </tr>
                    ) : clients.slice(0, 5).map((client, idx) => {
                      const color = CLIENT_COLORS[idx % CLIENT_COLORS.length];
                      const cls = STAGE_CLASS[client.status] ?? "plb";
                      const pct = STAGE_PROGRESS[client.status] ?? 0;
                      return (
                        <tr key={client.id} style={{ cursor: "pointer" }} onClick={() => window.location.href = `/clients/${client.id}`}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div className="ci" style={{ width: 28, height: 28, background: color.bg, color: color.color, border: `1px solid ${color.border}` }}>
                                {getInitials(client.name)}
                              </div>
                              <div>
                                <div style={{ fontSize: 12, fontWeight: 300, color: "var(--t1)" }}>{client.name}</div>
                                <div style={{ fontSize: 9, color: "var(--t4)" }}>{client.industry ?? "—"} · {client.postingFrequency ?? 12}/mo</div>
                              </div>
                            </div>
                          </td>
                          <td><span className={`pl ${cls}`}>{STAGE_LABEL[client.status] ?? client.status}</span></td>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                              <div className="pbw" style={{ width: 72 }}><div className="pbf" style={{ width: `${pct}%` }} /></div>
                              <div style={{ fontSize: 9, color: "var(--t4)" }}>{pct}%</div>
                            </div>
                          </td>
                          <td>
                            <div className="pi">
                              {(client.platforms ?? []).slice(0, 3).map((p: string) => (
                                <div key={p} className="pci">{p.slice(0, 2)}</div>
                              ))}
                            </div>
                          </td>
                          <td>
                            <Link href={`/clients/${client.id}`} className="gb gbs" onClick={(e) => e.stopPropagation()}>Open</Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right column: action needed + activity */}
            <div>
              <div className="slb" style={{ marginBottom: 8 }}>Action needed</div>
              <div className="cd" style={{ marginBottom: 10 }}>
                {clients.filter((c) => ["STRATEGY_IN_REVIEW", "STRATEGY_SENT"].includes(c.status)).slice(0, 3).map((client) => (
                  <div key={client.id} className="ari">
                    <div>
                      <div className="arn">{client.name}</div>
                      <div className="ars">Strategy ready for review</div>
                    </div>
                    <Link href={`/clients/${client.id}`} className="gb gbs gbbl">Review</Link>
                  </div>
                ))}
                {clients.filter((c) => c.status === "CALENDAR_PENDING").slice(0, 2).map((client) => (
                  <div key={client.id} className="ari">
                    <div>
                      <div className="arn">{client.name}</div>
                      <div className="ars">Calendar awaiting generation</div>
                    </div>
                    <Link href={`/clients/${client.id}`} className="gb gbs gbp">Generate</Link>
                  </div>
                ))}
                {clients.filter((c) => ["STRATEGY_IN_REVIEW", "STRATEGY_SENT", "CALENDAR_PENDING"].includes(c.status)).length === 0 && (
                  <div style={{ padding: "14px 0", textAlign: "center", fontSize: 11, color: "var(--t4)" }}>
                    <i className="ti ti-check" style={{ fontSize: 20, display: "block", marginBottom: 6, color: "var(--green)" }} />
                    No actions needed
                  </div>
                )}
              </div>

              <div className="slb" style={{ marginBottom: 8 }}>Recent activity</div>
              <div className="cd">
                <div className="ait">
                  <div className="adot" style={{ background: "var(--green)" }} />
                  <div className="atx">Bloom DTC · 3 posts published to Instagram &amp; TikTok</div>
                  <div className="atm">2 min</div>
                </div>
                <div className="ait">
                  <div className="adot" style={{ background: "var(--amber)" }} />
                  <div className="atx">Kove Retail · Designer uploaded 3 new creatives</div>
                  <div className="atm">18 min</div>
                </div>
                <div className="ait">
                  <div className="adot" style={{ background: "var(--blue)" }} />
                  <div className="atx">Orbit Finance · Strategy draft generated by AI</div>
                  <div className="atm">1 hr</div>
                </div>
                <div className="ait">
                  <div className="adot" style={{ background: "var(--t4)" }} />
                  <div className="atx">Aura Wellness · Calendar approved by client</div>
                  <div className="atm">3 hr</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </DashboardShell>
  );
}
