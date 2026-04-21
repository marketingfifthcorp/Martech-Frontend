import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Icon } from "@/components/ui/Icon";

const PILLARS = [
  {
    icon: "diamond",
    title: "Luxury Lifestyle",
    body: "Focusing on the unseen details of high-end living, from tactile textures to bespoke concierge services.",
  },
  {
    icon: "eco",
    title: "Sustainable Architecture",
    body: "Highlighting the LEED Platinum certification through the lens of wellness and long-term legacy.",
  },
  {
    icon: "communities",
    title: "Curated Community",
    body: "Showcasing exclusive events and the caliber of international residents within the Aria ecosystem.",
  },
];

const TRAJECTORY = [
  {
    date: "Oct 12 • 09:00 AM",
    icon: "image",
    title: "The Dawn Narrative",
    body: "Visual essay focusing on the morning light hitting the marble lobby. No copy, just a single quote.",
    status: "Ready for Review",
    statusIcon: "check",
    statusTone: "ready" as const,
  },
  {
    date: "Oct 13 • 06:00 PM",
    icon: "videocam",
    title: "Artisan Spotlight",
    body: "Macro-video of the hand-stitched leather elevator interiors. Focus on craftsmanship.",
    status: "In Production",
    statusIcon: "history",
    statusTone: "pending" as const,
  },
  {
    date: "Oct 14 • 12:00 PM",
    icon: "article",
    title: "The Legacy Journal",
    body: "Long-form LinkedIn article by the lead architect on urban sustainability.",
    status: "Drafting",
    statusIcon: "edit_note",
    statusTone: "pending" as const,
  },
];

export default function StrategyPage() {
  return (
    <DashboardShell contextLabel="Aria Residences">
      <div className="max-w-[1200px] mx-auto px-16 py-12">
        {/* Header */}
        <section className="flex justify-between items-start mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="uppercase tracking-[0.2em] text-on-surface-variant font-semibold text-[11px] mb-4 block">
              Q4 Marketing Architecture
            </span>
            <h1 className="text-6xl font-headline font-extrabold text-primary tracking-tighter mb-8 leading-tight">
              Aria Residences
            </h1>
            <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Icon
                  name="auto_awesome"
                  className="text-primary-fixed-dim text-4xl opacity-50"
                />
              </div>
              <p className="text-xl font-body text-on-surface-variant leading-relaxed italic">
                &ldquo;The strategy centers on &apos;Elevated Tranquility&apos;
                — positioning Aria not just as a residence, but as a curated
                retreat for the modern executive. We will leverage high-contrast
                visual storytelling and quiet luxury narratives to drive a 40%
                increase in qualified organic inquiries.&rdquo;
              </p>
            </div>
          </div>
          <div className="pt-4 shrink-0">
            <Link
              href="/trajectory"
              className="group flex items-center gap-3 bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-md shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <span className="font-headline font-bold tracking-widest uppercase text-xs">
                Approve Strategy
              </span>
              <Icon
                name="arrow_forward"
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </section>

        {/* Strategic Pillars */}
        <section className="mb-24">
          <div className="flex items-baseline gap-4 mb-10">
            <h2 className="text-3xl font-headline font-bold tracking-tight text-primary">
              Strategic Pillars
            </h2>
            <div className="h-px flex-grow bg-outline-variant/30" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="bg-surface-container-lowest p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-12 h-12 rounded-full bg-primary-fixed/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon name={p.icon} className="text-primary" />
                </div>
                <h3 className="text-lg font-headline font-bold mb-3">
                  {p.title}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Audience & Messaging */}
        <section className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-xl overflow-hidden aspect-[4/5] shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Minimalist luxury interior"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0uKtqibSYvKJEt_nY9adJpcilF5UWHGWd45tLgeGKg0UgDaFcv4RYNaxCgLpdBbvu7pXK0Fr7qtiyuyklcUebj6W-nr08irJ7J4op1goheVOmfB6IdhYELxmBLVMfZKrDYPoS_Tf1hdd-gW8Ud58YkrbmcIOfz5OeorkrLuuCjkmPkD0kG0_6JqM_cGthIxrcbSTCxDxNRL5GYvVlU7AG1k0ufsC_7wWurvCNUqKcNMeEr9QTAhMdrPOcnL0M9tTnwC4SGirN9wY"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] text-white uppercase font-bold tracking-widest">
                  Global Elites
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] text-white uppercase font-bold tracking-widest">
                  HNW Individuals
                </span>
              </div>
              <h4 className="text-white text-2xl font-headline font-bold">
                The Modern Aesthete
              </h4>
            </div>
          </div>
          <div className="space-y-12">
            <div>
              <h3 className="text-sm uppercase tracking-[0.3em] text-stone-400 mb-6">
                Target Persona
              </h3>
              <p className="text-3xl font-headline font-light text-on-surface leading-tight">
                A global citizen, age 35-55, who values{" "}
                <span className="text-primary font-bold">time</span> above all
                else and seeks a home that acts as a silent sanctuary.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-primary" />
                <div>
                  <h4 className="font-headline font-bold text-sm uppercase tracking-wider">
                    Voice &amp; Tone
                  </h4>
                  <p className="text-on-surface-variant text-sm mt-1 italic">
                    Understated, authoritative, poetic yet precise.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-primary" />
                <div>
                  <h4 className="font-headline font-bold text-sm uppercase tracking-wider">
                    Key Tagline
                  </h4>
                  <p className="text-on-surface-variant text-sm mt-1">
                    &ldquo;Aria: The Breath Between Moments.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Trajectory */}
        <section className="mb-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-headline font-bold tracking-tight text-primary">
                Content Trajectory
              </h2>
              <p className="text-stone-500 text-sm mt-1">
                The first 72 hours of the campaign rollout.
              </p>
            </div>
            <Link
              href="/trajectory"
              className="text-primary font-headline text-xs font-bold uppercase tracking-widest border-b border-primary/20 pb-1 hover:border-primary transition-all"
            >
              View Full Roadmap
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRAJECTORY.map((item, idx) => (
              <div
                key={item.title}
                className={`bg-white p-6 rounded-lg shadow-sm hover:translate-y-[-4px] transition-transform ${idx === 0 ? "border-l-4 border-primary" : ""}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    {item.date}
                  </span>
                  <Icon
                    name={item.icon}
                    className={`text-lg ${idx === 0 ? "text-primary" : "text-stone-400"}`}
                  />
                </div>
                <h4 className="font-headline font-bold text-base mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                  {item.body}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${item.statusTone === "ready" ? "bg-emerald-100" : "bg-stone-100"}`}
                  >
                    <Icon
                      name={item.statusIcon}
                      className={`text-[10px] ${item.statusTone === "ready" ? "text-primary" : "text-stone-400"}`}
                    />
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-tighter ${item.statusTone === "ready" ? "text-primary" : "text-stone-400"}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50">
        <Icon name="add_comment" />
      </button>
    </DashboardShell>
  );
}
