import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spedizioni Tracker - GLS",
  description: "Monitoraggio spedizioni GLS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
