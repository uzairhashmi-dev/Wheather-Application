//   1. Hourly forecast  → horizontal scrollable row (next 24 hours)
//   2. Daily forecast   → vertical list (next 7 days)
// Reads unit from Zustand — no prop needed for °C/°F.
// All data comes from ProcessedWeatherData already shaped by weatherApi.ts

'use client';

import { Wind, Droplets, ChevronRight } from 'lucide-react';

import { formatTemperature } from '@/lib/weatherApi';
import { useTemperatureUnit } from '@/store/weatherStore';
import type { HourlyForecast, DailyForecast } from '@/types/weather';
import { getWeatherCodeInfo } from '@/lib/weatherApi';


interface ForecastCardProps {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export default function ForecastCard({ hourly, daily }: ForecastCardProps) {
  const { unit } = useTemperatureUnit();

  return (
    <div className="w-full space-y-5">
      {/* ── Hourly Sectio */}
      <section>
        <SectionTitle title="Hourly Forecast" subtitle="Next 24 hours" />

        {/* Horizontal scroll container */}
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {hourly.map((slot, index) => (
            <HourlySlot key={`${slot.time}-${index}`} slot={slot} unit={unit} isFirst={index === 0} />
          ))}
        </div>
      </section>

      {/* ── Daily Section */}
      <section>
        <SectionTitle title="7-Day Forecast" subtitle="Daily overview" />

        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {daily.map((day, index) => (
            <DailyRow
              key={`${day.date}-${index}`}
              day={day}
              unit={unit}
              isLast={index === daily.length - 1}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// Hourly slot card

interface HourlySlotProps {
  slot: HourlyForecast;
  unit: 'celsius' | 'fahrenheit';
  isFirst: boolean;
}

function HourlySlot({ slot, unit, isFirst }: HourlySlotProps) {
  const info = getWeatherCodeInfo(slot.weatherCode);

  return (
    <div
      className={`flex shrink-0 flex-col items-center gap-2.5 rounded-2xl border px-4 py-4 transition-all duration-200 hover:scale-105 hover:shadow-md ${
        isFirst
          ? 'border-blue-300 bg-blue-50 shadow-blue-100 dark:border-blue-600 dark:bg-blue-950/60 dark:shadow-blue-900/30'
          : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'
      }`}
    >
      {/* Time */}
      <span
        className={`text-xs font-semibold tabular-nums ${
          isFirst
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        {isFirst ? 'Now' : slot.time}
      </span>

      {/* Weather emoji */}
      <span className="text-2xl leading-none" role="img" aria-label={slot.weatherLabel}>
        {info.icon}
      </span>

      {/* Temperature */}
      <span
        className={`text-sm font-bold tabular-nums ${
          isFirst
            ? 'text-blue-700 dark:text-blue-300'
            : 'text-slate-800 dark:text-slate-100'
        }`}
      >
        {formatTemperature(slot.temperature, unit)}
      </span>

      {/* Rain probability */}
      {slot.precipitationProbability > 0 && (
        <div className="flex items-center gap-0.5">
          <Droplets className="h-3 w-3 text-blue-400" />
          <span className="text-[10px] font-medium text-blue-500 dark:text-blue-400">
            {slot.precipitationProbability}%
          </span>
        </div>
      )}
    </div>
  );
}

// Daily row

interface DailyRowProps {
  day: DailyForecast;
  unit: 'celsius' | 'fahrenheit';
  isLast: boolean;
}

function DailyRow({ day, unit, isLast }: DailyRowProps) {
  const info = getWeatherCodeInfo(day.weatherCode);

  return (
    <div
      className={`flex items-center gap-3 px-5 py-4 transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-slate-700/40 sm:gap-4 ${
        !isLast
          ? 'border-b border-slate-100 dark:border-slate-700/60'
          : ''
      }`}
    >
      {/* Day name */}
      <span className="w-12 shrink-0 text-sm font-semibold text-slate-700 dark:text-slate-200">
        {day.dateShort}
      </span>

      {/* Weather icon */}
      <span
        className="shrink-0 text-xl leading-none"
        role="img"
        aria-label={day.weatherLabel}
      >
        {info.icon}
      </span>

      {/* Condition label — hidden on very small screens */}
      <span className="hidden min-w-0 flex-1 truncate text-sm text-slate-500 dark:text-slate-400 sm:block">
        {day.weatherLabel}
      </span>

      {/* Spacer on mobile */}
      <span className="flex-1 sm:hidden" />

      {/* Wind */}
      <div className="hidden items-center gap-1 sm:flex">
        <Wind className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
          {day.windSpeed} km/h
        </span>
      </div>

      {/* Precipitation */}
      {day.precipitation > 0 && (
        <div className="flex items-center gap-1">
          <Droplets className="h-3.5 w-3.5 shrink-0 text-blue-400" />
          <span className="text-xs tabular-nums text-blue-500 dark:text-blue-400">
            {day.precipitation}mm
          </span>
        </div>
      )}

      {/* Temp range */}
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm font-bold tabular-nums text-slate-800 dark:text-slate-100">
          {formatTemperature(day.tempMax, unit)}
        </span>
        <span className="text-sm tabular-nums text-slate-400 dark:text-slate-500">
          {formatTemperature(day.tempMin, unit)}
        </span>
      </div>

      {/* Chevron decoration */}
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
    </div>
  );
}

// Section title

interface SectionTitleProps {
  title: string;
  subtitle: string;
}

function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="flex items-baseline gap-2">
      <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
        {title}
      </h2>
      <span className="text-xs text-slate-400 dark:text-slate-500">
        {subtitle}
      </span>
    </div>
  );
}