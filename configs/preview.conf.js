const cwd = process.cwd()
const path = require('path')
const webpack = require('webpack')
const os = require('os')
const infos = os.networkInterfaces()
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const joinCwd = (...paths) => path.join(cwd, ...paths)
const { entry: weexEntries } = require('./weex.conf')
const isDevelopment = process.env.NODE_ENV === 'development'

const getIPv4 = () => {
  for(const name in infos) {
    const ipv4 = infos[name].find(item => item.family === 'IPv4' && !item.internal)
    if(ipv4) {
      return ipv4.address
    }
  }
}

module.exports = {
  target: isDevelopment ? 'web' : 'browserslist',
  context: cwd,
  mode: 'development',
  entry: joinCwd('preview/index.js'),
  output: {
    clean: true,
    // path: joinCwd('preview/dist'),
    // filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.vue'],
  },
  devtool: false,
  devServer: {
    host: getIPv4(),
    contentBase: joinCwd('dist'),
    watchContentBase: false,
    // openPage: '?page=aa|bb',
    // index: 'index.html',
    compress: true, // 开启 gzip
    // bonjour: true, // 广播？
    open: false,
    // useLocalIp: true,
    hot: true,
    // port: 8080,
    // onenPage: '',
    // before: (app, server, compiler) => {},
    // after: (app, server, compiler) => {},
    // allowedHosts: [],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['vue-style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      process: {
        PAGE_NAMES: JSON.stringify(Object.keys(weexEntries)),
      },
    }),
    new HtmlWebpackPlugin({
      title: 'weex preview',
      template: joinCwd('preview/index.html'),
    }),
  ],
}
