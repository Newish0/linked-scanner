import { connectionsAtom, localPeerAtom } from "@atoms/peer";
import { PeerId } from "@shared/type/general";
import { ConnectionMetadata } from "@shared/type/peer";
import { useAtom } from "jotai";
import { DataConnection, Peer, PeerConnectOption } from "peerjs";
import { useEffect } from "react";

type DataHandler = (data: unknown, connection: DataConnection) => void;
type ConnectionHandler = (connection: DataConnection) => void;

type GlobalPeerOptions = {
    handleData?: DataHandler;
    handleConnection?: ConnectionHandler;
    verbose?: boolean;
    timeout?: number;
};

type ConnectionOptions = PeerConnectOption & {
    metadata?: ConnectionMetadata;
};

const connPromiseMap = new Map<string, Promise<DataConnection>>();

const dataHandlers: DataHandler[] = [];

export function useGlobalPeer(
    id: string,
    {
        handleData = undefined,
        handleConnection = undefined,
        verbose = false,
        timeout: timeoutDuration = 10000,
    }: GlobalPeerOptions = {}
) {
    const [localPeer, setLocalPeer] = useAtom(localPeerAtom);
    const [connections, setConnections] = useAtom(connectionsAtom);

    if (verbose) {
        console.log(
            ` Active connections\n -`,
            connections.map((c) => c.peer).join("\n - "),
            connections
        );
    }

    useEffect(() => {
        const copiedHandler = handleData;

        if (copiedHandler) dataHandlers.push(copiedHandler);

        return () => {
            if (copiedHandler) {
                dataHandlers.splice(
                    dataHandlers.findIndex((handler) => handler === copiedHandler),
                    1
                );
            }
        };
    }, [handleData]);

    useEffect(() => {
        if (verbose) console.log(`[GlobalPeer] Refresh connection.`);

        const newPeer = new Peer(id);

        // Event handler for when a connection is established
        newPeer.once("open", (id) => {
            if (verbose) console.log(`[GlobalPeer] Your connection opened as ${id}`);
            setLocalPeer(newPeer);
        });

        // Event handler for incoming connections
        newPeer.on("connection", (connection) => {
            if (verbose)
                console.log(`[GlobalPeer] New connection to ${connection.peer}`, connection);

            setConnections((prevConnections) => [...prevConnections, connection]);

            if (handleConnection) handleConnection(connection);

            // Event handler for when data is received
            connection.on("data", (data) => {
                if (verbose)
                    console.log(
                        `[GlobalPeer] Received: \`\n${
                            typeof data === "object" ? JSON.stringify(data, null, 2) : data
                        }\`\nfrom ${connection.peer}`
                    );

                for (const dataHandler of dataHandlers) dataHandler(data, connection);
            });

            connection.on("close", () => {
                if (verbose) console.log(`[GlobalPeer] Connection ${connection.peer} closed.`);

                // Remove the closed connection from the list
                setConnections((prevConnections) =>
                    prevConnections.filter((c) => c !== connection)
                );
            });
        });

        // Cleanup function to disconnect when the component unmounts
        return () => {
            newPeer.disconnect();
        };
    }, [handleConnection, id, setConnections, setLocalPeer, verbose]);

    // Function to send a message
    const sendMessage = (data: unknown, chunked?: boolean) => {
        if (verbose)
            console.log(`[GlobalPeer] Sending message (chunked: ${chunked || false}) ${data}`);

        connections.forEach((connection) => {
            connection.send(data, chunked);
        });
    };

    // Function to establish new connection
    // TODO: move to using full device obj as param scanned from QR code
    const connect = async (peerId: PeerId, options?: ConnectionOptions) => {
        if (verbose) console.log(`[GlobalPeer] Attempting to connect to ${peerId}`);

        if (!localPeer)
            throw new Error(
                "Your connection is not yet open. Please wait until `localPeer` is defined."
            );

        // Ensure connection has not already been established
        const existingConn = connections.find(({ peer }) => peer === peerId);
        if (existingConn) {
            if (verbose) console.warn(`Connection ${peerId} already exist!`);
            return existingConn;
        }

        if (connPromiseMap.get(peerId)) return connPromiseMap.get(peerId);

        const connPromise = new Promise<DataConnection>((resolve, reject) => {
            const newConnection = localPeer.connect(peerId, options);

            const connectionTimeout = setTimeout(() => {
                if (verbose)
                    console.error(
                        "[GlobalPeer] Connection timeout - unable to establish connection within the specified time."
                    );

                reject(
                    "Connection timeout - unable to establish connection within the specified time."
                );
            }, timeoutDuration);

            newConnection.once("open", () => {
                if (verbose)
                    console.log(
                        `[GlobalPeer] Connection to ${peerId} has successfully been established.`
                    );
                clearTimeout(connectionTimeout);
                setConnections((prevConnections) => [...prevConnections, newConnection]);
                resolve(newConnection);
                connPromiseMap.delete(peerId);
            });

            newConnection.once("error", (err) => {
                reject(err);
                connPromiseMap.delete(peerId);
            });
        });

        connPromiseMap.set(peerId, connPromise);

        return connPromise;
    };

    const close = (connection: DataConnection) => {
        const i = connections.findIndex((conn) => conn === connection);
        if (i === -1) throw new Error("Cannot close a nonexisting connection");
        connections[i].close();
        connections.splice(i, 1);
        setConnections([...connections]);
    };

    return { localPeer, connections, sendMessage, connect, close } as const;
}
