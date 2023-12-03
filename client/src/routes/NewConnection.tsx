import { useAppSettings } from "@atoms/appsettings";
import Alert from "@components/Alert";
import PageContainer from "@components/Page/Container";
import PageSection from "@components/Page/Section";
import { useGlobalPeer } from "@hooks/useGlobalPeer";
import { DeviceId, LinkedDevice } from "@shared/type/device";
import { ConnectionMetadata } from "@shared/type/peer";
import { deviceIdToPeerId } from "@shared/utils/convert";
import { isDeviceId } from "@shared/utils/device";
import { DataConnection } from "peerjs";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function NewConnection() {
    const [appSettings, setAppSettings] = useAppSettings();
    const [searchParams] = useSearchParams();
    const { connect, localPeer } = useGlobalPeer({ verbose: true });

    const [hasDeviceIdErr, setHasDeviceIdErr] = useState(false);
    const [connErr, setConnErr] = useState<string>();
    const [newConnection, setNewConnection] = useState<DataConnection>();

    const deviceId = searchParams.get("deviceId");
    const name = searchParams.get("name");
    // const token = searchParams.get("token");

    useEffect(() => {
        if (!localPeer) return;

        if (deviceId && isDeviceId(deviceId)) {
            const existingDevice = appSettings.linkedDevices.find(
                (device) => device.id === deviceId
            );

            if (existingDevice) {
                console.error("DEVICE ALREADY EXIST. \n TODO: Handle existing device.");
                return;
            }

            const metadata: ConnectionMetadata = {
                host: {
                    id: deviceId as DeviceId,
                    name: name ?? "n/a",
                    createdAt: new Date(),
                },
                client: appSettings.thisDevice,
                openedAt: new Date(),
            };

            connect(deviceIdToPeerId(deviceId as DeviceId), {
                metadata,
            })
                .then((newConnection) => {
                    if (newConnection) {
                        setNewConnection(newConnection);

                        const newLinkedDevice: LinkedDevice = {
                            createdAt: new Date(),
                            id: deviceId as DeviceId,
                            lastConnected: new Date(),
                            name: name ?? "n/a",
                            numConnected: 1,
                        };

                        setAppSettings({
                            ...appSettings,
                            linkedDevices: [...appSettings.linkedDevices, newLinkedDevice],
                        });
                    } // if
                })
                .catch(() => setConnErr(`Failed to connection to host.`));
        } else {
            setHasDeviceIdErr(true);
        }
    }, [appSettings, appSettings.thisDevice, connect, deviceId, localPeer, name, setAppSettings]);

    if (hasDeviceIdErr) {
        return (
            <PageContainer>
                <PageSection>
                    <Alert btnText={"Back"} type="warning">
                        Device id <code>{deviceId}</code> is invalid.
                    </Alert>
                </PageSection>
            </PageContainer>
        );
    }

    if (connErr) {
        return (
            <PageContainer>
                <PageSection>
                    <Alert btnText={"Back"} type="error">
                        {connErr}
                    </Alert>
                </PageSection>
            </PageContainer>
        );
    }

    if (!newConnection) {
        return (
            <PageContainer>
                <PageSection>
                    <div className="flex gap-4">
                        <span className="loading loading-ring loading-lg"></span>
                        <span>
                            Establishing connection to <code className="">{deviceId}</code>
                        </span>
                    </div>
                </PageSection>
            </PageContainer>
        );
    }

    const metadata = newConnection.metadata as ConnectionMetadata;

    return (
        <PageContainer>
            <PageSection>
                <div>Connected to {metadata.host.name}</div>
                <div>
                    DeviceID: <code>{metadata.host.id}</code>
                </div>
            </PageSection>
        </PageContainer>
    );
}
