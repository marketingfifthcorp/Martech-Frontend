"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

type NavItem = {
  href: string;
  label: string;
  icon: string;
};

const PRIMARY_NAV: NavItem[] = [
  { href: "/dashboard", label: "Clients", icon: "group" },
  { href: "/content-calendar", label: "Content", icon: "layers" },
  { href: "/post-review", label: "Tasks", icon: "assignment_turned_in" },
  { href: "/publishing", label: "Analytics", icon: "insights" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col p-6 space-y-8 bg-stone-50 h-screen w-64 z-40">
      <div className="flex flex-col space-y-2 mb-4">
        <Link
          href="/dashboard"
          className="text-lg font-black text-emerald-900 font-headline tracking-tighter"
        >
          Creative Atelier
        </Link>
        <span className="font-headline uppercase tracking-widest text-[10px] font-bold text-stone-500">
          Premium Admin
        </span>
      </div>
      <nav className="flex flex-col space-y-2 flex-grow">
        {PRIMARY_NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "flex items-center space-x-3 p-3 bg-emerald-900 text-white rounded-md shadow-lg shadow-emerald-900/10 transition-transform duration-200"
                  : "flex items-center space-x-3 p-3 text-stone-600 hover:bg-stone-200/50 rounded-md hover:translate-x-1 transition-transform duration-200"
              }
            >
              <Icon name={item.icon} />
              <span className="font-headline uppercase tracking-widest text-[10px] font-bold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="pt-6 border-t border-outline-variant/20 flex flex-col space-y-4">
        <Link
          href="/onboarding"
          className="w-full block text-center bg-primary text-white py-3 rounded-md font-headline text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
        >
          New Campaign
        </Link>
        <div className="flex flex-col space-y-2">
          <a
            className="flex items-center space-x-3 p-2 text-stone-500 hover:text-emerald-900 transition-colors"
            href="#"
          >
            <Icon name="help" className="text-sm" />
            <span className="font-headline uppercase tracking-widest text-[10px] font-bold">
              Help Center
            </span>
          </a>
          <Link
            href="/login"
            className="flex items-center space-x-3 p-2 text-stone-500 hover:text-error transition-colors"
          >
            <Icon name="logout" className="text-sm" />
            <span className="font-headline uppercase tracking-widest text-[10px] font-bold">
              Logout
            </span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
