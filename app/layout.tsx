import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import { auth } from "@/auth";
import { prisma } from "./lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Bifrost',
    default: 'Bifrost - Workforce',
  },
  description: "Modern employee and task management system built with Next.js, Prisma, and PostgreSQL.",
  icons: {
    icon: "/icon.svg",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();

  let accentColor = 'magenta';
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { accentColor: true },
    });

    if (user) {
      accentColor = user.accentColor.toLowerCase();
    }
  }

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      data-accent={accentColor}
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col"
        spellCheck={false}>
        <main>{children}</main>
        <Toaster position="top-right" theme="dark" />
      </body>
    </html>
  );
}
