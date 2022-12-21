import io from 'socket.io-client';

export const HOT_RELOADING_WHITELIST = [
    'youtube.com',
    'twitch.tv',
    'github.dev',
    'figma.com',
    'netflix.com',
    'disneyplus.com',
    'hbomax.com',
    'spotify.com',
    'localhost:6006',
    'docs.google.com',
    'reddit.com',
    'gmail.com',
    'ibotta.atlassian.net',
    'photopea.com',
    'app.bugsnag.com',
];

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
        chrome.runtime.reload();
    });
}
