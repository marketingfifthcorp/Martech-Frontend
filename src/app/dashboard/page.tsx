import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Icon } from "@/components/ui/Icon";

type ClientCard = {
  name: string;
  vertical: string;
  logo: string;
  logoBg: string;
  badge: { label: string; tone: "primary" | "secondary" | "success" };
  phase: string;
  progressPct: number;
  activeStage: number; // 0..4 => Strategy, Content, Approval, Design, Publish
  stats: { left: { value: string; label: string }; right: { value: string; label: string } };
  ctas: { secondary: string; primary: string };
  translateY?: boolean;
};

const CLIENTS: ClientCard[] = [
  {
    name: "Aria Residences",
    vertical: "Luxury Real Estate",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoMhzsXx3xlHvy0tiFQG5hDoTcvwRqN5dqcCYsY00U87c-fzAwwVnGykqQP-lXyRhJX2f0v-FM9O5-fOuOLjzAhrlTJFFjkQRp-MhOeHSFlOjjSe_07qcUfxxZAav_A8Fi-gJ4stz_xoCk_zpDNemrxHdK2lYj3e8bFBLhupeneXRVqav-lylfFMpoK9rMsv0iGi0nCUrNYCZ5c7kwSN2FvUA60QFrKpuu1pi5_vFKOf4HZtbn4DX8OGJ8uY-bGxZZFy_6obXw9lQ",
    logoBg: "bg-emerald-50",
    badge: { label: "Active Campaign", tone: "primary" },
    phase: "Approval Phase",
    progressPct: 60,
    activeStage: 2,
    stats: {
      left: { value: "05", label: "Pending Approval" },
      right: { value: "12", label: "Published Posts" },
    },
    ctas: { secondary: "View Strategy", primary: "Manage Content" },
  },
  {
    name: "Luxe Financial",
    vertical: "Investment Boutique",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLHjleFC4by_GqrLkK_XqzOQOp1lKp4glNxjCspo_ezN-Lw73S9wWp29Pu0QU2ENJq4UZX-xrlm1b6PWIeEMJ5kF3ECFJt6Mk8AgUlRxnC_GiuHhSEVHoqZJbORfEy3aYe6jkEV-xXfZaHkqOz1tlz1979dM2ML0xRwSzorqwiGjCFyure25XUB-R-maMDdHgQW9kx3dl5r8upHmxR0yV-riaPx2x1X1q4rffdSyW-0ksobogOGhwMhjQzQGDin6FrFcBQwW7GPLc",
    logoBg: "bg-stone-100",
    badge: { label: "On Hold", tone: "secondary" },
    phase: "Strategy Phase",
    progressPct: 20,
    activeStage: 0,
    stats: {
      left: { value: "02", label: "Draft Assets" },
      right: { value: "00", label: "Approved Posts" },
    },
    ctas: { secondary: "Edit Roadmap", primary: "Start Creative" },
    translateY: true,
  },
  {
    name: "Veridian Labs",
    vertical: "Biotech Research",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuChJWMQ4my6FOanPKnmKNp8Q0ijp-l-foCEffBcqsJNdfW3t3FSxFlV9b1iDEHBemsQbiW_AA5h0w7a_TyBe3WR8CIvgXFtlPesHMn_cx_rZ6cQlA_mr7GuJ2seXutFFfDN0pDeGoDFtsNiJn1wvfRdJd_JPU1c05HAYV_bsYJwz4y5kJjTeIAsOOZJ-PPywb8dWjGyFuc9OFVTkBh-gKINzGVxXuwOGvXXnGNO32b7ulnpz839qR0iUn8YxLBSLCq1L1IQCx_avfs",
    logoBg: "bg-primary-fixed",
    badge: { label: "95% Complete", tone: "success" },
    phase: "Publishing Phase",
    progressPct: 90,
    activeStage: 4,
    stats: {
      left: { value: "01", label: "Final Edits" },
      right: { value: "48", label: "Archived Items" },
    },
    ctas: { secondary: "Audit History", primary: "Finalize Launch" },
  },
];

const STAGES = ["Strategy", "Content", "Approval", "Design", "Publish"];

