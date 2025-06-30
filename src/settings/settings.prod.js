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
    appId: 'wx8fd14a2e14e7a6cf',
    redirectUri: `https://app-h5.qinlinkeji.com/wxScanLoginRedirect/index.html`,
    redirectOrigin: `https://app-h5.qinlinkeji.com`
  },

  cozeWebSDKConfig: {
    botId: '7485580213435613194',
    botName: '小范',
    token: 'pat_MGsNc5zOfgGHLxoub1SFeqgYufIvdkhX221xw5vA1XkRVntnfCFZ1B7pnQEI4nHT',
    botAvatar: 'https://crm-1256017579.cos.ap-guangzhou.myqcloud.com/crm/icon/ai_photo.gif',
    cozeStoreLink: 'https://app-h5.qinlinkeji.com/cozeStoreDesc/index.html'
  },
}

export default envDataConfig
