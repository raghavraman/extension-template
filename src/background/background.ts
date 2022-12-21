import { generateRandomId } from 'src/shared/util/random';
import onHistoryStateUpdated from './events/onHistoryStateUpdated';
import onInstall from './events/onInstall';
import onNewChromeSession from './events/onNewChromeSession';
import onServiceWorkerAlive from './events/onServiceWorkerAlive';
import onUpdate from './events/onUpdate';

onServiceWorkerAlive();

/**
 * will be triggered on either install or update
 * (also when the extension is installed  through chrome device syncing!)
 * for analytics, put something into chrome.storage.sync to guard against it
 */
chrome.runtime.onInstalled.addListener(details => {
    switch (details.reason) {
        case 'install':
            onInstall();
            break;
        case 'update':
            onUpdate();
            break;
        default:
            break;
    }
});

// This event is fired when any tab's url changes.
chrome.webNavigation.onHistoryStateUpdated.addListener(onHistoryStateUpdated);

/** whenever a new 'chrome session' comes alive, we want to call onNewChromeSession  */
const CHROME_SESSION_KEY = 'chromeSessionId';
chrome.storage.session.get(CHROME_SESSION_KEY, async storage => {
    if (!storage[CHROME_SESSION_KEY]) {
        await chrome.storage.session.set({ [CHROME_SESSION_KEY]: generateRandomId(10) });
        onNewChromeSession();
    }
});
