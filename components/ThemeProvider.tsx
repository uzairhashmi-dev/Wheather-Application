// components/ThemeProvider.tsx
// Wraps the entire app with next-themes so every component can read/toggle
// dark or light mode without prop-drilling.
// Used once in app/layout.tsx — never imported by individual pages.

'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"        // adds class="dark" on <html> — Tailwind reads this
      defaultTheme="system"    // respects OS preference on first visit
      enableSystem             // auto-switches with OS setting
      disableTransitionOnChange // prevents flash of wrong colours on switch
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}