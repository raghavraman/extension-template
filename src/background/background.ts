import { generateRandomId } from 'src/shared/util/random';
import onHistoryStateUpdated from './events/onHistoryStateUpdated';
import onInstall from './events/onInstall';
import onNewChromeSession from './events/onNewChromeSession';
import onServiceWorkerAlive from './events/onServiceWorkerAlive';
import onUpdate from './events/onUpdate';
import { browserActionListener } from './listeners/browserActionHandler';
import { tabManagementListener } from './listeners/tabManagementListener';
import chromeSessionStore from './storage/chromeSessionStore';

onServiceWorkerAlive();

/**
 * will be triggered on either install or update
 * (will also be triggered on a user's sync'd browsers (on other devices)))
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

// listen for background incoming messages
try {
    tabManagementListener.listen();
    browserActionListener.listen();
} catch (error) {
    console.error('Error while listening for messages', error);
}

// This event is fired when any tab's url changes.
chrome.webNavigation.onHistoryStateUpdated.addListener(onHistoryStateUpdated);

/** whenever a new 'chrome session' comes alive, we want to call onNewChromeSession  */

console.log(chromeSessionStore);
chromeSessionStore.getChromeSessionId().then(async sessionId => {
    if (!sessionId) {
        await chromeSessionStore.setChromeSessionId(generateRandomId(10));
        onNewChromeSession();
    }
});
