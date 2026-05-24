"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Icon } from "@/components/ui/Icon";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/components/ui/Toast";

const PLATFORM_ICON: Record<string, string> = {
  instagram: "photo_camera",
  linkedin: "work",
  tiktok: "music_video",
  x: "tag",
};

const STATUS_CLASSES: Record<string, string> = {
  SCHEDULED: "bg-primary/10 text-primary",
  PUBLISHING: "bg-secondary-container/30 text-secondary",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-error/10 text-error",
  CANCELLED: "bg-secondary/10 text-secondary",
};

export default function PublishingPage() {
  const api = useApi();
  const toast = useToast();

  const [queue, setQueue] = useState<any[]>([]);
  const [log, setLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [retrying, setRetrying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    try {
      const [queueData, logData] = await Promise.all([
        api.publishing.getQueue(),
        api.publishing.getLog(),
      ]);
      setQueue(queueData);
      setLog(logData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handlePublish(postId: string) {
    setPublishing(postId);
    try {
      await api.publishing.publishPost(postId);
      await loadData();
    } catch (e: any) {
      toast.error("Error", e.message);
    } finally {
      setPublishing(null);
    }
  }

  async function handleRetry(postId: string) {
    setRetrying(postId);
    try {
      await api.publishing.retryFailed(postId);
      await loadData();
    } catch (e: any) {
      toast.error("Error", e.message);
    } finally {
      setRetrying(null);
    }
  }

  const failedCount = queue.filter((p) => p.status === "FAILED").length;
  const scheduledCount = queue.filter((p) => p.status === "SCHEDULED").length;

  if (loading) {
    return (
      <DashboardShell contextLabel="Publishing">
        <div className="p-12 flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </DashboardShell>
    );
  }

  const allPosts = [...queue, ...log];

  return (
    <DashboardShell contextLabel="Publishing">
      <div className="pt-8 pb-24 px-8 md:px-12 max-w-screen-2xl mx-auto">

        {/* Hero */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-bold mb-4 block">Social Publishing</span>
            <h1 className="font-headline text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
              Scheduled Posts Tracker
            </h1>
            <p className="mt-4 text-on-surface-variant text-lg leading-relaxed">
              {queue.length > 0
                ? `${scheduledCount} scheduled · ${failedCount > 0 ? `${failedCount} failed` : "all systems go"}`
                : "No posts in the publishing queue."}
            </p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-6 py-3 bg-surface-container-highest text-on-surface font-headline text-sm font-semibold rounded-md hover:bg-surface-dim transition-colors"
          >
            <Icon name="refresh" />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-error/10 text-error rounded-xl text-sm">{error}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Timeline */}
          <div className="lg:col-span-8 space-y-10">

            {/* Queue */}
            {queue.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-headline text-2xl font-bold">Publishing Queue</h2>
                  <div className="h-px flex-grow bg-outline-variant/30" />
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">{queue.length} posts</span>
                </div>
                <div className="space-y-5">
                  {queue.map((item: any) => (
                    <div
                      key={item.id}
                      className={`group relative flex flex-col md:flex-row gap-6 p-7 rounded-xl transition-all duration-300 bg-surface-container-lowest hover:shadow-xl hover:shadow-emerald-900/5
                        ${item.status === "FAILED" ? "border border-error/20" : ""}`}
                    >
                      <div className="flex flex-col justify-between flex-grow">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                                <Icon name={PLATFORM_ICON[item.platform] || "share"} className="text-lg text-primary" />
                              </div>
                              <span className="text-[11px] uppercase tracking-widest text-on-surface-variant font-semibold">
                                {item.platform}
                              </span>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest ${STATUS_CLASSES[item.status] || "bg-secondary/10 text-secondary"}`}>
                              {item.status}
                            </div>
                          </div>
                          <h3 className="font-headline text-lg font-bold mb-1">{item.post?.topic || "Scheduled Post"}</h3>
                          {item.post?.caption && (
                            <p className="text-on-surface-variant line-clamp-2 text-sm leading-relaxed italic">
                              &ldquo;{item.post.caption}&rdquo;
                            </p>
                          )}
                        </div>
                        <div className="mt-5 flex items-center gap-6">
                          <div className="flex items-center gap-2 text-primary">
                            <Icon name="schedule" className="text-base" />
                            <span className="text-[11px] font-bold tracking-widest">
                              {item.scheduledAt
                                ? new Date(item.scheduledAt).toLocaleDateString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                                : "Unscheduled"}
                            </span>
                          </div>
                          {item.status === "SCHEDULED" && (
                            <button
                              onClick={() => handlePublish(item.postId)}
                              disabled={publishing === item.id}
                              className="text-[11px] uppercase tracking-widest font-bold text-white bg-primary px-4 py-2 rounded hover:bg-primary-container transition-colors disabled:opacity-50 flex items-center gap-1"
                            >
                              {publishing === item.id ? (
                                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <><Icon name="send" className="text-sm" /> Publish Now</>
                              )}
                            </button>
                          )}
                          {item.status === "FAILED" && (
                            <div className="flex items-center gap-3">
                              {item.errorMessage && (
                                <span className="text-[10px] text-error">{item.errorMessage}</span>
                              )}
                              <button
                                onClick={() => handleRetry(item.postId)}
                                disabled={retrying === item.postId}
                                className="text-[11px] uppercase tracking-widest font-bold text-error border border-error/30 px-4 py-2 rounded hover:bg-error/5 transition-colors disabled:opacity-50"
                              >
                                {retrying === item.postId ? "Retrying…" : "Retry"}
                              </button>
                            </div>
                          )}
                          <Link
                            href={`/post-review?postId=${item.postId}`}
                            className="text-on-surface-variant hover:text-primary transition-colors"
                          >
                            <Icon name="open_in_new" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Publish log */}
            {log.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-headline text-2xl font-bold">Published</h2>
                  <div className="h-px flex-grow bg-outline-variant/30" />
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{log.length} posts</span>
                </div>
                <div className="space-y-4">
                  {log.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-5 p-6 rounded-xl bg-surface-container-low/50 opacity-80">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                        <Icon name={PLATFORM_ICON[item.platform] || "share"} className="text-lg text-emerald-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-headline font-bold text-base line-clamp-1">{item.post?.topic || "Published Post"}</h3>
                        <p className="text-xs text-on-surface-variant capitalize">{item.platform}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <Icon name="check_circle" className="text-base" />
                          <span className="text-[11px] font-bold tracking-widest uppercase">
                            {item.publishedAt
                              ? new Date(item.publishedAt).toLocaleDateString("en", { month: "short", day: "numeric" })
                              : "Published"}
                          </span>
                        </div>
                        {item.liveUrl && (
                          <a
                            href={item.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-[11px] font-bold tracking-widest flex items-center gap-1"
                          >
                            VIEW LIVE
                            <Icon name="north_east" className="text-sm" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty */}
            {queue.length === 0 && log.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Icon name="send" className="text-6xl text-primary/20 mb-6" />
                <h3 className="text-xl font-headline font-bold text-on-surface mb-2">Queue is empty</h3>
                <p className="text-on-surface-variant text-sm max-w-sm">
                  Approve posts and move projects to the publishing queue to see them here.
                </p>
                <Link href="/dashboard" className="text-primary hover:underline text-sm mt-4">← Dashboard</Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-surface-container-low rounded-2xl p-7 space-y-6">
              <h3 className="font-headline text-lg font-bold">Campaign Pulse</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest p-5 rounded-xl">
                  <span className="block text-primary text-3xl font-bold mb-1">{scheduledCount}</span>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">Scheduled</span>
                </div>
                <div className="bg-surface-container-lowest p-5 rounded-xl">
                  <span className="block text-emerald-600 text-3xl font-bold mb-1">{log.length}</span>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">Published</span>
                </div>
                {failedCount > 0 && (
                  <div className="col-span-2 bg-error/5 p-4 rounded-xl border border-error/20">
                    <span className="block text-error text-2xl font-bold mb-1">{failedCount}</span>
                    <span className="text-[10px] uppercase tracking-widest text-error">Failed — needs attention</span>
                  </div>
                )}
              </div>
            </div>

            <div className="relative bg-surface-container-lowest rounded-2xl p-7 shadow-xl shadow-emerald-900/5 border border-primary/5 overflow-hidden">
              <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-widest text-primary font-bold mb-3 block">Publishing Status</span>
                <h4 className="font-headline text-lg font-bold mb-3">
                  {failedCount > 0 ? "Action Required" : "All Systems Go"}
                </h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {failedCount > 0
                    ? `${failedCount} post${failedCount !== 1 ? "s" : ""} failed to publish. Review and retry.`
                    : "Your publishing queue is healthy. Posts will go live at their scheduled times."}
                </p>
              </div>
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
            </div>
          </aside>
        </div>
      </div>
    </DashboardShell>
  );
}
