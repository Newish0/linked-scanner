import AppDock, { type DockRoute } from "@/components/app-dock";
import { IconHistory, IconScan, IconSettings } from "@tabler/icons-solidjs";
import { Outlet, createRootRoute, useNavigate } from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";
import { Toaster } from "solid-sonner";

import { doneOnboarding } from "@/stores/onboarding";
import { createEffect, on, untrack } from "solid-js";
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
    const navigate = useNavigate();

    const onboardingRedirect = (done: boolean) => {
        if (!done) {
            untrack(() => navigate({ to: "/" }));
        }
    };

    createEffect(on(doneOnboarding, onboardingRedirect));

    return (
        <>
            <Toaster position="top-center" />

            <main class="h-[calc(100vh-64px)] overflow-auto">
                <Outlet />
            </main>

            <AppDock routes={appRoutes} />

            <TanStackRouterDevtools position="bottom-right" />
        </>
    );
}
