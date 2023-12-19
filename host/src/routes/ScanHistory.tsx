import PageContainer from "@components/Page/Container";
import PageSection from "@components/Page/Section";
import PageHeader from "@components/Page/Header";
import Accordion from "@components/Accordation";
import { IconPlugConnected, IconPlugConnectedX, IconScan } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@db/primary";
import { useGlobalPeer } from "@hooks/useGlobalPeer";
import { deviceIdToPeerId } from "@shared/utils/convert";
import { useAppSettings } from "@atoms/appsettings";
import { DeviceId } from "@shared/type/device";
import { HistoryType } from "@db/schemas/ScanHistory";

export default function ScanHistory() {
    const [appSettings] = useAppSettings();
    const { connections } = useGlobalPeer(deviceIdToPeerId(appSettings.thisDevice.id));

    return (
        <>
            <PageContainer>
                <PageHeader title="Scan History"></PageHeader>

                {connections.length ? (
                    connections.map((conn) => (
                        <PageSection key={conn.metadata?.client.id}>
                            <DeviceHisAccord
                                deviceId={conn.metadata?.client.id}
                                deviceName={conn.metadata?.client.name}
                            />
                        </PageSection>
                    ))
                ) : (
                    <PageSection>You have no scan history.</PageSection>
                )}
            </PageContainer>
        </>
    );
}

function HistoryIcon({ type }: { type: HistoryType }) {
    switch (type) {
        case HistoryType.Connect:
            return <IconPlugConnected />;
        case HistoryType.Disconnect:
            return <IconPlugConnectedX />;
        case HistoryType.Scan:
            return <IconScan />;
    }
}

function DeviceHisAccord({ deviceName, deviceId }: { deviceName: string; deviceId: DeviceId }) {
    const scanHistories = useLiveQuery(
        async () => await db.scanHistories.where({ deviceId }).sortBy("createdAt"),
        []
    );

    return (
        <Accordion
            displayTitle={
                <span>
                    {deviceName}
                    {scanHistories && (
                        <div className="badge badge-primary mx-3">{scanHistories.length}</div>
                    )}
                </span>
            }
            name={"devices"}
        >
            <ul className="timeline timeline-vertical float-left">
                {scanHistories ? (
                    scanHistories.map((his) => {
                        let autoGenContent = "";
                        if (his.type === HistoryType.Connect)
                            autoGenContent = "Connection established";
                        else if (his.type === HistoryType.Disconnect)
                            autoGenContent = "Connection lost";

                        return (
                            <li key={his.id}>
                                <div className="timeline-start text-sm font-thin">
                                    {his.createdAt.toLocaleString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    })}
                                </div>
                                <div className="timeline-middle">
                                    <HistoryIcon type={his.type} />
                                </div>
                                <div className="timeline-end timeline-box">
                                    {his.content ?? autoGenContent}
                                </div>
                                <hr />
                            </li>
                        );
                    })
                ) : (
                    <div>No history</div>
                )}
            </ul>
        </Accordion>
    );
}
