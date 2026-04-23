"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useApi } from "@/hooks/useApi";

const PLATFORM_OPTIONS = [
  { name: "instagram", label: "Instagram", icon: "photo_camera" },
  { name: "linkedin", label: "LinkedIn", icon: "work" },
  { name: "x", label: "X (Twitter)", icon: "chat" },
  { name: "tiktok", label: "TikTok", icon: "music_note" },
  { name: "facebook", label: "Facebook", icon: "share" },
];

const STEPS = [
  { n: "01", title: "Client Info", sub: "Foundational Details" },
  { n: "02", title: "Platforms", sub: "Ecosystem Selection" },
  { n: "03", title: "Package", sub: "Scope & Goals" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const api = useApi();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    industry: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    websiteUrl: "",
    platforms: [] as string[],
    package: "",
    postingFrequency: 12,
    notes: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function togglePlatform(p: string) {
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(p)
        ? f.platforms.filter((x) => x !== p)
        : [...f.platforms, p],
    }));
  }

  async function handleSubmit() {
    if (step < STEPS.length - 1) { setStep((s) => s + 1); return; }

    setSaving(true);
    try {
      const client = await api.clients.create({
        name: form.name,
        brand: form.brand || undefined,
        industry: form.industry || undefined,
        contactName: form.contactName || undefined,
        contactEmail: form.contactEmail || undefined,
        contactPhone: form.contactPhone || undefined,
        websiteUrl: form.websiteUrl || undefined,
        platforms: form.platforms,
        package: form.package || undefined,
        postingFrequency: Number(form.postingFrequency),
        notes: form.notes || undefined,
      });
      router.push(`/clients/${client.id}/brief`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <nav className="fixed top-0 w-full flex justify-between items-center px-8 h-16 bg-white/80 glass-nav shadow-sm shadow-emerald-900/5 z-50">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-xl font-bold tracking-tighter text-emerald-900 font-headline">
            Atelier Martech
          </Link>
          <span className="text-[10px] uppercase tracking-[0.25em] text-on-surface-variant font-semibold hidden md:block">
            New Client Onboarding
          </span>
        </div>
        <Link href="/dashboard" className="text-sm text-on-surface-variant hover:text-on-surface flex items-center gap-1">
          <Icon name="close" className="text-base" />
          Cancel
        </Link>
      </nav>

      <main className="pt-16 min-h-screen bg-surface flex flex-col">
        {/* Stepper */}
        <div className="px-8 py-8 border-b border-outline-variant/10 bg-surface-container-lowest">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-0">
              {STEPS.map((s, i) => (
                <div key={s.n} className="flex items-center gap-0 flex-1 last:flex-none">
                  <button
                    onClick={() => i < step && setStep(i)}
                    className={`flex items-center gap-3 group ${i < step ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                      ${i === step ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : i < step ? "bg-primary/20 text-primary"
                      : "bg-surface-container text-on-surface-variant/50"}`}>
                      {i < step ? <Icon name="check" className="text-sm" /> : s.n}
                    </div>
                    <div className="hidden sm:block">
                      <p className={`text-xs font-bold uppercase tracking-widest ${i === step ? "text-on-surface" : "text-on-surface-variant/50"}`}>
                        {s.title}
                      </p>
                      <p className="text-[10px] text-on-surface-variant/40">{s.sub}</p>
                    </div>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-px mx-4 ${i < step ? "bg-primary/30" : "bg-outline-variant/20"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-start justify-center p-8">
          <div className="w-full max-w-3xl">
            {/* Step 0 — Client Info */}
            {step === 0 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">
                    Client Information
                  </h2>
                  <p className="text-on-surface-variant mt-2">Core details for the client record.</p>
                </div>
                <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Client / Company Name *" value={form.name} onChange={set("name")} placeholder="Aria Residences" required />
                    <Field label="Brand Name" value={form.brand} onChange={set("brand")} placeholder="If different from company name" />
                    <Field label="Industry" value={form.industry} onChange={set("industry")} placeholder="Luxury Real Estate" />
                    <Field label="Website" value={form.websiteUrl} onChange={set("websiteUrl")} placeholder="https://client.com" />
                  </div>
                  <hr className="border-outline-variant/10" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Field label="Contact Name" value={form.contactName} onChange={set("contactName")} placeholder="Sarah Al-Rashid" />
                    <Field label="Contact Email" value={form.contactEmail} onChange={set("contactEmail")} placeholder="sarah@aria.ae" />
                    <Field label="Contact Phone" value={form.contactPhone} onChange={set("contactPhone")} placeholder="+971 50 123 4567" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 — Platforms */}
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">
                    Platform Selection
                  </h2>
                  <p className="text-on-surface-variant mt-2">Select all platforms for this client&apos;s strategy.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {PLATFORM_OPTIONS.map((p) => {
                    const active = form.platforms.includes(p.name);
                    return (
                      <button
                        key={p.name}
                        onClick={() => togglePlatform(p.name)}
                        className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left
                          ${active ? "border-primary bg-primary/5" : "border-outline-variant/20 hover:border-outline-variant/50"}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? "bg-primary text-white" : "bg-surface-container text-on-surface-variant"}`}>
                          <Icon name={p.icon} />
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${active ? "text-primary" : "text-on-surface"}`}>{p.label}</p>
                          {active && <p className="text-[10px] text-primary/70 font-bold uppercase tracking-wider">Selected</p>}
                        </div>
                        {active && <Icon name="check_circle" className="text-primary ml-auto" />}
                      </button>
                    );
                  })}
                </div>
                {form.platforms.length === 0 && (
                  <p className="text-sm text-tertiary flex items-center gap-2">
                    <Icon name="info" className="text-sm" />
                    Select at least one platform
                  </p>
                )}
              </div>
            )}

            {/* Step 2 — Package */}
            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">
                    Package & Scope
                  </h2>
                  <p className="text-on-surface-variant mt-2">Define the service scope for this client.</p>
                </div>
                <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[11px] uppercase tracking-widest font-semibold text-on-surface-variant block mb-2">
                        Package
                      </label>
                      <select
                        value={form.package}
                        onChange={set("package")}
                        className="w-full px-4 py-3 bg-surface-container-low rounded-md text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      >
                        <option value="">Select package</option>
                        <option value="starter">Starter — 12 posts/mo</option>
                        <option value="growth">Growth — 24 posts/mo</option>
                        <option value="scale">Scale — 48 posts/mo</option>
                        <option value="enterprise">Enterprise — Custom</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-widest font-semibold text-on-surface-variant block mb-2">
                        Posts Per Month
                      </label>
                      <div className="flex gap-3">
                        {[12, 24, 48].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, postingFrequency: n }))}
                            className={`flex-1 py-3 rounded-lg border-2 font-headline font-bold text-lg transition-all
                              ${form.postingFrequency === n ? "border-primary bg-primary/5 text-primary" : "border-outline-variant/30 text-on-surface hover:border-primary/40"}`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-widest font-semibold text-on-surface-variant block mb-2">
                      Internal Notes (optional)
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={set("notes")}
                      rows={3}
                      placeholder="Any additional notes for the team..."
                      className="w-full px-4 py-3 bg-surface-container-low rounded-md text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-8 border-t border-outline-variant/10">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="text-sm text-on-surface-variant hover:text-on-surface disabled:opacity-0 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || (step === 1 && form.platforms.length === 0) || (step === 0 && !form.name)}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold text-sm rounded-md shadow-lg hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
                ) : step < STEPS.length - 1 ? (
                  <>Continue <Icon name="arrow_forward" className="text-sm" /></>
                ) : (
                  <>Create Client & Upload Brief <Icon name="arrow_forward" className="text-sm" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Field({ label, value, onChange, placeholder, required }: {
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-widest font-semibold text-on-surface-variant block mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 bg-surface-container-low rounded-md text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all"
      />
    </div>
  );
}
