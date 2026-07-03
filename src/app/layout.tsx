import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://shrivas.dev"),
  title: "SHRIVAS PS",
  description:
    "A console that boots one person: Shrivas VM — founder, designer, developer. Insert curiosity. Press START.",
  openGraph: {
    title: "SHRIVAS PS",
    description:
      "A console that boots one person: Shrivas VM — founder, designer, developer. Press START.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "SHRIVAS PS home screen" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SHRIVAS PS",
    description: "A console that boots one person. Press START.",
    images: ["/og.png"],
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
      className="h-full antialiased"
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
