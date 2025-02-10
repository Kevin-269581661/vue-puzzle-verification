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

/**
 * 获取权限下的城市列表
 */
export function getFanganCity({
  uid,
  token,
  // 用户Id
  suID
}) {
  return request.getApi("/advertisement/GetFanganCity", { uid, token, suID })
}

/**
 * 获取所选权限城市下的点位所属公司
 */
export function getCityAscrList({
  uid,
  token,
  // 用户uid
  suID,
  // 城市Id数组，多个用逗号分割
  cityIds
}) {
  return request.getApi("/advertisement/GetCityAscrList", { uid, token, suID, cityIds })
}
