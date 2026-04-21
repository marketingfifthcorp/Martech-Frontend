import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

type Post = {
  title: string;
  caption: string;
  image: string;
  platform: string;
  platformIcon: string;
  time: string;
  status: "scheduled" | "processing" | "published";
  statusLabel: string;
};

type Day = {
  label: string;
  posts: Post[];
};

const DAYS: Day[] = [
  {
    label: "Tomorrow, Oct 14",
    posts: [
      {
        title: "The Autumn Palette: Narrative Series 01",
        caption:
          "Exploring the intersection of botanical architecture and seasonal transitions. #AtelierLife #AutumnDesign",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBEl-xbtNVMj0PpLHAJJanjoe6Ad5SvCeKp5cRKVap4N95VayfMuJUSjiPemdj9-LOFtdWAXHAYMTf8IWVSeZ0ZEL3l9EemS9dtL-5Ppc0FXgQ8gjX_V2Os6gYnFtnCXHjqA2FZcER1CPeXiPe0Ctd5nSttJgyVb6m_e-6gwJWMhqpEizkitbMaL6GWjXdfK7HSKuMOqYoNAHKGPVDTADP4MXa1LuRdGBIFwxdcaiAiRyJMDyEkyeNwg6y2A3D8WtLSADsoNhLRUsg",
        platform: "Instagram",
        platformIcon: "photo_camera",
        time: "09:00 AM EST",
        status: "scheduled",
        statusLabel: "Scheduled",
      },
      {
        title: "Quarterly Strategy: Scaling Creatively",
        caption:
          "Insight into how we transformed our digital ecosystem to support high-velocity creative output for our global partners.",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCQdhcgBgJDDTvCAOu-vZH-G0ufPj_wK0aJmxWyAP_TlsoSY-w50AkdCLmd-9oQboSPnzfrg6eMLQbmQnAPchV9mqefSRx5gVR-pCPH1C7aG5kabnNcPzqAcqDJyzB-6KUiL-iAwHDw4QWV660H8ygGs6lWiA-aluXqzSzGVPOd-S0iHfMm4mITEIkqY4YldRI9eQb0reTrspopJ7dkyFImZ1CewtrIKhlSbfcCWqs4EjoYou4Ll-PvvJsaoT__Lz_pms11Zmhwo0c",
        platform: "LinkedIn",
        platformIcon: "work",
        time: "02:30 PM EST",
        status: "processing",
        statusLabel: "Processing",
      },
    ],
  },
  {
    label: "Today, Oct 13",
    posts: [
      {
        title: "Micro-Influencers & Macro-Results",
        caption:
          "Why we are shifting our focus to niche communities this year. A thread.",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuC_9cruMO7i-5B8E2pl8a2fUuZyGc-XKoGEVdeDRi2OI3COz-kdQe6nonBgmv7ALuN6faa6GedpVbueyUzsPukXdWc1Q_PgA4YyyITLJJ8enAErrHjldxgxAEm0479ojnGv_zVzEdp2u7QxkVkbS-6uTTOK0hgf_ptrp2frUu_6lviM6JzH-L4bgWx2OQGZGfm_MBZYaQwia0677fet4oSBLbY0ei9U2vNkprJldekklVI2eQlIs9JE0yejWGwxK0TJnatTq9eXkpI",
        platform: "X (Twitter)",
        platformIcon: "tag",
        time: "POSTED AT 10:15 AM",
        status: "published",
        statusLabel: "Published",
      },
    ],
  },
];

const STATUS_CLASSES: Record<Post["status"], string> = {
  scheduled: "bg-primary/10 text-primary",
  processing: "bg-secondary-container/30 text-secondary",
  published: "bg-primary/20 text-primary",
};

