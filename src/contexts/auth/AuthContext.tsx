import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import jwt_decode from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import { useConfig } from "../config/ConfigContext";
import { useLoading } from "../loading/LoadingContext";
import { useAlert } from "../alert/AlertContext";
import { fetchAxiosConfig } from "../../api/axiosInstance";
import { useAuthStorage } from "../../hooks/auth/useAuthStorage";
import { AxiosInstance } from "axios";

interface JwtPayload {
    exp?: number;
    [key: string]: unknown;
}

interface AuthContextValue {
    isAuthenticated: boolean | null;
    setIsAuthenticated: (v: boolean) => void;
    login: (e: React.FormEvent | null, formData: Record<string, string>) => Promise<void>;
    logout: () => void;
    createAxiosInstances: (
        onUnauthorized?: () => void,
        onNotFound?: (e: unknown) => void,
        onGenericError?: (e: unknown) => void
    ) => Promise<AxiosInstance | undefined>;
    fetchHeartbeat: () => Promise<void>;
    getTokenExpiry: (tokenToCheck?: string | null) => number | undefined;
    checkTokenValidity: (token: string | null | undefined) => boolean;
    fetchUser: (token: string) => Promise<void>;
    handleLoad: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const {
        heartbeatEndpoint, firstPrivatePath, infiniteSession, timeDeducted,
        authenticatedEndpoint, autoLogin, setCurrentDate, isDebug, backendToken,
        useCustomLoginTimeout, stopLoaderOnFinish, customLoginTimeout, tokenLog, timerInfiniteSession
    } = useConfig();
    const { setIsLoading, showLoadingFor } = useLoading();
    const { setShowAlert, activeAlert } = useAlert();
    const { token, setToken, setUser, storageLogout } = useAuthStorage();
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [timeoutToken, setTimeoutToken] = useState<number | undefined>(undefined);
    const [sessionTimeout, setSessionTimeout] = useState<number | undefined>(undefined);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const createAxiosInstances = async (
        onUnauthorized: () => void = logout,
        onNotFound?: (e: unknown) => void,
        onGenericError?: (e: unknown) => void
    ): Promise<AxiosInstance | undefined> => {
        return fetchAxiosConfig(activeAlert, onUnauthorized, onNotFound, onGenericError);
    };

    const login = async (e: React.FormEvent | null, formData: Record<string, string>): Promise<void> => {
        if (e) e.preventDefault();
        setIsLoggingIn(true);
        try {
            if (!useCustomLoginTimeout) {
                setIsLoading(true);
            } else {
                showLoadingFor(customLoginTimeout as number);
            }
            setShowAlert(false);
            const axiosInstance = await createAxiosInstances();
            const res = await axiosInstance!.post(authenticatedEndpoint, { auth: formData });
            const dataToken = res.headers.token;
            const user = res.data;
            if (dataToken) {
                setUser(user);
                setToken(dataToken);
                setIsAuthenticated(true);
                navigate(`${firstPrivatePath}${user.id}`);
            }
        } catch (err) {
            console.error(err);
            setIsLoading(false);
        } finally {
            setIsLoggingIn(false);
            if (!useCustomLoginTimeout && stopLoaderOnFinish) setIsLoading(false);
        }
    };

    const logout = () => {
        storageLogout();
        setIsAuthenticated(false);
    };

    const fetchHeartbeat = async (): Promise<void> => {
        try {
            const axiosInstance = await createAxiosInstances();
            const res = await axiosInstance!.get(heartbeatEndpoint);
            const newToken = res.headers.token;
            setToken(newToken);
            if (isDebug) console.log('[Auth]: Nuovo token: ', newToken, 'Data:', setCurrentDate());
        } catch (err) {
            console.error(err);
            logout();
        }
    };

