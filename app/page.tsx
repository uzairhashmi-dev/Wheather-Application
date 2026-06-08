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
    searchCity(city);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-16 sm:py-24 lg:py-32 relative overflow-hidden">

        {/* ── Background Atmosphere ─────────────────────────────────── */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          {/* Radial mesh gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 70% at 50% -10%, rgba(59,130,246,0.13) 0%, transparent 65%), " +
                "radial-gradient(ellipse 65% 55% at 85% 85%, rgba(139,92,246,0.10) 0%, transparent 55%)",
            }}
          />
          {/* Left blob */}
          <div
            className="absolute -top-10 -left-24 w-96 h-96 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)" }}
          />
          {/* Right blob */}
          <div
            className="absolute -bottom-10 -right-24 w-md h-112 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
          />
          {/* Center glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full blur-3xl opacity-30"
            style={{ background: "radial-gradient(circle, rgba(99,179,237,0.08) 0%, transparent 70%)" }}
          />
        </div>

        {/* ── Content Wrapper ───────────────────────────────────────── */}
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center">

          {/* App Icon */}
          <div className="relative mb-8 sm:mb-10 animate-float">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl flex items-center justify-center"
              style={{
                background: "linear-gradient(145deg, #60a5fa 0%, #3b82f6 45%, #4f46e5 100%)",
                boxShadow:
                  "0 24px 64px -12px rgba(59,130,246,0.55), 0 0 0 1px rgba(255,255,255,0.12) inset",
              }}
            >
              <CloudSun className="w-11 h-11 sm:w-14 sm:h-14 text-white" strokeWidth={1.5} />
            </div>
            {/* Badge */}
            <div
              className="absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                boxShadow: "0 4px 12px rgba(245,158,11,0.5)",
              }}
            >
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="currentColor" />
            </div>
          </div>

          {/* ── Headline ─────────────────────────────────────────────── */}
          <div className="mb-5 animate-fade-in">
            <h1
              className="font-display font-extrabold tracking-tight leading-[1.04] mb-4"
              style={{
                fontSize: "clamp(2.4rem, 6.5vw, 4.25rem)",
                color: "var(--text-primary)",
              }}
            >
              Real-Time{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Weather
              </span>
              <br />
              for Any City
            </h1>
            <p
              className="text-base sm:text-lg font-light leading-relaxed max-w-sm sm:max-w-md mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              Search any city in the world and get live weather, hourly forecasts,
              and a 7-day outlook — completely free.
            </p>
          </div>

          {/* ── Feature Pills ─────────────────────────────────────────── */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10 animate-fade-in">
            {[
              { icon: <Globe className="w-3.5 h-3.5" />, text: "Any City Worldwide" },
              { icon: <Zap className="w-3.5 h-3.5" />, text: "Real-Time Data" },
              { icon: <Wind className="w-3.5 h-3.5" />, text: "7-Day Forecast" },
            ].map((pill) => (
              <span
                key={pill.text}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-glass)",
                  color: "var(--text-secondary)",
                  boxShadow: "0 2px 8px var(--shadow-color)",
                }}
              >
                <span style={{ color: "var(--accent)" }}>{pill.icon}</span>
                {pill.text}
              </span>
            ))}
          </div>

          {/* ── Search Bar ────────────────────────────────────────────── */}
          <div className="w-full animate-slide-up">
            {/*
              glass-card wraps SearchBar to give it the frosted-glass treatment.
              The SearchBar itself remains unstyled from this wrapper's perspective.
            */}
            <div
              className="glass-card p-2"
              style={{ borderRadius: "1.25rem" }}
            >
              <SearchBar />
            </div>
          </div>

          {/* ── Popular / Quick Search ────────────────────────────────── */}
          <div className="mt-7 sm:mt-8 animate-fade-in w-full">
            <p
              className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.16em] mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              Quick Search
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => handleQuickCity(city)}
                  className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:-translate-y-px active:scale-95"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-glass)",
                    color: "var(--text-secondary)",
                    boxShadow: "0 1px 4px var(--shadow-color)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = "var(--accent)";
                    el.style.color = "var(--accent)";
                    el.style.boxShadow = "0 4px 14px var(--shadow-color)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = "var(--border-glass)";
                    el.style.color = "var(--text-secondary)";
                    el.style.boxShadow = "0 1px 4px var(--shadow-color)";
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* ── Loading Feedback ──────────────────────────────────────── */}
          {isLoadingWeather && (
            <div
              className="mt-6 flex items-center gap-2.5 px-5 py-2.5 rounded-full"
              style={{
                backgroundColor: "rgba(59,130,246,0.08)",
                border: "1px solid rgba(59,130,246,0.18)",
              }}
            >
              <div
                className="w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
              />
              <span className="text-sm font-medium" style={{ color: "var(--accent)" }}>
                Loading weather...
              </span>
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer
        className="py-5 text-center text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        Powered by{" "}
        <a
          href="https://open-meteo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-medium"
          style={{ color: "var(--accent)" }}
        >
          Open-Meteo
        </a>{" "}
        · Free &amp; No API Key Required
      </footer>
    </div>
  );
}