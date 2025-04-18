/**
 * prod 生产环境 - 配置文件
 */

const envDataConfig = {
  /**
   * 请求路径
   */
  // baseURL: '',

  // 微信扫码登录配置
  wxScanLoginConfig: {
    appId: 'wx381e9182f8e4fbdd',
    redirectUri: `https://test-app-h5.qinlinkeji.com/wxScanLoginRedirect/index.html`,
    redirectOrigin: `https://test-app-h5.qinlinkeji.com`
  }
}

export default envDataConfig
