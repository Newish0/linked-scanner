import { Link, type RoutePaths } from "@tanstack/solid-router";
import { children, For, type JSX } from "solid-js";
import type { routeTree } from "../routeTree.gen";

export type SidebarRoute = {
    name: string;
    path: RoutePaths<typeof routeTree>;
    icon: JSX.Element;
};

type SidebarProps = {
    routes: SidebarRoute[];
    children: JSX.Element;
};

export default function Sidebar(props: SidebarProps) {
    const safeChildren = children(() => props.children);

    return (
        <div class="drawer h-screen bg-base-200">
            <div class="drawer-content pt-2 pb-2 pr-2">
                <div class="rounded-box h-full bg-base-100 overflow-auto">{safeChildren()}</div>
            </div>

            <ul class="menu menu-sm w-full grow">
                <For each={props.routes}>
                    {(route) => (
                        <li>
                            <Link
                                to={route.path}
                                class="tooltip tooltip-right aspect-square flex justify-center items-center"
                                data-tip={route.name}
                                activeProps={{
                                    class: "menu-active",
                                }}
                            >
                                {route.icon}
                            </Link>
                        </li>
                    )}
                </For>
            </ul>
        </div>
    );
}
