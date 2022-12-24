import React from 'react';
import { render } from 'react-dom';
import { tabManagementSender } from 'src/shared/messages/TabMessages';

import styles from './test.module.scss';

export function Button() {
    const handleOpenUrl = (url: string) => () => {
        tabManagementSender.openNewTab({ url });
        tabManagementSender.storeValue({ num: Math.random() * 100 });
    };

    return (
        <button className={styles.button} onClick={handleOpenUrl('https://www.google.com')}>
            Click me
        </button>
    );
}

tabManagementSender.getTabId();

const div = document.createElement('div');
div.id = 'root';

document.body.appendChild(div);

render(<Button />, div);
