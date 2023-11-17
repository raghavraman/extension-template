import { isExtensionPopup } from 'chrome-extension-toolkit';

/**
 * An enum that represents the different types of pages that we support
 * a given url/page can correspond to many of these enum values
 */
export enum SiteSupport {
    GOOGLE_SITE = 'GOOGLE_SITE',
    EXTENSION_POPUP = 'EXTENSION_POPUP',
}

/**
 * We use this function to determine what page the user is on, and then we can use that information to determine what to do
 * @param url the url of the current page
 * @returns a list of page types that the current page is
 */
export default function getSiteSupport(url: string): SiteSupport | null {
    if (isExtensionPopup()) {
        return SiteSupport.EXTENSION_POPUP;
    }
    if (url.includes('google.com')) {
        return SiteSupport.GOOGLE_SITE;
    }
    return null;
}
