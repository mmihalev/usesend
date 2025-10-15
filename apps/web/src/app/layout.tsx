import "@usesend/ui/styles/globals.css";

import { Inter } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@usesend/ui";
import { Toaster } from "@usesend/ui/src/toaster";

import { TRPCReactProvider } from "~/trpc/react";
import { Metadata } from "next";
import { BrandingProvider } from "~/providers/branding-context";
import { env } from "~/env";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: process.env.USESEND_META_TITLE || "useSend",
  description:
    process.env.USESEND_META_DESCRIPTION || "Open source email platform",
  icons: [{ rel: "icon", url: process.env.USESEND_META_ICON || "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appName = env.USESEND_APP_NAME || "useSend";
  const docsUrl = env.USESEND_DOCS_URL || "https://docs.usesend.com";

  return (
    <html lang="en" suppressHydrationWarning className="bg-sidebar-background">
      <body
        className={`font-sans ${inter.variable} ${jetbrainsMono.variable} app bg-sidebar-background`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster />
          <BrandingProvider value={{ appName, docsUrl }}>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </BrandingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
