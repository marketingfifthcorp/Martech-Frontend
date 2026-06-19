"use client";

import { useEffect, useRef, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useApi } from "@/hooks/useApi";
import { useRoleGuard } from "@/hooks/useRoleGuard";

const TODAY = new Date();

const DESIGN_STATUSES = ["DRAFT", "IN_DESIGN", "CREATIVE_UPLOADED", "AWAITING_APPROVAL", "REVISION_REQUIRED"];

const STATUS_FILTER: Record<string, string[]> = {
  all: DESIGN_STATUSES,
  pending: ["DRAFT", "IN_DESIGN"],
  review: ["CREATIVE_UPLOADED", "AWAITING_APPROVAL"],
  revision: ["REVISION_REQUIRED"],
};

export default function DesignerPage() {
  const api = useApi();
  const { checking } = useRoleGuard(["DESIGNER", "ADMIN"]);

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<string | null>(null);

  useEffect(() => {
    if (checking) return;
    (async () => {
      try {
        const clients = await api.clients.list();
        const arrays = await Promise.all(
          clients.map((c: any) => api.posts.listByClient(c.id).catch(() => []))
        );
        const clientMap = Object.fromEntries(clients.map((c: any) => [c.id, c]));
        const all = arrays.flat()
          .filter((p: any) => DESIGN_STATUSES.includes(p.status))
          .map((p: any) => ({
            ...p,
            clientName: clientMap[p.project?.clientId]?.name ?? "—",
          }))
          .sort((a: any, b: any) =>
            new Date(a.scheduledDate ?? 0).getTime() - new Date(b.scheduledDate ?? 0).getTime()
          );
        setPosts(all);
      } catch {}
      finally { setLoading(false); }
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
      const updated = await api.posts.get(postId);
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, ...updated, clientName: p.clientName } : p));
    } catch {}
    finally {
      setUploading(null);
      uploadTargetRef.current = null;
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function triggerUpload(postId: string) {
    uploadTargetRef.current = postId;
    fileInputRef.current?.click();
  }

  if (checking) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f1a" }}>
      <div style={{ width: 32, height: 32, border: "2px solid rgba(52,217,123,.2)", borderTopColor: "#34d97b", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    </div>
  );

  const needsUpload = posts.filter((p) => ["DRAFT","IN_DESIGN"].includes(p.status)).length;
  const revisions = posts.filter((p) => p.status === "REVISION_REQUIRED").length;
  const submitted = posts.filter((p) => ["CREATIVE_UPLOADED","AWAITING_APPROVAL"].includes(p.status)).length;

  const filtered = filter === "all"
    ? posts
    : posts.filter((p) => STATUS_FILTER[filter]?.includes(p.status));

  function pillCls(status: string) {
    if (status === "REVISION_REQUIRED") return "plr";
    if (["CREATIVE_UPLOADED","AWAITING_APPROVAL"].includes(status)) return "plb";
    return "pla";
  }

  function isOverdue(p: any) {
    return p.scheduledDate && new Date(p.scheduledDate) < TODAY;
  }

  return (
    <DashboardShell
      title="Design workspace"
      actionButton={
        <button className="gb gbp" onClick={() => fileInputRef.current?.click()}>
          <i className="ti ti-upload" /> Upload creative
        </button>
      }
    >
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*,video/*" style={{ display: "none" }} onChange={handleFileChange} />

      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        {/* Filter tabs */}
        <div style={{ padding: "8px 22px", borderBottom: "1px solid var(--tb-b)", display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
          <span className={`flt${filter === "all" ? " act" : ""}`} onClick={() => setFilter("all")}>All ({posts.length})</span>
          <span className={`flt${filter === "pending" ? " act" : ""}`} onClick={() => setFilter("pending")}>Awaiting upload ({needsUpload})</span>
          <span className={`flt${filter === "review" ? " act" : ""}`} onClick={() => setFilter("review")}>In review ({submitted})</span>
          <span className={`flt${filter === "revision" ? " act" : ""}`} onClick={() => setFilter("revision")}>Revision needed ({revisions})</span>
        </div>

        {/* Stats bar */}
        <div className="sbar" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
          <div className="sc2"><div className="sv" style={{ color: "var(--amber)" }}>{loading ? "—" : needsUpload}</div><div className="sl2">Awaiting upload</div></div>
          <div className="sc2"><div className="sv" style={{ color: "var(--red)" }}>{loading ? "—" : revisions}</div><div className="sl2">Revisions</div></div>
          <div className="sc2"><div className="sv" style={{ color: "var(--blue)" }}>{loading ? "—" : submitted}</div><div className="sl2">In review</div></div>
          <div className="sc2"><div className="sv">{loading ? "—" : posts.length}</div><div className="sl2">Total open</div></div>
        </div>

        {/* Brief cards */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
              <div style={{ width: 28, height: 28, border: "2px solid rgba(52,217,123,.2)", borderTopColor: "#34d97b", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 22px", textAlign: "center" }}>
              <i className="ti ti-circle-check" style={{ fontSize: 40, color: "var(--green)", display: "block", marginBottom: 12 }} />
              <div style={{ fontSize: 14, color: "var(--t2)", marginBottom: 4 }}>{posts.length === 0 ? "No work in queue" : "Nothing in this filter"}</div>
              <div style={{ fontSize: 11, color: "var(--t4)", fontWeight: 300 }}>{posts.length === 0 ? "Posts appear here once the admin generates a content calendar." : "Adjust the filters above."}</div>
            </div>
          ) : (
            <div className="sa">
              {filtered.map((p) => {
                const isRevision = p.status === "REVISION_REQUIRED";
                const overdue = isOverdue(p);
                const currentAsset = p.assets?.find((a: any) => a.isCurrent) ?? p.assets?.[0];
                const revisionNote = isRevision && p.approvals?.length > 0
                  ? p.approvals[p.approvals.length - 1]?.comment ?? "Please revise."
                  : null;

                return (
                  <div key={p.id} className="brc" data-status={isRevision ? "revision" : undefined}>
                    <div className="brch">
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--in)", border: "1px solid var(--in-b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--t3)", flexShrink: 0 }}>
                          {(p.clientName ?? "").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 400, color: "var(--t1)" }}>{p.topic ?? p.hook ?? "Post"}</div>
                          <div style={{ fontSize: 10, color: "var(--t4)", marginTop: 1 }}>{p.clientName} · {p.objective ?? p.format ?? ""}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className={`pl ${pillCls(p.status)}`}>{p.status?.replace(/_/g, " ")}</span>
                        {overdue
                          ? <div style={{ fontSize: 10, color: "var(--red)", fontWeight: 300 }}><i className="ti ti-alert-circle" style={{ fontSize: 9 }} /> Overdue</div>
                          : p.scheduledDate && <div style={{ fontSize: 10, color: "var(--t4)", fontWeight: 300 }}>Due {new Date(p.scheduledDate).toLocaleDateString("en", { month: "short", day: "numeric" })}</div>
                        }
                      </div>
                    </div>
                    <div className="brd">
                      <div className="bri">
                        <div className="bril">Format</div><div className="briv">{p.format ?? "—"}</div>
                        <div className="bril">Platform</div><div className="briv">{p.platform ? p.platform.charAt(0).toUpperCase() + p.platform.slice(1) : "—"}</div>
                        <div className="bril">Publish date</div><div className="briv">{p.scheduledDate ? new Date(p.scheduledDate).toLocaleDateString("en", { month: "short", day: "numeric" }) : "—"}</div>
                        <div className="bril">Status</div><div className="briv" style={{ color: isRevision ? "var(--red)" : overdue ? "var(--red)" : "var(--t2)" }}>
                          {isRevision ? "Revision needed" : p.status?.replace(/_/g, " ")}
                        </div>
                      </div>

                      {/* Creative brief */}
                      {p.creativeNote && (
                        <div className="brb">
                          <div className="bril" style={{ marginBottom: 4 }}>Creative brief</div>
                          <div style={{ background: "var(--in)", border: "1px solid var(--in-b)", borderRadius: 8, padding: "10px 12px", fontSize: 10, color: "var(--t3)", lineHeight: 1.7, fontWeight: 300 }}>
                            {p.creativeNote}
                          </div>
                        </div>
                      )}

                      {/* Caption */}
                      {p.caption && (
                        <div className="brb">
                          <div className="bril" style={{ marginBottom: 4 }}>Caption</div>
                          <div style={{ background: "var(--in)", border: "1px solid var(--in-b)", borderRadius: 8, padding: "10px 12px", fontSize: 10, color: "var(--t3)", lineHeight: 1.7, fontWeight: 300 }}>
                            {p.caption}
                          </div>
                        </div>
                      )}

                      {/* Revision note */}
                      {revisionNote && (
                        <div className="brb">
                          <div className="bril" style={{ marginBottom: 4, color: "var(--red)" }}>Revision notes</div>
                          <div style={{ background: "rgba(255,107,107,.06)", border: "1px solid rgba(255,107,107,.2)", borderRadius: 8, padding: "10px 12px", fontSize: 10, color: "var(--t2)", lineHeight: 1.7, fontWeight: 300 }}>
                            {revisionNote}
                          </div>
                        </div>
                      )}

                      {/* In review state */}
                      {["CREATIVE_UPLOADED","AWAITING_APPROVAL"].includes(p.status) && (
                        <div style={{ background: "rgba(107,159,255,.06)", border: "1px solid rgba(107,159,255,.2)", borderRadius: 8, padding: "9px 12px", fontSize: 10, color: "var(--blue)", fontWeight: 300, marginBottom: 12 }}>
                          <i className="ti ti-clock" style={{ fontSize: 9 }} /> Submitted · Under review by account manager
                        </div>
                      )}

                      {/* Upload area */}
                      <div className="bru">
                        {currentAsset?.fileUrl ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={currentAsset.fileUrl} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, border: "1px solid var(--card-b)" }} />
                            <div style={{ fontSize: 10, color: "var(--t4)", fontWeight: 300 }}>Current file uploaded</div>
                          </div>
                        ) : (
                          <div className="brud">
                            <i className="ti ti-cloud-upload" style={{ fontSize: 22, color: "var(--t4)", marginBottom: 6 }} />
                            <div style={{ fontSize: 11, color: "var(--t3)", fontWeight: 300 }}>Drag &amp; drop file or <span style={{ color: "var(--green)", cursor: "pointer" }} onClick={() => triggerUpload(p.id)}>browse</span></div>
                            <div style={{ fontSize: 9, color: "var(--t4)", marginTop: 3 }}>MP4, MOV, PNG, JPG · max 200MB</div>
                          </div>
                        )}
                        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                          <button className="gb gbg" style={{ fontSize: 10 }} onClick={() => triggerUpload(p.id)} disabled={uploading === p.id}>
                            <i className="ti ti-upload" style={{ fontSize: 10 }} />{currentAsset ? "Replace file" : "Upload file"}
                          </button>
                          <button className="gb gbp" style={{ fontSize: 10, flex: 1, justifyContent: "center" }} disabled={uploading === p.id} onClick={() => triggerUpload(p.id)}>
                            {uploading === p.id
                              ? <i className="ti ti-loader-2" style={{ animation: "spin 1s linear infinite", fontSize: 10 }} />
                              : <><i className="ti ti-send" style={{ fontSize: 10 }} />{isRevision ? "Re-submit" : "Submit for review"}</>}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
