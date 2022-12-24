import io from 'socket.io-client';

// if we're not in puppeteer, connect to the socket server
if (!navigator.webdriver) {
    const socket = io('http://localhost:9090');
    let reBuilding = false;

    socket.on('disconnect', async reason => {
        reBuilding = reason.includes('transport') && !reason.includes('client');
    });

    socket.onAny(args => {
        console.log(args);
    });

    socket.on('connect', async () => {
        if (!reBuilding) {
            console.log('%c[hot-reloading] listening for changes...', 'color:white; background-color: #E91652;');
        } else {
            console.log(
                '%c[hot-reloading] changes detected, rebuilding and refreshing...',
                'color:white; background-color: #E91652;'
            );
        }
    });

    socket.on('reload', async () => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs?.[0]?.id) {
                chrome.tabs.reload(tabs[0].id);
                chrome.runtime.reload();
            }
        });
    });
}
