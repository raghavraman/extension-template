import { LocalStorage } from 'src/shared/storage';

/**
 * A list of websites that we don't want to reload when the extension reloads (becuase it'd be hella annoying)
 */
const HOT_RELOADING_WHITELIST = [
    'youtube.com',
    'twitch.tv',
    'github.dev',
    'figma.com',
    'netflix.com',
    'disneyplus.com',
    'hbomax.com',
    'spotify.com',
    'localhost:6006',
    'docs.google.com',
    'reddit.com',
    'gmail.com',
    'photopea.com',
];

/**
 * Reloads the tab that was open when the extension was reloaded
 * @returns a promise that resolves when the tab is reloaded
 */
export async function hotReloadTab(): Promise<void> {
    const [isTabReloading, reloadTabId] = await Promise.all([
        LocalStorage.get('tabReloadingEnabled'),
        LocalStorage.get('reloadTabId'),
    ]);
    if (!isTabReloading || !reloadTabId) return;

    chrome.tabs.get(reloadTabId, tab => {
        if (!tab?.id) {
            return LocalStorage.set('reloadTabId', undefined);
        }

        if (!HOT_RELOADING_WHITELIST.find(url => tab.url?.includes(url))) {
            chrome.tabs.reload(tab.id);
        }
    });
}
