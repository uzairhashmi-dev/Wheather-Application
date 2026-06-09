// Root layout — rendered once, wraps every page in the app.
// Responsibilities:
//   • Sets HTML lang + font variables
//   • Wraps everything in ThemeProvider (dark/light mode)
//   • Renders Navbar at the top (always visible)
//   • Defines app-level metadata (SEO title, description, icons)

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import './globals.css';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});


export const metadata: Metadata = {
  title: {
    default: 'SkyCast — World Weather App',
    template: '%s | SkyCast',
  },
  description:
    'Search real-time weather for any city worldwide. Get current conditions, hourly forecasts, and 7-day outlooks powered by Open-Meteo.',
  keywords: ['weather', 'forecast', 'temperature', 'wind', 'humidity', 'open-meteo'],
  authors: [{ name: 'SkyCast' }],
  creator: 'SkyCast',
  metadataBase: new URL('https://skycast-weather.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'SkyCast — World Weather App',
    description: 'Real-time weather for any city worldwide.',
    siteName: 'SkyCast',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkyCast — World Weather App',
    description: 'Real-time weather for any city worldwide.',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans" suppressHydrationWarning>
        <ThemeProvider>
          <Navbar />
          <main className="min-h-[calc(100dvh-4rem)]">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}