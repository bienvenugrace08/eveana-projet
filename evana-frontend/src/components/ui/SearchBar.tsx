import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import type { EventCategory } from '../../types/event';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  category: EventCategory | 'all';
  onCategoryChange: (cat: EventCategory | 'all') => void;
  sortBy: 'date' | 'price-asc' | 'price-desc' | 'name';
  onSortChange: (sort: 'date' | 'price-asc' | 'price-desc' | 'name') => void;
  resultsCount?: number;
  className?: string;
}

const CATEGORIES: { value: EventCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'festival', label: 'Festival' },
  { value: 'concert', label: 'Concert' },
  { value: 'music', label: 'Musique' },
  { value: 'workshop', label: 'Atelier' },
  { value: 'other', label: 'Autre' },
];

const SORT_OPTIONS: { value: 'date' | 'price-asc' | 'price-desc' | 'name'; label: string }[] = [
  { value: 'date', label: 'Date' },
  { value: 'price-asc', label: 'Prix ↑' },
  { value: 'price-desc', label: 'Prix ↓' },
  { value: 'name', label: 'Nom A–Z' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Rechercher un événement, un lieu…',
  category,
  onCategoryChange,
  sortBy,
  onSortChange,
  resultsCount,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce 300ms
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setInputValue(v);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onChange(v), 300);
    },
    [onChange],
  );

  const handleClear = () => {
    setInputValue('');
    onChange('');
    inputRef.current?.focus();
  };

  // Sync external value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Cleanup timeout
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barre de recherche principale */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={inputValue}
          onChange={handleInput}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 shadow-soft"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 transition"
            aria-label="Effacer la recherche"
          >
            <X className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
          </button>
        )}
      </div>

      {/* Filtres + tri */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Catégories */}
        <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Filtrer par catégorie">
          {CATEGORIES.map(({ value: cat, label }) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              aria-pressed={category === cat}
              className={[
                'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200',
                category === cat
                  ? 'bg-primary text-white shadow-glow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tri + compteur */}
        <div className="flex items-center gap-3">
          {resultsCount !== undefined && (
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {resultsCount} résultat{resultsCount !== 1 ? 's' : ''}
            </span>
          )}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 ml-1.5" aria-hidden="true" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as typeof sortBy)}
              aria-label="Trier les événements"
              className="bg-transparent text-xs font-medium text-slate-600 dark:text-slate-300 pr-2 focus:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map(({ value: v, label }) => (
                <option key={v} value={v}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
