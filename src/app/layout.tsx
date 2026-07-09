import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Canada Again",
  description: "가족 캐나다 여행 허브",
  applicationName: "Canada Again",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Canada Again",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#d52b1e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full text-slate-950">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
