// Two responsibilities:
//   1. Fetch raw weather data from Open-Meteo Forecast API
//   2. Transform that raw payload into clean, UI-ready ProcessedWeatherData
//
// Components and the Zustand store import fetchWeatherData() and never touch
// the raw API shapes directly.

import type {
  GeocodingResult,
  WeatherApiResponse,
  ProcessedWeatherData,
  HourlyForecast,
  DailyForecast,
  WeatherCodeInfo,
} from '@/types/weather';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// Public API

/**
 * Fetches and fully processes weather data for a geocoded location.
 *
 * @param location  A GeocodingResult (from geocodingApi) with lat/lng
 * @returns         ProcessedWeatherData ready to drop into UI components
 * @throws          WeatherApiError on network / HTTP failure
 */
export async function fetchWeatherData(
  location: GeocodingResult
): Promise<ProcessedWeatherData> {
  const url = buildWeatherUrl(location.latitude, location.longitude);

  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    throw new WeatherApiError(
      `Weather API responded with status ${response.status}`,
      response.status
    );
  }

  const raw: WeatherApiResponse = await response.json();
  return transformWeatherData(raw, location);
}

// URL builder
// 

function buildWeatherUrl(latitude: number, longitude: number): string {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    // Hourly variables
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'weather_code',
      'wind_speed_10m',
    ].join(','),
    // Daily variables
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'precipitation_sum',
      'wind_speed_10m_max',
    ].join(','),
    wind_speed_unit: 'kmh',
    timezone: 'auto',            // let the API infer from coordinates
    forecast_days: '7',
  });

  return `${BASE_URL}?${params.toString()}`;
}

// Transformation layer

function transformWeatherData(
  raw: WeatherApiResponse,
  location: GeocodingResult
): ProcessedWeatherData {
  const now = new Date();

  // ── Find the index of the current hour in the hourly arrays ───────────────
  const currentHourIndex = findCurrentHourIndex(raw.hourly.time, now);

  // ── Current conditions 
  const currentCode = raw.hourly.weather_code[currentHourIndex] ?? 0;
  const codeInfo = getWeatherCodeInfo(currentCode);
  const isDay = checkIfDay(raw.daily.sunrise, raw.daily.sunset, now);

  // ── Process next 24 hourly slots ─
  const hourly: HourlyForecast[] = [];
  const endIndex = Math.min(currentHourIndex + 24, raw.hourly.time.length);

  for (let i = currentHourIndex; i < endIndex; i++) {
    const code = raw.hourly.weather_code[i] ?? 0;
    hourly.push({
      time: formatHourlyTime(raw.hourly.time[i]),
      temperature: Math.round(raw.hourly.temperature_2m[i] ?? 0),
      feelsLike: Math.round(raw.hourly.apparent_temperature[i] ?? 0),
      humidity: Math.round(raw.hourly.relative_humidity_2m[i] ?? 0),
      windSpeed: Math.round(raw.hourly.wind_speed_10m[i] ?? 0),
      precipitationProbability: Math.round(
        raw.hourly.precipitation_probability[i] ?? 0
      ),
      weatherCode: code,
      weatherLabel: getWeatherCodeInfo(code).label,
    });
  }

  // ── Process 7-day daily slots
  const daily: DailyForecast[] = raw.daily.time.map((dateStr, i) => {
    const code = raw.daily.weather_code[i] ?? 0;
    return {
      date: formatDailyDate(dateStr),
      dateShort: formatDayShort(dateStr),
      tempMax: Math.round(raw.daily.temperature_2m_max[i] ?? 0),
      tempMin: Math.round(raw.daily.temperature_2m_min[i] ?? 0),
      weatherCode: code,
      weatherLabel: getWeatherCodeInfo(code).label,
      windSpeed: Math.round(raw.daily.wind_speed_10m_max[i] ?? 0),
      precipitation: Math.round(raw.daily.precipitation_sum[i] ?? 0),
      sunrise: formatTimeFromISO(raw.daily.sunrise[i] ?? ''),
      sunset: formatTimeFromISO(raw.daily.sunset[i] ?? ''),
    };
  });

  return {
    city: location.name,
    country: location.country,
    countryCode: location.country_code,
    timezone: raw.timezone,
    latitude: raw.latitude,
    longitude: raw.longitude,
    elevation: raw.elevation,

    currentTemp: Math.round(raw.hourly.temperature_2m[currentHourIndex] ?? 0),
    feelsLike: Math.round(
      raw.hourly.apparent_temperature[currentHourIndex] ?? 0
    ),
    humidity: Math.round(
      raw.hourly.relative_humidity_2m[currentHourIndex] ?? 0
    ),
    windSpeed: Math.round(raw.hourly.wind_speed_10m[currentHourIndex] ?? 0),
    weatherCode: currentCode,
    weatherLabel: codeInfo.label,
    weatherIcon: isDay ? (codeInfo.dayIcon ?? codeInfo.icon) : (codeInfo.nightIcon ?? codeInfo.icon),
    isDay,

    hourly,
    daily,
  };
}

