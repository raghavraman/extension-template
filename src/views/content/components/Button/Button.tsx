import React from 'react';
import { tabManagementSender } from 'src/shared/messages/TabManagementMessages';
import styles from './Button.module.scss';

export function Button(): JSX.Element {
    const handleOpenUrl = (url: string) => () => {
        tabManagementSender.openNewTab({ url });
    };

    return (
        <button className={styles.button} onClick={handleOpenUrl('https://www.google.com')}>
            Click me
        </button>
    );
}
