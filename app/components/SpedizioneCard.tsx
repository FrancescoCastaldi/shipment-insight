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
  const getStatusBadge = (stato: string) => {
    if (stato.includes("arrivo") || stato.includes("monitor"))
      return "badge-yellow";
    if (stato.includes("inviata") || stato.includes("Rettifica"))
      return "badge-blue";
    if (stato.includes("Consegnata"))
      return "badge-green";
    return "badge-yellow";
  };

  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: "#8DC63F" }}
            >
              {spedizione.corriere}
            </span>
            <span className={`badge ${getStatusBadge(spedizione.stato)}`}>
              {spedizione.stato}
            </span>
          </div>

          <p className="text-sm font-mono text-gray-900 font-medium truncate">
            {spedizione.tracking}
          </p>
          <p className="text-sm text-gray-600 mt-1 truncate">
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
            className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <svg
              className="icon-sm"
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
          className="btn btn-sm btn-blue"
        >
          Aggiorna stato
        </button>

        <button
          onClick={() => onDelete(spedizione.id)}
          className="btn btn-sm btn-red ml-auto"
        >
          <svg
            className="icon-sm"
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
