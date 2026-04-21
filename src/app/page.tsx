import Link from "next/link";

const screens: Array<{ href: string; title: string; blurb: string }> = [
  {
    href: "/login",
    title: "Login",
    blurb: "Encrypted enterprise portal — welcome to the atelier.",
  },
  {
    href: "/dashboard",
    title: "Admin Dashboard",
    blurb: "Portfolio overview of all client campaigns.",
  },
  {
    href: "/onboarding",
    title: "Client Onboarding",
    blurb: "Curating a new client identity with AI strategy generation.",
  },
  {
    href: "/strategy",
    title: "Strategy Overview",
    blurb: "Approved marketing strategy and architectural pillars.",
  },
  {
    href: "/trajectory",
    title: "Trajectory Planning",
    blurb: "AI-generated content trajectory and brainstorm board.",
  },
  {
    href: "/trajectory/brainstorm",
    title: "Trajectory Brainstorm",
    blurb: "Interactive ideation canvas for content concepts.",
  },
  {
    href: "/content-calendar",
    title: "Content Calendar",
    blurb: "Monthly editorial calendar for the agency atelier.",
  },
  {
    href: "/posting-plan",
    title: "Posting Plan Calendar",
    blurb: "Scheduled posts across channels and time slots.",
  },
  {
    href: "/post-review",
    title: "Post Review",
    blurb: "Creative review workspace for upcoming content.",
  },
  {
    href: "/approvals",
    title: "Client Approval Portal",
    blurb: "Review and approve content with editorial care.",
  },
  {
    href: "/publishing",
    title: "Publishing Status",
    blurb: "Real-time pulse of distribution across channels.",
  },
  {
    href: "/evergreen",
    title: "Evergreen Atelier",
    blurb: "The always-on library of reusable creative assets.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-surface px-8 py-20 md:px-20">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] font-bold text-primary">
            Screen Directory
          </span>
          <h1 className="mt-4 font-headline text-5xl md:text-6xl font-extrabold text-primary text-kern-tight leading-[1.05]">
            Atelier Martech
          </h1>
          <p className="mt-4 max-w-xl text-on-surface-variant font-light text-lg leading-relaxed">
            A preview of every screen in the frontend. Click any tile to open
            that view.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {screens.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group relative p-8 rounded-xl bg-surface-container-lowest editorial-shadow hover:shadow-editorial-lg transition-all"
            >
              <span className="font-label text-[10px] uppercase tracking-[0.2em] font-bold text-primary">
                {s.href}
              </span>
              <h2 className="mt-3 font-headline text-2xl font-extrabold text-on-surface tracking-tight">
                {s.title}
              </h2>
              <p className="mt-3 text-sm text-on-surface-variant font-light leading-relaxed">
                {s.blurb}
              </p>
              <span className="material-symbols-outlined absolute top-8 right-8 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all">
                arrow_forward
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
