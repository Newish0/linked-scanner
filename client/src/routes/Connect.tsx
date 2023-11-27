import Alert from "@components/Alert";
import PageContainer from "@components/Page/Container";
import PageSection from "@components/Page/Section";
import { useGlobalPeer } from "@hooks/useGlobalPeer";
import { DeviceId } from "@shared/type/device";
import { deviceIdToPeerId } from "@shared/utils/convert";
import { isDeviceId } from "@shared/utils/device";
import { DataConnection } from "peerjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function Connect() {
    const { deviceId } = useParams();
    const { connect, localPeer } = useGlobalPeer({ verbose: true });

    const [hasDeviceIdErr, setHasDeviceIdErr] = useState(false);
    const [connErr, setConnErr] = useState<string>();
    const [newConnection, setNewConnection] = useState<DataConnection>();

    useEffect(() => {
        if (!localPeer) return;

        if (deviceId && isDeviceId(deviceId)) {
            connect(deviceIdToPeerId(deviceId as DeviceId))
                .then((newConnection) => newConnection && setNewConnection(newConnection))
                .catch(() => setConnErr(`Failed to connection to host.`));
        } else {
            setHasDeviceIdErr(true);
        }
    }, [connect, deviceId, localPeer]);

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

    return (
        <PageContainer>
            <PageSection>
                <div>Connected to {newConnection.metadata.name}</div>
                <div>
                    DeviceID: <code>{newConnection.metadata.id}</code>
                </div>
            </PageSection>
        </PageContainer>
    );
}
