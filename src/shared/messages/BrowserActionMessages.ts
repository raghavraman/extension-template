import { createMessages } from '.';

type BrowserActionMessages = {
    enableBrowserAction: () => void;
    disableBrowserAction: () => void;
};

export const [browserActionSender, BrowserActionListener] = createMessages<BrowserActionMessages>();
