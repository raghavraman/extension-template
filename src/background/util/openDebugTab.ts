import { devStore } from 'src/shared/storage/devStore';

/**
 * Open the debug tab as the first tab
 */
export async function openDebugTab() {
    if (process.env.NODE_ENV === 'development') {
        const debugTabId = await devStore.getDebugTabId();

        const isAlreadyOpen = await (await chrome.tabs.query({})).some(tab => tab.id === debugTabId);
        if (isAlreadyOpen) return;

        const tab = await chrome.tabs.create({
            url: chrome.runtime.getURL('debug.html'),
            active: false,
            pinned: true,
            index: 0,
        });

        await devStore.setDebugTabId(tab.id);
    }
}
