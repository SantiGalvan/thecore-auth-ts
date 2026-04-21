import { RxCross2 } from "react-icons/rx";
import { useAlert, AlertType } from "../../contexts/alert/AlertContext";
import { useEffect, useState } from "react";
import { useConfig } from "../../contexts/config/ConfigContext";

const Alert = () => {
    const { messageAlert, typeAlert, alertConfig, getIcon, closeAlert } = useAlert();
    const { alertTimeout } = useConfig();
    const [progress, setProgress] = useState(0);

    if (!typeAlert) return null;

    const { bgColor, textColor, buttonBg, hoverBg, focusRing, progressColor } = alertConfig[typeAlert as AlertType];

    useEffect(() => {
        const duration = alertTimeout / 100;
        const step = 100 / duration;
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) { clearInterval(interval); return 100; }
                return prev + step;
            });
        }, 100);
        const timeOut = setTimeout(() => { closeAlert(); }, alertTimeout);
        return () => { clearTimeout(timeOut); clearInterval(interval); };
    }, []);

    return (
        <div className={`${bgColor} ${textColor} flex items-center min-h-[65px] max-h-[100px] p-4 pt-6 rounded-lg mx-auto max-sm:min-w-[240px] sm:max-w-1/3 fixed sm:top-[calc(100vh-100px)] top-[calc(100vh-115px)] sm:right-10 right-1/2 translate-x-1/2 sm:translate-0 z-100`} role="alert">
            <div className="w-full bg-gray-200 rounded-t-lg overflow-hidden h-2.5 absolute top-0 left-0 right-0">
                <div className={`${progressColor} h-2.5 rounded-t-lg`} style={{ width: `${progress}%` }}></div>
            </div>
            {getIcon(typeAlert)}
            <div className="px-4 text-sm font-medium">{messageAlert}</div>
            <button
                type="button"
                className={`ms-auto ${buttonBg} rounded-lg focus:ring-2 ${focusRing} p-1.5 ${hoverBg} inline-flex items-center justify-center h-8 w-8 cursor-pointer`}
                title="Close" onClick={closeAlert}
            >
                <RxCross2 className="text-xl" />
            </button>
        </div>
    );
};

export default Alert;
