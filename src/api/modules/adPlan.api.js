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

/**
 * 获取销售crm的客户列表
 */
export function listCustomers({
  uId,
  pageNum,
  pageSize,
  keyword = ''
}) {
  return request.getApi("/addsp/api/v1/adPlan/listCustomers", {
    uId,
    pageNum,
    pageSize,
    keyword
  })
}

/**
 * 获取销售crm的客户下的联系人列表
 */
export function listContacts({ saleProcessId }) {
  return request.getApi("/addsp/api/v1/adPlan/listContacts", { saleProcessId })
}

/**
 * 查询活动信息
 */
export function getActivityInfo({ apId }) {
  return request.getApi("/addsp/api/v1/adPlan/getActivityInfo", { apId })
}

/**
 * 设置活动信息
 */
export function setActivityInfo({
  apId,
  activityName,
  materialUrl
}) {
  return request.postApi_json("/addsp/api/v1/adPlan/setActivityInfo", {
    apId,
    activityName,
    materialUrl
  })
}

