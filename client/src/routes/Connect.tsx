import PageContainer from "@components/Page/Container";
import PageSection from "@components/Page/Section";
import { useGlobalPeer } from "@hooks/useGlobalPeer";
import { DeviceId } from "@shared/type/device";
import { deviceIdToPeerId } from "@utils/convert";
import { isDeviceId } from "@utils/device";
import { useEffect } from "react";
import { useParams } from "react-router";

export default function Connect() {
    const { deviceId } = useParams();
    const { connect, connections } = useGlobalPeer({ verbose: true });

    useEffect(() => {
        if (deviceId && isDeviceId(deviceId)) connect(deviceIdToPeerId(deviceId as DeviceId));
    }, [connect, deviceId]);

    const newConnection = connections.find(
        (conn) => conn.connectionId === deviceIdToPeerId(deviceId as DeviceId)
    );

    return (
        <PageContainer>
            {!deviceId && <PageSection>No device id provided.</PageSection>}
            <PageSection>Connected to {newConnection?.connectionId}</PageSection>
        </PageContainer>
    );
}
