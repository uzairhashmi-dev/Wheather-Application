import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  // ── Reverse geocoding — lat/lon se city name dhundo
  if (lat && lon) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        cache: 'no-cache',
        headers: { 'User-Agent': 'SkyCast Weather App' },
      }
    );

    const data = await response.json();

    return NextResponse.json({
      city:
        data.address?.city ??
        data.address?.town ??
        data.address?.village ??
        data.address?.county ??
        'My Location',
      country: data.address?.country ?? '',
      country_code: data.address?.country_code?.toUpperCase() ?? '',
    });
  }

  // ── City name search — existing logic same
  if (!name) {
    return NextResponse.json({ error: 'name required' }, { status: 400 });
  }

  const params = new URLSearchParams({
    name,
    count: '6',
    language: 'en',
    format: 'json',
  });

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`,
    { cache: 'no-cache' }
  );

  const data = await response.json();
  return NextResponse.json(data);
}