import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-950 p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
