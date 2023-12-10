import { DeviceId, DeviceParts } from "@shared/type/device";
import { toDeviceIdParts } from "@shared/utils/device";
import { useRef, useState } from "react";
import { ClassNameValue, twMerge } from "tailwind-merge";

export default function IDInput({
    onComplete,
    deviceId,
    readOnly,
    size,
    className,
}: {
    onComplete?: (id: DeviceId) => void;
    deviceId?: DeviceId;
    readOnly: boolean;
    size: "lg" | "sm";
    className?: ClassNameValue;
}) {
    const [parts, setParts] = useState<DeviceParts>(
        (deviceId && toDeviceIdParts(deviceId)) || ["", "", "", ""]
    );

    const input1Ref = useRef<HTMLInputElement | null>(null);
    const input2Ref = useRef<HTMLInputElement | null>(null);
    const input3Ref = useRef<HTMLInputElement | null>(null);
    const input4Ref = useRef<HTMLInputElement | null>(null);

    const handleInput1Change = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = evt.target;
        setParts((prevParts) => [value, prevParts[1], prevParts[2], prevParts[3]]);
        if (value.length === 4) input2Ref.current?.focus();
    };

    const handleInput2Change = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = evt.target;
        setParts((prevParts) => [prevParts[0], value, prevParts[2], prevParts[3]]);
        if (value.length === 4) input3Ref.current?.focus();
        else if (value.length === 0) input1Ref.current?.focus();
    };

    const handleInput3Change = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = evt.target;
        setParts((prevParts) => [prevParts[0], prevParts[1], value, prevParts[3]]);
        if (value.length === 4) input4Ref.current?.focus();
        else if (value.length === 0) input2Ref.current?.focus();
    };

    const handleInput4Change = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = evt.target;
        setParts((prevParts) => [prevParts[0], prevParts[1], prevParts[2], value]);

        if (value.length === 0) input3Ref.current?.focus();
        else if (onComplete) onComplete(parts.join("-") as DeviceId);
    };

    let sizeClass = "";
    if (size === "sm") {
        sizeClass = "max-h-[35px] text-sm";
    }

    const inputClassName = twMerge(
        "input input-bordered w-full px-0 text-center max-w-[75px]",
        sizeClass
    );

    return (
        <div
            className={twMerge(
                "flex items-center",
                size === "sm" ? "gap-[1px]" : "gap-1",
                className
            )}
        >
            <input
                type="text"
                placeholder="XXXX"
                className={inputClassName}
                maxLength={4}
                ref={input1Ref}
                value={parts[0]}
                onChange={handleInput1Change}
                readOnly={readOnly}
            />

            <span>-</span>

            <input
                type="text"
                placeholder="XXXX"
                className={inputClassName}
                maxLength={4}
                ref={input2Ref}
                value={parts[1]}
                onChange={handleInput2Change}
                readOnly={readOnly}
            />

            <span>-</span>
            <input
                type="text"
                placeholder="XXXX"
                className={inputClassName}
                maxLength={4}
                ref={input3Ref}
                value={parts[2]}
                onChange={handleInput3Change}
                readOnly={readOnly}
            />
            <span>-</span>

            <input
                type="text"
                placeholder="XXXX"
                className={inputClassName}
                maxLength={4}
                ref={input4Ref}
                value={parts[3]}
                onChange={handleInput4Change}
                readOnly={readOnly}
            />
        </div>
    );
}

IDInput.defaultProps = {
    readOnly: false,
    size: "lg",
};
