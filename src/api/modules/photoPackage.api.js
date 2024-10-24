/**
 * 图片包 photoPackage 相关请求模块
 */
import request from "../api.js";

/**
 * 匹配点位数据
 */
export function matchSpace({
  // 0:上刊,1:下刊,2:换画
  imgType,
  // 换画必填
  replaceRecordId,
  // 公司id
  asrID,
  // 关联类型区分属性(方案id)
  apId,
  // 上传压缩包后的url
  zipUrl,
  // 请求唯一key
  uqKey
}) {
  return request.postApi_json("/national/api/v1/photoPackage/matchSpace", {
    imgType,
    replaceRecordId,
    asrID,
    apId,
    zipUrl,
    uqKey
  })
}
