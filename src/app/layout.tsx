import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Nunito } from "next/font/google";
import { Suspense } from "react";
import { AppProviders } from "@/app/providers";
import { SiteShell } from "@/components/site-shell";
import "@/app/globals.css";

const display = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-display", weight: ["400", "500", "600", "700"] });
const body = Nunito({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "星月赴约 · 京沪专属",
  description: "经典手绘夜空风格的京沪异地恋双人专属网页应用",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0f1d3d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${display.variable} ${body.variable} font-body`}>
        <Suspense fallback={<div className="min-h-screen" />}>
          <AppProviders>
            <SiteShell>{children}</SiteShell>
          </AppProviders>
        </Suspense>
      </body>
    </html>
  );
}
