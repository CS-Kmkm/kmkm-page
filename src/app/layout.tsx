import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { defaultMetadata } from "@/lib/metadata";
import WebVitals from "@/components/common/WebVitals";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { siteConfig } from "@/lib/site";

// Optimize font loading with display swap and preload
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const metadata: Metadata = {
  ...defaultMetadata,
  metadataBase: siteConfig.siteUrl ? new URL(siteConfig.siteUrl) : undefined,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={siteConfig.lang} className={inter.variable} suppressHydrationWarning>
      <body className={`font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        
        {/* Web Vitals reporting */}
        <WebVitals />
        
        {/* Performance monitoring script (optional) */}
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
