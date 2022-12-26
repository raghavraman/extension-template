import TAB_MESSAGES from './TabMessages';
import BrowserActionMessages from './BrowserActionMessages';
import createMessageSender from './functions/createMessageSender';
import HotReloadingMessages from './HotReloadingMessages';
import TabManagementMessages from './TabManagementMessages';

/**
 * This is a type with all the message definitions that can be sent TO the background script
 */
export type BACKGROUND_MESSAGES = BrowserActionMessages & TabManagementMessages & HotReloadingMessages;

/**
 * A utility object that can be used to send type-safe messages to the background script
 */
export const backgroundMessenger = createMessageSender<BACKGROUND_MESSAGES>();

/**
 * A utility object that can be used to send type-safe messages to specific tabs
 */
export const tabMessenger = createMessageSender<TAB_MESSAGES>();
