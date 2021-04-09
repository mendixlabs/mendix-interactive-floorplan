const merge = require("webpack-merge");
const webpack = require("webpack");
const path = require("path");
const pkg = require('./package.json');

const args = process.argv.slice(2);

const baseConfig = require("./node_modules/@mendix/pluggable-widgets-tools/configs/webpack.config.prod.js");

const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const customConfig = {
    // Custom configuration goes here
    devtool: false,
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                extractComments: false,
                terserOptions: {
                    ecma: undefined,
                    warnings: false,
                    sourceMap: false,
                    parse: {},
                    compress: {
                        passes: 2
                    },
                    mangle: true,
                    module: false,
                    output: {
                        comments: false,
                        beautify: false,
                        preamble: `/* Scheduler Widget || Version ${pkg.version} || Apache 2 LICENSE || Developer: ${pkg.author} || Please report any issues here: https://github.com/JelteMX/mendix-scheduler-widget/issues */\n`
                    },
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: undefined,
                    keep_fnames: false,
                    safari10: false
                },
            }),
          ]
    },
    plugins: [
    ],
    // We add this to further slim down the package
    resolve: {

    }
};

if (args.includes("--analyze")) {
    customConfig.plugins.push(new BundleAnalyzerPlugin());
}

const previewConfig = {
    // Custom configuration goes here
    // devtool: "source-map"
    plugins: [

    ],
    resolve: {

    }
};

module.exports = [merge(baseConfig[0], customConfig), merge(baseConfig[1], previewConfig)];
