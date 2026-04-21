import { ReactNode, ChangeEventHandler } from "react";
import InputDate from "./InputDate";

interface InputStartEndDateProps {
    startId?: string;
    endId?: string;
    startName?: string;
    endName?: string;
    startValue?: string;
    endValue?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    disabled?: boolean;
    required?: boolean;
    dateError?: string;
    startTitle?: string;
    endTitle?: string;
    startStyle?: string;
    endStyle?: string;
    labelStyle?: string;
    containerStyle?: string;
    startContainerStyle?: string;
    endContainerStyle?: string;
    endDateShow?: boolean;
    children?: ReactNode;
}

const InputStartEndDate = ({
    startId, endId, startName, endName, startValue, endValue, onChange,
    disabled, required, dateError, startTitle, endTitle, startStyle, endStyle,
    labelStyle, containerStyle, startContainerStyle, endContainerStyle,
    endDateShow = true, children
}: InputStartEndDateProps) => {
    return (
        <div className={containerStyle || `flex gap-4 mx-auto w-full mb-4`}>
            <InputDate
                id={startId} name={startName} value={startValue} onChange={onChange}
                disabled={disabled} required={required} title={startTitle}
                labelStyle={labelStyle} containerStyle={startContainerStyle} inputStyle={startStyle}
            />
            {endDateShow &&
                <InputDate
                    id={endId} name={endName} value={endValue} onChange={onChange}
                    disabled={disabled} required={required} title={endTitle}
                    labelStyle={labelStyle} containerStyle={endContainerStyle} inputStyle={endStyle}
                >
                    {dateError && <p className="text-red-500 text-[13px] mt-1">{dateError}</p>}
                </InputDate>
            }
            {children}
        </div>
    );
};

export default InputStartEndDate;
