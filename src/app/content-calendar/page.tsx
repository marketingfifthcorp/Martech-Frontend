"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Icon } from "@/components/ui/Icon";
import { useApi } from "@/hooks/useApi";

const PLATFORM_ICON: Record<string, string> = {
  instagram: "camera",
  linkedin: "work",
  tiktok: "music_video",
  x: "tag",
};

const STATUS_CLASSES: Record<string, string> = {
  DRAFT: "bg-secondary/10 text-secondary",
  IN_DESIGN: "bg-secondary/10 text-secondary",
  CREATIVE_UPLOADED: "bg-primary/10 text-primary",
  AWAITING_APPROVAL: "bg-tertiary/10 text-tertiary",
  REVISION_REQUIRED: "bg-error/10 text-error",
  APPROVED: "bg-emerald-100 text-emerald-700",
  SCHEDULED: "bg-emerald-100 text-emerald-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-error/10 text-error",
};

const STATUS_DOT: Record<string, string> = {
  DRAFT: "bg-secondary",
  IN_DESIGN: "bg-secondary",
  CREATIVE_UPLOADED: "bg-primary",
  AWAITING_APPROVAL: "bg-tertiary",
  REVISION_REQUIRED: "bg-error",
  APPROVED: "bg-emerald-600",
  SCHEDULED: "bg-emerald-600",
  PUBLISHED: "bg-emerald-600",
  FAILED: "bg-error",
};

