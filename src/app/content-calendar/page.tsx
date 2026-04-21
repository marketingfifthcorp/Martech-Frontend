import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Icon } from "@/components/ui/Icon";

type Post = {
  title: string;
  platform: string;
  platformIcon: string;
  platformColor: string;
  image: string;
  caption: string;
  status: "scheduled" | "review" | "draft";
  statusLabel: string;
  date: string;
  time: string;
};

const POSTS: Post[] = [
  {
    title: "Autumn Collection Reveal",
    platform: "Instagram Reel",
    platformIcon: "camera",
    platformColor: "text-[#E4405F]",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBrPduzZUpjAjdFXa0_Kr9dmNZjGKh1VFcu-AIv_Y0djeWBOMUV6ZkK9l4q35xdSPqt5hAHul5l1fJAXufLYjYVI4Zm5tBnYIyN3iycz1TSQCHwJCNKi46Vm_Uc3h7u1afxZ45xV_6dz6FPlvP3So5eavA9SqT2Zuzj4l0AD-SyDDgTPSwm0qiigWSqaJO7zKzkzKD6WXajpyfFD9q-l7Xb3Z3T8DL28mzqArVLmGGaUGKjnCPwh0j3BohSNiq_jmRR0LbFCiThg9E",
    caption:
      "The wait is almost over. Experience the essence of redefined luxury with our curated Autumn 23' capsule... #luxury #fashion",
    status: "scheduled",
    statusLabel: "SCHEDULED",
    date: "Oct 24, 2023",
    time: "09:00 AM EST",
  },
  {
    title: "Future of Workspace",
    platform: "LinkedIn Post",
    platformIcon: "work",
    platformColor: "text-[#0A66C2]",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD54rI1uWwDLfLPmR0Px39trGyxIEzCJCEqww9lzMZnu49vfz4977B1e_15clRY6TZZGCnZVdcJe6Y0bP6-C6jF3Jsc3ukpCjdR432sv9wQKATUjF40YCy8atnA1vTe1nDv9QMflG8drb2yOv6uJfK3FHpsckNkLO-Lv8a3KAB1C9KQXdm9T9zKU345FJ5u2nmxJkQjKYOXRYWxtUDZgwOHRjh-7dWSVe7eUhKzu98oZkssURfaIHzqf0o1ir52Ao--Gq7BcJiNRNw",
    caption:
      "How physical space defines brand culture. Our latest study into the 'Atelier' mindset and efficiency...",
    status: "review",
    statusLabel: "CLIENT REVIEW",
    date: "Oct 26, 2023",
    time: "01:30 PM EST",
  },
  {
    title: "Industry Insights X",
    platform: "X / Twitter Thread",
    platformIcon: "close",
    platformColor: "text-stone-900",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAX2-vQUDdvu-M_gnwbZA8PiBe47y3MHwJNxaSjZcNfEMdMLIwMWMvvvktcP7Epg_rO5bZnF1DH2n38UHmcP__4QLbW08Wc_BUJqH1zMF1H-16UsGAPrE_V4Q0Zy-8hVB5YjqRwcNTMCK4FRQy4vSDpHe-Qx5dpTiO5TaQQvRu_0xvsYnU5EhYPKexI0WimBYgNbH4VBdb0ZkUcRuMZjZunLxEr7tEakquNaIg6aEK6_rXnb4u-w8Oz828wdDAf6wqRQSrQoFWnlhE",
    caption:
      "1/7 Modern marketing isn't about volume, it's about curation. Here is why luxury brands are opting out of algorithmic trends...",
    status: "draft",
    statusLabel: "DRAFT",
    date: "Oct 28, 2023",
    time: "Tentative",
  },
];

const STATUS_CLASSES: Record<Post["status"], string> = {
  scheduled: "bg-primary/10 text-primary",
  review: "bg-tertiary/10 text-tertiary",
  draft: "bg-secondary/10 text-secondary",
};

const STATUS_DOT: Record<Post["status"], string> = {
  scheduled: "bg-primary",
  review: "bg-tertiary",
  draft: "bg-secondary",
};

