// lib/geocodingApi.ts
// WHY: Isolates all geocoding (city name → coordinates) API logic in one place.
// Keeps components clean — they just call a function, not raw fetch calls.

import { GeocodingResponse, GeocodingResult } from "@/types/weather";

const GEOCODING_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";

export async function searchCities(
  cityName: string,
  count: number = 6
): Promise<GeocodingResult[]> {
  if (!cityName.trim()) return [];

  const params = new URLSearchParams({
    name: cityName.trim(),
    count: count.toString(),
    language: "en",
    format: "json",
  });

  const url = `${GEOCODING_BASE_URL}?${params.toString()}`;

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour (Next.js App Router)
  });

  if (!response.ok) {
    throw new Error(
      `Geocoding API failed: ${response.status} ${response.statusText}`
    );
  }

  const data: GeocodingResponse = await response.json();

  return data.results ?? [];
}