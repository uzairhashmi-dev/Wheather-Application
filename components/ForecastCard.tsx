// components/ForecastCard.tsx
// WHY: Renders both the 7-day daily forecast and the 24-hour hourly forecast.
// Exported as two separate named components: DailyForecast and HourlyForecast.

"use client";

import {
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudFog, CloudDrizzle,
  CloudRain, Snowflake, CloudSnow, CloudLightning, Wind, Droplets,
  TrendingUp, TrendingDown,
} from "lucide-react";
import {
  getWeatherDescription,
  getWeatherIcon,
  formatDay,
  formatHour,
  getCurrentHourIndex,
} from "@/lib/weatherApi";
import { useWeatherStore } from "@/store/weatherStore";

// Icon resolver
const IconMap: Record<string, React.FC<{ className?: string }>> = {
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudFog, CloudDrizzle,
  CloudRain, Snowflake, CloudSnow, CloudLightning,
};

function WIcon({
  code,
  isDay = 1,
  className = "",
}: {
  code: number;
  isDay?: number;
  className?: string;
}) {
  const name = getWeatherIcon(code, isDay);
  const Comp = IconMap[name] ?? Cloud;
  return <Comp className={className} />;
}

// ─── Daily Forecast ─────────────────────────────────────────────────────────
export function DailyForecast() {
  const { weatherData } = useWeatherStore();
  if (!weatherData) return null;

  const { daily } = weatherData;

  return (
    <section aria-label="7-day forecast" className="w-full animate-slide-up">
      <h2 className="font-display text-base font-600 text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
        <span className="text-blue-500">◆</span>
        7-Day Forecast
      </h2>

      {/* Scrollable row of cards */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {daily.time.map((date: string, i: number) => {
          const code = daily.weather_code[i];
          const max = daily.temperature_2m_max[i];
          const min = daily.temperature_2m_min[i];
          const precip = daily.precipitation_sum[i];
          const wind = daily.wind_speed_10m_max[i];
          const isToday = i === 0;

          return (
            <div
              key={date}
              className={`
                shrink-0 w-30 sm:w-32.5
                rounded-2xl p-4 flex flex-col items-center gap-2
                border transition-all duration-200 cursor-default
                hover:shadow-lg hover:-translate-y-0.5
                ${
                  isToday
                    ? "bg-blue-500 dark:bg-blue-600 border-blue-400 text-white shadow-blue-200 dark:shadow-blue-900/40 shadow-md"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }
              `}
            >
              {/* Day label */}
              <span
                className={`text-xs font-semibold uppercase tracking-wide ${
                  isToday ? "text-blue-100" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {formatDay(date)}
              </span>

              {/* Weather icon */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isToday ? "bg-white/20" : "bg-blue-50 dark:bg-slate-700"
                }`}
              >
                <WIcon code={code} className={`w-6 h-6 ${isToday ? "text-white" : "text-blue-500"}`} />
              </div>

              {/* Condition */}
              <span
                className={`text-[10px] text-center leading-tight ${
                  isToday ? "text-blue-100" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {getWeatherDescription(code)}
              </span>

              {/* Max / Min */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="flex items-center gap-0.5 text-sm font-bold">
                  <TrendingUp className="w-3 h-3 text-orange-400" />
                  {Math.round(max)}°
                </span>
                <span
                  className={`flex items-center gap-0.5 text-xs ${
                    isToday ? "text-blue-200" : "text-slate-400"
                  }`}
                >
                  <TrendingDown className="w-3 h-3 text-sky-400" />
                  {Math.round(min)}°
                </span>
              </div>

              {/* Precipitation */}
              {precip > 0 && (
                <div
                  className={`flex items-center gap-1 text-[10px] ${
                    isToday ? "text-blue-100" : "text-blue-400"
                  }`}
                >
                  <Droplets className="w-3 h-3" />
                  {precip.toFixed(1)}mm
                </div>
              )}

              {/* Wind */}
              <div
                className={`flex items-center gap-1 text-[10px] ${
                  isToday ? "text-blue-100" : "text-slate-400 dark:text-slate-500"
                }`}
              >
                <Wind className="w-3 h-3" />
                {Math.round(wind)} km/h
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Hourly Forecast ─────────────────────────────────────────────────────────
export function HourlyForecast() {
  const { weatherData } = useWeatherStore();
  if (!weatherData) return null;

  const { hourly } = weatherData;

  // Show 24 hours starting from current hour
  const startIndex = Math.max(getCurrentHourIndex(hourly.time), 0);
  const hours = hourly.time.slice(startIndex, startIndex + 24);

  return (
    <section aria-label="Hourly forecast" className="w-full animate-slide-up">
      <h2 className="font-display text-base font-600 text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
        <span className="text-purple-500">◆</span>
        24-Hour Forecast
      </h2>

      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
        {hours.map((time: string, idx: number) => {
          const realIndex = startIndex + idx;
          const code = hourly.weather_code[realIndex];
          const temp = hourly.temperature_2m[realIndex];
          const humidity = hourly.relative_humidity_2m[realIndex];
          const precipProb = hourly.precipitation_probability[realIndex];
          const isNow = idx === 0;
          const isNight = new Date(time).getHours() >= 20 || new Date(time).getHours() < 6;

          return (
            <div
              key={time}
              className={`
                shrink-0 w-20
                rounded-2xl p-3 flex flex-col items-center gap-1.5
                border transition-all duration-200 cursor-default
                hover:shadow-md hover:-translate-y-0.5
                ${
                  isNow
                    ? "bg-purple-500 dark:bg-purple-600 border-purple-400 text-white"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }
              `}
            >
              {/* Hour */}
              <span
                className={`text-[11px] font-semibold ${
                  isNow ? "text-purple-100" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {isNow ? "Now" : formatHour(time)}
              </span>

              {/* Icon */}
              <WIcon
                code={code}
                isDay={isNight ? 0 : 1}
                className={`w-6 h-6 ${isNow ? "text-white" : "text-blue-500"}`}
              />

              {/* Temp */}
              <span className="font-bold text-sm">{Math.round(temp)}°</span>

              {/* Rain probability */}
              {precipProb !== undefined && precipProb > 0 && (
                <div
                  className={`flex items-center gap-0.5 text-[10px] ${
                    isNow ? "text-purple-100" : "text-blue-400"
                  }`}
                >
                  <Droplets className="w-2.5 h-2.5" />
                  {precipProb}%
                </div>
              )}

              {/* Humidity */}
              <div
                className={`flex items-center gap-0.5 text-[10px] ${
                  isNow ? "text-purple-100" : "text-slate-400 dark:text-slate-500"
                }`}
              >
                💧{humidity}%
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}