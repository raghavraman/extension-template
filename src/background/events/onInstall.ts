import { LocalStorage, SessionStorage, SyncStorage } from 'src/shared/storage';
import { generateRandomId } from 'src/shared/util/random';
import { SECOND } from 'src/shared/util/time';

export default async function onInstall() {
    // set the uninstall url
    chrome.runtime.setUninstallURL('https://www.google.com');
    logOnInstallEvent();

    await Promise.all([
        SyncStorage.initialize({
            installed: true,
        }),

        LocalStorage.initialize({}),

        SessionStorage.initialize({}),
    ]);
}

/**
 * making sure we are not sending duplicate install event for users that have synced browsers
 *  sync storage get's cleared on browser uninstall, so re-installing the browser will trigger the event
 */
function logOnInstallEvent() {
    setTimeout(async () => {
        const manifest = chrome.runtime.getManifest();
        const INSTALL_KEY = `${manifest.short_name}-installed`;
        const storage = await chrome.storage.sync.get(INSTALL_KEY);
        if (!storage[INSTALL_KEY]) {
            // TODO: send install event
            await chrome.storage.sync.set({ [INSTALL_KEY]: true });
        }
    }, 5 * SECOND);
}
