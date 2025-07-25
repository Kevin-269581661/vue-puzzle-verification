/**
 * 公司管理 相关请求模块
 */
import request from "../api.js";

/**
 * 查询媒体类型城市范围列表
 */
export function listMultiPermissions(keyword) {
  return request.getApi("/addsp/api/v1/company/listMultiPermissions", {
    keyword
  })
}

/**
 * 查询是否开通数字化公司
 */
export function isPay({ asrID }) {
  return request.getApi("/addsp/api/v1/company/isPay", {
    asrID
  })
}

