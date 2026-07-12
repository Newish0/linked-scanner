import { Outlet, createRootRoute } from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";
import AppDock, { type DockRoute } from "@/components/app-dock";
import { IconHistory, IconScan, IconSettings } from "@tabler/icons-solidjs";
import { Toaster } from "solid-sonner";

import "../styles.css";

export const Route = createRootRoute({
    component: RootComponent,
});

const appRoutes: DockRoute[] = [
    {
        name: "Scan",
        path: "/scan",
        icon: <IconScan />,
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
            <main class="h-[calc(100vh-64px)] overflow-auto">
                <Outlet />
            </main>

            <Toaster position="top-center" />

            <AppDock routes={appRoutes} />

            <TanStackRouterDevtools position="bottom-right" />
        </>
    );
}
