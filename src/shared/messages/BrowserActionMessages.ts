import { MessageDefinition } from '../types';

export default interface BrowserActionMessages extends MessageDefinition {
    /** Enable the browser action */
    enableBrowserAction: () => void;
    disableBrowserAction: () => void;
}
