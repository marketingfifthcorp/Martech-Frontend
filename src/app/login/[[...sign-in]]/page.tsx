import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div
      className="dark"
      style={{
        width: "100%",
        height: "100%",
        background: "var(--bg)",
        display: "flex",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Decorative orbs */}
      <div style={{ position: "absolute", top: -80, right: -60, width: 320, height: 320, background: "radial-gradient(circle,var(--orb1),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: -60, left: 80, width: 280, height: 280, background: "radial-gradient(circle,var(--orb2),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Left brand panel */}
      <div
        style={{
          width: 420,
          minWidth: 420,
          background: "var(--sb)",
          borderRight: "1px solid var(--sb-b)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 40px",
          position: "relative",
          zIndex: 1,
          backdropFilter: "blur(24px)",
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 300, letterSpacing: ".32em", color: "var(--green)", marginBottom: 4 }}>ZŸR</div>
          <div style={{ fontSize: 9, color: "var(--t4)", letterSpacing: ".14em", fontWeight: 300 }}>Marketing OS</div>
        </div>

        <div>
          <div style={{ fontSize: 32, fontWeight: 300, color: "var(--t1)", lineHeight: 1.25, marginBottom: 16, letterSpacing: "-.02em" }}>
            The Digital Curator<br />for Agencies.
          </div>
          <div style={{ fontSize: 13, color: "var(--t3)", lineHeight: 1.7, fontWeight: 300, marginBottom: 32 }}>
            AI-powered strategy. Seamless collaboration. Automated publishing — all in one platform built for modern marketing agencies.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
            {[{ label: "Clients", value: "2.4K+" }, { label: "Posts published", value: "180K+" }, { label: "Agencies", value: "340+" }].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: 22, fontWeight: 300, color: "var(--green)", letterSpacing: "-.02em" }}>{s.value}</div>
                <div style={{ fontSize: 9, color: "var(--t4)", textTransform: "uppercase", letterSpacing: ".1em", marginTop: 3, fontWeight: 300 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform status */}
        <div style={{ background: "var(--in)", border: "1px solid var(--in-b)", borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} />
            <span style={{ fontSize: 9, color: "var(--t4)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 300 }}>Platform status</span>
          </div>
          {[["Strategy engine","Operational"],["Publishing queue","Operational"],["AI agents","Operational"]].map(([label, status]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", fontSize: 11, fontWeight: 300 }}>
              <span style={{ color: "var(--t4)" }}>{label}</span>
              <span style={{ color: "var(--green)" }}>{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Clerk sign-in */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 9, color: "var(--green)", textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 8, fontWeight: 300 }}>Platform access</div>
            <div style={{ fontSize: 28, fontWeight: 300, color: "var(--t1)", letterSpacing: "-.02em" }}>Welcome back.</div>
            <div style={{ fontSize: 12, color: "var(--t3)", marginTop: 4, fontWeight: 300 }}>Sign in to your workspace</div>
          </div>
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "border border-outline-variant/30 rounded-md hover:bg-surface-container-low transition-colors",
                formFieldInput:
                  "bg-surface-container-low border-0 rounded-md text-sm focus:ring-2 focus:ring-primary/30 transition-all",
                formButtonPrimary:
                  "bg-primary hover:bg-primary-container text-white font-bold rounded-md",
                footerActionLink: "text-primary hover:underline",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
