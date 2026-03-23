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
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-[#1B4F72] text-sm">{regle.regle}</span>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform flex-shrink-0 ml-3 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0 border-t border-gray-50">
          {regle.explication && (
            <p className="text-gray-700 text-sm mb-3">{regle.explication}</p>
          )}
          {(regle.exemple_arabizi || regle.exemple_fr) && (
            <div className="bg-blue-50 rounded-lg p-3 text-sm">
              {regle.exemple_arabizi && (
                <p className="font-medium text-[#1B4F72]">{regle.exemple_arabizi}</p>
              )}
              {regle.exemple_fr && (
                <p className="text-gray-500 italic mt-0.5">{regle.exemple_fr}</p>
              )}
            </div>
          )}
          {regle.notes && (
            <p className="text-gray-400 text-xs mt-3 italic">{regle.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}
