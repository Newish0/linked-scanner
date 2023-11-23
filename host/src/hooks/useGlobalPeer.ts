// import { useAppSettings } from "@atoms/appsettings";
import { connectionsAtom, selfPeerAtom } from "@atoms/peer";
import { PeerId } from "../../../client/src/type/general";
import { useAtom } from "jotai";
import { DataConnection, Peer } from "peerjs";
import { useEffect } from "react";

type DataHandler = (data: unknown, connection: DataConnection) => void;

type GlobalPeerOptions = {
    handleData?: DataHandler;
    verbose?: boolean;
};

export function useGlobalPeer({ handleData = undefined, verbose = false }: GlobalPeerOptions = {}) {
    const [selfPeer, setSelfPeer] = useAtom(selfPeerAtom);
    const [connections, setConnections] = useAtom(connectionsAtom);
    // const [appSettings] = useAppSettings();

    useEffect(() => {
        // const newPeer = new Peer(appSettings.thisDevice.id);
        const newPeer = new Peer("7OgY-5MWb-XnYX-osv7");

        // Event handler for when a connection is established
        newPeer.once("open", (id) => {
            if (verbose) console.log(`Your connection opened as ${id}`);
            setSelfPeer(newPeer);
        });

        // Event handler for incoming connections
        newPeer.on("connection", (connection) => {
            if (verbose) console.log(`New connection to ${connection.connectionId}`);

            setConnections((prevConnections) => [...prevConnections, connection]);

            // Event handler for when data is received
            connection.on("data", (data) => {
                if (verbose) console.log(`Received: ${data} from ${connection.connectionId}`);
                if (handleData) handleData(data, connection);
            });

            connection.on("close", () => {
                if (verbose) console.log(`Connection ${connection.connectionId} closed.`);

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
    }, [setConnections, setSelfPeer, verbose]);
    // }, [appSettings.thisDevice.id, setConnections, setSelfPeer, verbose]);

    // Function to send a message
    const sendMessage = (data: unknown, chunked?: boolean) => {
        if (verbose) console.log(`Sending message (chunked: ${chunked || false}) ${data}`);

        connections.forEach((connection) => {
            connection.send(data, chunked);
        });
    };

    // Function to establish new connection
    const connect = (peerId: PeerId) => {
        if (verbose) console.log(`Attempting to connect to ${peerId}`);

        if (!selfPeer)
            throw new Error(
                "Your connection is not yet open. Please wait until `selfPeer` us defined."
            );

        selfPeer.connect(peerId);
    };

    return { selfPeer, connections, sendMessage, connect } as const;
}
