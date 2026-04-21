import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Icon } from "@/components/ui/Icon";

const PILLARS = [
  {
    name: "Thought Leadership",
    description:
      "High-level industry analysis and future-casting that positions the agency as a visionary partner.",
    count: "06",
    accent: "bg-primary",
  },
  {
    name: "Brand Story",
    description:
      "Internal culture highlights, methodology origins, and the human narrative behind the agency.",
    count: "08",
    accent: "bg-secondary",
  },
  {
    name: "Product Spotlight",
    description:
      "Deep dives into specific offerings, case study results, and actionable service-based value.",
    count: "10",
    accent: "bg-tertiary-container",
  },
];

export default function TrajectoryBrainstormPage() {
  return (
    <DashboardShell contextLabel="Campaign Canvas">
      <div className="p-12 max-w-7xl mx-auto min-h-screen">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link
              href="/trajectory"
              className="text-xs uppercase tracking-widest text-zinc-400 hover:text-primary"
            >
              Content Engine
            </Link>
            <Icon name="chevron_right" className="text-xs text-zinc-300" />
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              Trajectory Brainstorm
            </span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-primary font-bold">
              Brainstorm Draft
            </span>
          </div>
        </div>

        <div className="mb-16">
          <span className="uppercase tracking-[0.2em] text-[11px] font-bold text-primary">
            AI Proposal
          </span>
          <h2 className="mt-3 text-5xl font-headline font-extrabold text-on-surface leading-tight max-w-3xl tracking-tight">
            Three pillars for the initial{" "}
            <span className="text-primary italic">24-post cadence.</span>
          </h2>
          <p className="mt-6 text-zinc-500 text-lg max-w-xl leading-relaxed">
            Our engine synthesized your client brief and competitor gaps into
            a focused opening hand. Tune weights below before expanding.
          </p>
        </div>

        <section className="bg-surface-container-lowest p-8 rounded-xl editorial-shadow mb-16 flex flex-col md:flex-row items-end gap-12">
          <div className="flex-1 w-full">
            <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-6">
              Number of posts per month
            </label>
            <div className="flex gap-4">
              <button className="flex-1 py-4 px-6 rounded-lg border border-outline-variant text-center font-headline font-bold text-lg hover:border-primary transition-all text-on-surface">
                12
              </button>
              <button className="flex-1 py-4 px-6 rounded-lg border-2 border-primary bg-emerald-50/50 text-center font-headline font-bold text-lg text-primary transition-all">
                24
              </button>
              <button className="flex-1 py-4 px-6 rounded-lg border border-outline-variant text-center font-headline font-bold text-lg hover:border-primary transition-all text-on-surface">
                48
              </button>
            </div>
          </div>
          <button className="bg-gradient-to-br from-primary to-primary-container text-white h-[60px] px-10 rounded-lg font-headline font-bold tracking-wide shadow-lg flex items-center gap-3">
            <span>Regenerate Trajectory</span>
            <Icon name="auto_awesome" className="text-sm" />
          </button>
        </section>

        <section className="mb-20">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-headline font-bold">
              Initial Pillar Distribution
            </h3>
            <button className="flex items-center gap-2 px-5 py-2 text-sm uppercase tracking-widest text-zinc-500 hover:text-primary transition-all">
              <Icon name="edit" className="text-lg" />
              Manual Adjustment
            </button>
          </div>
          <div className="overflow-hidden bg-surface-container-low rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high">
                  <th className="px-8 py-6 text-xs uppercase tracking-widest text-on-surface-variant">
                    Trajectory Name
                  </th>
                  <th className="px-8 py-6 text-xs uppercase tracking-widest text-on-surface-variant">
                    Description
                  </th>
                  <th className="px-8 py-6 text-xs uppercase tracking-widest text-on-surface-variant text-right">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/50">
                {PILLARS.map((p) => (
                  <tr key={p.name} className="hover:bg-white/50 transition-colors">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-8 rounded-full ${p.accent}`} />
                        <span className="font-headline font-bold text-lg">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-8 text-zinc-500 max-w-md leading-relaxed">
                      {p.description}
                    </td>
                    <td className="px-8 py-8 text-right font-headline font-extrabold text-2xl text-primary">
                      {p.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-outline-variant/30">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-12 h-12 rounded-full object-cover filter grayscale"
              alt="Strategist"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRgpqj-F4oxNlnFxU29VJgzhad1d7-jn2gNvzbtJ-BRTCst4_AFIKN8RUeeYoLonK6dz-HlOdOWr5b2kT2LJ44CT7b_Z_VKlVdKdkGBjsKkCPrXVm5R2mjYBWnCGGV8RA9rRdyuHqDEM0xxeAVlT-3T5wj02A0pKcrFtRmiV6635b0RwCYc0XiJ_5loSrjHXcWiMNwCLt5h0804vlPPgOQ1nzt_m2rH1a2vqeyJ-T0neeooJKSAve4RWGfOlNjMJ1tVevq7cNpxys"
            />
            <div>
              <p className="text-sm font-bold font-headline">Julian Sterling</p>
              <p className="text-xs text-zinc-400">Chief Content Strategist</p>
            </div>
          </div>
          <div className="flex gap-6">
            <button className="px-8 py-4 text-sm uppercase tracking-widest text-zinc-500 hover:text-on-surface transition-all">
              Save as Template
            </button>
            <Link
              href="/trajectory"
              className="bg-primary text-white py-4 px-12 rounded-lg font-headline font-bold tracking-widest text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              Approve Trajectory
            </Link>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
