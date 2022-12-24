import { createMessages, MessageDefinition } from '.';

interface TabManagementMessages extends MessageDefinition {
    openNewTab: (data: { url: string }) => void;
    getTabId: () => number;
    removeTab: (data: { tabId: number }) => void;
}

export const [tabManagementSender, BrowserActionHandler] = createMessages<TabManagementMessages>();
