import TabManagementMessages from 'src/shared/messages/TabManagementMessages';
import { MessageHandler } from 'src/shared/types';

const tabManagementHandler: MessageHandler<TabManagementMessages> = {
    getTabId({ data, sendResponse, sender }) {
        sendResponse(sender.tab?.id ?? -1);
    },
    openNewTab({ data, sendResponse }) {},
    removeTab({ data, sendResponse }) {},
};

export default tabManagementHandler;
