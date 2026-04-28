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

function ApprovalsInner() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  const api = useApi();

  const [posts, setPosts] = useState<any[]>([]);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    if (!clientId) { setLoading(false); return; }
    try {
      const [queue, clientData] = await Promise.all([
        api.posts.approvalQueue(clientId),
        api.clients.get(clientId),
      ]);
      setPosts(queue);
      setClient(clientData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  async function handleApprove(postId: string, action: "APPROVED" | "CHANGES_REQUESTED") {
    setApproving(postId);
    try {
      await api.posts.approve(postId, action, "");
      await loadData();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setApproving(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/80 glass-nav h-20 flex items-center shadow-sm shadow-emerald-900/5">
        <div className="flex justify-between items-center px-12 w-full mx-auto max-w-screen-2xl">
          <Link href="/dashboard" className="text-xl font-bold tracking-tighter text-primary font-headline">
            Atelier Martech
          </Link>
          <div className="hidden md:flex items-center space-x-10 font-headline tracking-tight font-semibold text-sm">
            <span className="text-primary border-b-2 border-primary pb-1">Approvals</span>
            {clientId && (
              <Link href={`/content-calendar?clientId=${clientId}`} className="text-on-surface-variant hover:text-primary transition-colors">
                Calendar
              </Link>
            )}
            <Link href="/publishing" className="text-on-surface-variant hover:text-primary transition-colors">
              Publishing
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {client && (
              <span className="text-sm font-semibold text-on-surface-variant">{client.name}</span>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-32 px-6 md:px-12 max-w-screen-2xl mx-auto">

        {/* Header */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              {client && (
                <span className="font-label text-[11px] uppercase tracking-[0.2em] text-primary mb-4 block">
                  {client.industry || "Current Campaign"}
                </span>
              )}
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-primary leading-none">
                {client?.name || "Approvals"}
              </h1>
              <p className="text-on-surface-variant mt-3 text-lg font-light">
                {posts.length === 0
                  ? "No posts awaiting your approval right now."
                  : `${posts.length} post${posts.length !== 1 ? "s" : ""} awaiting your review`}
              </p>
            </div>
            <div className="flex items-center gap-3 text-on-surface-variant font-label text-sm">
              <Icon name="fact_check" className="text-primary" />
              <span className="font-medium">{posts.length} pending</span>
            </div>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-error/10 text-error rounded-xl text-sm">{error}</div>
        )}

        {/* Empty state */}
        {!error && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Icon name="check_circle" className="text-6xl text-primary/20 mb-6" />
            <h3 className="text-xl font-headline font-bold text-on-surface mb-2">All caught up!</h3>
            <p className="text-on-surface-variant text-sm max-w-sm">
              No posts are awaiting approval. Check back once your designer uploads new creatives.
            </p>
            {clientId && (
              <Link href={`/clients/${clientId}`} className="text-primary hover:underline text-sm mt-4">
                ← Back to client
              </Link>
            )}
          </div>
        )}

        {/* Post grid */}
        {posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

            {/* Featured — first post */}
            {posts[0] && (
              <div className="md:col-span-8 group">
                <div className="bg-surface-container-lowest rounded-xl overflow-hidden editorial-shadow flex flex-col md:flex-row h-full transition-all duration-500 hover:-translate-y-1">
                  <div className="md:w-1/2 relative overflow-hidden min-h-[300px] bg-surface-container">
                    {posts[0].assets?.find((a: any) => a.isCurrent)?.fileUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={posts[0].topic}
                        src={posts[0].assets.find((a: any) => a.isCurrent).fileUrl}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30">
                        <Icon name="image" className="text-6xl" />
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                      <span className="bg-primary/10 backdrop-blur-md text-primary px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold">
                        Pending Approval
                      </span>
                    </div>
                  </div>
                  <div className="md:w-1/2 p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Icon name={PLATFORM_ICON[posts[0].platform] || "share"} className="text-primary text-lg" />
                        <span className="text-xs tracking-widest text-on-surface-variant uppercase font-semibold">
                          {posts[0].platform} · {posts[0].format}
                        </span>
                      </div>
                      <h3 className="font-headline text-2xl font-bold mb-3 leading-tight">{posts[0].topic}</h3>
                      <p className="text-on-surface-variant leading-relaxed mb-6 text-sm line-clamp-3 italic">
                        &ldquo;{posts[0].caption}&rdquo;
                      </p>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-xs py-2 border-b border-surface-container">
                          <span className="text-on-surface-variant">Scheduled</span>
                          <span className="font-semibold">
                            {posts[0].scheduledDate
                              ? new Date(posts[0].scheduledDate).toLocaleDateString("en", { month: "long", day: "numeric" })
                              : "TBD"}
                          </span>
                        </div>
                        {posts[0].cta && (
                          <div className="flex items-center justify-between text-xs py-2 border-b border-surface-container">
                            <span className="text-on-surface-variant">CTA</span>
                            <span className="font-semibold">{posts[0].cta}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleApprove(posts[0].id, "APPROVED")}
                        disabled={approving === posts[0].id}
                        className="bg-gradient-to-br from-primary to-primary-container text-white py-4 rounded-md text-[10px] tracking-widest font-bold uppercase transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {approving === posts[0].id ? (
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : "Approve"}
                      </button>
                      <button
                        onClick={() => handleApprove(posts[0].id, "CHANGES_REQUESTED")}
                        disabled={approving === posts[0].id}
                        className="bg-surface-container-highest text-on-surface py-4 rounded-md text-[10px] tracking-widest font-bold uppercase transition-all hover:bg-tertiary/10 active:scale-95 disabled:opacity-50"
                      >
                        Request Changes
                      </button>
                      <Link
                        href={`/post-review?postId=${posts[0].id}`}
                        className="col-span-2 text-center text-primary font-headline text-sm font-semibold py-2 hover:underline transition-all"
                      >
                        View Full Detail →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Side stack — remaining posts */}
            <div className="md:col-span-4 space-y-8">
              {posts.slice(1, 3).map((post: any) => (
                <div key={post.id} className="bg-surface-container-lowest rounded-xl overflow-hidden editorial-shadow transition-all duration-500 hover:-translate-y-1">
                  <div className="aspect-[4/3] relative bg-surface-container">
                    {post.assets?.find((a: any) => a.isCurrent)?.fileUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={post.topic}
                        src={post.assets.find((a: any) => a.isCurrent).fileUrl}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30">
                        <Icon name="image" className="text-4xl" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-secondary/10 backdrop-blur-md text-secondary px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold">
                        Needs Review
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name={PLATFORM_ICON[post.platform] || "share"} className="text-primary text-sm" />
                      <span className="text-[10px] uppercase tracking-widest font-semibold text-on-surface-variant">{post.platform}</span>
                    </div>
                    <h4 className="font-headline text-base font-bold mb-2 line-clamp-1">{post.topic}</h4>
                    <p className="text-on-surface-variant text-sm line-clamp-2 mb-4 italic">&ldquo;{post.caption}&rdquo;</p>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleApprove(post.id, "APPROVED")}
                        disabled={approving === post.id}
                        className="bg-gradient-to-br from-primary to-primary-container text-white py-2.5 rounded-md text-[10px] tracking-widest font-bold uppercase transition-all disabled:opacity-50 flex items-center justify-center"
                      >
                        {approving === post.id ? (
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : "Approve"}
                      </button>
                      <Link
                        href={`/post-review?postId=${post.id}`}
                        className="text-primary font-headline text-xs font-bold text-center py-1 hover:underline"
                      >
                        View Full Detail
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {posts.length > 3 && (
                <p className="text-center text-sm text-on-surface-variant">
                  +{posts.length - 3} more post{posts.length - 3 !== 1 ? "s" : ""} awaiting review
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface">
    <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

export default function ApprovalsPage() {
  return <Suspense fallback={<Spinner />}><ApprovalsInner /></Suspense>;
}
