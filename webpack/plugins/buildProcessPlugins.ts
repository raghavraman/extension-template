import path from 'path';
import { CleanPlugin, webpack, WebpackPluginInstance } from 'webpack';
import CreateFileWebpack from 'create-file-webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export function getBuildPlugins(mode: Environment, manifest: chrome.runtime.ManifestV3) {
    let plugins: WebpackPluginInstance[] = [];

    // clean the build directory before each build
    plugins.push(new CleanPlugin());

    // write the manifest.json file to the build directory
    plugins.push(
        new CreateFileWebpack({
            path: path.resolve('build'),
            fileName: 'manifest.json',
            content: JSON.stringify(manifest, null, 2),
        })
    );

    // copy the public directory to the build directory, but only copy the icons for the current mode
    plugins.push(
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve('public'),
                    filter: path => (path.includes('icons') ? path.includes(mode) : true),
                },
            ],
        })
    );
}
