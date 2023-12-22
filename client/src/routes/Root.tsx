import { Outlet, useLocation, useNavigate } from "react-router-dom";

import BottomNav from "@components/BottomNav";
import { useGlobalPeer } from "@hooks/useGlobalPeer";

import PrepConnectionLoader from "@components/loaders/PrepConnection";
import { useEffect } from "react";
import { deviceIdToPeerId } from "@shared/utils/convert";
import { useAppSettings } from "@atoms/appsettings";

export default function Root() {
    const navigate = useNavigate();
    const [appSettings] = useAppSettings();
    const location = useLocation();

    // Init connection
    const { localPeer } = useGlobalPeer(deviceIdToPeerId(appSettings.thisDevice.id), {
        verbose: true,
    });

    useEffect(() => {
        if (localPeer && location.pathname === "/") navigate("/home");
    }, [navigate, localPeer, location.pathname]);

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
