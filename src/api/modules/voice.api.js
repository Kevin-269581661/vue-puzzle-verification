/**
 * 音频 相关请求模块
 */
import request from "../api.js";

/**
 * 上传投放音频媒体
 */
function uploadMedia(params) {
  return request.postUploadFileApi("/addsp/api/v1/voice/uploadMedia", params)
}

/**
 * 获取h5审核开关状态
 */
function getH5AuditOpenStatus() {
  return request.getApi("/addsp/api/v1/voice/getH5AuditOpenStatus")
}

/**
 * 查询音频审核记录
 */
 function listAuditRecords({
  apId,
}) {
  return request.getApi("/addsp/api/v1/voice/listAuditRecords", {
    apId,
  })
}

/**
 * 校验是否存在待审核记录
 */
 function existNotAudit({ apId }) {
  return request.postApi("/addsp/api/v1/voice/existNotAudit", { apId })
}

/**
 * 发起音频审核
 */
 function submitAudit({ apId }) {
  return request.postApi("/addsp/api/v1/voice/submitAudit", { apId })
}

/**
 * 撤销音频审核
 */
 function revokeAudit({ apId }) {
  return request.postApi("/addsp/api/v1/voice/revokeAudit", { apId })
}

/**
 * 获取H5审核分享链接
 */
function getAuditShareLink({
  apId,
}) {
  return request.getApi("/addsp/api/v1/voice/getAuditShareLink", {
    apId,
  })
}

/**
 * 查询审核通过的音频列表
 */
function listAuditedVoice({
  apId,
}) {
  return request.getApi("/addsp/api/v1/voice/listAuditedVoice", {
    apId,
  })
}

export {
  // 上传投放音频媒体
  uploadMedia,
  // 查询音频审核记录
  listAuditRecords,
  // 校验是否存在待审核记录
  existNotAudit,
  // 发起音频审核
  submitAudit,
  // 撤销音频审核
  revokeAudit,
  // 获取h5审核开关状态
  getH5AuditOpenStatus,
  // 获取H5审核分享链接
  getAuditShareLink,
  // 查询审核通过的音频列表
  listAuditedVoice,
}
