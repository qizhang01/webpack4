const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const config = require('./config');

const productionGzipExtensions = ['js', 'css'];

module.exports = merge.smart(baseWebpackConfig, {
    mode: 'production',
    devtool: 'none',
    output: {
        filename: 'js/[name].[contenthash:8].js',
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.(less|css)$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: 'css-loader',
                            },
                            'postcss-loader',
                            {
                                loader: 'less-loader',
                                options: {
                                    javascriptEnabled: true,
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    plugins: [
        // 清理打包目录
        new CleanWebpackPlugin(),
        new PreloadWebpackPlugin({
            rel: 'preload',
            as(entry) {
                if (/\.css$/.test(entry)) return 'style';
                if (/\.woff$/.test(entry)) return 'font';
                if (/\.png$/.test(entry)) return 'image';
                return 'script';
            },
            include: ['app']
            // include:'allChunks'
        }),
        // 处理html
        new HtmlWebpackPlugin({
            template: config.indexPath,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeOptionalTags: false,
                removeEmptyAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeAttributeQuotes: true,
                removeCommentsFromCDATA: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css'
            // chunkFilename: '[name].[contenthash:8].chunk.css'
        }),
        // 静态压缩，需要在Nginx配置支持gzip
        new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
            threshold: 10240,
            minRatio: 0.8,
            // exclude: ['vendor.dll.js']
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            minChunks: 2,
            maxInitialRequests: 5,
            cacheGroups: {
                // 提取公共模块
                commons: {
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]/,
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0,
                    name: 'common'
                }
            }
        },
        minimizer: [
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: true ? { map: { inline: false } } : {}
            }),
            new TerserPlugin({
                sourceMap: config.productionJsSourceMap
            })
        ]
    }
});

