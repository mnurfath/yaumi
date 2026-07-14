import type { Metadata, Viewport } from "next";
import { Manrope, Newsreader, Noto_Naskh_Arabic } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-noto-naskh-arabic",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: {
    default: "Yaumi - Daily Spiritual Tracker",
    template: "%s | Yaumi",
  },
  description: "Track your daily adhkar and spiritual routines with ease",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Yaumi",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#008151",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${newsreader.variable} ${notoNaskhArabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
