import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function PostReviewPage() {
  return (
    <>
      <header className="fixed top-0 w-full flex justify-between items-center px-8 h-16 bg-white/80 glass-nav z-50 shadow-sm shadow-emerald-900/5">
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-xl font-bold tracking-tighter text-emerald-900 font-headline"
          >
            Atelier Martech
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
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
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-container-low text-on-surface-variant text-xs font-medium">
            <Icon name="group" className="text-[18px]" />
            <span>Creative Atelier</span>
          </div>
          <button className="p-2 text-stone-500 hover:bg-emerald-50/50 rounded-full transition-colors">
            <Icon name="notifications" />
          </button>
          <button className="p-2 text-stone-500 hover:bg-emerald-50/50 rounded-full transition-colors">
            <Icon name="settings" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="User"
            className="w-8 h-8 rounded-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeynhl0irIaQhfuFZJT_kHD6PAxjjC5mt6sgWyyS7MuHw1w057EfdE9n_tONUP2o3TmhZfACvWtj1wmdZ4PCjmaTIHugDbnFA4RnO0zDl3O2r9jwKZMtII8OKUkl-a4oF3rTEkYypLouX4NNXIHH1nx4MrpYc_LG5EhBuu6GnT7f7O4srufZho1A6DDGIwR230RXQlRVwF849vN2J8viO5RD0iKvbH3BWZWVoGrtY7mnP5AUpNFjYFcOahoJXbVZm-_UjYSIzA2NQ"
          />
        </div>
      </header>

      <main className="pt-16 min-h-screen flex flex-col lg:flex-row">
        {/* Preview */}
        <section className="flex-1 bg-surface-container-low p-6 md:p-12 flex items-center justify-center relative overflow-hidden min-h-[500px]">
          <div className="relative w-full max-w-4xl aspect-[4/5] md:aspect-video bg-surface-container-lowest shadow-2xl shadow-emerald-900/10 rounded-xl overflow-hidden group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Asset preview"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0vBmt9lX2f1UMEMEruAHCBTEszfiRmljRC00TWK__BOnNFaNM_XPYvoAhDGhMhrAkmyTPPqMv0AvJX60Iw8MXjEHnS8tc4OqlxE3NfjFwWfSYAKLRCr7l9BrazITGVrq8PHZ4v_ASnY5cOOCR4bNlHxVi65NiuybGnwoeSD7yhQMeMVW5rPTjUGX7z4vaUxpgBezAZRkDCAWD7sdB5eFk2o_wA3I_iZKibnUnB8rERtJ_ai-5jjnSFtkMrKKUIiY8Wpz1VufDiPs"
            />
            <div className="absolute bottom-6 left-6 flex gap-2">
              <button className="bg-white/90 backdrop-blur p-3 rounded-full shadow-lg text-emerald-900 hover:bg-white transition-all">
                <Icon name="zoom_in" />
              </button>
              <button className="bg-white/90 backdrop-blur p-3 rounded-full shadow-lg text-emerald-900 hover:bg-white transition-all">
                <Icon name="grid_view" />
              </button>
            </div>
            <div className="absolute top-6 right-6 bg-emerald-900/90 text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase backdrop-blur">
              Instagram Reel / 9:16
            </div>
          </div>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-on-surface-variant/40 flex items-center gap-2">
            <Icon name="info" className="text-sm" />
            <span className="text-[11px] font-medium tracking-wide uppercase">
              Scroll to view alternative versions
            </span>
          </div>
        </section>

        {/* Side panel */}
        <aside className="w-full lg:w-[480px] bg-surface-container-lowest flex flex-col lg:h-[calc(100vh-64px)] shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
          <div className="flex-1 overflow-y-auto p-8">
            <div className="mb-10">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary-fixed text-tertiary text-[10px] font-bold tracking-widest uppercase">
                  Pending Client Approval
                </span>
                <span className="text-on-surface-variant/40 text-[10px] font-bold tracking-widest uppercase">
                  ID: CAM-7291
                </span>
              </div>
              <h1 className="text-3xl font-headline font-extrabold tracking-tight text-emerald-900 leading-tight">
                Spring Equinox Global Campaign
              </h1>
              <p className="mt-2 text-on-surface-variant text-sm font-medium">
                Drafted by Senior Art Director • 2h ago
              </p>
            </div>

            <div className="mb-10 space-y-4">
              <h3 className="uppercase tracking-[0.2em] text-[10px] font-bold text-on-surface-variant/60">
                Final Caption
              </h3>
              <div className="p-6 bg-surface rounded-xl border-l-4 border-emerald-900/20">
                <p className="text-emerald-900 font-headline text-lg italic leading-relaxed">
                  &ldquo;Embrace the renewal of the season. Our new collection
                  draws inspiration from the silent awakening of the garden.
                  Explore the textures of nature.&rdquo;
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-primary text-xs font-medium">
                    #AtelierSpring
                  </span>
                  <span className="text-primary text-xs font-medium">
                    #QuietLuxury
                  </span>
                  <span className="text-primary text-xs font-medium">
                    #BotanicalArt
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-10 space-y-4">
              <h3 className="uppercase tracking-[0.2em] text-[10px] font-bold text-on-surface-variant/60">
                Creative Direction
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Icon name="palette" className="text-emerald-800 mt-1" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-900">
                      Color Palette
                    </h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Muted botanical greens, warm cream highlights, and soft
                      charcoal shadows to evoke organic luxury.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Icon name="camera" className="text-emerald-800 mt-1" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-900">
                      Visual Mood
                    </h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      High-key lighting, shallow depth of field, focused on the
                      interplay of textile and nature.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="uppercase tracking-[0.2em] text-[10px] font-bold text-on-surface-variant/60">
                  Revision History
                </h3>
                <button className="text-[10px] font-bold text-primary tracking-wider uppercase hover:underline">
                  Add Comment
                </button>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Marcus"
                    className="w-8 h-8 rounded-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBOIy0Odf6X5J6sn27CDbpynN88qAzfUyfGgHlx210HHQg5VuhE4aJS6LSNage_STwxY6KCLyzLQ8fIsx40WZXnvjGFPyMgLsc5N6GlNO-s0oSVFPKWCvoybT2HHpisedE1FgxKkiORkhRfae5UabmAKafNBuIwEBm8RfRagvvYiuf9D9S4OPFSUSRikl3Ik5w7iyCT5w_DOEKiAn1Z--JV8C4WBFOfOaR1c7tZ6ScTOrn5f7Aa9ltNPCOUwPxVNsUh127O8ynp54"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-emerald-900">
                        Marcus Thorne (Client)
                      </span>
                      <span className="text-[10px] text-on-surface-variant/50">
                        Yesterday
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Can we slightly increase the saturation on the green
                      foliage? It feels a bit muted for the &apos;Equinox&apos;
                      theme.
                    </p>
                  </div>
                </div>
                <div className="pl-12 relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-outline-variant/30" />
                  <div className="flex items-center gap-2 text-[10px] font-medium text-on-surface-variant/60 italic">
                    <Icon name="history" className="text-[14px]" />
                    <span>
                      Updated asset to Version 2.4 • Today at 11:02 AM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-surface-container-lowest shadow-[0_-10px_30px_rgba(0,0,0,0.03)] flex gap-4">
            <button className="flex-1 py-4 px-6 border border-outline-variant/30 text-emerald-900 font-headline font-bold text-sm rounded-md hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2">
              <Icon name="edit_note" className="text-[18px]" />
              Request Changes
            </button>
            <Link
              href="/approvals"
              className="flex-[1.5] py-4 px-6 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold text-sm rounded-md shadow-lg shadow-emerald-900/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Icon name="check_circle" className="text-[18px]" />
              Approve Post
            </Link>
          </div>
        </aside>
      </main>
    </>
  );
}
