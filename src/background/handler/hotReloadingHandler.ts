import HotReloadingMessages from 'src/shared/messages/HotReloadingMessages';
import { MessageHandler } from 'src/shared/types';

const hotReloadingHandler: MessageHandler<HotReloadingMessages> = {
    reloadExtension(context) {},
    toggleExtensionReloading(context) {},
    toggleTabReloading(context) {},
};

export default hotReloadingHandler;
