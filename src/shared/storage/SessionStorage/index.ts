import { Store } from '..';

/**
 * chrome.session.storage is a temporary storage area that is cleared when the browser is closed.
 */
type ISessionStorage = {
    chromeSessionId?: string;
};

export const SessionStorage = new Store<ISessionStorage>('session');
