import { LinkedDevice } from "@shared/type/device";
import { twMerge } from "tailwind-merge";

interface DeviceCardProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    savedDevice: LinkedDevice;
}

export default function DeviceCard({ savedDevice, ...props }: DeviceCardProps) {
    return (
        <div
            {...props}
            className={twMerge("bg-base-200 flex justify-between", props.className ?? "")}
        >
            <div>
                <div className="text-xl font-medium">{savedDevice.name}</div>
                <div className="text-base font-normal">{savedDevice.id}</div>
            </div>

            <div>
                <button className="btn btn-primary">Connect</button>
            </div>
        </div>
    );
}
