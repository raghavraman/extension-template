import { createMessages } from '.';

export type TabManagementMessages = {
    openNewTab: (data: { url: string }) => void;
    getTabId: () => number;
    removeTab: (data: { tabId: number }) => void;
};

export const [tabManagementSender, TabManagementListener] = createMessages<TabManagementMessages>();
