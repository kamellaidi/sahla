'use client';

import type { Dialogue } from '@/lib/types';
import type { Mot } from '@/lib/types';
import InteractivePhrase from './InteractivePhrase';
import { MessageCircle, Info } from 'lucide-react';

interface DialoguePhraseProps {
  dialogue: Dialogue;
  lookupMot: (token: string) => Mot | null;
}

export default function DialoguePhrase({ dialogue, lookupMot }: DialoguePhraseProps) {
  return (
    <div className="bg-white rounded-xl border border-[#F5EDE3] p-4">
      <div className="flex items-start gap-3">
        <MessageCircle size={18} className="text-[#C17817] mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-arabizi font-semibold text-[#1A1A2E] mb-1">
            <InteractivePhrase phrase={dialogue.phrase_arabizi} lookupMot={lookupMot} />
          </p>
          <p className="text-[#1A1A2E] text-sm">{dialogue.traduction_fr}</p>
          {dialogue.mot_a_mot && (
            <p className="text-[#6B6B7B] text-xs mt-1 italic">Mot à mot : {dialogue.mot_a_mot}</p>
          )}
          {dialogue.contexte && (
            <p className="text-[#6B6B7B] text-xs mt-1 flex items-start gap-1">
              <Info size={11} className="mt-0.5 flex-shrink-0 text-[#C17817]" />
              {dialogue.contexte}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
