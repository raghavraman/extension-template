import React from 'react';
import { backgroundMessenger } from 'src/shared/messages';
import styles from './Button.module.scss';

export function Button(): JSX.Element {
    const handleOpenUrl = (url: string) => () => {
        backgroundMessenger.openNewTab({ url });
    };

    return (
        <button className={styles.button} onClick={handleOpenUrl('https://www.google.com')}>
            Click me
        </button>
    );
}
