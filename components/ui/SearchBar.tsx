'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  compact?: boolean;
  className?: string;
  defaultValue?: string;
  /** Appelé à chaque frappe (debounce géré par le hook côté appelant) */
  onSearch?: (query: string) => void;
}

export default function SearchBar({
  placeholder = 'Cherche un mot en darija ou en français...',
  compact = false,
  className,
  defaultValue = '',
  onSearch,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  // Sync si defaultValue change (ex : navigation)
  useEffect(() => { setValue(defaultValue); }, [defaultValue]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setValue(v);
      if (onSearch) onSearch(v); // déclenche à chaque frappe — debounce dans le hook
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    setValue('');
    if (onSearch) onSearch('');
  }, [onSearch]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!value.trim()) return;
      if (!onSearch) {
        router.push(`/dictionnaire?q=${encodeURIComponent(value.trim())}`);
      }
    },
    [value, onSearch, router]
  );

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={compact ? 16 : 20}
      />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-[#1B4F72] focus:border-transparent',
          'transition-shadow',
          compact
            ? 'pl-8 pr-8 py-2 text-sm'
            : 'pl-12 pr-10 py-4 text-base shadow-md'
        )}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Effacer"
        >
          <X size={compact ? 14 : 18} />
        </button>
      )}
    </form>
  );
}
