"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BookOpen, Layers, ArrowLeft, LayoutDashboard } from "lucide-react";

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Layers,
  },
  {
    title: "Adhkars",
    href: "/admin/adhkars",
    icon: BookOpen,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-muted/30 flex flex-col">
      <div className="p-4 border-b">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to App
          </Button>
        </Link>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Admin Panel</h2>
        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));

            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    isActive && "bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.title}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
