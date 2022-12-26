import { BACKGROUND_MESSAGES } from 'src/shared/messages';
import { Message, MessageHandler } from 'src/shared/types';
import onHistoryStateUpdated from './events/onHistoryStateUpdated';
import onInstall from './events/onInstall';
import onServiceWorkerAlive from './events/onServiceWorkerAlive';
import onUpdate from './events/onUpdate';
import { backgroundHandlers } from './handler';

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

// This event is fired when any tab's url changes.
chrome.webNavigation.onHistoryStateUpdated.addListener(onHistoryStateUpdated);

// listen for messages to the background script
chrome.runtime.onMessage.addListener((message: Message<BACKGROUND_MESSAGES>, sender, sendResponse) => {
    if (message.to !== 'BACKGROUND') return;
    const { name } = message;
    const handler = backgroundHandlers[name];
    if (handler) {
        try {
            handler({ data: message.data, sendResponse, sender });
        } catch (error) {
            console.error(error);
        }
    }
    return true;
});

/** whenever a new 'chrome session' comes alive, we want to call onNewChromeSession  */

// console.log(chromeSessionStore);
// chromeSessionStore.getChromeSessionId().then(async sessionId => {
//     if (!sessionId) {
//         await chromeSessionStore.setChromeSessionId(generateRandomId(10));
//         onNewChromeSession();
//     }
// });
