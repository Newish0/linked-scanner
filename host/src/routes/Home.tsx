import { useAppSettings } from "@atoms/appsettings";
import PageContainer from "@components/Page/Container";
import PageSection from "@components/Page/Section";
import PageHeader from "@components/Page/Header";
import { IconPlus } from "@tabler/icons-react";
import NewConnectionModal from "@components/modals/NewConnectionModal";
import { useEffect, useState } from "react";
import { useGlobalPeer } from "@hooks/useGlobalPeer";
import { deviceIdToPeerId } from "@shared/utils/convert";

export default function Home() {
    const [appSettings] = useAppSettings();

    const { connections } = useGlobalPeer(deviceIdToPeerId(appSettings.thisDevice.id));

    const [showNewConnModal, setShowNewConnModal] = useState(false);

    const handleNewDevice = () => {
        setShowNewConnModal(true);
    };

    useEffect(() => {
        setShowNewConnModal(false);
    }, [connections]);

    return (
        <>
            <PageContainer>
                <PageHeader
                    title="Home"
                    rightAction={
                        <button className="btn btn-primary btn-sm" onClick={handleNewDevice}>
                            <IconPlus></IconPlus> New Device
                        </button>
                    }
                ></PageHeader>

                <PageSection>
                    <YourDevices />
                </PageSection>
            </PageContainer>

            <NewConnectionModal
                isOpen={showNewConnModal}
                onClose={() => setShowNewConnModal(false)}
            ></NewConnectionModal>
        </>
    );
}

function YourDevices() {
    const [appSettings] = useAppSettings();

    const { connections } = useGlobalPeer(deviceIdToPeerId(appSettings.thisDevice.id));

    return (
        <>
            <div className="flex justify-between">
                <h2 className="font-medium text-lg">Linked devices</h2>
            </div>
            <div>
                {connections.length ? (
                    <div>
                        {connections.map((conn) => (
                            <div key={conn.metadata?.host?.id}>
                                <div className="font-medium">{conn.metadata?.client?.name}</div>
                                <div className="text-sm">
                                    <code>{conn.metadata?.client?.id}</code>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        You have no linked devices. <a className="link link-primary">Add one now</a>
                        .
                    </div>
                )}
                {/* {appSettings.linkedDevices.length ? (
                    <div>
                        {appSettings.linkedDevices.map((device) => (
                            <div key={device.id}>{device.id}</div>
                        ))}
                    </div>
                ) : (
                    <div>
                        You have no linked devices. <a className="link link-primary">Add one now</a>
                        .
                    </div>
                )} */}
            </div>
        </>
    );
}
