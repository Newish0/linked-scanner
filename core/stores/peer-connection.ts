import { Peer, type DataConnection } from "peerjs";
import { createSignal } from "solid-js";
import { makePersisted } from "@solid-primitives/storage";
import { deviceId, deviceName } from "./device";
import { addConnectionHistory, addScanSentHistory, addScanReceivedHistory } from "./history";

// ===== types =====

type ScanData = {
    type: "scan";
    content: string;
};

type HelloData = {
    type: "hello";
    name: string;
};

type Data = ScanData | HelloData;

type DataHandler = (conn: DataConnection, data: Data) => void;

// ===== state =====

const [_connections, _setConnections] = createSignal<DataConnection[]>([]);
export const connections = () => _connections();
export const isConnected = () => _connections().length > 0;

// Reactive map of peerId -> the name they told us about themselves via "hello".
// Persisted so we still remember a peer's name across reloads, even before
// we've re-connected and received a fresh "hello" from them.
const [peerNames, setPeerNames] = makePersisted(createSignal<Map<string, string>>(new Map()), {
    name: "peerNames",
    serialize: (value) => JSON.stringify([...value.entries()]),
    deserialize: (value) => new Map(JSON.parse(value)),
});
export const getPeerName = (peerId: string) => peerNames().get(peerId);

const peer = new Peer(deviceId(), {});

// Maps each user-supplied callback to the per-connection wrapper functions
// actually registered on that connection, so we can remove the exact same
// function reference later.
const wrappers = new Map<DataHandler, Map<DataConnection, (data: unknown) => void>>();

// ===== guards =====

const isValidData = (data: unknown): data is Data => {
    if (data === null || typeof data !== "object" || !("type" in data)) return false;

    const d = data as { type: unknown };

    if (d.type === "scan") {
        return "content" in data && typeof (data as { content: unknown }).content === "string";
    }

    if (d.type === "hello") {
        return "name" in data && typeof (data as { name: unknown }).name === "string";
    }

    return false;
};

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
        if (isValidData(data) && data.type === "scan") {
            addScanReceivedHistory(data.content, conn.peer);
        }
    };
    conn.on("data", handler);
    conn.on("close", () => {
        conn.off("data", handler);
    });
};

// Listens for "hello" messages on a connection and records the peer's
// self-reported name, so both sides learn each other's name regardless
// of who initiated the connection.
const trackHello = (conn: DataConnection) => {
    const handler = (data: unknown) => {
        if (isValidData(data) && data.type === "hello") {
            setPeerNames((prev) => {
                const next = new Map(prev);
                next.set(conn.peer, data.name);
                return next;
            });
        }
    };
    conn.on("data", handler);
    conn.on("close", () => {
        conn.off("data", handler);
    });
};

// Tells the given connection our own device name. Sent as soon as a
// connection opens, from both sides, so name exchange doesn't depend
// on which side initiated the connection.
const sayHello = (conn: DataConnection) => {
    conn.send({ type: "hello", name: deviceName() } satisfies HelloData);
};

const registerConnection = (conn: DataConnection, peerId: string) => {
    _setConnections((prev) => [...prev, conn]);
    attachToConnection(conn);
    trackReceivedScans(conn);
    trackHello(conn);
    addConnectionHistory(peerId);
    sayHello(conn);

    conn.on("close", () => {
        _setConnections((prev) => prev.filter((c) => c !== conn));
        detachFromConnection(conn);
        // Note: peerNames is intentionally left alone here - it's persisted
        // now, so we keep remembering a peer's name after they disconnect.
    });
};

// ===== event handlers =====

peer.on("connection", (conn) => {
    conn.on("open", () => {
        registerConnection(conn, conn.peer);
    });
});

export const onData = (cb: DataHandler) => {
    let connMap = wrappers.get(cb);
    if (!connMap) {
        connMap = new Map();
        wrappers.set(cb, connMap);
    }
    for (const conn of _connections()) {
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
    const existingConnection = _connections().find((c) => c.peer === id);
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
    for (const conn of _connections()) {
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
        _connections().map((c) => c.peer),
    );
};
