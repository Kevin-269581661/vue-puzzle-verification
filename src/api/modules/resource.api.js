/**
 * 全国单-api模块
 */
import request from "../api.js";

/**
 * 查询资源计划列表
 */
export function getPage(params) {
  return request.getApi("/addsp/resource/getPage", params)
}
/**
 * 查询资源计划状态数据
 */
export function countStatus(params) {
  return request.getApi("/addsp/resource/countStatus", params)
}
/**
 * 查询资源计划详情
 */
export function getById({ id }) {
  return request.getApi("/addsp/resource/getById", { id })
}
/**
 * 查询节点列表
 */
export function getNodeDetail({ processCompanyId }) {
  return request.getApi("/addsp/resource/getNodeDetail", { processCompanyId })
}
/**
 * 查询流程公司列表
 */
export function listProcessCompanies({ processId, status, nodeId }) {
  return request.getApi("/addsp/resource/listProcessCompanies", { processId, status, nodeId })
}
/**
 * 查询动态列表
 */
export function listOperateRecords(params) {
  return request.getApi("/addsp/resource/listOperateRecords", params)
}
/**
 * 查看下载文件详情(用于下载已上传的文件)
 */
export function getFileDetail({ resourceId, type }) {
  return request.getApi("/addsp/resource/getFileDetail", { resourceId, type })
}
/**
 * 确认节点(地方媒介)
 */
export function confirm(params) {
  return request.postApi_json("/addsp/resource/confirm", params)
}
/**
 * 上传节点文件(url)
 */
export function uploadNodeFiles(params) {
  return request.postApi_json("/addsp/resource/uploadFiles", params)
}

