// Converts a city name string into a list of matching GeocodingResult objects.
// Components call fetchCitySuggestions() — no raw fetch() anywhere else.

import type { GeocodingApiResponse, GeocodingResult } from '@/types/weather';

const BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/** How many city suggestions to request from the API */
const SUGGESTION_COUNT = 6;

// Core fetcher
export async function fetchCitySuggestions(
  query: string
): Promise<GeocodingResult[]> {
  const trimmed = query.trim();

  // Guard: don't bother hitting the network for very short strings
  if (trimmed.length < 2) return [];

  const url = buildGeocodingUrl(trimmed);

  const response = await fetch(url, {
    // next.js fetch extension — don't cache search results
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new GeocodingApiError(
      `Geocoding API responded with status ${response.status}`,
      response.status
    );
  }

  const data: GeocodingApiResponse = await response.json();

  // API returns `results` only when matches exist; otherwise the key is absent
  return data.results ?? [];
}


/** Builds the full geocoding request URL with query params */
function buildGeocodingUrl(cityName: string): string {
  const params = new URLSearchParams({
    name: cityName,
    count: String(SUGGESTION_COUNT),
    language: 'en',
    format: 'json',
  });

  return `${BASE_URL}?${params.toString()}`;
}

/**
 * Returns a human-readable label for a GeocodingResult,
 * e.g. "Berlin, Berlin, Germany"
 */
export function formatCityLabel(result: GeocodingResult): string {
  const parts: string[] = [result.name];

  if (result.admin1 && result.admin1 !== result.name) {
    parts.push(result.admin1);
  }

  parts.push(result.country);

  return parts.join(', ');
}

/**
 * Works in all modern browsers / Node 18+.
 * @example flagEmoji("DE") // "🇩🇪"
 */
export function flagEmoji(countryCode: string): string {
  const code = countryCode.toUpperCase();
  // Each letter is shifted to the Regional Indicator Symbol block (U+1F1E6+)
  return [...code]
    .map((char) => String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65))
    .join('');
}

// Custom error class

export class GeocodingApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'GeocodingApiError';
  }
}