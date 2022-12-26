import { SerialWrapper } from './Serialization';
import { AddParameters } from './Function';

export type MessageDefinition = Record<
    string,
    (...args: [data: Record<string | number | symbol, any> | undefined]) => any
>;

export type Message<M extends MessageDefinition> = {
    name: keyof MessageDefinition;
    data: Parameters<M[keyof M]>[0];
    from: MessageEndpoint;
    to: MessageEndpoint;
};

export type MessageEndpoint = 'BACKGROUND' | 'TAB';

export type MessageContext<M extends MessageDefinition, K extends keyof M> = {
    data: SerialWrapper<Parameters<M[K]>[0]>;
    sender: chrome.runtime.MessageSender;
    sendResponse: (response: ReturnType<M[K]>) => void;
};

export type MessageHandler<M extends MessageDefinition> = {
    [K in keyof M]: (context: MessageContext<M, K>) => Promise<void> | void;
};

export type BackgroundMessageSender<M extends MessageDefinition> = {
    [K in keyof M]: (...args: Parameters<M[K]>) => Promise<ReturnType<M[K]>>;
};

export type TabMessageSender<M extends MessageDefinition> = {
    [K in keyof M]: AddParameters<(...args: Parameters<M[K]>) => Promise<ReturnType<M[K]>>, [tabId: number]>;
};
