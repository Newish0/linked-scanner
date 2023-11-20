import React from "react";
import { twMerge } from "tailwind-merge";

export default function PageSection(
    props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) {
    return (
        <div
            {...props}
            className={twMerge("rounded-box p-4 m-2 bg-base-200", props.className ?? "")}
        ></div>
    );
}
