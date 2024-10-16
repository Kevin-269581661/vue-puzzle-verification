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
  title = ''
}) {
  return request.getApi("/addsp/api/v1/customer/detecting/getPage", {
    pageNum,
    pageSize,
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
