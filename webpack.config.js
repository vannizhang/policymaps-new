const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
// const OptimizeCSSAssets = require('optimize-css-assets-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const SiteTitle = 'Esri Maps for Public Policy';

module.exports =  (env, options)=> {

    const devMode = options.mode === 'development' ? true : false;

    return {
        entry: {
            overview: path.resolve(__dirname, "./src/pages/Overview/OverviewPage.tsx"),
            browse: path.resolve(__dirname, "./src/pages/Browse/BrowsePage.tsx"),
            issues: path.resolve(__dirname, "./src/pages/Issues/IssuesPage.tsx"),
            resources: path.resolve(__dirname, "./src/pages/Resources/ResourcesPage.tsx"),
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: '[name].[contenthash].js',
            // publicPath: '/'
            // chunkFilename: '[name].[contenthash].js',
            clean: true
        },
        devtool: 'source-map',
        resolve: {
            extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    loader: 'babel-loader'
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
                {   
                    test: /\.(woff|ttf|eot)$/,  
                    loader: "file-loader",
                    options: {
                        name: '[hash].[ext]',
                        outputPath: (url, resourcePath, context) => {
                            return `static/font/${url}`;
                        },
                        publicPath: function(url) {
                            return '../static/font/' + url;
                        },
                    }
                },
                { 
                    test: /\.svg$/,  
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        fallback: {
                            loader: "file-loader",
                            options: {
                                name: "[hash].[ext]",
                                outputPath: (url, resourcePath, context) => {
                                    return `static/svg/${url}`;
                                },
                                publicPath: function(url) {
                                    return '../static/svg/' + url;
                                },
                            }
                        }
                    }
                },
                {   
                    test: /\.(png|jpg|gif)$/,  
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        fallback: {
                            loader: "file-loader",
                            options: {
                                name: '[hash].[ext]',
                                outputPath: (url, resourcePath, context) => {
                                    return `static/img/${url}`;
                                },
                                publicPath: function(url) {
                                    return '../static/img/' + url;
                                },
                            }
                        }
                    }
                },
            ]
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin(),
            devMode ? new CopyPlugin({
                patterns: [
                    { 
                        from: 'src/media/**/*', 
                        to: 'media/policymaps'
                    }
                ]
            }) : false,
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: devMode ? '[name].css' : './static/[name].[contenthash].css',
                chunkFilename: devMode ? '[name].css' : './static/[name].[contenthash].css',
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, './src/layouts/index.html'),
                filename: './index.html',
                chunks: []
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, './src/layouts/site.layout.html'),
                inject: true,
                filename: './overview/index.html',
                chunks: ['overview'],
                title: `Overview | ${SiteTitle}`,
                meta: {
                    description: 'Esri Maps for Public Policy offers maps, layers, training, and other resources to help policymakers make data-driven decisions.'
                },
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
                inject: true,
                filename: './browse/index.html',
                chunks: ['browse'],
                title: `Explore | ${SiteTitle}`,
                meta: {
                    description: 'Access maps and analysis that act as the baseline for your research and policy decisions'
                },
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
                inject: true,
                filename: './issues/index.html',
                chunks: ['issues'],
                title: `Issues | ${SiteTitle}`,
                meta: {
                    description: 'Browse the curated datasets on major topics including economic opportunity, social equity, health, sustainability, and more'
                },
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
                inject: true,
                filename: './resources/index.html',
                chunks: ['resources'],
                title: `Resources | ${SiteTitle}`,
                meta: {
                    description: 'Get education, training, and best practices that help raise your data literacy'
                },
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
            // !devMode ? new CleanWebpackPlugin() : false,
            // !devMode ? new BundleAnalyzerPlugin() : false
        ].filter(Boolean),
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
                // new OptimizeCSSAssets({})
            ]
        },
    }

};