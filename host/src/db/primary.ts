// db.ts
import Dexie, { Table } from "dexie";
import ScanHistory from "./schemas/ScanHistory";

export class PrimaryDB extends Dexie {
    scanHistories!: Table<ScanHistory>;

    constructor() {
        super("primaryDB");
        this.version(2).stores({
            scanHistories: "++id, deviceId, createdAt", // Primary key and indexed props
        });
    }
}

export const db = new PrimaryDB();
