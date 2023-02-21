import React from 'react';
import { render } from 'react-dom';
import { bMessenger } from 'src/shared/messages';
import { ContextInvalidated, onContextInvalidated } from 'chrome-extension-toolkit';
import { Button } from './components/Button/Button';

const root = document.createElement('div');
root.id = 'root';

document.body.appendChild(root);

console.log('content script');

bMessenger.getTabId().then(tabId => {
    console.log('tabId', tabId);
});

render(<Button />, root);

if (process.env.NODE_ENV === 'development') {
    onContextInvalidated(() => {
        const div = document.createElement('div');
        div.id = 'context-invalidated-container';
        document.body.appendChild(div);
        render(<ContextInvalidated color='black' backgroundColor='orange' />, div);
    });
}
