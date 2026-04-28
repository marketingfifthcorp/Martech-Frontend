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

function PostingPlanInner() {
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
  const monthLabel = project ? `${MONTH_NAMES[(project.month || 1) - 1]} ${project.year}` : "Posting Plan";
  const approvedCount = posts.filter((p) => ["APPROVED","SCHEDULED","PUBLISHED"].includes(p.status)).length;
  const needsRefinementCount = posts.filter((p) => p.status === "REVISION_REQUIRED").length;

  if (loading) {
    return (
      <DashboardShell contextLabel="Posting Plan">
        <div className="p-12 flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </DashboardShell>
    );
  }

  if (!projectId || error) {
    return (
      <DashboardShell contextLabel="Posting Plan">
        <div className="p-12 text-center space-y-4">
          <p className="text-on-surface-variant">{error || "No project selected."}</p>
          <Link href="/dashboard" className="text-primary hover:underline text-sm">← Dashboard</Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell contextLabel={project?.client?.name || monthLabel}>
      <div className="p-12 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-4">
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
              <span className="text-on-surface font-semibold">Posting Plan</span>
            </div>
            <span className="text-primary text-[11px] uppercase tracking-[0.3em] font-semibold mb-3 block">
              Strategic Implementation
            </span>
            <h2 className="text-5xl font-headline font-extrabold text-on-surface tracking-tighter leading-tight">
              Content Planner
            </h2>
            <p className="text-on-surface-variant mt-4 text-lg font-light leading-relaxed">
              {monthLabel} — {posts.length} posts scheduled across {[...new Set(posts.map((p) => p.platform))].join(", ") || "all platforms"}.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/content-calendar?projectId=${projectId}`}
              className="flex items-center gap-2 px-5 py-2.5 border border-outline-variant/30 text-on-surface rounded-md text-sm font-semibold hover:bg-surface-container-low transition-colors"
            >
              <Icon name="list" className="text-sm" />
              List View
            </Link>
            <Link
              href={`/publishing`}
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-md font-medium tracking-wide hover:shadow-lg transition-all"
            >
              <span>Publishing Queue</span>
              <Icon name="arrow_forward" className="text-sm group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Table */}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Icon name="edit_calendar" className="text-6xl text-primary/20 mb-6" />
            <p className="text-on-surface-variant text-sm">No posts in this plan yet.</p>
            <Link href={`/projects/${projectId}`} className="text-primary hover:underline text-sm mt-3">
              ← Generate calendar first
            </Link>
          </div>
        ) : (
          <div className="bg-surface-container-low rounded-xl p-8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    <th className="pb-6 pr-4 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">Date</th>
                    <th className="pb-6 px-4 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold w-1/4">Caption</th>
                    <th className="pb-6 px-4 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">Platform</th>
                    <th className="pb-6 px-4 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold w-1/4">Creative Direction</th>
                    <th className="pb-6 px-4 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">Status</th>
                    <th className="pb-6 pl-4 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {posts.map((post: any) => {
                    const isApproved = ["APPROVED","SCHEDULED","PUBLISHED"].includes(post.status);
                    return (
                      <tr key={post.id} className="group hover:bg-surface-container-lowest transition-colors duration-300">
                        <td className="py-8 pr-4">
                          <span className="text-base font-semibold font-headline">
                            {post.scheduledDate
                              ? new Date(post.scheduledDate).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })
                              : "—"}
                          </span>
                          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wide">{post.objective}</p>
                        </td>
                        <td className="py-8 px-4">
                          <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed italic">
                            &ldquo;{post.caption}&rdquo;
                          </p>
                          {post.hashtags?.length > 0 && (
                            <p className="text-[10px] text-primary mt-1 line-clamp-1">
                              {post.hashtags.slice(0, 3).map((h: string) => `#${h}`).join(" ")}
                            </p>
                          )}
                        </td>
                        <td className="py-8 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                              <Icon name={PLATFORM_ICON[post.platform] || "share"} className="text-[14px] text-on-secondary-container" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-on-surface uppercase tracking-wide">{post.platform}</p>
                              <p className="text-[10px] text-zinc-400 uppercase">{post.format}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-8 px-4">
                          <p className="text-xs text-zinc-500 italic font-light line-clamp-2">{post.creativeNote}</p>
                        </td>
                        <td className="py-8 px-4">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full
                            ${isApproved ? "bg-emerald-100 text-emerald-700" :
                              post.status === "AWAITING_APPROVAL" ? "bg-tertiary/10 text-tertiary" :
                              post.status === "REVISION_REQUIRED" ? "bg-error/10 text-error" :
                              "bg-secondary/10 text-secondary"}`}>
                            {post.status?.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-8 pl-4 text-right">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isApproved ? (
                              <div className="flex items-center gap-1 text-primary">
                                <Icon name="check_circle" className="text-sm" />
                                <span className="text-[11px] uppercase tracking-widest font-bold">Approved</span>
                              </div>
                            ) : (
                              <Link
                                href={`/post-review?postId=${post.id}`}
                                className="text-[11px] uppercase tracking-widest font-semibold bg-primary/10 text-primary px-4 py-2 rounded hover:bg-primary/20 transition-colors"
                              >
                                Review
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Campaign Health */}
        {posts.length > 0 && (
          <section className="mt-16 grid grid-cols-12 gap-12 items-center">
            <div className="col-span-12 lg:col-span-5">
              <div className="bg-surface-container-lowest rounded-2xl p-10 shadow-sm border border-outline-variant/10">
                <h3 className="text-2xl font-headline font-bold mb-6">Campaign Health</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[11px] uppercase tracking-widest mb-2">
                      <span>Content Ready</span>
                      <span>{posts.length > 0 ? Math.round((approvedCount / posts.length) * 100) : 0}%</span>
                    </div>
                    <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${posts.length > 0 ? (approvedCount / posts.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <span className="text-3xl font-headline font-bold block">{posts.length}</span>
                      <span className="text-[10px] uppercase tracking-widest text-zinc-400">Posts Planned</span>
                    </div>
                    <div>
                      <span className="text-3xl font-headline font-bold block">{approvedCount}</span>
                      <span className="text-[10px] uppercase tracking-widest text-zinc-400">Approved</span>
                    </div>
                    <div>
                      <span className="text-3xl font-headline font-bold block">{needsRefinementCount}</span>
                      <span className="text-[10px] uppercase tracking-widest text-zinc-400">Refinements</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-7">
              <div className="bg-primary text-white p-16 rounded-3xl overflow-hidden relative">
                <div className="relative z-10">
                  <span className="text-primary-fixed text-[10px] uppercase tracking-[0.4em] mb-4 block">Next Step</span>
                  <h3 className="text-4xl font-headline font-extrabold tracking-tight leading-tight mb-8">
                    {approvedCount === posts.length
                      ? "Ready to Queue"
                      : approvedCount > 0
                      ? "Keep Approving"
                      : "Start Reviewing"}
                  </h3>
                  <p className="text-on-primary-container text-lg font-light mb-8 max-w-md">
                    {approvedCount === posts.length
                      ? "All posts approved. Move this project to the publishing queue."
                      : `${posts.length - approvedCount} posts still need review before publishing.`}
                  </p>
                  <Link
                    href={`/projects/${projectId}`}
                    className="flex items-center gap-3 text-sm font-semibold w-fit"
                  >
                    <span className="border-b-2 border-primary-fixed pb-1">View Project</span>
                    <Icon name="east" className="text-lg" />
                  </Link>
                </div>
                <div className="absolute -right-24 -bottom-24 w-80 h-80 opacity-10 rotate-12">
                  <Icon name="calendar_month" className="text-[200px]" />
                </div>
              </div>
            </div>
          </section>
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

export default function PostingPlanPage() {
  return <Suspense fallback={<Spinner />}><PostingPlanInner /></Suspense>;
}
