import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { DM_Serif_Display, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { shadcn } from '@clerk/themes'

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Christian Church - Welcome Home",
  description:
      "A multi-generational church in Supply Co., Muttom, Thodupuzha",
};

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <ClerkProvider appearance={{
          theme: shadcn,
      }} publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${inter.variable} ${dmSerif.variable} font-sans antialiased`}
        >
        {children}
        <Analytics />
        </body>
        </html>
      </ClerkProvider>
  );
}