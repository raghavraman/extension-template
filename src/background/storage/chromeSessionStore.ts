import { createStore, StoreDefaults } from '.';

interface IChromeSessionStore {
    /** Test */
    chromeSessionId?: string;
}

const defaults: StoreDefaults<IChromeSessionStore> = {
    chromeSessionId: undefined,
};

const [chromeSessionStore, observer] = createStore<IChromeSessionStore>('session', defaults);

export default chromeSessionStore;
