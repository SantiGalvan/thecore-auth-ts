import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { version as packageVersion } from '../../../package.json';
import ErrorPage from "../../pages/error/ErrorPage";
import { useUserActivity, UserActivityResult } from "../../hooks/visibility/useUserActivity";

export interface ConfigRoute {
    path: string;
    title: string;
    element?: string;
}

interface AxiosErrors {
    unauthorized: string;
    notFound: string;
    defaultMessage: string;
}

export interface AppConfig {
    baseUri: string;
    authenticatedEndpoint: string;
    usersEndpoint: string;
    heartbeatEndpoint: string;
    firstPrivatePath: string;
    firstPrivateTitle: string;
    configRoutes: ConfigRoute[];
    routes?: ConfigRoute[];
    infiniteSession: boolean;
    timeDeducted: number;
    alertTimeout: number;
    axiosTimeout?: number;
    axiosErrors: AxiosErrors;
    clearLoginFormOnError: boolean;
    autoLogin: boolean;
    backendToken?: string;
    isDebug?: boolean;
    showHeaderButton?: boolean;
    sileoToastEnabled?: boolean;
    customDeviceType?: string;
    sileoToastConfig?: { position?: string; options?: Record<string, unknown> };
    hasSessionKey?: boolean;
    appKey?: string;
    sessionKey?: string;
    isDevelopment?: boolean;
    version?: string;
    pwa?: { customPrompt?: boolean };
    defaultTitle?: string;
    useCustomLoginTimeout?: boolean;
    stopLoaderOnFinish?: boolean;
    customLoginTimeout?: number;
    tokenLog?: boolean;
    timerInfiniteSession?: number;
    openIndexedDB: (dbName: string, storeName: string) => Promise<IDBDatabase>;
    getDataIndexedDB: (dbName: string, storeName: string, key: IDBValidKey) => Promise<unknown>;
    setDataIndexedDB: (dbName: string, storeName: string, data: object) => Promise<IDBValidKey>;
    generateUniqueId: (dbName: string, storeName: string) => Promise<number>;
    setDataWithAutoId: (dbName: string, storeName: string, data: { id?: IDBValidKey; [key: string]: unknown }) => Promise<void>;
    setCurrentDate: () => string;
    activity: UserActivityResult;
    [key: string]: unknown;
}

const ConfigContext = createContext<AppConfig | undefined>(undefined);

const ConfigProvider = ({ children }: { children: ReactNode }) => {
    const activity = useUserActivity();
    const [config, setConfig] = useState<Partial<AppConfig>>({});
    const [errorShow, setErrorShow] = useState(false);
    const fetchedRef = useRef(false);

    const errorMessage = `Creare un file config.json in public per il corretto funzionamento
Esempio di config.json:

{
    "baseUri": "",
    "authenticatedEndpoint": "",
    "usersEndpoint": "",
    "heartbeatEndpoint": "",
    "firstPrivatePath": "",
    "firstPrivateTitle": "",
    "configRoutes": [
        {"path": "", "title": "", "element": ""}
    ],
    "infiniteSession": "" ,
    "timeDeducted": "" ,
    "alertTimeout": "",
    "axiosTimeout": "" ,
    "axiosErrors": {
        "unauthorized":"",
        "notFound": "",
        "defaultMessage": ""
    },
    "clearLoginFormOnError": "" ,
    "autoLogin": "" ,
    "backendToken": "",
    "isDebug": "",
    "showHeaderButton": ""
}`;

    const getSessionKey = (hasSessionKey: boolean, appKey?: string): string | null => {
        if (!hasSessionKey) return null;
        let id = sessionStorage.getItem("sessionKey");
        if (!id) {
            id = `${appKey ? appKey + "-" : ""}${crypto.randomUUID()}`;
            sessionStorage.setItem("sessionKey", id);
        }
        return id;
    };

    const setCurrentDate = (): string => {
        const currentDate = new Date();
        const pad = (n: number) => String(n).padStart(2, '0');
        const day = pad(currentDate.getDate());
        const month = pad(currentDate.getMonth() + 1);
        const year = currentDate.getFullYear();
        const hours = pad(currentDate.getHours());
        const minutes = pad(currentDate.getMinutes());
        const seconds = pad(currentDate.getSeconds());
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    const openIndexedDB = (dbName: string, storeName: string): Promise<IDBDatabase> => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);
            request.onupgradeneeded = (e) => {
                const db = (e.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: "id" });
                }
            };
            request.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
            request.onerror = (e) => reject((e.target as IDBOpenDBRequest).error);
        });
    };

    const getDataIndexedDB = async (dbName: string, storeName: string, key: IDBValidKey): Promise<unknown> => {
        const db = await openIndexedDB(dbName, storeName);
        return new Promise((resolve, reject) => {
            if (!db) { reject("Errore: DB non disponibile"); return; }
            const transaction = db.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject((e.target as IDBRequest).error);
        });
    };

    const setDataIndexedDB = async (dbName: string, storeName: string, data: object): Promise<IDBValidKey> => {
        const db = await openIndexedDB(dbName, storeName);
        return new Promise((resolve, reject) => {
            if (!db) { reject("Errore: DB non disponibile"); return; }
            const transaction = db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject((e.target as IDBRequest).error);
        });
    };

    const generateUniqueId = async (dbName: string, storeName: string): Promise<number> => {
        let uniqueId = Date.now();
        let existingData;
        do {
            existingData = await getDataIndexedDB(dbName, storeName, uniqueId);
            if (existingData) uniqueId++;
        } while (existingData);
        return uniqueId;
    };

    const setDataWithAutoId = async (dbName: string, storeName: string, data: { id?: IDBValidKey; [key: string]: unknown }): Promise<void> => {
        if (!data.id) data.id = await generateUniqueId(dbName, storeName);
        await setDataIndexedDB(dbName, storeName, data);
    };

    const fetchConfig = async () => {
        try {
            const res = await fetch('/config.json');
            const data = await res.json();

            let version: string;
            if (!data.isDevelopment) {
                const pkgRes = await fetch('/package.json');
                const pkgData = await pkgRes.json();
                version = pkgData.version;
            } else {
                version = packageVersion;
            }

            const sessionKey = getSessionKey(data.hasSessionKey, data.appKey);
            const newData: AppConfig = {
                ...data,
                version,
                openIndexedDB,
                getDataIndexedDB,
                setDataIndexedDB,
                generateUniqueId,
                setDataWithAutoId,
                setCurrentDate,
                activity,
            };

            if (data.hasSessionKey && sessionKey) {
                newData.sessionKey = sessionKey;
            }

            setConfig(newData);
        } catch (err) {
            console.error(err);
            setErrorShow(true);
        }
    };

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        fetchConfig();
    }, []);

    if (Object.keys(config).length === 0) {
        return <ErrorPage errorShow={errorShow} errorMessage={errorMessage} />;
    }

    return (
        <ConfigContext.Provider value={config as AppConfig}>
            {children}
        </ConfigContext.Provider>
    );
};

const useConfig = (): AppConfig => {
    const value = useContext(ConfigContext);
    if (value === undefined) throw new Error('Non puoi leggere i config');
    return value;
};

export { ConfigProvider, useConfig };
