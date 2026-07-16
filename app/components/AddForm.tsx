"use client";

import { useState } from "react";
import { saveSpedizioni, loadSpedizioni, generaId, type Spedizione } from "@/lib/storage";

interface Props {
  onAdded: (nuova: Spedizione) => void;
  onClose: () => void;
}

export default function AddForm({ onAdded, onClose }: Props) {
  const [tracking, setTracking] = useState("");
  const [corriere, setCorriere] = useState("GLS");
  const [descrizione, setDescrizione] = useState("");
  const [dataOrdine, setDataOrdine] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!tracking.trim()) {
      setError("Il numero di tracking è obbligatorio");
      return;
    }

    const nuova: Spedizione = {
      id: generaId(),
      corriere,
      tracking: tracking.trim(),
      descrizione: descrizione.trim(),
      data_ordine: dataOrdine,
      stato: "In attesa",
    };

    // Salva in localStorage
    const attuali = loadSpedizioni();
    saveSpedizioni([...attuali, nuova]);

    // Notifica il parent
    onAdded(nuova);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Nuova Spedizione
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Corriere
            </label>
            <select
              value={corriere}
              onChange={(e) => setCorriere(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
            >
              <option value="GLS">GLS</option>
              <option value="BRT">BRT</option>
              <option value="DHL">DHL</option>
              <option value="SDA">SDA</option>
              <option value="TNT">TNT</option>
              <option value="UPS">UPS</option>
              <option value="FedEx">FedEx</option>
              <option value="Altro">Altro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numero Tracking <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="Es. CE664369687"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrizione
            </label>
            <input
              type="text"
              value={descrizione}
              onChange={(e) => setDescrizione(e.target.value)}
              placeholder="Descrizione della spedizione"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Ordine
            </label>
            <input
              type="date"
              value={dataOrdine}
              onChange={(e) => setDataOrdine(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
              style={{ backgroundColor: "#8DC63F" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#6BA32E")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#8DC63F")
              }
            >
              Aggiungi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
