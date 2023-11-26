import {
    IconAlertCircle,
    IconAlertHexagon,
    IconAlertTriangle,
    IconCircleCheck,
    IconInfoCircle,
} from "@tabler/icons-react";
import { twMerge } from "tailwind-merge";

const icons: Record<string, React.ReactElement> = {
    error: <IconAlertHexagon />,
    info: <IconAlertCircle />,
    success: <IconCircleCheck />,
    warning: <IconAlertTriangle />,
    default: <IconInfoCircle />,
};

interface AlertProps extends React.PropsWithChildren {
    type?: "error" | "info" | "success" | "warning";
    btnText: string | null;
    onBtnClick?: (evt: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Alert({ type, children, btnText, onBtnClick }: AlertProps) {
    return (
        <div
            role="alert"
            className={twMerge(
                "alert",
                type === "success" ? "alert-success" : "",
                type === "info" ? "alert-info" : "",
                type === "error" ? "alert-error" : "",
                type === "warning" ? "alert-warning" : ""
            )}
        >
            {(type && icons[type]) || icons.default}

            <span>{children}</span>

            {btnText ? (
                <div>
                    <button className="btn btn-sm btn-neutral" onClick={onBtnClick}>
                        {btnText}
                    </button>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