// Date / time helpers

/**
 * Finds the index in the hourly time array that matches the current hour.
 * Falls back to 0 if nothing matches (shouldn't happen with `timezone: auto`).
 */
function findCurrentHourIndex(times: string[], now: Date): number {
  // Build an ISO-like string for the current local hour: "YYYY-MM-DDTHH:00"
  const pad = (n: number) => String(n).padStart(2, '0');
  const target = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T${pad(now.getHours())}:00`;

  const idx = times.findIndex((t) => t.startsWith(target));
  return idx >= 0 ? idx : 0;
}

/** Formats "2024-06-09T14:00" → "14:00" */
function formatHourlyTime(isoString: string): string {
  const parts = isoString.split('T');
  return parts[1]?.slice(0, 5) ?? isoString;
}

/** Formats "2024-06-09" → "Mon, Jun 9" */
function formatDailyDate(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`); // noon avoids TZ shift on Date()
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** Formats "2024-06-09" → "Mon" */
function formatDayShort(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/** Formats an ISO datetime string → "HH:MM" (local) */
function formatTimeFromISO(isoString: string): string {
  if (!isoString) return '--:--';
  const parts = isoString.split('T');
  return parts[1]?.slice(0, 5) ?? '--:--';
}

/** Returns true if the current time is between today's sunrise and sunset */
function checkIfDay(
  sunrises: string[],
  sunsets: string[],
  now: Date
): boolean {
  if (!sunrises[0] || !sunsets[0]) return true;

  const todayStr = now.toISOString().slice(0, 10);
  const todayIdx = sunrises.findIndex((s) => s.startsWith(todayStr));
  const idx = todayIdx >= 0 ? todayIdx : 0;

  const sunriseTime = new Date(sunrises[idx]).getTime();
  const sunsetTime = new Date(sunsets[idx]).getTime();
  const current = now.getTime();

  return current >= sunriseTime && current <= sunsetTime;
}

// WMO Weather Code → label + icon mapping
// Reference: https://open-meteo.com/en/docs#weathervariables

const WMO_CODE_MAP: Record<number, WeatherCodeInfo> = {
  0:  { label: 'Clear Sky',            icon: '☀️',  dayIcon: '☀️',  nightIcon: '🌙' },
  1:  { label: 'Mainly Clear',         icon: '🌤️', dayIcon: '🌤️', nightIcon: '🌙' },
  2:  { label: 'Partly Cloudy',        icon: '⛅',  dayIcon: '⛅',  nightIcon: '🌑' },
  3:  { label: 'Overcast',             icon: '☁️' },
  45: { label: 'Foggy',                icon: '🌫️' },
  48: { label: 'Icy Fog',              icon: '🌫️' },
  51: { label: 'Light Drizzle',        icon: '🌦️' },
  53: { label: 'Drizzle',              icon: '🌦️' },
  55: { label: 'Heavy Drizzle',        icon: '🌧️' },
  56: { label: 'Freezing Drizzle',     icon: '🌨️' },
  57: { label: 'Heavy Freezing Drizzle', icon: '🌨️' },
  61: { label: 'Light Rain',           icon: '🌧️' },
  63: { label: 'Rain',                 icon: '🌧️' },
  65: { label: 'Heavy Rain',           icon: '🌧️' },
  66: { label: 'Freezing Rain',        icon: '🌨️' },
  67: { label: 'Heavy Freezing Rain',  icon: '🌨️' },
  71: { label: 'Light Snow',           icon: '🌨️' },
  73: { label: 'Snow',                 icon: '❄️' },
  75: { label: 'Heavy Snow',           icon: '❄️' },
  77: { label: 'Snow Grains',          icon: '🌨️' },
  80: { label: 'Light Showers',        icon: '🌦️' },
  81: { label: 'Showers',              icon: '🌧️' },
  82: { label: 'Heavy Showers',        icon: '⛈️' },
  85: { label: 'Snow Showers',         icon: '🌨️' },
  86: { label: 'Heavy Snow Showers',   icon: '❄️' },
  95: { label: 'Thunderstorm',         icon: '⛈️' },
  96: { label: 'Thunderstorm w/ Hail', icon: '⛈️' },
  99: { label: 'Thunderstorm w/ Heavy Hail', icon: '⛈️' },
};

/** Returns label + icon for a WMO weather code. Falls back to "Unknown". */
export function getWeatherCodeInfo(code: number): WeatherCodeInfo {
  return WMO_CODE_MAP[code] ?? { label: 'Unknown', icon: '🌡️' };
}

// Unit conversion helpers (exported for use in components)

/** Converts Celsius to Fahrenheit, rounded to nearest integer */
export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

/** Returns a formatted temperature string with unit symbol */
export function formatTemperature(
  celsius: number,
  unit: 'celsius' | 'fahrenheit'
): string {
  if (unit === 'fahrenheit') {
    return `${celsiusToFahrenheit(celsius)}°F`;
  }
  return `${celsius}°C`;
}

// Custom error class

export class WeatherApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'WeatherApiError';
  }
}