export default function ContentCalendarPage() {
  return (
    <DashboardShell contextLabel="Aria Residences">
      <div className="px-8 pb-12 pt-8 min-h-screen">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="uppercase tracking-[0.2em] text-on-surface-variant font-medium text-[10px]">
              Campaign Management
            </span>
            <h1 className="text-4xl font-headline font-extrabold tracking-tight text-primary">
              Content Calendar
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-surface-container-low p-1 rounded-lg">
              <button className="px-4 py-2 bg-white shadow-sm rounded-md text-sm font-semibold text-primary transition-all">
                List View
              </button>
              <Link
                href="/posting-plan"
                className="px-4 py-2 text-sm font-semibold text-stone-500 hover:text-stone-700 transition-all"
              >
                Timeline
              </Link>
            </div>
            <div className="flex items-center bg-surface-container-low rounded-lg px-3 py-2 gap-3">
              <Icon name="chevron_left" className="text-stone-400 cursor-pointer" />
              <span className="text-sm font-bold text-primary font-headline">
                October 2023
              </span>
              <Icon name="chevron_right" className="text-stone-400 cursor-pointer" />
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-md text-sm font-bold transition-all hover:shadow-lg active:scale-95">
              <Icon name="add" className="text-lg" />
              New Post
            </button>
          </div>
        </header>

        {/* Bento metrics */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-between">
            <span className="uppercase tracking-widest text-[10px] text-stone-400">
              Total Posts
            </span>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-3xl font-headline font-bold text-primary">
                24
              </span>
              <span className="text-emerald-600 text-xs font-bold">
                +12% vs last month
              </span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-between">
            <span className="uppercase tracking-widest text-[10px] text-stone-400">
              Awaiting Approval
            </span>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-3xl font-headline font-bold text-tertiary">
                08
              </span>
              <span className="bg-tertiary/10 text-tertiary px-2 py-0.5 rounded text-[10px] font-bold">
                Action Required
              </span>
            </div>
          </div>
          <div className="md:col-span-2 bg-primary text-white p-6 rounded-xl shadow-xl flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-headline font-bold">
                Client Review Sync
              </h3>
              <p className="text-primary-fixed-dim text-sm mt-1">
                Next session in 2 hours with &apos;Luxe Living&apos;
              </p>
            </div>
            <button className="relative z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
              Join Call
            </button>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Icon name="video_call" className="text-[120px]" />
            </div>
          </div>
        </section>

        {/* Post table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-x-auto border border-outline-variant/5">
          <table className="w-full text-left border-collapse min-w-[860px]">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-4 uppercase tracking-widest text-[10px] font-bold text-stone-500">
                  Post Info
                </th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px] font-bold text-stone-500">
                  Caption Preview
                </th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px] font-bold text-stone-500">
                  Status
                </th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px] font-bold text-stone-500">
                  Schedule
                </th>
                <th className="px-8 py-4 text-right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {POSTS.map((p) => (
                <tr
                  key={p.title}
                  className="group hover:bg-surface-container-low/30 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt={p.title}
                            src={p.image}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <Icon
                            name={p.platformIcon}
                            className={`text-sm ${p.platformColor}`}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="font-headline font-bold text-on-surface">
                          {p.title}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mt-1">
                          {p.platform}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm text-on-surface-variant max-w-xs line-clamp-2">
                      {p.caption}
                    </p>
                  </td>
                  <td className="px-6 py-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${STATUS_CLASSES[p.status]}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${STATUS_DOT[p.status]}`}
                      />
                      {p.statusLabel}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-sm">
                      <p className="font-semibold text-on-surface">{p.date}</p>
                      <p className="text-stone-400 text-xs">{p.time}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link
                      href="/post-review"
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-surface-container-high rounded-lg transition-all inline-flex"
                    >
                      <Icon name="more_horiz" className="text-stone-400" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="mt-8 flex items-center justify-between">
          <p className="text-xs text-stone-400 font-medium uppercase tracking-widest">
            Showing 1-12 of 24 posts
          </p>
          <div className="flex gap-2">
            <button className="p-2 border border-outline-variant/20 rounded hover:bg-white transition-all">
              <Icon name="keyboard_arrow_left" className="text-sm" />
            </button>
            <button className="p-2 border border-outline-variant/20 rounded bg-white font-bold text-xs px-4">
              1
            </button>
            <button className="p-2 border border-outline-variant/20 rounded hover:bg-white text-xs px-4">
              2
            </button>
            <button className="p-2 border border-outline-variant/20 rounded hover:bg-white transition-all">
              <Icon name="keyboard_arrow_right" className="text-sm" />
            </button>
          </div>
        </footer>
      </div>
    </DashboardShell>
  );
}
