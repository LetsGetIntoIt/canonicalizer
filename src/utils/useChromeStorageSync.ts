import { useState, useEffect, useCallback } from "react";

type Setting<Value> = 
    | { _tag: 'Loading' }
    | { _tag: 'Persisted', value: Value }
    | { _tag: 'Saving', oldValue: Value, newValue: Value };

export const useChromeStorageSync = <Schema extends Record<string, unknown>>(keys: (keyof Schema)[]): [Setting<Partial<Schema>>, (value: Partial<Schema>) => void] => {
    // Store a local copy of the settings
    // starting with "undefined" to mean loading
    const [localValue, setLocalValue] = useState<Setting<Partial<Schema>>>({ _tag: 'Loading' });

    // Create function to refresh the local value from whatever is currently persisted
    const refreshLocalValue = useCallback(async () => {
        const value = await chrome.storage.sync.get(keys);
        setLocalValue({ _tag: 'Persisted', value: value as Partial<Schema> });
    }, [setLocalValue]);

    // Load the initial value of the settings
    useEffect(() => {
        refreshLocalValue();
    }, [refreshLocalValue]);

    // Update settings, then reload them
    const setPersistedValue = useCallback(async (value: Partial<Schema>) => {
        // Block a save operation if one is already in progress
        if (localValue._tag !== 'Persisted') {
            return;
        }

        // Indicate that we are starting a save operation
        setLocalValue({ _tag: 'Saving', oldValue: localValue.value, newValue: value });

        // Actually do the save
        await chrome.storage.sync.set(value);

        // Refresh the local value to whatever is persisted
        await refreshLocalValue();
    }, [localValue, setLocalValue]);

    return [localValue, setPersistedValue];
}
