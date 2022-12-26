import { BACKGROUND_MESSAGES } from 'src/shared/messages';
import { SessionStorage } from 'src/shared/storage';
import { Message } from 'src/shared/types';
import { generateRandomId } from 'src/shared/util/random';
import onHistoryStateUpdated from './events/onHistoryStateUpdated';
import onInstall from './events/onInstall';
import onNewChromeSession from './events/onNewChromeSession';
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

SessionStorage.get('chromeSessionId').then(async sessionId => {
    if (!sessionId) {
        await SessionStorage.set('chromeSessionId', generateRandomId(10));
        onNewChromeSession();
    }
});
