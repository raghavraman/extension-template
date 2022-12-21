export enum ScriptType {
    BACKGROUND = 'BACKGROUND',
    CONTENT = 'CONTENT',
    POPUP = 'POPUP',
    EXTENSION_PAGE = 'EXTENSION_PAGE',
}

/**
 * Uses global variables to determine the type of the extension script that is currently being executed.
 * @returns  the script type of the given script
 */
export function computeScriptType(): ScriptType {
    if (typeof window !== 'undefined') {
        if (window.location.pathname.includes('/popup.html')) {
            return ScriptType.POPUP;
        }
        if (window.location.href.includes(`chrome-extension://${chrome.runtime.id}`)) {
            return ScriptType.EXTENSION_PAGE;
        }
        return ScriptType.CONTENT;
    }
    return ScriptType.BACKGROUND;
}

export const SCRIPT_TYPE = computeScriptType();
