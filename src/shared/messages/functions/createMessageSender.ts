import {
    MessageDefinition,
    BackgroundMessageSender,
    TabMessageSender,
    MessageEndpoint,
    Message,
} from 'src/shared/types';
import { BACKGROUND_MESSAGES } from '..';

/**
 * A wrapper for chrome extension messaging with a type-safe API.
 * @returns A proxy object that can be used to send messages to the background script.
 */
export default function createMessageSender<M extends MessageDefinition>(): M extends BACKGROUND_MESSAGES
    ? BackgroundMessageSender<M>
    : TabMessageSender<M> {
    const sender = new Proxy({} as any, {
        get(target, prop) {
            const name = prop as string;
            return async (data: Parameters<M[keyof M]>[0], tabId?: number) =>
                new Promise((resolve, reject) => {
                    // if they're specifying a tabId, send to that tab, otherwise send to background
                    const from: MessageEndpoint = tabId ? 'BACKGROUND' : 'TAB';
                    const to: MessageEndpoint = tabId ? 'TAB' : 'BACKGROUND';

                    const message: Message<M> = {
                        name,
                        data: data as any,
                        from,
                        to,
                    };

                    if (tabId) {
                        chrome.tabs.sendMessage(tabId, message, (response: ReturnType<M[keyof M]>) => {
                            if (chrome.runtime.lastError) {
                                reject(chrome.runtime.lastError);
                            } else {
                                resolve(response);
                            }
                        });
                    }
                    chrome.runtime.sendMessage(message, (response: ReturnType<M[keyof M]>) => {
                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError);
                        } else {
                            resolve(response);
                        }
                    });
                });
        },
    });
    return sender;
}
