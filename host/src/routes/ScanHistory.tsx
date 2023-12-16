import PageContainer from "@components/Page/Container";
import PageSection from "@components/Page/Section";
import PageHeader from "@components/Page/Header";
import Accordion from "@components/Accordation";
import { IconCheck, IconCircleCheck, IconLineDashed } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@db/primary";
import { useGlobalPeer } from "@hooks/useGlobalPeer";
import { deviceIdToPeerId } from "@shared/utils/convert";
import { useAppSettings } from "@atoms/appsettings";
import { DeviceId } from "@shared/type/device";

export default function ScanHistory() {
    const [appSettings] = useAppSettings();
    const { connections } = useGlobalPeer(deviceIdToPeerId(appSettings.thisDevice.id));

    return (
        <>
            <PageContainer>
                <PageHeader title="Scan History"></PageHeader>

                {connections.map((conn) => (
                    <PageSection>
                        <DeviceHisAccord
                            deviceId={conn.metadata?.client.id}
                            deviceName={conn.metadata?.client.name}
                        />
                    </PageSection>
                ))}
            </PageContainer>
        </>
    );
}

function DeviceHisAccord({ deviceName, deviceId }: { deviceName: string; deviceId: DeviceId }) {
    const scanHistories = useLiveQuery(
        async () => await db.scanHistories.where({ deviceId }).sortBy("createdAt"),
        []
    );

    return (
        <Accordion title={deviceName} name={"devices"}>
            <ul className="timeline timeline-vertical">
                {scanHistories ? (
                    scanHistories.map((his) => (
                        <li key={his.id}>
                            <div className="timeline-start">{his.createdAt.toLocaleString()}</div>
                            <div className="timeline-middle">
                                <IconLineDashed />
                            </div>
                            <div className="timeline-end timeline-box">{his.scanContent}</div>
                            <hr />
                        </li>
                    ))
                ) : (
                    <div>No history</div>
                )}
            </ul>
        </Accordion>
    );
}
