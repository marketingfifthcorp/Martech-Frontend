"use client";

import { useEffect, useRef, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useApi } from "@/hooks/useApi";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { useToast } from "@/components/ui/Toast";

const TODAY = new Date();

const DESIGN_STATUSES = ["DRAFT", "IN_DESIGN", "CREATIVE_UPLOADED", "AWAITING_APPROVAL", "REVISION_REQUIRED"];

const STATUS_FILTER: Record<string, string[]> = {
  all: DESIGN_STATUSES,
  pending: ["DRAFT", "IN_DESIGN"],
  uploaded: ["CREATIVE_UPLOADED"],
  review: ["AWAITING_APPROVAL"],
  revision: ["REVISION_REQUIRED"],
};

function pillCls(status: string) {
  if (status === "REVISION_REQUIRED") return "plr";
  if (status === "AWAITING_APPROVAL") return "plb";
  if (status === "CREATIVE_UPLOADED") return "plgg";
  return "pla";
}

function isOverdue(p: any) {
  return p.scheduledDate && new Date(p.scheduledDate) < TODAY && !["AWAITING_APPROVAL"].includes(p.status);
}

function initials(name: string) {
  return name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() ?? "?";
}

export default function DesignerPage() {
  const api = useApi();
  const toast = useToast();
  const { checking } = useRoleGuard(["DESIGNER", "ADMIN"]);

  const [clientGroups, setClientGroups] = useState<{ client: any; posts: any[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [uploading, setUploading] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<string | null>(null);

  useEffect(() => {
    if (checking) return;
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking]);

  async function load() {
    setLoading(true);
    try {
      const clients = await api.clients.list();
      const results = await Promise.all(
        clients.map(async (c: any) => {
          const posts = await api.posts.listByClient(c.id).catch(() => []);
          const designPosts = (posts as any[])
            .filter((p: any) => DESIGN_STATUSES.includes(p.status))
            .map((p: any) => ({ ...p, _clientId: c.id, clientName: c.name }))
            .sort((a: any, b: any) =>
              new Date(a.scheduledDate ?? 0).getTime() - new Date(b.scheduledDate ?? 0).getTime()
            );
          return { client: c, posts: designPosts };
        })
      );
      setClientGroups(results.filter((g) => g.posts.length > 0));
    } catch (e: any) {
      toast.error("Failed to load", e.message ?? "Could not load design queue.");
    } finally {
      setLoading(false);
    }
  }

  function patchPost(postId: string, patch: any) {
    setClientGroups((prev) =>
      prev.map((g) => ({
        ...g,
        posts: g.posts.map((p) => (p.id === postId ? { ...p, ...patch } : p)),
      }))
    );
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const postId = uploadTargetRef.current;
    if (!file || !postId) return;
    await doUpload(postId, file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDrop(e: React.DragEvent, postId: string) {
    e.preventDefault();
    setDragOverId(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await doUpload(postId, file);
  }

  async function doUpload(postId: string, file: File) {
    setUploading(postId);
    uploadTargetRef.current = null;
    try {
      await api.assets.upload(postId, file, "");
      const updated = await api.posts.get(postId);
      patchPost(postId, {
        status: updated.status,
        assets: updated.assets,
      });
      toast.success("File uploaded", "Review it below, then click 'Submit for review'.");
    } catch (e: any) {
      toast.error("Upload failed", e.message ?? "Could not upload the file. Try again.");
    } finally {
      setUploading(null);
    }
  }

  function triggerUpload(postId: string) {
    uploadTargetRef.current = postId;
    fileInputRef.current?.click();
  }

  async function submitForReview(postId: string) {
    setSubmitting(postId);
    try {
      await api.posts.markCreativeUploaded(postId);
      patchPost(postId, { status: "AWAITING_APPROVAL" });
      toast.success("Submitted", "Creative sent to admin for review.");
    } catch (e: any) {
      toast.error("Submit failed", e.message ?? "Could not submit. Try again.");
    } finally {
      setSubmitting(null);
    }
  }

  if (checking) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "2px solid rgba(52,217,123,.2)", borderTopColor: "#34d97b", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    </div>
  );

  const allPosts = clientGroups.flatMap((g) => g.posts);
  const needsUpload = allPosts.filter((p) => ["DRAFT", "IN_DESIGN"].includes(p.status)).length;
  const uploadedCount = allPosts.filter((p) => p.status === "CREATIVE_UPLOADED").length;
  const revisions = allPosts.filter((p) => p.status === "REVISION_REQUIRED").length;
  const inReview = allPosts.filter((p) => p.status === "AWAITING_APPROVAL").length;

  const activeStatuses = STATUS_FILTER[filter] ?? DESIGN_STATUSES;
  const filteredGroups = clientGroups
    .map((g) => ({ ...g, posts: g.posts.filter((p) => activeStatuses.includes(p.status)) }))
    .filter((g) => g.posts.length > 0);

  return (
    <DashboardShell title="Design workspace">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        {/* Filter tabs */}
        <div style={{ padding: "8px 22px", borderBottom: "1px solid var(--tb-b)", display: "flex", gap: 6, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
          <span className={`flt${filter === "all" ? " act" : ""}`} onClick={() => setFilter("all")}>All ({allPosts.length})</span>
          <span className={`flt${filter === "pending" ? " act" : ""}`} onClick={() => setFilter("pending")}>Need upload ({needsUpload})</span>
          <span className={`flt${filter === "uploaded" ? " act" : ""}`} onClick={() => setFilter("uploaded")}>Uploaded ({uploadedCount})</span>
          <span className={`flt${filter === "review" ? " act" : ""}`} onClick={() => setFilter("review")}>In review ({inReview})</span>
          <span className={`flt${filter === "revision" ? " act" : ""}`} onClick={() => setFilter("revision")}>Revision ({revisions})</span>
        </div>

        {/* Stats bar */}
        <div className="sbar" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
          <div className="sc2"><div className="sv" style={{ color: "var(--amber)" }}>{loading ? "—" : needsUpload}</div><div className="sl2">Need upload</div></div>
          <div className="sc2"><div className="sv" style={{ color: "var(--red)" }}>{loading ? "—" : revisions}</div><div className="sl2">Revisions</div></div>
          <div className="sc2"><div className="sv" style={{ color: "var(--blue)" }}>{loading ? "—" : inReview}</div><div className="sl2">In review</div></div>
          <div className="sc2"><div className="sv">{loading ? "—" : allPosts.length}</div><div className="sl2">Total open</div></div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
              <div style={{ width: 28, height: 28, border: "2px solid rgba(52,217,123,.2)", borderTopColor: "#34d97b", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            </div>
          ) : filteredGroups.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 22px", textAlign: "center" }}>
              <i className="ti ti-circle-check" style={{ fontSize: 40, color: "var(--green)", display: "block", marginBottom: 12 }} />
              <div style={{ fontSize: 14, color: "var(--t2)", marginBottom: 4 }}>
                {allPosts.length === 0 ? "No work in queue" : "Nothing in this filter"}
              </div>
              <div style={{ fontSize: 11, color: "var(--t4)", fontWeight: 300 }}>
                {allPosts.length === 0
                  ? "Posts appear here once the admin generates a content calendar."
                  : "Adjust the filters above."}
              </div>
            </div>
          ) : (
            <div className="sa">
              {filteredGroups.map(({ client, posts }) => (
                <div key={client.id} style={{ marginBottom: 32 }}>

                  {/* Client section header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid var(--card-b)" }}>
                    <div style={{ width: 30, height: 30, borderRadius: 7, background: "var(--gb)", border: "1px solid var(--gbb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--green)", fontWeight: 500, flexShrink: 0 }}>
                      {initials(client.name)}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--t1)" }}>{client.name}</div>
                    <span className="pl pla" style={{ fontSize: 9 }}>{posts.length} post{posts.length !== 1 ? "s" : ""}</span>
                  </div>

                  {/* Post cards */}
                  {posts.map((p) => {
                    const isRevision = p.status === "REVISION_REQUIRED";
                    const isUploaded = p.status === "CREATIVE_UPLOADED";
                    const isInReview = p.status === "AWAITING_APPROVAL";
                    const overdue = isOverdue(p);
                    const currentAsset = p.assets?.find((a: any) => a.isCurrent) ?? p.assets?.[0];
                    const latestApproval = p.approvals?.[0];
                    const revisionNote = isRevision && latestApproval?.comment ? latestApproval.comment : null;
                    const isUploadingThis = uploading === p.id;
                    const isSubmittingThis = submitting === p.id;
                    const isDragOver = dragOverId === p.id;

                    return (
                      <div key={p.id} className="brc" data-status={isRevision ? "revision" : undefined} style={{ marginBottom: 12 }}>
                        {/* Card header */}
                        <div className="brch">
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--in)", border: "1px solid var(--in-b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--t3)", flexShrink: 0, textTransform: "uppercase", letterSpacing: 1 }}>
                              {p.platform?.slice(0, 2) ?? "??"}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 400, color: "var(--t1)" }}>{p.topic ?? p.hook ?? "Untitled post"}</div>
                              <div style={{ fontSize: 10, color: "var(--t4)", marginTop: 1 }}>
                                {[p.format, p.platform ? p.platform.charAt(0).toUpperCase() + p.platform.slice(1) : null].filter(Boolean).join(" · ")}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span className={`pl ${pillCls(p.status)}`} style={{ fontSize: 9 }}>{p.status?.replace(/_/g, " ")}</span>
                            {overdue
                              ? <div style={{ fontSize: 10, color: "var(--red)", fontWeight: 300 }}><i className="ti ti-alert-circle" style={{ fontSize: 9 }} /> Overdue</div>
                              : p.scheduledDate && <div style={{ fontSize: 10, color: "var(--t4)", fontWeight: 300 }}>Due {new Date(p.scheduledDate).toLocaleDateString("en", { month: "short", day: "numeric" })}</div>
                            }
                          </div>
                        </div>

                        {/* Card body */}
                        <div className="brd">
                          <div className="bri">
                            <div className="bril">Format</div><div className="briv">{p.format ?? "—"}</div>
                            <div className="bril">Platform</div><div className="briv">{p.platform ? p.platform.charAt(0).toUpperCase() + p.platform.slice(1) : "—"}</div>
                            <div className="bril">Publish date</div>
                            <div className="briv">{p.scheduledDate ? new Date(p.scheduledDate).toLocaleDateString("en", { month: "short", day: "numeric" }) : "—"}</div>
                            <div className="bril">Status</div>
                            <div className="briv" style={{ color: isRevision || overdue ? "var(--red)" : "var(--t2)" }}>
                              {isRevision ? "Revision needed" : p.status?.replace(/_/g, " ")}
                            </div>
                          </div>

                          {p.creativeNote && (
                            <div className="brb">
                              <div className="bril" style={{ marginBottom: 4 }}>Creative brief</div>
                              <div style={{ background: "var(--in)", border: "1px solid var(--in-b)", borderRadius: 8, padding: "10px 12px", fontSize: 10, color: "var(--t3)", lineHeight: 1.7, fontWeight: 300 }}>
                                {p.creativeNote}
                              </div>
                            </div>
                          )}

                          {p.caption && (
                            <div className="brb">
                              <div className="bril" style={{ marginBottom: 4 }}>Caption</div>
                              <div style={{ background: "var(--in)", border: "1px solid var(--in-b)", borderRadius: 8, padding: "10px 12px", fontSize: 10, color: "var(--t3)", lineHeight: 1.7, fontWeight: 300 }}>
                                {p.caption}
                              </div>
                            </div>
                          )}

                          {revisionNote && (
                            <div className="brb">
                              <div className="bril" style={{ marginBottom: 4, color: "var(--red)" }}>Revision notes</div>
                              <div style={{ background: "rgba(255,107,107,.06)", border: "1px solid rgba(255,107,107,.2)", borderRadius: 8, padding: "10px 12px", fontSize: 10, color: "var(--t2)", lineHeight: 1.7, fontWeight: 300 }}>
                                {revisionNote}
                              </div>
                            </div>
                          )}

                          {isInReview && (
                            <div style={{ background: "rgba(107,159,255,.06)", border: "1px solid rgba(107,159,255,.2)", borderRadius: 8, padding: "9px 12px", fontSize: 10, color: "var(--blue)", fontWeight: 300, marginBottom: 12 }}>
                              <i className="ti ti-clock" style={{ fontSize: 9 }} /> Submitted · Under review by account manager
                            </div>
                          )}

                          {/* Upload area */}
                          <div className="bru">
                            {/* Current file preview */}
                            {currentAsset?.fileUrl && (
                              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, padding: "8px 10px", background: "var(--in)", border: "1px solid var(--in-b)", borderRadius: 8 }}>
                                {currentAsset.fileType === "video" ? (
                                  <i className="ti ti-video" style={{ fontSize: 22, color: "var(--t4)", flexShrink: 0 }} />
                                ) : (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={currentAsset.fileUrl} alt="" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6, border: "1px solid var(--card-b)", flexShrink: 0 }} />
                                )}
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ fontSize: 11, color: "var(--t2)", fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentAsset.fileName}</div>
                                  <div style={{ fontSize: 9, color: "var(--t4)", marginTop: 2 }}>v{currentAsset.version} · {currentAsset.fileType}</div>
                                </div>
                              </div>
                            )}

                            {/* Drop zone — always show if no file, or when revision/in-review allows replacement */}
                            {(!currentAsset || isRevision) && (
                              <div
                                className="brud"
                                style={isDragOver ? { borderColor: "var(--green)", background: "rgba(52,217,123,.06)" } : undefined}
                                onDragOver={(e) => { e.preventDefault(); setDragOverId(p.id); }}
                                onDragLeave={() => setDragOverId(null)}
                                onDrop={(e) => handleDrop(e, p.id)}
                              >
                                {isUploadingThis ? (
                                  <div style={{ width: 24, height: 24, border: "2px solid rgba(52,217,123,.2)", borderTopColor: "#34d97b", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 8px" }} />
                                ) : (
                                  <i className="ti ti-cloud-upload" style={{ fontSize: 22, color: isDragOver ? "var(--green)" : "var(--t4)", marginBottom: 6, display: "block" }} />
                                )}
                                <div style={{ fontSize: 11, color: "var(--t3)", fontWeight: 300 }}>
                                  {isUploadingThis ? "Uploading…" : (
                                    <>Drag &amp; drop or <span style={{ color: "var(--green)", cursor: "pointer" }} onClick={() => !isUploadingThis && triggerUpload(p.id)}>browse</span></>
                                  )}
                                </div>
                                <div style={{ fontSize: 9, color: "var(--t4)", marginTop: 3 }}>MP4, MOV, PNG, JPG · max 200MB</div>
                              </div>
                            )}

                            {/* Action buttons */}
                            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                              <button
                                className="gb gbg"
                                style={{ fontSize: 10 }}
                                onClick={() => triggerUpload(p.id)}
                                disabled={isUploadingThis || isSubmittingThis}
                              >
                                <i className="ti ti-upload" style={{ fontSize: 10 }} />
                                {isUploadingThis ? "Uploading…" : currentAsset ? "Replace file" : "Upload file"}
                              </button>

                              {/* Submit for review — only when freshly uploaded (CREATIVE_UPLOADED) */}
                              {isUploaded && (
                                <button
                                  className="gb gbp"
                                  style={{ fontSize: 10, flex: 1, justifyContent: "center" }}
                                  disabled={isSubmittingThis}
                                  onClick={() => submitForReview(p.id)}
                                >
                                  {isSubmittingThis
                                    ? <i className="ti ti-loader-2" style={{ animation: "spin 1s linear infinite", fontSize: 10 }} />
                                    : <><i className="ti ti-send" style={{ fontSize: 10 }} /> Submit for review</>
                                  }
                                </button>
                              )}

                              {/* Re-submit — for revision requests */}
                              {isRevision && (
                                <button
                                  className="gb gbp"
                                  style={{ fontSize: 10, flex: 1, justifyContent: "center" }}
                                  disabled={isSubmittingThis}
                                  onClick={() => submitForReview(p.id)}
                                >
                                  {isSubmittingThis
                                    ? <i className="ti ti-loader-2" style={{ animation: "spin 1s linear infinite", fontSize: 10 }} />
                                    : <><i className="ti ti-send" style={{ fontSize: 10 }} /> Re-submit</>
                                  }
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
