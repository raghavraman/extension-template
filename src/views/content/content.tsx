import React from 'react';
import { render } from 'react-dom';
import { tabManagementSender } from 'src/shared/messages/TabMessages';
import { Button } from './components/Button/Button';
import watchForContextInvalidation from './components/ContextInvalidated';

tabManagementSender.getTabId();

const div = document.createElement('div');
div.id = 'root';

document.body.appendChild(div);

render(<Button />, div);

if (process.env.NODE_ENV === 'development') {
    watchForContextInvalidation();
}
