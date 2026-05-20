import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://r0607.com"),
  title: {
    default: "R0607 - Imagine · Learn · Create",
    template: "%s | R0607",
  },
  description:
    "R0607 is a hands-on robotics learning experience with a personal robot, local AI coach, and Berlin workshop plans.",
  openGraph: {
    title: "R0607",
    description: "Imagine · Learn · Create",
    url: "https://r0607.com",
    siteName: "R0607",
    type: "website",
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme')||'dark';if(t==='system')t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${roboto.variable} ${dmSans.variable} ${jetBrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
