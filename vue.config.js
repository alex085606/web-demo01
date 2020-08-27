module.exports = {
  devServer: {
    // 自定义端口号 3000
    port: 3000,
    // 自动打开浏览器
    open: true
  },
  configureWebpack: {
    externals: {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
      moment: 'moment',
      axios: 'axios'
    }
  }
}
