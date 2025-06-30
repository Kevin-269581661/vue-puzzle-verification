/**
 * dev 开发环境 - 配置文件
 */

const envDataConfig = {
  /**
   * 请求路径（不配置默认走代理）
   */
  // baseURL: '/localApi',
  // baseURL: '',

  // 微信扫码登录配置
  wxScanLoginConfig: {
    appId: 'wx381e9182f8e4fbdd',
    redirectUri: `https://test-app-h5.qinlinkeji.com/wxScanLoginRedirect/index.html`,
    redirectOrigin: `https://test-app-h5.qinlinkeji.com`,
  },

  cozeWebSDKConfig: {
    botId: '7486328930060845067',
    botName: '小范',
    token: 'pat_dFcWUklireIMJBvfSdSRUlM8XuoiqzdxJcES9M1kP2hDau2yTkco66VKKnLpt3jl',
    botAvatar: 'https://crm-1256017579.cos.ap-guangzhou.myqcloud.com/crm/icon/ai_photo.gif',
    cozeStoreLink: 'https://test-app-h5.qinlinkeji.com/cozeStoreDesc/index.html'
  },
}

export default envDataConfig
