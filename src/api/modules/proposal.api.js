/**
 * proposal 相关请求模块
 */
import request from "../api.js";

/**
 * 设置方案金额
 */
export function updatePlanMoney({
  uid,
  token,
  apID,
  adsWeekFee,
  cashFee,
  sendFee,
  otherFee,
  remark
}) {
  return request.postApi("/addsp/proposal/updatePlanMoney", { uid, token, apID, adsWeekFee, cashFee, sendFee, otherFee, remark })
}
