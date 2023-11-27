import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useGlobalPeer } from "@hooks/useGlobalPeer";

import PrepConnectionLoader from "@components/loaders/PrepConnection";
import { useEffect } from "react";
import { IconHistory, IconHome, IconSettings } from "@tabler/icons-react";
import { twMerge } from "tailwind-merge";

export default function Root() {
    const navigate = useNavigate();

    // Init connection
    const { localPeer } = useGlobalPeer({ verbose: true });

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
            <div className="w-screen h-screen fixed flex flex-row">
                <SideNav />

                <main className="overflow-auto h-full">
                    <Outlet />
                </main>
            </div>
        </>
    );
}

function SideNav() {
    return (
        <ul className="menu bg-base-200 w-min sm:w-40 rounded-e-box h-full">
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
                <a>
                    <IconHistory></IconHistory>
                    <span className="hidden sm:block">Scan History</span>
                </a>
            </li>
            <li>
                <a>
                    <IconSettings></IconSettings>
                    <span className="hidden sm:block">Setting</span>
                </a>
            </li>
        </ul>
    );
}
