/**
 * advertisement 相关请求模块
 */
import request from "../api.js";

/**
 * 方案城市列表
 */
export function getAPDCityNames({ uid, token }) {
  return request.getApi("/advertisement/GetAPDCityNames", { uid, token })
}
/**
 * 方案列表
 */
export function getProposal(params) {
  return request.getApi("/advertisement/GetProposal", params)
}
