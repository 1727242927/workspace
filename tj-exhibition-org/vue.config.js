const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const dayjs = require('dayjs')
const date = dayjs().format('YYYY-MM-DD')
const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
module.exports = {
  publicPath: '/',
  outputDir: 'home',
  productionSourceMap: false,
  devServer: {
    port: 8087,
    proxy: {
      '/tj-exhibition': {
        // 开发和测试使用使用
        target: 'http://1.119.141.243:48081',
        changeOrigin: true,
        pathRewrite: {
          '^/tj-exhibition': '/tj-exhibition'
        }
      },
      '/ai': {
        target: 'https://ai.exporegist.com',
        changeOrigin: true,
        pathRewrite: {
          '^/ai': ''
        }
      }
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      if (process.env.ANALYZE) {
        config.plugins.push(new WebpackBundleAnalyzer())
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#1DA57A'
          },
          javascriptEnabled: true
        }
      }
    }
  }
}
