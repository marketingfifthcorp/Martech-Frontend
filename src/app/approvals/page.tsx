import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function ApprovalsPage() {
  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/80 glass-nav h-20 flex items-center shadow-sm shadow-emerald-900/5">
        <div className="flex justify-between items-center px-12 w-full mx-auto max-w-screen-2xl">
          <Link
            href="/dashboard"
            className="text-xl font-bold tracking-tighter text-emerald-900 font-headline"
          >
            Atelier Martech
          </Link>
          <div className="hidden md:flex items-center space-x-12 font-headline tracking-tight font-semibold">
            <a
              href="#"
              className="text-emerald-700/60 hover:text-emerald-900 transition-colors duration-300"
            >
              Approvals
            </a>
            <Link
              href="/content-calendar"
              className="text-emerald-900 border-b-2 border-emerald-900 pb-1 transition-colors duration-300"
            >
              Calendar
            </Link>
            <a
              href="#"
              className="text-emerald-700/60 hover:text-emerald-900 transition-colors duration-300"
            >
              History
            </a>
          </div>
          <div className="flex items-center space-x-6">
            <button className="text-emerald-900 scale-95 duration-200 ease-in-out">
              <Icon name="notifications" />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Client"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaP9DVjd_B4FTIP0NBUPpdpfUWdxAWb4eIO3EEdFqhAlhtxAtXhjeBIeWj2QwYwDaaCApx5t991BeeyzS8sfujJZP7om4F2K3zLlMdnDEZ5JOnMTXZzoj_hYZasrV-NZBdi7345TToVPhC_oCy1nuPSeXhNs8lfCDPzo1q0Bgw3hN_HyFjAy4NEWQ09TDP5xLWR-iTEw3ol9mmo8ARz86mrudp1ycYLAFTJMeloxGCv7WZh53njwvFNWXMxpTXjxZG2aufppnQ3_s"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-32 px-6 md:px-12 max-w-screen-2xl mx-auto">
        {/* Header */}
        <header className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-label text-[11px] uppercase tracking-[0.2em] text-primary mb-4 block">
                Current Campaign
              </span>
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-primary leading-none">
                Spring Curator <br />
                Collection &lsquo;24
              </h1>
            </div>
            <div className="flex items-center gap-4 text-on-surface-variant font-label text-sm">
              <Icon name="calendar_month" className="text-primary" />
              <span className="font-medium">March 15 - April 22</span>
            </div>
          </div>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Featured */}
          <div className="md:col-span-8 group">
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden editorial-shadow flex flex-col md:flex-row h-full transition-all duration-500 hover:-translate-y-1">
              <div className="md:w-1/2 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Campaign"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtCiBQZS5em4Nu6kv94nbZMFFoXpPZLJUzSqrtONG5VB6xd0vAVJmgty-ndAb2GJks2mH06cVvnKG1k4tGBiWVQTwVVxwTP5Z1nCefOMtUDj-Vcwo9NYvFMmB7Vq1ZDTEzuPhvHwCu7nwnb5dS2oTtX-Bxf3Cfk-iusWm7YYNKaM-4YcTsncGKL1p1yNLaw1-2jUuDiE75Zu5s2b85KA8HcxS0Gsmtwiqxr_lYg1hnz4avjRNH3oKIPnbkOrwM1HNRq94vWGCoczU"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-primary/10 backdrop-blur-md text-primary px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold">
                    Pending Approval
                  </span>
                </div>
              </div>
              <div className="md:w-1/2 p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Icon name="repeat" className="text-secondary text-lg" />
                    <span className="text-xs tracking-widest text-secondary-container">
                      REEL / VIDEO
                    </span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold mb-4 leading-tight">
                    The Essence of Organic Movement
                  </h3>
                  <p className="text-on-surface-variant leading-relaxed mb-8">
                    Capturing the fluidity of our latest sustainable silk
                    collection against the architectural backdrop of the Kyoto
                    Botanical Gardens. Focus on texture and light transitions.
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between text-xs py-2 border-b border-surface-container">
                      <span className="text-on-surface-variant">Scheduled</span>
                      <span className="font-semibold">March 20, 09:00 AM</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-2 border-b border-surface-container">
                      <span className="text-on-surface-variant">Platforms</span>
                      <span className="font-semibold">Instagram, TikTok</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-gradient-to-br from-primary to-primary-container text-white py-4 rounded-md text-[10px] tracking-widest font-bold uppercase transition-all active:scale-95">
                    Approve
                  </button>
                  <button className="bg-surface-container-highest text-on-surface py-4 rounded-md text-[10px] tracking-widest font-bold uppercase transition-all hover:bg-tertiary-fixed-dim/20 active:scale-95">
                    Reject
                  </button>
                  <button className="col-span-2 text-center text-primary font-headline text-sm font-semibold py-2 hover:underline transition-all">
                    Add Comment
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Side stack */}
          <div className="md:col-span-4 space-y-12">
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden editorial-shadow transition-all duration-500 hover:-translate-y-1">
              <div className="aspect-[4/3] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Linen"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIf1ob-6gp4YOLxP0DOSomdsmeUjC9jITQDD8CfsDZbiZtbeEEl4bg7z7jHP7sjbl4E0-SwxNRWOp2721gRvG7fHAM4oazbaCVSRgNMEg1tMZZGNWLwfvG-6-U4sdGnDrFQMpOoA8hzW2dV0CodOEfxGypFI5sxAkDYNk215f6J4UDjtXebShzSw3ceK3MXEnxeSRVVCSHW1lqbX8HSkzgC3MkwhGZQQTX9-rsSUshbzVwKXfnkSYxTmDAIoqDpbvpHL7HSfbn89E"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-secondary/10 backdrop-blur-md text-secondary px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold">
                    Needs Review
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h4 className="font-headline text-lg font-bold mb-2">
                  Sustainable Foundations
                </h4>
                <p className="text-on-surface-variant text-sm line-clamp-2 mb-6">
                  A carousel exploring the lifecycle of our organic linen, from
                  seed to garment.
                </p>
                <div className="flex flex-col gap-2">
                  <button className="bg-gradient-to-br from-primary to-primary-container text-white py-3 rounded-md text-[10px] tracking-widest font-bold uppercase transition-all">
                    Approve
                  </button>
                  <button className="text-primary font-headline text-xs font-bold py-2">
                    View Full Asset
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low p-8 rounded-xl border-l-4 border-primary">
              <span className="text-primary text-[10px] uppercase tracking-widest font-bold block mb-2">
                Approved Asset
              </span>
              <h4 className="font-headline text-lg font-bold mb-4">
                Behind the Lens: Kyoto Session
              </h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Kyoto"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPGzMnojXQHi83uZuXJVwE3hmszxwPGe9_YLeDhRpTcgGsKllh69Fuszj3Exz-M2w4K_ZoZHnG6GwzI603-dUO9o2pXpLJai7u9cdbwH4M_J8H4AtBqRNUA4PsBJGfhWVULmWDRpru2cqUooBPZ3fasAIktBRHJuk2m3jq2xx6eNpZ0bIbnuFKJJpdNENMhP8jYTFLuN1BVRZOti7t4K0_XlpZHeyZ8SQve-W-ZYyYKp6PV7QJ9ZYeCehUSGuaXrtp18TniVbLvms"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs">
                  <p className="font-medium text-on-surface-variant">
                    Confirmed for March 22
                  </p>
                  <a className="text-primary underline" href="#">
                    View history
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="md:col-span-4">
            <div className="bg-surface-container-lowest rounded-xl p-10 editorial-shadow h-full flex flex-col justify-center">
              <Icon
                name="auto_awesome_motion"
                className="text-4xl text-primary mb-6"
              />
              <h3 className="font-headline text-2xl font-bold mb-4">
                Performance Insights
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Your previous editorial campaign saw a 24% increase in
                engagement. We&apos;ve optimized the upcoming posts based on
                those findings.
              </p>
            </div>
          </div>

          {/* Upcoming shoots */}
          <div className="md:col-span-8">
            <div className="bg-primary p-10 rounded-xl editorial-shadow relative overflow-hidden group">
              <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none transition-transform duration-1000 group-hover:scale-110">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Silk"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzDwr2lawd4-fTgYiSGv1zd-1M2mYq9WZ0DQ4guOgVpQJDlsCgPazM9LOI36gClubLGJEXjQNWZfVSVGbi9LVJamVTDGba6_GNHp81ncRE-OByEWfyQIbVHPLsv47RXKvUMi2xishIyyZKl39HO_b0kMlrBOP0XrawxoZd5pK2c-zglBXE6DeChSG51kq5eFs3KcSAvgGaTXkIb1jethaUxiw6YNInFuYQtIeDWnsOynMvoyUwyeHH6kQCAhbJPSBTY8csS8SD6gU"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 max-w-lg">
                <h3 className="font-headline text-3xl font-bold text-white mb-6">
                  Upcoming Shoots
                </h3>
                <p className="text-primary-fixed-dim text-lg mb-8">
                  We are scouting locations in Norway for the Winter Curator
                  series. Expect the first moodboards by Friday.
                </p>
                <button className="bg-white text-primary px-8 py-3 rounded-md text-xs tracking-widest font-bold uppercase transition-transform active:scale-95">
                  Request New Shoot
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-white/90 backdrop-blur-lg shadow-xl md:hidden border-t border-emerald-900/5">
        <a
          href="#"
          className="flex flex-col items-center justify-center text-emerald-700/50 px-6 py-2 active:scale-90 transition-transform"
        >
          <Icon name="fact_check" />
          <span className="font-headline text-[11px] uppercase tracking-widest mt-1">
            Approvals
          </span>
        </a>
        <Link
          href="/content-calendar"
          className="flex flex-col items-center justify-center bg-emerald-100/50 text-emerald-900 rounded-xl px-6 py-2 active:scale-90 transition-transform"
        >
          <Icon name="calendar_today" />
          <span className="font-headline text-[11px] uppercase tracking-widest mt-1">
            Calendar
          </span>
        </Link>
        <a
          href="#"
          className="flex flex-col items-center justify-center text-emerald-700/50 px-6 py-2 active:scale-90 transition-transform"
        >
          <Icon name="history" />
          <span className="font-headline text-[11px] uppercase tracking-widest mt-1">
            History
          </span>
        </a>
      </nav>
    </>
  );
}
