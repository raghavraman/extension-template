import { TabManagementListener } from 'src/shared/messages/TabManagementMessages';

export const tabManagementListener = new TabManagementListener({
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
});
