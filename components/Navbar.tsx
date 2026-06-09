// Contains: app logo/brand, temperature unit toggle (°C / °F), dark/light
// mode toggle. Fully responsive — collapses gracefully on mobile.

'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { Sun, Moon, Thermometer, CloudSun } from 'lucide-react';

import { useTemperatureUnit } from '@/store/weatherStore';


export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { unit, setUnit } = useTemperatureUnit();

  // Hydration guard: false on server, true on client — no useEffect needed
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isDark = theme === 'dark';

  function toggleTheme() {
    setTheme(isDark ? 'light' : 'dark');
  }

  function toggleUnit() {
    setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius');
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-md dark:bg-slate-900/80 dark:border-slate-700/50 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-sky-400 to-blue-600 shadow-lg shadow-blue-500/30">
            <CloudSun className="h-5 w-5 text-white" strokeWidth={2} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight text-slate-800 dark:text-white">
              SkyCast
            </span>
            <span className="hidden text-[10px] font-medium tracking-widest text-slate-400 dark:text-slate-500 sm:block">
              WEATHER APP
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">

          {/* Temperature unit toggle */}
          <button
            onClick={toggleUnit}
            aria-label={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
            className="group flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950 dark:hover:text-blue-400"
          >
            <Thermometer className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
            <span className="w-6 text-center tabular-nums">
              {unit === 'celsius' ? '°C' : '°F'}
            </span>
          </button>

          {/* Dark / light mode toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="group flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
            >
              {isDark ? (
                <Sun className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12" />
              )}
            </button>
          )}

          <div className="hidden items-center gap-1.5 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              Live
            </span>
          </div>

        </div>
      </div>
    </header>
  );
}