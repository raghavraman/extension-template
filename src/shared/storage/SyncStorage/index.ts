import { Store } from '..';

/**
 * chrome.sync.storage is a permanent storage area that is synced with other devices.
 */
type ISyncStorage = {
    installed: true;
};

export const SyncStorage = new Store<ISyncStorage>('sync');
