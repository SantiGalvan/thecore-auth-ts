import axios, { AxiosInstance } from "axios";

let instance: AxiosInstance | null = null;

type AlertFn = (type: string, message: string) => void;
type ErrorCallback = (error: unknown) => void;

const fetchAxiosConfig = async (
    alert?: AlertFn,
    onUnauthorized?: () => void,
    onNotFound?: ErrorCallback,
    onGenericError?: ErrorCallback
): Promise<AxiosInstance | undefined> => {
    if (instance) return instance;

    try {
        const res = await fetch('/config.json');
        const data = await res.json();
        const baseURL: string = data.baseUri;
        const { unauthorized, notFound, defaultMessage } = data.axiosErrors;

        instance = axios.create({ baseURL });

        instance.interceptors.request.use((config) => {
            const token = JSON.parse(localStorage.getItem("accessToken") || 'null');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                delete config.headers.Authorization;
            }
            return config;
        });

        instance.interceptors.response.use(
            response => response,
            (error) => {
                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                            localStorage.removeItem('accessToken');
                            alert?.('danger', unauthorized);
                            onUnauthorized?.();
                            break;
                        case 404:
                            alert?.('danger', notFound);
                            onNotFound?.(error);
                            break;
                        default:
                            alert?.('danger', `${defaultMessage} ${error.response.status || ''} ${error.response.data?.error || ''}`);
                            onGenericError?.(error);
                    }
                }
                return Promise.reject(error);
            }
        );

        return instance;
    } catch (err) {
        console.error(err);
    }
};

export { fetchAxiosConfig };
