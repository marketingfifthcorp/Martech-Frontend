"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useApi } from "@/hooks/useApi";

const STEP_LABELS = [
  "Client details", "Brand assets", "Ref. profiles",
  "Competitors", "Social channels", "Content plan", "Team & review",
];

const INDUSTRIES = ["Fintech / Finance", "SaaS / Tech", "E-commerce / DTC", "Health & Wellness", "Retail", "Real estate", "Other"];
const PLATFORM_OPTIONS = ["instagram", "linkedin", "facebook", "tiktok", "x"];

type AssetKey = "guidelines" | "logo" | "brandKit" | "creative";

const ASSET_CATEGORIES: { key: AssetKey; label: string; icon: string; accept: string; hint: string }[] = [
  { key: "guidelines", label: "Brand guidelines",        icon: "ti-file",    accept: ".pdf,.doc,.docx,.svg",          hint: "PDF · DOC · SVG" },
  { key: "logo",       label: "Logo files",              icon: "ti-photo",   accept: ".svg,.png,.ai,.eps",            hint: "SVG · PNG · AI · EPS" },
  { key: "brandKit",   label: "Brand kit / style guide", icon: "ti-palette", accept: ".pdf,.fig,.zip,.svg",           hint: "PDF · FIG · ZIP · SVG" },
  { key: "creative",   label: "Sample creative",         icon: "ti-movie",   accept: ".mp4,.jpg,.jpeg,.png,.gif,.svg", hint: "MP4 · JPG · PNG · GIF · SVG" },
];

