"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Icon } from "@/components/ui/Icon";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/components/ui/Toast";

export default function BriefPage() {
  const { id: clientId } = useParams<{ id: string }>();
  const router  = useRouter();
  const api     = useApi();
  const toast   = useToast();
  const briefFileRef    = useRef<HTMLInputElement>(null);
  const brandAssetRef   = useRef<HTMLInputElement>(null);

  const [client,    setClient]    = useState<any>(null);
  const [brief,     setBrief]     = useState<any>(null);
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const [draggingBrief, setDraggingBrief] = useState(false);
  const [draggingBrand, setDraggingBrand] = useState(false);

  const [form, setForm] = useState({
    websiteUrl:      "",
    socialLinks:     "",
    referenceUrls:   "",
    campaignGoals:   "",
    targetAudience:  "",
    competitorNotes: "",
    toneOfVoice:     "",
    sector:          "",
    budgetRange:     "",
    adminNotes:      "",
  });

  useEffect(() => {
    (async () => {
      try {
        const [clientData, briefs] = await Promise.all([
          api.clients.get(clientId),
          api.briefs.listByClient(clientId),
        ]);
        setClient(clientData);
        if (briefs.length > 0) {
          const b = briefs[0];
          setBrief(b);
          setForm({
            websiteUrl:      b.websiteUrl      || "",
            socialLinks:     (b.socialLinks    || []).join("\n"),
            referenceUrls:   (b.referenceUrls  || []).join("\n"),
            campaignGoals:   b.campaignGoals   || "",
            targetAudience:  b.targetAudience  || "",
            competitorNotes: b.competitorNotes || "",
            toneOfVoice:     b.toneOfVoice     || "",
            sector:          b.sector          || "",
            budgetRange:     b.budgetRange     || "",
            adminNotes:      b.adminNotes      || "",
          });
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to load brief", "Please refresh the page.");
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const set = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function ensureBrief(): Promise<any> {
    if (brief) return brief;
    const payload = {
      clientId,
      websiteUrl:      form.websiteUrl      || undefined,
      socialLinks:     form.socialLinks ? form.socialLinks.split("\n").filter(Boolean) : [],
      referenceUrls:   form.referenceUrls ? form.referenceUrls.split("\n").filter(Boolean) : [],
      campaignGoals:   form.campaignGoals   || undefined,
      targetAudience:  form.targetAudience  || undefined,
      competitorNotes: form.competitorNotes || undefined,
      toneOfVoice:     form.toneOfVoice     || undefined,
      sector:          form.sector          || undefined,
      budgetRange:     form.budgetRange     || undefined,
      adminNotes:      form.adminNotes      || undefined,
    };
    const created = await api.briefs.create(payload);
    setBrief(created);
    return created;
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        clientId,
        websiteUrl:      form.websiteUrl      || undefined,
        socialLinks:     form.socialLinks ? form.socialLinks.split("\n").filter(Boolean) : [],
        referenceUrls:   form.referenceUrls ? form.referenceUrls.split("\n").filter(Boolean) : [],
        campaignGoals:   form.campaignGoals   || undefined,
        targetAudience:  form.targetAudience  || undefined,
        competitorNotes: form.competitorNotes || undefined,
        toneOfVoice:     form.toneOfVoice     || undefined,
        sector:          form.sector          || undefined,
        budgetRange:     form.budgetRange     || undefined,
        adminNotes:      form.adminNotes      || undefined,
      };
      if (brief) {
        const updated = await api.briefs.update(brief.id, payload);
        setBrief(updated);
        toast.success("Brief updated");
      } else {
        const created = await api.briefs.create(payload);
        setBrief(created);
        toast.success("Brief saved", "You can now upload files.");
      }
      router.push(`/clients/${clientId}`);
    } catch (e: any) {
      toast.error("Failed to save brief", e.message);
    } finally {
      setSaving(false);
    }
  }

  async function uploadFile(type: "brief" | "brand", file: File) {
    setUploading(type);
    try {
      const currentBrief = await ensureBrief();
      if (type === "brief") {
        await api.briefs.uploadBrief(currentBrief.id, file);
      } else {
        await api.briefs.uploadBrandAsset(currentBrief.id, file);
      }
      const updated = await api.briefs.get(currentBrief.id);
      setBrief(updated);
      toast.success(
        type === "brief" ? "Brief document uploaded" : "Brand asset uploaded",
        file.name,
      );
    } catch (err: any) {
      toast.error("Upload failed", err.message);
    } finally {
      setUploading(null);
    }
  }

  function handleBriefFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile("brief", file);
    e.target.value = "";
  }

  function handleBrandFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile("brand", file);
    e.target.value = "";
  }

  function onDragOver(e: React.DragEvent, setter: (v: boolean) => void) {
    e.preventDefault();
    setter(true);
  }
  function onDragLeave(setter: (v: boolean) => void) {
    setter(false);
  }
  function onDrop(e: React.DragEvent, type: "brief" | "brand", setter: (v: boolean) => void) {
    e.preventDefault();
    setter(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    uploadFile(type, file);
  }

  return (
    <DashboardShell contextLabel={client?.name || "Brief"}>
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", minHeight: 0 }}>
      <div className="p-8 md:p-12 max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "var(--t3)" }}>
          <Link href="/dashboard" className="hover:opacity-80 transition-opacity">Dashboard</Link>
          <Icon name="chevron_right" className="text-xs" />
          <Link href={`/clients/${clientId}`} className="hover:opacity-80 transition-opacity">{client?.name}</Link>
          <Icon name="chevron_right" className="text-xs" />
          <span style={{ color: "var(--t1)" }}>Brief</span>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-headline font-light tracking-tight" style={{ color: "var(--t1)" }}>
            {brief ? "Update" : "Upload"} Client Brief
          </h1>
          <p className="mt-2" style={{ fontSize: 13, color: "var(--t3)", fontWeight: 300 }}>
            Fill in the inputs for the AI strategy agent. Files can be dragged &amp; dropped directly.
          </p>
        </div>

        <div className="space-y-8">
          {/* ── File uploads ── */}
          <div className="rounded-2xl p-8" style={{ background: "var(--card)", border: "1px solid var(--card-b)" }}>
            <h3 className="font-headline font-light text-sm mb-1" style={{ color: "var(--t1)" }}>Files &amp; Assets</h3>
            <p className="text-xs mb-6" style={{ color: "var(--t3)", fontWeight: 300 }}>
              Drag &amp; drop files directly — the brief record will be created automatically if needed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Brief document drop zone */}
              <div>
                <label className="text-[11px] uppercase tracking-widest font-semibold block mb-3" style={{ color: "var(--t4)" }}>
                  Brief Document
                </label>
                {brief?.briefFileName && (
                  <div className="flex items-center gap-2 text-sm mb-3 p-3 rounded-lg" style={{ color: "var(--t2)", background: "var(--in)", border: "1px solid var(--in-b)" }}>
                    <Icon name="description" style={{ color: "var(--green)" }} />
                    <span className="truncate">{brief.briefFileName}</span>
                    <Icon name="check_circle" className="text-emerald-500 ml-auto shrink-0" />
                  </div>
                )}
                <div
                  onDragOver={(e) => onDragOver(e, setDraggingBrief)}
                  onDragLeave={() => onDragLeave(setDraggingBrief)}
                  onDrop={(e) => onDrop(e, "brief", setDraggingBrief)}
                  onClick={() => briefFileRef.current?.click()}
                  className={`w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all select-none ${draggingBrief ? "scale-[1.01]" : ""}`}
                  style={{
                    borderColor: draggingBrief ? "var(--green)" : "var(--in-b)",
                    background: draggingBrief ? "var(--gb)" : "var(--in)",
                  }}
                >
                  {uploading === "brief" ? (
                    <div className="flex flex-col items-center gap-2">
                      <span className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "var(--green)", borderTopColor: "transparent" }} />
                      <p className="text-xs" style={{ color: "var(--t3)" }}>Uploading…</p>
                    </div>
                  ) : (
                    <>
                      <Icon name={draggingBrief ? "file_download" : "upload"} className="text-3xl mb-2" style={{ color: "var(--t4)" }} />
                      <p className="text-sm font-light" style={{ color: "var(--t2)" }}>
                        {draggingBrief ? "Drop to upload" : "Drop file or click"}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--t4)" }}>PDF, DOC, DOCX, TXT</p>
                    </>
                  )}
                </div>
                <input
                  ref={briefFileRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  hidden
                  onChange={handleBriefFileChange}
                />
              </div>

              {/* Brand assets drop zone */}
              <div>
                <label className="text-[11px] uppercase tracking-widest font-semibold block mb-3" style={{ color: "var(--t4)" }}>
                  Brand Assets
                </label>
                {brief?.brandAssets?.length > 0 && (
                  <div className="flex items-center gap-2 text-sm mb-3 p-3 rounded-lg" style={{ color: "var(--t2)", background: "var(--in)", border: "1px solid var(--in-b)" }}>
                    <Icon name="folder_zip" style={{ color: "var(--green)" }} />
                    <span>{brief.brandAssets.length} file{brief.brandAssets.length !== 1 ? "s" : ""} uploaded</span>
                    <Icon name="check_circle" className="text-emerald-500 ml-auto shrink-0" />
                  </div>
                )}
                <div
                  onDragOver={(e) => onDragOver(e, setDraggingBrand)}
                  onDragLeave={() => onDragLeave(setDraggingBrand)}
                  onDrop={(e) => onDrop(e, "brand", setDraggingBrand)}
                  onClick={() => brandAssetRef.current?.click()}
                  className={`w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all select-none ${draggingBrand ? "scale-[1.01]" : ""}`}
                  style={{
                    borderColor: draggingBrand ? "var(--green)" : "var(--in-b)",
                    background: draggingBrand ? "var(--gb)" : "var(--in)",
                  }}
                >
                  {uploading === "brand" ? (
                    <div className="flex flex-col items-center gap-2">
                      <span className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "var(--green)", borderTopColor: "transparent" }} />
                      <p className="text-xs" style={{ color: "var(--t3)" }}>Uploading…</p>
                    </div>
                  ) : (
                    <>
                      <Icon name={draggingBrand ? "file_download" : "image"} className="text-3xl mb-2" style={{ color: "var(--t4)" }} />
                      <p className="text-sm font-light" style={{ color: "var(--t2)" }}>
                        {draggingBrand ? "Drop to upload" : "Drop file or click"}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--t4)" }}>Images, PDF, ZIP</p>
                    </>
                  )}
                </div>
                <input
                  ref={brandAssetRef}
                  type="file"
                  accept="image/*,.pdf,.zip"
                  hidden
                  onChange={handleBrandFileChange}
                />
              </div>
            </div>
          </div>

          {/* ── URLs ── */}
          <div className="rounded-2xl p-8 space-y-5" style={{ background: "var(--card)", border: "1px solid var(--card-b)" }}>
            <h3 className="font-headline font-light text-sm mb-2" style={{ color: "var(--t1)" }}>URLs &amp; Links</h3>
            <Field label="Website URL" value={form.websiteUrl} onChange={set("websiteUrl")} placeholder="https://client.com" />
            <TextareaField label="Social Media Links (one per line)" value={form.socialLinks} onChange={set("socialLinks")} placeholder="https://instagram.com/brand" rows={3} />
            <TextareaField label="Reference / Inspiration URLs (one per line)" value={form.referenceUrls} onChange={set("referenceUrls")} placeholder="https://competitor.com" rows={3} />
          </div>

          {/* ── Strategy Inputs ── */}
          <div className="rounded-2xl p-8 space-y-5" style={{ background: "var(--card)", border: "1px solid var(--card-b)" }}>
            <h3 className="font-headline font-light text-sm mb-2" style={{ color: "var(--t1)" }}>Strategy Inputs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Sector / Industry" value={form.sector} onChange={set("sector")} placeholder="Luxury Real Estate" />
              <Field label="Budget Range" value={form.budgetRange} onChange={set("budgetRange")} placeholder="AED 15,000/mo" />
            </div>
            <TextareaField label="Campaign Goals" value={form.campaignGoals} onChange={set("campaignGoals")} placeholder="Increase brand awareness, generate qualified leads, build authority..." rows={3} />
            <TextareaField label="Target Audience" value={form.targetAudience} onChange={set("targetAudience")} placeholder="HNW individuals 35–55, based in Dubai, interested in premium real estate..." rows={3} />
            <TextareaField label="Competitor Notes" value={form.competitorNotes} onChange={set("competitorNotes")} placeholder="Main competitors are X and Y. They focus on X but lack Y..." rows={3} />
            <TextareaField label="Tone of Voice" value={form.toneOfVoice} onChange={set("toneOfVoice")} placeholder="Authoritative but approachable. Editorial. Never salesy..." rows={2} />
          </div>

          {/* ── Internal Notes ── */}
          <div className="rounded-2xl p-8" style={{ background: "var(--card)", border: "1px solid var(--card-b)" }}>
            <TextareaField label="Internal Admin Notes" value={form.adminNotes} onChange={set("adminNotes")} placeholder="Notes for internal team only. Not shared with client." rows={3} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-10 pt-8" style={{ borderTop: "1px solid var(--row-b)" }}>
          <Link
            href={`/clients/${clientId}`}
            className="text-sm transition-opacity hover:opacity-70"
            style={{ color: "var(--t3)", fontWeight: 300 }}
          >
            ← Back to client
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-4 rounded-md transition-all active:scale-[0.99] disabled:opacity-60 font-headline font-light text-sm hover:opacity-90"
            style={{ background: "var(--gb)", border: "1px solid var(--gbb)", color: "var(--green)" }}
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "var(--green)", borderTopColor: "transparent" }} />
                Saving…
              </>
            ) : (
              <><Icon name="save" className="text-sm" /> {brief ? "Update Brief" : "Save Brief"}</>
            )}
          </button>
        </div>
      </div>
      </div>
    </DashboardShell>
  );
}

// ── Field components ──────────────────────────────────────────
function Field({ label, value, onChange, placeholder }: {
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        className="text-[11px] uppercase tracking-widest font-semibold block mb-2"
        style={{ color: "var(--t4)" }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-md text-sm focus:outline-none transition-all"
        style={{ background: "var(--fi)", border: "1px solid var(--fi-b)", color: "var(--t1)" }}
      />
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder, rows = 3 }: {
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string; rows?: number;
}) {
  return (
    <div>
      <label
        className="text-[11px] uppercase tracking-widest font-semibold block mb-2"
        style={{ color: "var(--t4)" }}
      >
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-md text-sm focus:outline-none transition-all resize-none"
        style={{ background: "var(--fi)", border: "1px solid var(--fi-b)", color: "var(--t1)" }}
      />
    </div>
  );
}
