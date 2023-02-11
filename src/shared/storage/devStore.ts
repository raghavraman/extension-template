import { createStore } from 'chrome-extension-toolkit';

/**
 * A store that is used to store data that is only relevant during development
 */
interface IDevStore {
    /** the tabId for the debug tab */
    debugTabId?: number;
    /** whether we should enable extension reloading */
    isExtensionReloading?: boolean;
    /** whether we should enable tab reloading */
    isTabReloading?: boolean;
    /** The id of the tab that we want to reload (after the extension reloads itself ) */
    reloadTabId?: number;
}

export const devStore = createStore<IDevStore>({
    debugTabId: undefined,
    isTabReloading: true,
    isExtensionReloading: true,
    reloadTabId: undefined,
});
