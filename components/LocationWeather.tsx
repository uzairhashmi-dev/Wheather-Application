'use client';

import { useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useLocationWeather } from '@/store/weatherStore';
import { useTemperatureUnit } from '@/store/weatherStore';
import { formatTemperature } from '@/lib/weatherApi';

export default function LocationWeather() {
  const { locationStatus, locationWeather, fetchByLocation } = useLocationWeather();
  const { unit } = useTemperatureUnit();

  // Auto-fetch on mount
  useEffect(() => {
    fetchByLocation();
  }, [fetchByLocation]);

  // Silent fail — kuch nahi dikhao
  if (locationStatus === 'error' || locationStatus === 'idle') {
    return null;
  }

  // Loading state
  if (locationStatus === 'loading') {
    return (
      <div className=" items-center gap-1.5 sm:flex">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
        <span className="text-xs text-slate-400 dark:text-slate-500">
          Locating...
        </span>
      </div>
    );
  }

  // Success state
  if (locationStatus === 'success' && locationWeather) {
    return (
      <div className=" items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 sm:flex dark:border-slate-700 dark:bg-slate-800/60">
        <MapPin className="h-3 w-3 shrink-0 text-blue-500" />
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
          {locationWeather.city}
        </span>
        <span className="text-xs font-bold tabular-nums text-slate-800 dark:text-slate-100">
          {formatTemperature(locationWeather.currentTemp, unit)}
        </span>
        <span className="text-sm leading-none" role="img" aria-label={locationWeather.weatherLabel}>
          {locationWeather.weatherIcon}
        </span>
      </div>
    );
  }

  return null;
}