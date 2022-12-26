import BrowserActionMessages from 'src/shared/messages/BrowserActionMessages';
import { MessageHandler } from 'src/shared/types';

const browserActionHandler: MessageHandler<BrowserActionMessages> = {
    disableBrowserAction(context) {},
    enableBrowserAction(context) {},
};

export default browserActionHandler;
