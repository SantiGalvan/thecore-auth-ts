import { useState } from "react";

const useStorage = <T,>(
    initialValue: T,
    itemKey: string
): [T, (v: T | ((prev: T) => T)) => void, (clearAll?: boolean) => void] => {
    const [state, setState] = useState<T>(() => {
        try {
            const storedValue = localStorage.getItem(itemKey);
            if (storedValue === null) {
                localStorage.setItem(itemKey, JSON.stringify(initialValue));
                return initialValue;
            }
            return JSON.parse(storedValue);
        } catch (error) {
            console.error("Errore nel recupero dal localStorage:", error);
            return initialValue;
        }
    });

    const changeState = (value: T | ((prev: T) => T)) => {
        setState((prev) => {
            const newValue = typeof value === "function" ? (value as (prev: T) => T)(prev) : value;
            localStorage.setItem(itemKey, JSON.stringify(newValue));
            return newValue;
        });
    };

    const remove = (clearAll = false) => {
        if (clearAll) {
            localStorage.clear();
        } else {
            localStorage.removeItem(itemKey);
        }
        setState(initialValue);
    };

    return [state, changeState, remove];
};

export { useStorage };
