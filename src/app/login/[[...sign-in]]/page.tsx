import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] bg-primary p-16 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-primary-fixed text-[10px] uppercase tracking-[0.4em] font-semibold">
            Atelier Martech
          </span>
        </div>
        <div className="relative z-10 space-y-8">
          <h1 className="text-white font-headline text-5xl font-extrabold tracking-tighter leading-tight">
            The Digital Curator<br />for Agencies.
          </h1>
          <p className="text-primary-fixed-dim text-lg font-light leading-relaxed">
            AI-powered strategy. Seamless collaboration. Automated publishing — all in one platform built for modern marketing agencies.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-4">
            {[
              { label: "Clients", value: "2.4K+" },
              { label: "Posts Published", value: "180K+" },
              { label: "Agencies", value: "340+" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-white font-headline font-bold text-2xl">{stat.value}</div>
                <div className="text-primary-fixed-dim text-xs uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-primary-container/30 rounded-full blur-3xl" />

        {/* Status */}
        <div className="relative z-10 border border-white/10 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-primary-fixed/70 font-semibold">
              Platform Status
            </span>
          </div>
          {[
            { label: "Strategy Engine", status: "Operational" },
            { label: "Publishing Queue", status: "Operational" },
            { label: "AI Agents", status: "Operational" },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center text-xs">
              <span className="text-primary-fixed/60">{item.label}</span>
              <span className="text-primary-fixed font-semibold">{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Clerk sign-in */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <p className="text-[11px] uppercase tracking-[0.3em] text-primary font-semibold mb-3">
              Platform Access
            </p>
            <h2 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">
              Welcome back.
            </h2>
            <p className="mt-2 text-on-surface-variant text-sm">
              Sign in to your workspace
            </p>
          </div>
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none p-9 bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "border border-outline-variant/30 rounded-md hover:bg-surface-container-low transition-colors",
                formFieldInput:
                  "bg-surface-container-low border-0 rounded-md text-sm focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all",
                formButtonPrimary:
                  "bg-primary hover:bg-primary-container text-white font-headline font-bold rounded-md shadow-lg",
                footerActionLink: "text-primary hover:underline",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
