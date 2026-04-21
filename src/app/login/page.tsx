import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left: Branding */}
      <section className="hidden md:flex md:w-5/12 bg-primary relative p-16 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
        <div className="relative z-10">
          <span className="font-headline font-extrabold text-2xl text-on-primary tracking-tighter">
            Atelier Martech
          </span>
        </div>
        <div className="relative z-10 space-y-8">
          <h1 className="font-headline text-5xl lg:text-6xl font-extrabold text-on-primary text-kern-tight leading-[1.1]">
            The Digital <br />
            Curator for <br />
            Agencies.
          </h1>
          <p className="text-on-primary/70 text-lg max-w-sm font-light leading-relaxed">
            Crafting sophisticated marketing ecosystems with quiet luxury and
            architectural precision.
          </p>
        </div>
        <div className="relative z-10 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full border border-on-primary/20 flex items-center justify-center">
            <Icon name="security" className="text-on-primary text-sm" />
          </div>
          <p className="font-label text-xs uppercase text-on-primary/50 text-kern-luxury">
            Encrypted Enterprise Portal
          </p>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary-container/30 blur-3xl" />
      </section>

      {/* Right: Login canvas */}
      <section className="flex-1 flex flex-col items-center justify-center p-8 md:p-24 bg-surface">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-12 flex justify-center">
            <span className="font-headline font-extrabold text-2xl text-primary tracking-tighter">
              Atelier Martech
            </span>
          </div>
          <header className="mb-12 text-center md:text-left">
            <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">
              Welcome back
            </h2>
            <p className="text-on-surface-variant font-light">
              Enter your credentials to access the atelier.
            </p>
          </header>

          <form className="space-y-6">
            <div className="space-y-2">
              <label
                className="block font-label text-[10px] uppercase font-bold text-on-surface-variant tracking-widest text-kern-luxury"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@agency.com"
                className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all duration-300 placeholder:text-outline-variant/50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label
                  className="block font-label text-[10px] uppercase font-bold text-on-surface-variant tracking-widest text-kern-luxury"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="font-label text-[10px] uppercase font-bold text-primary hover:text-primary-container transition-colors tracking-widest text-kern-luxury"
                >
                  Forgot Password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all duration-300 placeholder:text-outline-variant/50"
              />
            </div>
            <Link
              href="/dashboard"
              className="w-full group relative overflow-hidden bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-md font-headline font-semibold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Sign in to Dashboard
              <Icon
                name="arrow_forward"
                className="text-sm group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </form>

          <footer className="mt-12 pt-8 border-t border-outline-variant/10">
            <div className="flex flex-col items-center space-y-4">
              <p className="text-on-surface-variant text-sm font-light">
                New to the platform?
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-on-surface font-headline font-bold text-sm hover:text-primary transition-colors group"
              >
                Request Access
                <div className="h-px w-8 bg-primary/30 group-hover:w-12 transition-all" />
              </a>
            </div>
          </footer>

          <div className="mt-24 flex justify-between items-center opacity-40">
            <span className="font-label text-[9px] uppercase tracking-[0.2em]">
              © 2024 Atelier Martech
            </span>
            <div className="flex gap-4">
              <span className="font-label text-[9px] uppercase tracking-[0.2em] cursor-pointer hover:text-primary">
                Privacy
              </span>
              <span className="font-label text-[9px] uppercase tracking-[0.2em] cursor-pointer hover:text-primary">
                Terms
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Floating status panel */}
      <div className="absolute bottom-8 right-8 pointer-events-none hidden lg:block">
        <div className="glass-panel p-6 rounded-xl editorial-shadow border border-white/20 max-w-[240px]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            <span className="font-label text-[10px] uppercase font-bold tracking-widest text-on-surface">
              Platform Status
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-on-surface-variant font-light">
            All agency nodes are operational. High-performance data streaming
            enabled for premium tiers.
          </p>
        </div>
      </div>
    </main>
  );
}
