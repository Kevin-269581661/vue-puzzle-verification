/**
 * 音频 相关请求模块
 */
import request from "../api.js";

/**
 * 上传投放音频媒体
 */
export function uploadMedia(params) {
  return request.postUploadFileApi("/addsp/api/v1/voice/uploadMedia", params)
}
