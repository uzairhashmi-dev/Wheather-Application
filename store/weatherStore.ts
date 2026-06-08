// store/weatherStore.ts
// WHY: Global state management using Zustand.
// Any component can read/update weather state without prop-drilling.
// This is the "single source of truth" for the entire application.

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { WeatherState, GeocodingResult } from "@/types/weather";
import { searchCities } from "@/lib/geocodingApi";
import { fetchWeatherData } from "@/lib/weatherApi";

export const useWeatherStore = create<WeatherState>()(
  devtools(
    (set, _get) => ({
      // ── Initial State ──────────────────────────────────────────────────────
      selectedCity: null,
      searchResults: [],
      weatherData: null,

      isSearching: false,
      isLoadingWeather: false,
      searchError: null,
      weatherError: null,
      searchQuery: "",

      // ── Actions ────────────────────────────────────────────────────────────

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      searchCity: async (cityName: string) => {
        if (!cityName.trim()) {
          set({ searchResults: [], searchError: null });
          return;
        }

        set({ isSearching: true, searchError: null });

        try {
          const results = await searchCities(cityName);

          if (results.length === 0) {
            set({
              searchResults: [],
              searchError: `No cities found for "${cityName}". Try a different name.`,
              isSearching: false,
            });
            return;
          }

          set({ searchResults: results, isSearching: false });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to search cities.";
          set({
            searchResults: [],
            searchError: message,
            isSearching: false,
          });
        }
      },

      fetchWeather: async (city: GeocodingResult) => {
        set({
          selectedCity: city,
          searchResults: [],
          searchQuery: "",
          isLoadingWeather: true,
          weatherError: null,
          weatherData: null,
        });

        try {
          const data = await fetchWeatherData(city.latitude, city.longitude);
          set({ weatherData: data, isLoadingWeather: false });
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to fetch weather data.";
          set({ weatherError: message, isLoadingWeather: false });
        }
      },

      clearSearchResults: () => {
        set({ searchResults: [], searchError: null });
      },

      clearErrors: () => {
        set({ searchError: null, weatherError: null });
      },

      reset: () => {
        set({
          selectedCity: null,
          searchResults: [],
          weatherData: null,
          isSearching: false,
          isLoadingWeather: false,
          searchError: null,
          weatherError: null,
          searchQuery: "",
        });
      },
    }),
    { name: "weather-store" },
  ),
);
