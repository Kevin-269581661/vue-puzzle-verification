/**
 * 通用配置文件
 */

import devConfig from './settings.dev'
import testConfig from './settings.test'
import grayConfig from './settings.gray'
import prodConfig from './settings.prod'

const ENV = process.env.NODE_ENV
console.log('Vite 当前项目运行环境为 === ', ENV)

const envConfig = {
  development: devConfig,
  testing: testConfig,
  graying: grayConfig,
  production: prodConfig
}

const settings = {
  ...envConfig[ENV],
  // 登录勾选协议链接
  loginAgreement: {
    name: '亲邻科技运营服务协议',
    url: 'https://guanwang-1256017579.cos.ap-guangzhou.myqcloud.com/%E4%BA%B2%E9%82%BB%E7%A7%91%E6%8A%80%E8%BF%90%E8%90%A5%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE.htm'
  }
}

export default settings
