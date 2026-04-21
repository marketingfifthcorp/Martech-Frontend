import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

type DashboardShellProps = {
  children: React.ReactNode;
  searchPlaceholder?: string;
  contextLabel?: string;
};

export function DashboardShell({
  children,
  searchPlaceholder,
  contextLabel,
}: DashboardShellProps) {
  return (
    <>
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <TopBar
          searchPlaceholder={searchPlaceholder}
          contextLabel={contextLabel}
        />
        <div className="pt-16">{children}</div>
      </main>
      {/* Background textures */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-secondary-container/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
    </>
  );
}
