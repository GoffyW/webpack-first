//webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const config = require('./public/config')[isDev ? 'dev' : 'build'];
const  path = require('path');
const {CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
//const merge = require('webpack-merge');
const apiMocker = require('mocker-api');


module.exports = {
    module: {
        rules: [
            //css样式
            {
                test: /\.(le|c)ss$/,
                use: ['style-loader', 'css-loader', { // 'style-loader'动态创建style标签，将css插入到Header中、'css-loader'负责处理@import等语句
                    loader: 'postcss-loader', // postcss-loader 和 autoprefixer，自动生成浏览器兼容性前缀 —— 2020了，应该没人去自己徒手去写浏览器前缀了吧
                    options: {
                        plugins: function () {
                            return [
                                require('autoprefixer')({
                                    "overrideBrowserslist": [
                                        ">0.25%",
                                        "not dead"
                                    ]
                                })
                            ]
                        }
                    }
                }, 'less-loader'], // less-loader 负责处理编译 .less 文件,将其转为 css
                exclude: /node_modules/
            },
            //静态文件
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10240,
                            esModule: false,
                            outputPath: 'assets'
                        }
                    }
                ],
                exclude: /node_modules/
            },
            //抽离css
            {
                test: /\.(le|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,//替换之间的style-loader
                    'css-loader',{
                        loader: "postcss-loader",
                        options: {
                            plugins: function () {
                                return[
                                    require('autoprefixer')()
                                ]
                            }
                        }
                    },'less-loader'
                ],
                exclude: /node_modules/
            }
        ]
    },
    //...
    mode: isDev ? 'development' : 'production',
    plugins: [
        /*new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html', //打包后的文件名
            config: config.template
        }),*/
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: 'public/js/*.js',
                to: path.resolve(__dirname, 'dist', 'js'),
                flatten: true
            }
        ],{
            ignore: ['other.js']
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            publicPath: '../'
        }),
        new OptimizeCssPlugin(),
        new webpack.HotModuleReplacementPlugin(), //热更新插件
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "index.html", //打包后的文件名
            config: config.template,
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            template: "./public/login.html",
            filename: "login.html", //打包后的文件名
            chunks: ['login']
        }),
        //定义环境变量
        new webpack.DefinePlugin({
            DEV: JSON.stringify('dev'), //字符串
            FLAG: 'true' //FLAG 是个布尔类型
        })
    ],
    devServer: {
        port: '3000', //默认是8080
        quiet: false, //默认不启用
        inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
        stats: "errors-only", //终端仅打印 error
        overlay: false, //默认不启用
        clientLogLevel: "silent", //日志等级
        compress: true, //是否启用 gzip 压缩
        hot: true, //是否启用热更新
        /*proxy: {
            "/api": {
                target: "http://localhost:4000",
                pathRewrite: {
                    '/api' : ''
                }
            }
        },*/
        before(app){
            apiMocker(app,path.resolve('./src/mock/mocker.js'))
        }
    },
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),// 必须是绝对路径
        filename: "[name].[hash:6].js"
        //publicPath: "/" //通常是CDN路径


    }

}
