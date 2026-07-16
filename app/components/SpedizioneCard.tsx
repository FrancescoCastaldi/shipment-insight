"use client";

import type { Spedizione } from "@/lib/storage";

interface Props {
  spedizione: Spedizione;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, nuovoStato: string) => void;
}

export default function SpedizioneCard({
  spedizione,
  onDelete,
  onStatusChange,
}: Props) {
  const getStatusColor = (stato: string) => {
    if (stato.includes("arrivo") || stato.includes("monitor"))
      return "bg-yellow-100 text-yellow-800";
    if (stato.includes("inviata") || stato.includes("Rettifica"))
      return "bg-blue-100 text-blue-800";
    if (stato.includes("Consegnata"))
      return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: "#8DC63F" }}
            >
              {spedizione.corriere}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                spedizione.stato
              )}`}
            >
              {spedizione.stato}
            </span>
          </div>

          <p className="text-sm font-mono text-gray-900 font-medium truncate">
            {spedizione.tracking}
          </p>
          <p className="text-sm text-gray-600 mt-0.5 truncate">
            {spedizione.descrizione}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(
              spedizione.data_ordine + "T00:00:00"
            ).toLocaleDateString("it-IT", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
        {spedizione.link_tracking && (
          <a
            href={spedizione.link_tracking}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Tracking
          </a>
        )}

        <button
          onClick={() => onStatusChange(spedizione.id, "Richiesta info inviata")}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          Aggiorna stato
        </button>

        <button
          onClick={() => onDelete(spedizione.id)}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition-colors ml-auto"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Elimina
        </button>
      </div>
    </div>
  );
}
