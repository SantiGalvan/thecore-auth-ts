import { useStorage } from "../storage/useStorage";

export interface StoredUser {
    id: number | string;
    email?: string;
    admin?: boolean;
    [key: string]: unknown;
}

const useAuthStorage = () => {
    const [token, setToken, removeToken] = useStorage<string | null>(null, 'accessToken');
    const [user, setUser, removeUser] = useStorage<StoredUser | null>(null, 'user');

    const storageLogout = () => {
        removeToken();
        removeUser();
    };

    return { token, user, setToken, setUser, storageLogout };
};

export { useAuthStorage };
