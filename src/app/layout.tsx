import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ajans Bee AI Platform",
  description: "AI-powered içerik üretim platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
