const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const Webpack = require('webpack')

//webpack 配置文件
module.exports = {
  //起的一个mock server
  devServer: {
    //server路径
    contentBase:'./dist',
    open:true,
    port:8001,
    hot:true,

  },
  entry: {
    main: './src/test.js',
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },

    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new CleanWebpackPlugin(),
    new Webpack.HotModuleReplacementPlugin(),
  ],
  optimization: {
    //标记模块是否被使用
    usedExports: true,
  }

}
