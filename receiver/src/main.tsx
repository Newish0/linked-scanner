import { render } from "solid-js/web";
import { RouterProvider, createRouter } from "@tanstack/solid-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
});

declare module "@tanstack/solid-router" {
    interface Register {
        router: typeof router;
    }
}

if (localStorage.getItem("deviceId") === null)
    localStorage.setItem("deviceId", crypto.randomUUID());

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
    render(() => <RouterProvider router={router} />, rootElement);
}
