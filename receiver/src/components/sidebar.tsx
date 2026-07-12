import { IconHome, IconLayoutSidebarLeftExpand, IconSettings } from "@tabler/icons-solidjs";
import { children, type JSX } from "solid-js";

type SidebarProps = {
    children: JSX.Element;
};

export default function Sidebar(props: SidebarProps) {
    const safeChildren = children(() => props.children);

    return (
        <div class="drawer lg:drawer-open">
            <input id="app-sidebar" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content">
                <nav class="navbar w-full bg-base-300">
                    <label
                        for="app-sidebar"
                        aria-label="open sidebar"
                        class="btn btn-square btn-ghost"
                    >
                        <IconLayoutSidebarLeftExpand />
                    </label>
                    <div class="px-4">Navbar Title</div>
                </nav>
                <div class="p-4">{safeChildren()}</div>
            </div>

            <div class="drawer-side is-drawer-close:overflow-visible">
                <label for="app-sidebar" aria-label="close sidebar" class="drawer-overlay"></label>
                <div class="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                    <ul class="menu w-full grow">
                        <li>
                            <button
                                class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                                data-tip="Homepage"
                            >
                                <IconHome />
                                <span class="is-drawer-close:hidden">Homepage</span>
                            </button>
                        </li>

                        <li>
                            <button
                                class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                                data-tip="Settings"
                            >
                                <IconSettings />
                                <span class="is-drawer-close:hidden">Settings</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
