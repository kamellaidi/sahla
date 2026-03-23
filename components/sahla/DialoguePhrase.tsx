'use client';

import type { Dialogue } from '@/lib/types';
import type { Mot } from '@/lib/types';
import InteractivePhrase from './InteractivePhrase';
import { MessageCircle } from 'lucide-react';

interface DialoguePhraseProps {
  dialogue: Dialogue;
  lookupMot: (token: string) => Mot | null;
}

export default function DialoguePhrase({ dialogue, lookupMot }: DialoguePhraseProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-start gap-3">
        <MessageCircle size={18} className="text-[#E65100] mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-semibold text-[#1B4F72] mb-1">
            <InteractivePhrase phrase={dialogue.phrase_arabizi} lookupMot={lookupMot} />
          </p>
          <p className="text-gray-700 text-sm">{dialogue.traduction_fr}</p>
          {dialogue.mot_a_mot && (
            <p className="text-gray-400 text-xs mt-1 italic">Mot à mot : {dialogue.mot_a_mot}</p>
          )}
          {dialogue.contexte && (
            <p className="text-gray-400 text-xs mt-1">💡 {dialogue.contexte}</p>
          )}
        </div>
      </div>
    </div>
  );
}
