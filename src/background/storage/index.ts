import { SerialWrapper } from 'src/shared/types';
import { capitalize, capitalizeFirstLetter } from 'src/shared/util/string';

type StorageArea = 'sync' | 'local' | 'session';
type Bucket = Record<string, any>;

type SET<B extends string> = `set${Capitalize<B>}`;
type GET<B extends string> = `get${Capitalize<B>}`;
type ON_CHANGE<B extends string> = `onChange${Capitalize<B>}`;

type StorageChange<T> = {
    oldValue?: T;
    newValue?: T;
};

type Store<B extends Bucket> = keyof B extends string
    ? {
          [K in keyof B as SET<K>]: (value: B[K]) => Promise<void>;
      } & {
          [K in keyof B as GET<K extends string ? K : never>]: () => Promise<B[K]>;
      } & {
          keys: () => string[];
          size: () => Promise<number>;
      }
    : never;

type StoreObserver<B extends Bucket> = {
    observe(
        callbacks: Partial<
            keyof B extends string
                ? { [K in keyof B as ON_CHANGE<K>]: (value: StorageChange<SerialWrapper<B[K]>>) => void }
                : never
        >
    ): void;
};

export type StoreDefaults<B extends Bucket> = {
    [P in keyof Required<B>]: Pick<B, P> extends Required<Pick<B, P>> ? B[P] : B[P] | undefined;
};

/**
 * Creates a pseudo-storage object that uses chrome.storage under the hood.
 * @param area the storage area to use
 * @param defaults the default values to use
 * @returns a tuple of the store and the observer
 */
export function createStore<B extends Bucket>(
    area: StorageArea,
    defaults: StoreDefaults<B>
): [Store<Required<B>>, StoreObserver<Required<B>>] {
    const keys = Object.keys(defaults) as string[];

    const store = {} as Store<B>;
    store.keys = () => keys;

    let isValidated = false;

    async function validate() {
        if (!isValidated) {
            const values = await chrome.storage[area].get(keys);
            const missingKeys = keys.filter(key => values[key] === undefined);

            if (missingKeys.length > 0) {
                const defaultsToSet = missingKeys.reduce((acc, key) => {
                    acc[key as keyof B] = defaults[key];
                    return acc;
                }, {} as Partial<B>);

                await chrome.storage[area].set(defaultsToSet);
            }
        }
        isValidated = true;
    }

    for (const key of keys) {
        store[`set${capitalizeFirstLetter(key)}`] = async (value: B[keyof B]) => {
            await validate();
            await chrome.storage[area].set({ [key]: value });
        };
        store[`get${capitalizeFirstLetter(key)}`] = async () => {
            await validate();
            const value = await chrome.storage[area].get(key);
            return value[key];
        };
    }

    store.size = () => chrome.storage[area].getBytesInUse();

    const observer = {} as StoreObserver<B>;
    observer.observe = callbacks => {
        chrome.storage.onChanged.addListener(async (changes, areaName) => {
            if (areaName !== area) {
                return;
            }
            await validate();
            for (const key of Object.keys(changes)) {
                const callback = callbacks[`onChange${capitalizeFirstLetter(key)}`];
                if (callback) {
                    callback({
                        oldValue: changes[key].oldValue,
                        newValue: changes[key].newValue,
                    });
                }
            }
        });
    };

    return [store, observer] as any;
}
