/**
 * 投放点位 adLaunch 相关接口
 */
import request from "../api.js";

/**
 * 查询已发布订单的点位明细
 */
export function listMarkSpaces({
  // 方案id
  apId,
  // 媒体位ID
  assetTag,
  // 资源名称
  resName,
  // 媒体名称
  mTitle,
  // 排期开始时间
  lStar,
  // 排期结束时间
  lEnd,
  // 页码
  pageNum,
  // 每页记录数
  pageSize,
}) {
  return request.postApi_json("/addsp/api/v1/adLaunch/listMarkSpaces", {
    apId,
    assetTag,
    resName,
    mTitle,
    lStar,
    lEnd,
    pageNum,
    pageSize,
  })
}

/**
 * 查询已标记完成上刊
 */
export function listMarkSkIds({
  apId
}) {
  return request.getApi("/addsp/api/v1/adLaunch/listMarkSkIds", {
    apId
  })
}

/**
 * 标记完成上刊
 */
export function markSk({
  // 方案id
  apId,
  // 要标记的id
  lIds
}) {
  return request.postApi_json("/addsp/api/v1/adLaunch/markSk", {
    apId,
    lIds
  })
}

/**
 * 上传批量标记/取消标记完成上刊
 */
export function uploadMarkSk(params) {
  return request.postUpload_file("/addsp/api/v1/adLaunch/uploadMarkSk", params)
}


