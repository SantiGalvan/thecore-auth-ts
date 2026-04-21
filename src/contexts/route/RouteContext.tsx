import { createContext, useContext, ReactNode } from "react";

export interface RouteItem {
    path: string;
    element: ReactNode;
    title?: string;
}

interface RouteContextValue {
    publicRoutes: RouteItem[];
    privateRoutes: RouteItem[];
}

const RouteContext = createContext<RouteContextValue | undefined>(undefined);

interface RouteProviderProps {
    children: ReactNode;
    publicRoutes?: RouteItem[];
    privateRoutes?: RouteItem[];
}

const RouteProvider = ({ children, publicRoutes = [], privateRoutes = [] }: RouteProviderProps) => {
    return (
        <RouteContext.Provider value={{ publicRoutes, privateRoutes }}>
            {children}
        </RouteContext.Provider>
    );
};

const useRoutesInjection = (): RouteContextValue => {
    const value = useContext(RouteContext);
    if (value === undefined) {
        throw new Error(
            "Errore: Le rotte non sono state inizializzate correttamente.\n\n" +
            "Soluzione: Assicurati di avvolgere il tuo componente con <RouteProvider>.\n\n" +
            "Esempio:\n\n" +
            "<RouteProvider publicRoutes={[]} privateRoutes={[]}>\n" +
            "   <MyPackageRoutes />\n" +
            "</RouteProvider>"
        );
    }
    return value;
};

export { RouteProvider, useRoutesInjection };
