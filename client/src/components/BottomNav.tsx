import { IconHome, IconScan, IconSettings } from "@tabler/icons-react";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export default function BottomNav() {
    return (
        <nav className="btm-nav relative">
            <NavLink
                className={({ isActive, isPending }) =>
                    twMerge(isActive ? "active" : isPending ? "pending" : "")
                }
                to="/home"
            >
                <IconHome />
            </NavLink>

            <NavLink
                className={({ isActive, isPending }) =>
                    twMerge(isActive ? "active" : isPending ? "pending" : "")
                }
                to="/scan"
            >
                <IconScan />
            </NavLink>

            <NavLink
                className={({ isActive, isPending }) =>
                    twMerge(isActive ? "active" : isPending ? "pending" : "")
                }
                to="/settings"
            >
                <IconSettings />
            </NavLink>
        </nav>
    );
}
