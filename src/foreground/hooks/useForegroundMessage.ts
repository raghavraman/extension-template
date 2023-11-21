import { createUseMessage } from 'chrome-extension-toolkit';
import FOREGROUND_MESSAGES from 'src/shared/messages/ForegroundMessages';

export const useForegroundMessage = createUseMessage<FOREGROUND_MESSAGES>();
