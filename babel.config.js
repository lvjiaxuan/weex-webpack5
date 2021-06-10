module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    [
      'component',
      {
        libraryName: 'dolphin-weex-ui',
        libDir: 'packages',
        style: false,
      },
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3,
      },
    ],
  ],
}
