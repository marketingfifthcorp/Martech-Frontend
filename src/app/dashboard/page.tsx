"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Icon } from "@/components/ui/Icon";
import { useApi } from "@/hooks/useApi";

type ClientStatus =
  | "ONBOARDING" | "BRIEF_UPLOADED" | "STRATEGY_PENDING" | "STRATEGY_IN_REVIEW"
  | "STRATEGY_SENT" | "STRATEGY_APPROVED" | "CALENDAR_PENDING" | "ACTIVE" | "PAUSED" | "ARCHIVED";

const STATUS_MAP: Record<ClientStatus, { label: string; tone: "primary" | "secondary" | "success" }> = {
  ONBOARDING: { label: "Onboarding", tone: "secondary" },
  BRIEF_UPLOADED: { label: "Brief Ready", tone: "secondary" },
  STRATEGY_PENDING: { label: "Generating Strategy", tone: "secondary" },
  STRATEGY_IN_REVIEW: { label: "Strategy Review", tone: "primary" },
  STRATEGY_SENT: { label: "Awaiting Approval", tone: "primary" },
  STRATEGY_APPROVED: { label: "Strategy Approved", tone: "success" },
  CALENDAR_PENDING: { label: "Calendar Pending", tone: "primary" },
  ACTIVE: { label: "Active", tone: "success" },
  PAUSED: { label: "Paused", tone: "secondary" },
  ARCHIVED: { label: "Archived", tone: "secondary" },
};

const BADGE_CLASSES = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  success: "bg-emerald-100 text-emerald-700",
};

const STAGE_MAP: Record<ClientStatus, number> = {
  ONBOARDING: 0,
  BRIEF_UPLOADED: 1,
  STRATEGY_PENDING: 1,
  STRATEGY_IN_REVIEW: 2,
  STRATEGY_SENT: 2,
  STRATEGY_APPROVED: 3,
  CALENDAR_PENDING: 3,
  ACTIVE: 4,
  PAUSED: 4,
  ARCHIVED: 4,
};

const PIPELINE_STAGES = ["Brief", "Strategy", "Calendar", "Design", "Live"];

export default function DashboardPage() {
  const api = useApi();
  const [clients, setClients] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, onboarding: 0, pendingApproval: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [clientData, statsData] = await Promise.all([
          api.clients.list(),
          api.clients.stats(),
        ]);
        setClients(clientData);
        setStats(statsData);
      } catch (e) {
        console.error("Failed to load dashboard:", e);
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardShell contextLabel="Agency Overview">
      <div className="p-8 md:p-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-primary font-semibold mb-2 block">
              Admin Dashboard
            </span>
            <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">
              Client Portfolio
            </h1>
          </div>
          <Link
            href="/onboarding"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-md font-headline font-bold text-sm shadow-lg hover:opacity-90 transition-all"
          >
            <Icon name="add" className="text-lg" />
            Onboard New Client
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Clients", value: stats.total, icon: "group" },
            { label: "Active", value: stats.active, icon: "check_circle" },
            { label: "Onboarding", value: stats.onboarding, icon: "person_add" },
            { label: "Pending Approval", value: stats.pendingApproval, icon: "pending_actions" },
          ].map((s) => (
            <div key={s.label} className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
              <div className="flex items-center gap-2 mb-3">
                <Icon name={s.icon} className="text-primary text-lg" />
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">
                  {s.label}
                </span>
              </div>
              <span className="text-3xl font-headline font-bold text-on-surface">
                {loading ? "—" : s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Client cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-container-lowest rounded-2xl p-6 animate-pulse h-48" />
            ))}
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-24">
            <Icon name="group_add" className="text-5xl text-on-surface-variant/30 mb-4" />
            <h3 className="text-2xl font-headline font-bold text-on-surface-variant/50">
              No clients yet
            </h3>
            <p className="text-on-surface-variant/40 mt-2 mb-6">
              Onboard your first client to get started
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-md font-bold text-sm"
            >
              <Icon name="add" />
              Onboard Client
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => {
              const statusInfo = STATUS_MAP[client.status as ClientStatus] ?? { label: client.status, tone: "secondary" };
              const stage = STAGE_MAP[client.status as ClientStatus] ?? 0;

              return (
                <Link
                  key={client.id}
                  href={`/clients/${client.id}`}
                  className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-headline font-bold text-lg">
                      {client.name.charAt(0)}
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${BADGE_CLASSES[statusInfo.tone]}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <h3 className="font-headline font-bold text-lg text-on-surface mb-1">
                    {client.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant mb-1">{client.industry || client.brand || "—"}</p>
                  <p className="text-[10px] text-on-surface-variant/50 uppercase tracking-wider mb-5">
                    {client.platforms?.join(" · ") || "No platforms set"}
                  </p>

                  {/* Pipeline progress */}
                  <div>
                    <div className="flex justify-between text-[9px] uppercase tracking-wider text-on-surface-variant/50 mb-2">
                      {PIPELINE_STAGES.map((s, i) => (
                        <span key={s} className={i <= stage ? "text-primary font-bold" : ""}>{s}</span>
                      ))}
                    </div>
                    <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${(stage / (PIPELINE_STAGES.length - 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Add new client */}
            <Link
              href="/onboarding"
              className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-all text-on-surface-variant/50 hover:text-primary group"
            >
              <Icon name="add_circle" className="text-3xl group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold font-headline">Onboard New Client</span>
            </Link>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
