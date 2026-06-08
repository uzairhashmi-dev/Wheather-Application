// lib/weatherApi.ts
// WHY: All weather data fetching logic lives here.
// Components never touch raw API URLs — they use this clean abstraction.

import { WeatherResponse } from "@/types/weather";

const WEATHER_BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function fetchWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),

    // Current weather fields
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
    ].join(","),

    // Hourly fields (next 24 hours)
    hourly: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation_probability",
      "weather_code",
      "wind_speed_10m",
    ].join(","),

    // Daily fields (7-day forecast)
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
      "precipitation_sum",
      "wind_speed_10m_max",
    ].join(","),

    timezone: "auto", // Use location's local timezone
    forecast_days: "7",
  });

  const url = `${WEATHER_BASE_URL}?${params.toString()}`;

  const response = await fetch(url, {
    next: { revalidate: 1800 }, // Cache for 30 minutes
  });

  if (!response.ok) {
    throw new Error(
      `Weather API failed: ${response.status} ${response.statusText}`
    );
  }

  const data: WeatherResponse = await response.json();
  return data;
}

// ─── WMO Weather Interpretation Code helpers ────────────────────────────────
// Source: https://open-meteo.com/en/docs#weathervariables

export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Icy Fog",
    51: "Light Drizzle",
    53: "Drizzle",
    55: "Heavy Drizzle",
    61: "Light Rain",
    63: "Rain",
    65: "Heavy Rain",
    71: "Light Snow",
    73: "Snow",
    75: "Heavy Snow",
    77: "Snow Grains",
    80: "Light Showers",
    81: "Showers",
    82: "Heavy Showers",
    85: "Snow Showers",
    86: "Heavy Snow Showers",
    95: "Thunderstorm",
    96: "Thunderstorm & Hail",
    99: "Severe Thunderstorm",
  };
  return descriptions[code] ?? "Unknown";
}

export function getWeatherIcon(code: number, isDay: number = 1): string {
  // Returns lucide-react icon names
  if (code === 0) return isDay ? "Sun" : "Moon";
  if (code <= 2) return isDay ? "CloudSun" : "CloudMoon";
  if (code === 3) return "Cloud";
  if (code <= 48) return "CloudFog";
  if (code <= 55) return "CloudDrizzle";
  if (code <= 65) return "CloudRain";
  if (code <= 77) return "Snowflake";
  if (code <= 82) return "CloudRain";
  if (code <= 86) return "CloudSnow";
  return "CloudLightning";
}

export function getWeatherGradient(code: number, isDay: number = 1): string {
  if (code === 0 && isDay) return "from-amber-400 via-orange-300 to-yellow-200";
  if (code === 0 && !isDay) return "from-slate-800 via-indigo-900 to-slate-900";
  if (code <= 2 && isDay) return "from-sky-400 via-blue-300 to-cyan-200";
  if (code <= 2 && !isDay) return "from-slate-700 via-blue-900 to-indigo-900";
  if (code === 3) return "from-slate-400 via-gray-400 to-zinc-300";
  if (code <= 48) return "from-slate-500 via-gray-400 to-slate-300";
  if (code <= 65) return "from-slate-600 via-blue-500 to-cyan-400";
  if (code <= 77) return "from-sky-200 via-blue-100 to-white";
  if (code <= 82) return "from-slate-700 via-blue-600 to-slate-500";
  return "from-slate-800 via-purple-900 to-indigo-900";
}

export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDay(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function formatHour(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffH = Math.round((date.getTime() - now.getTime()) / 3600000);
  if (diffH === 0) return "Now";
  return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
}

export function getWindDirection(degrees: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(degrees / 45) % 8];
}

// Get current hour index from hourly data
export function getCurrentHourIndex(times: string[]): number {
  const now = new Date();
  return times.findIndex((t) => {
    const d = new Date(t);
    return d.getHours() === now.getHours() && d.toDateString() === now.toDateString();
  });
}