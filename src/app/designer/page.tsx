"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
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

const DESIGN_STATUSES = ["DRAFT", "IN_DESIGN", "CREATIVE_UPLOADED", "REVISION_REQUIRED"];

export default function DesignerPage() {
  const api = useApi();
  const toast = useToast();
  const { checking } = useRoleGuard(["DESIGNER", "ADMIN"]);

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<string | null>(null);

  useEffect(() => {
    if (checking) return;
    (async () => {
      try {
        const clients = await api.clients.list();
        const postArrays = await Promise.all(
          clients.map((c: any) => api.posts.listByClient(c.id).catch(() => []))
        );
        const all = postArrays.flat().filter((p: any) => DESIGN_STATUSES.includes(p.status));
        // Attach client name from the clients list
        const clientMap = Object.fromEntries(clients.map((c: any) => [c.id, c]));
        const enriched = all.map((p: any) => ({
          ...p,
          clientName: clientMap[p.project?.clientId]?.name || "—",
        }));
        enriched.sort((a: any, b: any) =>
          new Date(a.scheduledDate || 0).getTime() - new Date(b.scheduledDate || 0).getTime()
        );
        setPosts(enriched);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const postId = uploadTargetRef.current;
    if (!file || !postId) return;
    setUploading(postId);
    try {
      await api.assets.upload(postId, file, "");
      // Refresh the post in the list
      const updated = await api.posts.get(postId);
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, ...updated, clientName: p.clientName } : p)));
    } catch (e: any) {
      toast.error("Upload failed", e.message);
    } finally {
      setUploading(null);
      uploadTargetRef.current = null;
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function triggerUpload(postId: string) {
    uploadTargetRef.current = postId;
    fileInputRef.current?.click();
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const platforms = ["ALL", ...Array.from(new Set(posts.map((p) => p.platform)))];
  const filtered = filter === "ALL" ? posts : posts.filter((p) => p.platform === filter);

  const needsUpload = posts.filter((p) => ["DRAFT", "IN_DESIGN"].includes(p.status)).length;
  const revisions = posts.filter((p) => p.status === "REVISION_REQUIRED").length;
  const uploaded = posts.filter((p) => p.status === "CREATIVE_UPLOADED").length;

  return (
    <DashboardShell contextLabel="Design Studio">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="p-8 md:p-12 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <span className="text-[11px] uppercase tracking-[0.3em] text-primary font-semibold mb-2 block">
            Designer Portal
          </span>
          <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface mb-2">
            Design Studio
          </h1>
          <p className="text-on-surface-variant text-sm">
            Your creative work queue — upload assets for each post below.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          {[
            { label: "Needs Upload", value: needsUpload, color: "text-primary", icon: "upload" },
            { label: "Revisions", value: revisions, color: "text-error", icon: "edit_note" },
            { label: "Uploaded", value: uploaded, color: "text-tertiary", icon: "check_circle" },
            { label: "Total Open", value: posts.length, color: "text-on-surface", icon: "dashboard" },
          ].map((s) => (
            <div key={s.label} className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Icon name={s.icon} className={`text-lg ${s.color}`} />
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">{s.label}</span>
              </div>
              <span className={`text-3xl font-headline font-bold ${s.color}`}>
                {loading ? "—" : s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Platform filter */}
        {!loading && posts.length > 0 && (
          <div className="flex gap-2 mb-8 flex-wrap">
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all
                  ${filter === p
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Post grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-surface-container-lowest rounded-2xl p-6 animate-pulse h-64" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Icon name="check_circle" className="text-6xl text-primary/20 mb-6" />
            <h3 className="text-xl font-headline font-bold text-on-surface mb-2">
              {posts.length === 0 ? "No work in queue" : "Nothing in this filter"}
            </h3>
            <p className="text-on-surface-variant text-sm max-w-sm">
              {posts.length === 0
                ? "Posts will appear here once the admin generates a content calendar."
                : "Switch the filter to see other posts."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post: any) => {
              const isRevision = post.status === "REVISION_REQUIRED";
              const isUploaded = post.status === "CREATIVE_UPLOADED";
              const currentAsset = post.assets?.find((a: any) => a.isCurrent) || post.assets?.[0];

              return (
                <div
                  key={post.id}
                  className={`bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border transition-all hover:-translate-y-0.5 hover:shadow-md
                    ${isRevision ? "border-error/20" : "border-outline-variant/10"}`}
                >
                  {/* Asset preview */}
                  <div className="aspect-video bg-surface-container relative">
                    {currentAsset?.fileUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={post.topic}
                        src={currentAsset.fileUrl}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20">
                        <Icon name="image" className="text-5xl" />
                      </div>
                    )}
                    {/* Status badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest
                        ${isRevision ? "bg-error/90 text-white" :
                          isUploaded ? "bg-emerald-600/90 text-white" :
                          "bg-primary/90 text-white"}`}>
                        {post.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    {/* Platform badge */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                      <Icon name={PLATFORM_ICON[post.platform] || "share"} className="text-primary text-sm" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
                          {post.clientName}
                        </p>
                        <h3 className="font-headline font-bold text-sm text-on-surface line-clamp-1 mt-0.5">
                          {post.topic}
                        </h3>
                      </div>
                      <span className="text-[10px] text-stone-400 shrink-0">
                        {post.scheduledDate
                          ? new Date(post.scheduledDate).toLocaleDateString("en", { month: "short", day: "numeric" })
                          : "—"}
                      </span>
                    </div>

                    {/* Creative direction */}
                    {post.creativeNote && (
                      <div className="mb-4 p-3 bg-surface-container rounded-lg">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1">Creative Brief</p>
                        <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3 italic">{post.creativeNote}</p>
                      </div>
                    )}

                    {/* Revision notes */}
                    {isRevision && post.approvals?.length > 0 && (
                      <div className="mb-4 p-3 bg-error/5 rounded-lg border border-error/20">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-error mb-1">Revision Requested</p>
                        <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                          {post.approvals[post.approvals.length - 1]?.comment || "See full post for details."}
                        </p>
                      </div>
                    )}

                    {/* Format pill */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded uppercase tracking-wide">
                        {post.format}
                      </span>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-wide">{post.objective}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => triggerUpload(post.id)}
                        disabled={uploading === post.id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                      >
                        {uploading === post.id ? (
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <><Icon name="upload" className="text-sm" /> {currentAsset ? "Replace" : "Upload"}</>
                        )}
                      </button>
                      <Link
                        href={`/post-review?postId=${post.id}`}
                        className="px-3 py-2.5 border border-outline-variant/30 rounded-lg text-on-surface hover:bg-surface-container-low transition-colors flex items-center justify-center"
                      >
                        <Icon name="open_in_new" className="text-sm" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
