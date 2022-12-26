import { BACKGROUND_MESSAGES } from 'src/shared/messages';
import { MessageHandler } from 'src/shared/types';
import tabManagementHandler from './tabManagementHandler';
import browserActionHandler from './browserActionHandler';
import hotReloadingHandler from './hotReloadingHandler';

export const backgroundHandlers: MessageHandler<BACKGROUND_MESSAGES> = {
    ...tabManagementHandler,
    ...browserActionHandler,
    ...hotReloadingHandler,
};
