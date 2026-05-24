"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useApi } from "@/hooks/useApi";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { useToast } from "@/components/ui/Toast";

const PLATFORM_ICON: Record<string, string> = {
  instagram: "camera",
  linkedin: "work",
  tiktok: "music_video",
  x: "tag",
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  SENT_TO_CLIENT:    { label: "Awaiting your approval", color: "bg-amber-100 text-amber-700" },
  CHANGES_REQUESTED: { label: "Changes requested",      color: "bg-orange-100 text-orange-700" },
  APPROVED:          { label: "Approved",               color: "bg-emerald-100 text-emerald-700" },
};

export default function ClientPortalPage() {
  const api  = useApi();
  const toast = useToast();
  const { checking, user } = useRoleGuard(["CLIENT", "ADMIN"]);

  const [client, setClient]       = useState<any>(null);
  const [strategy, setStrategy]   = useState<any>(null);
  const [posts, setPosts]         = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [notLinked, setNotLinked] = useState(false);

  const [approvingStrategy, setApprovingStrategy]   = useState(false);
  const [approvingPost, setApprovingPost]           = useState<string | null>(null);
  const [strategyComment, setStrategyComment]       = useState("");
  const [showStrategyComment, setShowStrategyComment] = useState(false);

  useEffect(() => {
    if (checking) return;
    (async () => {
      try {
        const clients = await api.clients.list();
        const myClient = clients[0];
        if (!myClient) {
          setNotLinked(true);
          setLoading(false);
          return;
        }
        setClient(myClient);

        const [strategies, approvalQueue] = await Promise.allSettled([
          api.strategy.listByClient(myClient.id),
          api.posts.approvalQueue(myClient.id),
        ]);

        if (strategies.status === "fulfilled") {
          const sent = strategies.value.find((s: any) =>
            ["SENT_TO_CLIENT", "CHANGES_REQUESTED", "APPROVED"].includes(s.status)
          );
          setStrategy(sent || null);
        }

        if (approvalQueue.status === "fulfilled") {
          setPosts(approvalQueue.value);
        }
      } catch (e: any) {
        toast.error("Failed to load portal", e?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking]);

  async function handleStrategyApprove(action: "APPROVED" | "CHANGES_REQUESTED") {
    if (!strategy) return;
    setApprovingStrategy(true);
    try {
      await api.strategy.approve(strategy.id, action, strategyComment);
      // Update status locally — the API returns { success, action }, not the full strategy
      setStrategy((prev: any) => ({
        ...prev,
        status: action === "APPROVED" ? "APPROVED" : "CHANGES_REQUESTED",
      }));
      setStrategyComment("");
      setShowStrategyComment(false);
      toast.success(action === "APPROVED" ? "Strategy approved!" : "Feedback submitted — your agency has been notified");
    } catch (e: any) {
      toast.error("Action failed", e?.message);
    } finally {
      setApprovingStrategy(false);
    }
  }

  async function handlePostApprove(postId: string, action: "APPROVED" | "CHANGES_REQUESTED") {
    setApprovingPost(postId);
    try {
      await api.posts.approve(postId, action, "");
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success(action === "APPROVED" ? "Post approved" : "Revision requested");
    } catch (e: any) {
      toast.error("Action failed", e?.message);
    } finally {
      setApprovingPost(null);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const pendingCount = posts.length + (strategy?.status === "SENT_TO_CLIENT" ? 1 : 0);

  return (
    <>
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md h-20 flex items-center border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-8 md:px-16 w-full max-w-screen-xl mx-auto">
          <span className="text-xl font-bold tracking-tighter text-primary font-headline">
            Atelier Martech
          </span>
          <div className="flex items-center gap-4">
            {pendingCount > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-tertiary/10 text-tertiary rounded-full text-[10px] font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                {pendingCount} pending
              </span>
            )}
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-headline font-bold text-sm">
              {user?.firstName?.charAt(0) || client?.name?.charAt(0) || "C"}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-24 px-6 md:px-16 max-w-screen-xl mx-auto">

        {/* Not linked state */}
        {!loading && notLinked && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Icon name="person_off" className="text-4xl text-primary/40" />
            </div>
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">Account not linked yet</h2>
            <p className="text-on-surface-variant max-w-sm mb-1">
              Your agency hasn&apos;t linked your portal account yet.
            </p>
            <p className="text-on-surface-variant/60 text-sm max-w-sm">
              Make sure you signed up with the same email your agency registered for you. If this persists, contact your account manager.
            </p>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-6 mt-8">
            <div className="h-32 bg-surface-container-lowest rounded-2xl animate-pulse" />
            <div className="h-64 bg-surface-container-lowest rounded-2xl animate-pulse" />
          </div>
        )}

        {/* Main content */}
        {!loading && client && (
          <>
            {/* Hero */}
            <header className="mb-12">
              <span className="text-[11px] uppercase tracking-[0.3em] text-primary font-semibold mb-3 block">
                Your Campaign Portal
              </span>
              <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-primary leading-none mb-2">
                {client.name}
              </h1>
              {(client.industry || client.platforms?.length) && (
                <p className="text-on-surface-variant text-lg font-light">
                  {client.industry || ""}{client.platforms?.length ? ` · ${client.platforms.join(", ")}` : ""}
                </p>
              )}
            </header>

            <div className="space-y-10">

              {/* ── Strategy ── */}
              {strategy ? (
                <section>
                  <div className="flex items-center gap-3 mb-5">
                    <h2 className="text-2xl font-headline font-bold text-on-surface">Marketing Strategy</h2>
                    {STATUS_LABEL[strategy.status] && (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${STATUS_LABEL[strategy.status].color}`}>
                        {STATUS_LABEL[strategy.status].label}
                      </span>
                    )}
                  </div>

                  <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
                    <div className="p-8 md:p-10">

                      {/* Summary */}
                      {strategy.summary && (
                        <div className="flex items-start gap-4 mb-8">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon name="auto_awesome" className="text-primary" />
                          </div>
                          <div>
                            <h3 className="font-headline font-bold text-xl text-on-surface mb-2">Strategic Overview</h3>
                            <p className="text-on-surface-variant leading-relaxed italic text-lg">
                              &ldquo;{strategy.summary}&rdquo;
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Content Pillars */}
                      {Array.isArray(strategy.contentPillars) && strategy.contentPillars.length > 0 && (
                        <div className="mb-8">
                          <h4 className="text-[11px] uppercase tracking-widest font-bold text-on-surface-variant mb-4">Content Pillars</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {strategy.contentPillars.map((p: any, i: number) => (
                              <div key={i} className="p-5 bg-surface-container rounded-xl">
                                <h5 className="font-headline font-bold text-sm mb-1">{p.name}</h5>
                                <p className="text-xs text-on-surface-variant leading-relaxed">{p.description}</p>
                                {p.postsPerMonth && (
                                  <p className="text-[10px] text-primary font-semibold mt-2 uppercase tracking-wide">{p.postsPerMonth} posts/mo</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Platform Strategy */}
                      {Array.isArray(strategy.platformStrategy) && strategy.platformStrategy.length > 0 && (
                        <div className="mb-8">
                          <h4 className="text-[11px] uppercase tracking-widest font-bold text-on-surface-variant mb-4">Platform Strategy</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {strategy.platformStrategy.map((p: any, i: number) => (
                              <div key={i} className="p-5 bg-surface-container rounded-xl flex items-start gap-3">
                                <Icon name={PLATFORM_ICON[p.platform?.toLowerCase()] || "share"} className="text-primary mt-0.5 shrink-0" />
                                <div>
                                  <p className="font-headline font-bold text-sm capitalize mb-1">{p.platform}</p>
                                  <p className="text-xs text-on-surface-variant">{p.frequency || p.contentMix || ""}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tone */}
                      {strategy.toneRecommendation && (
                        <div className="mb-8 flex items-start gap-3 p-5 bg-primary/5 rounded-xl">
                          <Icon name="record_voice_over" className="text-primary mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1">Voice &amp; Tone</p>
                            <p className="text-sm text-on-surface-variant italic">{strategy.toneRecommendation}</p>
                          </div>
                        </div>
                      )}

                      {/* Approved state */}
                      {strategy.status === "APPROVED" && (
                        <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200 mb-4">
                          <Icon name="check_circle" className="text-emerald-600 text-xl" />
                          <p className="text-emerald-700 font-semibold text-sm">You&apos;ve approved this strategy. Your agency is now working on your content calendar.</p>
                        </div>
                      )}

                      {/* Approval actions — only when pending */}
                      {strategy.status === "SENT_TO_CLIENT" && (
                        <>
                          {showStrategyComment && (
                            <textarea
                              value={strategyComment}
                              onChange={(e) => setStrategyComment(e.target.value)}
                              placeholder="What would you like us to change or adjust?"
                              className="w-full mb-5 bg-surface-container-low border-0 rounded-xl p-4 text-sm resize-none h-28 focus:ring-2 focus:ring-primary/30 outline-none"
                            />
                          )}
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              onClick={() => handleStrategyApprove("APPROVED")}
                              disabled={approvingStrategy}
                              className="flex-1 flex items-center justify-center gap-2 py-4 px-8 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold rounded-xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
                            >
                              {approvingStrategy ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <Icon name="check_circle" />
                              )}
                              Approve Strategy
                            </button>
                            <button
                              onClick={() => {
                                if (!showStrategyComment) { setShowStrategyComment(true); return; }
                                handleStrategyApprove("CHANGES_REQUESTED");
                              }}
                              disabled={approvingStrategy}
                              className="flex-1 flex items-center justify-center gap-2 py-4 px-8 border border-outline-variant/30 text-on-surface font-headline font-bold rounded-xl hover:bg-surface-container-low transition-colors disabled:opacity-50"
                            >
                              <Icon name="edit_note" />
                              {showStrategyComment ? "Submit Feedback" : "Request Changes"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </section>
              ) : (
                !loading && (
                  <div className="flex items-start gap-4 p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon name="hourglass_top" className="text-primary" />
                    </div>
                    <div>
                      <p className="font-headline font-bold text-on-surface mb-1">Strategy in progress</p>
                      <p className="text-on-surface-variant text-sm">Your agency is crafting your marketing strategy. You&apos;ll see it here once it&apos;s ready for your review.</p>
                    </div>
                  </div>
                )
              )}

              {/* ── Content for Review ── */}
              <section>
                <div className="flex items-center gap-4 mb-5">
                  <h2 className="text-2xl font-headline font-bold text-on-surface">Content for Review</h2>
                  {posts.length > 0 && (
                    <span className="px-3 py-1 bg-tertiary/10 text-tertiary rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {posts.length} post{posts.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {posts.length === 0 ? (
                  <div className="text-center py-14 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                    <Icon name="fact_check" className="text-5xl text-primary/20 mb-4" />
                    <p className="font-headline font-bold text-on-surface mb-1">All caught up</p>
                    <p className="text-on-surface-variant text-sm">No posts are awaiting your review right now.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {posts.map((post: any) => {
                      const currentAsset = post.assets?.find((a: any) => a.isCurrent) || post.assets?.[0];
                      return (
                        <div key={post.id} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
                          <div className="aspect-video bg-surface-container relative">
                            {currentAsset?.fileUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img alt={post.topic} src={currentAsset.fileUrl} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20">
                                <Icon name="image" className="text-5xl" />
                              </div>
                            )}
                            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-primary/90 text-white px-3 py-1 rounded-full">
                              <Icon name={PLATFORM_ICON[post.platform] || "share"} className="text-sm" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">{post.platform}</span>
                            </div>
                          </div>
                          <div className="p-7">
                            <div className="flex items-start justify-between gap-3 mb-4">
                              <h3 className="font-headline font-bold text-lg text-on-surface leading-tight">{post.topic}</h3>
                              <span className="text-[10px] text-stone-400 shrink-0 mt-1">
                                {post.scheduledDate
                                  ? new Date(post.scheduledDate).toLocaleDateString("en", { month: "short", day: "numeric" })
                                  : "TBD"}
                              </span>
                            </div>
                            <div className="p-4 bg-surface rounded-xl border-l-4 border-primary/20 mb-4">
                              <p className="text-sm text-on-surface italic leading-relaxed line-clamp-3">
                                &ldquo;{post.caption}&rdquo;
                              </p>
                              {post.hashtags?.length > 0 && (
                                <p className="text-primary text-xs mt-2">
                                  {post.hashtags.slice(0, 5).map((h: string) => `#${h}`).join(" ")}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() => handlePostApprove(post.id, "APPROVED")}
                                disabled={approvingPost === post.id}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold text-sm rounded-xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
                              >
                                {approvingPost === post.id ? (
                                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                  <><Icon name="check" className="text-sm" /> Approve</>
                                )}
                              </button>
                              <button
                                onClick={() => handlePostApprove(post.id, "CHANGES_REQUESTED")}
                                disabled={approvingPost === post.id}
                                className="flex-1 flex items-center justify-center gap-2 py-3 border border-outline-variant/30 text-on-surface font-headline font-bold text-sm rounded-xl hover:bg-surface-container-low transition-colors disabled:opacity-50"
                              >
                                <Icon name="edit_note" className="text-sm" /> Revise
                              </button>
                            </div>
                            <Link
                              href={`/post-review?postId=${post.id}`}
                              className="block text-center text-primary text-xs font-semibold mt-3 hover:underline"
                            >
                              View full detail →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </main>
    </>
  );
}
