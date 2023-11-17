import React from 'react';
import { background } from 'src/shared/messages';
import { Button } from './common/Button/Button';
import ExtensionRoot from './common/ExtensionRoot/ExtensionRoot';

export default function PopupMain() {
    // TODO: Add a button to to switch the active schedule

    const onClick = () => {
        background.openNewTab({
            url: 'https://google.com',
        });
    };

    return (
        <ExtensionRoot>
            <Button onClick={onClick}>Go to Google</Button>
        </ExtensionRoot>
    );
}
