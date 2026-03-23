'use client';

import { useMotLookup } from '@/hooks/useMotLookup';
import DialoguePhrase from '@/components/sahla/DialoguePhrase';
import type { Dialogue } from '@/lib/types';

interface Props {
  dialogues: Dialogue[];
}

export default function DialoguesThemeClient({ dialogues }: Props) {
  const { lookupMot } = useMotLookup();

  return (
    <div className="space-y-3 max-w-2xl">
      {dialogues.map((dialogue) => (
        <DialoguePhrase key={dialogue.id} dialogue={dialogue} lookupMot={lookupMot} />
      ))}
    </div>
  );
}
