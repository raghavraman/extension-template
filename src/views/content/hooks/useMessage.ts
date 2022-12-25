import { useEffect } from 'react';
import { MessageDefinition, MessageHandler, MessageListener } from 'src/shared/messages';

export default function useMessage<M extends MessageDefinition>(handlers: Partial<MessageHandler<M>>) {
    useEffect(() => {
        const listener = new MessageListener<M>(handlers as MessageHandler<M>);

        listener.listen();

        return () => listener.destroy();
    }, []);
}
