import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Icon } from "@/components/ui/Icon";

const TRAJECTORIES = [
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
    count: "04",
    accent: "bg-secondary",
  },
  {
    name: "Product Spotlight",
    description:
      "Deep dives into specific offerings, case study results, and actionable service-based value.",
    count: "04",
    accent: "bg-tertiary-container",
  },
  {
    name: "Behind the Scenes",
    description:
      "Raw, unpolished glimpses into the creative process, production workflow, and team dynamics.",
    count: "03",
    accent: "bg-blue-500",
  },
  {
    name: "Client Spotlights",
    description:
      "Celebrating partner success stories, community impact, and the transformative power of collaboration.",
    count: "04",
    accent: "bg-amber-500",
  },
  {
    name: "Educational Series",
    description:
      'Mini-workshops and "How-To" guides that solve specific pain points for your core audience.',
    count: "03",
    accent: "bg-indigo-500",
  },
];

export default function TrajectoryPage() {
  return (
    <DashboardShell contextLabel="Campaign Canvas">
      <div className="p-12 max-w-7xl mx-auto min-h-screen">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-widest text-zinc-400">
              Content Engine
            </span>
            <Icon name="chevron_right" className="text-xs text-zinc-300" />
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              Trajectory Planning
            </span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-primary font-bold">
              Trajectory Phase
            </span>
          </div>
        </div>

        {/* Hero */}
        <div className="mb-16">
          <h2 className="text-5xl font-headline font-extrabold text-on-surface leading-tight max-w-3xl tracking-tight">
            Define the rhythm of your{" "}
            <span className="text-primary italic">brand influence.</span>
          </h2>
          <p className="mt-6 text-zinc-500 text-lg max-w-xl leading-relaxed">
            Map out the distribution of content pillars to ensure consistent
            growth and authority across all agency channels.
          </p>
        </div>

        {/* Selection Bar */}
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
          <Link
            href="/trajectory/brainstorm"
            className="bg-gradient-to-br from-primary to-primary-container text-white h-[60px] px-10 rounded-lg font-headline font-bold tracking-wide shadow-lg flex items-center gap-3"
          >
            <span>Generate Content Trajectory</span>
            <Icon name="auto_awesome" className="text-sm" />
          </Link>
        </section>

        {/* Table */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-headline font-bold">
              Content Trajectory Plan
            </h3>
            <button className="flex items-center gap-2 px-5 py-2 text-sm uppercase tracking-widest text-zinc-500 hover:text-primary transition-all">
              <Icon name="edit" className="text-lg" />
              Manual Adjustment
            </button>
          </div>
          <div className="overflow-hidden bg-surface-container-low rounded-xl mb-10">
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
                {TRAJECTORIES.map((t) => (
                  <tr key={t.name} className="hover:bg-white/50 transition-colors">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-8 rounded-full ${t.accent}`} />
                        <span className="font-headline font-bold text-lg">
                          {t.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-8 text-zinc-500 max-w-md leading-relaxed">
                      {t.description}
                    </td>
                    <td className="px-8 py-8 text-right font-headline font-extrabold text-2xl text-primary">
                      {t.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center">
            <Link
              href="/posting-plan"
              className="bg-primary text-white py-5 px-16 rounded-xl font-headline font-extrabold tracking-widest text-sm shadow-2xl hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-4 border border-primary-container/20"
            >
              <Icon name="calendar_add_on" />
              <span>Generate Monthly Post Calendar</span>
            </Link>
          </div>
        </section>

        {/* Footer */}
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
            <button className="bg-surface-container-high text-on-surface-variant py-4 px-12 rounded-lg font-headline font-bold tracking-widest text-sm shadow hover:bg-surface-variant transition-all">
              Approve Trajectory
            </button>
          </div>
        </div>

        {/* Featured */}
        <section className="mt-32 relative overflow-hidden bg-surface-container-lowest rounded-[2rem] p-12 editorial-shadow flex flex-col md:flex-row items-center gap-12 border border-outline-variant/10">
          <div className="flex-1 space-y-6">
            <span className="text-xs uppercase tracking-widest text-primary font-bold">
              Pro Tip
            </span>
            <h4 className="text-4xl font-headline font-extrabold text-on-surface leading-tight">
              Maximize your trajectory with AI-driven sentiment gaps.
            </h4>
            <p className="text-zinc-500 leading-relaxed">
              Our engine analyzed the top 5 competitors in your niche and
              identified a 14% gap in &quot;Methodology focused&quot; content.
              Consider increasing your Thought Leadership count.
            </p>
            <button className="text-primary font-bold font-headline border-b-2 border-primary/20 hover:border-primary transition-all pb-1">
              Analyze Competitor Gaps
            </button>
          </div>
          <div className="flex-1 relative h-64 md:h-auto min-h-[300px] w-full rounded-2xl overflow-hidden md:-mr-24 md:rotate-1 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Gallery"
              className="absolute inset-0 w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrifKcz7UyBecaqw3t2Xq9r-0B9Ufvwwe5bYx01dwp0WBz0lnT6NJFAmI1WOho1KigEtJgo5C7SwE2-_sEWRwtQNgXD47b-CeKrO5Axnl9sAteO6Zq0OGeLRCq5Dlp7aGzsNDVYsyU4sVyF7p7-4wLQokKzcAWxKDwUBR0qKX4llWQDOEuge0NdpT2lrqm-1PCXohd0-E3qkBg3RS52wh8IkXx4F-6b9vrxcmSBuU0GO5rPUtJZvLhUqfR8wC2BXSc4lvBobNU9iU"
            />
            <div className="absolute inset-0 bg-primary/20" />
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
