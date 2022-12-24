import { BrowserActionHandler } from 'src/shared/messages/TabMessages';
import chromeSessionStore from '../storage/chromeSessionStore';

export const tabManagementHandler = new BrowserActionHandler({
    async getTabId({ sendResponse, sender }) {
        sendResponse(sender.tab?.id ?? -1);
    },
    openNewTab({ data, sendResponse }) {
        chrome.tabs.create({ url: data.url, active: true }, () => sendResponse());
    },
    removeTab({ data, sendResponse }) {
        chrome.tabs.remove(data.tabId, () => {
            sendResponse();
        });
    },
    storeValue({ data, sendResponse }) {
        chromeSessionStore.setChromeSessionId(`${data.num}`).then(() => {
            sendResponse();
        });
    },
});
