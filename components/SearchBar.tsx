

'use client';

import {
  useRef,
  useEffect,
  useCallback,
  useState,
  KeyboardEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, MapPin } from 'lucide-react';

import { useSearch } from '@/store/weatherStore';
import { formatCityLabel, flagEmoji } from '@/lib/geocodingApi';
import type { GeocodingResult } from '@/types/weather';


const DEBOUNCE_MS = 300;


export default function SearchBar() {
  const router = useRouter();

  const {
    searchQuery,
    suggestions,
    suggestionsStatus,
    setSearchQuery,
    fetchSuggestions,
    fetchWeather,
    clearSuggestions,
  } = useSearch();

  // Which suggestion is highlighted via keyboard
  const [activeIndex, setActiveIndex] = useState(-1);

  // Derived — no useState needed, avoids the useEffect setState ESLint error
  const isOpen = suggestions.length > 0;

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Click outside closes dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        clearSuggestions();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearSuggestions]);

  // ── Debounced fetch 
  const handleInputChange = useCallback(
    (value: string) => {
      setSearchQuery(value);

      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      if (value.trim().length < 2) {
        clearSuggestions();
        return;
      }

      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(value);
        setActiveIndex(-1);
      }, DEBOUNCE_MS);
    },
    [setSearchQuery, fetchSuggestions, clearSuggestions]
  );

  // ── Select a suggestion 
  const handleSelect = useCallback(
    async (location: GeocodingResult) => {
      clearSuggestions();
      inputRef.current?.blur();

      await fetchWeather(location);
      router.push('/weather');
    },
    [fetchWeather, clearSuggestions, router]
  );

  // ── Clear input
  function handleClear() {
    setSearchQuery('');
    clearSuggestions();
    inputRef.current?.focus();
  }

  // ── Keyboard navigation
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;

      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          handleSelect(suggestions[activeIndex]);
        }
        break;

      case 'Escape':
        clearSuggestions();
        inputRef.current?.blur();
        break;
    }
  }

  const isLoading = suggestionsStatus === 'loading';

  return (
    <div ref={containerRef} className="relative z-[9999] w-full max-w-2xl">

      {/* ── Input wrapper  */}
      <div className="relative flex items-center">
        {/* Left icon */}
        <div className="pointer-events-none absolute left-4 flex items-center">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          ) : (
            <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          autoComplete="off"
          spellCheck={false}
          placeholder="Search any city worldwide…"
          value={searchQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-base text-slate-800 placeholder-slate-400 shadow-lg shadow-slate-200/60 outline-none ring-0 transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:shadow-slate-900/50 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
        />

        {/* Clear button */}
        {searchQuery.length > 0 && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-4 flex items-center justify-center rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Dropdown ──────────────────────────────────────────────────────── */}
      {isOpen && (
        <ul
          id="search-suggestions"
          role="listbox"
        className="absolute left-0 right-0 top-[calc(100%+8px)] z-[9999] overflow-y-auto max-h-[400px] rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40 dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-900/60"        >
          {suggestions.length > 0 ? (
            suggestions.map((result, index) => (
              <SuggestionItem
                key={result.id}
                result={result}
                isActive={index === activeIndex}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setActiveIndex(index)}
              />
            ))
          ) : (
            <li className="flex items-center gap-3 px-4 py-4 text-sm text-slate-500 dark:text-slate-400">
              <MapPin className="h-4 w-4 shrink-0" />
              No cities found. Try a different spelling.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

// Sub-component: one suggestion row
// 

interface SuggestionItemProps {
  result: GeocodingResult;
  isActive: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

function SuggestionItem({
  result,
  isActive,
  onClick,
  onMouseEnter,
}: SuggestionItemProps) {
  return (
    <li
      role="option"
      aria-selected={isActive}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors duration-100 ${
        isActive
          ? 'bg-blue-50 dark:bg-blue-950/60'
          : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
      } border-b border-slate-100 last:border-0 dark:border-slate-700/50`}
    >
      {/* Country flag */}
      <span className="text-xl leading-none" aria-hidden="true">
        {flagEmoji(result.country_code) || result.country_code}
      </span>

      {/* City info */}
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
          {result.name}
        </span>
        <span className="truncate text-xs text-slate-400 dark:text-slate-500">
          {formatCityLabel(result)}
        </span>
      </div>

      {/* Population badge (if available) */}
      {result.population && result.population > 0 && (
        <span className="ml-auto shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400 dark:bg-slate-700 dark:text-slate-500">
          {formatPopulation(result.population)}
        </span>
      )}
    </li>
  );
}

// Helper

function formatPopulation(pop: number): string {
  if (pop >= 1_000_000) return `${(pop / 1_000_000).toFixed(1)}M`;
  if (pop >= 1_000) return `${Math.round(pop / 1_000)}K`;
  return String(pop);
}