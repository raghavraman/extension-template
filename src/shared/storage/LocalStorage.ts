import { Store } from './Store';

/**
 * chrome.local.storage is a permanent storage area that is not synced with other devices.
 */
type ILocalStorage = {
    /** the tabId for the debug tab */
    debugTabId?: number;
    /** whether we should enable extension reloading */
    extensionReloadingEnabled?: boolean;
    /** whether we should enable tab reloading */
    tabReloadingEnabled?: boolean;
    /** The id of the tab that we want to reload (after the extension reloads itself ) */
    reloadTabId?: number;
};

export const LocalStorage = new Store<ILocalStorage>('local');
