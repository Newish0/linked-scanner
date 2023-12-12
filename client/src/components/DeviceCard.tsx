import { LinkedDevice } from "@shared/type/device";
import { twMerge } from "tailwind-merge";
import { ConnectionMetadata } from "@shared/type/peer";
import { useAppSettings } from "@atoms/appsettings";
import { useGlobalPeer } from "@hooks/useGlobalPeer";
import { deviceIdToPeerId } from "@shared/utils/convert";
import { useEffect, useState } from "react";

interface DeviceCardProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    savedDevice: LinkedDevice;
}

export default function DeviceCard({ savedDevice, ...props }: DeviceCardProps) {
    const [appSettings] = useAppSettings();
    const { connect, close, connections } = useGlobalPeer(
        deviceIdToPeerId(appSettings.thisDevice.id),
        { verbose: true }
    );

    const [connecting, setConnecting] = useState(false);
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        if (connections.find(({ metadata }) => metadata.host.id === savedDevice.id)) {
            setConnected(true);
        } else {
            setConnected(false);
        }
    }, [connections, savedDevice.id]);

    const handleConnect = () => {
        const metadata: ConnectionMetadata = {
            host: savedDevice,
            client: appSettings.thisDevice,
            openedAt: new Date(),
        };
        setConnecting(true);
        connect(deviceIdToPeerId(savedDevice.id), {
            metadata,
        })
            .then(() => {})
            .catch(() => {
                // TODO
            })
            .finally(() => setConnecting(false));
    };

    const handleDisconnect = () => {
        try {
            const connection = connections.find(
                ({ metadata }) => metadata.host.id === savedDevice.id
            );

            if (connection) {
                close(connection);
            }
        } catch (error) {
            console.error(error);
            // TODO
        }
    };

    return (
        <div
            {...props}
            className={twMerge("bg-base-200 flex justify-between", props.className ?? "")}
        >
            <div>
                <div className="font-medium">{savedDevice.name}</div>
                <code className="text-sm font-normal text-neutral-content">{savedDevice.id}</code>
            </div>

            <div className="flex items-center">
                {connected ? (
                    <span className="relative inline-flex">
                        <button
                            className="btn btn-outline btn-error btn-md"
                            onClick={handleDisconnect}
                        >
                            Disconnected
                        </button>
                        <span className="flex absolute h-4 w-4 top-0 right-0 -mt-1 -mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-success"></span>
                        </span>
                    </span>
                ) : (
                    <button
                        className="btn btn-primary btn-md"
                        onClick={handleConnect}
                        disabled={connecting}
                    >
                        {connecting && <span className="loading loading-spinner"></span>}
                        {connecting ? "Connecting" : "Connect"}
                    </button>
                )}
            </div>
        </div>
    );
}
