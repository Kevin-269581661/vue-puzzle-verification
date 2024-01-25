<template>
  <div class="dialog_container">
    <!-- 上传文件-弹框组件 -->
    <el-dialog
      :visible.sync="visible"
      :append-to-body="true"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="title"
      width="600px"
      @closed="afterClose"
    >
      <div v-loading="dialogLoading" :element-loading-text="dialogLoadingTip" class="dialog_content">
        <div class="custom_dialog_body">
          <el-upload
            :file-list="fileList"
            :http-request="handleRequest"
            :accept="accept"
            :name="name"
            :multiple="multiple"
            :disabled="disabled"
            :limit="maxCount"
            action=""
            drag
            v-bind="$attrs"
            :on-exceed="handleExceed"
            :on-remove="handleFileRemove"
            :on-change="onFileChange"
            :on-success="onFileSuccess"
            :on-error="onFileError"
            ref="uploadRef"
            class="upload_box"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip" >只能上传{{ accept }}文件，且不超过{{ maxSize }}MB</div>
          </el-upload>
        </div>
        <div class="custom_dialog_footer">
          <el-button @click="close" size="small">取消</el-button>
          <el-button type="primary" @click="handleOk" size="small">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import sessFun from "@/commonFun/sessFun.js";
import CosUploader from '@/utils/cos-js-sdk-v5-util'

export default {
  name: 'uploadFileDialog',
  emits: ['submitSuccess', 'afterClose'],
  props: {
    // 上传弹框标题
    title: {
      type: String,
      default: '上传文件'
    },
    // 请求路径
    // uploadUrl: {
    //   type: String,
    //   required: true
    // },
    // 请求参数
    uploadParams: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 是否多个文件
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 接受上传的文件类型：  audio/*, video/*, image/*
    // '.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.jpeg,.jpg,.png'
    accept: {
      type: String,
      default: ''
    },
    // 发到后台的文件参数名
    name: {
      type: String,
      default: 'file'
    },
    maxCount: {
      type: Number,
      default: 1
    },
    // 文件大小限制（MB）
    maxSize: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      visible: false,
      dialogLoading: false,
      dialogLoadingTip: '正在上传中（0%），请勿关闭弹窗',
      isEdit: false,
      fileList: [],
      cosUploader: null
    }
  },
  methods: {
    /**
     * 自定义上传请求
     */
    async handleRequest(params) {
      // console.log('handleRequest params ===', params)
      const { token, uID: uid } = sessFun.getSess()
      try {
        const formData = new FormData()
        formData.append(this.name, params.file)
        Object.keys(this.uploadParams).forEach((key) => {
          formData.append(key, this.uploadParams[key])
        })
        this.dialogLoading = true
        this.dialogLoadingTip = `正在上传中（0%），请勿关闭弹窗`
        this.cosUploader = CosUploader.create()
        const res = await this.cosUploader.uploadFile({
          file: params.file,
          onProgress: (percent) => {
            this.dialogLoadingTip = `正在上传中（${percent * 100}%），请勿关闭弹窗`
            // params.onProgress(percent)
          }
        })
        console.log('上传成功 res ===', res)
        this.$message.success(`${params.file.name} 上传成功`)
        const downloadUrl = `https://${res.Location}`
        params.onSuccess(downloadUrl, params.file)
      } catch (err) {
        console.error('handleRequest error:', err)
        params.onError(err, params.file)
        this.$message.error(err || '上传失败')
      } finally {
        this.dialogLoading = false
      }
    },
    /**
     * 文件超出个数限制时的钩子
     */
    handleExceed() {
      this.$message.warning(`文件超出个数限制`)
    },
    /**
     * 上传文件之前的钩子
     */
    handleBeforeUpload (file) {
      // 文件大小校验
      if (file.size > this.maxSize * 1024 * 1024) {
        this.$message.warning('请按大小要求上传文件')
        return false
      }
      return true
    },
    /**
     * 点击移除文件时的回调
     */
    handleFileRemove (file, fileList) {
      this.fileList = fileList
    },
    onFileChange() {},
    /**
     * 文件上传成功时的钩子
     */
    onFileSuccess(res, fileInfo) {
      if (!res) return
      const { name, size, type: mime, uid: key } = fileInfo.raw
      this.fileList.push({ name, size, mime, key, url: res })
    },
    /**
     * 文件上传失败时的钩子
     */
    onFileError() {
      // this.$message.error('onFileError : 上传失败')
    },
    /**
     * 提交表单
     */
    async handleOk() {
      if (this.dialogLoading) return
      try {
        console.log('handleOk fileList ===', this.fileList)
        if (!this.fileList.length) {
          this.$message.warning('请先上传文件')
          return
        }
        this.$emit('confirm', this.fileList)
        this.close()
      } catch (err) {
        this.$message.error(String(err) || '操作失败')
        console.error('handleOk error:', err)
      } finally {
        // this.dialogLoading = false
      }
    },
    /**
     * 获取详情
     */
    async getDetail(id) {
      if (!id) return console.error('getDetail error: id 不能为空')
      try {
        this.dialogLoading = true
        const res = await this.$request.getApi('/aaaa/bbbb', { id })
        const { SysCode: code, MSG: message, data = [] } = res.data
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.formData = data
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getDetail error:', err)
      } finally {
        this.dialogLoading = false
      }
    },
    /**
     * 获取预加载数据
     */
     async getPropTwoOptions() {
      try {
        this.dialogLoading = true
        const res = await this.$request.getApi('/aaaa/bbbb')
        const { SysCode: code, MSG: message, data = [] } = res.data
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.preparedData.propTwoOptions = data
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getDetail error:', err)
      } finally {
        this.dialogLoading = false
      }
    },
    /**
     * 重置数据
     */
    afterClose() {
      this.$refs.uploadRef.clearFiles()
      this.fileList = []
      if (this.cosUploader) this.cosUploader.cancel()
      this.$emit('afterClose')
    },
    /**
     * 打开弹框
     */
    open(row) {
      if (this.visible) return
      this.visible = true
    },
    /**
     * 关闭弹框
     */
    close() {
      if (!this.visible) return
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped="scoped">

/deep/ .el-dialog__body {
  padding: 0;
}

.custom_dialog_footer{
  padding: 10px 20px 20px;
}

.custom_dialog_body {
  display: flex;
  justify-content: center;
}

.upload_box {
  margin: 0 auto;
}
</style>
