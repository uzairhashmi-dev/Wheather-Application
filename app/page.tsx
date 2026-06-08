// app/page.tsx
// WHY: The root landing page. Shown when the user first opens the app.
// Has a beautiful hero section with a search bar.
// Redirects to /weather after a city is selected.

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CloudSun, Globe, Zap, Wind } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import Navbar from "@/components/Navbar";
import { useWeatherStore } from "@/store/weatherStore";

const POPULAR_CITIES = [
  "Lahore", "Karachi", "London", "New York", "Tokyo",
  "Dubai", "Paris", "Sydney", "Toronto",
];

export default function HomePage() {
  const router = useRouter();
  const { weatherData, isLoadingWeather, searchCity, setSearchQuery } = useWeatherStore();

  // When weather is loaded, navigate to /weather
  useEffect(() => {
    if (weatherData) {
      router.push("/weather");
    }
  }, [weatherData, router]);

  const handleQuickCity = (city: string) => {
    setSearchQuery(city);
    searchCity(city).then(() => {
      // Auto-select first result via fetchWeather trigger in store
    });
    // After searchCity resolves, user picks from dropdown in SearchBar
  };

  return (
    <div className="min-h-screen flex flex-col bg-(--bg-primary)">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24">
        {/* Floating decorative blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        {/* Big icon */}
        <div className="relative mb-8 animate-float">
          <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-blue-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
            <CloudSun className="w-14 h-14 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center shadow-lg">
            <Zap className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-4 animate-fade-in">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-800 tracking-tight text-slate-900 dark:text-white mb-3">
            Real-Time{" "}
            <span className="text-gradient">Weather</span>
            <br />
            for Any City
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-light max-w-md mx-auto">
            Search any city in the world and get live weather, hourly forecasts,
            and a 7-day outlook — completely free.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 animate-fade-in">
          {[
            { icon: <Globe className="w-3.5 h-3.5" />, text: "Any City Worldwide" },
            { icon: <Zap className="w-3.5 h-3.5" />, text: "Real-Time Data" },
            { icon: <Wind className="w-3.5 h-3.5" />, text: "7-Day Forecast" },
          ].map((pill) => (
            <span
              key={pill.text}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 font-medium shadow-sm"
            >
              <span className="text-blue-500">{pill.icon}</span>
              {pill.text}
            </span>
          ))}
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-2xl animate-slide-up">
          <SearchBar />
        </div>

        {/* Popular cities */}
        <div className="mt-8 text-center animate-fade-in">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest">
            Quick Search
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_CITIES.map((city) => (
              <button
                key={city}
                onClick={() => handleQuickCity(city)}
                className="
                  px-3 py-1.5 rounded-full text-sm
                  bg-white dark:bg-slate-800
                  border border-slate-200 dark:border-slate-700
                  text-slate-600 dark:text-slate-400
                  hover:border-blue-400 hover:text-blue-500 dark:hover:text-blue-400
                  hover:bg-blue-50 dark:hover:bg-blue-900/20
                  transition-all duration-200 font-medium
                "
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Loading feedback */}
        {isLoadingWeather && (
          <div className="mt-6 flex items-center gap-2 text-blue-500 animate-pulse">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading weather...</span>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 dark:text-slate-600">
        Powered by{" "}
        <a
          href="https://open-meteo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Open-Meteo
        </a>{" "}
        · Free & No API Key Required
      </footer>
    </div>
  );
}