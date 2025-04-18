/**
 * UCAPI 相关请求模块
 */
import request from "../api.js";

/**
 * 微信扫码获取绑定的用户信息
 */
export function wxQrCodeUserBindInfo({ code }) {
  return request.getApi("/UCAPI/wxQrCodeUserBindInfo", { code })
}

/**
 * 微信扫码登录
 */
export function wxQrcodeLogin({
  // 选中的用户id
  id,
  phone,
  wxUnionId
}) {
  return request.getApi("/UCAPI/wxQrcodeLogin", {
    id,
    phone,
    wxUnionId
  })
}

/**
 * 手机号验证码登录
 */
export function phoneCodeLogin({
  // 是否经过微信扫码,经过微信扫码就true,不传默认false
  fromWxQrCode,
  wxOpenId,
  wxUnionId,
  code,
  phone,
  userName,
  companyId,
  roleId,
  id
}) {
  return request.getApi("/UCAPI/phoneCodeLogin", {
    fromWxQrCode,
    wxOpenId,
    wxUnionId,
    code,
    phone,
    userName,
    companyId,
    roleId,
    id
  })
}

/**
 * 用户绑定微信
 */
export function wxQrCodeBind({ code }) {
  return request.getApi("/UCAPI/wxQrCodeBind", { code })
}

/**
 * 查询是否弹出绑定微信提醒
 * uType: 1=是否提醒；2=设置提醒，都返回boolean类型；3=提醒天数，int类型
 */
export function wxBindRemind({ uType }) {
  return request.getApi("/UCAPI/wxBindRemind", { uType })
}
