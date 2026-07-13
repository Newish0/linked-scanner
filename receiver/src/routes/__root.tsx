import { IconDeviceCameraPhone, IconHistory, IconSettings } from "@tabler/icons-solidjs";
import { Outlet, createRootRoute } from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";
import Sidebar, { type SidebarRoute } from "../components/sidebar";

import "../styles.css";

export const Route = createRootRoute({
    component: RootComponent,
});

const appRoutes: SidebarRoute[] = [
    {
        name: "Scanner Devices",
        path: "/scanners",
        icon: <IconDeviceCameraPhone />,
    },
    {
        name: "History",
        path: "/history",
        icon: <IconHistory />,
    },
    {
        name: "Settings",
        path: "/settings",
        icon: <IconSettings />,
    },
];

function RootComponent() {
    return (
        <>
            <Sidebar routes={appRoutes}>
                <Outlet />
            </Sidebar>
            <TanStackRouterDevtools position="bottom-right" />
        </>
    );
}
