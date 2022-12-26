import { SerialWrapper } from '../types';

export * from './LocalStorage';
export * from './SessionStorage';
export * from './SyncStorage';

type StorageArea = 'local' | 'sync' | 'session';

type StorageChange<T> = {
    oldValue?: T;
    newValue?: T;
};

/**
 * A class that wraps the chrome.storage API for a specific storage area
 */
export class Store<D extends Record<string, any>> {
    private area: StorageArea;

    constructor(area: StorageArea) {
        this.area = area;
    }

    /**
     * Get a value from storage
     * @param key the key to get
     * @returns the value of the key as a promise
     */
    public async get(key: keyof D): Promise<SerialWrapper<D[keyof D]>> {
        const value = await chrome.storage[this.area].get(key as string);
        return value as unknown as SerialWrapper<D[keyof D]>;
    }

    /**
     * Get all values from the storage area
     * @returns all values in storage as a promise
     */
    public async getAll(): Promise<SerialWrapper<D>> {
        const value = await chrome.storage[this.area].get(null);
        return value as unknown as SerialWrapper<D>;
    }

    /**
     * Set a value in storage
     * @param key the key to set
     * @param value the value to set
     */
    public async set(key: keyof D, value: D[keyof D]): Promise<void> {
        await chrome.storage[this.area].set({ [key]: value });
    }

    /**
     * This will be called when the extension is installed to set default values for all the modules
     * @param defaults the default values to set
     */
    public async initialize(defaults: D): Promise<void> {
        await chrome.storage[this.area].set(defaults);
    }

    /**
     * Subscribe to changes for a specific key in storage
     * @param key the key to subscribe to
     * @param callback the callback function that we want to call whenever the specified key changes
     * @returns a reference to the callback (useful for unsubscribing)
     */
    public subscribe(key: keyof D, callback: (changes: StorageChange<D[keyof D]>) => void): typeof callback {
        chrome.storage[this.area].onChanged.addListener(changes => {
            if (changes[key as string]) {
                callback(changes[key as string]);
            }
        });
        return callback;
    }

    /**
     * Attempt to unsubscribe a callback from a key
     * @param callback the callback to unsubscribe
     */
    public unsubscribe(callback: (changes: StorageChange<D[keyof D]>) => void): void {
        chrome.storage[this.area].onChanged.removeListener(callback as any);
    }
}
