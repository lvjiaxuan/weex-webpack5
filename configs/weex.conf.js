const cwd = process.cwd()
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const tempPath = path.join(cwd, '.temp')
const joinCwd = (...paths) => path.join(cwd, ...paths)
const TerserPlugin = require('terser-webpack-plugin')
const isDevelopment = process.env.NODE_ENV === 'development'

const outputFile = (filenamePath, content, force = false) => {
  if (fs.existsSync(filenamePath) && force) {
    fs.writeFileSync(filenamePath, content)
  } else {
    fs.mkdirSync(path.parse(filenamePath).dir, { recursive: true })
    fs.writeFileSync(filenamePath, content)
  }
}

const getWeexEntries = () =>
  fs.readdirSync(joinCwd('src/views')).reduce((acc, file) => {
    const filePath = joinCwd('src/views', file)
    const stat = fs.statSync(filePath)
    let appPath = ''
    if (stat.isDirectory() && !acc[file]) {
      // !acc[file] 要放后面
      const subPath = joinCwd('src/views', file)
      const subFiles = fs.readdirSync(subPath)
      if (!subFiles.length) return
      if (subFiles.includes('index.vue')) {
        appPath = path.join(subPath, 'index.vue')
      } else if (subFiles.includes(file + '.vue')) {
        appPath = path.join(subPath, file + '.vue')
      } else {
        appPath = subFiles[0]
      }
      acc[file] = path.join(tempPath, file + '.js')
    } else if (path.extname(file) === '.vue') {
      appPath = filePath
      acc[file.replace('.vue', '')] = path.join(tempPath, file.replace('.vue', '.js'))
    }

    // write entry js files
    const entryPath = acc[file] || acc[file.replace('.vue', '')]
    if (appPath && entryPath) {
      // const appPath = acc[file] || acc[file.replace('.vue', '')]
      const viewPath = joinCwd('src/views')

      const content = `
      import App from '@/views/${path
        .relative(viewPath, appPath)
        .replace(/\\/g, '/')
        .replace('.vue', '')}'
      import plugin from '@/views-plugin'
      Vue.use(plugin)
      new Vue({ render: h => h(App) }).$mount('#root')
    `
      outputFile(entryPath, content)
    }
    return acc
  }, {})

module.exports = {
  mode: process.env.NODE_ENV,
  watch: isDevelopment,
  context: cwd,
  entry: getWeexEntries(),
  output: {
    clean: true,
    filename: '[name].weex.js',
    path: joinCwd('dist'),
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': joinCwd('src'),
      src: joinCwd('src'),
    },
  },
  devtool: false,
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
        loader: 'weex-vue-loader',
        // weex: npm i babel-core
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: joinCwd('dist/assets/images'),
              outputPath: './assets/images/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: '// { "framework": "Vue"} \n',
      raw: true,
    })
  ],
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    minimizer: [new TerserPlugin({
      terserOptions: {
        format: {
          comments: /framework/i,
        },
      },
      extractComments: false,
    })]
  }
}
