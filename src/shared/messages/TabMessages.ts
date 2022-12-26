import { MessageDefinition } from '../types';

/**
 * This is a type with all the message definitions that can be sent TO specific tabs
 */
export default interface TAB_MESSAGES extends MessageDefinition {
    reAnalyzePage: (data: { url: string }) => void;
}
