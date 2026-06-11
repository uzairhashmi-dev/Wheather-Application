// Zustand global store — single source of truth for ALL app state.
// Components read state here and call actions here. No prop-drilling needed.

import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { fetchCitySuggestions } from "@/lib/geocodingApi";
import { fetchWeatherData } from "@/lib/weatherApi";

import type {
  WeatherStore,
  GeocodingResult,
  TemperatureUnit,
  LocationWeatherData,
} from "@/types/weather";

// Store

export const useWeatherStore = create<WeatherStore>()(
  devtools(
    (set) => ({
      status: "idle",
      error: null,
      weather: null,
      searchQuery: "",
      suggestions: [],
      suggestionsStatus: "idle",
      unit: "celsius",
      locationStatus: "idle",
      locationWeather: null,

      setSearchQuery: (query: string) => {
        set({ searchQuery: query }, false, "setSearchQuery");
      },

      fetchSuggestions: async (query: string) => {
        if (query.trim().length < 2) {
          set(
            { suggestions: [], suggestionsStatus: "idle" },
            false,
            "fetchSuggestions/tooShort",
          );
          return;
        }
        set({ suggestionsStatus: "loading" }, false, "fetchSuggestions/start");

        try {
          const results = await fetchCitySuggestions(query);
          set(
            { suggestions: results, suggestionsStatus: "success" },
            false,
            "fetchSuggestions/success",
          );
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch suggestions";
          set(
            { suggestions: [], suggestionsStatus: "error", error: message },
            false,
            "fetchSuggestions/error",
          );
        }
      },

      /**
       * Fetches full weather data for a selected GeocodingResult.
       * Sets status → loading → success/error.
       */
      fetchWeather: async (location: GeocodingResult) => {
        set(
          {
            status: "loading",
            error: null,
            suggestions: [],
            searchQuery: location.name,
          },
          false,
          "fetchWeather/start",
        );

        try {
          const weatherData = await fetchWeatherData(location);
          set(
            { status: "success", weather: weatherData },
            false,
            "fetchWeather/success",
          );
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to fetch weather data. Please try again.";
          set(
            { status: "error", error: message, weather: null },
            false,
            "fetchWeather/error",
          );
        }
      },

      /**
       * Toggles temperature unit between celsius and fahrenheit.
       * No API call needed — conversion happens in components.
       */
      setUnit: (unit: TemperatureUnit) => {
        set({ unit }, false, "setUnit");
      },

      /** Clears the suggestions dropdown */
      clearSuggestions: () => {
        set(
          { suggestions: [], suggestionsStatus: "idle" },
          false,
          "clearSuggestions",
        );
      },

      /** Clears any error message (e.g. when user starts a new search) */
      clearError: () => {
        set({ error: null, status: "idle" }, false, "clearError");
      },

      // YEH ADD KARO:
      fetchByLocation: async () => {
        if (!navigator.geolocation) {
          set(
            { locationStatus: "error" },
            false,
            "fetchByLocation/unsupported",
          );
          return;
        }

        set({ locationStatus: "loading" }, false, "fetchByLocation/start");

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;

              const geoRes = await fetch(
                `/api/geocoding?lat=${latitude}&lon=${longitude}`,
              );
              const geoData = await geoRes.json();
              const cityName: string = geoData.city ?? "My Location";

              const fakeLocation: GeocodingResult = {
                id: 0,
                name: cityName,
                latitude,
                longitude,
                country: geoData.country ?? "",
                country_code: geoData.country_code ?? "",
                timezone: "auto",
              };

              const data = await fetchWeatherData(fakeLocation);

              const locationWeather: LocationWeatherData = {
                city: cityName,
                country: data.country,
                currentTemp: data.currentTemp,
                weatherIcon: data.weatherIcon,
                weatherLabel: data.weatherLabel,
              };

              set(
                { locationStatus: "success", locationWeather },
                false,
                "fetchByLocation/success",
              );
            } catch {
              set({ locationStatus: "error" }, false, "fetchByLocation/error");
            }
          },
          () => {
            set({ locationStatus: "error" }, false, "fetchByLocation/denied");
          },
          { timeout: 10000, maximumAge: 300000 },
        );
      },
    }),
    {
      name: "WeatherStore", // shows in Redux DevTools
    },
  ),
);

/** Returns only the weather data and fetch status */
export const useWeatherData = () => {
  const weather = useWeatherStore((s) => s.weather);
  const status = useWeatherStore((s) => s.status);

  return { weather, status };
};

/** Returns search-related state */
export const useSearch = () => {
  const searchQuery = useWeatherStore((s) => s.searchQuery);
  const suggestions = useWeatherStore((s) => s.suggestions);
  const suggestionsStatus = useWeatherStore((s) => s.suggestionsStatus);
  const setSearchQuery = useWeatherStore((s) => s.setSearchQuery);
  const fetchSuggestions = useWeatherStore((s) => s.fetchSuggestions);
  const fetchWeather = useWeatherStore((s) => s.fetchWeather);
  const clearSuggestions = useWeatherStore((s) => s.clearSuggestions);

  return {
    searchQuery,
    suggestions,
    suggestionsStatus,
    setSearchQuery,
    fetchSuggestions,
    fetchWeather,
    clearSuggestions,
  };
};
// YEH ADD KARO — file ke bilkul end mein:
export const useLocationWeather = () => {
  const locationStatus = useWeatherStore((s) => s.locationStatus);
  const locationWeather = useWeatherStore((s) => s.locationWeather);
  const fetchByLocation = useWeatherStore((s) => s.fetchByLocation);

  return { locationStatus, locationWeather, fetchByLocation };
};
/** Returns unit and setter */
export const useTemperatureUnit = () => {
  const unit = useWeatherStore((s) => s.unit);
  const setUnit = useWeatherStore((s) => s.setUnit);

  return {
    unit,
    setUnit,
  };
};

/** Returns error state and clear action */
export const useWeatherError = () => {
  const error = useWeatherStore((s) => s.error);
  const status = useWeatherStore((s) => s.status);
  const clearError = useWeatherStore((s) => s.clearError);

  return {
    error,
    status,
    clearError,
  };
};