function Badge({ tone, label }: { tone: ClientCard["badge"]["tone"]; label: string }) {
  const classes = {
    primary: "bg-primary/10 text-primary border-primary/5",
    secondary: "bg-secondary-container/30 text-secondary border-secondary/5",
    success: "bg-emerald-100/50 text-emerald-800 border-emerald-200",
  }[tone];
  return (
    <span
      className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${classes}`}
    >
      {label}
    </span>
  );
}

function ProgressTimeline({
  progressPct,
  activeStage,
}: {
  progressPct: number;
  activeStage: number;
}) {
  return (
    <div className="relative pt-2">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container-high -translate-y-1/2" />
      <div
        className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2"
        style={{ width: `${progressPct}%` }}
      />
      <div className="relative flex justify-between">
        {STAGES.map((_, idx) => {
          const isCompleted = idx < activeStage;
          const isActive = idx === activeStage;
          return (
            <div
              key={idx}
              className={
                isActive
                  ? "w-3 h-3 rounded-full bg-primary ring-8 ring-primary/20 animate-pulse"
                  : isCompleted
                    ? "w-3 h-3 rounded-full bg-primary ring-4 ring-primary/10"
                    : "w-3 h-3 rounded-full bg-surface-container-highest"
              }
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-3 text-[9px] font-label uppercase tracking-tighter text-stone-400">
        {STAGES.map((s, idx) => (
          <span
            key={s}
            className={idx === activeStage ? "text-primary font-bold" : ""}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function ClientCard({ client }: { client: ClientCard }) {
  return (
    <div
      className={`group relative bg-surface-container-lowest p-8 rounded-xl editorial-shadow hover:editorial-shadow-lg transition-all duration-500 flex flex-col justify-between min-h-[440px] ${client.translateY ? "xl:translate-y-12" : ""}`}
    >
      <div className="flex justify-between items-start mb-10">
        <div className="flex items-center space-x-5">
          <div
            className={`w-16 h-16 rounded-full ${client.logoBg} flex items-center justify-center p-3`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={`${client.name} logo`}
              src={client.logo}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-headline tracking-tight text-emerald-950">
              {client.name}
            </h2>
            <p className="text-xs font-label uppercase tracking-widest text-stone-400 mt-1">
              {client.vertical}
            </p>
          </div>
        </div>
        <Badge tone={client.badge.tone} label={client.badge.label} />
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex justify-between text-xs font-label uppercase tracking-widest text-stone-500 mb-4">
            <span>Campaign Pipeline</span>
            <span
              className={
                client.activeStage > 0 ? "text-primary font-bold" : "text-stone-500 font-bold"
              }
            >
              {client.phase}
            </span>
          </div>
          <ProgressTimeline
            progressPct={client.progressPct}
            activeStage={client.activeStage}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 py-6 border-y border-outline-variant/10">
          <div>
            <p className="text-2xl font-headline font-extrabold text-emerald-900">
              {client.stats.left.value}
            </p>
            <p className="text-[10px] font-label uppercase tracking-widest text-stone-500">
              {client.stats.left.label}
            </p>
          </div>
          <div>
            <p className="text-2xl font-headline font-extrabold text-emerald-900">
              {client.stats.right.value}
            </p>
            <p className="text-[10px] font-label uppercase tracking-widest text-stone-500">
              {client.stats.right.label}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-10 flex space-x-3">
        <Link
          href="/strategy"
          className="flex-1 text-center py-3 text-[10px] font-headline font-bold uppercase tracking-widest text-emerald-900 bg-emerald-50/50 hover:bg-emerald-100/50 rounded transition-colors"
        >
          {client.ctas.secondary}
        </Link>
        <Link
          href="/content-calendar"
          className="flex-1 text-center py-3 text-[10px] font-headline font-bold uppercase tracking-widest text-white bg-primary hover:opacity-90 rounded transition-colors"
        >
          {client.ctas.primary}
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="p-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-extrabold font-headline tracking-tighter text-emerald-900 mb-2">
              Portfolio Overview
            </h1>
            <p className="text-on-surface-variant font-body">
              Manage the pulse of your agency&apos;s creative engine.
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="px-6 py-2.5 bg-surface-container-highest text-on-surface font-headline text-sm font-semibold rounded-md hover:bg-surface-variant transition-colors">
              Filter By Stage
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {CLIENTS.map((c) => (
            <ClientCard key={c.name} client={c} />
          ))}
          <Link
            href="/onboarding"
            className="group border-2 border-dashed border-outline-variant/30 rounded-xl p-8 flex flex-col items-center justify-center min-h-[440px] xl:translate-y-12 hover:border-primary/40 transition-colors cursor-pointer bg-white/30"
          >
            <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Icon name="add" className="text-3xl text-stone-400" />
            </div>
            <p className="font-headline font-extrabold text-emerald-900 tracking-tight text-lg">
              Onboard New Client
            </p>
            <p className="text-stone-400 text-xs mt-2 font-body">
              Scale your creative portfolio
            </p>
          </Link>
        </div>
      </div>

      {/* Sticky FAB */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="group relative flex items-center space-x-3 bg-emerald-950 text-white pl-6 pr-4 py-4 rounded-full shadow-2xl shadow-emerald-950/20 hover:scale-105 transition-transform">
          <span className="font-headline text-xs font-bold uppercase tracking-widest">
            Global Send for Approval
          </span>
          <div className="bg-primary-container text-on-primary-container p-2 rounded-full">
            <Icon name="send" className="text-sm" />
          </div>
          <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-on-background text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            8 items ready
          </span>
        </button>
      </div>
    </DashboardShell>
  );
}
