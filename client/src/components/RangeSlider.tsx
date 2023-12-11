import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface RangeSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: number;
    unit: string;
}

/**
 * A range slider with tooltip.
 * @returns
 */
export function RangeSlider(props: RangeSliderProps) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [value, setValue] = useState<number>(props.value);

    useEffect(() => {
        setValue(props.value);
    }, [props.value]);

    const handleValueChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setValue(evt.target.valueAsNumber);

        if (props.onChange) props.onChange(evt); // Propagate event
    };

    const handleTouchStart = () => {
        setShowTooltip(true);
    };

    const handleTouchEnd = () => {
        setShowTooltip(false);
    };

    return (
        <div
            className={twMerge("tooltip w-full", showTooltip ? "tooltip-open" : "")}
            data-tip={value + props.unit}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <input
                {...props}
                type="range"
                value={value}
                onChange={handleValueChange}
                className={twMerge("range range-xs range-primary", props.className)}
            />
        </div>
    );
}

RangeSlider.defaultProps = {
    unit: "",
};
