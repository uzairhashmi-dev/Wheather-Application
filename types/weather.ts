// types/weather.ts
export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  weather_code: number[];
  wind_speed_10m: number[];
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  precipitation_sum: number[];
  wind_speed_10m_max: number[];
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string; 
  elevation: number;             
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
}

// WeatherState — weatherStore.ts ke liye
export interface WeatherState {
  // State
  selectedCity: GeocodingResult | null;
  searchResults: GeocodingResult[];
  weatherData: WeatherResponse | null;
  isSearching: boolean;
  isLoadingWeather: boolean;
  searchError: string | null;
  weatherError: string | null;
  searchQuery: string;

  // Actions
  setSearchQuery: (query: string) => void;
  searchCity: (cityName: string) => Promise<void>;
  fetchWeather: (city: GeocodingResult) => Promise<void>;
  clearSearchResults: () => void;
  clearErrors: () => void;
  reset: () => void;
}