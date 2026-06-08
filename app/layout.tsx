// app/layout.tsx
// WHY: Root layout wraps every page. Sets up fonts, metadata, dark mode,
// and any global providers. Runs on the server by default in App Router.

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "SkyPulse — Weather App",
  description:
    "Search any city worldwide and get real-time weather, hourly forecasts, and 7-day outlooks. Powered by Open-Meteo.",
  keywords: ["weather", "forecast", "temperature", "wind", "humidity", "open-meteo"],
  authors: [{ name: "SkyPulse" }],
  openGraph: {
    title: "SkyPulse Weather",
    description: "Real-time global weather forecasts",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0f4ff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1e" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}