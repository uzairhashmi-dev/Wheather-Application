// components/WeatherCard.tsx
// WHY: Displays the current weather conditions for the selected city.
// Shows temperature, condition, wind, humidity, feels-like, and sunrise/sunset.
// This is the "hero" card — the most prominent part of the UI.

"use client";

import {
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Sunrise,
  Sunset,
  MapPin,
  CloudRain,
  Sun,
  Moon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain as CloudRainIcon,
  Snowflake,
  CloudSnow,
  CloudLightning,
  CloudSun,
  CloudMoon,
  RefreshCw,
} from "lucide-react";
import {
  getWeatherDescription,
  getWeatherIcon,
  getWeatherGradient,
  formatTemperature,
  formatTime,
} from "@/lib/weatherApi";
import { useWeatherStore } from "@/store/weatherStore";

// Icon map — maps lucide icon name string → actual component
const IconMap: Record<string, React.FC<{ className?: string }>> = {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudFog,
  CloudDrizzle,
  CloudRain: CloudRainIcon,
  Snowflake,
  CloudSnow,
  CloudLightning,
};

function WeatherIcon({ code, isDay, className = "" }: { code: number; isDay: number; className?: string }) {
  const iconName = getWeatherIcon(code, isDay);
  const IconComponent = IconMap[iconName] ?? Cloud;
  return <IconComponent className={className} />;
}

export default function WeatherCard() {
  const { weatherData, selectedCity, fetchWeather, isLoadingWeather } = useWeatherStore();

  if (!weatherData || !selectedCity) return null;

  const { current, daily } = weatherData;
  const gradient = getWeatherGradient(current.weather_code, current.is_day);
  const isDay = current.is_day === 1;

  const handleRefresh = () => {
    if (selectedCity) fetchWeather(selectedCity);
  };

  const sunrise = daily.sunrise?.[0];
  const sunset = daily.sunset?.[0];

  return (
    <div
      className={`
        w-full rounded-3xl overflow-hidden
        bg-linear-to-br ${gradient}
        shadow-2xl animate-scale-in
        relative
      `}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/10 blur-xl" />
      </div>

      <div className="relative p-6 sm:p-8 text-white">
        {/* Header: City + Refresh */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-white/70" />
              <span className="text-sm text-white/70 font-medium">
                {selectedCity.country}
                {selectedCity.admin1 ? ` · ${selectedCity.admin1}` : ""}
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-700 leading-tight">
              {selectedCity.name}
            </h1>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={handleRefresh}
              disabled={isLoadingWeather}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
              aria-label="Refresh weather"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoadingWeather ? "animate-spin" : ""}`}
              />
            </button>
            <span
              className={`
                text-xs px-2.5 py-1 rounded-full font-semibold
                ${isDay ? "bg-amber-400/30 text-amber-100" : "bg-indigo-400/30 text-indigo-100"}
              `}
            >
              {isDay ? "☀️ Daytime" : "🌙 Night"}
            </span>
          </div>
        </div>

        {/* Temperature + Weather Icon */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="font-display text-7xl sm:text-8xl font-700 leading-none tracking-tighter mb-2">
              {Math.round(current.temperature_2m)}°
              <span className="text-3xl text-white/70">C</span>
            </div>
            <p className="text-lg text-white/90 font-medium mb-1">
              {getWeatherDescription(current.weather_code)}
            </p>
            <p className="text-sm text-white/70">
              Feels like {formatTemperature(current.apparent_temperature)}
            </p>
          </div>

          {/* Big weather icon */}
          <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-float">
            <WeatherIcon
              code={current.weather_code}
              isDay={current.is_day}
              className="w-14 h-14 sm:w-16 sm:h-16 text-white"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Humidity */}
          <StatCard
            icon={<Droplets className="w-4 h-4" />}
            label="Humidity"
            value={`${current.relative_humidity_2m}%`}
            sub={
              current.relative_humidity_2m > 70
                ? "High"
                : current.relative_humidity_2m > 40
                ? "Normal"
                : "Low"
            }
          />

          {/* Wind Speed */}
          <StatCard
            icon={<Wind className="w-4 h-4" />}
            label="Wind"
            value={`${Math.round(current.wind_speed_10m)} km/h`}
            sub={
              current.wind_speed_10m > 50
                ? "Strong"
                : current.wind_speed_10m > 20
                ? "Moderate"
                : "Light"
            }
          />

          {/* Precipitation */}
          <StatCard
            icon={<CloudRain className="w-4 h-4" />}
            label="Precipitation"
            value={`${current.precipitation} mm`}
            sub="Today"
          />

          {/* Feels Like */}
          <StatCard
            icon={<Thermometer className="w-4 h-4" />}
            label="Feels Like"
            value={formatTemperature(current.apparent_temperature)}
            sub={
              current.apparent_temperature < current.temperature_2m
                ? "↓ Cooler"
                : current.apparent_temperature > current.temperature_2m
                ? "↑ Warmer"
                : "Same"
            }
          />
        </div>

        {/* Sunrise / Sunset */}
        {sunrise && sunset && (
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/15 backdrop-blur-sm px-4 py-3">
            <div className="flex items-center gap-2">
              <Sunrise className="w-4 h-4 text-amber-300" />
              <div>
                <p className="text-[10px] text-white/60 uppercase tracking-widest">
                  Sunrise
                </p>
                <p className="text-sm font-semibold">{formatTime(sunrise)}</p>
              </div>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <Sunset className="w-4 h-4 text-orange-300" />
              <div>
                <p className="text-[10px] text-white/60 uppercase tracking-widest">
                  Sunset
                </p>
                <p className="text-sm font-semibold">{formatTime(sunset)}</p>
              </div>
            </div>
            <div className="h-6 w-px bg-white/20 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <Eye className="w-4 h-4 text-white/60" />
              <div>
                <p className="text-[10px] text-white/60 uppercase tracking-widest">
                  Elevation
                </p>
                <p className="text-sm font-semibold">
                  {Math.round(weatherData.elevation)}m
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Timezone */}
        <p className="mt-3 text-center text-xs text-white/50">
          Timezone: {weatherData.timezone} ({weatherData.timezone_abbreviation})
        </p>
      </div>
    </div>
  );
}

// ─── Stat Card sub-component ─────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl bg-white/20 backdrop-blur-sm p-3 sm:p-4">
      <div className="flex items-center gap-1.5 text-white/70 mb-1.5">
        {icon}
        <span className="text-[10px] uppercase tracking-wider font-medium">
          {label}
        </span>
      </div>
      <p className="font-semibold text-base sm:text-lg leading-tight">{value}</p>
      {sub && (
        <p className="text-[11px] text-white/60 mt-0.5">{sub}</p>
      )}
    </div>
  );
}