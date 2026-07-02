import type { Metadata } from "next";
import { DotGothic16, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";

const dotGothic = DotGothic16({
  variable: "--font-dotgothic",
  weight: "400",
  subsets: ["latin"],
});

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zenkaku",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SHRIVAS-64",
  description:
    "A console that boots one person: Shrivas VM — founder, designer, developer. Insert curiosity. Press START.",
  openGraph: {
    title: "SHRIVAS-64",
    description:
      "A console that boots one person: Shrivas VM — founder, designer, developer. Press START.",
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
      className={`${dotGothic.variable} ${zenKaku.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
