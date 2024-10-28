/**
 * 客户监播 相关请求模块
 */
import request from "../api.js";

/**
 * 查询客户监播项目列表
 */
export function getPage({
  pageNum,
  pageSize,
  cId,
  bId,
  title = ''
}) {
  return request.getApi("/addsp/api/v1/customer/detecting/getPage", {
    pageNum,
    pageSize,
    cId,
    bId,
    title
  })
}

/**
 * 新增客户监播项目
 */
export function addItem({
  // 标题
  title,
  // 客户公司id
  cId,
  // 客户品牌id
  bIds,
  // 自动添加状态：0-关闭 1-开启
  autoAddStatus
}) {
  return request.postApi_json("/addsp/api/v1/customer/detecting/addItem", {
    title,
    cId,
    bIds,
    autoAddStatus
  })
}

/**
 * 编辑客户监播项目
 */
export function editItem({
  id,
  title,
  // 自动添加状态：0-关闭 1-开启
  autoAddStatus
}) {
  return request.postApi_json("/addsp/api/v1/customer/detecting/editItem", {
    id,
    title,
    // 自动添加状态：0-关闭 1-开启
    autoAddStatus
  })
}

/**
 * 查询客户下拉数据
 */
export function listCustomers() {
  return request.getApi("/addsp/api/v1/customer/detecting/listCustomers")
}

/**
 * 查询订单列表
 */
export function listOrders({
  // 客户监播项目id
  itemId,
  // 0.未选 1.已选 不填.查全部
  status = null,
  // 订单名字
  apName = ''
}) {
  return request.getApi("/addsp/api/v1/customer/detecting/listOrders", {
    itemId,
    status,
    apName
  })
}

/**
 * 更新监播项目与订单的关联关系
 */
export function updateRel({
  // 项目id
  itemId,
  apIds
}) {
  return request.postApi_json("/addsp/api/v1/customer/detecting/updateRel", {
    itemId,
    apIds
  })
}

/**
 * 查询创建非系统单信息
 */
export function getNonSystemOrderInfo({
  apId
}) {
  return request.getApi("/addsp/api/v1/customer/detecting/getNonSystemOrderInfo", {
    apId
  })
}

/**
 * 新增系统单与非系统单关联关系
 */
export function addAdPlanRel({
  apId,
  nonSystemApId
}) {
  return request.postApi_json("/addsp/api/v1/customer/detecting/addAdPlanRel", {
    apId,
    nonSystemApId
  })
}

/**
 * 获取分享配置
 */
export function getShareConfig({
  // 客户监播项目id
  itemId
}) {
  return request.getApi("/addsp/api/v1/customer/detecting/getShareConfig", {
    itemId
  })
}

/**
 * 设置分享配置
 */
export function setShareConfig({
  // 项目id
  itemId,
  // 分享开启状态 1:开启 0:关闭
  status,
  // 账号密码登录 1:开启 0:关闭
  pwdLogin,
  // 手机验证码登录状态 1:开启 0:关闭
  verificationCodeLogin,
  // 分享类型 1-自定义,2-永久
  type,
  // 分享有效期开始时间
  beginDate,
  // 分享有效期结束时间
  endDate,
  // 新增用户列表(不用输入id)
  addUserList,
  // 删除用户id
  deleteUserIds
}) {
  return request.postApi_json("/addsp/api/v1/customer/detecting/setShareConfig", {
    itemId,
    status,
    pwdLogin,
    verificationCodeLogin,
    type,
    beginDate,
    endDate,
    addUserList,
    deleteUserIds
  })
}

/**
 * 查询城市导出PPT状态列表
 */
export function listPptStatus({
  // 客户监播项目id
  itemId,
  apId
}) {
  return request.getApi("/addsp/api/v1/customer/detecting/listPptStatus", {
    itemId,
    apId
  })
}

/**
 * 开启城市PPT导出
 */
export function setPPTStatus({
  itemId,
  apId,
  codeList
}) {
  return request.postApi_json("/addsp/api/v1/customer/detecting/setPPTStatus", {
    itemId,
    apId,
    codeList
  })
}
