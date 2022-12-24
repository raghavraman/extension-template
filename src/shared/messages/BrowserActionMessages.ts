import { createMessages, MessageDefinition } from '.';

interface BrowserActionMessages extends MessageDefinition {
    enableBrowserAction: () => void;
    disableBrowserAction: () => void;
}

export const [browserActionSender, BrowserActionHandler] = createMessages<BrowserActionMessages>();
