import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Icon } from "@/components/ui/Icon";

type Row = {
  date: string;
  dow: string;
  caption: string;
  channels: Array<{ title: string; icon: string }>;
  direction: string;
  asset?: string;
  approved?: boolean;
};

const ROWS: Row[] = [
  {
    date: "Oct 24, 2026",
    dow: "Thursday • 09:00 AM",
    caption:
      '"The intersection of heritage and innovation. Our latest collection redefines the modern silhouette with sustainable textures..."',
    channels: [
      { title: "Instagram", icon: "camera" },
      { title: "LinkedIn", icon: "share" },
    ],
    direction:
      "High-contrast minimalism. Focus on the raw silk texture. Cinematic shadows.",
    asset:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCY7-HTDbujQz2ViSruDTO9sp2jlZ9riDMP7y953K4XeZWdx9G6tpup03tNXieszofIoe1olgQQNMxAZh3rixVIJZnzAuFbG75u4LZtg8GfJgg4qoA5HcSKvkXvJDhy5GdqHwWXLVlUtdXYYRst29jrL6bSjuRavMRzRu6_sTbfDAm0fJnGzmW86OIcpbgTNv7tMAAde_B4e96_22OEk5ErGwNEP-uQ1QVhTXoFQH1PFpx17AgZWUVOGBoLSS2a3JHbMlrKKw04FDQ",
  },
  {
    date: "Oct 27, 2026",
    dow: "Sunday • 06:00 PM",
    caption:
      "Defining luxury isn't about excess; it's about the precision of the essential. Explore the Atelier process.",
    channels: [{ title: "X", icon: "chat" }],
    direction:
      "Macro shot of artisan hands. Warm, natural morning light. Film grain effect.",
  },
  {
    date: "Nov 02, 2026",
    dow: "Wednesday • 12:00 PM",
    caption:
      "An exclusive look behind the scenes of our Paris showcase. The wait is nearly over.",
    channels: [
      { title: "Instagram", icon: "camera" },
      { title: "X", icon: "chat" },
    ],
    direction:
      "Black and white editorial style. Dynamic movement. Wide angle.",
    asset:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA0SUs_Q7geZrMvhU-Go9_ipuYlQTjb3uH4TwYHcH2XZ-y-mBUZoXTTjbMLiZWF_l_7Igh2XPkghhDbeWN2jcmub7ZzKPHUh47xzQUusHNpHWCNXrWyq5rG0EDrG4aiV-DmXdEyjOsDRkXGIiuQqsGe8lPJsH94te8dRRz5zMa3YrWy7dCn6waa-90QZVFttvyQVqzoYKPtlR5gw4dOlnaYPiU6XiqE01YVSetrMmpEXzNJ-RbELWmL_n206HWOE60PfaGv9EniJRI",
    approved: true,
  },
];

