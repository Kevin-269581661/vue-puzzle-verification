import request from 'axios';

export default class CosUploader {
  // 获取oss基本信息接口地址
  uploadUrl = '/addsp/resource/web/getTemporaryKey'

  params = {}

  // 设置onProgress回调此时，默认1000ms一次
  progressInterval = 1000

  cos = null

  bucketName = ''

  region = ''

  prefix = ''

  //  file = null

  // 上传或下载任务id（目前一个实例同一时刻，只考虑进行单个任务）
   taskId = ''

  /**
   * 创建实例
   * @param {Object} options 可选参数
   * @param {Object} options.uploadUrl 请求域名
   * @returns 实例
   */
  static create(options) {
    return new CosUploader(options)
  }

  constructor(options) {
    const { uploadUrl, params } = options || {}
    if (uploadUrl) this.uploadUrl = uploadUrl
    if (params) this.params = params
  }

  /**
   * 构建 COS 对象
   * @returns COS 实例
   */
  async getCos() {
    // 获取 oss 配置信息（密钥相关信息）
    const res = await request({
      url: this.uploadUrl,
      method: 'GET',
      params: this.params
    })
    console.log('getCos res ===', res)
    let code = res.data.SysCode || res.data.code
    let message = res.data.MSG || res.data.message
    let data = res.data.data || {}
    if (code === 200200 || code === 200) {
      const {
        bucketName,
        prefix,
        // expiration,
        expiredTime,
        // logDir,
        region,
        sessionToken,
        startTime,
        tmpSecretId,
        tmpSecretKey
      } = data
      this.bucketName = bucketName
      this.region = region
      this.prefix = prefix
      // COS 对象
      const cos = new window.COS({
        getAuthorization: (options, callback) => {
          callback({
            // 获取回来的临时密钥的 tmpSecretId
            TmpSecretId: tmpSecretId,
            // 获取回来的临时密钥的 tmpSecretKey
            TmpSecretKey: tmpSecretKey,
            // 获取回来的临时密钥的 sessionToken，对应 header 的 x-cos-security-token 字段
            XCosSecurityToken: sessionToken,
            // 时间戳，单位秒，如：1580000000
            // StartTime: Math.floor(startTime / 1000),
            StartTime: startTime,
            // 时间戳，单位秒，如：1580000900
            ExpiredTime: expiredTime,
            // ExpiredTime: 1580000900,
            // 设置onProgress回调此时，默认1000ms一次
            ProgressInterval: this.progressInterval,
            // 细粒度控制权限需要设为 true，会限制密钥只在相同请求时重复使用
            ScopeLimit: true
          })
        }
      })
      this.cos = cos
      return cos
    } else {
      throw new Error(message || '获取 oss 配置信息失败')
    }
  }

  async uploadFile({ file, onProgress }) {
    // if (!this.cos) {
    //   await this.getCos()
    // }
    await this.getCos()
    // 路径去掉中文（app端无法访问）
    const filePath = this.prefix + encodeURIComponent(`${new Date().getTime()}_${file.name}`)
    // 上传图片  其中Bucket 和 Region 接口返回，Bucke和Region是由公司负责人使用公司账户，登入腾讯云，获取回来的。
    const uploadRes = await this.cos.uploadFile({
      // 桶名-必须字段
      Bucket: this.bucketName,
      // 存储桶所在地域-必须字段
      Region: this.region,
      // 必须  这个值要注意下，前面是要跟公司设置的oss路径要匹配的，不然上传可能会报403
      // key 在前面加上路径写法可以生成文件夹
      // Key: `crm/dsp/web/${new Date().getTime()}_${file.name}`,
      // Key: `${this.prefix}${new Date().getTime()}_${file.name}`,
      Key: filePath,
      Body: file, // 上传文件对象
      StorageClass: 'STANDARD',
      // 触发分块上传的阈值，超过3MB使用分块上传，非必须
      SliceSize: 1024 * 1024 * 5,
      onProgress: (progressData) => {
        const { percent } = progressData
        onProgress(percent)
      },
      onTaskReady: (taskId) => {
        this.taskId = taskId
      }
    })
    // 将上传后的封面进行路径拼接保存到本地
    // 上传成功
    return uploadRes
  }

  async cancel() {
    if (this.cos && this.taskId) {
      this.cos.cancelTask(this.taskId)
      this.cos = null
      this.taskId = ''
    }
  }
}
