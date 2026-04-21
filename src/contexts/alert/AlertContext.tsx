import { createContext, useContext, useState, ReactNode, ReactElement } from "react";
import DangerLogo from '../../assets/danger.svg?react';
import InfoLogo from '../../assets/info.svg?react';
import WarningLogo from '../../assets/warning.svg?react';
import { GiCheckMark } from "react-icons/gi";
import { useDevice } from "../../hooks/device/useDevice";
import { useConfig } from "../config/ConfigContext";
import { useToast } from "../../hooks/toast/useToast";

export type AlertType = 'danger' | 'info' | 'success' | 'warning';

interface AlertConfigEntry {
    bgColor: string;
    textColor: string;
    buttonBg: string;
    hoverBg: string;
    focusRing: string;
    progressColor: string;
}

type AlertConfigMap = Record<AlertType, AlertConfigEntry>;

interface AlertContextValue {
    showAlert: boolean;
    setShowAlert: (v: boolean) => void;
    typeAlert: AlertType | undefined;
    setTypeAlert: (v: AlertType | undefined) => void;
    messageAlert: string | undefined;
    setMessageAlert: (v: string | undefined) => void;
    alertConfig: AlertConfigMap;
    getIcon: (type: AlertType) => ReactElement | undefined;
    closeAlert: () => void;
    activeAlert: (type: AlertType, message: string, customType?: boolean | null) => void;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

const AlertProvider = ({ children }: { children: ReactNode }) => {
    const { sileoToastEnabled, customDeviceType } = useConfig();
    const { success, error, info, warning } = useToast();
    const device = useDevice();

    const [showAlert, setShowAlert] = useState(false);
    const [typeAlert, setTypeAlert] = useState<AlertType | undefined>(undefined);
    const [messageAlert, setMessageAlert] = useState<string | undefined>(undefined);

    const deviceType = customDeviceType || device.type;

    const alertConfig: AlertConfigMap = {
        danger: {
            bgColor: "bg-danger", textColor: "text-danger-text", buttonBg: "bg-danger",
            hoverBg: "hover:bg-danger-hover", focusRing: "focus:ring-danger-progress", progressColor: "bg-danger-progress"
        },
        info: {
            bgColor: "bg-info", textColor: "text-info-text", buttonBg: "bg-info",
            hoverBg: "hover:bg-info-hover", focusRing: "focus:ring-info-progress", progressColor: "bg-info-progress"
        },
        success: {
            bgColor: "bg-success", textColor: "text-success-text", buttonBg: "bg-success",
            hoverBg: "hover:bg-success-hover", focusRing: "focus:ring-success-progress", progressColor: "bg-success-progress"
        },
        warning: {
            bgColor: "bg-warning", textColor: "text-warning-text", buttonBg: "bg-warning",
            hoverBg: "hover:bg-warning-hover", focusRing: "focus:ring-warning-progress", progressColor: "bg-warning-progress"
        },
    };

    const getIcon = (type: AlertType): ReactElement | undefined => {
        switch (type) {
            case 'danger': return <DangerLogo className="w-[20px] h-[20px]" />;
            case 'info': return <InfoLogo className="w-[20px] h-[20px]" />;
            case 'success': return <GiCheckMark className="text-xl" />;
            case 'warning': return <WarningLogo className="w-[20px] h-[20px]" />;
        }
    };

    const closeAlert = () => setShowAlert(prev => !prev);

    const activeAlert = (type: AlertType, message: string, customType: boolean | null = null) => {
        setShowAlert(false);
        if (sileoToastEnabled && !customType) {
            if (["mobile", "tablet"].includes(deviceType)) {
                switch (type) {
                    case "danger": error("Errore", message); break;
                    case "info": info("Info", message); break;
                    case "success": success("Successo", message); break;
                    case "warning": warning("Attenzione", message); break;
                    default: info("Info", message);
                }
                return;
            }
        }
        setTimeout(() => {
            setTypeAlert(type);
            setMessageAlert(message);
            setShowAlert(true);
        }, 50);
    };

    const value: AlertContextValue = {
        showAlert, setShowAlert, typeAlert, setTypeAlert,
        messageAlert, setMessageAlert, alertConfig, getIcon, closeAlert, activeAlert,
    };

    return (
        <AlertContext.Provider value={value}>
            {children}
        </AlertContext.Provider>
    );
};

const useAlert = (): AlertContextValue => {
    const value = useContext(AlertContext);
    if (value === undefined) throw new Error('Non puoi modificare l\'alert');
    return value;
};

export { AlertProvider, useAlert };
