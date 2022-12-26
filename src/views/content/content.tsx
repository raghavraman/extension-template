import React from 'react';
import { render } from 'react-dom';
import { Button } from './components/Button/Button';
import watchForContextInvalidation from './components/ContextInvalidated';

const div = document.createElement('div');
div.id = 'root';

document.body.appendChild(div);

render(<Button />, div);

if (process.env.NODE_ENV === 'development') {
    watchForContextInvalidation();
}
