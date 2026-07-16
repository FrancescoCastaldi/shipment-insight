"use client";

import { useState } from "react";
import { saveSpedizioni, type Spedizione } from "@/lib/storage";

interface Props {
  spedizioni: Spedizione[];
  onStatusChange: (id: string, nuovoStato: string) => void;
}

const DESTINATARIO_FISSO = "customerservice@gls-italy.com";
const CC_FISSO = "info@francescocastaldi.it";

export default function EmailPanel({ spedizioni, onStatusChange }: Props) {
  const [selectedId, setSelectedId] = useState("");
  const [copiato, setCopiato] = useState(false);

  const spedizioneSelezionata = spedizioni.find((s) => s.id === selectedId);

  const generaOggetto = () => {
    if (!spedizioneSelezionata) return "Richiesta informazioni spedizione";
    return `Richiesta informazioni - Spedizione ${spedizioneSelezionata.tracking}`;
  };

  const generaCorpo = () => {
    if (!spedizioneSelezionata) return "";
    const s = spedizioneSelezionata;
    return `Buongiorno,

sto richiedendo informazioni riguardo la seguente spedizione:

Numero Tracking: ${s.tracking}
Corriere: ${s.corriere}
Descrizione: ${s.descrizione}
Data Ordine: ${new Date(s.data_ordine + "T00:00:00").toLocaleDateString(
      "it-IT",
      { day: "numeric", month: "long", year: "numeric" }
    )}
Stato Attuale: ${s.stato}

Link tracking: ${s.link_tracking || "N/D"}

Potreste fornirmi un aggiornamento sullo stato della spedizione?

Cordiali saluti`;
  };

  const handleCopiaTesto = async () => {
    const testo = `A: ${DESTINATARIO_FISSO}
CC: ${CC_FISSO}
Oggetto: ${generaOggetto()}

${generaCorpo()}`;

    try {
      await navigator.clipboard.writeText(testo);
      setCopiato(true);
      setTimeout(() => setCopiato(false), 2000);

      // Aggiorna lo stato della spedizione
      if (selectedId) {
        onStatusChange(selectedId, "Richiesta info inviata");
      }
    } catch {
      // Fallback per browser che non supportano clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = testo;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiato(true);
      setTimeout(() => setCopiato(false), 2000);

      if (selectedId) {
        onStatusChange(selectedId, "Richiesta info inviata");
      }
    }
  };

  // Costruisci il link mailto per apertura client email locale
  const mailtoLink = () => {
    const oggetto = encodeURIComponent(generaOggetto());
    const corpo = encodeURIComponent(generaCorpo());
    return `mailto:${DESTINATARIO_FISSO}?cc=${encodeURIComponent(CC_FISSO)}&subject=${oggetto}&body=${corpo}`;
  };

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-gray-900 mb-4">
        Richiesta Informazioni Spedizione
      </h3>

      <div className="space-y-4">
        <div>
          <label className="form-label">Spedizione</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="form-select"
          >
            <option value="">Seleziona una spedizione...</option>
            {spedizioni.map((s) => (
              <option key={s.id} value={s.id}>
                {s.tracking} - {s.descrizione}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 text-xs text-gray-600">
          <p><strong>Destinatario:</strong> {DESTINATARIO_FISSO}</p>
          <p><strong>CC:</strong> {CC_FISSO}</p>
        </div>

        {spedizioneSelezionata && (
          <div>
            <label className="form-label">Anteprima Email</label>
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-sm text-gray-700 whitespace-pre-wrap font-mono text-xs leading-relaxed max-h-48 overflow-y-auto">
              {generaCorpo()}
            </div>
          </div>
        )}

        {copiato && (
          <div className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
            Testo copiato negli appunti!
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleCopiaTesto}
            disabled={!selectedId}
            className="btn btn-green w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Copia Testo Email
          </button>

          <a
            href={selectedId ? mailtoLink() : "#"}
            className={`w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center ${
              !selectedId ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            Apri nel Client Email
          </a>
        </div>
      </div>
    </div>
  );
}
