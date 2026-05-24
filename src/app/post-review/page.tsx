"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/components/ui/Toast";

const PLATFORM_ICON: Record<string, string> = {
  instagram: "camera",
  linkedin: "work",
  tiktok: "music_video",
  x: "tag",
};

type EditableField = "hook" | "caption" | "cta" | "hashtags" | "creativeNote";

const FIELD_LABELS: Record<EditableField, string> = {
  hook: "Hook",
  caption: "Caption",
  cta: "Call to Action",
  hashtags: "Hashtags",
  creativeNote: "Creative Direction",
};

const FIELD_PLACEHOLDERS: Record<EditableField, string> = {
  hook: "Opening hook — makes someone stop scrolling",
  caption: "Full caption body",
  cta: "Call-to-action line",
  hashtags: "tag1, tag2, tag3 (comma separated)",
  creativeNote: "Visual direction for the designer",
};

function PostReviewInner() {
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");
  const api = useApi();
  const toast = useToast();

  const [post, setPost]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // Edit state
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [draftValue, setDraftValue]     = useState("");
  const [saving, setSaving]             = useState(false);

  // AI improve state
  const [aiField, setAiField]               = useState<EditableField | null>(null);
  const [aiInstruction, setAiInstruction]   = useState("");
  const [aiLoading, setAiLoading]           = useState(false);
  const [aiSuggestion, setAiSuggestion]     = useState<string | null>(null);

  // Upload state
  const [uploading, setUploading]       = useState(false);
  const [isDragging, setIsDragging]     = useState(false);
  const [uploadNotes, setUploadNotes]   = useState("");
  const [showNotes, setShowNotes]       = useState(false);
  const [pendingFile, setPendingFile]   = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Approve state
  const [approving, setApproving]     = useState(false);
  const [comment, setComment]         = useState("");
  const [showComment, setShowComment] = useState(false);

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

  // ── edit helpers ─────────────────────────────────────────────────────────

  function getFieldValue(field: EditableField): string {
    if (field === "hashtags") return (post?.hashtags || []).join(", ");
    return post?.[field] || "";
  }

  function startEdit(field: EditableField) {
    setAiField(null); setAiSuggestion(null); setAiInstruction("");
    setEditingField(field);
    setDraftValue(getFieldValue(field));
  }

  function startAI(field: EditableField) {
    if (aiField === field) { setAiField(null); setAiSuggestion(null); return; }
    setEditingField(null);
    setAiField(field); setAiSuggestion(null); setAiInstruction("");
  }

  function cancelAll() {
    setEditingField(null); setAiField(null); setAiSuggestion(null); setAiInstruction("");
  }

  async function saveField() {
    if (!editingField || !post) return;
    setSaving(true);
    try {
      const data: any = {};
      if (editingField === "hashtags") {
        data.hashtags = draftValue.split(",").map((h) => h.trim().replace(/^#/, "")).filter(Boolean);
      } else {
        data[editingField] = draftValue;
      }
      await api.posts.update(post.id, data);
      setPost((prev: any) => ({ ...prev, ...data }));
      setEditingField(null);
      toast.success("Saved");
    } catch (e: any) {
      toast.error("Save failed", e.message);
    } finally {
      setSaving(false);
    }
  }

  async function generateAI() {
    if (!aiField || !post) return;
    setAiLoading(true); setAiSuggestion(null);
    try {
      const result = await api.posts.improveField(post.id, aiField, aiInstruction);
      const s = result.suggestion;
      setAiSuggestion(Array.isArray(s) ? s.join(", ") : s as string);
    } catch (e: any) {
      toast.error("AI improve failed", e.message);
    } finally {
      setAiLoading(false);
    }
  }

  function acceptSuggestion() {
    if (!aiSuggestion || !aiField) return;
    setDraftValue(aiSuggestion);
    setEditingField(aiField);
    setAiField(null); setAiSuggestion(null); setAiInstruction("");
  }

  // ── upload helpers ────────────────────────────────────────────────────────

  function pickFile(file: File) {
    setPendingFile(file);
    setShowNotes(true);
  }

  async function doUpload() {
    if (!pendingFile || !post) return;
    setUploading(true);
    try {
      await api.assets.upload(post.id, pendingFile, uploadNotes);
      const refreshed = await api.posts.get(post.id);
      setPost(refreshed);
      setPendingFile(null); setUploadNotes(""); setShowNotes(false);
      toast.success("Creative uploaded — post ready for review");
    } catch (e: any) {
      toast.error("Upload failed", e.message);
    } finally {
      setUploading(false);
    }
  }

  function cancelUpload() {
    setPendingFile(null); setUploadNotes(""); setShowNotes(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ── approve ───────────────────────────────────────────────────────────────

  async function handleApprove(action: "APPROVED" | "CHANGES_REQUESTED") {
    if (!post) return;
    setApproving(true);
    try {
      await api.posts.approve(post.id, action, comment);
      const refreshed = await api.posts.get(post.id);
      setPost(refreshed);
      setComment(""); setShowComment(false);
      toast.success(action === "APPROVED" ? "Post approved" : "Changes requested");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setApproving(false);
    }
  }

  // ── render helpers ────────────────────────────────────────────────────────

  function renderFieldHeader(field: EditableField) {
    return (
      <div className="flex items-center justify-between mb-2">
        <h3 className="uppercase tracking-[0.2em] text-[10px] font-bold text-on-surface-variant/60">
          {FIELD_LABELS[field]}
        </h3>
        {editingField !== field && (
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => startAI(field)}
              className={`px-2 py-1 rounded-md flex items-center gap-1 text-[10px] font-bold transition-colors ${
                aiField === field ? "bg-primary/10 text-primary" : "text-on-surface-variant/40 hover:text-primary hover:bg-primary/5"
              }`}
            >
              <Icon name="auto_awesome" className="text-xs" /> AI
            </button>
            <button
              onClick={() => startEdit(field)}
              className="p-1 rounded-md text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <Icon name="edit" className="text-xs" />
            </button>
          </div>
        )}
      </div>
    );
  }

  function renderEditArea(rows = 3) {
    return (
      <div className="space-y-2 mt-1">
        <textarea
          value={draftValue}
          onChange={(e) => setDraftValue(e.target.value)}
          placeholder={editingField ? FIELD_PLACEHOLDERS[editingField] : ""}
          className="w-full bg-surface border border-primary/20 rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 outline-none font-mono leading-relaxed"
          rows={rows}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button onClick={cancelAll} className="px-4 py-2 text-xs text-on-surface-variant border border-outline-variant/30 rounded-lg hover:bg-surface-container transition-colors">
            Cancel
          </button>
          <button
            onClick={saveField}
            disabled={saving}
            className="px-4 py-2 text-xs text-white bg-primary rounded-lg font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            {saving && <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />}
            Save
          </button>
        </div>
      </div>
    );
  }

  function renderAIPanel(field: EditableField) {
    if (aiField !== field) return null;
    return (
      <div className="mt-2 p-4 bg-surface rounded-xl border border-primary/10 space-y-3">
        <div className="flex gap-2">
          <input
            value={aiInstruction}
            onChange={(e) => setAiInstruction(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !aiLoading && generateAI()}
            placeholder={`What should change? e.g. "more playful", "shorter", "try a question"`}
            className="flex-1 bg-white border border-outline-variant/20 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
          <button
            onClick={generateAI}
            disabled={aiLoading}
            className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
          >
            {aiLoading
              ? <><span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" /> Generating…</>
              : <><Icon name="auto_awesome" className="text-xs" /> Generate</>}
          </button>
        </div>
        {aiSuggestion && (
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest font-bold text-primary">AI Suggestion</p>
            <div className="p-3 bg-primary/5 rounded-lg border-l-2 border-primary/30">
              <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{aiSuggestion}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={cancelAll} className="px-3 py-1.5 text-xs text-on-surface-variant border border-outline-variant/30 rounded-lg hover:bg-surface-container">
                Discard
              </button>
              <button onClick={acceptSuggestion} className="px-3 py-1.5 text-xs text-white bg-primary rounded-lg font-bold hover:opacity-90">
                Accept & Edit
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── derived ───────────────────────────────────────────────────────────────

  const currentAsset = post?.assets?.find((a: any) => a.isCurrent) || post?.assets?.[0];
  const approvals: any[] = post?.approvals || [];
  const isApproved = ["APPROVED", "SCHEDULED", "PUBLISHED"].includes(post?.status);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!postId || error || !post) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface gap-4">
      <Icon name="error_outline" className="text-5xl text-primary/30" />
      <p className="text-on-surface-variant">{error || "Post not found."}</p>
      <Link href="/dashboard" className="text-primary hover:underline text-sm">← Back to Dashboard</Link>
    </div>
  );

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) pickFile(f); e.target.value = ""; }}
      />

      {/* Nav */}
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
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
            isApproved ? "bg-emerald-100 text-emerald-700" :
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

        {/* ── Creative panel ── */}
        <section className="flex-1 bg-surface-container-low flex flex-col">

          {/* Preview area */}
          <div
            className={`flex-1 p-6 md:p-12 flex items-center justify-center relative overflow-hidden min-h-[400px] transition-colors ${
              isDragging ? "bg-primary/5" : ""
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) pickFile(f); }}
          >
            {isDragging && (
              <div className="absolute inset-0 border-2 border-dashed border-primary/40 rounded-2xl m-4 flex items-center justify-center z-10 bg-primary/5 pointer-events-none">
                <div className="text-center">
                  <Icon name="cloud_upload" className="text-4xl text-primary/50 mb-2" />
                  <p className="text-sm font-bold text-primary/60 uppercase tracking-widest">Drop to upload</p>
                </div>
              </div>
            )}

            <div className="relative w-full max-w-4xl aspect-[4/5] md:aspect-video bg-surface-container-lowest shadow-2xl shadow-emerald-900/10 rounded-xl overflow-hidden">
              {currentAsset ? (
                currentAsset.fileType === "video" ? (
                  <video src={currentAsset.fileUrl} className="w-full h-full object-cover" controls />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="Asset preview" className="w-full h-full object-cover" src={currentAsset.fileUrl} />
                )
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant/40 gap-4 cursor-pointer hover:bg-primary/3 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center">
                    <Icon name="cloud_upload" className="text-4xl text-primary/30" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-on-surface-variant/50 uppercase tracking-widest">Upload Creative</p>
                    <p className="text-xs text-on-surface-variant/30 mt-1">Click or drag & drop · Image or Video</p>
                  </div>
                </div>
              )}
              <div className="absolute top-4 right-4 bg-emerald-900/90 text-white px-3 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase backdrop-blur">
                {post.platform} / {post.format}
              </div>
            </div>

            {post.assets?.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-on-surface-variant/40 flex items-center gap-1.5">
                <Icon name="layers" className="text-sm" />
                <span className="text-[11px] font-medium tracking-wide uppercase">{post.assets.length} versions</span>
              </div>
            )}
          </div>

          {/* Upload bar */}
          {pendingFile ? (
            <div className="border-t border-outline-variant/10 bg-surface-container-lowest p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon name={pendingFile.type.startsWith("video") ? "videocam" : "image"} className="text-primary text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">{pendingFile.name}</p>
                  <p className="text-xs text-on-surface-variant">{(pendingFile.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <button onClick={cancelUpload} className="p-1.5 rounded-lg text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container transition-colors">
                  <Icon name="close" className="text-sm" />
                </button>
              </div>
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="text-xs text-on-surface-variant/60 hover:text-primary transition-colors flex items-center gap-1"
              >
                <Icon name={showNotes ? "expand_less" : "expand_more"} className="text-sm" />
                {showNotes ? "Hide notes" : "Add notes for designer"}
              </button>
              {showNotes && (
                <textarea
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="Version notes, changes made, special instructions…"
                  className="w-full bg-surface border border-outline-variant/20 rounded-lg p-3 text-sm resize-none h-20 focus:ring-2 focus:ring-primary/20 outline-none"
                />
              )}
              <div className="flex gap-2">
                <button onClick={cancelUpload} className="flex-1 py-2.5 border border-outline-variant/30 text-on-surface-variant rounded-lg text-sm font-medium hover:bg-surface-container transition-colors">
                  Cancel
                </button>
                <button
                  onClick={doUpload}
                  disabled={uploading}
                  className="flex-[2] py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-lg text-sm font-bold hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {uploading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading…</>
                    : <><Icon name="cloud_upload" className="text-sm" /> Upload Creative</>}
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-outline-variant/10 bg-surface-container-lowest px-6 py-3 flex items-center justify-between">
              <span className="text-xs text-on-surface-variant/40">
                {currentAsset ? `v${post.assets?.length || 1} uploaded` : "No creative yet"}
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-4 py-2 border border-outline-variant/30 text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container transition-colors"
              >
                <Icon name="cloud_upload" className="text-sm" />
                {currentAsset ? "Upload New Version" : "Upload Creative"}
              </button>
            </div>
          )}
        </section>

        {/* ── Side panel ── */}
        <aside className="w-full lg:w-[500px] bg-surface-container-lowest flex flex-col lg:h-[calc(100vh-64px)] shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
          <div className="flex-1 overflow-y-auto p-8 space-y-7">

            {/* Meta */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                  post.status === "AWAITING_APPROVAL" ? "bg-tertiary/10 text-tertiary" :
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

            {/* Client feedback banner */}
            {post.status === "REVISION_REQUIRED" && approvals[0]?.comment && (
              <div className="p-4 bg-error/5 border border-error/20 rounded-xl flex gap-3">
                <Icon name="edit_note" className="text-error mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-error mb-1">Client feedback</p>
                  <p className="text-sm text-on-surface leading-relaxed">{approvals[0].comment}</p>
                </div>
              </div>
            )}

            {/* Hook */}
            <div>
              {renderFieldHeader("hook")}
              {editingField === "hook" ? renderEditArea(2) : (
                <div className="p-4 bg-primary/5 rounded-xl">
                  <p className="text-sm font-headline font-semibold text-on-surface">
                    {post.hook ? `"${post.hook}"` : <span className="text-on-surface-variant/40 italic">No hook yet</span>}
                  </p>
                </div>
              )}
              {renderAIPanel("hook")}
            </div>

            {/* Caption */}
            <div>
              {renderFieldHeader("caption")}
              {editingField === "caption" ? renderEditArea(6) : (
                <div className="p-5 bg-surface rounded-xl border-l-4 border-primary/20">
                  {post.caption
                    ? <p className="text-on-surface font-headline text-sm leading-relaxed whitespace-pre-wrap">{post.caption}</p>
                    : <p className="text-on-surface-variant/40 italic text-sm">No caption yet — generate from the project page or use AI above</p>}
                </div>
              )}
              {renderAIPanel("caption")}
            </div>

            {/* Hashtags */}
            <div>
              {renderFieldHeader("hashtags")}
              {editingField === "hashtags" ? renderEditArea(2) : (
                <div className="flex flex-wrap gap-1.5">
                  {post.hashtags?.length > 0
                    ? post.hashtags.map((tag: string) => (
                        <span key={tag} className="text-primary text-xs font-medium bg-primary/5 px-2 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))
                    : <span className="text-on-surface-variant/40 italic text-xs">No hashtags yet</span>}
                </div>
              )}
              {renderAIPanel("hashtags")}
            </div>

            {/* CTA */}
            <div>
              {renderFieldHeader("cta")}
              {editingField === "cta" ? renderEditArea(2) : (
                <div className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-outline-variant/10">
                  <Icon name="arrow_forward" className="text-primary shrink-0" />
                  <p className="text-sm text-on-surface">
                    {post.cta || <span className="text-on-surface-variant/40 italic">No CTA yet</span>}
                  </p>
                </div>
              )}
              {renderAIPanel("cta")}
            </div>

            {/* Creative direction */}
            {(post.creativeNote || editingField === "creativeNote" || aiField === "creativeNote") && (
              <div>
                {renderFieldHeader("creativeNote")}
                {editingField === "creativeNote" ? renderEditArea(3) : (
                  <div className="flex gap-3">
                    <Icon name="palette" className="text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-on-surface-variant leading-relaxed">{post.creativeNote}</p>
                  </div>
                )}
                {renderAIPanel("creativeNote")}
              </div>
            )}

            {/* Asset history */}
            {post.assets?.length > 0 && (
              <div className="space-y-3">
                <h3 className="uppercase tracking-[0.2em] text-[10px] font-bold text-on-surface-variant/60">
                  Creative Versions
                </h3>
                <div className="space-y-2">
                  {post.assets.map((a: any) => (
                    <div key={a.id} className={`flex items-center gap-3 p-3 rounded-lg border ${
                      a.isCurrent ? "border-emerald-200 bg-emerald-50" : "border-outline-variant/10 bg-surface"
                    }`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        a.isCurrent ? "bg-emerald-100" : "bg-surface-container"
                      }`}>
                        <Icon name={a.fileType === "video" ? "videocam" : "image"} className={`text-sm ${a.isCurrent ? "text-emerald-600" : "text-on-surface-variant"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-on-surface truncate">{a.fileName || `v${a.version}`}</p>
                        <p className="text-[10px] text-on-surface-variant">
                          v{a.version} · {a.uploadedBy?.firstName || "Designer"}
                          {a.notes && ` · ${a.notes}`}
                        </p>
                      </div>
                      {a.isCurrent && (
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Current</span>
                      )}
                      <a href={a.fileUrl} target="_blank" rel="noreferrer" className="p-1 text-on-surface-variant/40 hover:text-primary transition-colors">
                        <Icon name="open_in_new" className="text-sm" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approval history */}
            {approvals.length > 0 && (
              <div className="space-y-4">
                <h3 className="uppercase tracking-[0.2em] text-[10px] font-bold text-on-surface-variant/60">
                  Approval History
                </h3>
                <div className="space-y-4">
                  {approvals.map((a: any) => (
                    <div key={a.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                        <Icon
                          name={a.action === "APPROVED" ? "check_circle" : "edit_note"}
                          className={`text-sm ${a.action === "APPROVED" ? "text-emerald-600" : "text-tertiary"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-on-surface">
                            {a.user?.firstName || "User"} — {a.action.replace(/_/g, " ")}
                          </span>
                          <span className="text-[10px] text-on-surface-variant/50">
                            {new Date(a.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                        {a.comment && <p className="text-sm text-on-surface-variant leading-relaxed">{a.comment}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comment textarea */}
            {showComment && (
              <div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe the changes needed…"
                  className="w-full bg-surface-container-low border-0 rounded-lg p-4 text-sm resize-none h-24 focus:ring-2 focus:ring-primary/30 outline-none"
                />
              </div>
            )}
          </div>

          {/* Action bar */}
          {!isApproved ? (
            <div className="p-8 bg-surface-container-lowest shadow-[0_-10px_30px_rgba(0,0,0,0.03)] flex gap-4">
              <button
                onClick={() => { if (!showComment) { setShowComment(true); return; } handleApprove("CHANGES_REQUESTED"); }}
                disabled={approving}
                className="flex-1 py-4 px-6 border border-outline-variant/30 text-primary font-headline font-bold text-sm rounded-md hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Icon name="edit_note" className="text-[18px]" />
                {showComment ? "Submit Feedback" : "Request Changes"}
              </button>
              <button
                onClick={() => handleApprove("APPROVED")}
                disabled={approving}
                className="flex-[1.5] py-4 px-6 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold text-sm rounded-md shadow-lg shadow-emerald-900/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {approving
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Icon name="check_circle" className="text-[18px]" />}
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
