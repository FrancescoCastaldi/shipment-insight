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
    if (!spedizioneSelezionata) return "Shipment information request";
    return `Shipment info request - ${spedizioneSelezionata.tracking}`;
  };

  const generaCorpo = () => {
    if (!spedizioneSelezionata) return "";
    const s = spedizioneSelezionata;
    return `Dear GLS Customer Service,

I would like to request information about the following shipments:

- ${s.tracking}

I haven't received any updates and would like to know their current status.

Thank you.

Best regards,
Francesco Castaldi`;
  };

  const handleCopiaTesto = async () => {
    const testo = `To: ${DESTINATARIO_FISSO}
CC: ${CC_FISSO}
Subject: ${generaOggetto()}

${generaCorpo()}`;

    try {
      await navigator.clipboard.writeText(testo);
      setCopiato(true);
      setTimeout(() => setCopiato(false), 2000);

      // Update the shipment status
      if (selectedId) {
        onStatusChange(selectedId, "Info requested");
      }
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = testo;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiato(true);
      setTimeout(() => setCopiato(false), 2000);

      if (selectedId) {
        onStatusChange(selectedId, "Info requested");
      }
    }
  };

  // Build mailto link for local email client
  const mailtoLink = () => {
    const oggetto = encodeURIComponent(generaOggetto());
    const corpo = encodeURIComponent(generaCorpo());
    return `mailto:${DESTINATARIO_FISSO}?cc=${encodeURIComponent(CC_FISSO)}&subject=${oggetto}&body=${corpo}`;
  };

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-gray-900 mb-4">
        Request Shipment Info
      </h3>

      <div className="space-y-4">
        <div>
          <label className="form-label">Shipment</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="form-select"
          >
            <option value="">Select a shipment...</option>
            {spedizioni.map((s) => (
              <option key={s.id} value={s.id}>
                {s.tracking} - {s.descrizione}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 text-xs text-gray-600">
          <p><strong>To:</strong> {DESTINATARIO_FISSO}</p>
          <p><strong>CC:</strong> {CC_FISSO}</p>
        </div>

        {spedizioneSelezionata && (
          <div>
            <label className="form-label">Email Preview</label>
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-sm text-gray-700 whitespace-pre-wrap font-mono text-xs leading-relaxed max-h-48 overflow-y-auto">
              {generaCorpo()}
            </div>
          </div>
        )}

        {copiato && (
          <div className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
            Copied!
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleCopiaTesto}
            disabled={!selectedId}
            className="btn btn-green w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Copy Email Text
          </button>

          <a
            href={selectedId ? mailtoLink() : "#"}
            className={`w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center ${
              !selectedId ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            Open in Email Client
          </a>
        </div>
      </div>
    </div>
  );
}
