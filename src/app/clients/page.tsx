"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useApi } from "@/hooks/useApi";
import { useRoleGuard } from "@/hooks/useRoleGuard";

const STAGE_LABEL: Record<string, string> = {
  ONBOARDING: "Onboarding", BRIEF_UPLOADED: "Brief ready",
  STRATEGY_PENDING: "Strategy generating", STRATEGY_IN_REVIEW: "Strategy review",
  STRATEGY_SENT: "Awaiting approval", STRATEGY_APPROVED: "Strategy approved",
  CALENDAR_PENDING: "Calendar pending", ACTIVE: "Publishing live",
  PAUSED: "Paused", ARCHIVED: "Archived",
};
const STAGE_CLASS: Record<string, string> = {
  ACTIVE: "plg", STRATEGY_APPROVED: "plg", STRATEGY_IN_REVIEW: "plb",
  STRATEGY_SENT: "plb", ONBOARDING: "plb", BRIEF_UPLOADED: "pla",
  STRATEGY_PENDING: "pla", CALENDAR_PENDING: "pla", PAUSED: "plr", ARCHIVED: "plr",
};
const STAGE_PROGRESS: Record<string, number> = {
  ONBOARDING: 5, BRIEF_UPLOADED: 15, STRATEGY_PENDING: 25, STRATEGY_IN_REVIEW: 35,
  STRATEGY_SENT: 45, STRATEGY_APPROVED: 55, CALENDAR_PENDING: 65, ACTIVE: 90, PAUSED: 80, ARCHIVED: 100,
};
const CLIENT_COLORS = [
  { bg: "var(--pb)", color: "var(--purple)", border: "var(--pbb)" },
  { bg: "var(--gb)", color: "var(--green)", border: "var(--gbb)" },
  { bg: "var(--bb)", color: "var(--blue)", border: "var(--bbb)" },
  { bg: "var(--ab)", color: "var(--amber)", border: "var(--abb)" },
  { bg: "var(--rb)", color: "var(--red)", border: "var(--rbb)" },
];
function getInitials(name: string) { return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2); }

export default function ClientsPage() {
  const api = useApi();
  const { checking } = useRoleGuard(["ADMIN"]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (checking) return;
    api.clients.list().then(setClients).catch(() => {}).finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking]);

  if (checking) return null;

  return (
    <DashboardShell
      title="Clients"
      actionButton={
        <Link href="/onboarding" className="gb gbp">
          <i className="ti ti-plus" /> New client
        </Link>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <div className="sa">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div className="slb">All clients ({clients.length})</div>
          </div>
          <div className="cd" style={{ padding: 0, overflow: "hidden" }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Stage</th>
                  <th>Progress</th>
                  <th>Posts/mo</th>
                  <th>Channels</th>
                  <th>Manager</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1, 2, 3, 4].map((i) => (
                    <tr key={i}>
                      {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                        <td key={j}><div style={{ height: 22, background: "var(--in)", borderRadius: 4 }} /></td>
                      ))}
                    </tr>
                  ))
                ) : clients.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "32px 12px", color: "var(--t4)" }}>
                      <i className="ti ti-users" style={{ fontSize: 28, display: "block", marginBottom: 8 }} />
                      No clients yet
                    </td>
                  </tr>
                ) : clients.map((client, idx) => {
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
                      <td style={{ fontSize: 11, color: "var(--t3)" }}>{client.postingFrequency ?? 12}</td>
                      <td>
                        <div className="pi">
                          {(client.platforms ?? []).slice(0, 3).map((p: string) => (
                            <div key={p} className="pci">{p.slice(0, 2)}</div>
                          ))}
                        </div>
                      </td>
                      <td style={{ fontSize: 11, color: "var(--t3)" }}>{client.accountManager ?? client.manager ?? "—"}</td>
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
      </div>

    </DashboardShell>
  );
}