export default function PostingPlanPage() {
  return (
    <DashboardShell contextLabel="Campaign Canvas">
      <div className="p-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-primary text-[11px] uppercase tracking-[0.3em] font-semibold mb-3 block">
              Step 02 / Strategic Implementation
            </span>
            <h2 className="text-5xl font-headline font-extrabold text-on-surface tracking-tighter leading-tight">
              Content Planner
            </h2>
            <p className="text-on-surface-variant mt-4 text-lg font-light leading-relaxed">
              Translate your approved{" "}
              <span className="font-medium text-primary">
                Q4 Luxury Trajectory
              </span>{" "}
              into a high-fidelity publishing schedule. Review each asset for
              tonal alignment.
            </p>
          </div>
          <Link
            href="/publishing"
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-md font-medium tracking-wide hover:shadow-lg transition-all"
          >
            <span>Finalize Posting Plan</span>
            <Icon
              name="arrow_forward"
              className="text-sm group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Table */}
        <div className="bg-surface-container-low rounded-xl p-8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="pb-6 pr-4 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
                    Posting Date
                  </th>
                  <th className="pb-6 px-4 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold w-1/4">
                    Caption
                  </th>
                  <th className="pb-6 px-4 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
                    Channels
                  </th>
                  <th className="pb-6 px-4 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold w-1/4">
                    Creative Direction
                  </th>
                  <th className="pb-6 px-4 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
                    Files
                  </th>
                  <th className="pb-6 pl-4 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {ROWS.map((r) => (
                  <tr
                    key={r.date}
                    className="group hover:bg-surface-container-lowest transition-colors duration-300"
                  >
                    <td className="py-8 pr-4">
                      <div className="flex flex-col">
                        <span className="text-lg font-semibold font-headline">
                          {r.date}
                        </span>
                        <span className="text-xs text-zinc-500 tracking-wide mt-1">
                          {r.dow}
                        </span>
                      </div>
                    </td>
                    <td className="py-8 px-4">
                      <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                        {r.caption}
                      </p>
                    </td>
                    <td className="py-8 px-4">
                      <div className="flex gap-2">
                        {r.channels.map((c) => (
                          <div
                            key={c.title}
                            title={c.title}
                            className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container"
                          >
                            <Icon name={c.icon} className="text-[16px]" />
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-8 px-4">
                      <p className="text-xs text-zinc-500 italic font-light">
                        {r.direction}
                      </p>
                    </td>
                    <td className="py-8 px-4">
                      {r.asset ? (
                        <div className="w-14 h-14 bg-surface-container-high rounded overflow-hidden shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt="Asset"
                            src={r.asset}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 bg-surface-container-high rounded flex items-center justify-center border-2 border-dashed border-outline-variant/30">
                          <Icon name="add" className="text-zinc-400" />
                        </div>
                      )}
                    </td>
                    <td className="py-8 pl-4 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-[11px] uppercase tracking-widest font-semibold text-zinc-500 hover:text-on-surface py-2 px-3">
                          Refine
                        </button>
                        {r.approved ? (
                          <div className="flex items-center gap-1 text-primary">
                            <Icon
                              name="check_circle"
                              className="text-sm"
                            />
                            <span className="text-[11px] uppercase tracking-widest font-bold">
                              Approved
                            </span>
                          </div>
                        ) : (
                          <button className="text-[11px] uppercase tracking-widest font-semibold bg-primary-fixed-dim text-on-primary-fixed px-4 py-2 rounded">
                            Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary grid */}
        <section className="mt-24 grid grid-cols-12 gap-12 items-center">
          <div className="col-span-12 lg:col-span-5 relative">
            <div className="aspect-square bg-primary-container/20 rounded-full absolute -top-12 -left-12 w-64 h-64 blur-3xl opacity-30" />
            <div className="relative z-10 bg-surface-container-lowest rounded-2xl p-12 shadow-sm border border-outline-variant/10">
              <h3 className="text-2xl font-headline font-bold mb-6">
                Campaign Health
              </h3>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-[11px] uppercase tracking-widest mb-3">
                    <span>Content Ready</span>
                    <span>82%</span>
                  </div>
                  <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[82%]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <span className="text-3xl font-headline font-bold block">
                      14
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-400">
                      Posts Planned
                    </span>
                  </div>
                  <div>
                    <span className="text-3xl font-headline font-bold block">
                      3
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-400">
                      Refinements
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <div className="bg-primary text-white p-16 rounded-3xl overflow-hidden relative group">
              <div className="relative z-10">
                <span className="text-primary-fixed text-[10px] uppercase tracking-[0.4em] mb-4 block">
                  Next Milestone
                </span>
                <h3 className="text-4xl font-headline font-extrabold tracking-tight leading-tight mb-8">
                  Asset Sync &amp; <br />
                  Automated Queuing
                </h3>
                <p className="text-on-primary-container text-lg font-light mb-12 max-w-md">
                  Once you finalize the plan, our engine will automatically
                  distribute high-res assets to your agency dashboard for final
                  meta-tagging.
                </p>
                <button className="flex items-center gap-3 text-sm font-semibold group/btn">
                  <span className="border-b-2 border-primary-fixed pb-1">
                    Review Distribution Logic
                  </span>
                  <Icon
                    name="east"
                    className="text-lg group-hover/btn:translate-x-1 transition-transform"
                  />
                </button>
              </div>
              <div className="absolute -right-24 -bottom-24 w-80 h-80 opacity-20 rotate-12 group-hover:rotate-6 transition-transform duration-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Decoration"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuClPCbLISk8idbELqIvQEiN2Y6NZD902ZdOK8nEZWCRAPhTr_YMX7mH5ca1m8wapIZ352C3RuhMKiOSOA9tWs1Ec_26t_suvWa3pWJMzstSimnxTMSp3i7ytCnB3SIZCM3yfscteEg_-olMlIYg0f6wLIrMWEFQGOSCTZ6hF-ngInZUJAtF82weGV5pqVtidtkA8_IQ6KBTmwPGZwk4DB3EN66uy1942Uy3cuzuGTAarlj8vrWuDMUvlq9bUzUSssMSaFT-UZkDraY"
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
