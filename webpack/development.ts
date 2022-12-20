import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import path from 'path';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import config from './webpack.config';
import { version } from '../package.json';
import { getManifest } from './manifest.config';

const HOT_RELOAD_PORT = 9090;
const MODE: Environment = 'production';

const manifest = getManifest(MODE, version);
const compiler = webpack(config(MODE, manifest));

const server = new WebpackDevServer(
    {
        port: HOT_RELOAD_PORT,
        https: false,
        hot: false,
        client: false,
        host: 'localhost',
        static: {
            directory: path.resolve('build'),
        },
        devMiddleware: {
            writeToDisk: true,
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        allowedHosts: 'all',
        watchFiles: {
            paths: ['src/**/*.{ts,tsx,js,jsx,html,css,scss,json,md,png,jpg,jpeg,gif,svg}'],
        },
    },
    compiler
);
