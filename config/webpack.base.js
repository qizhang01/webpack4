const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./config');

const APP_PATH = path.resolve(__dirname, '../src');

// const bundleAnalyzerReport = argv.report;

const webpackConfig = {
    plugins: []
};
// if (bundleAnalyzerReport) {
//     webpackConfig.plugins.push(new BundleAnalyzerPlugin({
//         analyzerMode: 'static',
//         openAnalyzer: false,
//         reportFilename: path.join(config.assetsRoot, './report.html')
//     }));
// }

module.exports = merge(webpackConfig, {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        app: './src/index.tsx',
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: config.assetsRoot,
    },
    module: {
        noParse: '/jquery|lodash/',  // 不去解析三方库
        rules: [
            // 把这个配置放在所有loader之前
            {
                enforce: 'pre',
                test: /\.tsx?$/,
                exclude: /node_modules/,
                include: [APP_PATH],
                loader: 'eslint-loader',
                options: {
                    emitWarning: true, // 这个配置需要打开，才能在控制台输出warning信息
                    emitError: true, // 这个配置需要打开，才能在控制台输出error信息
                    fix: true // 是否自动修复，如果是，每次保存时会自动修复可以修复的部分
                }
            },
            {
                oneOf: [
                    {
                        test: /\.(html)$/,
                        loader: 'html-loader'
                    },
                    {
                        test: /\.(j|t)sx?$/,
                        include: APP_PATH,
                        use: [
                            {
                                loader: 'babel-loader',
                                options: {
                                    presets: [
                                        '@babel/preset-react',  // jsx支持
                                        ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 2 }] // 按需使用polyfill
                                    ],
                                    plugins: [
                                        '@babel/plugin-syntax-dynamic-import',
                                        ["@babel/plugin-proposal-private-methods", { "loose": true }],
                                        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
                                        ['@babel/plugin-proposal-class-properties', { 'loose': true }] // class中的箭头函数中的this指向组件
                                    ],
                                    cacheDirectory: true // 加快编译速度
                                }
                            },
                            {
                                loader: 'awesome-typescript-loader',
                                options: {
                                    silent: true
                                }
                            }
                        ]
                    },
                    {
                        test: /\.(less|css)$/,
                        use: [
                            { loader: 'style-loader' },
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: false
                                }
                            },
                            'postcss-loader',
                            {
                                loader: 'less-loader',
                                options: { javascriptEnabled: true }
                            }
                        ]
                    },
                    {
                        test: /\.svg$/,
                        use: ['@svgr/webpack']
                    },
                    {
                        test: /\.(jpg|jpeg|bmp|png|webp|gif)$/,
                        loader: 'url-loader',
                        options: {
                            limit: 6 * 1024,
                            name: 'static/media/[name].[hash:8].[ext]',
                        }
                    },
                    {
                        exclude: [/\.(js|mjs|ts|tsx|less|css|jsx)$/, /\.html$/, /\.json$/],
                        loader: 'file-loader',
                        options: {
                            name: 'static/media/[path][name].[hash:8].[ext]',
                        }
                    },
                    {
                        test: /\.(jpe?g|png|gif|svg)$/,
                        loader: 'image-webpack-loader',
                        enforce: "pre"
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
        alias: {
            '@': path.resolve(__dirname, '../src/')
        }
    },
    plugins: [
        // 清理打包目录
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            template: config.indexPath,
            showErrors: true
        }),

        // 在html模板中能够使用环境变量
        // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
        new InterpolateHtmlPlugin({ PUBLIC_URL: "/" }),
        // 在js代码中能够使用环境变量(demo: process.env.NODE_ENV === 'production')
        // new webpack.DefinePlugin(env.stringified),
        // 忽略moment的国际化库
        // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
        new CopyWebpackPlugin([
            {
                from: 'public',
                ignore: ['index.html']
            }
        ]),
        new webpack.DllReferencePlugin({
            manifest: require('../public/vendor.json')
        })
    ],
    optimization: {}
});
