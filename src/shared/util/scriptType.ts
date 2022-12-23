type ScriptType = 'BACKGROUND' | 'CONTENT' | 'POPUP' | 'EXTENSION_PAGE';

/**
 * Uses global variables to determine the type of the extension script that is currently being executed.
 * @returns  the script type of the given script
 */
export function computeScriptType(): ScriptType {
    if (typeof window !== 'undefined') {
        if (window.location.pathname.includes('/popup.html')) {
            return 'POPUP';
        }
        if (window.location.href.includes(`chrome-extension://${chrome.runtime.id}`)) {
            return 'EXTENSION_PAGE';
        }
        return 'CONTENT';
    }
    return 'BACKGROUND';
}

export const SCRIPT_TYPE = computeScriptType();
