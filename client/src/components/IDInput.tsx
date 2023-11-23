import { DeviceId, DeviceParts } from "@shared/type/device";
import { toDeviceIdParts } from "@utils/device";
import { useRef, useState } from "react";

export default function IDInput({
    onComplete,
    deviceId,
    disabled,
}: {
    onComplete?: (id: DeviceId) => void;
    deviceId?: DeviceId;
    disabled: boolean;
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

    return (
        <div className="flex items-center gap-1">
            <input
                type="text"
                placeholder="XXXX"
                className="input input-bordered max-w-[75px] text-center"
                maxLength={4}
                ref={input1Ref}
                value={parts[0]}
                onChange={handleInput1Change}
                disabled={disabled}
            />

            <span>-</span>

            <input
                type="text"
                placeholder="XXXX"
                className="input input-bordered max-w-[75px] text-center"
                maxLength={4}
                ref={input2Ref}
                value={parts[1]}
                onChange={handleInput2Change}
                disabled={disabled}
            />

            <span>-</span>
            <input
                type="text"
                placeholder="XXXX"
                className="input input-bordered max-w-[75px] text-center"
                maxLength={4}
                ref={input3Ref}
                value={parts[2]}
                onChange={handleInput3Change}
                disabled={disabled}
            />
            <span>-</span>

            <input
                type="text"
                placeholder="XXXX"
                className="input input-bordered max-w-[75px] text-center"
                maxLength={4}
                ref={input4Ref}
                value={parts[3]}
                onChange={handleInput4Change}
                disabled={disabled}
            />
        </div>
    );
}

IDInput.defaultProps = {
    disabled: false,
};
