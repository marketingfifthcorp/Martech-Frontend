"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Icon } from "@/components/ui/Icon";
import { useApi } from "@/hooks/useApi";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const POST_STATUS_STYLE: Record<string, string> = {
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

const PROJECT_STATUS_STYLE: Record<string, string> = {
  PLANNING: "bg-secondary/10 text-secondary",
  CALENDAR_GENERATING: "bg-primary/10 text-primary",
  CALENDAR_READY: "bg-primary/10 text-primary",
  IN_DESIGN: "bg-secondary/10 text-secondary",
  IN_REVIEW: "bg-tertiary/10 text-tertiary",
  APPROVED: "bg-emerald-100 text-emerald-700",
  PUBLISHING: "bg-primary/10 text-primary",
  COMPLETED: "bg-emerald-100 text-emerald-700",
};

const PLATFORM_ICON: Record<string, string> = {
  instagram: "camera",
  linkedin: "work",
  tiktok: "music_video",
  x: "tag",
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const api = useApi();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingCalendar, setGeneratingCalendar] = useState(false);
  const [queueing, setQueueing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.projects.get(id);
        setProject(data);
      } catch {
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleGenerateCalendar() {
    setGeneratingCalendar(true);
    try {
      await api.projects.generateCalendar(id);
      const refreshed = await api.projects.get(id);
      setProject(refreshed);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setGeneratingCalendar(false);
    }
  }

  async function handleQueueProject() {
    setQueueing(true);
    try {
      await api.publishing.queueProject(id);
      const refreshed = await api.projects.get(id);
      setProject(refreshed);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setQueueing(false);
    }
  }

  if (loading) {
    return (
      <DashboardShell contextLabel="Campaign">
        <div className="p-12 flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </DashboardShell>
    );
  }

  if (!project) return null;

  const posts: any[] = project.posts || [];
  const monthLabel = `${MONTH_NAMES[(project.month || 1) - 1]} ${project.year}`;
  const statusStyle = PROJECT_STATUS_STYLE[project.status] || "bg-secondary/10 text-secondary";
  const approvedCount = posts.filter((p: any) => ["APPROVED","SCHEDULED","PUBLISHED"].includes(p.status)).length;
  const awaitingCount = posts.filter((p: any) => p.status === "AWAITING_APPROVAL").length;

  return (
    <DashboardShell contextLabel={project.title || monthLabel}>
      <div className="p-8 md:p-12 max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-8">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <Icon name="chevron_right" className="text-xs" />
          {project.client && (
            <>
              <Link href={`/clients/${project.clientId}`} className="hover:text-primary transition-colors">
                {project.client.name}
              </Link>
              <Icon name="chevron_right" className="text-xs" />
            </>
          )}
          <span className="text-on-surface font-semibold">{project.title || monthLabel}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">
                {project.title || monthLabel}
              </h1>
              <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${statusStyle}`}>
                {project.status?.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-on-surface-variant text-sm">
              {project.client?.name && <span>{project.client.name} · </span>}
              {posts.length} posts · {approvedCount} approved
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            {posts.length > 0 && (
              <Link
                href={`/content-calendar?projectId=${id}`}
                className="flex items-center gap-2 px-5 py-2.5 border border-outline-variant/30 text-on-surface rounded-md text-sm font-semibold hover:bg-surface-container-low transition-colors"
              >
                <Icon name="calendar_month" className="text-sm" />
                View Calendar
              </Link>
            )}
            {project.status === "PLANNING" && (
              <button
                onClick={handleGenerateCalendar}
                disabled={generatingCalendar}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-md text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60"
              >
                {generatingCalendar ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating…</>
                ) : (
                  <><Icon name="auto_awesome" className="text-sm" /> Generate Calendar</>
                )}
              </button>
            )}
            {project.status === "APPROVED" && (
              <button
                onClick={handleQueueProject}
                disabled={queueing}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-md text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60"
              >
                {queueing ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Queuing…</>
                ) : (
                  <><Icon name="send" className="text-sm" /> Move to Queue</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Stats row */}
        {posts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Total Posts", value: posts.length, color: "text-primary" },
              { label: "Approved", value: approvedCount, color: "text-emerald-600" },
              { label: "Awaiting Approval", value: awaitingCount, color: "text-tertiary" },
              { label: "In Design", value: posts.filter((p: any) => p.status === "IN_DESIGN").length, color: "text-secondary" },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10">
                <span className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2">{stat.label}</span>
                <span className={`text-3xl font-headline font-bold ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Post Grid */}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Icon name="calendar_month" className="text-6xl text-primary/20 mb-6" />
            <h3 className="text-xl font-headline font-bold text-on-surface mb-2">No posts yet</h3>
            <p className="text-on-surface-variant text-sm mb-6 max-w-sm">
              Generate the content calendar to create all posts for this month automatically.
            </p>
            {project.status === "PLANNING" && (
              <button
                onClick={handleGenerateCalendar}
                disabled={generatingCalendar}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-md text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60"
              >
                {generatingCalendar ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating…</>
                ) : (
                  <><Icon name="auto_awesome" className="text-sm" /> Generate Calendar</>
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-x-auto border border-outline-variant/5">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-4 uppercase tracking-widest text-[10px] font-bold text-stone-500">Date</th>
                  <th className="px-6 py-4 uppercase tracking-widest text-[10px] font-bold text-stone-500">Platform</th>
                  <th className="px-6 py-4 uppercase tracking-widest text-[10px] font-bold text-stone-500">Topic</th>
                  <th className="px-6 py-4 uppercase tracking-widest text-[10px] font-bold text-stone-500">Hook</th>
                  <th className="px-6 py-4 uppercase tracking-widest text-[10px] font-bold text-stone-500">Status</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {posts.map((post: any) => (
                  <tr key={post.id} className="group hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-on-surface whitespace-nowrap">
                      {post.scheduledDate
                        ? new Date(post.scheduledDate).toLocaleDateString("en", { month: "short", day: "numeric" })
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center">
                          <Icon name={PLATFORM_ICON[post.platform] || "share"} className="text-[14px] text-on-secondary-container" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold capitalize text-on-surface">{post.platform}</p>
                          <p className="text-[10px] text-stone-400 uppercase">{post.format}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[200px]">
                      <p className="text-sm text-on-surface font-medium line-clamp-1">{post.topic}</p>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wide mt-0.5">{post.objective}</p>
                    </td>
                    <td className="px-6 py-4 max-w-[200px]">
                      <p className="text-xs text-on-surface-variant italic line-clamp-2">&ldquo;{post.hook}&rdquo;</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${POST_STATUS_STYLE[post.status] || "bg-secondary/10 text-secondary"}`}>
                        {post.status?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/post-review?postId=${post.id}`}
                        className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 text-primary text-[11px] font-bold uppercase tracking-widest hover:underline transition-opacity"
                      >
                        Review
                        <Icon name="arrow_forward" className="text-sm" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
