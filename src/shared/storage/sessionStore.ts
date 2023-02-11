import { createStore, Store } from 'chrome-extension-toolkit';

interface ISessionStore {
    chromeSessionId?: string;
}

export const sessionStore = createStore<ISessionStore>(
    {
        chromeSessionId: undefined,
    },
    undefined,
    'session'
);