export default function OnboardingPage() {
  const api = useApi();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Step 0 state
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [notes, setNotes] = useState("");

  // Step 4 state
  const [platforms, setPlatforms] = useState<string[]>(["instagram", "linkedin"]);

  // Step 5 state
  const [totalPosts, setTotalPosts] = useState(16);
  const [staticPosts, setStaticPosts] = useState(8);
  const [reelPosts, setReelPosts] = useState(5);
  const [carouselPosts, setCarouselPosts] = useState(3);

  // Step 6 state
  const [designType, setDesignType] = useState<"ai" | "human">("ai");

  // Competitors
  const [competitors, setCompetitors] = useState([
    { name: "Float", url: "https://float.com" },
    { name: "Fathom", url: "https://fathom.finance" },
  ]);

  // Refs
  const [refs, setRefs] = useState([{ platform: "LinkedIn", url: "" }]);

  // Brand assets (Step 1)
  const [brandAssets, setBrandAssets] = useState<Record<AssetKey, File[]>>({
    guidelines: [], logo: [], brandKit: [], creative: [],
  });
  const [dragOver, setDragOver] = useState<AssetKey | null>(null);

  function addFiles(key: AssetKey, files: FileList | null) {
    if (!files?.length) return;
    setBrandAssets((prev) => ({ ...prev, [key]: [...prev[key], ...Array.from(files)] }));
  }

  function removeFile(key: AssetKey, idx: number) {
    setBrandAssets((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) }));
  }

  async function handleFinish() {
    setSaving(true);
    try {
      const client = await api.clients.create({
        name, industry, contactName, contactEmail, websiteUrl, notes,
        platforms, postingFrequency: totalPosts,
      });

      const allAssets = Object.values(brandAssets).flat();
      if (allAssets.length > 0) {
        try {
          const brief = await api.briefs.create({ clientId: client.id });
          await Promise.all(
            (Object.entries(brandAssets) as [AssetKey, File[]][]).flatMap(([, files]) =>
              files.map((file) => api.briefs.uploadBrandAsset(brief.id, file))
            )
          );
        } catch {
          // Non-fatal — user can re-upload from the client page
        }
      }

      router.push(`/clients/${client.id}`);
    } catch {
      setSaving(false);
    }
  }

  const stepDot = (n: number) => {
    const state = n < step ? "done" : n === step ? "act" : "idle";
    return `st ${state}`;
  };

  return (
    <DashboardShell title="New client" breadcrumb={<span>Clients / <span style={{ color: "var(--green)" }}>New client</span></span>}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

        {/* Step progress bar */}
        <div className="sw-bar">
          <div className="sr" style={{ overflowX: "auto" }}>
            {STEP_LABELS.map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEP_LABELS.length - 1 ? 1 : "none" }}>
                <div className={stepDot(i)} style={{ cursor: i < step ? "pointer" : "default" }} onClick={() => i < step && setStep(i)}>
                  <div className="sn">{i < step ? <i className="ti ti-check" style={{ fontSize: 10 }} /> : i + 1}</div>
                  <div className="sl">{label}</div>
                </div>
                {i < STEP_LABELS.length - 1 && <div className="sli" />}
              </div>
            ))}
          </div>
        </div>

        {/* Tab labels */}
        <div className="stabs">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className={`stab${step === i ? " on" : ""}`} onClick={() => setStep(i)} style={{ cursor: "pointer" }}>
              {i + 1}. {label}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>

          {/* Step 0: Client details */}
          {step === 0 && (
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div className="sa">
                <div className="cd">
                  <div className="cdt">
                    <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <i className="ti ti-building" style={{ color: "var(--green)", fontSize: 13 }} />
                      Client details
                    </span>
                    <span className="sbg">2.1</span>
                  </div>
                  <div className="fg">
                    <div className="fl"><label>Business name</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Orbit Finance" /></div>
                    <div className="fl"><label>Industry</label><select value={industry} onChange={(e) => setIndustry(e.target.value)}>{INDUSTRIES.map((i) => <option key={i}>{i}</option>)}</select></div>
                    <div className="fl"><label>POC name</label><input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Sara Ahmed" /></div>
                    <div className="fl"><label>POC email</label><input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="sara@orbitfinance.io" /></div>
                    <div className="fl"><label>Website</label><input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://orbitfinance.io" /></div>
                    <div className="fl fw"><label>Brand description / AI notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe the brand for the AI strategy agent…" /></div>
                  </div>
                </div>
              </div>
              <div className="abar">
                <button className="gb gbg"><i className="ti ti-device-floppy" /> Save draft</button>
                <button className="gb gbp" onClick={() => setStep(1)} disabled={!name}><i className="ti ti-arrow-right" /> Save &amp; next</button>
              </div>
            </div>
          )}

          {/* Step 1: Brand assets */}
          {step === 1 && (
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div className="sa">
                <div className="cd">
                  <div className="cdt">
                    <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <i className="ti ti-file-upload" style={{ color: "var(--green)", fontSize: 13 }} />
                      Brand assets
                    </span>
                    <span className="sbg">2.2</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {ASSET_CATEGORIES.map(({ key, label, icon, accept, hint }) => {
                      const files = brandAssets[key];
                      const isOver = dragOver === key;
                      return (
                        <div key={key} style={{ display: "flex", flexDirection: "column" }}>
                          {/* Plain div label — avoids .fl label CSS interference */}
                          <div style={{ fontSize: 9, color: "var(--t4)", letterSpacing: ".07em", marginBottom: 5, textTransform: "uppercase", fontWeight: 400 }}>{label}</div>

                          <input
                            id={`asset-${key}`}
                            type="file"
                            multiple
                            accept={accept}
                            onChange={(e) => { addFiles(key, e.target.files); e.target.value = ""; }}
                            style={{ display: "none" }}
                          />

                          {/* label[htmlFor] activates the input natively — no .fl CSS to override */}
                          <label htmlFor={`asset-${key}`} style={{ display: "block", cursor: "pointer", flex: 1 }}>
                            <div
                              className="ub"
                              onDragOver={(e) => { e.preventDefault(); setDragOver(key); }}
                              onDragLeave={() => setDragOver(null)}
                              onDrop={(e) => { e.preventDefault(); setDragOver(null); addFiles(key, e.dataTransfer.files); }}
                              style={{
                                borderColor: isOver ? "var(--green)" : undefined,
                                background: isOver ? "var(--gb)" : undefined,
                                transition: "border-color .15s, background .15s",
                              }}
                            >
                              <div className="ubi"><i className={`ti ${isOver ? "ti-download" : icon}`} /></div>
                              <div className="ubt">{isOver ? "Drop to upload" : label}</div>
                              <div className="ubs">{isOver ? "Release to add files" : `Click or drag & drop · ${hint}`}</div>
                            </div>
                          </label>

                          {files.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 6 }}>
                              {files.map((file, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "var(--in)", border: "1px solid var(--in-b)", borderRadius: 7 }}>
                                  <i className="ti ti-paperclip" style={{ fontSize: 11, color: "var(--green)", flexShrink: 0 }} />
                                  <span style={{ fontSize: 11, color: "var(--t1)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</span>
                                  <span style={{ fontSize: 10, color: "var(--t4)", flexShrink: 0 }}>
                                    {file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(0)} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                                  </span>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); removeFile(key, i); }}
                                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--t4)", padding: 0, lineHeight: 1, flexShrink: 0 }}
                                  >
                                    <i className="ti ti-x" style={{ fontSize: 11 }} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="abar">
                <button className="gb gbg" onClick={() => setStep(0)}><i className="ti ti-arrow-left" /> Back</button>
                <button className="gb gbp" onClick={() => setStep(2)}><i className="ti ti-arrow-right" /> Save &amp; next</button>
              </div>
            </div>
          )}

          {/* Step 2: Reference profiles */}
          {step === 2 && (
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div className="sa">
                <div className="cd">
                  <div className="cdt"><span style={{ display: "flex", alignItems: "center", gap: 7 }}><i className="ti ti-brand-instagram" style={{ color: "var(--green)", fontSize: 13 }} />Reference social profiles</span><span className="sbg">2.3</span></div>
                  <div className="ib" style={{ marginBottom: 12 }}>
                    <i className="ti ti-info-circle" style={{ color: "var(--green)", fontSize: 11, verticalAlign: -1, marginRight: 4 }} />
                    Add profiles the AI should reference for content style and tone.
                  </div>
                  {refs.map((ref, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7 }}>
                      <select className="fs" value={ref.platform} onChange={(e) => setRefs(refs.map((r, j) => j === i ? { ...r, platform: e.target.value } : r))}>
                        {["Instagram", "LinkedIn", "TikTok", "X / Twitter", "Facebook"].map((p) => <option key={p}>{p}</option>)}
                      </select>
                      <input style={{ flex: 1, background: "var(--fi)", border: "1px solid var(--fi-b)", borderRadius: 8, padding: "8px 11px", fontSize: 12, color: "var(--t1)", outline: "none", fontFamily: "Inter,system-ui" }} placeholder="https://…" value={ref.url} onChange={(e) => setRefs(refs.map((r, j) => j === i ? { ...r, url: e.target.value } : r))} />
                      <button className="gb gbr gbs" onClick={() => setRefs(refs.filter((_, j) => j !== i))}><i className="ti ti-x" /></button>
                    </div>
                  ))}
                  <button className="gb gbg" style={{ marginTop: 6 }} onClick={() => setRefs([...refs, { platform: "Instagram", url: "" }])}><i className="ti ti-plus" /> Add reference profile</button>
                </div>
              </div>
              <div className="abar">
                <button className="gb gbg" onClick={() => setStep(1)}><i className="ti ti-arrow-left" /> Back</button>
                <button className="gb gbp" onClick={() => setStep(3)}><i className="ti ti-arrow-right" /> Save &amp; next</button>
              </div>
            </div>
          )}

          {/* Step 3: Competitors */}
          {step === 3 && (
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div className="sa">
                <div className="cd">
                  <div className="cdt"><span style={{ display: "flex", alignItems: "center", gap: 7 }}><i className="ti ti-crosshair" style={{ color: "var(--green)", fontSize: 13 }} />Competitors</span><span className="sbg">2.4</span></div>
                  <div className="ib" style={{ marginBottom: 12 }}>
                    <i className="ti ti-info-circle" style={{ color: "var(--green)", fontSize: 11, verticalAlign: -1, marginRight: 4 }} />
                    The strategy agent will research each competitor to find content gaps.
                  </div>
                  {competitors.map((c, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: "var(--t4)", width: 14, textAlign: "center", flexShrink: 0 }}>{i + 1}</span>
                      <input style={{ width: 150, flexShrink: 0, background: "var(--fi)", border: "1px solid var(--fi-b)", borderRadius: 8, padding: "8px 11px", fontSize: 12, color: "var(--t1)", outline: "none", fontFamily: "Inter,system-ui" }} placeholder="Competitor name" value={c.name} onChange={(e) => setCompetitors(competitors.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                      <input style={{ flex: 1, background: "var(--fi)", border: "1px solid var(--fi-b)", borderRadius: 8, padding: "8px 11px", fontSize: 12, color: "var(--t1)", outline: "none", fontFamily: "Inter,system-ui" }} placeholder="https://…" value={c.url} onChange={(e) => setCompetitors(competitors.map((x, j) => j === i ? { ...x, url: e.target.value } : x))} />
                      <button className="gb gbr gbs" onClick={() => setCompetitors(competitors.filter((_, j) => j !== i))}><i className="ti ti-x" /></button>
                    </div>
                  ))}
                  <button className="gb gbg" style={{ marginTop: 6 }} onClick={() => setCompetitors([...competitors, { name: "", url: "" }])}><i className="ti ti-plus" /> Add competitor</button>
                </div>
              </div>
              <div className="abar">
                <button className="gb gbg" onClick={() => setStep(2)}><i className="ti ti-arrow-left" /> Back</button>
                <button className="gb gbp" onClick={() => setStep(4)}><i className="ti ti-arrow-right" /> Save &amp; next</button>
              </div>
            </div>
          )}

          {/* Step 4: Social channels */}
          {step === 4 && (
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div className="sa">
                <div className="cd">
                  <div className="cdt"><span style={{ display: "flex", alignItems: "center", gap: 7 }}><i className="ti ti-plug" style={{ color: "var(--green)", fontSize: 13 }} />Select platforms</span><span className="sbg">2.5</span></div>
                  <div className="ib" style={{ marginBottom: 14 }}>
                    <i className="ti ti-lock" style={{ color: "var(--green)", fontSize: 11, verticalAlign: -1, marginRight: 4 }} />
                    Select platforms to connect. OAuth flows are completed in Settings → Platforms after the client is created.
                  </div>
                  {[
                    { id: "instagram", label: "Instagram", icon: "ti-brand-instagram", iconColor: "#e1306c" },
                    { id: "facebook", label: "Facebook", icon: "ti-brand-facebook", iconColor: "#1877f2" },
                    { id: "linkedin", label: "LinkedIn", icon: "ti-brand-linkedin", iconColor: "#0077b5" },
                    { id: "tiktok", label: "TikTok", icon: "ti-brand-tiktok", iconColor: "#5dcaa5" },
                    { id: "x", label: "X (Twitter)", icon: "ti-brand-x", iconColor: "var(--t2)" },
                  ].map((p) => {
                    const active = platforms.includes(p.id);
                    return (
                      <div key={p.id} className={`chr${active ? " cn2" : ""}`} style={{ cursor: "pointer" }} onClick={() => setPlatforms(active ? platforms.filter((x) => x !== p.id) : [...platforms, p.id])}>
                        <div className="chi"><i className={`ti ${p.icon}`} style={{ fontSize: 16, color: p.iconColor }} /></div>
                        <div style={{ flex: 1 }}>
                          <div className="chn">{p.label}</div>
                          <div className="chd">{active ? "Selected — OAuth will be set up in settings" : "Not selected"}</div>
                        </div>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: active ? "var(--green)" : "var(--in)", border: `1px solid ${active ? "var(--gbb)" : "var(--in-b)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {active && <i className="ti ti-check" style={{ fontSize: 9, color: "#000" }} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="abar">
                <button className="gb gbg" onClick={() => setStep(3)}><i className="ti ti-arrow-left" /> Back</button>
                <button className="gb gbp" onClick={() => setStep(5)} disabled={platforms.length === 0}><i className="ti ti-arrow-right" /> Save &amp; next</button>
              </div>
            </div>
          )}

          {/* Step 5: Content plan */}
          {step === 5 && (
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div className="sa">
                <div className="cd">
                  <div className="cdt"><span style={{ display: "flex", alignItems: "center", gap: 7 }}><i className="ti ti-calendar" style={{ color: "var(--green)", fontSize: 13 }} />Monthly content plan</span><span className="sbg">2.6</span></div>
                  <div className="ib" style={{ marginBottom: 14 }}>
                    <i className="ti ti-info-circle" style={{ color: "var(--green)", fontSize: 11, verticalAlign: -1, marginRight: 4 }} />
                    Set total posts per month and how they split across formats.
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid var(--row-b)" }}>
                    <div style={{ fontSize: 12, color: "var(--t2)", fontWeight: 300 }}>Total posts per month</div>
                    <input type="number" value={totalPosts} min={1} max={120} onChange={(e) => setTotalPosts(+e.target.value)} style={{ width: 80, background: "var(--fi)", border: "1px solid var(--fi-b)", borderRadius: 8, padding: "8px 12px", fontSize: 18, color: "var(--t1)", outline: "none", textAlign: "center", fontWeight: 300, fontFamily: "Inter,system-ui" }} />
                  </div>
                  {[
                    { key: "static", label: "Static posts", icon: "ti-photo", iconColor: "var(--green)", value: staticPosts, setValue: setStaticPosts, color: "var(--green)" },
                    { key: "reel", label: "Reels / video", icon: "ti-player-play", iconColor: "var(--amber)", value: reelPosts, setValue: setReelPosts, color: "var(--amber)" },
                    { key: "carousel", label: "Carousels", icon: "ti-layout-grid", iconColor: "var(--blue)", value: carouselPosts, setValue: setCarouselPosts, color: "var(--blue)" },
                  ].map((f) => {
                    const pct = totalPosts > 0 ? Math.round(f.value / totalPosts * 100) : 0;
                    return (
                      <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--in)", border: "1px solid var(--in-b)", borderRadius: 10, marginBottom: 6 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: `${f.color}22`, border: `1px solid ${f.color}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <i className={`ti ${f.icon}`} style={{ color: f.iconColor, fontSize: 14 }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 300, color: "var(--t1)" }}>{f.label}</div>
                        </div>
                        <input type="number" value={f.value} min={0} onChange={(e) => f.setValue(+e.target.value)} style={{ width: 60, background: "var(--fi)", border: "1px solid var(--fi-b)", borderRadius: 6, padding: "5px 8px", fontSize: 12, color: "var(--t1)", outline: "none", textAlign: "center", fontFamily: "Inter,system-ui" }} />
                        <span style={{ fontSize: 11, color: "var(--t4)" }}>posts</span>
                        <div style={{ width: 60, height: 3, background: "var(--bar-tr)", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: f.color, borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 400, minWidth: 30, textAlign: "right", color: f.color }}>{pct}%</span>
                      </div>
                    );
                  })}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, padding: "9px 12px", background: "var(--in)", border: "1px solid var(--in-b)", borderRadius: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--t4)", fontWeight: 300 }}>Total allocated</span>
                    <span style={{ fontSize: 12, fontWeight: 400, color: (staticPosts + reelPosts + carouselPosts) === totalPosts ? "var(--green)" : "var(--amber)" }}>
                      {staticPosts + reelPosts + carouselPosts} / {totalPosts} posts
                    </span>
                  </div>
                </div>
              </div>
              <div className="abar">
                <button className="gb gbg" onClick={() => setStep(4)}><i className="ti ti-arrow-left" /> Back</button>
                <button className="gb gbp" onClick={() => setStep(6)}><i className="ti ti-arrow-right" /> Save &amp; next</button>
              </div>
            </div>
          )}

          {/* Step 6: Team & review */}
          {step === 6 && (
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div className="sa">
                <div className="cd">
                  <div className="cdt"><span style={{ display: "flex", alignItems: "center", gap: 7 }}><i className="ti ti-users" style={{ color: "var(--green)", fontSize: 13 }} />Team &amp; review</span><span className="sbg">2.7</span></div>
                  <div className="g2e" style={{ marginBottom: 12 }}>
                    <div className="ib">
                      <div className="slb" style={{ marginBottom: 8 }}>Client summary</div>
                      <div className="ir"><span className="irl">Business</span><span className="irv">{name || "—"}</span></div>
                      <div className="ir"><span className="irl">Industry</span><span className="irv">{industry}</span></div>
                      <div className="ir"><span className="irl">Channels</span><span className="irv">{platforms.join(", ")}</span></div>
                      <div className="ir"><span className="irl">Posts/mo</span><span className="irv g">{totalPosts}</span></div>
                    </div>
                    <div className="ib">
                      <div className="slb" style={{ marginBottom: 8 }}>Content plan</div>
                      <div className="ir"><span className="irl">Total posts</span><span className="irv g">{totalPosts} / month</span></div>
                      <div className="ir"><span className="irl">Static</span><span className="irv">{staticPosts}</span></div>
                      <div className="ir"><span className="irl">Reels</span><span className="irv">{reelPosts}</span></div>
                      <div className="ir"><span className="irl">Carousels</span><span className="irv">{carouselPosts}</span></div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div className="slb" style={{ marginBottom: 6 }}>Design team type</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[{ id: "ai" as const, label: "AI agents", sub: "Auto-generate" }, { id: "human" as const, label: "Human team", sub: "Manual upload" }].map((dt) => (
                        <div key={dt.id} onClick={() => setDesignType(dt.id)} style={{ flex: 1, border: `1px solid ${designType === dt.id ? "var(--gbb)" : "var(--in-b)"}`, borderRadius: 8, padding: "10px 12px", cursor: "pointer", background: designType === dt.id ? "var(--gb)" : "var(--in)", textAlign: "center" }}>
                          <div style={{ fontSize: 12, fontWeight: 300, color: designType === dt.id ? "var(--green)" : "var(--t2)" }}>{dt.label}</div>
                          <div style={{ fontSize: 10, color: "var(--t4)" }}>{dt.sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: "var(--gb)", border: "1px solid var(--gbb)", borderRadius: 12, padding: 18, textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 300, color: "var(--t1)", marginBottom: 5 }}>Ready to launch</div>
                    <div style={{ fontSize: 11, color: "var(--green)", marginBottom: 14, lineHeight: 1.6, fontWeight: 300 }}>All 7 steps complete. Saving will create the client and queue the strategy agent.</div>
                    <button
                      disabled={saving || !name}
                      onClick={handleFinish}
                      style={{ padding: "11px 24px", fontSize: 13, fontWeight: 400, borderRadius: 9, cursor: saving ? "not-allowed" : "pointer", background: "var(--green)", border: "none", color: "#000", display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "Inter,system-ui", opacity: (!name || saving) ? .6 : 1 }}
                    >
                      <i className="ti ti-rocket" style={{ fontSize: 14 }} />
                      {saving ? "Creating…" : "Save client & open dashboard"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="abar">
                <button className="gb gbg" onClick={() => setStep(5)}><i className="ti ti-arrow-left" /> Back</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
