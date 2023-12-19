/**
 * qcentDsp 相关请求模块
 */
import request from "../api.js";

/**
 * 查询资源计划列表
 */
export function getPage(params) {
  return request.getApi("/qcent-dsp/web/resource/getPage", params)
}
/**
 * 查询资源计划详情
 */
export function getById({ id }) {
  return request.getApi("/qcent-dsp/web/resource/getById", { id })
}
/**
 * 新增资源计划
 */
export function addPlan(params) {
  return request.postApi_json("/qcent-dsp/web/resource/addPlan", params)
}

