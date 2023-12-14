/**
 * advertisement 相关请求模块
 */
import api from "../api.js";

/**
 * 获取投放城市列表
 */
export function getAPDCityNames({ uid, token }) {
  return api.getApi("/advertisement/GetAPDCityNames", { uid, token })
}
