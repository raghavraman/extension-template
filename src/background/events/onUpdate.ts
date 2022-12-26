import { hotReloadTab } from 'src/debug/hotReloadTab';

/**
 * Called when the extension is updated (or when the extension is reloaded in development mode)
 */
export default function onUpdate() {
    if (process.env.NODE_ENV === 'development') {
        hotReloadTab();
    }
}
