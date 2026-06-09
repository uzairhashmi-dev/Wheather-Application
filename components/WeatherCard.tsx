// Displays: city, country flag, temperature, weather condition, feels like,
// humidity, wind speed, sunrise/sunset, elevation, and coordinates.
// Reads unit (°C/°F) from Zustand — no props needed for that.

'use client';

import {
  Wind,
  Droplets,
  Thermometer,
  Sunrise,
  Sunset,
  MapPin,
  Navigation,
  Mountain,
} from 'lucide-react';

import { formatTemperature } from '@/lib/weatherApi';
import { flagEmoji } from '@/lib/geocodingApi';
import { useTemperatureUnit } from '@/store/weatherStore';
import type { ProcessedWeatherData } from '@/types/weather';


interface WeatherCardProps {
  data: ProcessedWeatherData;
}


export default function WeatherCard({ data }: WeatherCardProps) {
  const { unit } = useTemperatureUnit();

  const todayForecast = data.daily[0];

  return (
    <article className="w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/60 transition-colors dark:border-slate-700/60 dark:bg-slate-800 dark:shadow-slate-900/50">

      <div
        className={`relative px-6 py-6 sm:px-8 sm:py-8 ${
          data.isDay
            ? 'bg-linear-to-br from-sky-400 via-blue-500 to-indigo-600'
            : 'bg-linear-to-br from-indigo-800 via-slate-800 to-slate-900'
        }`}
      >
        {/* Decorative blurred circle */}
        <div
          className={`absolute right-0 top-0 h-40 w-40 -translate-y-8 translate-x-8 rounded-full blur-3xl ${
            data.isDay ? 'bg-white/10' : 'bg-indigo-500/10'
          }`}
        />

        {/* ── City row ────────────────────────────────────────────────────── */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-white/70" />
              <h1 className="truncate text-2xl font-bold text-white sm:text-3xl">
                {data.city}
              </h1>
            </div>
            <p className="mt-0.5 text-sm font-medium text-white/70">
              {data.country} • {data.timezone}
            </p>
          </div>

          {/* Country flag */}
          <span
            className="shrink-0 text-5xl leading-none"
            role="img"
            aria-label={`Flag of ${data.country}`}
          >
            {flagEmoji(data.countryCode)}
          </span>
        </div>

        {/* ── Temperature + condition ──────────────────────────────────────── */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-start gap-2">
              <span className="text-7xl font-black leading-none tracking-tighter text-white sm:text-8xl">
                {unit === 'celsius'
                  ? data.currentTemp
                  : Math.round((data.currentTemp * 9) / 5 + 32)}
              </span>
              <span className="mt-3 text-3xl font-light text-white/80">
                {unit === 'celsius' ? '°C' : '°F'}
              </span>
            </div>

            <p className="mt-2 text-lg font-semibold text-white/90">
              {data.weatherIcon} {data.weatherLabel}
            </p>

            <p className="text-sm text-white/60">
              Feels like{' '}
              {formatTemperature(data.feelsLike, unit)}
            </p>
          </div>

          {/* High / low */}
          {todayForecast && (
            <div className="flex shrink-0 flex-col items-end gap-1 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <span className="text-xs font-medium uppercase tracking-wider text-white/60">
                Today
              </span>
              <span className="text-base font-bold text-white">
                ↑ {formatTemperature(todayForecast.tempMax, unit)}
              </span>
              <span className="text-base font-semibold text-white/70">
                ↓ {formatTemperature(todayForecast.tempMin, unit)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Stats grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 sm:p-6">
        <StatTile
          icon={<Droplets className="h-5 w-5 text-blue-500" />}
          label="Humidity"
          value={`${data.humidity}%`}
          bg="bg-blue-50 dark:bg-blue-950/40"
        />
        <StatTile
          icon={<Wind className="h-5 w-5 text-teal-500" />}
          label="Wind"
          value={`${data.windSpeed} km/h`}
          bg="bg-teal-50 dark:bg-teal-950/40"
        />
        <StatTile
          icon={<Thermometer className="h-5 w-5 text-orange-500" />}
          label="Feels Like"
          value={formatTemperature(data.feelsLike, unit)}
          bg="bg-orange-50 dark:bg-orange-950/40"
        />
        <StatTile
          icon={<Mountain className="h-5 w-5 text-violet-500" />}
          label="Elevation"
          value={`${data.elevation} m`}
          bg="bg-violet-50 dark:bg-violet-950/40"
        />
      </div>

      {todayForecast && (
        <div className="flex gap-3 px-5 pb-5 sm:px-6 sm:pb-6">
          <SunTile
            icon={<Sunrise className="h-5 w-5 text-amber-500" />}
            label="Sunrise"
            time={todayForecast.sunrise}
            bg="bg-amber-50 dark:bg-amber-950/30"
            textColor="text-amber-700 dark:text-amber-400"
          />
          <SunTile
            icon={<Sunset className="h-5 w-5 text-rose-500" />}
            label="Sunset"
            time={todayForecast.sunset}
            bg="bg-rose-50 dark:bg-rose-950/30"
            textColor="text-rose-700 dark:text-rose-400"
          />
        </div>
      )}

      {/* ── Footer — coordinates ─────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-1.5 border-t border-slate-100 px-5 py-3 dark:border-slate-700/50">
        <Navigation className="h-3 w-3 text-slate-400" />
        <span className="text-xs tabular-nums text-slate-400 dark:text-slate-500">
          {data.latitude.toFixed(4)}°N, {data.longitude.toFixed(4)}°E
        </span>
      </div>
    </article>
  );
}

// Sub-components

interface StatTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
}

function StatTile({ icon, label, value, bg }: StatTileProps) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl p-4 transition-transform duration-200 hover:scale-[1.02] ${bg}`}
    >
      {icon}
      <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
        {value}
      </span>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </span>
    </div>
  );
}

interface SunTileProps {
  icon: React.ReactNode;
  label: string;
  time: string;
  bg: string;
  textColor: string;
}

function SunTile({ icon, label, time, bg, textColor }: SunTileProps) {
  return (
    <div
      className={`flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 ${bg}`}
    >
      {icon}
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className={`text-base font-bold tabular-nums ${textColor}`}>
          {time}
        </p>
      </div>
    </div>
  );
}