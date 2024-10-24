'use client';
import { useState, useEffect } from 'react';
interface UseLocalStorageOptions<T> {
    key: string;
    initialValue: T;
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
}

interface UseLocalStorageReturn<T> {
    value: T;
    setValue: (value: T | ((prev: T) => T)) => void;
    remove: () => void;
    loading: boolean;
    error: Error | null;
}

export function useLocalStorage<T>({
    key,
    initialValue,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
}: UseLocalStorageOptions<T>): UseLocalStorageReturn<T> {
    const [value, setValue] = useState<T>(initialValue);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        try {
            setLoading(true);
            const item = window.localStorage.getItem(key);
            if (item !== null) {
                setValue(deserialize(item));
            }
        } catch (err) {
            console.error(`Error reading localStorage key "${key}":`, err);
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setLoading(false);
        }
    }, [key, deserialize]);

    const updateValue = (newValue: T | ((prev: T) => T)) => {
        try {
            setLoading(true);
            setError(null);

            // Handle function updates
            setValue((current) => {
                const computedValue = typeof newValue === 'function'
                    ? (newValue as (prev: T) => T)(current)
                    : newValue;

                // Store in localStorage
                window.localStorage.setItem(key, serialize(computedValue));
                return computedValue;
            });
        } catch (err) {
            console.error(`Error saving to localStorage key "${key}":`, err);
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setLoading(false);
        }
    };

    const remove = () => {
        try {
            setLoading(true);
            setError(null);
            window.localStorage.removeItem(key);
            setValue(initialValue);
        } catch (err) {
            console.error(`Error removing localStorage key "${key}":`, err);
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setLoading(false);
        }
    };

    return {
        value,
        setValue: updateValue,
        remove,
        loading,
        error,
    };
}