const cwd = process.cwd()
const webpack = require('webpack')
const ZipPlugin = require('zip-webpack-plugin')
const weexConfig = require('./weex.conf')
const previewConfig = require('./preview.conf')
const isDevelopment = process.env.NODE_ENV === 'development'

isDevelopment &&
  webpack(weexConfig, (err, stats) => {
    if (err) {
      console.error(1, err.stack || err)
      if (err.details) {
        console.error(2, err.details)
      }
      return
    }

    const info = stats.toJson()

    if (stats.hasErrors()) {
      console.error(3, info.errors)
    }

    if (stats.hasWarnings()) {
      console.warn(4, info.errors)
    }

    console.log('weex startTime', stats.startTime)
    console.log('weex   endTime', stats.endTime)
    console.log('     spentTime', stats.endTime - stats.startTime)
  })

module.exports = isDevelopment
  ? previewConfig
  : env => {
      const now = new Date()
      weexConfig.plugins.push(
        new ZipPlugin({
          path: cwd,
          filename: `${env.code}_${
            now.getFullYear().toString() +
            (now.getMonth() + 1).toString().padStart(2, 0) +
            now.getDate().toString().padStart(2, 0) +
            now.getHours().toString().padStart(2, 0) +
            now.getMinutes().toString().padStart(2, 0)
          }`,
          pathPrefix: env.code,
        })
      )
      return weexConfig
    }
