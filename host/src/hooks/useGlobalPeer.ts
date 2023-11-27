import { useAppSettings } from "@atoms/appsettings";
import { connectionsAtom, localPeerAtom } from "@atoms/peer";
import { PeerId } from "@shared/type/general";
import { deviceIdToPeerId } from "@shared/utils/convert";
import { useAtom } from "jotai";
import { DataConnection, Peer } from "peerjs";
import { useEffect } from "react";

type DataHandler = (data: unknown, connection: DataConnection) => void;

type GlobalPeerOptions = {
    handleData?: DataHandler;
    verbose?: boolean;
    timeout?: number;
};

export function useGlobalPeer({
    handleData = undefined,
    verbose = false,
    timeout: timeoutDuration = 10000,
}: GlobalPeerOptions = {}) {
    const [localPeer, setLocalPeer] = useAtom(localPeerAtom);
    const [connections, setConnections] = useAtom(connectionsAtom);
    const [appSettings] = useAppSettings();

    if (verbose) {
        console.log(` Active connections`, connections.map((c) => c.peer).join("\n - "));
    }

    useEffect(() => {
        if (verbose) console.log(`[GlobalPeer] Refresh connection.`);

        const newPeer = new Peer(deviceIdToPeerId(appSettings.thisDevice.id));

        // Event handler for when a connection is established
        newPeer.once("open", (id) => {
            if (verbose) console.log(`[GlobalPeer] Your connection opened as ${id}`);
            setLocalPeer(newPeer);
        });

        // Event handler for incoming connections
        newPeer.on("connection", (connection) => {
            if (verbose) console.log(`[GlobalPeer] New connection to ${connection.peer}`);

            setConnections((prevConnections) => [...prevConnections, connection]);

            // Event handler for when data is received
            connection.on("data", (data) => {
                if (verbose) console.log(`[GlobalPeer] Received: ${data} from ${connection.peer}`);
                if (handleData) handleData(data, connection);
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
    }, [appSettings.thisDevice.id, handleData, setConnections, setLocalPeer, verbose]);

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
    const connect = async (peerId: PeerId) => {
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

        return new Promise<DataConnection>((resolve, reject) => {
            const newConnection = localPeer.connect(peerId, { metadata: undefined }); // TODO: add device info as metadata

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
            });

            newConnection.once("error", (err) => {
                reject(err);
            });
        });
    };

    return { localPeer, connections, sendMessage, connect } as const;
}
