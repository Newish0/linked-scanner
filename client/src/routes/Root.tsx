import { Outlet, useNavigate } from "react-router-dom";

import BottomNav from "@components/BottomNav";
import { useGlobalPeer } from "@hooks/useGlobalPeer";

import PrepConnectionLoader from "@components/loaders/PrepConnection";
import { useEffect } from "react";
import { deviceIdToPeerId } from "@shared/utils/convert";
import { useAppSettings } from "@atoms/appsettings";

export default function Root() {
    const navigate = useNavigate();
    const [appSettings] = useAppSettings();

    // Init connection
    const { localPeer } = useGlobalPeer(deviceIdToPeerId(appSettings.thisDevice.id), {
        verbose: true,
        handleConnection: () => {
            alert();
        },
    });

    useEffect(() => {
        if (localPeer) navigate("/home");
    }, [navigate, localPeer]);

    if (!localPeer) {
        return (
            <div className="h-screen flex items-center">
                <PrepConnectionLoader />
            </div>
        );
    }

    return (
        <>
            <div className="w-screen h-[100dvh] fixed flex flex-col">
                <main className="overflow-auto h-full">
                    <Outlet />
                </main>

                <BottomNav />
            </div>
        </>
    );
}
