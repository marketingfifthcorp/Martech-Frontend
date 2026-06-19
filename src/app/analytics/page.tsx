"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useApi } from "@/hooks/useApi";
import { useRoleGuard } from "@/hooks/useRoleGuard";

export default function AnalyticsPage() {
  const api = useApi();
  const { checking } = useRoleGuard(["ADMIN"]);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState("all");
  const [period, setPeriod] = useState("30d");

  useEffect(() => {
    if (checking) return;
    api.clients.list().then(setClients).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking]);

  if (checking) return null;

  const metrics = [
    { label: "Total reach", value: "142.8k", sub: "+18%", color: undefined },
    { label: "Engagement rate", value: "4.7%", sub: "+0.9%", color: "var(--green)" },
    { label: "Posts published", value: "32", sub: "On target", color: undefined },
    { label: "Followers gained", value: "+284", sub: "+12%", color: "var(--green)" },
    { label: "Link clicks", value: "1,840", sub: "+22%", color: "var(--green)" },
  ];

  const formats = [
    { label: "Carousel", value: 6.8, pct: 85, color: "var(--green)" },
    { label: "Static", value: 5.2, pct: 65, color: "var(--blue)" },
    { label: "Reel", value: 3.1, pct: 39, color: "var(--amber)" },
    { label: "Story", value: 2.4, pct: 30, color: "var(--bar-tr)" },
  ];

  const platforms = [
    { label: "LinkedIn", icon: "ti-brand-linkedin", color: "#0077b5", reach: "102k", pct: 72 },
    { label: "Instagram", icon: "ti-brand-instagram", color: "#e1306c", reach: "40k", pct: 28 },
  ];

  const competitors = [
    { name: selectedClient === "all" ? "Your clients" : selectedClient, value: "4.7%", pct: 94, own: true },
    { name: "Float", value: "2.1%", pct: 42, own: false },
    { name: "Fathom", value: "1.8%", pct: 36, own: false },
  ];

  return (
    <DashboardShell title="Analytics">
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        {/* Filter bar */}
        <div style={{ padding: "10px 22px", borderBottom: "1px solid var(--tb-b)", display: "flex", alignItems: "center", gap: 8, flexShrink: 0, flexWrap: "wrap", boxSizing: "border-box" }}>
          <select className="fs" value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
            <option value="all">All clients — aggregated</option>
            {clients.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <div style={{ display: "flex", gap: 3 }}>
            {["15d","30d","60d"].map((p) => (
              <span key={p} onClick={() => setPeriod(p)} style={{ padding: "4px 10px", fontSize: 10, borderRadius: 20, cursor: "pointer", fontWeight: 300, background: period === p ? "var(--gb)" : "transparent", border: `1px solid ${period === p ? "var(--gbb)" : "var(--in-b)"}`, color: period === p ? "var(--green)" : "var(--t4)" }}>{p}</span>
            ))}
          </div>
          <button className="gb gbp" style={{ marginLeft: "auto" }}><i className="ti ti-robot" style={{ fontSize: 11 }} />AI report</button>
          <button className="gb"><i className="ti ti-download" style={{ fontSize: 11 }} />Export PDF</button>
        </div>

        <div className="sa">
          {/* Metrics */}
          <div className="g5" style={{ marginBottom: 14 }}>
            {metrics.map((m) => (
              <div key={m.label} className="mt">
                <div className="ml">{m.label}</div>
                <div className="mv" style={{ color: m.color }}>{m.value}</div>
                {m.sub && <div className="ms" style={{ color: m.color ?? "var(--green)" }}>{m.sub}</div>}
              </div>
            ))}
          </div>

          {/* AI insight */}
          <div className="ibox">
            <div className="ibt"><i className="ti ti-robot" style={{ fontSize: 12 }} />AI insight — {selectedClient === "all" ? "All clients" : selectedClient} · {period}</div>
            <div className="ibx">LinkedIn driving <strong style={{ fontWeight: 400, color: "var(--t1)" }}>72% of total reach</strong>. Best format: <strong style={{ fontWeight: 400, color: "var(--t1)" }}>data-led carousels</strong> (avg 6.8% eng). Reels underperforming. Outperforming all tracked competitors.</div>
            <div><span className="ibtg">↑ LinkedIn top</span><span className="ibtg">↑ Carousels win</span><span className="ibtg">↓ Reels weak</span><span className="ibtg">↑ Beating competitors</span></div>
          </div>

          {/* Engagement chart placeholder */}
          <div className="cd" style={{ marginBottom: 10 }}>
            <div className="cdt">Engagement rate over time — last {period}</div>
            <svg className="csvg" viewBox="0 0 560 76" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gf2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d97b" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#34d97b" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="14" x2="560" y2="14" stroke="rgba(255,255,255,.05)" strokeWidth="1" />
              <line x1="0" y1="38" x2="560" y2="38" stroke="rgba(255,255,255,.05)" strokeWidth="1" />
              <path d="M0,60 C40,52 80,44 120,36 C160,28 200,44 240,38 C280,32 320,16 360,12 C400,8 440,26 480,18 C540,10 560,8" fill="none" stroke="#34d97b" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M0,60 C40,52 80,44 120,36 C160,28 200,44 240,38 C280,32 320,16 360,12 C400,8 440,26 480,18 C540,10 560,8 L560,72 L0,72Z" fill="url(#gf2)" />
            </svg>
          </div>

          <div className="g2e" style={{ marginBottom: 10 }}>
            {/* Format performance */}
            <div className="cd">
              <div className="cdt">Format performance</div>
              <div className="bch">
                {formats.map((f) => (
                  <div key={f.label} className="bw">
                    <div className="bv">{f.value}%</div>
                    <div className="bar" style={{ height: `${f.pct}%`, background: f.color }} />
                    <div className="bl">{f.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Reach by platform */}
            <div className="cd">
              <div className="cdt">Reach by platform</div>
              {platforms.map((p) => (
                <div key={p.label} className="hbr">
                  <div className="hbl"><i className={`ti ${p.icon}`} style={{ fontSize: 11, color: p.color }} />{p.label}</div>
                  <div className="hbt"><div className="hbf" style={{ width: `${p.pct}%`, background: p.color }} /></div>
                  <div className="hbv">{p.reach}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor benchmark */}
          <div className="cd">
            <div className="cdt">Competitor benchmark — engagement rate</div>
            {competitors.map((c) => (
              <div key={c.name} className={`cr${c.own ? " own" : ""}`}>
                <div className="cn">{c.name}</div>
                <div className="ctr"><div className="cbr" style={{ width: `${c.pct}%`, background: c.own ? "var(--green)" : "var(--bar-tr)" }} /></div>
                <div className="cv">{c.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
