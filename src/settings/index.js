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
}

export default settings
