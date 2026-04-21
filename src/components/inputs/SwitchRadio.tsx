import { useState, useEffect } from "react";

interface SwitchRadioProps {
    value?: boolean;
    defaultValue?: boolean;
    onChange?: (v: boolean) => void;
}

const SwitchRadio = ({ value, defaultValue = false, onChange }: SwitchRadioProps) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const on = isControlled ? value : internalValue;

    const toggle = () => {
        const next = !on;
        if (!isControlled) setInternalValue(next);
        onChange?.(next);
    };

    useEffect(() => {
        if (!isControlled) setInternalValue(defaultValue);
    }, [defaultValue, isControlled]);

    return (
        <button
            type="button"
            onClick={toggle}
            className={`w-14 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${on ? "bg-blue-500" : "bg-gray-300"}`}
            aria-pressed={on}
        >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${on ? "translate-x-8" : "translate-x-0"}`} />
        </button>
    );
};

export default SwitchRadio;
