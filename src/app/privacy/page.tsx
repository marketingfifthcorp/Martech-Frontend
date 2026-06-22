import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — ZYR",
};

export default function PrivacyPage() {
  return (
    <div className="dark" style={{ minHeight: "100vh", background: "linear-gradient(145deg,#0f0f1a,#1a1a2e,#0d1117)", fontFamily: "'Inter', system-ui, sans-serif", color: "#f2f2f7" }}>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,.07)", padding: "0 32px", height: 56, display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, background: "rgba(15,15,26,.85)", backdropFilter: "blur(20px)", zIndex: 10 }}>
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(171,171,188,.7)", textDecoration: "none", fontSize: 12, fontWeight: 300, letterSpacing: ".04em" }} aria-label="Back to dashboard">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </Link>
        <div style={{ width: 1, height: 16, background: "rgba(255,255,255,.08)" }} />
        <span style={{ fontSize: 15, fontWeight: 300, letterSpacing: ".28em", color: "#34d97b" }}>ZŸR</span>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px 96px" }}>
        <p style={{ fontSize: 11, fontWeight: 400, letterSpacing: ".18em", color: "#34d97b", textTransform: "uppercase", marginBottom: 12 }}>Legal</p>
        <h1 style={{ fontSize: 32, fontWeight: 300, letterSpacing: "-.01em", color: "#f2f2f7", marginBottom: 8, lineHeight: 1.2 }}>Privacy Policy</h1>
        <p style={{ fontSize: 12, color: "#6b6b80", marginBottom: 48, fontWeight: 300 }}>Last updated: June 2026 · Marketing Fifth Corp</p>

        <Section title="1. Introduction">
          <P>Marketing Fifth Corp ("we", "us", or "our") operates ZYR, an AI-powered social media management platform. This Privacy Policy explains how we collect, use, store, and protect information when you use our platform at <strong style={{ fontWeight: 400, color: "#ababbc" }}>martech-frontend.vercel.app</strong> and associated services.</P>
          <P>By using ZYR, you agree to the collection and use of information as described in this policy. If you do not agree, please discontinue use of the platform.</P>
        </Section>

        <Section title="2. Information We Collect">
          <P>We collect the following categories of information:</P>
          <SubHeading>Account &amp; Authentication Data</SubHeading>
          <P>When you sign in through our authentication provider (Clerk), we receive your name, email address, and a unique user identifier. We store your assigned role within the platform (Admin, Designer, or Client).</P>
          <SubHeading>Connected Social Account Data</SubHeading>
          <P>When you connect an Instagram or Facebook account via OAuth, we receive and store:</P>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px", lineHeight: 1.9 }}>
            <li>Your Instagram username and Instagram Business Account ID</li>
            <li>The name and ID of the Facebook Page linked to your Instagram account</li>
            <li>OAuth access tokens (short-lived and long-lived Page-scoped tokens) required to publish content on your behalf</li>
            <li>Token expiry timestamps</li>
          </ul>
          <SubHeading>Content &amp; Media</SubHeading>
          <P>We store post content that is created or uploaded through the platform, including:</P>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px", lineHeight: 1.9 }}>
            <li>Post captions, hashtags, call-to-action text, and topic metadata generated for or by your account</li>
            <li>Creative assets (images and videos) uploaded by you or your agency, stored in our cloud storage</li>
            <li>Scheduled publish dates and times</li>
            <li>Publishing history and status logs</li>
          </ul>
          <SubHeading>Usage &amp; Analytics Data</SubHeading>
          <P>We fetch Instagram Insights data (such as reach and engagement metrics) through the Meta Graph API using the access token you provide, solely to display analytics within your ZYR dashboard. We do not sell or share this data.</P>
        </Section>

        <Section title="3. How We Use Your Information">
          <P>We use the information we collect exclusively to provide and improve the ZYR platform:</P>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px", lineHeight: 1.9 }}>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>Publishing posts</strong> — We use stored OAuth tokens to publish scheduled content to your connected Instagram and Facebook accounts via the Meta Graph API.</li>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>Displaying analytics</strong> — We retrieve performance metrics from Instagram Insights to show reach, engagement, and follower data inside your dashboard.</li>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>Content generation</strong> — Post captions, hooks, and strategy documents may be processed through Anthropic's Claude AI to generate or improve content on your behalf.</li>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>Platform operation</strong> — We store your content and account data to provide scheduling, approval workflows, and design queue features.</li>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>Notifications</strong> — We send in-app notifications about content status, approvals, and publishing results.</li>
          </ul>
          <P>We do not use your data for advertising, sell it to third parties, or use it for any purpose beyond operating ZYR.</P>
        </Section>

        <Section title="4. Third-Party Services">
          <P>ZYR integrates with the following third-party services. Each is governed by its own privacy policy:</P>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px", lineHeight: 1.9 }}>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>Meta (Facebook / Instagram)</strong> — We use the Meta Graph API to connect accounts, publish posts, and retrieve Insights. Your use is subject to Meta's Data Policy at <a href="https://www.facebook.com/privacy/policy/" style={{ color: "#34d97b" }} target="_blank" rel="noopener noreferrer">facebook.com/privacy/policy</a>.</li>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>Clerk</strong> — Handles authentication and user identity management. See <a href="https://clerk.com/privacy" style={{ color: "#34d97b" }} target="_blank" rel="noopener noreferrer">clerk.com/privacy</a>.</li>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>Supabase</strong> — Provides the PostgreSQL database and file storage (creative assets). Data is encrypted at rest. See <a href="https://supabase.com/privacy" style={{ color: "#34d97b" }} target="_blank" rel="noopener noreferrer">supabase.com/privacy</a>.</li>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>Vercel</strong> — Hosts the frontend application. See <a href="https://vercel.com/legal/privacy-policy" style={{ color: "#34d97b" }} target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a>.</li>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>Anthropic</strong> — Processes text content for AI-assisted caption and strategy generation. Input content is sent to Anthropic's API. See <a href="https://www.anthropic.com/privacy" style={{ color: "#34d97b" }} target="_blank" rel="noopener noreferrer">anthropic.com/privacy</a>.</li>
          </ul>
        </Section>

        <Section title="5. Data Retention">
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px", lineHeight: 1.9 }}>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>OAuth tokens</strong> — Retained until you explicitly disconnect the platform connection via Settings. Upon disconnection, the token record is deleted from our database.</li>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>Post content and creative assets</strong> — Retained for the lifetime of your client account on the platform. Assets stored in cloud storage are deleted when the associated post or account is removed.</li>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>Account data</strong> — Retained while your account is active. Upon account deletion, associated personal data is removed within 30 days.</li>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>Analytics snapshots</strong> — Follower count snapshots are retained for the lifetime of the platform connection and deleted when the connection is removed.</li>
          </ul>
        </Section>

        <Section title="6. Data Security">
          <P>We implement industry-standard security practices including encrypted connections (HTTPS/TLS) for all data in transit, encryption at rest for database records and stored files, and access controls limiting data access to authenticated users with appropriate roles. OAuth tokens are stored in a secured database and are never exposed client-side.</P>
          <P>No method of transmission or storage is 100% secure. We cannot guarantee absolute security, but we take reasonable measures to protect your information.</P>
        </Section>

        <Section title="7. Your Rights &amp; Choices">
          <P>You have the following rights regarding your data:</P>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px", lineHeight: 1.9 }}>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>Disconnect social accounts</strong> — You can disconnect any connected Instagram or Facebook account at any time via Settings → Connected Channels. This immediately removes the stored access token.</li>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>Access your data</strong> — You may request a copy of the personal data we hold about you.</li>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>Deletion</strong> — You may request deletion of your account and associated data by contacting us at the email below. We will process requests within 30 days.</li>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>Revoke Meta permissions</strong> — You can revoke ZYR's access to your Facebook/Instagram account at any time via <a href="https://www.facebook.com/settings?tab=applications" style={{ color: "#34d97b" }} target="_blank" rel="noopener noreferrer">Facebook App Settings</a>, independent of our platform.</li>
          </ul>
        </Section>

        <Section title="8. Children's Privacy">
          <P>ZYR is not directed at individuals under 16 years of age. We do not knowingly collect personal data from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.</P>
        </Section>

        <Section title="9. Changes to This Policy">
          <P>We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page. Continued use of ZYR after changes constitutes acceptance of the updated policy.</P>
        </Section>

        <Section title="10. Contact Us">
          <P>For privacy questions, data deletion requests, or any concerns about how we handle your information, contact us at:</P>
          <div style={{ marginTop: 12, padding: "16px 20px", background: "rgba(52,217,123,.07)", border: "1px solid rgba(52,217,123,.15)", borderRadius: 10 }}>
            <p style={{ margin: 0, fontSize: 13, color: "#f2f2f7", fontWeight: 300 }}>Marketing Fifth Corp</p>
            <a href="mailto:annassiddique7@gmail.com" style={{ fontSize: 13, color: "#34d97b", textDecoration: "none" }}>annassiddique7@gmail.com</a>
          </div>
        </Section>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 15, fontWeight: 400, color: "#f2f2f7", marginBottom: 14, letterSpacing: ".01em", paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,.06)" }}>{title}</h2>
      {children}
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: 12, fontWeight: 400, color: "#ababbc", marginBottom: 6, marginTop: 18, letterSpacing: ".04em" }}>{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 13, lineHeight: 1.85, color: "#ababbc", fontWeight: 300, marginBottom: 12 }}>{children}</p>;
}
