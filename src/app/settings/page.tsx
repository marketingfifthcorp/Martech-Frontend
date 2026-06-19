"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useApi } from "@/hooks/useApi";

export default function SettingsPage() {
  const api = useApi();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.users.me().then(setUser).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [notifs, setNotifs] = useState({
    newClientAlerts: true,
    publishingFailures: true,
    weeklyDigest: true,
    monthlyReports: false,
  });

  const [ai, setAi] = useState({
    autoStrategy: true,
    autoCalendar: false,
  });

  function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
    return <div className={`tsw ${value ? "on" : "off"}`} onClick={onChange} />;
  }

  return (
    <DashboardShell title="Settings">
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <div className="sa">
          <div className="g2e">
            {/* Left column */}
            <div>
              <div className="slb" style={{ marginBottom: 8 }}>Agency details</div>
              {[
                { label: "Agency name", value: "Fifth Corp" },
                { label: "Admin email", value: user?.email ?? "—", green: true },
                { label: "Timezone", value: "GST +4 Dubai" },
                { label: "Plan", value: "Growth · 15 clients", green: true },
              ].map((row) => (
                <div key={row.label} className="sr2">
                  <div><div className="srl">{row.label}</div></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 11, color: row.green ? "var(--green)" : "var(--t2)", fontWeight: 300 }}>{row.value}</span>
                    <button className="gb gbs">{row.label === "Plan" ? "Upgrade" : "Edit"}</button>
                  </div>
                </div>
              ))}

              <div className="slb" style={{ marginBottom: 8, marginTop: 14 }}>Notifications</div>
              {[
                { key: "newClientAlerts" as const, label: "New client action alerts" },
                { key: "publishingFailures" as const, label: "Publishing failure alerts" },
                { key: "weeklyDigest" as const, label: "Weekly performance digest" },
                { key: "monthlyReports" as const, label: "Monthly reports to clients" },
              ].map((n) => (
                <div key={n.key} className="sr2">
                  <div><div className="srl">{n.label}</div></div>
                  <Toggle value={notifs[n.key]} onChange={() => setNotifs((p) => ({ ...p, [n.key]: !p[n.key] }))} />
                </div>
              ))}
            </div>

            {/* Right column */}
            <div>
              <div className="slb" style={{ marginBottom: 8 }}>Default AI settings</div>
              <div className="sr2">
                <div><div className="srl">Default design team</div></div>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 11, color: "var(--green)", fontWeight: 300 }}>AI agents</span>
                  <button className="gb gbs">Change</button>
                </div>
              </div>
              {[
                { key: "autoStrategy" as const, label: "Auto-generate strategy" },
                { key: "autoCalendar" as const, label: "Auto-generate calendar" },
              ].map((n) => (
                <div key={n.key} className="sr2">
                  <div><div className="srl">{n.label}</div></div>
                  <Toggle value={ai[n.key]} onChange={() => setAi((p) => ({ ...p, [n.key]: !p[n.key] }))} />
                </div>
              ))}

              <div className="slb" style={{ marginBottom: 8, marginTop: 14 }}>Social platforms</div>
              <div className="chr" style={{ background: "var(--in)", border: "1px solid var(--in-b)", borderRadius: 8 }}>
                <div className="chi"><i className="ti ti-plug-connected" style={{ fontSize: 16, color: "var(--t4)" }} /></div>
                <div style={{ flex: 1 }}>
                  <div className="chn">Per-client connections</div>
                  <div className="chd">Connect Instagram, LinkedIn, TikTok and X from each client's Settings tab</div>
                </div>
              </div>

              <div className="slb" style={{ marginBottom: 8, marginTop: 14 }}>Billing</div>
              {[
                { label: "Billing cycle", value: "Monthly · renews Jul 1" },
                { label: "Payment method", value: "Visa ···4521" },
              ].map((row) => (
                <div key={row.label} className="sr2">
                  <div><div className="srl">{row.label}</div></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 11, color: "var(--t2)", fontWeight: 300 }}>{row.value}</span>
                    <button className="gb gbs">{row.label === "Billing cycle" ? "Manage" : "Update"}</button>
                  </div>
                </div>
              ))}

              <div className="slb" style={{ marginBottom: 8, marginTop: 14, color: "var(--red)" }}>Danger zone</div>
              <div className="sr2" style={{ border: "1px solid var(--rbb)" }}>
                <div><div className="srl">Delete agency account</div><div className="srls">Permanent — all data deleted</div></div>
                <button className="gb gbs gbr">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
