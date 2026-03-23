'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMots } from '@/hooks/useMots';
import { useMotSearch } from '@/hooks/useMotSearch';
import { useCategories } from '@/hooks/useCategories';
import MotCard from '@/components/sahla/MotCard';
import SearchBar from '@/components/ui/SearchBar';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 24;

export default function DictionnairePage() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';

  const [page, setPage] = useState(1);
  const [categorieActive, setCategorieActive] = useState<string>('');

  const { categories } = useCategories();
  const { query, setQuery, results: searchResults, loading: searchLoading } = useMotSearch(initialQ);
  const { mots, total, loading: motLoading } = useMots({
    categorie: categorieActive || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const isSearching = query.trim().length > 0;
  const displayed = isSearching ? searchResults : mots;
  const loading = isSearching ? searchLoading : motLoading;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Reset page when changing filter
  useEffect(() => { setPage(1); }, [categorieActive]);

  return (
    <div className="max-container padding-container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="text-[#C17817]" size={28} />
          <h1 className="font-display text-3xl font-black text-[#1A1A2E]">Dictionnaire</h1>
        </div>
        <p className="text-[#6B6B7B]">
          {total.toLocaleString('fr')} mots en arabizi algérien avec traductions et exemples
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          placeholder="Cherche un mot en dardja ou en français..."
          defaultValue={initialQ}
          onSearch={setQuery}
        />
        {isSearching && (
          <p className="text-sm text-[#6B6B7B] mt-2">
            {searchLoading
              ? 'Recherche...'
              : `${searchResults.length} résultat${searchResults.length !== 1 ? 's' : ''} pour « ${query} »`}
          </p>
        )}
      </div>

      {/* Filtres catégories */}
      {!isSearching && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setCategorieActive('')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              categorieActive === ''
                ? 'bg-[#1A1A2E] text-white'
                : 'bg-[#F5EDE3] text-[#6B6B7B] hover:bg-[#F5EDE3]/80'
            }`}
          >
            Tous
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategorieActive(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors capitalize ${
                categorieActive === cat
                  ? 'bg-[#1A1A2E] text-white'
                  : 'bg-[#F5EDE3] text-[#6B6B7B] hover:bg-[#F5EDE3]/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#F5EDE3] p-4 animate-pulse">
              <div className="h-5 bg-[#F5EDE3] rounded w-24 mb-2" />
              <div className="h-4 bg-[#F5EDE3] rounded w-40" />
            </div>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 text-[#6B6B7B]">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">Aucun mot trouvé</p>
          {isSearching && (
            <p className="text-sm mt-1">Essaie avec un autre terme ou vérifie l&apos;orthographe arabizi.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {displayed.map((mot) => (
            <MotCard key={mot.id} mot={mot} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isSearching && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-2 rounded-lg border border-[#F5EDE3] disabled:opacity-40 hover:bg-[#F5EDE3] transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-[#6B6B7B]">
            Page {page} sur {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-2 rounded-lg border border-[#F5EDE3] disabled:opacity-40 hover:bg-[#F5EDE3] transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
