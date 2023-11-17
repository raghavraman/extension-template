import React from 'react';
import { ContextInvalidated, createShadowDOM, onContextInvalidated } from 'chrome-extension-toolkit';
import render from './lib/react';
import colors from './styles/colors.module.scss';
import getSiteSupport, { SiteSupport } from './lib/getSiteSupport';
import PopupMain from './components/PopupMain';
import { Button } from './components/common/Button/Button';

const support = getSiteSupport(window.location.href);
console.log('support:', support);

// if we are in an iframe, throw an error
if (window.self !== window.top) {
    throw new Error('injected content script inside an iframe');
}

if (support === SiteSupport.EXTENSION_POPUP) {
    render(<PopupMain />, document.getElementById('root'));
}

if (support === SiteSupport.GOOGLE_SITE) {
    const shadowDom = createShadowDOM('extension-container');
    render(<Button>We are on Google</Button>, shadowDom.shadowRoot);
    shadowDom.addStyle('static/css/content.css');
}

onContextInvalidated(() => {
    const div = document.createElement('div');
    div.id = 'context-invalidated-container';
    document.body.appendChild(div);

    render(
        <ContextInvalidated fontFamily='monospace' color={colors.white} backgroundColor={colors.burnt_orange} />,
        div
    );
});
