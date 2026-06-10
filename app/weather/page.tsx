'use client';

// Weather results page — shown after user selects a city.
// Reads state from Zustand store (no props, no URL params needed).
// Handles all 4 states: idle → redirect home, loading → skeleton,
// error → error card, success → full weather display.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

import { useWeatherStore } from '@/store/weatherStore';
import WeatherCard from '@/components/WeatherCard';
import ForecastCard from '@/components/ForecastCard';
import { FullPageSkeleton } from '@/components/Loader';
import SearchBar from '@/components/SearchBar';


export default function WeatherPage() {
  const router = useRouter();
  const { status, weather, error, clearError } = useWeatherStore();

  // If user lands here without any data (direct URL, refresh), send home
  useEffect(() => {
    if (status === 'idle') {
      router.replace('/');
    }
  }, [status, router]);

  // ── Loading state 
  if (status === 'loading') {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
        {/* Search bar stays visible during loading */}
        <div className="mb-6 relative z-[9999] flex justify-center">
          <SearchBar />
        </div>
        <FullPageSkeleton />
      </div>
    );
  }

  // ── Error state 
  if (status === 'error') {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl dark:border-red-900/50 dark:bg-slate-800">

          {/* Error icon */}
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/50">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <h2 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">
            Failed to Load Weather
          </h2>

          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            {error ?? 'Something went wrong. Please try again.'}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => {
                clearError();
                router.push('/');
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </button>

            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Idle (before redirect fires) — render nothing
  if (status === 'idle' || !weather) {
    return null;
  }

  // ── Success state 
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:py-8">

      {/* Search bar — always accessible at top of results */}
      <div className="mb-6 relative z-[9999] flex justify-center animate-fade-in">
        <SearchBar />
      </div>

      {/* Main weather card */}
      <div className="mb-5 animate-fade-up">
        <WeatherCard data={weather} />
      </div>

      {/* Hourly + daily forecast */}
      <div className="animate-fade-up-delay">
        <ForecastCard hourly={weather.hourly} daily={weather.daily} />
      </div>

      {/* Last updated note */}
      <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-600">
        Data refreshes on each search · Powered by Open-Meteo
      </p>
    </div>
  );
}