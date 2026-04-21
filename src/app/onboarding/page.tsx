import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const STEPS = [
  { n: "01", title: "Client Info", sub: "Foundational Details", active: true },
  { n: "02", title: "Platforms", sub: "Ecosystem Selection", active: false },
  { n: "03", title: "Asset Vault", sub: "Briefs & Media", active: false },
];

const PLATFORMS = [
  { name: "Instagram", icon: "photo_camera", checked: true },
  { name: "LinkedIn", icon: "work", checked: false },
  { name: "X (Twitter)", icon: "close", checked: true },
];

export default function OnboardingPage() {
  return (
    <>
      <nav className="fixed top-0 w-full flex justify-between items-center px-8 h-16 bg-white/80 glass-nav shadow-sm shadow-emerald-900/5 z-50">
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-xl font-bold tracking-tighter text-emerald-900 font-headline"
          >
            Atelier Martech
          </Link>
          <div className="hidden md:flex gap-6 items-center">
            <Link
              href="/dashboard"
              className="font-headline tracking-tight font-semibold text-stone-500 hover:text-emerald-800 transition-colors"
            >
              Dashboard
            </Link>
            <a
              href="#"
              className="font-headline tracking-tight font-semibold text-emerald-900 border-b-2 border-emerald-900 pb-1"
            >
              Workspaces
            </a>
            <a
              href="#"
              className="font-headline tracking-tight font-semibold text-stone-500 hover:text-emerald-800 transition-colors"
            >
              Directory
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-emerald-50/50 transition-colors text-stone-600 font-medium text-sm">
            <span>Client Selector</span>
            <Icon name="expand_more" className="text-sm" />
          </button>
          <button className="text-stone-600 hover:bg-emerald-50/50 p-2 rounded-full transition-colors">
            <Icon name="notifications" />
          </button>
          <button className="text-stone-600 hover:bg-emerald-50/50 p-2 rounded-full transition-colors">
            <Icon name="settings" />
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="User avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsdO3Xo2LWo0HcVH28SunILsy7dZSPdtQKaselys2THa5TbW9grnhEXLNfaZtcAXT7dTUAa-sWpOlxZAPOPebzsrH397YoTLd5BdRW15A2VTzdF0dBIEekMmhGxxPAFkqG8bS_sbZNKYWI4dCtJuU3muon7VmQXqqxK4Wdr3_8eUY_9HWWQIsq2qIbfq-kkCmDzNiY-1nllxUtOchixBi24Y9UU2vqRlcWDeadzL4l3IdxXZIyjqp0Y4J4isUOB-sZbGB_0nkq4bE"
            />
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6 max-w-6xl mx-auto">
        <header className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="uppercase tracking-[0.2em] text-[10px] font-bold text-primary px-3 py-1 bg-primary/5 rounded-full">
              New Partnership
            </span>
          </div>
          <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-primary mb-4 leading-tight">
            Curating a New <br />
            <span className="text-stone-400">Client Identity.</span>
          </h1>
          <p className="text-on-surface-variant max-w-xl text-lg font-light leading-relaxed">
            Transform abstract vision into a tangible digital strategy. Follow
            our curated onboarding process to synchronize your agency&apos;s
            creative muscle with the client&apos;s brand DNA.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Stepper */}
          <aside className="lg:col-span-3 sticky top-32">
            <div className="space-y-10">
              {STEPS.map((step) => (
                <div
                  key={step.n}
                  className={`flex gap-4 items-center group ${step.active ? "" : "opacity-40"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step.active ? "bg-primary text-white" : "bg-surface-container-high text-on-surface"}`}
                  >
                    {step.n}
                  </div>
                  <div>
                    <p
                      className={`font-headline font-bold text-xs uppercase tracking-widest ${step.active ? "text-primary" : ""}`}
                    >
                      {step.title}
                    </p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      {step.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Form */}
          <div className="lg:col-span-9 space-y-20">
            <section className="bg-surface-container-lowest p-10 rounded-xl editorial-shadow">
              <div className="flex items-center gap-3 mb-8">
                <Icon name="corporate_fare" className="text-primary" />
                <h2 className="font-headline text-2xl font-bold tracking-tight">
                  Client Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block uppercase tracking-widest text-[10px] font-bold text-on-surface-variant">
                    Legal Entity Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., L'Artiste Paris"
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-stone-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block uppercase tracking-widest text-[10px] font-bold text-on-surface-variant">
                    Industry Vertical
                  </label>
                  <select
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                    defaultValue="Luxury Fashion"
                  >
                    <option>Luxury Fashion</option>
                    <option>High-End Real Estate</option>
                    <option>Hospitality &amp; Travel</option>
                    <option>Fine Jewelry</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block uppercase tracking-widest text-[10px] font-bold text-on-surface-variant">
                    Primary Brand Link
                  </label>
                  <div className="flex items-center bg-surface-container-low rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:bg-surface-container-lowest transition-all">
                    <span className="pl-4 text-stone-400 text-sm">https://</span>
                    <input
                      type="text"
                      placeholder="www.brandname.com"
                      className="w-full bg-transparent border-none px-2 py-3 focus:ring-0 placeholder:text-stone-400"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-surface-container-lowest p-10 rounded-xl editorial-shadow">
              <div className="flex items-center gap-3 mb-8">
                <Icon name="hub" className="text-primary" />
                <h2 className="font-headline text-2xl font-bold tracking-tight">
                  Platform Selection
                </h2>
              </div>
              <p className="text-sm text-on-surface-variant mb-6">
                Select the primary channels for the upcoming campaign cycle.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PLATFORMS.map((p) => (
                  <label
                    key={p.name}
                    className="relative flex flex-col items-center justify-center p-6 border-2 border-surface-container rounded-xl cursor-pointer hover:border-primary/20 transition-all group has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <input
                      defaultChecked={p.checked}
                      type="checkbox"
                      className="absolute top-4 right-4 text-primary focus:ring-primary rounded"
                    />
                    <Icon
                      name={p.icon}
                      className="text-3xl mb-3 text-stone-400 group-hover:text-primary transition-colors"
                    />
                    <span className="font-headline font-bold text-sm">
                      {p.name}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="bg-surface-container-lowest p-10 rounded-xl editorial-shadow">
              <div className="flex items-center gap-3 mb-8">
                <Icon name="cloud_upload" className="text-primary" />
                <h2 className="font-headline text-2xl font-bold tracking-tight">
                  Asset Collection
                </h2>
              </div>
              <div className="border-2 border-dashed border-outline-variant rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-4 hover:bg-surface-container-low/50 transition-colors cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="upload_file" className="text-primary text-3xl" />
                </div>
                <div>
                  <p className="font-headline font-bold text-lg">
                    Drag &amp; Drop Brand Assets
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    Upload PDF briefs, high-res logos, or mood boards (Max 50MB)
                  </p>
                </div>
                <button className="mt-4 px-6 py-2 border border-outline-variant rounded-full text-xs font-bold uppercase tracking-widest hover:bg-on-surface hover:text-white transition-all">
                  Browse Files
                </button>
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-surface-container rounded-lg">
                  <Icon name="picture_as_pdf" className="text-primary" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold truncate">
                      Q4_Marketing_Brief.pdf
                    </p>
                    <p className="text-[10px] text-on-surface-variant">
                      2.4 MB • Uploaded
                    </p>
                  </div>
                  <Icon name="delete" className="text-sm text-error cursor-pointer" />
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-container rounded-lg">
                  <Icon name="image" className="text-primary" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold truncate">
                      Brand_Colors_Final.png
                    </p>
                    <p className="text-[10px] text-on-surface-variant">
                      1.1 MB • Uploaded
                    </p>
                  </div>
                  <Icon name="delete" className="text-sm text-error cursor-pointer" />
                </div>
              </div>
            </section>

            <footer className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-outline-variant/30">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Icon name="auto_awesome" className="text-lg" />
                <p className="text-sm font-medium italic">
                  AI will analyze assets to draft a strategy proposal.
                </p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button className="px-8 py-4 text-stone-500 font-headline font-bold text-sm hover:text-primary transition-colors">
                  Save as Draft
                </button>
                <Link
                  href="/strategy"
                  className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-md shadow-lg shadow-emerald-900/20 font-headline font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Generate AI Strategy</span>
                  <Icon name="rocket_launch" className="text-lg" />
                </Link>
              </div>
            </footer>
          </div>
        </div>

        {/* Decorative */}
        <div className="fixed right-[-100px] top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden xl:block">
          <h2 className="font-headline text-[12rem] font-black text-stone-900 tracking-tighter rotate-90 transform origin-center">
            ATELIER
          </h2>
        </div>
      </main>
    </>
  );
}
