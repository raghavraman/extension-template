import React from 'react';
import { render } from 'react-dom';
import { bMessenger } from 'src/shared/messages';
import { Button } from './components/Button/Button';
import watchForContextInvalidation from './components/ContextInvalidated';

const div = document.createElement('div');
div.id = 'root';

document.body.appendChild(div);

console.log('content script');

bMessenger.getTabId(undefined).then(tabId => {
    console.log('tabId', tabId);
});

render(<Button />, div);

if (process.env.NODE_ENV === 'development') {
    watchForContextInvalidation();
}
