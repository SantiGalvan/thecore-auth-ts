import { ChangeEventHandler } from "react";

interface InputProps {
    inputType?: string;
    inputId?: string;
    inputPlaceholder?: string;
    inputRequired?: boolean;
    inputValue: string;
    inputChange?: ChangeEventHandler<HTMLInputElement>;
    inputName?: string;
    autoFocus?: boolean;
    inputStyle?: string;
    overrideStyle?: string;
    disabled?: boolean;
}

const Input = ({
    inputType, inputId, inputPlaceholder, inputRequired, inputValue,
    inputChange, inputName, autoFocus, inputStyle, overrideStyle, disabled
}: InputProps) => {
    const validTypes = ['text', 'email', 'password', 'search', 'tel', 'url'];
    const type = validTypes.includes(inputType ?? '') ? inputType : 'text';

    return (
        <input
            type={type}
            autoFocus={autoFocus}
            id={inputId}
            className={overrideStyle || `bg-input-bg border border-input-border text-input-text text-input-placeholder input-rounded focus:ring focus:ring-primary focus:border-primary focus:outline-none focus:shadow-(--shadow-primary-input) block w-full p-input ${inputStyle}`}
            placeholder={inputPlaceholder}
            required={inputRequired ?? true}
            value={inputValue}
            onChange={inputChange}
            disabled={disabled}
            name={inputName}
        />
    );
};

export default Input;
