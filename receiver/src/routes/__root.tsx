import { Outlet, createRootRoute } from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";

import "../styles.css";
import Sidebar from "../components/sidebar";

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    return (
        <>
            <Sidebar>
                <Outlet />
            </Sidebar>
            <TanStackRouterDevtools position="bottom-right" />
        </>
    );
}
