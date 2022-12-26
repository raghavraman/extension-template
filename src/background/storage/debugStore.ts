import { createStore, StoreDefaults } from '.';

interface IDebugStore {
    /** whether the debug tab is visible (should it make it visible next time on reload) */
    isDebugVisible?: boolean;
    /** The ID of the tab that is used for debugging */
    debugTabId?: number;

    /** Which window the the debug tab is in */
    debugWindowId?: number;

    /** Whether we should call chrome.runtime.reload on code changes */
    hotReloadingEnabled?: boolean;
    /** Whether we should reload the current active tab on code changes */
    tabReloadingEnabled?: boolean;

    /* The ID of the tab that must be hot reloaded */
    tabToReloadId?: number;
}

const defaults: StoreDefaults<IDebugStore> = {
    isDebugVisible: false,
    debugTabId: undefined,
    debugWindowId: undefined,
    hotReloadingEnabled: true,
    tabReloadingEnabled: true,
    tabToReloadId: undefined,
};

const [debugStore, observer] = createStore<IDebugStore>('local', defaults);

export default debugStore;
