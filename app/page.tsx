// Home page — landing screen with hero + SearchBar.
// This is a SERVER Component — no 'use client' here.
// Interactive city chips live in a separate client component.

import type { Metadata } from 'next';
import { CloudSun, Wind, Droplets, Thermometer } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import PopularCities from '@/components/PopularCities';

export const metadata: Metadata = {
  title: 'SkyCast — Search World Weather',
  description: 'Search real-time weather for any city worldwide.',
};

const FEATURES = [
  { icon: Thermometer, label: 'Real-time temp' },
  { icon: Wind,        label: 'Wind speed'     },
  { icon: Droplets,    label: 'Humidity'        },
  { icon: CloudSun,    label: '7-day forecast'  },
] as const;

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-4 py-12 sm:px-6">

      <div className="w-full max-w-2xl text-center animate-fade-up">

        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-sky-400 to-blue-600 shadow-2xl shadow-blue-500/40 animate-float">
            <CloudSun className="h-10 w-10 text-white" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-800 dark:text-white sm:text-5xl lg:text-6xl">
          World{' '}
          <span className="bg-linear-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
            Weather
          </span>
        </h1>

        <p className="mb-10 text-base text-slate-500 dark:text-slate-400 sm:text-lg">
          Search any city worldwide for real-time conditions and forecasts.
        </p>

        <div className="relative z-[9999] flex justify-center animate-fade-up-delay">
          <SearchBar />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2 animate-fade-up-delay">
          {FEATURES.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <Icon className="h-3.5 w-3.5 text-blue-500" />
              {label}
            </span>
          ))}
        </div>

        {/* ── Popular cities — client component ────────────────────────────── */}
        <div className="mt-10 animate-fade-up-delay">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Popular cities
          </p>
          <PopularCities />
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <p className="mt-16 text-xs text-slate-400 dark:text-slate-600">
        Powered by{' '}
        <a
          href="https://open-meteo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-blue-500 transition-colors"
        >
          Open-Meteo
        </a>{' '}
        — free, open-source weather API
      </p>
    </div>
  );
}