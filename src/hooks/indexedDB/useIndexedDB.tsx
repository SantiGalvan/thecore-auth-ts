import { useEffect, useRef, useCallback, useState } from "react";

const useIndexedDB = (dbName: string, storeName: string, version = 1) => {
    const dbRef = useRef<IDBDatabase | null>(null);
    const [isReady, setIsReady] = useState(false);

    const get = useCallback(<T = unknown>(key: IDBValidKey): Promise<T | undefined> => {
        return new Promise((resolve, reject) => {
            if (!dbRef.current) { reject("DB non pronto"); return; }
            const tx = dbRef.current.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const req = store.get(key);
            req.onsuccess = () => resolve(req.result as T);
            req.onerror = () => reject(req.error);
        });
    }, [storeName]);

    const getAll = useCallback(<T = unknown>(): Promise<T[]> => {
        return new Promise((resolve, reject) => {
            if (!dbRef.current) return reject("DB non pronto");
            const tx = dbRef.current.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result as T[]);
            req.onerror = () => reject(req.error);
        });
    }, [storeName]);

    const set = useCallback(<T extends { id?: IDBValidKey }>(data: T): Promise<IDBValidKey> => {
        return new Promise((resolve, reject) => {
            if (!dbRef.current) { reject("DB non pronto"); return; }
            const tx = dbRef.current.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            const req = store.put(data);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }, [storeName]);

    const generateUniqueId = useCallback(async (): Promise<number> => {
        let id = Date.now();
        while (await get(id)) { id++; }
        return id;
    }, [get]);

    const setWithAutoId = useCallback(async <T extends { id?: IDBValidKey }>(data: T): Promise<IDBValidKey> => {
        if (!data.id) {
            (data as { id?: IDBValidKey }).id = await generateUniqueId();
        }
        return set(data);
    }, [generateUniqueId, set]);

    const remove = useCallback((id: IDBValidKey): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            if (!dbRef.current) { reject("DB non pronto"); return; }
            const tx = dbRef.current.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            const req = store.delete(id);
            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);
        });
    }, [storeName]);

    const clear = useCallback((): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            if (!dbRef.current) { reject("DB non pronto"); return; }
            const tx = dbRef.current.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            const req = store.clear();
            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);
        });
    }, [storeName]);

    useEffect(() => {
        const request = indexedDB.open(dbName, version);
        request.onupgradeneeded = (e) => {
            const db = (e.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: "id" });
            }
        };
        request.onsuccess = (e) => {
            dbRef.current = (e.target as IDBOpenDBRequest).result;
            setIsReady(true);
        };
        request.onerror = (e) => {
            console.error("IndexedDB error", (e.target as IDBOpenDBRequest).error);
        };
        return () => { dbRef.current?.close(); };
    }, [dbName, storeName, version]);

    return { get, getAll, set, setWithAutoId, remove, clear, isReady };
};

export { useIndexedDB };
