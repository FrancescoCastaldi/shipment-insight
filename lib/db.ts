import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "spedizioni.json");

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

export function readSpedizioni(): Spedizione[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function writeSpedizioni(data: Spedizione[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}
