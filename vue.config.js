module.exports = {
  devServer: {
    open: true,
    port: 8080,
    https: false,
    proxy: {
      //配置跨域
      '/api': {
        target: 'http://127.0.0.1:4010',
        secure: false,
        changOrigin: true, //允许跨域
        pathRewrite: {
          '^/api': 'http://127.0.0.1:4010'
        }
      }
    }
  },
};
