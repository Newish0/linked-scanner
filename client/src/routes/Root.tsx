import { Outlet, useNavigate } from "react-router-dom";

import BottomNav from "@components/BottomNav";
import { useGlobalPeer } from "@hooks/useGlobalPeer";

import PrepConnectionLoader from "@components/loaders/PrepConnection";
import { useEffect } from "react";

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
            <div className="w-screen h-screen fixed flex flex-col">
                <main className="overflow-auto h-full">
                    <Outlet />
                </main>

                <BottomNav />
            </div>
        </>
    );
}
