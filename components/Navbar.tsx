// components/Navbar.tsx
// WHY: Top navigation bar present on all pages.
// Contains the app logo, title, and dark/light mode toggle.

"use client";

import Link from "next/link";
import { CloudSun, Sun, Moon, Wind } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10 dark:border-white/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="SkyPulse Home"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <CloudSun className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse-slow" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-700 leading-none text-slate-900 dark:text-white tracking-tight">
                SkyPulse
              </span>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mt-0.5">
                Weather
              </span>
            </div>
          </Link>

          {/* Center — tagline (hidden on small screens) */}
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Wind className="w-3.5 h-3.5" />
            <span className="font-light">Real-time global weather</span>
          </div>

          {/* Right — Theme toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              className="relative w-13 h-7 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-300 focus-visible:ring-2 ring-blue-400 ring-offset-2"
            >
              {/* Track */}
              <div
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full shadow-md flex items-center justify-center transition-all duration-300 ${
                  isDark
                    ? "translate-x-6.5 bg-indigo-600"
                    : "translate-x-0 bg-amber-400"
                }`}
              >
                {isDark ? (
                  <Moon className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-white" />
                )}
              </div>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}