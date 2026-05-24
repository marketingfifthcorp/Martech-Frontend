"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Icon } from "@/components/ui/Icon";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/components/ui/Toast";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const STATUS_COLOR: Record<string, string> = {
  ONBOARDING:          "bg-secondary/10 text-secondary",
  BRIEF_UPLOADED:      "bg-secondary/10 text-secondary",
  STRATEGY_PENDING:    "bg-primary/10 text-primary",
  STRATEGY_IN_REVIEW:  "bg-primary/10 text-primary",
  STRATEGY_SENT:       "bg-tertiary/10 text-tertiary",
  STRATEGY_APPROVED:   "bg-emerald-100 text-emerald-700",
  CALENDAR_PENDING:    "bg-primary/10 text-primary",
  ACTIVE:              "bg-emerald-100 text-emerald-700",
  PAUSED:              "bg-secondary/10 text-secondary",
};

const PROJECT_STATUS_COLOR: Record<string, string> = {
  PLANNING:            "bg-secondary/10 text-secondary",
  CALENDAR_GENERATING: "bg-primary/10 text-primary",
  CALENDAR_READY:      "bg-primary/10 text-primary",
  IN_DESIGN:           "bg-secondary/10 text-secondary",
  IN_REVIEW:           "bg-tertiary/10 text-tertiary",
  APPROVED:            "bg-emerald-100 text-emerald-700",
  PUBLISHING:          "bg-primary/10 text-primary",
  COMPLETED:           "bg-emerald-100 text-emerald-700",
};

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const api     = useApi();
  const toast   = useToast();

  const [client,             setClient]             = useState<any>(null);
  const [loading,            setLoading]            = useState(true);
  const [generatingStrategy, setGeneratingStrategy] = useState(false);
  const [sendingStrategy,    setSendingStrategy]    = useState(false);

  // Campaign modal
  const now = new Date();
  const defaultMonth = now.getMonth() + 2 > 12 ? 1 : now.getMonth() + 2; // next month
  const defaultYear  = now.getMonth() + 2 > 12 ? now.getFullYear() + 1 : now.getFullYear();

  const [showModal,       setShowModal]       = useState(false);
  const [campaignMonth,   setCampaignMonth]   = useState(defaultMonth);
  const [campaignYear,    setCampaignYear]    = useState(defaultYear);
  const [creatingCampaign, setCreatingCampaign] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.clients.get(id);
        setClient(data);
      } catch {
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const latestBrief    = client?.briefs?.[0];
  const latestStrategy = client?.briefs?.[0]?.strategies?.[0];
  const strategyApproved = latestStrategy?.status === "APPROVED";

  async function handleGenerateStrategy() {
    if (!latestBrief) return;
    setGeneratingStrategy(true);
    try {
      await api.strategy.generate(latestBrief.id);
      const refreshed = await api.clients.get(id);
      setClient(refreshed);
    } catch (e: any) {
      toast.error("Generation failed", e.message);
    } finally {
      setGeneratingStrategy(false);
    }
  }

  async function handleSendToClient() {
    if (!latestStrategy) return;
    setSendingStrategy(true);
    try {
      await api.strategy.sendToClient(latestStrategy.id);
      const refreshed = await api.clients.get(id);
      setClient(refreshed);
    } catch (e: any) {
      toast.error("Failed to send", e.message);
    } finally {
      setSendingStrategy(false);
    }
  }

  async function handleCreateCampaign() {
    if (!latestStrategy) return;
    setCreatingCampaign(true);
    try {
      const title = `${MONTH_NAMES[campaignMonth - 1]} ${campaignYear} Campaign`;
      const project = await api.projects.create({
        clientId:   id,
        strategyId: latestStrategy.id,
        title,
        month:      campaignMonth,
        year:       campaignYear,
      });
      toast.success("Campaign created", `Redirecting to ${title}…`);
      router.push(`/projects/${project.id}`);
    } catch (e: any) {
      toast.error("Failed to create campaign", e.message);
    } finally {
      setCreatingCampaign(false);
      setShowModal(false);
    }
  }

  if (loading) {
    return (
      <DashboardShell contextLabel="Loading...">
        <div className="p-12 flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </DashboardShell>
    );
  }

  if (!client) return null;

  const statusColor = STATUS_COLOR[client.status] || "bg-secondary/10 text-secondary";
  const yearOptions = [now.getFullYear(), now.getFullYear() + 1];

  return (
    <DashboardShell contextLabel={client.name}>
      <div className="p-8 md:p-12 max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-8">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <Icon name="chevron_right" className="text-xs" />
          <span className="text-on-surface font-semibold">{client.name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-headline font-bold text-2xl">
              {client.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">
                  {client.name}
                </h1>
                <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${statusColor}`}>
                  {client.status.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-on-surface-variant text-sm">
                {client.industry || client.brand || "—"} · {client.platforms?.join(", ")}
              </p>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link
              href={`/clients/${id}/brief`}
              className="flex items-center gap-2 px-5 py-2.5 border border-outline-variant/30 text-on-surface rounded-md text-sm font-semibold hover:bg-surface-container-low transition-colors"
            >
              <Icon name="upload_file" className="text-sm" />
              {latestBrief ? "Update Brief" : "Upload Brief"}
            </Link>

            {latestBrief && !latestStrategy && (
              <button
                onClick={handleGenerateStrategy}
                disabled={generatingStrategy}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-md text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60"
              >
                {generatingStrategy ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</>
                ) : (
                  <><Icon name="auto_awesome" className="text-sm" /> Generate Strategy</>
                )}
              </button>
            )}

            {latestStrategy?.status === "INTERNAL_REVIEW" && (
              <button
                onClick={handleSendToClient}
                disabled={sendingStrategy}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-md text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60"
              >
                {sendingStrategy ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                ) : (
                  <><Icon name="send" className="text-sm" /> Send to Client</>
                )}
              </button>
            )}

            {strategyApproved && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-md text-sm font-semibold hover:opacity-90 transition-all"
              >
                <Icon name="calendar_add_on" className="text-sm" />
                New Monthly Campaign
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Info */}
          <div className="space-y-6">
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 space-y-5">
              <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant">
                Client Info
              </h3>
              {[
                { label: "Contact", value: client.contactName },
                { label: "Email",   value: client.contactEmail },
                { label: "Phone",   value: client.contactPhone },
                { label: "Website", value: client.websiteUrl },
                { label: "Package", value: client.package },
                { label: "Frequency", value: client.postingFrequency ? `${client.postingFrequency} posts/mo` : null },
              ]
                .filter((f) => f.value)
                .map((f) => (
                  <div key={f.label} className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">{f.label}</span>
                    <span className="font-medium text-on-surface text-right max-w-[60%] break-words">{f.value}</span>
                  </div>
                ))}
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10">
              <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant mb-4">
                Platforms
              </h3>
              <div className="flex flex-wrap gap-2">
                {(client.platforms || []).map((p: string) => (
                  <span key={p} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wide">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Workflow */}
          <div className="lg:col-span-2 space-y-6">

            {/* Brief */}
            <div className={`rounded-2xl p-6 border ${latestBrief ? "bg-surface-container-lowest border-outline-variant/10" : "border-2 border-dashed border-outline-variant/30"}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-headline font-bold">Brief</h3>
                {latestBrief ? (
                  <span className="text-[10px] uppercase tracking-widest font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">Uploaded</span>
                ) : (
                  <span className="text-[10px] uppercase tracking-widest font-bold bg-secondary/10 text-secondary px-3 py-1 rounded-full">Missing</span>
                )}
              </div>
              {latestBrief ? (
                <div className="text-sm text-on-surface-variant space-y-1">
                  {latestBrief.briefFileName && <p>📎 {latestBrief.briefFileName}</p>}
                  {latestBrief.campaignGoals && <p className="line-clamp-2">{latestBrief.campaignGoals}</p>}
                  <Link href={`/clients/${id}/brief`} className="text-primary text-xs hover:underline inline-block mt-2">
                    Edit brief →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-on-surface-variant mb-3">No brief uploaded yet</p>
                  <Link href={`/clients/${id}/brief`} className="text-primary font-semibold text-sm hover:underline">
                    Upload brief →
                  </Link>
                </div>
              )}
            </div>

            {/* Strategy */}
            {latestBrief && (
              <div className={`rounded-2xl p-6 border ${latestStrategy ? "bg-surface-container-lowest border-outline-variant/10" : "border-2 border-dashed border-outline-variant/30"}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-headline font-bold">Strategy</h3>
                  {latestStrategy ? (
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${STATUS_COLOR[latestStrategy.status] || "bg-secondary/10 text-secondary"}`}>
                      {latestStrategy.status.replace(/_/g, " ")}
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest font-bold bg-secondary/10 text-secondary px-3 py-1 rounded-full">Not generated</span>
                  )}
                </div>
                {latestStrategy ? (
                  <div className="space-y-2">
                    {latestStrategy.summary && (
                      <p className="text-sm text-on-surface-variant line-clamp-3">{latestStrategy.summary}</p>
                    )}
                    <Link href={`/strategy?clientId=${id}`} className="text-primary text-xs hover:underline inline-block">
                      View full strategy →
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-on-surface-variant mb-3">Generate strategy from brief</p>
                    <button
                      onClick={handleGenerateStrategy}
                      disabled={generatingStrategy}
                      className="text-primary font-semibold text-sm hover:underline disabled:opacity-50"
                    >
                      {generatingStrategy ? "Generating..." : "Run strategy agent →"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Monthly Campaigns */}
            {strategyApproved && (
              <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline font-bold">Monthly Campaigns</h3>
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-1.5 text-primary text-xs font-bold hover:underline"
                  >
                    <Icon name="add" className="text-sm" /> New Campaign
                  </button>
                </div>

                {client.projects && client.projects.length > 0 ? (
                  <div className="space-y-3">
                    {client.projects.map((p: any) => (
                      <Link
                        key={p.id}
                        href={`/projects/${p.id}`}
                        className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Icon name="calendar_month" className="text-primary/50 text-sm" />
                          <span className="text-sm font-semibold text-on-surface">
                            {p.title || `${MONTH_NAMES[(p.month ?? 1) - 1]} ${p.year}`}
                          </span>
                        </div>
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${PROJECT_STATUS_COLOR[p.status] || "bg-secondary/10 text-secondary"}`}>
                          {p.status?.replace(/_/g, " ")}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-outline-variant/20 rounded-xl">
                    <Icon name="calendar_add_on" className="text-3xl text-primary/20 mb-3 block mx-auto" />
                    <p className="text-sm text-on-surface-variant mb-3">Strategy approved — ready to create the first campaign</p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="text-primary font-semibold text-sm hover:underline"
                    >
                      Create first campaign →
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── New Campaign Modal ───────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-8 border border-outline-variant/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-headline font-extrabold text-xl text-on-surface">New Monthly Campaign</h2>
                <p className="text-on-surface-variant text-sm mt-1">Select the month and year for this content calendar.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Month */}
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-2">Month</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {MONTH_NAMES.map((name, i) => (
                    <button
                      key={name}
                      onClick={() => setCampaignMonth(i + 1)}
                      className={`py-2 rounded-lg text-xs font-bold transition-colors ${
                        campaignMonth === i + 1
                          ? "bg-primary text-white"
                          : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      {name.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year */}
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-2">Year</label>
                <div className="flex flex-col gap-1.5">
                  {yearOptions.map((y) => (
                    <button
                      key={y}
                      onClick={() => setCampaignYear(y)}
                      className={`py-3 rounded-lg text-sm font-bold transition-colors ${
                        campaignYear === y
                          ? "bg-primary text-white"
                          : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl mb-6">
              <Icon name="calendar_month" className="text-primary" />
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Campaign title</p>
                <p className="font-headline font-bold text-on-surface">
                  {MONTH_NAMES[campaignMonth - 1]} {campaignYear} Campaign
                </p>
              </div>
            </div>

            <button
              onClick={handleCreateCampaign}
              disabled={creatingCampaign}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold rounded-xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-60"
            >
              {creatingCampaign ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
              ) : (
                <><Icon name="rocket_launch" /> Create Campaign</>
              )}
            </button>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