    const getTokenExpiry = (tokenToCheck?: string | null): number | undefined => {
        const checkToken = tokenToCheck || token;
        if (!checkToken) return;
        const message = 'Token non valido';
        try {
            const decoded = jwt_decode<JwtPayload>(checkToken);
            if (!decoded.exp) {
                if (tokenLog) console.warn('[Auth]: Token senza data di scadenza, eseguo logout.');
                logout();
                activeAlert('danger', message);
                return;
            }
            const currentTime = Math.floor(Date.now() / 1000);
            const totalTime = (decoded.exp - currentTime) * 1000;
            if (totalTime <= 0) {
                if (tokenLog) console.warn('[Auth]: Token scaduto, eseguo logout.');
                logout();
                activeAlert('danger', message);
                return;
            }
            setSessionTimeout(totalTime);
            setTimeoutToken(totalTime - (timeDeducted as number));
            const timer = totalTime - (timeDeducted as number);
            if (tokenLog) {
                const totalSeconds = Math.floor(totalTime / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                console.log(`[Auth]: Token valido per ancora: ${minutes} minuti e ${seconds} secondi`);
                console.log('[Auth]: Token:', token);
            }
            return timer;
        } catch (error) {
            if (tokenLog) console.error('[Auth]: Errore nella decodifica del token:', error);
            logout();
            activeAlert('danger', message);
        }
    };

    const checkTokenValidity = (tokenToCheck: string | null | undefined): boolean => {
        if (!tokenToCheck) return false;
        try {
            const decoded = jwt_decode<JwtPayload>(tokenToCheck);
            const currentTime = Math.floor(Date.now() / 1000);
            if (!decoded.exp || decoded.exp < currentTime) {
                console.warn('[Auth]: Token scaduto o non valido');
                return false;
            }
            return true;
        } catch (error) {
            console.error('[Auth]: Token non valido o corrotto', error);
            return false;
        }
    };

    const fetchUser = async (tokenParam: string): Promise<void> => {
        try {
            const axiosInstance = await createAxiosInstances();
            const res = await axiosInstance!.get(heartbeatEndpoint);
            const user = res.data;
            if (user) {
                setUser(user);
                setToken(tokenParam);
                setIsAuthenticated(true);
                navigate(`${firstPrivatePath}${user.id}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleLoad = () => {
        if (checkTokenValidity(token)) {
            if (tokenLog) console.log('[Auth]: Ricarico pagina → controllo scadenza token');
            getTokenExpiry(token);
        } else {
            if (tokenLog) console.warn('[Auth]: Token non valido al reload, eseguo logout');
            logout();
        }
    };

    useEffect(() => {
        if (!checkTokenValidity(token)) {
            logout();
            return;
        }
        setIsAuthenticated(true);
    }, []);

    useEffect(() => {
        if (autoLogin && !isAuthenticated && !isLoggingIn) {
            if (tokenLog) console.log('[Auth]: Tentativo di autologin con backendToken');
            fetchUser(backendToken as string);
        }
    }, [autoLogin, isAuthenticated, isLoggingIn]);

    useEffect(() => {
        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
            return () => window.removeEventListener('load', handleLoad);
        }
    }, []);

    useEffect(() => {
        if (autoLogin) return;
        const timer = getTokenExpiry(token);
        const intervalTime = timerInfiniteSession || timer;
        if (tokenLog) console.log('[Auth]: intervallo per il prossimo token:', intervalTime);

        let timerToken: ReturnType<typeof setInterval> | undefined;
        if (infiniteSession && token && timer) {
            if (tokenLog) console.log('[Auth]: Entrato dentro il timer della sessione infinita');
            timerToken = setInterval(() => { fetchHeartbeat(); }, intervalTime as number);
        }

        let expirySession: ReturnType<typeof setTimeout> | undefined;
        if (!infiniteSession && token) {
            if (tokenLog) console.log('[Auth]: Entrato dentro il timer della sessione con scadenza del token');
            expirySession = setTimeout(() => {
                logout();
                activeAlert('danger', 'Sessione scaduta');
            }, sessionTimeout);
        }

        return () => {
            if (timerToken) clearInterval(timerToken);
            if (expirySession) clearTimeout(expirySession);
        };
    }, [token, timeoutToken]);

    const value: AuthContextValue = {
        isAuthenticated, setIsAuthenticated, login, logout,
        createAxiosInstances, fetchHeartbeat, getTokenExpiry,
        checkTokenValidity, fetchUser, handleLoad,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = (): AuthContextValue => {
    const value = useContext(AuthContext);
    if (value === undefined) throw new Error('Non sei dentro al Auth Provider');
    return value;
};

export { AuthProvider, useAuth };
