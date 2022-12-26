import { MessageDefinition } from '../types';

export default interface BrowserActionMessages extends MessageDefinition {
    /** make it so that clicking the browser action will open the popup.html */
    enableBrowserAction: () => void;
    /** make it so that clicking the browser action will respond to interactions from the content script */
    disableBrowserAction: () => void;
}
