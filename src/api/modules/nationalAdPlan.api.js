/**
 * 全国订单 相关请求模块
 */
import request from "../api.js";

/**
 * 新建非系统订单（导入）
 */
export function importNationalAdPlanExcel(params) {
  return request.postUpload_file("/national/api/v1/nationalAdPlan/importNationalAdPlanExcel", params)
}


