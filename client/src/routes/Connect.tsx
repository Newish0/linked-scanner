import Alert from "@components/Alert";
import PageContainer from "@components/Page/Container";
import PageSection from "@components/Page/Section";
import PrepConnectionLoader from "@components/loaders/PrepConnection";
import { useGlobalPeer } from "@hooks/useGlobalPeer";
import { DeviceId } from "@shared/type/device";
import { deviceIdToPeerId } from "@utils/convert";
import { isDeviceId } from "@utils/device";
import { DataConnection } from "peerjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function Connect() {
    const { deviceId } = useParams();
    const { connect, selfPeer } = useGlobalPeer({ verbose: true });

    const [hasDeviceIdErr, setHasDeviceIdErr] = useState(false);
    const [newConnection, setNewConnection] = useState<DataConnection>();

    useEffect(() => {
        if (!selfPeer) return;

        if (deviceId && isDeviceId(deviceId)) {
            connect(deviceIdToPeerId(deviceId as DeviceId)).then(
                (newConnection) => newConnection && setNewConnection(newConnection)
            );
        } else {
            setHasDeviceIdErr(true);
        }
    }, [connect, deviceId, selfPeer]);

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

    return (
        <PageContainer>
            {!deviceId && <PageSection>No device id provided.</PageSection>}
            <PageSection>Connected to {newConnection?.peer}</PageSection>
        </PageContainer>
    );
}
