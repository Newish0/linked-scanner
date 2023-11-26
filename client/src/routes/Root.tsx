import { Navigate, Outlet } from "react-router-dom";

import BottomNav from "@components/BottomNav";
import { useGlobalPeer } from "@hooks/useGlobalPeer";
import PageContainer from "@components/Page/Container";
import PrepConnectionLoader from "@components/loaders/PrepConnection";

export default function Root() {
    // Init
    const { selfPeer } = useGlobalPeer({ verbose: true });

    if (!selfPeer) {
        return (
            <div className="h-screen flex items-center">
                <PrepConnectionLoader />
            </div>
        );
    }

    return (
        <>
            <div className="w-screen h-screen fixed flex flex-col">
                {/* <button
                    onClick={() => {
                        connect("123");
                    }}
                >
                    TEST
                </button> */}

                <main className="overflow-auto h-full">
                    <Outlet />
                </main>

                <BottomNav />
            </div>
            {/* <Navigate to="/home" /> */}
        </>
    );
}
