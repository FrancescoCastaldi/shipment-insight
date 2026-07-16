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
      setError("Tracking number is required");
      return;
    }

    const nuova: Spedizione = {
      id: generaId(),
      corriere,
      tracking: tracking.trim(),
      descrizione: descrizione.trim(),
      data_ordine: dataOrdine,
      stato: "Pending",
    };

    // Salva in localStorage
    const attuali = loadSpedizioni();
    saveSpedizioni([...attuali, nuova]);

    // Notifica il parent
    onAdded(nuova);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Add Shipment</h2>
          <button
            onClick={onClose}
            className="modal-close"
          >
            <svg
              className="icon-lg"
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
            <label className="form-label">Courier</label>
            <select
              value={corriere}
              onChange={(e) => setCorriere(e.target.value)}
              className="form-select"
            >
              <option value="GLS">GLS</option>
              <option value="BRT">BRT</option>
              <option value="DHL">DHL</option>
              <option value="SDA">SDA</option>
              <option value="TNT">TNT</option>
              <option value="UPS">UPS</option>
              <option value="FedEx">FedEx</option>
              <option value="Altro">Other</option>
            </select>
          </div>

          <div>
            <label className="form-label">
              Tracking Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="e.g. CE664369687"
              className="form-input font-mono"
            />
          </div>

          <div>
            <label className="form-label">Description</label>
            <input
              type="text"
              value={descrizione}
              onChange={(e) => setDescrizione(e.target.value)}
              placeholder="Shipment description"
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Order Date</label>
            <input
              type="date"
              value={dataOrdine}
              onChange={(e) => setDataOrdine(e.target.value)}
              className="form-input"
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
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors btn-green"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
