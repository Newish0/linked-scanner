import { Link, type RoutePaths } from "@tanstack/solid-router";
import { For, type JSX } from "solid-js";
import type { routeTree } from "../routeTree.gen";

export type DockRoute = {
    name: string;
    path: RoutePaths<typeof routeTree>;
    icon: JSX.Element;
};

export type DockProps = {
    routes: DockRoute[];
};

export default function AppDock(props: DockProps) {
    return (
        <div class="dock">
            <For each={props.routes}>
                {(route) => (
                    <Link
                        to={route.path}
                        activeProps={{
                            class: "dock-active",
                        }}
                        viewTransition={{
                            types: ({ fromLocation, toLocation }) => {
                                const fromIdx = props.routes.findIndex(
                                    (r) => r.path === fromLocation?.pathname,
                                );
                                const toIdx = props.routes.findIndex(
                                    (r) => r.path === toLocation?.pathname,
                                );
                                if (fromIdx === -1 || toIdx === -1) return [];
                                if (fromIdx === toIdx) return [];
                                return fromIdx > toIdx ? ["slide-right"] : ["slide-left"];
                            },
                        }}
                    >
                        <button class="flex flex-col justify-center items-center">
                            {route.icon}
                            <span class="dock-label">{route.name}</span>
                        </button>
                    </Link>
                )}
            </For>
        </div>
    );
}
