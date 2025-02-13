/**
 * 媒体类型 相关请求模块
 */
import request from "../api.js";

/**
 * 查询媒体类型城市范围列表
 */
export function listCityRel({
  mediaTypeId
}) {
  return request.getApi("/addsp/api/v1/mediaType/listCityRel", {
    mediaTypeId
  })
}

/**
 * 更新媒体类型城市范围列表
 */
export function updateCityRel(params) {
  return request.postApi_json("/addsp/api/v1/mediaType/updateCityRel", params)
}

/**
 * 查询媒体类型城市范围详情(创建方案时使用)
 */
export function listCityDetail() {
  return request.getApi("/addsp/api/v1/mediaType/listCityDetail")
}
