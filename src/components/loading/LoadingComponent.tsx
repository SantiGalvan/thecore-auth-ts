import { ImSpinner9 } from "react-icons/im";
import { ReactNode } from "react";

interface LoadingComponentProps {
    spinner?: boolean;
    spinnerStyle?: string;
    text?: string;
    textStyle?: string;
    children?: ReactNode;
    containerStyle?: string;
    overrideStyle?: Record<string, string>;
}

const LoadingComponent = ({
    spinner = true, spinnerStyle, text, textStyle, children, containerStyle, overrideStyle = {}
}: LoadingComponentProps) => {
    return (
        <div className={overrideStyle.container || `w-full h-full relative flex items-center justify-center ${containerStyle}`}>
            {spinner && <ImSpinner9 className={overrideStyle.spinner || `text-[20rem] animate-spin text-black ${spinnerStyle}`} />}
            {children ? children : <p className={overrideStyle.text || `text-black text-2xl select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${textStyle}`}>{text || 'Loading...'}</p>}
        </div>
    );
};

export default LoadingComponent;
