"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Icon } from "@/components/ui/Icon";
import { useApi } from "@/hooks/useApi";

export default function BriefPage() {
  const { id: clientId } = useParams<{ id: string }>();
  const router = useRouter();
  const api = useApi();
  const briefFileRef = useRef<HTMLInputElement>(null);
  const brandAssetRef = useRef<HTMLInputElement>(null);

  const [client, setClient] = useState<any>(null);
  const [brief, setBrief] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const [form, setForm] = useState({
    websiteUrl: "",
    socialLinks: "",
    referenceUrls: "",
    campaignGoals: "",
    targetAudience: "",
    competitorNotes: "",
    toneOfVoice: "",
    sector: "",
    budgetRange: "",
    adminNotes: "",
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
            websiteUrl: b.websiteUrl || "",
            socialLinks: (b.socialLinks || []).join("\n"),
            referenceUrls: (b.referenceUrls || []).join("\n"),
            campaignGoals: b.campaignGoals || "",
            targetAudience: b.targetAudience || "",
            competitorNotes: b.competitorNotes || "",
            toneOfVoice: b.toneOfVoice || "",
            sector: b.sector || "",
            budgetRange: b.budgetRange || "",
            adminNotes: b.adminNotes || "",
          });
        }
      } catch (e) {
        console.error(e);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        clientId,
        websiteUrl: form.websiteUrl || undefined,
        socialLinks: form.socialLinks ? form.socialLinks.split("\n").filter(Boolean) : [],
        referenceUrls: form.referenceUrls ? form.referenceUrls.split("\n").filter(Boolean) : [],
        campaignGoals: form.campaignGoals || undefined,
        targetAudience: form.targetAudience || undefined,
        competitorNotes: form.competitorNotes || undefined,
        toneOfVoice: form.toneOfVoice || undefined,
        sector: form.sector || undefined,
        budgetRange: form.budgetRange || undefined,
        adminNotes: form.adminNotes || undefined,
      };

      if (brief) {
        const updated = await api.briefs.update(brief.id, payload);
        setBrief(updated);
      } else {
        const created = await api.briefs.create(payload);
        setBrief(created);
      }

      router.push(`/clients/${clientId}`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleBriefFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !brief) return;
    setUploading("brief");
    try {
      await api.briefs.uploadBrief(brief.id, file);
      const updated = await api.briefs.get(brief.id);
      setBrief(updated);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(null);
    }
  }

  async function handleBrandAssetUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !brief) return;
    setUploading("brand");
    try {
      await api.briefs.uploadBrandAsset(brief.id, file);
      const updated = await api.briefs.get(brief.id);
      setBrief(updated);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(null);
    }
  }

  return (
    <DashboardShell contextLabel={client?.name || "Brief"}>
      <div className="p-8 md:p-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-8">
          <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
          <Icon name="chevron_right" className="text-xs" />
          <Link href={`/clients/${clientId}`} className="hover:text-primary">{client?.name}</Link>
          <Icon name="chevron_right" className="text-xs" />
          <span className="text-on-surface font-semibold">Brief</span>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">
            {brief ? "Update" : "Upload"} Client Brief
          </h1>
          <p className="text-on-surface-variant mt-2">
            Fill in the inputs needed for the AI strategy agent to run your methodology.
          </p>
        </div>

        <div className="space-y-8">
          {/* File uploads */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10">
            <h3 className="font-headline font-bold mb-6">Files & Assets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] uppercase tracking-widest font-semibold text-on-surface-variant block mb-3">
                  Brief Document
                </label>
                {brief?.briefFileName && (
                  <div className="flex items-center gap-2 text-sm text-on-surface mb-3">
                    <Icon name="description" className="text-primary" />
                    <span>{brief.briefFileName}</span>
                  </div>
                )}
                <button
                  onClick={() => briefFileRef.current?.click()}
                  disabled={!brief || uploading === "brief"}
                  className="w-full border-2 border-dashed border-outline-variant/40 rounded-xl p-6 text-center hover:border-primary/40 hover:bg-primary/5 transition-all disabled:opacity-50"
                >
                  {uploading === "brief" ? (
                    <span className="text-xs text-on-surface-variant">Uploading...</span>
                  ) : (
                    <>
                      <Icon name="upload" className="text-2xl text-on-surface-variant/50 mb-2" />
                      <p className="text-xs text-on-surface-variant">{brief ? "Replace brief file" : "Save first, then upload"}</p>
                    </>
                  )}
                </button>
                <input ref={briefFileRef} type="file" accept=".pdf,.doc,.docx,.txt" hidden onChange={handleBriefFileUpload} />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-widest font-semibold text-on-surface-variant block mb-3">
                  Brand Assets
                </label>
                {brief?.brandAssets?.length > 0 && (
                  <p className="text-xs text-on-surface-variant mb-3">{brief.brandAssets.length} file(s) uploaded</p>
                )}
                <button
                  onClick={() => brandAssetRef.current?.click()}
                  disabled={!brief || uploading === "brand"}
                  className="w-full border-2 border-dashed border-outline-variant/40 rounded-xl p-6 text-center hover:border-primary/40 hover:bg-primary/5 transition-all disabled:opacity-50"
                >
                  {uploading === "brand" ? (
                    <span className="text-xs text-on-surface-variant">Uploading...</span>
                  ) : (
                    <>
                      <Icon name="image" className="text-2xl text-on-surface-variant/50 mb-2" />
                      <p className="text-xs text-on-surface-variant">{brief ? "Add brand asset" : "Save first, then upload"}</p>
                    </>
                  )}
                </button>
                <input ref={brandAssetRef} type="file" accept="image/*,.pdf,.zip" hidden onChange={handleBrandAssetUpload} />
              </div>
            </div>
          </div>

          {/* URLs */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 space-y-5">
            <h3 className="font-headline font-bold mb-2">URLs & Links</h3>
            <Field label="Website URL" value={form.websiteUrl} onChange={set("websiteUrl")} placeholder="https://client.com" />
            <TextareaField label="Social Media Links (one per line)" value={form.socialLinks} onChange={set("socialLinks")} placeholder="https://instagram.com/brand" rows={3} />
            <TextareaField label="Reference / Inspiration URLs (one per line)" value={form.referenceUrls} onChange={set("referenceUrls")} placeholder="https://competitor.com" rows={3} />
          </div>

          {/* Strategy Inputs */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 space-y-5">
            <h3 className="font-headline font-bold mb-2">Strategy Inputs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Sector / Industry" value={form.sector} onChange={set("sector")} placeholder="Luxury Real Estate" />
              <Field label="Budget Range" value={form.budgetRange} onChange={set("budgetRange")} placeholder="AED 15,000/mo" />
            </div>
            <TextareaField label="Campaign Goals" value={form.campaignGoals} onChange={set("campaignGoals")} placeholder="Increase brand awareness, generate qualified leads, build authority..." rows={3} />
            <TextareaField label="Target Audience" value={form.targetAudience} onChange={set("targetAudience")} placeholder="HNW individuals 35–55, based in Dubai, interested in premium real estate..." rows={3} />
            <TextareaField label="Competitor Notes" value={form.competitorNotes} onChange={set("competitorNotes")} placeholder="Main competitors are X and Y. They focus on X but lack Y..." rows={3} />
            <TextareaField label="Tone of Voice" value={form.toneOfVoice} onChange={set("toneOfVoice")} placeholder="Authoritative but approachable. Editorial. Never salesy..." rows={2} />
          </div>

          {/* Internal Notes */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10">
            <TextareaField label="Internal Admin Notes" value={form.adminNotes} onChange={set("adminNotes")} placeholder="Notes for internal team only. Not shared with client." rows={3} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-10 pt-8 border-t border-outline-variant/20">
          <Link href={`/clients/${clientId}`} className="text-sm text-on-surface-variant hover:text-on-surface">
            ← Back to client
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold text-sm rounded-md shadow-lg hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60"
          >
            {saving ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
            ) : (
              <><Icon name="save" className="text-sm" /> {brief ? "Update Brief" : "Save Brief"}</>
            )}
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-widest font-semibold text-on-surface-variant block mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-surface-container-low rounded-md text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all"
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
      <label className="text-[11px] uppercase tracking-widest font-semibold text-on-surface-variant block mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-surface-container-low rounded-md text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all resize-none"
      />
    </div>
  );
}
