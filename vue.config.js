const path = require('path')

function resolve (dir) {
  return path.join(__dirname, './', dir)
}


module.exports = {
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)))
    config.plugin('define').tap(args => {
        const argv = process.argv
        const icourt = argv[argv.indexOf('--icourt-mode') + 1]

        args[0]['process.env'].MODE = `"${icourt}"`

        return args
    })
    // svg rule loader
    const svgRule = config.module.rule('svg') // 找到svg-loader
    svgRule.uses.clear() // 清除已有的loader, 如果不这样做会添加在此loader之后
    svgRule.exclude.add(/node_modules/) // 正则匹配排除node_modules目录
    svgRule // 添加svg新的loader处理
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
    // 修改images loader 添加svg处理
    const imagesRule = config.module.rule('images')
    imagesRule.exclude.add(resolve('src/icons'))
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
  },
  configureWebpack: {
    devServer: {
      open: true,
      // https: true,
      proxy: {
        '/user': {
          target: 'https://devadminschool.icourt.cc',
        },
        '/live': {
          target: 'https://devadminschool.icourt.cc',
        },
      },
    },
  },
  devServer: {
    port: 3303,     // 端口
  },
};

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/style/global.styl'),
      ],
    })
}
