import { render } from "solid-js/web";
import { RouterProvider, createRouter } from "@tanstack/solid-router";
import { routeTree } from "./routeTree.gen";
import { onData } from "core/stores/peer-connection";
import { invoke } from "@tauri-apps/api/core";

const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    defaultViewTransition: true,
});

declare module "@tanstack/solid-router" {
    interface Register {
        router: typeof router;
    }
}

onData((_conn, data) => {
    if (data.type === "scan") {
        invoke("fire_key_sequence", { keySequence: data.content });
    }
});

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
    render(() => <RouterProvider router={router} />, rootElement);
}
