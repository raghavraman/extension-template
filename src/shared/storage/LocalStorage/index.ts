import { Store } from '..';
import HotReloadingStorage from './HotReloadingStorage';
/**
 * chrome.local.storage is a permanent storage area that is not synced with other devices.
 */
type ILocalStorage = HotReloadingStorage;

export const LocalStorage = new Store<ILocalStorage>('local');
