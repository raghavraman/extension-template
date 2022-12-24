import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { SECOND } from 'src/shared/util/time';
import styles from './ContextInvalidated.module.scss';

const CONTEXT_INVALIDATED_ID = 'extension-context-invalidated';

/** A ribbon to display within a tab whenever the extension's context has been invalidated */
function ContextInvalidated() {
    const removeRibbon = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        ReactDOM.unmountComponentAtNode(document.getElementById(CONTEXT_INVALIDATED_ID) as HTMLElement);
    };

    const handleReload = () => {
        window.location.reload();
    };

    return (
        <div className={styles.ribbon} onClick={handleReload}>
            Extension context invalidated. Click to reload
            <div className={styles.closeButton} onClick={removeRibbon}>
                ✕
            </div>
        </div>
    );
}

/**
 * This function is used to detect when the extension's context has been invalidated, and to display a ribbon in the tab
 */
export default function watchForContextInvalidation() {
    const interval = setInterval(() => {
        // this means the current tab's context has been invalidated
        if (!chrome.runtime.id) {
            clearInterval(interval);
            const div = document.createElement('div');
            div.id = CONTEXT_INVALIDATED_ID;
            document.body.appendChild(div);
            render(<ContextInvalidated />, div);
        }
    }, 1 * SECOND);
}
