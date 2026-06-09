'use client';

// Client component — renders clickable city chips on the home page.
// Kept separate so app/page.tsx stays a Server Component.

import { useSearch } from '@/store/weatherStore';

const POPULAR_CITIES = [
  'Karachi', 'London', 'New York', 'Tokyo',
  'Dubai',   'Paris',  'Sydney',   'Toronto',
] as const;

export default function PopularCities() {
  const { setSearchQuery, fetchSuggestions } = useSearch();

  function handleCityClick(city: string) {
    setSearchQuery(city);
    fetchSuggestions(city);
    // Scroll to top so SearchBar dropdown is visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {POPULAR_CITIES.map((city) => (
        <button
          key={city}
          onClick={() => handleCityClick(city)}
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 shadow-sm transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950 dark:hover:text-blue-400"
        >
          {city}
        </button>
      ))}
    </div>
  );
}