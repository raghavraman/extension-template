import { BrowserActionMessagesListener } from 'src/shared/messages/BrowserActionMessages';

export const browserActionListener = new BrowserActionMessagesListener({
    disableBrowserAction(context) {},
    enableBrowserAction(context) {},
});
