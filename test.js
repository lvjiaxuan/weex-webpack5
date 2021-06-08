const path = require('path')
const cwd = process.cwd()
const tempPath = path.join(cwd, '.temp')
const fs = require('fs')

const joinCwd = (...paths) => path.join(cwd, ...paths)

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
      import plugin from '@/views/views-plugin'
      Vue.use(plugin)
      new Vue({ render: h => h(App) }).$mount('#root')
    `
      outputFile(entryPath, content)
    }
    return acc
  }, {})

console.log(getWeexEntries())
