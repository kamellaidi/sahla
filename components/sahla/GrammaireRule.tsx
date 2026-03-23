'use client';

import { useState } from 'react';
import type { GrammaireRegle } from '@/lib/types';
import { ChevronDown } from 'lucide-react';

interface GrammaireRuleProps {
  regle: GrammaireRegle;
}

export default function GrammaireRule({ regle }: GrammaireRuleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[#F5EDE3] rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#FBF7F0] transition-colors"
      >
        <span className="font-display font-semibold text-[#1A1A2E] text-sm">{regle.regle}</span>
        <ChevronDown
          size={18}
          className={`text-[#6B6B7B] transition-transform flex-shrink-0 ml-3 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0 border-t border-[#F5EDE3]">
          {regle.explication && (
            <p className="text-[#1A1A2E] text-sm mb-3 mt-3">{regle.explication}</p>
          )}
          {(regle.exemple_arabizi || regle.exemple_fr) && (
            <div className="bg-[#F5EDE3] rounded-lg p-3 text-sm">
              {regle.exemple_arabizi && (
                <p className="font-arabizi font-medium text-[#1A1A2E]">{regle.exemple_arabizi}</p>
              )}
              {regle.exemple_fr && (
                <p className="text-[#6B6B7B] italic mt-0.5">{regle.exemple_fr}</p>
              )}
            </div>
          )}
          {regle.notes && (
            <p className="text-[#6B6B7B] text-xs mt-3 italic">{regle.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}
