import React from 'react';

/* ── EventCard Skeleton ── */
export const EventCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
    {/* Image */}
    <div className="skeleton h-52 w-full" />
    <div className="p-5 space-y-3">
      {/* Badges */}
      <div className="flex gap-2">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-12 rounded-full" />
      </div>
      {/* Titre */}
      <div className="skeleton h-6 w-3/4 rounded-lg" />
      {/* Sous-titre */}
      <div className="skeleton h-4 w-full rounded-lg" />
      <div className="skeleton h-4 w-2/3 rounded-lg" />
      {/* Méta */}
      <div className="flex gap-3 pt-1">
        <div className="skeleton h-4 w-24 rounded-lg" />
        <div className="skeleton h-4 w-28 rounded-lg" />
      </div>
      {/* Prix + bouton */}
      <div className="flex items-center justify-between pt-2">
        <div className="skeleton h-6 w-20 rounded-lg" />
        <div className="skeleton h-10 w-28 rounded-xl" />
      </div>
    </div>
  </div>
);

/* ── Line Skeleton ── */
export const LineSkeleton: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = '',
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="skeleton h-4 rounded-lg"
        style={{ width: `${100 - (i % 3) * 15}%` }}
      />
    ))}
  </div>
);

/* ── Rect Skeleton ── */
export const RectSkeleton: React.FC<{
  width?: string;
  height?: string;
  className?: string;
}> = ({ width = '100%', height = '1rem', className = '' }) => (
  <div className={`skeleton rounded-lg ${className}`} style={{ width, height }} />
);

/* ── EventGrid Skeleton ── */
export const EventGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <EventCardSkeleton key={i} />
    ))}
  </div>
);

export default EventCardSkeleton;
