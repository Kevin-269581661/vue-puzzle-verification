/**
 * gray 预生产环境 - 配置文件
 */

const envDataConfig = {
  /**
   * 请求路径
   */
  // baseURL: '',

  // 微信扫码登录配置
  wxScanLoginConfig: {
    appId: 'wx8fd14a2e14e7a6cf',
    redirectUri: `https://beta-app-h5.qinlinkeji.com/wxScanLoginRedirect/index.html`,
    redirectOrigin: `https://beta-app-h5.qinlinkeji.com`
  }
}

export default envDataConfig
