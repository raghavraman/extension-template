export default interface HotReloadingStorage {
    isDebugTabVisible: boolean;

    debugTabId: number;

    debugTabWindowId: number;

    extensionReloadingEnabled: boolean;

    tabReloadingEnabled: boolean;
}
