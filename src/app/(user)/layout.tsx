import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { PullToRefresh } from "@/components/pull-to-refresh";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16">
        <PullToRefresh>{children}</PullToRefresh>
      </main>
      <BottomNav />
    </div>
  );
}