import { SCRIPT_TYPE } from '../util/scriptType';
import { SerialWrapper } from '../types/Serialization';
import { AddParameters } from '../types/Utility';

export type MessageDefinition = Record<
    string,
    (...args: [data: Record<string | number | symbol, any> | undefined]) => any
>;

type SenderOptions = {
    tabId?: number;
};

type Message<M extends MessageDefinition> = {
    name: keyof MessageDefinition;
    data: Parameters<M[keyof M]>[0];
    from: MessageEndpoint;
    to: MessageEndpoint;
};

type MessageEndpoint = 'BACKGROUND' | 'VIEW';

type MessageContext<M extends MessageDefinition, K extends keyof M> = {
    data: SerialWrapper<Parameters<M[K]>[0]>;
    sender: chrome.runtime.MessageSender;
    sendResponse: (response: ReturnType<M[K]>) => void;
};

type MessageListener<M extends MessageDefinition> = {
    [K in keyof M]: (context: MessageContext<M, K>) => Promise<void> | void;
};

type MessageSender<M extends MessageDefinition> = {
    [K in keyof M]: AddParameters<(...args: Parameters<M[K]>) => Promise<ReturnType<M[K]>>, [options?: SenderOptions]>;
};

/**
 * A wrapper for chrome extension messaging with a type-safe API.
 * @returns A tuple of a `MessageSender` instance and a `MessageListener` class.
 */
export function createMessages<M extends MessageDefinition>(): [MessageSender<M>, Handler<M>] {
    const sender = new Proxy(
        {},
        {
            get(target, prop) {
                const name = prop as string;
                return async (data: Parameters<M[keyof M]>[0], options?: SenderOptions) =>
                    new Promise((resolve, reject) => {
                        // if they're specifying a tabId, send to that tab, otherwise send to background
                        const from: MessageEndpoint = options?.tabId ? 'BACKGROUND' : 'VIEW';
                        const to: MessageEndpoint = options?.tabId ? 'VIEW' : 'BACKGROUND';

                        const message: Message<M> = {
                            name,
                            data,
                            from,
                            to,
                        };

                        if (options?.tabId) {
                            chrome.tabs.sendMessage(options.tabId, message, (response: ReturnType<M[keyof M]>) => {
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
        }
    );

    return [sender, MessageHandler<M>] as any;
}

/**
 * A class that listens for messages
 */
type Handler<M extends MessageDefinition> = new (handlers: MessageListener<M>) => MessageHandler<M>;

class MessageHandler<M extends MessageDefinition> {
    /** The handlers that this listener will use to handle messages. */
    public handlers = {} as MessageListener<M>;

    /**
     * The endpoint that this listener is initialized on (and thus listening on).
     * (either in the background script or in a tab)
     * */
    public endpoint: MessageEndpoint = SCRIPT_TYPE === 'BACKGROUND' ? 'BACKGROUND' : 'VIEW';

    constructor(handlers: MessageListener<M>) {
        this.handlers = handlers;
    }

    /**
     * Begin listening for messages using the provided handlers.
     */
    listen() {
        chrome.runtime.onMessage.addListener((message: Message<M>, sender, sendResponse) => {
            const { name, data, from, to } = message;
            const handler = this.handlers[name];

            // was this message sent to us?
            const isForUs = to === this.endpoint && from !== this.endpoint;

            if (isForUs && handler) {
                handler({
                    data: data as any,
                    sender,
                    sendResponse,
                });
            }
            return true;
        });
    }
}