function ContentCalendarInner() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const api = useApi();

  const [posts, setPosts] = useState<any[]>([]);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) { setLoading(false); return; }
    (async () => {
      try {
        const [postsData, projectData] = await Promise.all([
          api.posts.listByProject(projectId),
          api.projects.get(projectId),
        ]);
        setPosts(postsData);
        setProject(projectData);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthLabel = project
    ? `${MONTH_NAMES[(project.month || 1) - 1]} ${project.year}`
    : "Content Calendar";

  const contextLabel = project?.client?.name || project?.title || "Content Calendar";
  const awaitingCount = posts.filter((p) => p.status === "AWAITING_APPROVAL").length;

  if (loading) {
    return (
      <DashboardShell contextLabel="Content Calendar">
        <div className="p-12 flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </DashboardShell>
    );
  }

  if (!projectId || error) {
    return (
      <DashboardShell contextLabel="Content Calendar">
        <div className="p-12 text-center space-y-4">
          <p className="text-on-surface-variant">{error || "No project selected. Open a project from a client page."}</p>
          <Link href="/dashboard" className="text-primary hover:underline text-sm">← Dashboard</Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell contextLabel={contextLabel}>
      <div className="px-8 pb-12 pt-8 min-h-screen">

        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
              {project?.clientId && (
                <>
                  <Link href={`/clients/${project.clientId}`} className="hover:text-primary transition-colors">
                    {project.client?.name || "Client"}
                  </Link>
                  <Icon name="chevron_right" className="text-xs" />
                  <Link href={`/projects/${projectId}`} className="hover:text-primary transition-colors">
                    {project.title || monthLabel}
                  </Link>
                  <Icon name="chevron_right" className="text-xs" />
                </>
              )}
              <span className="text-on-surface font-semibold">Calendar</span>
            </div>
            <span className="uppercase tracking-[0.2em] text-on-surface-variant font-medium text-[10px]">Campaign Management</span>
            <h1 className="text-4xl font-headline font-extrabold tracking-tight text-primary">Content Calendar</h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-surface-container-low p-1 rounded-lg">
              <span className="px-4 py-2 bg-white shadow-sm rounded-md text-sm font-semibold text-primary">
                List View
              </span>
              <Link
                href={`/posting-plan?projectId=${projectId}`}
                className="px-4 py-2 text-sm font-semibold text-stone-500 hover:text-stone-700 transition-all"
              >
                Timeline
              </Link>
            </div>
            <div className="flex items-center bg-surface-container-low rounded-lg px-3 py-2 gap-2">
              <Icon name="calendar_month" className="text-primary text-sm" />
              <span className="text-sm font-bold text-primary font-headline">{monthLabel}</span>
            </div>
          </div>
        </header>

        {/* Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-between">
            <span className="uppercase tracking-widest text-[10px] text-stone-400">Total Posts</span>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-3xl font-headline font-bold text-primary">{String(posts.length).padStart(2, "0")}</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-between">
            <span className="uppercase tracking-widest text-[10px] text-stone-400">Awaiting Approval</span>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-3xl font-headline font-bold text-tertiary">{String(awaitingCount).padStart(2, "0")}</span>
              {awaitingCount > 0 && (
                <span className="bg-tertiary/10 text-tertiary px-2 py-0.5 rounded text-[10px] font-bold">Action Required</span>
              )}
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-between">
            <span className="uppercase tracking-widest text-[10px] text-stone-400">Approved</span>
            <div className="mt-4">
              <span className="text-3xl font-headline font-bold text-emerald-600">
                {String(posts.filter((p) => ["APPROVED","SCHEDULED","PUBLISHED"].includes(p.status)).length).padStart(2, "0")}
              </span>
            </div>
          </div>
          <div className="md:col-span-1 bg-primary text-white p-6 rounded-xl shadow-xl flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-base font-headline font-bold">{project?.title || monthLabel}</h3>
              <p className="text-primary-fixed-dim text-xs mt-1 capitalize">{project?.status?.replace(/_/g, " ")}</p>
            </div>
            <Link
              href={`/projects/${projectId}`}
              className="relative z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              Project
            </Link>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Icon name="calendar_month" className="text-[120px]" />
            </div>
          </div>
        </section>

        {/* Post table */}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Icon name="calendar_month" className="text-6xl text-primary/20 mb-6" />
            <p className="text-on-surface-variant text-sm">No posts in this calendar yet.</p>
            <Link href={`/projects/${projectId}`} className="text-primary hover:underline text-sm mt-3">
              ← Back to project to generate calendar
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-x-auto border border-outline-variant/5">
              <table className="w-full text-left border-collapse min-w-[860px]">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-8 py-4 uppercase tracking-widest text-[10px] font-bold text-stone-500">Post</th>
                    <th className="px-6 py-4 uppercase tracking-widest text-[10px] font-bold text-stone-500">Caption Preview</th>
                    <th className="px-6 py-4 uppercase tracking-widest text-[10px] font-bold text-stone-500">Status</th>
                    <th className="px-6 py-4 uppercase tracking-widest text-[10px] font-bold text-stone-500">Schedule</th>
                    <th className="px-8 py-4 text-right" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {posts.map((post: any) => (
                    <tr key={post.id} className="group hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                            <Icon name={PLATFORM_ICON[post.platform] || "share"} className="text-on-secondary-container" />
                          </div>
                          <div>
                            <p className="font-headline font-bold text-on-surface line-clamp-1">{post.topic}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mt-0.5">
                              {post.platform} · {post.format}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-sm text-on-surface-variant max-w-xs line-clamp-2">{post.caption}</p>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${STATUS_CLASSES[post.status] || "bg-secondary/10 text-secondary"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${STATUS_DOT[post.status] || "bg-secondary"}`} />
                          {post.status?.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-sm">
                          <p className="font-semibold text-on-surface">
                            {post.scheduledDate
                              ? new Date(post.scheduledDate).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })
                              : "—"}
                          </p>
                          <p className="text-stone-400 text-xs capitalize">{post.objective}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link
                          href={`/post-review?postId=${post.id}`}
                          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-surface-container-high rounded-lg transition-all inline-flex"
                        >
                          <Icon name="arrow_forward" className="text-stone-400" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="mt-8 flex items-center justify-between">
              <p className="text-xs text-stone-400 font-medium uppercase tracking-widest">
                {posts.length} post{posts.length !== 1 ? "s" : ""} this month
              </p>
              <Link
                href={`/posting-plan?projectId=${projectId}`}
                className="text-primary font-headline text-xs font-bold uppercase tracking-widest border-b border-primary/20 pb-1 hover:border-primary transition-all"
              >
                View Timeline →
              </Link>
            </footer>
          </>
        )}
      </div>
    </DashboardShell>
  );
}

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface">
    <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

export default function ContentCalendarPage() {
  return <Suspense fallback={<Spinner />}><ContentCalendarInner /></Suspense>;
}
