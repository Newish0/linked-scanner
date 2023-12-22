import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useGlobalPeer } from "@hooks/useGlobalPeer";
import PrepConnectionLoader from "@components/loaders/PrepConnection";
import { useEffect } from "react";
import { IconHistory, IconHome, IconSettings } from "@tabler/icons-react";
import { twMerge } from "tailwind-merge";
import { debounce } from "lodash";
import { invoke } from "@tauri-apps/api/tauri";
import { useAppSettings } from "@atoms/appsettings";
import { deviceIdToPeerId } from "@shared/utils/convert";
import { DataConnection } from "peerjs";
import { db } from "@db/primary";
import { HistoryType } from "@db/schemas/ScanHistory";

export default function Root() {
    const navigate = useNavigate();
    const location = useLocation();
    const [appSettings] = useAppSettings();

    // Init connection
    const { localPeer } = useGlobalPeer(deviceIdToPeerId(appSettings.thisDevice.id), {
        verbose: true,
        handleData: debounce((data: unknown, connection: DataConnection) => {
            console.log("DATA HANDLED", data);

            const keySequence = (data as { payload?: string })?.payload;
            invoke("fire_key_sequence", { keySequence });

            db.scanHistories.add({
                deviceId: connection.metadata.client.id,
                content: keySequence,
                createdAt: new Date(),
                type: HistoryType.Scan,
            });
        }, 300),
        handleConnection(connection: DataConnection) {
            db.scanHistories.add({
                deviceId: connection.metadata.client.id,
                content: null,
                createdAt: new Date(),
                type: HistoryType.Connect,
            });
        },

        handleDisconnection(connection: DataConnection) {
            db.scanHistories.add({
                deviceId: connection.metadata.client.id,
                content: null,
                createdAt: new Date(),
                type: HistoryType.Disconnect,
            });
        },
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
            <div className="w-screen h-screen fixed flex flex-row">
                <SideNav />

                <main className="overflow-auto w-full h-full">
                    <Outlet />
                </main>
            </div>
        </>
    );
}

function SideNav() {
    return (
        <ul className="menu bg-base-200 w-min sm:w-64 rounded-e-box h-full">
            <li className="my-2 text-center sm:text-lg font-medium">Linked Scanner</li>

            <li>
                <NavLink
                    className={({ isActive, isPending }) =>
                        twMerge(isActive ? "active" : isPending ? "pending" : "")
                    }
                    to="/home"
                >
                    <IconHome></IconHome>
                    <span className="hidden sm:block">Home</span>
                </NavLink>
            </li>
            <li>
                <NavLink
                    className={({ isActive, isPending }) =>
                        twMerge(isActive ? "active" : isPending ? "pending" : "")
                    }
                    to="/history"
                >
                    <IconHistory></IconHistory>
                    <span className="hidden sm:block">Scan History</span>
                </NavLink>
            </li>
            <li>
                <NavLink
                    className={({ isActive, isPending }) =>
                        twMerge(isActive ? "active" : isPending ? "pending" : "")
                    }
                    to="/settings"
                >
                    <IconSettings></IconSettings>
                    <span className="hidden sm:block">Setting</span>
                </NavLink>
            </li>
        </ul>
    );
}
