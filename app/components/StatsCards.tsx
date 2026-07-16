"use client";

import { useMemo } from "react";
import { type Spedizione } from "@/lib/storage";

interface Props {
  spedizioni: Spedizione[];
}

export default function StatsCards({ spedizioni }: Props) {
  const stats = useMemo(() => {
    const perCorriere: Record<string, number> = {};
    const perStato: Record<string, number> = {};
    let ultimaData = "";

    spedizioni.forEach((s) => {
      perCorriere[s.corriere] = (perCorriere[s.corriere] || 0) + 1;
      perStato[s.stato] = (perStato[s.stato] || 0) + 1;
      if (s.data_ordine > ultimaData) ultimaData = s.data_ordine;
    });

    return {
      totale: spedizioni.length,
      perCorriere,
      ultimaData,
      perStato,
    };
  }, [spedizioni]);

  return (
    <div className="stats-grid">
      <div className="card p-5">
        <div className="card-title">Total Shipments</div>
        <div className="card-value">{stats.totale}</div>
      </div>

      <div className="card p-5">
        <div className="card-title">By Courier</div>
        <div className="mt-2 space-y-1">
          {Object.entries(stats.perCorriere).map(([corriere, count]) => (
            <div key={corriere} className="flex items-center gap-2">
              <span
                className="gls-dot"
                style={{ width: "0.625rem", height: "0.625rem" }}
              />
              <span className="text-sm font-medium text-gray-700">
                {corriere}
              </span>
              <span className="ml-auto text-sm font-semibold text-gray-900">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <div className="card-title">By Status</div>
        <div className="mt-2 space-y-1">
          {Object.entries(stats.perStato).map(([stato, count]) => (
            <div key={stato} className="flex items-center gap-2">
              <span className="text-sm text-gray-700 truncate">{stato}</span>
              <span className="ml-auto text-sm font-semibold text-gray-900">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <div className="card-title">Latest</div>
        <div className="mt-2 text-xl font-bold text-gray-900">
          {stats.ultimaData
            ? new Date(stats.ultimaData + "T00:00:00").toLocaleDateString(
                "it-IT",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )
            : "—"}
        </div>
      </div>
    </div>
  );
}
