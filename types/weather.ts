
// / API se jo raw data aata hai uski shape
export interface GeocodingResult {
  id: number;
  name: string;                 // city name  e.g. "karachi"
  latitude: number;             //26.4444
  longitude: number;            //78.7632
  country: string;              // e.g. "Germany"
  country_code: string;         // e.g. "pk"
  admin1?: string;              // state / province  e.g. "Berlin"
  timezone: string;             // IANA timezone  e.g. "Europe/Berlin"
  population?: number;
}
// /** Raw API envelope from geocoding endpoint */
export interface GeocodingApiResponse {
  results?: GeocodingResult[];
  generationtime_ms: number;
}
/** Hourly data arrays exactly as the API returns them */
export interface HourlyWeatherRaw {
  time: string[];                        // ISO-8601 strings
  temperature_2m: number[];
  relative_humidity_2m: number[];
  wind_speed_10m: number[];
  weather_code: number[];
  precipitation_probability: number[];
  apparent_temperature: number[];
}
/** Daily data arrays exactly as the API returns them */
export interface DailyWeatherRaw {
  time: string[];                        // "YYYY-MM-DD" strings
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weather_code: number[];
  wind_speed_10m_max: number[];
  precipitation_sum: number[];
  sunrise: string[];
  sunset: string[];
}
/** Full envelope returned by Open-Meteo Forecast API */
export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  hourly_units: Record<string, string>;
  daily_units: Record<string, string>;
  hourly: HourlyWeatherRaw;
  daily: DailyWeatherRaw;
}
/** A single processed hourly snapshot shown in the UI */
export interface HourlyForecast {
  time: string;                  // formatted, e.g. "14:00"
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherLabel: string;
  precipitationProbability: number;
  feelsLike: number;
}
/** A single processed daily forecast card */
export interface DailyForecast {
  date: string;                  // formatted, e.g. "Mon, Jun 9"
  dateShort: string;             // e.g. "Mon"
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  weatherLabel: string;
  windSpeed: number;
  precipitation: number;
  sunrise: string;               // formatted time
  sunset: string;
}
/** The fully processed weather object stored in Zustand and consumed by UI */
export interface ProcessedWeatherData {
  city: string;
  country: string;
  countryCode: string;
  timezone: string;
  latitude: number;
  longitude: number;
  elevation: number;
  // Current conditions (derived from first matching hourly slot)
  currentTemp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherLabel: string;
  weatherIcon: string;           // emoji icon mapped from WMO code
  isDay: boolean;
  // Forecasts
  hourly: HourlyForecast[];      // next 24 hours
  daily: DailyForecast[];        // next 7 days
}
// ── Zustand store shape
export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

export interface WeatherStore {
  // State
  status: FetchStatus;
  error: string | null;
  weather: ProcessedWeatherData | null;
  searchQuery: string;
  suggestions: GeocodingResult[];
  suggestionsStatus: FetchStatus;
  unit: TemperatureUnit;

  // Actions
  setSearchQuery: (query: string) => void;
  fetchSuggestions: (query: string) => Promise<void>;
  fetchWeather: (location: GeocodingResult) => Promise<void>;
  setUnit: (unit: TemperatureUnit) => void;
  clearSuggestions: () => void;
  clearError: () => void;
}
export type TemperatureUnit = 'celsius' | 'fahrenheit';
/** WMO Weather interpretation code metadata */
export interface WeatherCodeInfo {
  label: string;
  icon: string;                  // emoji
  dayIcon?: string;
  nightIcon?: string;
}