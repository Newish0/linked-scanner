import { Peer, type DataConnection } from "peerjs";
import { createSignal } from "solid-js";
import { getDeviceId, getDeviceName } from "../utils/deviceId";
import { addConnectionHistory, addScanSentHistory, addScanReceivedHistory } from "./history";

// ===== types =====

type ScanData = {
    type: "scan";
    content: string;
};

type Data = ScanData;

type DataHandler = (conn: DataConnection, data: Data) => void;

// ===== state =====

const deviceId = getDeviceId();
const deviceName = getDeviceName();

export const [connections, setConnections] = createSignal<DataConnection[]>([]);
export const isConnected = () => connections().length > 0;

const peer = new Peer(deviceId, {});

// Maps each user-supplied callback to the per-connection wrapper functions
// actually registered on that connection, so we can remove the exact same
// function reference later.
const wrappers = new Map<DataHandler, Map<DataConnection, (data: unknown) => void>>();

// ===== guards =====

const isValidData = (data: unknown): data is Data =>
    data !== null && typeof data === "object" && "type" in data && "content" in data;

// ===== helpers =====

// Attach every currently-registered handler to a (new) connection.
const attachToConnection = (conn: DataConnection) => {
    for (const [cb, connMap] of wrappers) {
        if (connMap.has(conn)) continue;
        const wrapper = (data: unknown) => {
            isValidData(data) && cb(conn, data);
        };
        connMap.set(conn, wrapper);
        conn.on("data", wrapper);
    }
};

// Detach every registered handler from a connection (e.g. on close),
// and forget it so we don't leak map entries.
const detachFromConnection = (conn: DataConnection) => {
    for (const connMap of wrappers.values()) {
        const wrapper = connMap.get(conn);
        if (wrapper) {
            conn.off("data", wrapper);
            connMap.delete(conn);
        }
    }
};

// Records any valid scan data received on a connection to history.
// Shared between the "someone connected to me" and "I connected to
// someone" code paths so both are tracked identically.
const trackReceivedScans = (conn: DataConnection) => {
    const handler = (data: unknown) => {
        if (isValidData(data)) {
            addScanReceivedHistory(data.content, conn.peer);
        }
    };
    conn.on("data", handler);
    conn.on("close", () => {
        conn.off("data", handler);
    });
};

const registerConnection = (conn: DataConnection, peerId: string) => {
    setConnections((prev) => [...prev, conn]);
    attachToConnection(conn);
    trackReceivedScans(conn);
    addConnectionHistory(peerId, conn.metadata?.name);

    conn.on("close", () => {
        setConnections((prev) => prev.filter((c) => c !== conn));
        detachFromConnection(conn);
    });
};

// ===== event handlers =====

peer.on("connection", (conn) => {
    registerConnection(conn, conn.peer);
});

export const onData = (cb: DataHandler) => {
    let connMap = wrappers.get(cb);
    if (!connMap) {
        connMap = new Map();
        wrappers.set(cb, connMap);
    }
    for (const conn of connections()) {
        attachToConnection(conn);
    }
};

export const offData = (cb: DataHandler) => {
    const connMap = wrappers.get(cb);
    if (!connMap) return;
    for (const [conn, wrapper] of connMap) {
        conn.off("data", wrapper);
    }
    wrappers.delete(cb);
};

// ===== actions =====

export const connect = (id: string, timeout = 30000) => {
    const existingConnection = connections().find((c) => c.peer === id);
    if (existingConnection) throw new Error("Already connected");

    return new Promise<DataConnection>((resolve, reject) => {
        const conn = peer.connect(id, {
            metadata: { id: deviceId, name: undefined }, // TODO
        });

        const timeoutId = setTimeout(() => {
            conn.close();
            reject(new Error("Connection timed out"));
        }, timeout);

        conn.on("open", () => {
            clearTimeout(timeoutId);
            registerConnection(conn, id);
            resolve(conn);
        });
    });
};

const sendData = (data: Data) => {
    for (const conn of connections()) {
        conn.send(data);
    }
};

export const sendScan = (content: string) => {
    sendData({
        type: "scan",
        content,
    });

    addScanSentHistory(
        content,
        connections().map((c) => c.peer),
    );
};
