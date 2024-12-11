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

/**
 * 查询方案点位导出模板
 */
export function listSpaceExportTemplates({ apId }) {
  return request.getApi("/addsp/api/v2/adPlan/listSpaceExportTemplates", { apId })
}

/**
 * 保存方案点位导出模板
 */
export function saveSpaceExportTemplate({
  apId,
  name,
  selectedFields
}) {
  return request.postApi_json("/addsp/api/v2/adPlan/saveSpaceExportTemplate", {
    name,
    apId,
    selectedFields
  })
}

/**
 * 导出点位数据
 */
export function exportSpaces({
  // 方案id(仅当前订单时传)
  apId,
  // 方案ids(按城市导出时传)
  apIds,
  // 方案名称
  apName,
  // 选中的字段
  selectedFields
}) {
  return request.postDownloadFileApi("/addsp/api/v2/adPlan/exportSpaces", {
    apIds,
    apId,
    apName,
    selectedFields
  })
}

/**
 * 删除方案点位导出模板
 */
export function deleteSpaceExportTemplate({
  templateId
}) {
  return request.postApi("/addsp/api/v2/adPlan/deleteSpaceExportTemplate", {
    templateId
  })
}

/**
 * 根据当前方案id查询所有子单
 */
export function listChildInfos({ apId }) {
  return request.getApi("/addsp/api/v2/adPlan/listChildInfos", { apId })
}
