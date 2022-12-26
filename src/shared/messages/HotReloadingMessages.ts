import { MessageDefinition } from '../types';

export default interface HotReloadingMessages extends MessageDefinition {
    reloadExtension: () => void;
    toggleExtensionReloading: () => void;
    toggleTabReloading: () => void;
}
