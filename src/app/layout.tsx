import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
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
    default: "R0607 - Build the robot. Learn the future.",
    template: "%s | R0607",
  },
  description:
    "R0607 is a hands-on robotics learning experience with a personal robot, local AI coach, and Berlin workshop plans.",
  openGraph: {
    title: "R0607",
    description: "Build the robot. Learn the future.",
    url: "https://r0607.com",
    siteName: "R0607",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${orbitron.variable} ${dmSans.variable} ${jetBrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
