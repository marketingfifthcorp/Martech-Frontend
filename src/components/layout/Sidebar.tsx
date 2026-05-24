"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

type NavItem = { href: string; label: string; icon: string };

const PRIMARY_NAV: NavItem[] = [
  { href: "/dashboard",        label: "Clients",    icon: "group" },
  { href: "/content-calendar", label: "Content",    icon: "layers" },
  { href: "/designer",         label: "Design",     icon: "palette" },
  { href: "/publishing",       label: "Publishing", icon: "send" },
];

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export function Sidebar({ open = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={[
        "fixed left-0 top-0 h-screen flex flex-col p-6 bg-stone-50 w-64 z-40",
        "transition-transform duration-300 ease-in-out",
        "lg:translate-x-0 shadow-lg lg:shadow-none border-r border-stone-100",
        open ? "translate-x-0" : "-translate-x-full",
      ].join(" ")}
    >
      {/* Mobile close */}
      <button
        onClick={onClose}
        className="lg:hidden absolute right-3 top-3 p-2 rounded-lg text-stone-400 hover:bg-stone-200 transition-colors"
        aria-label="Close menu"
      >
        <Icon name="close" className="text-lg" />
      </button>

      {/* Logo */}
      <div className="flex flex-col space-y-1 mb-8 pr-6">
        <Link
          href="/dashboard"
          className="text-lg font-black text-emerald-900 font-headline tracking-tighter"
          onClick={onClose}
        >
          Creative Atelier
        </Link>
        <span className="font-headline uppercase tracking-widest text-[10px] font-bold text-stone-400">
          Premium Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col space-y-1 flex-grow">
        {PRIMARY_NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={
                active
                  ? "flex items-center space-x-3 px-3 py-2.5 bg-emerald-900 text-white rounded-lg shadow-sm transition-all"
                  : "flex items-center space-x-3 px-3 py-2.5 text-stone-600 hover:bg-stone-100 rounded-lg transition-all hover:translate-x-0.5"
              }
            >
              <Icon name={item.icon} className="text-[18px] shrink-0" />
              <span className="font-headline uppercase tracking-widest text-[10px] font-bold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="pt-4 border-t border-stone-200 flex flex-col space-y-2">
        <Link
          href="/onboarding"
          onClick={onClose}
          className="block text-center bg-primary text-white py-2.5 rounded-lg font-headline text-[11px] font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
        >
          + New Campaign
        </Link>
        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center space-x-3 px-2 py-2 text-stone-500 hover:text-emerald-900 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <Icon name="settings" className="text-sm" />
          <span className="font-headline uppercase tracking-widest text-[10px] font-bold">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
