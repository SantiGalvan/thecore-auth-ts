import { createContext, useContext, useState, ReactNode } from "react";

export interface LoadingProps {
    spinner?: boolean;
    spinnerStyle?: string;
    text?: string;
    textStyle?: string;
    children?: ReactNode;
    containerStyle?: string;
    overrideStyle?: Record<string, string>;
}

interface LoadingContextValue {
    isLoading: boolean;
    setIsLoading: (v: boolean) => void;
    loadingProps: LoadingProps;
    setLoadingProps: (v: LoadingProps) => void;
    loadingComponent: ReactNode;
    setLoadingComponent: (v: ReactNode) => void;
    showLoadingFor: (duration?: number, props?: LoadingProps) => void;
}

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

interface LoadingProviderProps {
    children: ReactNode;
    defaultComponent?: ReactNode;
}

const LoadingProvider = ({ children, defaultComponent }: LoadingProviderProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProps, setLoadingProps] = useState<LoadingProps>({});
    const [loadingComponent, setLoadingComponent] = useState<ReactNode>(defaultComponent);

    const showLoadingFor = (duration = 2000, props: LoadingProps = {}) => {
        setLoadingProps(props);
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), duration);
    };

    const value: LoadingContextValue = {
        isLoading, setIsLoading, loadingProps, setLoadingProps,
        loadingComponent, setLoadingComponent, showLoadingFor,
    };

    return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );
};

const useLoading = (): LoadingContextValue => {
    const value = useContext(LoadingContext);
    if (value === undefined) throw new Error('Non puoi settare il loading');
    return value;
};

export { LoadingProvider, useLoading };
