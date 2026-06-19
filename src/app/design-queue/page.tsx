"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useApi } from "@/hooks/useApi";
import { useRoleGuard } from "@/hooks/useRoleGuard";

const TODAY = new Date();

const STATUS_CLASS: Record<string, string> = {
  PUBLISHED: "plg", CREATIVE_UPLOADED: "plb", AWAITING_APPROVAL: "plb",
  APPROVED: "plg", REVISION_REQUIRED: "plr", IN_DESIGN: "pla", DRAFT: "pla",
};

export default function DesignQueuePage() {
  const api = useApi();
  const { checking } = useRoleGuard(["ADMIN"]);
  const [clients, setClients] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterClient, setFilterClient] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDesigner, setFilterDesigner] = useState("all");
  const [filterFormat, setFilterFormat] = useState("all");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterDueDate, setFilterDueDate] = useState("all");
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadPostId, setUploadPostId] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [postActionLoading, setPostActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (checking) return;
    (async () => {
      try {
        const clientData = await api.clients.list();
        setClients(clientData);
        const allPosts: any[] = [];
        for (const c of clientData.slice(0, 8)) {
          try { const p = await api.posts.listByClient(c.id); allPosts.push(...p.map((x: any) => ({ ...x, clientName: c.name }))); } catch {}
        }
        setPosts(allPosts);
      } catch {}
      finally { setLoading(false); }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking]);

  if (checking) return null;

  const filtered = posts.filter((p) => {
    if (filterClient !== "all" && p.clientName !== filterClient) return false;
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    if (filterDesigner !== "all" && (filterDesigner === "AI" ? p.designer !== "AI" : p.designer !== filterDesigner)) return false;
    if (filterFormat !== "all" && p.format !== filterFormat) return false;
    if (filterPlatform !== "all" && p.platform !== filterPlatform) return false;
    return true;
  });

  const stats = {
    total: filtered.length,
    generating: filtered.filter((p) => p.status === "IN_DESIGN").length,
    awaitingUpload: filtered.filter((p) => p.status === "DRAFT").length,
    needsReview: filtered.filter((p) => ["AWAITING_APPROVAL","CREATIVE_UPLOADED"].includes(p.status)).length,
    revision: filtered.filter((p) => p.status === "REVISION_REQUIRED").length,
    approved: filtered.filter((p) => p.status === "APPROVED").length,
  };

  async function dqApprove(postId: string) {
    setPostActionLoading(postId);
    try {
      await api.posts.approve(postId, "APPROVED", "");
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, status: "APPROVED" } : p));
    } catch {}
    setPostActionLoading(null);
  }

  async function dqRevise(postId: string) {
    setPostActionLoading(postId);
    try {
      await api.posts.approve(postId, "CHANGES_REQUESTED", "");
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, status: "REVISION_REQUIRED" } : p));
    } catch {}
    setPostActionLoading(null);
  }

  async function handleUpload() {
    if (!uploadPostId || !uploadFile) return;
    setUploading(true);
    try {
      await api.assets.upload(uploadPostId, uploadFile, "");
      setPosts((prev) => prev.map((p) => p.id === uploadPostId ? { ...p, status: "CREATIVE_UPLOADED" } : p));
      setUploadModal(false);
      setUploadPostId(null);
      setUploadFile(null);
    } catch {}
    setUploading(false);
  }

  function dqIcon(status: string) {
    if (status === "PUBLISHED") return { cls: "dqtp", icon: "ti-check", color: "var(--green)" };
    if (["IN_DESIGN","DRAFT"].includes(status)) return { cls: "dqta", icon: "ti-robot", color: "var(--green)" };
    if (["AWAITING_APPROVAL","CREATIVE_UPLOADED"].includes(status)) return { cls: "dqtw", icon: "ti-photo", color: "var(--blue)" };
    if (status === "REVISION_REQUIRED") return { cls: "dqtr", icon: "ti-alert-circle", color: "var(--red)" };
    return { cls: "dqti", icon: "ti-upload", color: "var(--amber)" };
  }

  return (
    <DashboardShell
      title="Design queue"
      actionButton={
        <button className="gb gbp" onClick={() => setUploadModal(true)}>
          <i className="ti ti-upload" /> Upload creative
        </button>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        {/* Filters */}
        <div className="fst">
          <div className="fg2">
            <div className="fgl">Client</div>
            <select className="fs" value={filterClient} onChange={(e) => setFilterClient(e.target.value)}>
              <option value="all">All clients</option>
              {clients.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="fg2">
            <div className="fgl">Designer</div>
            <select className="fs" value={filterDesigner} onChange={(e) => setFilterDesigner(e.target.value)}>
              <option value="all">All designers</option>
              <option value="AI">AI agents</option>
              <option value="Dana M.">Dana M.</option>
            </select>
          </div>
          <div className="fg2">
            <div className="fgl">Status</div>
            <select className="fs" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All statuses</option>
              {["IN_DESIGN","DRAFT","CREATIVE_UPLOADED","AWAITING_APPROVAL","REVISION_REQUIRED","APPROVED","PUBLISHED"].map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>
          <div className="fg2">
            <div className="fgl">Format</div>
            <select className="fs" value={filterFormat} onChange={(e) => setFilterFormat(e.target.value)}>
              <option value="all">All formats</option>
              {["Static","Reel","Carousel"].map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="fg2">
            <div className="fgl">Platform</div>
            <select className="fs" value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)}>
              <option value="all">All platforms</option>
              {["instagram","linkedin","tiktok","facebook"].map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
          </div>
          <div className="fg2">
            <div className="fgl">Due date</div>
            <select className="fs" value={filterDueDate} onChange={(e) => setFilterDueDate(e.target.value)}>
              <option value="all">Any date</option>
              <option value="today">Due today</option>
              <option value="week">Due this week</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div className="sw2">
            <i className="ti ti-search" style={{ fontSize: 12, color: "var(--t4)" }} />
            <input type="text" placeholder="Search posts, clients…" />
          </div>
          <button className="gb gbp" style={{ alignSelf: "flex-end" }} onClick={() => setUploadModal(true)}>
            <i className="ti ti-upload" style={{ fontSize: 11 }} /> Upload creative
          </button>
        </div>

        {/* Stats bar */}
        <div className="sbar">
          {[["Total", stats.total, "var(--t1)"], ["AI generating", stats.generating, "var(--green)"], ["Awaiting upload", stats.awaitingUpload, "var(--blue)"], ["Needs review", stats.needsReview, "var(--amber)"], ["Revision needed", stats.revision, "var(--red)"], ["Approved", stats.approved, "var(--green)"]].map(([label, val, color]) => (
            <div key={label as string} className="sc2"><div className="sv" style={{ color: color as string }}>{String(val)}</div><div className="sl2">{label as string}</div></div>
          ))}
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
              <div style={{ width: 28, height: 28, border: "2px solid rgba(52,217,123,.2)", borderTopColor: "#34d97b", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            </div>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: 44 }} />
                  <th>Post</th>
                  <th>Client</th>
                  <th>Platform</th>
                  <th>Format</th>
                  <th>Designer</th>
                  <th>Publish date</th>
                  <th>Due by</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} style={{ textAlign: "center", padding: "32px 12px", color: "var(--t4)" }}><i className="ti ti-photo-off" style={{ fontSize: 28, display: "block", marginBottom: 8 }} />No design items found</td></tr>
                ) : filtered.map((p) => {
                  const { cls, icon, color } = dqIcon(p.status);
                  const cls2 = STATUS_CLASS[p.status] ?? "pla";
                  const overdue = p.scheduledDate && new Date(p.scheduledDate) < TODAY;
                  return (
                    <tr key={p.id} className={p.status === "REVISION_REQUIRED" ? "rev" : ""}>
                      <td><div className={`dqt ${cls}`}><i className={`ti ${icon}`} style={{ color, fontSize: 13 }} /></div></td>
                      <td>
                        <div style={{ fontSize: 12, fontWeight: 300, color: "var(--t1)" }}>{p.topic ?? p.hook ?? "Post"}</div>
                        <div style={{ fontSize: 10, color: "var(--t4)", fontWeight: 300 }}>{p.objective ?? ""}</div>
                      </td>
                      <td><span className="ctg ctof" style={{ fontSize: 10 }}>{(p.clientName ?? "").split(" ").map((w: string) => w[0]).join("").slice(0, 2)}</span></td>
                      <td><i className={`ti ti-brand-${p.platform}`} style={{ fontSize: 13, color: "var(--t3)" }} /></td>
                      <td style={{ fontSize: 11, color: "var(--t3)" }}>{p.format}</td>
                      <td style={{ fontSize: 10, color: p.designer && p.designer !== "AI" ? "var(--t3)" : "var(--green)" }}>
                        {p.designer && p.designer !== "AI"
                          ? <><i className="ti ti-user" style={{ fontSize: 10 }} /> {p.designer}</>
                          : <><i className="ti ti-robot" style={{ fontSize: 10 }} /> AI</>}
                      </td>
                      <td style={{ fontSize: 11, color: "var(--t3)" }}>{p.scheduledDate ? new Date(p.scheduledDate).toLocaleDateString("en", { month: "short", day: "numeric" }) : "—"}</td>
                      <td>{p.status === "PUBLISHED" ? <span className="dob">Done</span> : overdue ? <span className="doo">Overdue</span> : <span className="dos">Pending</span>}</td>
                      <td><span className={`pl ${cls2}`}>{p.status?.replace(/_/g, " ")}</span></td>
                      <td>
                        <div style={{ display: "flex", gap: 3 }}>
                          {["AWAITING_APPROVAL","CREATIVE_UPLOADED"].includes(p.status) && <button className="gb gbs gbp" disabled={postActionLoading === p.id} onClick={() => dqApprove(p.id)}>{postActionLoading === p.id ? "…" : "Approve"}</button>}
                          {["AWAITING_APPROVAL","CREATIVE_UPLOADED"].includes(p.status) && <button className="gb gbs gba">Client</button>}
                          {["AWAITING_APPROVAL","CREATIVE_UPLOADED"].includes(p.status) && <button className="gb gbs gbr" disabled={postActionLoading === p.id} onClick={() => dqRevise(p.id)}>Revise</button>}
                          {p.status === "REVISION_REQUIRED" && <><button className="gb gbs">Notes</button><button className="gb gbs gbbl" onClick={() => { setUploadPostId(p.id); setUploadModal(true); }}><i className="ti ti-upload" style={{ fontSize: 9 }} />Re-upload</button></>}
                          {!["AWAITING_APPROVAL","CREATIVE_UPLOADED","REVISION_REQUIRED"].includes(p.status) && <button className="gb gbs">View</button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Upload modal */}
      {uploadModal && (
        <div className="mo" onClick={(e) => { if (e.target === e.currentTarget && !uploading) { setUploadModal(false); setUploadPostId(null); setUploadFile(null); } }}>
          <div className="mb">
            <div className="mbt">Upload creative file</div>
            <div className="mbs">Upload the final creative file. Accepted: JPG, PNG, MP4, MOV, ZIP. Max 200 MB.</div>
            <div style={{ border: `2px dashed ${uploadFile ? "var(--green)" : "var(--gbb)"}`, borderRadius: 12, padding: 28, textAlign: "center", background: "var(--gb)", marginBottom: 12, transition: "border-color .15s" }}>
              <input id="dq-upload-creative" type="file" accept=".jpg,.jpeg,.png,.mp4,.mov,.zip" style={{ display: "none" }}
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)} />
              <label htmlFor="dq-upload-creative" style={{ cursor: "pointer", display: "block" }}>
                <i className="ti ti-upload" style={{ fontSize: 28, color: "var(--green)", display: "block", marginBottom: 8 }} />
                {uploadFile ? (
                  <div style={{ fontSize: 12, color: "var(--t1)", fontWeight: 300 }}>{uploadFile.name}</div>
                ) : (
                  <>
                    <div style={{ fontSize: 13, fontWeight: 300, color: "var(--t1)" }}>Drop file here or click to browse</div>
                    <div style={{ fontSize: 10, color: "var(--t4)", marginTop: 4 }}>JPG · PNG · MP4 · MOV · ZIP up to 200 MB</div>
                  </>
                )}
              </label>
            </div>
            <div className="mbb">
              <button className="gb gbg" onClick={() => { setUploadModal(false); setUploadPostId(null); setUploadFile(null); }} disabled={uploading}>Cancel</button>
              <button className="gb gbp" onClick={handleUpload} disabled={!uploadFile || uploading}>
                {uploading ? <><span style={{ display: "inline-block", width: 12, height: 12, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Uploading…</> : <><i className="ti ti-upload" /> Upload &amp; submit</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
