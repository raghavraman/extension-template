import webpack from 'webpack';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import config from './webpack.config';
import { info, success } from './utils/chalk';
import { getManifest } from './manifest.config';
import packageJson from '../package.json';
import { convertSemver } from './utils/convertSemver';
import printBuildErrors from './utils/printBuildError';
import { zipProductionBuild } from './utils/zipProductionBuild';

const mode = process.env.NODE_ENV || 'development';

// generate the manifest.json file
const semanticVersion = process.env.SEMANTIC_VERSION || packageJson.version;
const manifestVersion = convertSemver(semanticVersion);
const manifest = getManifest(mode, manifestVersion);

console.log(info(`${manifest.name} v${manifest.version} ${mode} build starting...`));

// kick off the webpack build
webpack(config(mode, manifest), async error => {
    if (error) {
        return onBuildFailure(error);
    }
    await onBuildSuccess();
});

async function onBuildSuccess(): Promise<void> {
    // zip the output directory and put it in the artifacts directory
    const fileName = `${manifest.name}v${manifestVersion}`;
    await zipProductionBuild(fileName);
    console.log(success(`${fileName} built and zipped into build/artifacts/${fileName}.zip!`));
}

function onBuildFailure(error: Error): void {
    if (!error.message) {
        return printBuildErrors(error);
    }
    const messages = formatWebpackMessages({ errors: [error.message], warnings: [] });
    if (messages.errors.length > 1) {
        messages.errors.length = 1;
    }
    return printBuildErrors(new Error(messages.errors.join('\n\n')));
}
