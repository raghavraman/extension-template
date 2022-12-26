import HotReloadingMessages from 'src/shared/messages/HotReloadingMessages';
import { LocalStorage } from 'src/shared/storage';
import { MessageHandler } from 'src/shared/types';

const hotReloadingHandler: MessageHandler<HotReloadingMessages> = {
    async reloadExtension({ sendResponse }) {
        const isExtensionReloading = await LocalStorage.get('extensionReloadingEnabled');
        if (!isExtensionReloading) return sendResponse();

        const isTabReloading = await LocalStorage.get('tabReloadingEnabled');
        if (isTabReloading) {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const tabToReload = tabs[0];

            await LocalStorage.set('reloadTabId', tabToReload?.id);
        }
        chrome.runtime.reload();
    },
};

export default hotReloadingHandler;
