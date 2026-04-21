interface InputLabelProps {
    label?: string;
    labelId?: string;
    labelStyle?: string;
    overrideStyle?: string;
}

const InputLabel = ({ label, labelId, labelStyle, overrideStyle }: InputLabelProps) => {
    return (
        <label
            htmlFor={labelId}
            className={overrideStyle || `show-label mb-1 sm:mb-2 text-input-label font-medium text-color-label ${labelStyle}`}
        >
            {label}
        </label>
    );
};

export default InputLabel;
