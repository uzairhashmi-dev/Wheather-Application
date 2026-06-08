// app/weather/page.tsx
"use client";

import { useWeatherStore } from "@/store/weatherStore";
import SearchBar from "@/components/SearchBar";
import WeatherCard from "@/components/WeatherCard";

export default function WeatherPage() {
  const { weatherData, selectedCity, isLoadingWeather, weatherError } =
    useWeatherStore();

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            SkyPulse
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Real-time weather for any city
          </p>
        </div>

        {/* Search */}
        <SearchBar />

        {/* Loading */}
        {isLoadingWeather && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            Fetching weather...
          </div>
        )}

        {/* Error */}
        {weatherError && !isLoadingWeather && (
          <div className="text-center py-12 text-red-400">
            {weatherError}
          </div>
        )}

        {/* Weather Card */}
        {weatherData && selectedCity && !isLoadingWeather && (
          <WeatherCard />
        )}

        {/* Empty state */}
        {!weatherData && !isLoadingWeather && !weatherError && (
          <div className="text-center py-16 text-slate-400 dark:text-slate-500">
            Search a city to see weather
          </div>
        )}
      </div>
    </main>
  );
}