import Link from "next/link";

export const metadata = {
  title: "Terms of Service — ZYR",
};

export default function TermsPage() {
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
        <h1 style={{ fontSize: 32, fontWeight: 300, letterSpacing: "-.01em", color: "#f2f2f7", marginBottom: 8, lineHeight: 1.2 }}>Terms of Service</h1>
        <p style={{ fontSize: 12, color: "#6b6b80", marginBottom: 48, fontWeight: 300 }}>Last updated: June 2026 · Marketing Fifth Corp</p>

        <Section title="1. Acceptance of Terms">
          <P>By accessing or using ZYR ("the platform"), operated by Marketing Fifth Corp ("we", "us", or "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the platform.</P>
          <P>These terms apply to all users of ZYR, including agency administrators, designers, and clients accessing the platform at <strong style={{ fontWeight: 400, color: "#ababbc" }}>martech-frontend.vercel.app</strong> and any associated services.</P>
        </Section>

        <Section title="2. Description of Service">
          <P>ZYR is an AI-powered social media management platform that enables marketing agencies and their clients to:</P>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px", lineHeight: 1.9 }}>
            <li>Schedule and publish content to connected social media accounts (Instagram, Facebook, LinkedIn, TikTok, X/Twitter)</li>
            <li>Generate AI-assisted post captions, hooks, and content strategy documents</li>
            <li>Manage approval workflows between agencies and their clients</li>
            <li>View social media analytics and performance metrics</li>
            <li>Store and organize creative assets (images and videos)</li>
          </ul>
          <P>We reserve the right to modify, suspend, or discontinue any aspect of the service at any time with reasonable notice where practicable.</P>
        </Section>

        <Section title="3. Acceptable Use">
          <P>You agree to use ZYR only for lawful purposes and in accordance with these terms. Specifically, you agree that:</P>
          <SubHeading>You May Only Manage Authorized Accounts</SubHeading>
          <P>You may only connect and publish to social media accounts for which you have explicit authorization from the account owner. You must not use ZYR to access, manage, or publish content to accounts that you do not own or have been granted permission to manage in writing.</P>
          <SubHeading>Prohibited Activities</SubHeading>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px", lineHeight: 1.9 }}>
            <li>Publishing spam, misleading, defamatory, or illegal content through the platform</li>
            <li>Using the platform to violate the terms of service of any connected social media platform (Meta, LinkedIn, TikTok, X)</li>
            <li>Attempting to reverse-engineer, decompile, or extract source code from the platform</li>
            <li>Sharing account credentials or otherwise enabling unauthorized access to the platform</li>
            <li>Using automated scripts or bots to interact with the platform outside of approved API integrations</li>
            <li>Uploading content that infringes on intellectual property rights, contains malware, or is otherwise harmful</li>
          </ul>
          <P>Violation of these terms may result in immediate suspension or termination of your access to the platform.</P>
        </Section>

        <Section title="4. No Publishing Guarantees">
          <P>While we make reasonable efforts to ensure reliable content delivery, <strong style={{ fontWeight: 400, color: "#ababbc" }}>we do not guarantee that scheduled posts will be published at the exact scheduled time or at all.</strong> Publishing depends on:</P>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px", lineHeight: 1.9 }}>
            <li>The availability and uptime of third-party social media platforms and their APIs</li>
            <li>The validity and continued authorization of your connected OAuth tokens</li>
            <li>The compliance of your content with each platform's content policies at time of publishing</li>
            <li>Network conditions and infrastructure availability</li>
          </ul>
          <P>We are not liable for missed publications, publishing errors, or any consequences arising from failure to publish content on time. You are responsible for monitoring publishing status within the platform and maintaining valid account connections.</P>
        </Section>

        <Section title="5. Third-Party Platforms — No Affiliation">
          <P>ZYR integrates with third-party social media platforms to enable content publishing and analytics. We are an independent software platform and are <strong style={{ fontWeight: 400, color: "#ababbc" }}>not affiliated with, endorsed by, or sponsored by</strong> any of the following:</P>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px", lineHeight: 1.9 }}>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>Meta Platforms, Inc.</strong> — operator of Facebook and Instagram</li>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>LinkedIn Corporation</strong> — operator of LinkedIn</li>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>TikTok Ltd. / ByteDance</strong> — operator of TikTok</li>
            <li><strong style={{ fontWeight: 400, color: "#ababbc" }}>X Corp.</strong> — operator of X (formerly Twitter)</li>
          </ul>
          <P>Each platform's own terms of service, community guidelines, and content policies apply independently to your use of those platforms through ZYR. You remain solely responsible for ensuring your content complies with each platform's policies. Changes to third-party APIs or policies may affect ZYR's functionality without notice.</P>
        </Section>

        <Section title="6. User Content">
          <P>You retain all intellectual property rights to the content you create, upload, or generate using ZYR ("User Content"). By using the platform, you grant Marketing Fifth Corp a limited, non-exclusive license to store, process, and transmit your User Content solely as necessary to operate the service — including publishing it to connected social accounts on your behalf and displaying it within your dashboard.</P>
          <P>You represent and warrant that you have all necessary rights to upload and publish your User Content, and that it does not violate any applicable laws or third-party rights.</P>
        </Section>

        <Section title="7. AI-Generated Content">
          <P>ZYR uses Anthropic's Claude AI to assist with generating post captions, hooks, hashtags, and strategy content. You acknowledge that:</P>
          <ul style={{ paddingLeft: 20, margin: "8px 0 16px", lineHeight: 1.9 }}>
            <li>AI-generated content is provided as a starting point and should be reviewed before publishing</li>
            <li>We do not guarantee the accuracy, originality, or fitness for purpose of AI-generated content</li>
            <li>You are solely responsible for reviewing and approving any content before it is published under your account</li>
            <li>Input text you provide may be processed by Anthropic's API in accordance with <a href="https://www.anthropic.com/privacy" style={{ color: "#34d97b" }} target="_blank" rel="noopener noreferrer">Anthropic's Privacy Policy</a></li>
          </ul>
        </Section>

        <Section title="8. Account Responsibilities">
          <P>You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account. You agree to notify us immediately at <a href="mailto:annassiddique7@gmail.com" style={{ color: "#34d97b" }}>annassiddique7@gmail.com</a> if you suspect unauthorized access to your account.</P>
          <P>Client accounts are managed by the agency administrator assigned to your account. The agency administrator controls access levels and permissions within the platform.</P>
        </Section>

        <Section title="9. Limitation of Liability">
          <P>To the fullest extent permitted by law, Marketing Fifth Corp shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of revenue, loss of data, loss of business, or reputational harm, arising from your use of or inability to use ZYR.</P>
          <P>Our total liability to you for any claim arising out of or relating to these terms or your use of the platform shall not exceed the amount you paid us in the three months preceding the claim, or USD $100, whichever is greater.</P>
        </Section>

        <Section title="10. Disclaimer of Warranties">
          <P>ZYR is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the platform will be uninterrupted, error-free, or free of viruses or other harmful components.</P>
        </Section>

        <Section title="11. Governing Law">
          <P>These Terms of Service shall be governed by and construed in accordance with applicable law. Any disputes arising from these terms or your use of ZYR shall be resolved through good-faith negotiation between the parties. If resolution cannot be reached, disputes shall be subject to binding arbitration or the jurisdiction of courts with competent authority.</P>
        </Section>

        <Section title="12. Changes to These Terms">
          <P>We may update these Terms of Service from time to time. When we do, we will update the "Last updated" date at the top of this page. Continued use of ZYR after changes constitutes your acceptance of the updated terms. We encourage you to review these terms periodically.</P>
        </Section>

        <Section title="13. Contact Us">
          <P>If you have questions about these Terms of Service or wish to report a violation, contact us at:</P>
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
