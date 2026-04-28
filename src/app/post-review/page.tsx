"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useApi } from "@/hooks/useApi";

const PLATFORM_ICON: Record<string, string> = {
  instagram: "camera",
  linkedin: "work",
  tiktok: "music_video",
  x: "tag",
};

function PostReviewInner() {
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");
  const api = useApi();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) { setLoading(false); return; }
    (async () => {
      try {
        const data = await api.posts.get(postId);
        setPost(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  async function handleApprove(action: "APPROVED" | "CHANGES_REQUESTED") {
    if (!post) return;
    setApproving(true);
    try {
      const updated = await api.posts.approve(post.id, action, comment);
      setPost(updated);
      setComment("");
      setShowComment(false);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setApproving(false);
    }
  }

  const currentAsset = post?.assets?.find((a: any) => a.isCurrent) || post?.assets?.[0];
  const approvals: any[] = post?.approvals || [];
  const isApproved = ["APPROVED","SCHEDULED","PUBLISHED"].includes(post?.status);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!postId || error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface gap-4">
        <Icon name="error_outline" className="text-5xl text-primary/30" />
        <p className="text-on-surface-variant">{error || "Post not found."}</p>
        <Link href="/dashboard" className="text-primary hover:underline text-sm">← Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <>
      <header className="fixed top-0 w-full flex justify-between items-center px-8 h-16 bg-white/80 glass-nav z-50 shadow-sm shadow-emerald-900/5">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-xl font-bold tracking-tighter text-primary font-headline">
            Atelier Martech
          </Link>
          <div className="hidden md:flex gap-1 text-xs text-on-surface-variant items-center">
            {post.project?.clientId && (
              <>
                <Link href={`/clients/${post.project.clientId}`} className="hover:text-primary transition-colors">
                  {post.project?.client?.name || "Client"}
                </Link>
                <Icon name="chevron_right" className="text-xs" />
                <Link href={`/projects/${post.projectId}`} className="hover:text-primary transition-colors">
                  {post.project?.title || "Project"}
                </Link>
                <Icon name="chevron_right" className="text-xs" />
              </>
            )}
            <span className="text-on-surface font-semibold">{post.topic}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
            ${isApproved ? "bg-emerald-100 text-emerald-700" :
              post.status === "AWAITING_APPROVAL" ? "bg-tertiary/10 text-tertiary" :
              post.status === "REVISION_REQUIRED" ? "bg-error/10 text-error" :
              "bg-secondary/10 text-secondary"}`}>
            {post.status?.replace(/_/g, " ")}
          </span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-container-low text-on-surface-variant text-xs font-medium">
            <Icon name={PLATFORM_ICON[post.platform] || "share"} className="text-[18px]" />
            <span className="capitalize">{post.platform} · {post.format}</span>
          </div>
        </div>
      </header>

      <main className="pt-16 min-h-screen flex flex-col lg:flex-row">
        {/* Creative preview */}
        <section className="flex-1 bg-surface-container-low p-6 md:p-12 flex items-center justify-center relative overflow-hidden min-h-[500px]">
          <div className="relative w-full max-w-4xl aspect-[4/5] md:aspect-video bg-surface-container-lowest shadow-2xl shadow-emerald-900/10 rounded-xl overflow-hidden group">
            {currentAsset ? (
              currentAsset.fileType === "video" ? (
                <video
                  src={currentAsset.fileUrl}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt="Asset preview"
                  className="w-full h-full object-cover"
                  src={currentAsset.fileUrl}
                />
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant/40 gap-4">
                <Icon name="image" className="text-6xl" />
                <p className="text-sm font-medium uppercase tracking-widest">No creative uploaded yet</p>
              </div>
            )}
            <div className="absolute top-6 right-6 bg-emerald-900/90 text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase backdrop-blur">
              {post.platform} / {post.format}
            </div>
          </div>
          {post.assets?.length > 1 && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-on-surface-variant/40 flex items-center gap-2">
              <Icon name="info" className="text-sm" />
              <span className="text-[11px] font-medium tracking-wide uppercase">
                {post.assets.length} version{post.assets.length !== 1 ? "s" : ""} uploaded
              </span>
            </div>
          )}
        </section>

        {/* Side panel */}
        <aside className="w-full lg:w-[480px] bg-surface-container-lowest flex flex-col lg:h-[calc(100vh-64px)] shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
          <div className="flex-1 overflow-y-auto p-8">

            {/* Meta */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase
                  ${post.status === "AWAITING_APPROVAL" ? "bg-tertiary/10 text-tertiary" :
                    isApproved ? "bg-emerald-100 text-emerald-700" :
                    "bg-secondary/10 text-secondary"}`}>
                  {post.status?.replace(/_/g, " ")}
                </span>
                <span className="text-on-surface-variant/40 text-[10px] font-bold tracking-widest uppercase">
                  {post.scheduledDate
                    ? new Date(post.scheduledDate).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })
                    : "Unscheduled"}
                </span>
              </div>
              <h1 className="text-2xl font-headline font-extrabold tracking-tight text-primary leading-tight">
                {post.topic}
              </h1>
              {post.pillar && (
                <p className="mt-1 text-on-surface-variant text-xs font-medium uppercase tracking-widest">{post.pillar}</p>
              )}
            </div>

            {/* Caption */}
            <div className="mb-8 space-y-3">
              <h3 className="uppercase tracking-[0.2em] text-[10px] font-bold text-on-surface-variant/60">Caption</h3>
              <div className="p-5 bg-surface rounded-xl border-l-4 border-primary/20">
                <p className="text-on-surface font-headline text-sm leading-relaxed italic">
                  &ldquo;{post.caption}&rdquo;
                </p>
                {post.hashtags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {post.hashtags.map((tag: string) => (
                      <span key={tag} className="text-primary text-xs font-medium">#{tag}</span>
                    ))}
                  </div>
                )}
                {post.cta && (
                  <p className="mt-3 text-[10px] uppercase tracking-widest font-semibold text-on-surface-variant">
                    CTA: {post.cta}
                  </p>
                )}
              </div>
              {post.hook && (
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1">Hook</p>
                  <p className="text-sm font-headline font-semibold text-on-surface">&ldquo;{post.hook}&rdquo;</p>
                </div>
              )}
            </div>

            {/* Creative Direction */}
            {post.creativeNote && (
              <div className="mb-8 space-y-3">
                <h3 className="uppercase tracking-[0.2em] text-[10px] font-bold text-on-surface-variant/60">Creative Direction</h3>
                <div className="flex gap-3">
                  <Icon name="palette" className="text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-on-surface-variant leading-relaxed">{post.creativeNote}</p>
                </div>
              </div>
            )}

            {/* Approval history */}
            {approvals.length > 0 && (
              <div className="mb-6 space-y-4">
                <h3 className="uppercase tracking-[0.2em] text-[10px] font-bold text-on-surface-variant/60">
                  Approval History
                </h3>
                <div className="space-y-4">
                  {approvals.map((a: any) => (
                    <div key={a.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                        <Icon
                          name={a.action === "APPROVED" ? "check_circle" : a.action === "REJECTED" ? "cancel" : "edit_note"}
                          className={`text-sm ${a.action === "APPROVED" ? "text-emerald-600" : a.action === "REJECTED" ? "text-error" : "text-tertiary"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-on-surface capitalize">
                            {a.user?.firstName || "User"} — {a.action.replace(/_/g, " ")}
                          </span>
                          <span className="text-[10px] text-on-surface-variant/50">
                            {new Date(a.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                        {a.comment && (
                          <p className="text-sm text-on-surface-variant leading-relaxed">{a.comment}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comment input */}
            {showComment && (
              <div className="mb-4">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment or revision note…"
                  className="w-full bg-surface-container-low border-0 rounded-lg p-4 text-sm resize-none h-24 focus:ring-2 focus:ring-primary/30 outline-none"
                />
              </div>
            )}
          </div>

          {/* Action bar */}
          {!isApproved ? (
            <div className="p-8 bg-surface-container-lowest shadow-[0_-10px_30px_rgba(0,0,0,0.03)] flex gap-4">
              <button
                onClick={() => {
                  if (!showComment) { setShowComment(true); return; }
                  handleApprove("CHANGES_REQUESTED");
                }}
                disabled={approving}
                className="flex-1 py-4 px-6 border border-outline-variant/30 text-primary font-headline font-bold text-sm rounded-md hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Icon name="edit_note" className="text-[18px]" />
                {showComment ? "Submit Changes" : "Request Changes"}
              </button>
              <button
                onClick={() => handleApprove("APPROVED")}
                disabled={approving}
                className="flex-[1.5] py-4 px-6 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold text-sm rounded-md shadow-lg shadow-emerald-900/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {approving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Icon name="check_circle" className="text-[18px]" />
                )}
                Approve Post
              </button>
            </div>
          ) : (
            <div className="p-8 bg-emerald-50 flex items-center justify-center gap-3">
              <Icon name="check_circle" className="text-emerald-600 text-xl" />
              <span className="font-headline font-bold text-emerald-700 uppercase tracking-widest text-sm">Post Approved</span>
            </div>
          )}
        </aside>
      </main>
    </>
  );
}

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface">
    <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

export default function PostReviewPage() {
  return <Suspense fallback={<Spinner />}><PostReviewInner /></Suspense>;
}
