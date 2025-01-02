/**
 * 全国单图片 相关请求模块
 */
import request from "../api.js";

/**
 * 获取分享配置
 */
export function getShareConfig({
  apId,
  asrId,
}) {
  return request.getApi("/national/api/v1/photo/getShareConfig", {
    apId,
    asrId,
  })
}

/**
 * 设置分享配置
 */
export function setShareConfig(params) {
  return request.postApi_json("/national/api/v1/photo/setShareConfig", params)
}
