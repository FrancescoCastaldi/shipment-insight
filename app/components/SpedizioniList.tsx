"use client";

import type { Spedizione } from "@/lib/storage";
import SpedizioneCard from "./SpedizioneCard";

interface Props {
  spedizioni: Spedizione[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, nuovoStato: string) => void;
}

export default function SpedizioniList({
  spedizioni,
  onDelete,
  onStatusChange,
}: Props) {
  if (spedizioni.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          Nessuna spedizione
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Aggiungi la prima spedizione per iniziare.
        </p>
      </div>
    );
  }

  return (
    <div className="lg:hidden space-y-3">
      {spedizioni.map((spedizione) => (
        <SpedizioneCard
          key={spedizione.id}
          spedizione={spedizione}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
