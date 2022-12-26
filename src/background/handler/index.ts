import { BACKGROUND_MESSAGES } from 'src/shared/messages';
import { MessageHandler } from 'src/shared/types';
import tabManagementHandler from './tabManagementHandler';
import browserActionHandler from './browserActionHandler';

export const backgroundHandlers: MessageHandler<BACKGROUND_MESSAGES> = {
    ...tabManagementHandler,
    ...browserActionHandler,
};
