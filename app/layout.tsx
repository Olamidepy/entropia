import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ENTROPIA | AI Survival Intelligence Platform",
  description:
    "Autonomous survival intelligence platform monitoring digital projects, financial runways, storage deals, and risk signals with deterministic scoring and Filecoin preservation.",
  icons: {
    icon: "/images/entropia-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-white text-slate-900 antialiased selection:bg-orange-100 selection:text-orange-900 font-['Plus_Jakarta_Sans',sans-serif]">
        {children}
      </body>
    </html>
  );
}
