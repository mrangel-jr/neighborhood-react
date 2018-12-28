const  path = require("path"),
        webpack = require("webpack"),
        HtmlWebPackPlugin = require("html-webpack-plugin"),
        MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development",
    context: __dirname,
    entry: [
        path.resolve(__dirname,"src/js/index.js")
    ],
    output: {
        path: path.resolve(__dirname,"dist"),
        publicPath: "/",
        filename: "js/bundle.js", 
    },
    module: {
        rules: [
            {
                "test": /\.scss$/,
                "loader": ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                    loader: "html-loader",
                    options: { minimize: true }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ]
    },
    "devServer": {
        "historyApiFallback": true,
        "host": 'localhost',
        "port": 8080,
        "stats": "minimal",
        "disableHostCheck": true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebPackPlugin({
            "template": "./src/index.html",
            "filename": "./index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ]
};