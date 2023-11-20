import { Navigate, Outlet } from "react-router-dom";

import BottomNav from "@components/BottomNav";
import { useGlobalPeer } from "@hooks/peer";

export default function Root() {
    // const { connect } = useGlobalPeer(() => {}, true);

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