export default function PublishingPage() {
  return (
    <>
      <header className="bg-white/80 glass-nav text-emerald-900 fixed top-0 w-full z-50 shadow-sm shadow-emerald-900/5">
        <div className="flex justify-between items-center px-12 h-20 w-full mx-auto max-w-screen-2xl">
          <Link
            href="/dashboard"
            className="text-xl font-bold tracking-tighter text-emerald-900 font-headline"
          >
            Atelier Martech
          </Link>
          <nav className="hidden md:flex items-center gap-8 font-headline tracking-tight font-semibold">
            <Link
              href="/approvals"
              className="text-emerald-700/60 hover:text-emerald-900 transition-colors duration-300"
            >
              Approvals
            </Link>
            <a
              href="#"
              className="text-emerald-900 border-b-2 border-emerald-900 pb-1 transition-colors duration-300"
            >
              Calendar
            </a>
            <a
              href="#"
              className="text-emerald-700/60 hover:text-emerald-900 transition-colors duration-300"
            >
              History
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-emerald-50 transition-colors">
              <Icon name="notifications" className="text-emerald-900" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="User"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjt_4PSRXffz87Ek7KEAFubZ9L3PbbqoyTlly5TZR2n9wCw1kWUQyldDhjAhFMEfyfJD5I32HP3Tpd0rbchQsRitIQCeEek4H3ewQE_lbbkyi06wwBO1w0u7n7Na5S71Fc-gDywXkFEbgWN5ATcMm8RLQM8iEZipGcYKc9qL93BjucnTMQ4Z6S_AFbz1qpMPLD5vJDy4oGlnYY3glft5_EVHqBEz1waC35UngvLfTRrolUtBYKXxNWcwRM-hAsOiyJvJr1dn5k4BI"
              className="w-10 h-10 rounded-full object-cover border border-emerald-900/10"
            />
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6 md:px-24 max-w-screen-2xl mx-auto">
        {/* Hero */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-bold mb-4 block">
              Social Strategy
            </span>
            <h1 className="font-headline text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
              Scheduled Posts Tracker
            </h1>
            <p className="mt-4 text-on-surface-variant text-lg leading-relaxed">
              A curated overview of your upcoming digital presence. Every
              interaction, meticulously timed and executed.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-surface-container-highest text-on-surface font-headline text-sm font-semibold rounded-md hover:bg-surface-dim transition-colors">
              Filter Gallery
            </button>
            <button className="px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-headline text-sm font-semibold rounded-md shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
              Create New Post
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Timeline */}
          <div className="lg:col-span-8 space-y-12">
            {DAYS.map((day) => (
              <section key={day.label}>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="font-headline text-2xl font-bold">
                    {day.label}
                  </h2>
                  <div className="h-px flex-grow bg-outline-variant/30" />
                </div>
                <div className="space-y-6">
                  {day.posts.map((p) => (
                    <div
                      key={p.title}
                      className={`group relative flex flex-col md:flex-row gap-8 p-8 rounded-xl transition-all duration-500 overflow-hidden ${
                        p.status === "published"
                          ? "bg-surface-container-low/50 opacity-80"
                          : "bg-surface-container-lowest hover:shadow-2xl hover:shadow-emerald-900/5"
                      }`}
                    >
                      <div className="w-full md:w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-surface-container">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          alt={p.title}
                          src={p.image}
                          className={`w-full h-full object-cover transition-transform duration-700 ${
                            p.status === "published"
                              ? "grayscale"
                              : "group-hover:scale-105"
                          }`}
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-grow">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                                <Icon
                                  name={p.platformIcon}
                                  className="text-lg text-emerald-900"
                                />
                              </div>
                              <span className="text-[11px] uppercase tracking-widest text-on-surface-variant font-semibold">
                                {p.platform}
                              </span>
                            </div>
                            <div
                              className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest ${STATUS_CLASSES[p.status]}`}
                            >
                              {p.statusLabel}
                            </div>
                          </div>
                          <h3 className="font-headline text-xl font-bold mb-2">
                            {p.title}
                          </h3>
                          <p className="text-on-surface-variant line-clamp-2 text-sm leading-relaxed">
                            {p.caption}
                          </p>
                        </div>
                        <div className="mt-6 flex items-center gap-6">
                          <div
                            className={`flex items-center gap-2 ${p.status === "published" ? "text-on-surface-variant" : "text-primary"}`}
                          >
                            <Icon
                              name={
                                p.status === "published"
                                  ? "check_circle"
                                  : "schedule"
                              }
                              className="text-base"
                            />
                            <span className="text-[11px] font-bold tracking-widest">
                              {p.time}
                            </span>
                          </div>
                          {p.status === "published" ? (
                            <button className="text-primary hover:underline text-[11px] font-bold tracking-widest flex items-center gap-1">
                              VIEW ANALYTICS
                              <Icon
                                name="north_east"
                                className="text-sm"
                              />
                            </button>
                          ) : (
                            <>
                              <button className="text-on-surface-variant hover:text-primary transition-colors">
                                <Icon name="edit" />
                              </button>
                              {p.status === "scheduled" && (
                                <button className="text-on-surface-variant hover:text-error transition-colors">
                                  <Icon name="delete" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-10">
            <div className="bg-surface-container-low rounded-2xl p-8 space-y-8">
              <h3 className="font-headline text-lg font-bold">Campaign Pulse</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest p-6 rounded-xl">
                  <span className="block text-primary text-3xl font-bold mb-1">
                    12
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                    Scheduled
                  </span>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl">
                  <span className="block text-emerald-600 text-3xl font-bold mb-1">
                    48
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                    Published
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Approval Queue</span>
                  <span className="font-bold">4 Pending</span>
                </div>
                <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-3/4" />
                </div>
              </div>
            </div>

            <div className="relative bg-surface-container-lowest rounded-2xl p-8 shadow-xl shadow-emerald-900/5 border border-primary/5 overflow-hidden">
              <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-widest text-primary font-bold mb-4 block">
                  Recommended Action
                </span>
                <h4 className="font-headline text-xl font-bold mb-4 pr-12">
                  Optimize your LinkedIn reach with a carousel.
                </h4>
                <button className="mt-4 flex items-center gap-2 text-primary font-headline text-sm font-bold group">
                  Explore Templates
                  <Icon
                    name="arrow_forward"
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
