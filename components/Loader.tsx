// Skeleton loading components — shown while API data is being fetched.
// Uses pulse animation instead of a spinner — professional UX pattern.
// Three exported skeletons:
//   1. WeatherCardSkeleton   → main weather card placeholder
//   2. ForecastCardSkeleton  → daily/hourly forecast placeholder
//   3. FullPageSkeleton      → combines both for the weather page

// Primitive — reusable shimmer block

interface SkeletonBlockProps {
  className?: string;
}

function SkeletonBlock({ className = '' }: SkeletonBlockProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700 ${className}`}
    />
  );
}


export function WeatherCardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800 sm:p-8">

      {/* City name + country */}
      <div className="mb-6 flex items-start justify-between">
        <div className="space-y-2">
          <SkeletonBlock className="h-8 w-40" />
          <SkeletonBlock className="h-4 w-24" />
        </div>
        {/* Flag placeholder */}
        <SkeletonBlock className="h-12 w-12 rounded-2xl" />
      </div>

      {/* Big temperature + icon */}
      <div className="mb-8 flex items-center gap-4">
        <SkeletonBlock className="h-24 w-32" />
        <div className="space-y-2">
          <SkeletonBlock className="h-6 w-28" />
          <SkeletonBlock className="h-4 w-20" />
        </div>
      </div>

      {/* Stats row: humidity, wind, feels like, UV */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/50"
          >
            <SkeletonBlock className="h-4 w-4 rounded-full" />
            <SkeletonBlock className="h-6 w-16" />
            <SkeletonBlock className="h-3 w-12" />
          </div>
        ))}
      </div>

      {/* Sunrise / sunset */}
      <div className="flex gap-3">
        <SkeletonBlock className="h-12 flex-1 rounded-2xl" />
        <SkeletonBlock className="h-12 flex-1 rounded-2xl" />
      </div>
    </div>
  );
}

// 2. ForecastCardSkeleton
// 

export function ForecastCardSkeleton() {
  return (
    <div className="w-full space-y-4">

      {/* Section title */}
      <SkeletonBlock className="h-6 w-36" />

      {/* Hourly scroll row */}
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex shrink-0 flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
          >
            <SkeletonBlock className="h-3 w-10" />
            <SkeletonBlock className="h-8 w-8 rounded-full" />
            <SkeletonBlock className="h-5 w-8" />
          </div>
        ))}
      </div>

      {/* Section title */}
      <SkeletonBlock className="mt-2 h-6 w-32" />

      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-700 dark:bg-slate-800"
        >
          <SkeletonBlock className="h-4 w-10" />
          <SkeletonBlock className="h-7 w-7 rounded-full" />
          <SkeletonBlock className="h-4 w-20" />
          <SkeletonBlock className="hidden h-4 w-16 sm:block" />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. FullPageSkeleton — used in app/weather/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

export function FullPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <WeatherCardSkeleton />
      <ForecastCardSkeleton />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SearchBarSkeleton — optional, for SSR fallback
// ─────────────────────────────────────────────────────────────────────────────

export function SearchBarSkeleton() {
  return <SkeletonBlock className="h-14 w-full max-w-2xl rounded-2xl" />;
}