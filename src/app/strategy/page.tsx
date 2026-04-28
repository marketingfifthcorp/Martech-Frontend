"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Icon } from "@/components/ui/Icon";
import { useApi } from "@/hooks/useApi";

const PILLAR_ICONS = ["diamond", "eco", "communities", "star", "lightbulb", "campaign"];

const STATUS_STYLE: Record<string, string> = {
  INTERNAL_REVIEW: "bg-primary/10 text-primary",
  SENT_TO_CLIENT: "bg-tertiary/10 text-tertiary",
  CHANGES_REQUESTED: "bg-error/10 text-error",
  APPROVED: "bg-emerald-100 text-emerald-700",
  GENERATING: "bg-secondary/10 text-secondary",
  DRAFT: "bg-secondary/10 text-secondary",
};

function StrategyInner() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  const api = useApi();

  const [strategy, setStrategy] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) { setLoading(false); return; }
    (async () => {
      try {
        const [strategies, clientData] = await Promise.all([
          api.strategy.listByClient(clientId),
          api.clients.get(clientId),
        ]);
        setStrategy(strategies[0] || null);
        setClient(clientData);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  async function handleSendToClient() {
    if (!strategy) return;
    setSending(true);
    try {
      const updated = await api.strategy.sendToClient(strategy.id);
      setStrategy(updated);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <DashboardShell contextLabel="Strategy">
        <div className="p-12 flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </DashboardShell>
    );
  }

  if (!clientId || error) {
    return (
      <DashboardShell contextLabel="Strategy">
        <div className="p-12 text-center space-y-4">
          <p className="text-on-surface-variant">{error || "No client selected."}</p>
          <Link href="/dashboard" className="text-primary hover:underline text-sm">← Back to Dashboard</Link>
        </div>
      </DashboardShell>
    );
  }

  if (!strategy) {
    return (
      <DashboardShell contextLabel="Strategy">
        <div className="p-12 text-center space-y-4">
          <Icon name="auto_awesome" className="text-5xl text-primary/30 mx-auto block" />
          <p className="text-on-surface-variant">No strategy generated yet for this client.</p>
          <Link href={`/clients/${clientId}`} className="text-primary hover:underline text-sm">← Go to Client to generate</Link>
        </div>
      </DashboardShell>
    );
  }

  const pillars: any[] = Array.isArray(strategy.contentPillars) ? strategy.contentPillars : [];
  const audience: any = strategy.targetAudience || {};
  const keyMessages: string[] = Array.isArray(strategy.keyMessages) ? strategy.keyMessages : [];
  const platformStrategy: Record<string, any> = strategy.platformStrategy || {};
  const statusStyle = STATUS_STYLE[strategy.status] || "bg-secondary/10 text-secondary";

  return (
    <DashboardShell contextLabel={client?.name || "Strategy"}>
      <div className="max-w-[1200px] mx-auto px-16 py-12">

        {/* Header */}
        <section className="flex justify-between items-start mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="uppercase tracking-[0.2em] text-on-surface-variant font-semibold text-[11px] mb-4 block">
              {client?.industry || "Marketing Strategy"}
            </span>
            <h1 className="text-6xl font-headline font-extrabold text-primary tracking-tighter mb-8 leading-tight">
              {client?.name}
            </h1>
            <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Icon name="auto_awesome" className="text-primary-fixed-dim text-4xl opacity-50" />
              </div>
              <p className="text-xl font-body text-on-surface-variant leading-relaxed italic">
                &ldquo;{strategy.summary}&rdquo;
              </p>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${statusStyle}`}>
                {strategy.status.replace(/_/g, " ")}
              </span>
              {strategy.version > 1 && (
                <span className="text-[10px] text-on-surface-variant">v{strategy.version}</span>
              )}
            </div>
          </div>

          <div className="pt-4 shrink-0 flex flex-col gap-3 items-end">
            {strategy.status === "INTERNAL_REVIEW" && (
              <button
                onClick={handleSendToClient}
                disabled={sending}
                className="group flex items-center gap-3 bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-md shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
              >
                {sending ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Icon name="send" />
                )}
                <span className="font-headline font-bold tracking-widest uppercase text-xs">
                  {sending ? "Sending…" : "Send to Client"}
                </span>
              </button>
            )}
            {strategy.status === "APPROVED" && (
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-6 py-3 rounded-md">
                <Icon name="check_circle" />
                <span className="font-headline font-bold text-xs uppercase tracking-widest">Approved</span>
              </div>
            )}
            {strategy.status === "SENT_TO_CLIENT" && (
              <div className="flex items-center gap-2 text-tertiary bg-tertiary/10 px-6 py-3 rounded-md">
                <Icon name="schedule_send" />
                <span className="font-headline font-bold text-xs uppercase tracking-widest">Awaiting Client</span>
              </div>
            )}
            <Link href={`/clients/${clientId}`} className="text-primary text-xs font-semibold hover:underline">
              ← Back to Client
            </Link>
          </div>
        </section>

        {/* Strategic Pillars */}
        {pillars.length > 0 && (
          <section className="mb-24">
            <div className="flex items-baseline gap-4 mb-10">
              <h2 className="text-3xl font-headline font-bold tracking-tight text-primary">Strategic Pillars</h2>
              <div className="h-px flex-grow bg-outline-variant/30" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pillars.map((p: any, i: number) => (
                <div key={p.name} className="bg-surface-container-lowest p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 rounded-full bg-primary-fixed/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon name={PILLAR_ICONS[i % PILLAR_ICONS.length]} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-headline font-bold mb-2">{p.name}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{p.description}</p>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-semibold">
                    <span className="text-on-surface-variant">{p.postsPerMonth} posts/mo</span>
                    <span className="text-primary truncate max-w-[60%] text-right">{p.rationale}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Audience & Messaging */}
        <section className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            {audience.demographics && (
              <div>
                <h3 className="text-sm uppercase tracking-[0.3em] text-stone-400 mb-4">Target Persona</h3>
                <p className="text-2xl font-headline font-light text-on-surface leading-tight mb-4">
                  {audience.demographics}
                </p>
                {audience.psychographics && (
                  <p className="text-on-surface-variant text-sm leading-relaxed italic">{audience.psychographics}</p>
                )}
              </div>
            )}

            {(audience.painPoints?.length > 0 || audience.desirePoints?.length > 0) && (
              <div className="grid grid-cols-2 gap-6">
                {audience.painPoints?.length > 0 && (
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-3">Pain Points</h4>
                    <ul className="space-y-2">
                      {audience.painPoints.map((pt: string) => (
                        <li key={pt} className="flex items-start gap-2 text-xs text-on-surface-variant">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-1.5 shrink-0" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {audience.desirePoints?.length > 0 && (
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-3">Desire Points</h4>
                    <ul className="space-y-2">
                      {audience.desirePoints.map((pt: string) => (
                        <li key={pt} className="flex items-start gap-2 text-xs text-on-surface-variant">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-8">
            {strategy.toneRecommendation && (
              <div className="flex items-start gap-4">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                <div>
                  <h4 className="font-headline font-bold text-sm uppercase tracking-wider">Voice &amp; Tone</h4>
                  <p className="text-on-surface-variant text-sm mt-1 italic">{strategy.toneRecommendation}</p>
                </div>
              </div>
            )}
            {strategy.messagingDirection && (
              <div className="flex items-start gap-4">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                <div>
                  <h4 className="font-headline font-bold text-sm uppercase tracking-wider">Messaging Direction</h4>
                  <p className="text-on-surface-variant text-sm mt-1">{strategy.messagingDirection}</p>
                </div>
              </div>
            )}
            {keyMessages.length > 0 && (
              <div className="flex items-start gap-4">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                <div>
                  <h4 className="font-headline font-bold text-sm uppercase tracking-wider mb-3">Key Messages</h4>
                  <ul className="space-y-2">
                    {keyMessages.map((msg: string, i: number) => (
                      <li key={i} className="text-sm text-on-surface-variant italic">&ldquo;{msg}&rdquo;</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Platform Strategy */}
        {Object.keys(platformStrategy).length > 0 && (
          <section className="mb-24">
            <div className="flex items-baseline gap-4 mb-10">
              <h2 className="text-3xl font-headline font-bold tracking-tight text-primary">Platform Strategy</h2>
              <div className="h-px flex-grow bg-outline-variant/30" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(platformStrategy).map(([platform, data]: [string, any]) => (
                <div key={platform} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
                  <h3 className="font-headline font-bold capitalize mb-4 text-primary">{platform}</h3>
                  <div className="space-y-3 text-sm">
                    {data.format?.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {data.format.map((f: string) => (
                          <span key={f} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-wide">{f}</span>
                        ))}
                      </div>
                    )}
                    {data.contentMix && (
                      <p className="text-on-surface-variant leading-relaxed">{data.contentMix}</p>
                    )}
                    {data.bestTimes?.length > 0 && (
                      <div className="flex items-center gap-2 text-[10px] text-on-surface-variant uppercase tracking-widest">
                        <Icon name="schedule" className="text-sm" />
                        {data.bestTimes.join(", ")}
                      </div>
                    )}
                    {data.frequency && (
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{data.frequency} posts/mo</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </DashboardShell>
  );
}

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface">
    <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

export default function StrategyPage() {
  return <Suspense fallback={<Spinner />}><StrategyInner /></Suspense>;
}
