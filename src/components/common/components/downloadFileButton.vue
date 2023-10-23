<template>
  <!-- 通用下载/导出按钮组件 -->
  <el-button :loading="downloadLoading" :type="type" @click="handleExport">{{ text }}</el-button>
</template>

<script>
/*
  组件说明：
    1、该组件一般用于下载文件，导出文件
  组件属性：
    downloadFileName: [String] 必传 - 下载的文件名
    requestApi: [Function] 必传 - 请求的api
    requestUrl: [String] 必传 - 请求的api
    requestParams: [Object] 非必传 - 请求参数
    handleResponse: [Function] 非必传 - 请求之后对返回值进行处理
    text: [String] 非必传，默认“导出” - 按钮文案
    type: [String] 非必传，默认“plain” - 按钮类型
    isJoinTimeToFileName: [Boolean] 非必传，默认 true - 是否在文件名后拼接时间
    downloadFileSuffix: [String] 非必传，默认 xlsx - 下载的文件后缀（可不带点）
    confirmContent: [String] 非必传，默认“确认将当前条件下的数据导出吗？” - 确认框提示
  组件事件：
  组件插槽：
  组件用法：
 */
import { Message } from "element-ui";
// import { cloneDeep } from "lodash";
import sessFun from "@/commonFun/sessFun.js";
import { deserialize, downLoadFile } from '@/utils/common'

export default {
  name: 'downloadFileButton',
  emits: ['submitSuccess', 'close'],
  props: {
    // 下载的文件名
    downloadFileName: {
      type: String,
      required: true
    },
    // 请求的api
    requestApi: {
      type: Function,
      required: true
    },
    // 请求路径
    requestUrl: {
      type: String,
      required: true
    },
    // 请求参数
    requestParams: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 请求之后对返回值进行处理
    handleResponse: {
      type: Function,
    },
    // 按钮文案
    text: {
      type: String,
      default: '导出'
    },
    // 按钮类型
    type: {
      type: String,
      default: 'plain'
    },
    // 是否在文件名后拼接时间
    isJoinTimeToFileName: {
      type: Boolean,
      default: true
    },
    // 下载的文件后缀（可不带点）
    downloadFileSuffix: {
      type: String,
      default: 'xlsx'
    },
    // 确认框提示
    confirmContent: {
      type: String,
      default: '确认将当前条件下的数据导出吗？'
    }
  },
  data() {
    return {
      downloadLoading: false,
    }
  },
  methods: {
    /**
     * 列表导出
     */
     async handleExport() {
      if (this.downloadLoading) return
      try {
        const confirmRes =  await this.$confirm(this.confirmContent, '温馨提示')
        if (confirmRes !== 'confirm') return
      } catch (err) {
        return
      }
      try {
        this.downloadLoading = true
        const res = await this.requestApi(this.requestUrl, this.requestParams)
        let data = null
        if (this.handleResponse && typeof this.handleResponse === 'function') {
          data = this.handleResponse(res)
        } else {
          data = res.data
        }
        let fileName = this.downloadFileName
        if (this.isJoinTimeToFileName) {
          fileName += '-' + this.$moment().format('YYYY-MM-DD HH:mm:ss')
        }
        downLoadFile(data, fileName, this.downloadFileSuffix)
      } catch (err) {
        Message.error(String(err) || '下载文件失败')
        console.error('handleExport error:', err)
      } finally {
        this.downloadLoading = false
      }
    },
  }
}
</script>

<style lang="scss" scoped="scoped"></style>
