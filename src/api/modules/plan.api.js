/**
 * 方案 相关请求模块
 */
import request from "../api.js";

/**
 * 新增申请
 */
export function addApply(params) {
  return request.postApi_json("/addsp/adPlan/item/addApply", params)
}

