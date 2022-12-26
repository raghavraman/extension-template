/* eslint-disable no-template-curly-in-string */

// Thank you ben limmer for this config
// https://github.com/blimmer/semantic-release-demo-2/blob/main/release.config.js

export default {
    branches: [
        'production',
        {
            name: 'preview',
            channel: 'alpha',
            prerelease: 'alpha',
        },
    ],
    plugins: [
        [
            '@semantic-release/commit-analyzer',
            {
                preset: 'conventionalcommits',
            },
        ],
        [
            '@semantic-release/release-notes-generator',
            {
                preset: 'conventionalcommits',
            },
        ],
        [
            '@semantic-release/exec',
            {
                prepareCmd: 'RELEASE_VERSION=${nextRelease.version} npm run build',
            },
        ],
        [
            '@semantic-release/github',
            {
                assets: 'dist/**/artifacts/*.*',
                failComment: false,
            },
        ],
    ],
};
