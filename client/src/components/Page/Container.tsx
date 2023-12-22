import { twMerge } from "tailwind-merge";

export default function PageContainer({
    children,
    align,
}: React.PropsWithChildren & { align: "top" | "center" | "bottom" }) {
    return (
        <>
            <div
                className={twMerge(
                    "flex flex-col h-full",
                    align === "top" ? "justify-start" : "",
                    align === "center" ? "justify-center" : "",
                    align === "bottom" ? "justify-end" : ""
                )}
            >
                {children}
            </div>
        </>
    );
}

PageContainer.defaultProps = {
    align: "top",
};
