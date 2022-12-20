import { Configuration, EntryObject } from 'webpack';
import path from 'path';
import { moduleResolutionPlugins } from './plugins/moduleResolutionPlugins';
import loaders from './loaders';
import { getBuildPlugins } from './plugins/buildProcessPlugins';
import TerserPlugin from 'terser-webpack-plugin';

export interface Entries {
    content: string[];
    background: string[];
    popup: string[];
    // only used in development
    debug?: string[];
}

export type EntryId = keyof Entries;

/**
 * This function will generate the webpack configuration for the extension
 * @param mode the mode that webpack is running in (development or production)
 * * @param manifest the manifest.json object for the extension
 * @returns the webpack configuration
 */
export default function config(mode: Environment, manifest: chrome.runtime.ManifestV3): Configuration {
    const outDirectory = path.resolve('build');

    // the entry points for the extension (the files that webpack will start bundling from)
    const entry: Entries = {
        content: [path.resolve('src', 'views', 'content', 'content')],
        background: [path.resolve('src', 'background', 'background')],
        popup: [path.resolve('src', 'views', 'popup', 'popup')],
    };

    if (mode === 'development') {
        entry.debug = [path.resolve('src', 'debug')];
        // entry.content.unshift(path.resolve('src', 'reactDevToolsActiveTab'));
        // entry.popup.unshift(path.resolve('src', 'reactDevToolsActiveTab'));
    }

    const htmlEntries: EntryId[] = ['popup', 'debug'];

    /** @see https://webpack.js.org/configuration for documentation */
    const config: Configuration = {
        mode,
        devtool: mode === 'development' ? 'cheap-module-source-map' : undefined,
        bail: true,
        cache: true,
        // entry and resolve is what webpack uses for figuring out where to start bundling and how to resolve modules
        entry: entry as unknown as EntryObject,
        resolve: {
            modules: ['node_modules'],
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            plugins: moduleResolutionPlugins,
            // this is to polyfill some node-only modules
            fallback: {
                crypto: 'crypto-browserify',
                stream: 'stream-browserify',
                buffer: 'buffer',
            },
        },
        // this is where we define the loaders for different file types
        module: {
            strictExportPresence: true,
            rules: loaders,
        },
        output: {
            clean: true,
            path: outDirectory,
            pathinfo: mode === 'development',
            filename: 'static/js/[name].js',
            publicPath: path.resolve(),
            // this is for windows support (which uses backslashes in paths)
            devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
            // this is to make sure that the global chunk loading function name is unique
            chunkLoadingGlobal: `webpackJsonp${manifest.short_name}`,
            globalObject: 'this',
        },
        stats: {
            errorDetails: true,
            errorsCount: true,
        },
        // this is where we define the plugins that webpack will use
        plugins: getBuildPlugins(mode, htmlEntries, manifest),
    };

    if (mode === 'production') {
        config.optimization = {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    extractComments: false,
                    parallel: false,
                    terserOptions: {
                        compress: {
                            ecma: 2020,
                            drop_console: true,
                            drop_debugger: true,
                            comparisons: false,
                            inline: 2,
                        },
                        keep_classnames: false,
                        keep_fnames: false,
                        output: {
                            ecma: 2020,
                            comments: false,
                            ascii_only: true,
                        },
                    },
                }),
            ],
        };
    }

    return config;
}
