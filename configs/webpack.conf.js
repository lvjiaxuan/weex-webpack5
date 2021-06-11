const cwd = process.cwd()
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const ZipPlugin = require('zip-webpack-plugin')
const weexConfig = require('./weex.conf')
const previewConfig = require('./preview.conf')
const isDevelopment = process.env.NODE_ENV === 'development'
const joinCwd = (...paths) => path.join(cwd, ...paths)

const getFormatDate = (format = 'yyyyMMddHHmmss') => {
  const now = new Date()
  return format
    .replace('yyyy', now.getFullYear().toString())
    .replace(/MM/, (now.getMonth() + 1).toString().padStart(2, 0))
    .replace('dd', now.getDate().toString().padStart(2, 0))
    .replace('HH', now.getHours().toString().padStart(2, 0))
    .replace(/mm/, now.getMinutes().toString().padStart(2, 0))
    .replace('ss', now.getSeconds().toString().padStart(2, 0))
}

if (isDevelopment) {
  let lastTime = 0
  fs.watch(joinCwd('src'), { recursive: true }, (eventType, filename) => {
    // 防抖
    const now = Date.now()
    if(now - lastTime > 1000) {
      console.log()
      console.log(getFormatDate('HH:mm:ss'), filename, eventType, 'please wait...')
    }
    lastTime = now
  })

  webpack(weexConfig, (err, stats) => {
    if (err) {
      console.error(err.stack || err)
      if (err.details) {
        console.error(err.details)
      }
      return
    }

    const info = stats.toJson()
    stats.hasErrors() && info.errors.length && console.error(info.errors)
    stats.hasWarnings() && info.errors.length && console.warn(info.errors)

    console.log(getFormatDate('HH:mm:ss'), 'weex spent time', (stats.endTime - stats.startTime) + 'ms')
  })
}

module.exports = isDevelopment
  ? previewConfig
  : env => {
      const now = new Date()
      weexConfig.plugins.push(
        new ZipPlugin({
          path: cwd,
          filename: `${env.code}_${getFormatDate('yyyyMMddHHmm')}`,
          pathPrefix: env.code,
        })
      )
      return weexConfig
    }
