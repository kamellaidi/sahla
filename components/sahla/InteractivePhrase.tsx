'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { Mot } from '@/lib/types';
import { normalizeToken, getCategoryColor } from '@/lib/utils';

interface InteractivePhraseProps {
  phrase: string;
  lookupMot: (token: string) => Mot | null;
  className?: string;
}

/** Split la phrase en tokens (mots + ponctuation séparée) */
function tokenize(phrase: string): string[] {
  return phrase.match(/[a-zA-Z0-9éàèùâêîôûëïüæœ']+|[^\sa-zA-Z0-9éàèùâêîôûëïüæœ']+|\s+/g) ?? [];
}

function isWord(token: string): boolean {
  return /[a-zA-Z0-9]/.test(token);
}

interface PopoverData {
  mot: Mot;
  rect: DOMRect;
}

export default function InteractivePhrase({ phrase, lookupMot, className }: InteractivePhraseProps) {
  const [popover, setPopover] = useState<PopoverData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const tokens = tokenize(phrase);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setPopover(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline ${className ?? ''}`}>
      {tokens.map((token, i) => {
        if (!isWord(token)) {
          return (
            <span key={i} className="whitespace-pre">
              {token}
            </span>
          );
        }
        const mot = lookupMot(normalizeToken(token));
        if (!mot) {
          return <span key={i}>{token}</span>;
        }
        return (
          <button
            key={i}
            className="word-interactive font-medium"
            onClick={(e) => {
              e.stopPropagation();
              const rect = (e.target as HTMLElement).getBoundingClientRect();
              setPopover(popover?.mot.id === mot.id ? null : { mot, rect });
            }}
          >
            {token}
          </button>
        );
      })}

      {/* Popover */}
      {popover && (
        <div
          className="absolute z-50 bg-white rounded-xl shadow-lg border border-[#F5EDE3] p-4 w-64"
          style={{
            top: '100%',
            left: 0,
            marginTop: 6,
          }}
        >
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="font-display font-arabizi text-lg font-bold text-[#1A1A2E]">{popover.mot.mot_arabizi}</span>
            {popover.mot.categorie && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize flex-shrink-0 ${getCategoryColor(popover.mot.categorie)}`}
              >
                {popover.mot.categorie}
              </span>
            )}
          </div>
          <p className="text-[#1A1A2E] font-medium mb-1">{popover.mot.traduction_fr}</p>
          {popover.mot.traduction_en && (
            <p className="text-[#6B6B7B] text-xs mb-2">{popover.mot.traduction_en}</p>
          )}
          <Link
            href={`/dictionnaire/${popover.mot.slug}`}
            className="text-[#C17817] text-sm font-medium hover:underline"
            onClick={() => setPopover(null)}
          >
            Voir ce mot →
          </Link>
        </div>
      )}
    </div>
  );
}
