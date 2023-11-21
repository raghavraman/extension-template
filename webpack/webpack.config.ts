import { Configuration, EntryObject } from 'webpack';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import { moduleResolutionPlugins } from './plugins/moduleResolutionPlugins';
import loaders from './loaders';
import { getBuildPlugins } from './plugins/buildProcessPlugins';

const ALL_ENTRIES = {
    content: {
        path: [path.resolve('src/foreground')],
        mode: ['production', 'development'],
        addDevtools: true,
    },
    background: {
        path: [path.resolve('src/background/background.ts')],
        mode: ['production', 'development'],
    },
    popup: {
        path: [path.resolve('src/foreground')],
        mode: ['production', 'development'],
        generateHTML: true,
        addDevtools: true,
    },
    debugPage: {
        path: [path.resolve('src/debug')],
        mode: ['development'],
        generateHTML: true,
        addDevtools: true,
    },
} satisfies Record<string, ExtensionEntry>;

/**
 * This function will generate the webpack configuration for the extension
 * @param mode the mode that webpack is running in (development or production)
 * * @param manifest the manifest.json object for the extension
 * @returns the webpack configuration
 */
export default function config(mode: Environment, manifest: chrome.runtime.ManifestV3): Configuration {
    const outDirectory = path.resolve('build');

    const ENTRIES_TO_BUILD = Object.keys(ALL_ENTRIES)
        .filter(entryId => ALL_ENTRIES[entryId].mode.includes(mode))
        .reduce((acc: Partial<typeof ALL_ENTRIES>, entryId) => {
            const entry = ALL_ENTRIES[entryId] as ExtensionEntry;
            if (entry.addDevtools) {
                // add react-devtools to the beginning of the js path (so it loads before react)
                entry.path.unshift(path.resolve('src/debug/reactDevtools'));
            }
            acc[entryId] = entry;
            return acc;
        }, {});

    /** @see https://webpack.js.org/configuration for documentation */
    const config: Configuration = {
        mode,
        devtool: mode === 'development' ? 'cheap-module-source-map' : undefined,
        bail: true,
        cache: true,
        // entry and resolve is what webpack uses for figuring out where to start bundling and how to resolve modules
        entry: Object.keys(ENTRIES_TO_BUILD).reduce((acc: EntryObject, entryId) => {
            const entry = ENTRIES_TO_BUILD[entryId] as ExtensionEntry;
            acc[entryId] = entry.path;
            return acc;
        }, {}),
        resolve: {
            modules: ['node_modules'],
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            plugins: moduleResolutionPlugins,
            // this is to polyfill some node-only modules
            fallback: {
                crypto: 'crypto-browserify',
                stream: 'stream-browserify',
                buffer: 'buffer',
                fs: false,
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
            publicPath: '/',
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
        plugins: getBuildPlugins(mode, ENTRIES_TO_BUILD, manifest),
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
