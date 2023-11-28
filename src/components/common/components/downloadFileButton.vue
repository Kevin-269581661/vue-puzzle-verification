<template>
  <!-- 通用下载/导出按钮组件 -->
  <el-button :loading="downloadLoading" :type="type" @click="handleExport">{{ text }}</el-button>
</template>

<script>
/*
  组件说明：
    1、该组件一般用于下载文件，导出文件
  组件属性：
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
    // 请求路径
    requestUrl: {
      type: String,
      required: true
    },
    // 下载的文件名-默认取后端返回的文件名
    downloadFileName: {
      type: String,
    },
    // 请求的api-默认post
    requestApi: {
      type: Function,
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
        // 处理请求方法
        let requestFunction = null
        if (this.requestApi) {
          requestFunction = this.requestApi
        } else {
          requestFunction = (url, params) => {
            return this.$api.postDownloadFileApi(url, params)
          }
        }
        // 发起请求
        const res = await requestFunction(this.requestUrl, this.requestParams)
        let data = null
        // 处理响应结果
        if (this.handleResponse && typeof this.handleResponse === 'function') {
          data = this.handleResponse(res)
        } else {
          data = res.data
        }
        // console.log('处理响应结果 res ===>', res)
        // 处理文件名
        let fileName = ''
        if (this.downloadFileName) {
          fileName = this.downloadFileName
        } else {
          // console.log('fileName ======', window.decodeURI(res.headers['content-disposition'].split('=')[1]), "UTF-8")
          fileName = window.decodeURI(res.headers['content-disposition'].split('=')[1], "UTF-8");
          // if (fileName.lastIndexOf('.') > -1) {
          //   fileName.slice(fileName.lastIndexOf('.') + 1)
          // }
          if (fileName.lastIndexOf(';') > -1) {
            fileName.slice(fileName.lastIndexOf(';') + 1)
          }
        }
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
