import { Icon } from "@/components/ui/Icon";

type TopBarProps = {
  searchPlaceholder?: string;
  contextLabel?: string;
  user?: {
    name: string;
    role: string;
    avatar: string;
  };
};

const DEFAULT_USER = {
  name: "Julian Reed",
  role: "Director",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDMcEMcWmpDG1NgfGUi4QVmKo0fUM3vToDLLQDWRUcMooLbXWewl1j1QPxcDPTuASzycsEagl54jE64Ubw9Amq2buGRqWB7Bqqb-ODPZ2-RZ3jk-pcSI1ps8BZkbxVzSf7eFeKGO_mU1f1qlKhLFHQSi1Cp6UwkhvQun6iL4UQ7jFNC4FDEjGQaMDNsEgqo2r2XgtqjineC0q8M5E44f56mkYY2IaAbtP4FBCuob4GNCfYHUEtZFdbhebBXBRNKLPZENP-FEs9_Hi8",
};

export function TopBar({
  searchPlaceholder = "Search clients or campaigns...",
  contextLabel = "All Clients",
  user = DEFAULT_USER,
}: TopBarProps) {
  return (
    <header className="fixed top-0 right-0 left-64 z-30 h-16 bg-white/80 glass-nav px-8 flex justify-between items-center shadow-sm shadow-emerald-900/5">
      <div className="flex items-center flex-1 max-w-2xl">
        <div className="relative w-full max-w-md">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-xl text-sm focus:ring-1 focus:ring-primary transition-all"
            placeholder={searchPlaceholder}
            type="text"
          />
        </div>
        <div className="ml-6 h-8 w-px bg-outline-variant/30" />
        <button className="ml-6 flex items-center space-x-2 text-emerald-900 font-headline font-semibold text-sm hover:opacity-70 transition-opacity">
          <span>{contextLabel}</span>
          <Icon name="expand_more" className="text-sm" />
        </button>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4">
          <button className="p-2 text-stone-500 hover:bg-emerald-50/50 rounded-full transition-colors relative">
            <Icon name="notifications" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white" />
          </button>
          <button className="p-2 text-stone-500 hover:bg-emerald-50/50 rounded-full transition-colors">
            <Icon name="settings" />
          </button>
        </div>
        <div className="flex items-center space-x-3 pl-6 border-l border-outline-variant/30">
          <div className="text-right">
            <p className="text-xs font-bold font-headline tracking-tight text-emerald-900">
              {user.name}
            </p>
            <p className="text-[10px] text-stone-500 font-label uppercase tracking-widest">
              {user.role}
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={`${user.name} avatar`}
            className="w-9 h-9 rounded-full object-cover border border-emerald-900/10"
            src={user.avatar}
          />
        </div>
      </div>
    </header>
  );
}
