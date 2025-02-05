import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Logo from "@/components/logo";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { Providers } from "./providers";
import "./globals.css";
import JoinSVG from '@/public/join.svg'
import { createClient } from "@/utils/supabase/server";
import { NavLinks } from "@/components/nav-links";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "KeyBox | Modern Environment Variable Management",
  description: "Securely manage, share, and sync your environment variables across your team and deployments",
  keywords: ["environment variables", "secrets management", "devops", "configuration", "security"],
  authors: [{ name: "CS Magic" }],
  openGraph: {
    title: "KeyBox | Modern Environment Variable Management",
    description: "Securely manage, share, and sync your environment variables across your team and deployments",
    url: defaultUrl,
    siteName: "KeyBox",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KeyBox | Modern Environment Variable Management",
    description: "Securely manage, share, and sync your environment variables across your team and deployments",
  },
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-mono',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} font-sans`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col">
        <Providers>
          <main className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col gap-8 md:gap-20 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10">
                <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-stretch md:items-center py-4 px-5 md:py-3">
                  <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 md:gap-6">
                    <Link 
                      href={"/"} 
                      className="flex items-center gap-2 text-lg md:text-base font-semibold hover:opacity-70 transition-opacity"
                    >
                      <Logo mode="svg" className="h-8 w-auto" color="currentColor" />
                      <JoinSVG />
                      <span>KeyBox</span>
                    </Link>


                    <div className="flex gap-6">
                      <NavLinks />
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex justify-center items-center">
                    {!hasEnvVars ? (
                      <EnvVarWarning />
                    ) : (
                      <div className="flex gap-4 items-center">
                        <Suspense fallback={<div>Loading...</div>}>
                        <DeployButton />
 
                          <HeaderAuth />
                        </Suspense>
                      </div>
                    )}
                  </div>
                </div>
              </nav>

              
              <div className="flex flex-col gap-8 md:gap-20 w-full max-w-5xl px-4 md:px-5">
                {children}
              </div>
            </div>
          </main>
          <footer className="w-full border-t border-border/40 bg-muted/50">
                <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex flex-col md:flex-row items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                          <Logo mode="svg" className="h-6 w-auto" color="currentColor" />
                          <span className="font-semibold">KeyBox</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          © {new Date().getFullYear()} CS Magic. All rights reserved.
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <ThemeSwitcher />
                        <a
                          href="https://github.com/markshawn2020"
                          target="_blank"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          rel="noreferrer"
                        >
                          GitHub
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
                      <Link href="/terms" className="hover:text-foreground transition-colors">
                        用户协议
                      </Link>
                      <Link href="/privacy" className="hover:text-foreground transition-colors">
                        隐私政策
                      </Link>
                      <Link href="/docs" className="hover:text-foreground transition-colors">
                        文档中心
                      </Link>
                      <Link href="/settings" className="hover:text-foreground transition-colors">
                        账户设置
                      </Link>
                      <a 
                        href="mailto:support@csmagic.com"
                        className="hover:text-foreground transition-colors"
                      >
                        联系我们
                      </a>
                    </div>
                  </div>
                </div>
              </footer>
              <Analytics />
              <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
