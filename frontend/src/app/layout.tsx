import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { MotionProvider } from "../components/MotionProvider";
import { SplashScreen } from "../components/SplashScreen";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChopSnap — Snap your kitchen. Know what to chop.",
  description:
    "ChopSnap helps you cook Nigerian meals with the ingredients you already have, within your budget.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('chopsnap_theme');
                if (stored === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }

                const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                const hasSeen = sessionStorage.getItem('chopsnap_splash_shown');
                if (isReduced || hasSeen === 'true') {
                  document.documentElement.classList.add('splash-skip');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${plusJakarta.variable} ${fraunces.variable} font-sans antialiased min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] selection:bg-[#D9381E] selection:text-white`}
      >
        <MotionProvider>
          <SplashScreen />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
