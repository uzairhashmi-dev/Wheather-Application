// components/SearchBar.tsx
"use client";

import { useRef, useState, useCallback } from "react";
import { Search, X, Loader2, MapPin, Globe } from "lucide-react";
import { useWeatherStore } from "@/store/weatherStore";
import { GeocodingResult } from "@/types/weather";

export default function SearchBar() {
  const {
    searchQuery,
    searchResults,
    isSearching,
    searchError,
    setSearchQuery,
    searchCity,
    fetchWeather,
    clearSearchResults,
  } = useWeatherStore();

  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derived — dropdown sirf tab show ho jab isOpen true ho AUR results/error ho
  const shouldShowDropdown =
    isOpen && (searchResults.length > 0 || !!searchError);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!value.trim()) {
        clearSearchResults();
        setIsOpen(false);
        return;
      }

      debounceRef.current = setTimeout(() => {
        searchCity(value);
        setIsOpen(true);
      }, 400);
    },
    [setSearchQuery, searchCity, clearSearchResults]
  );

  const handleCitySelect = (city: GeocodingResult) => {
    setIsOpen(false);
    fetchWeather(city);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setSearchQuery("");
    clearSearchResults();
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
    if (e.key === "Enter" && searchQuery.trim()) {
      searchCity(searchQuery);
      setIsOpen(true);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Input container */}
      <div
        role="combobox"
        aria-expanded={shouldShowDropdown}
        aria-controls="city-suggestions"
        aria-haspopup="listbox"
        aria-owns="city-suggestions"
        className={`
          flex items-center gap-3 px-4 py-3.5 rounded-2xl
          bg-white dark:bg-slate-800/80
          border-2 transition-all duration-200
          shadow-lg dark:shadow-slate-900/50
          ${
            shouldShowDropdown
              ? "border-blue-400 dark:border-blue-500 shadow-blue-100 dark:shadow-blue-900/20"
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
          }
        `}
      >
        {/* Search icon / loader */}
        <div className="shrink-0 text-slate-400 dark:text-slate-500">
          {isSearching ? (
            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchResults.length > 0 || searchError) setIsOpen(true);
          }}
          placeholder="Search any city worldwide..."
          className="
            flex-1 bg-transparent outline-none
            text-slate-800 dark:text-slate-100
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            text-base font-medium
          "
          autoComplete="off"
          aria-label="City search"
          aria-autocomplete="list"
          aria-controls="city-suggestions"
        />

        {/* Clear button */}
        {searchQuery && (
          <button
            onClick={handleClear}
            className="shrink-0 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {shouldShowDropdown && (
        <div
          ref={dropdownRef}
          id="city-suggestions"
          className="
            absolute top-full left-0 right-0 mt-2 z-50
            bg-white dark:bg-slate-800
            border border-slate-200 dark:border-slate-700
            rounded-2xl shadow-2xl dark:shadow-slate-900/60
            overflow-hidden animate-slide-down
          "
          role="listbox"
          aria-label="City suggestions"
        >
          {/* Error state */}
          {searchError && !isSearching && (
            <div className="flex items-center gap-3 px-4 py-4 text-slate-500 dark:text-slate-400">
              <Globe className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-sm">{searchError}</p>
            </div>
          )}

          {/* Results */}
          {searchResults.length > 0 && (
            <ul>
              {searchResults.map((city: GeocodingResult, index: number) => (
                <li key={city.id}>
                  <button
                    onClick={() => handleCitySelect(city)}
                    className="
                      w-full flex items-center gap-3 px-4 py-3
                      text-left transition-colors duration-150
                      hover:bg-blue-50 dark:hover:bg-slate-700
                      focus-visible:bg-blue-50 dark:focus-visible:bg-slate-700
                      group
                    "
                    role="option"
                    aria-selected={false}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                      <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {city.name}
                        {city.admin1 && (
                          <span className="font-normal text-slate-500 dark:text-slate-400">
                            {" "}
                            · {city.admin1}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {city.country} · {city.latitude.toFixed(2)}°N{" "}
                        {city.longitude.toFixed(2)}°E
                      </p>
                    </div>
                    {city.population && (
                      <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 hidden sm:block">
                        Pop. {(city.population / 1000).toFixed(0)}k
                      </span>
                    )}
                  </button>
                  {index < searchResults.length - 1 && (
                    <div className="mx-4 border-b border-slate-100 dark:border-slate-700/50" />
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Powered by */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700/50">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center">
              Powered by Open-Meteo Geocoding API · Free & No Key Required
            </p>
          </div>
        </div>
      )}
    </div>
  );
}