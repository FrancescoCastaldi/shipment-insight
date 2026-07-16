// Storage lato client per GitHub Pages
export interface Spedizione {
  id: string;
  corriere: string;
  tracking: string;
  descrizione: string;
  data_ordine: string;
  stato: string;
  link_tracking?: string;
  note?: string;
}

const STORAGE_KEY = "spedizioni-tracker-data";

// Dati iniziali da caricare se localStorage è vuoto
const DATI_INIZIALI: Spedizione[] = [
  {
    id: "1",
    corriere: "GLS",
    tracking: "CE664369687",
    descrizione: "Spedizione in arrivo",
    data_ordine: "2026-07-13",
    stato: "Richiesta info inviata",
    link_tracking: "https://gls-group.com/IT/it/servizi-online/ricerca-spedizioni?match=CE664369687&type=NAT"
  },
  {
    id: "2",
    corriere: "GLS",
    tracking: "SA662583604",
    descrizione: "Rettifica notifica spedizione",
    data_ordine: "2026-07-15",
    stato: "Richiesta info inviata",
    link_tracking: "https://www.gls-italy.com/index.php?option=com_gls&view=track_e_trace&mode=search&diretto=yes&locpartenza=CE&numsped=662583604&lnk=1"
  },
  {
    id: "3",
    corriere: "GLS",
    tracking: "VB660343413",
    descrizione: "Spedizione da monitorare",
    data_ordine: "2026-07-14",
    stato: "Richiesta info inviata",
    link_tracking: "https://www.gls-italy.com/index.php?option=com_gls&view=track_e_trace&mode=search&diretto=yes&locpartenza=CE&numsped=660343413&lnk=1"
  }
];

export function loadSpedizioni(): Spedizione[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
    // Prima volta: carica dati iniziali
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DATI_INIZIALI));
    return DATI_INIZIALI;
  } catch {
    return DATI_INIZIALI;
  }
}

export function saveSpedizioni(data: Spedizione[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function generaId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
