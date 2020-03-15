const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssets = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports =  (env, options)=> {

    const devMode = options.mode === 'development' ? true : false;

    return {
        entry: {
            common: path.resolve(__dirname, "./src/pages/index.tsx"),
            overview: path.resolve(__dirname, "./src/pages/Overview/index.tsx"),
            browse: path.resolve(__dirname, "./src/pages/Browse/index.tsx"),
            issues: path.resolve(__dirname, "./src/pages/Issues/index.tsx"),
            resources: path.resolve(__dirname, "./src/pages/Resources/index.tsx"),
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: '[name].[contenthash].js',
            // chunkFilename: '[name].[contenthash].js',
        },
        devtool: 'source-map',
        resolve: {
            extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    loader: 'ts-loader'
                },
                {
                    test: /\.s?[ac]ss$/,
                    use: [
                        devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader", options: {
                                sourceMap: true
                            }
                        }, {
                            loader: 'resolve-url-loader',
                        }, {
                            loader: "sass-loader", options: {
                                sourceMap: true
                            }
                        }
                    ]
                },
                { test: /\.woff$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
                { test: /\.ttf$/,  loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
                { test: /\.eot$/,  loader: "file-loader" },
                { 
                    test: /\.svg$/,  
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        fallback: {
                            loader: "file-loader"
                        }
                    }
                },
                {   
                    test: /\.(png|jpg|gif)$/,  
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        fallback: {
                            loader: "file-loader"
                        }
                    }
                },
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: devMode ? '[name].css' : '[name].[contenthash].css',
                chunkFilename: devMode ? '[name].css' : '[name].[contenthash].css',
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, './src/layouts/index.html'),
                filename: 'index.html',
                chunks: []
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, './src/layouts/site.layout.html'),
                filename: 'overview/index.html',
                chunks: ['common', 'overview'],
                minify: {
                    html5                          : true,
                    collapseWhitespace             : true,
                    minifyCSS                      : true,
                    minifyJS                       : true,
                    minifyURLs                     : false,
                    removeComments                 : true,
                    removeEmptyAttributes          : true,
                    removeOptionalTags             : true,
                    removeRedundantAttributes      : true,
                    removeScriptTypeAttributes     : true,
                    removeStyleLinkTypeAttributese : true,
                    useShortDoctype                : true
                }
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, './src/layouts/site.layout.html'),
                filename: 'browse/index.html',
                chunks: ['common', 'browse'],
                minify: {
                    html5                          : true,
                    collapseWhitespace             : true,
                    minifyCSS                      : true,
                    minifyJS                       : true,
                    minifyURLs                     : false,
                    removeComments                 : true,
                    removeEmptyAttributes          : true,
                    removeOptionalTags             : true,
                    removeRedundantAttributes      : true,
                    removeScriptTypeAttributes     : true,
                    removeStyleLinkTypeAttributese : true,
                    useShortDoctype                : true
                }
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, './src/layouts/site.layout.html'),
                filename: 'issues/index.html',
                chunks: ['common', 'issues'],
                minify: {
                    html5                          : true,
                    collapseWhitespace             : true,
                    minifyCSS                      : true,
                    minifyJS                       : true,
                    minifyURLs                     : false,
                    removeComments                 : true,
                    removeEmptyAttributes          : true,
                    removeOptionalTags             : true,
                    removeRedundantAttributes      : true,
                    removeScriptTypeAttributes     : true,
                    removeStyleLinkTypeAttributese : true,
                    useShortDoctype                : true
                }
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, './src/layouts/site.layout.html'),
                filename: 'resources/index.html',
                chunks: ['common', 'resources'],
                minify: {
                    html5                          : true,
                    collapseWhitespace             : true,
                    minifyCSS                      : true,
                    minifyJS                       : true,
                    minifyURLs                     : false,
                    removeComments                 : true,
                    removeEmptyAttributes          : true,
                    removeOptionalTags             : true,
                    removeRedundantAttributes      : true,
                    removeScriptTypeAttributes     : true,
                    removeStyleLinkTypeAttributese : true,
                    useShortDoctype                : true
                }
            }),
            new CleanWebpackPlugin()
        ],
        optimization: {
            minimizer: [
                new TerserPlugin({
                    extractComments: true,
                    terserOptions: {
                        compress: {
                            drop_console: true,
                        }
                    }
                }), 
                new OptimizeCSSAssets({})
            ]
        },
    }

};