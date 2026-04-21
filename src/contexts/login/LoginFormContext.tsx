import { createContext, useContext, useState, ReactNode, ComponentType, CSSProperties } from "react";
import { useAuth } from "../auth/AuthContext";
import { useConfig } from "../config/ConfigContext";

type SvgComponent = ComponentType<React.SVGProps<SVGSVGElement>>;

interface OverrideStyle {
    form?: string;
    title?: string;
    containerEmail?: string;
    containerPassword?: string;
    containerButton?: string;
    button?: string;
    container?: string;
    cardForm?: string;
    containerLogo?: string;
    logo?: string;
    [key: string]: string | undefined;
}

interface LoginFormData {
    email: string;
    password: string;
}

interface LoginFormContextValue {
    overrideStyle: OverrideStyle;
    setOverrideStyle: (v: OverrideStyle) => void;
    title: string;
    setTitle: (v: string) => void;
    label: string;
    setLabel: (v: string) => void;
    type: string;
    setType: (v: string) => void;
    placeholder: string;
    setPlaceholder: (v: string) => void;
    buttonText: string;
    setButtonText: (v: string) => void;
    formData: LoginFormData;
    setFormData: (v: LoginFormData) => void;
    LogoImg: SvgComponent | undefined;
    setLogoImg: (v: SvgComponent | undefined) => void;
    styleCardForm: string | undefined;
    setStyleCardForm: (v: string | undefined) => void;
    styleContainerLogo: string | undefined;
    setStyleContainerLogo: (v: string | undefined) => void;
    styleLogo: string | undefined;
    setStyleLogo: (v: string | undefined) => void;
    changeData: (key: string, value: string) => void;
    handleLogin: (e: React.FormEvent<HTMLFormElement>) => void;
    customVersion: string | null;
    setCustomVersion: (v: string | null) => void;
}

const LoginFormContext = createContext<LoginFormContextValue | undefined>(undefined);

const LoginFormProvider = ({ children }: { children: ReactNode }) => {
    const { login } = useAuth();
    const { clearLoginFormOnError } = useConfig();

    const initialData: LoginFormData = { email: '', password: '' };

    const [title, setTitle] = useState('Accedi');
    const [label, setLabel] = useState('Email');
    const [type, setType] = useState('email');
    const [placeholder, setPlaceholder] = useState('example@example.it');
    const [buttonText, setButtonText] = useState('Accedi');
    const [formData, setFormData] = useState<LoginFormData>(initialData);
    const [LogoImg, setLogoImg] = useState<SvgComponent | undefined>(undefined);
    const [styleCardForm, setStyleCardForm] = useState<string | undefined>(undefined);
    const [styleContainerLogo, setStyleContainerLogo] = useState<string | undefined>(undefined);
    const [styleLogo, setStyleLogo] = useState<string | undefined>(undefined);
    const [overrideStyle, setOverrideStyle] = useState<OverrideStyle>({});
    const [customVersion, setCustomVersion] = useState<string | null>(null);

    const changeData = (key: string, value: string) => {
        setFormData(curr => ({ ...curr, [key]: value }));
    };

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        login(e, formData as unknown as Record<string, string>);
        if (clearLoginFormOnError) setFormData(initialData);
    };

    const value: LoginFormContextValue = {
        overrideStyle, setOverrideStyle, title, setTitle, label, setLabel,
        type, setType, placeholder, setPlaceholder, buttonText, setButtonText,
        formData, setFormData, LogoImg, setLogoImg, styleCardForm, setStyleCardForm,
        styleContainerLogo, setStyleContainerLogo, styleLogo, setStyleLogo,
        changeData, handleLogin, customVersion, setCustomVersion,
    };

    return (
        <LoginFormContext.Provider value={value}>
            {children}
        </LoginFormContext.Provider>
    );
};

const useLoginForm = (): LoginFormContextValue => {
    const value = useContext(LoginFormContext);
    if (value === undefined) throw new Error('Non puoi modificare La login');
    return value;
};

export { LoginFormProvider, useLoginForm };
