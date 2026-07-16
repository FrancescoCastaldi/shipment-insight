"use client";

import { useEffect, useState, useCallback } from "react";
import { loadSpedizioni, saveSpedizioni, generaId, type Spedizione } from "@/lib/storage";
import StatsCards from "./StatsCards";
import SpedizioniList from "./SpedizioniList";
import AddForm from "./AddForm";
import TicketRef from "./TicketRef";
import EmailPanel from "./EmailPanel";

export default function Dashboard() {
  const [spedizioni, setSpedizioni] = useState<Spedizione[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const caricaSpedizioni = useCallback(() => {
    setSpedizioni(loadSpedizioni());
  }, []);

  useEffect(() => {
    caricaSpedizioni();
  }, [caricaSpedizioni]);

  const handleDelete = (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa spedizione?")) return;
    const aggiornate = spedizioni.filter((s) => s.id !== id);
    saveSpedizioni(aggiornate);
    setSpedizioni(aggiornate);
  };

  const handleStatusChange = (id: string, nuovoStato: string) => {
    const aggiornate = spedizioni.map((s) =>
      s.id === id ? { ...s, stato: nuovoStato } : s
    );
    saveSpedizioni(aggiornate);
    setSpedizioni(aggiornate);
  };

  const handleAdd = (nuova: Spedizione) => {
    const aggiornate = [...spedizioni, nuova];
    saveSpedizioni(aggiornate);
    setSpedizioni(aggiornate);
  };

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container py-4">
          <div className="header-content">
            <div className="header-left">
              <div className="header-logo">
                <svg
                  className="icon-lg"
                  style={{ color: "#8DC63F" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <div>
                <h1 className="header-title">Spedizioni Tracker</h1>
                <p className="header-subtitle">Monitoraggio spedizioni GLS</p>
              </div>
            </div>
            <div className="header-actions">
              <button
                onClick={caricaSpedizioni}
                className="btn btn-ghost"
              >
                <svg
                  className="icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Aggiorna
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn btn-white"
              >
                <svg
                  className="icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Aggiungi Spedizione
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Stats */}
        <StatsCards spedizioni={spedizioni} />

        {/* Content Grid */}
        <div className="grid grid-cols-3">
          {/* Spedizioni List */}
          <div className="lg:col-span-2">
            <div className="card">
              {/* Tabella per desktop */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="table-header">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Tracking
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Corriere
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Descrizione
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Stato
                      </th>
                      <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Azioni
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {spedizioni.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            Nessuna spedizione trovata
                          </div>
                        </td>
                      </tr>
                    ) : (
                      spedizioni.map((spedizione) => (
                        <tr
                          key={spedizione.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-mono font-medium text-gray-900">
                                {spedizione.tracking}
                              </span>
                              {spedizione.link_tracking && (
                                <a
                                  href={spedizione.link_tracking}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="link-ext"
                                  title="Apri tracking"
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
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 text-sm font-medium"
                              style={{ color: "#8DC63F" }}
                            >
                              <span className="gls-dot" />
                              {spedizione.corriere}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">
                              {spedizione.descrizione}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-500">
                              {new Date(
                                spedizione.data_ordine + "T00:00:00"
                              ).toLocaleDateString("it-IT", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`badge ${
                                spedizione.stato.includes("inviata")
                                  ? "badge-blue"
                                  : spedizione.stato.includes("Consegnata")
                                  ? "badge-green"
                                  : "badge-yellow"
                              }`}
                            >
                              {spedizione.stato}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    spedizione.id,
                                    "Richiesta info inviata"
                                  )
                                }
                                className="btn btn-sm btn-blue"
                              >
                                Aggiorna
                              </button>
                              <button
                                onClick={() => handleDelete(spedizione.id)}
                                className="btn btn-sm btn-red"
                              >
                                Elimina
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Cards per mobile */}
              <div className="lg:hidden p-4">
                {spedizioni.length === 0 ? (
                  <div className="empty-state">
                    Nessuna spedizione trovata
                  </div>
                ) : (
                  <SpedizioniList
                    spedizioni={spedizioni}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TicketRef />
            <EmailPanel spedizioni={spedizioni} onStatusChange={handleStatusChange} />
          </div>
        </div>
      </main>

      {/* Add Form Modal */}
      {showAddForm && (
        <AddForm
          onAdded={handleAdd}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}
