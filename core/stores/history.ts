import { createSignal } from "solid-js";
import { makePersisted } from "@solid-primitives/storage";
import type { AsyncStorage } from "@solid-primitives/storage";
import { get, set, del } from "idb-keyval";

type ScanSentEntry = {
    type: "scan-sent";
    content: string;
    timestamp: number;
    receiverIds: string[];
};
type ScanReceivedEntry = {
    type: "scan-received";
    content: string;
    timestamp: number;
    scannerId: string;
};
type ConnectionEntry = {
    type: "connection";
    timestamp: number;
    peerId: string;
};
export type HistoryEntry = ScanSentEntry | ScanReceivedEntry | ConnectionEntry;

const idbStorage: AsyncStorage = {
    getItem: async (key: string) => (await get(key)) ?? null,
    setItem: (key: string, value: string) => set(key, value),
    removeItem: (key: string) => del(key),
};

const [_history, _setHistory] = makePersisted(createSignal<HistoryEntry[]>([]), {
    name: "app-history",
    storage: idbStorage,
});

export const [maxHistoryLength, setMaxHistoryLength] = makePersisted(createSignal(256), {
    name: "maxHistoryLength",
    storage: localStorage,
});

export const history = () => _history();

const setHistory = (fn: (prev: HistoryEntry[]) => HistoryEntry[]) => {
    _setHistory((prev) => {
        const newHistory = fn(prev);
        return newHistory.slice(-maxHistoryLength());
    });
};

// ===== actions =====

export function addScanSentHistory(content: string, receiverIds: string[]) {
    setHistory((prev) => [
        ...prev,
        { type: "scan-sent", content, receiverIds, timestamp: Date.now() },
    ]);
}

export function addConnectionHistory(peerId: string) {
    setHistory((prev) => [...prev, { type: "connection", peerId, timestamp: Date.now() }]);
}

export function addScanReceivedHistory(content: string, scannerId: string) {
    setHistory((prev) => [
        ...prev,
        { type: "scan-received", content, scannerId, timestamp: Date.now() },
    ]);
}

// ===== type guards =====

export function isConnectionHistory(entry: HistoryEntry): entry is ConnectionEntry {
    return entry.type === "connection";
}

export function isScanSentHistory(entry: HistoryEntry): entry is ScanSentEntry {
    return entry.type === "scan-sent";
}

export function isScanReceivedHistory(entry: HistoryEntry): entry is ScanReceivedEntry {
    return entry.type === "scan-received";
}
