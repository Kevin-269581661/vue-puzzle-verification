<!-- 非系统订单-导入上下刊图片-弹框组件 -->
<template>
  <el-dialog
    width="600px"
    append-to-body
    title="导入图片"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :close-on-press-escape="false"
    @closed="afterClose"
  >
    <div
      v-loading="loading"
      class="dialog_content"
      element-loading-spinner="el-icon-loading"
      :element-loading-text="loadingText"
    >
      <div class="custom_dialog_body">
        <el-form ref="formRef" class="form" label-width="100px" size="small"  :model="formData" :rules="formRules">
          <el-form-item label="选择文件：" prop="zipUrl">
            <FileUpload
              ref="uploaderRef"
              v-model="formData.zipUrl"
              drag
              useOss
              showFileList
              listType="text-plain"
              accept=".zip,.rar,.tar,.gz,.7zip,.apk"
              :ossOptions="{
                uploadUrl: '/national/upload/getTemporaryKey',
                params: {
                  key: 'nationalPhotoPackage'
                }
              }"
              :maxSize="1024 * 10"
              @success="openProgressDownPage"
            />
            <div class="desc">注：上传中请勿关闭弹窗，否则上传将被取消！</div>
          </el-form-item>
        </el-form>
      </div>
      <div class="custom_dialog_footer">
        <el-button size="small" @click="close">取消</el-button>
        <!-- <el-button type="primary" size="small" @click="onSubmit">确定</el-button> -->
      </div>
    </div>
  </el-dialog>
</template>

<script>
import FileUpload from '@/components/common/components/FileUpload/index.vue'

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    zipUrl: '',
    // 0:上刊,1:下刊,2:换画
    imgType: '',
    // 换画必填
    replaceRecordId: '',
    // 公司id
    asrID: '',
    // 关联类型区分属性(方案id)
    apId: '',
    // 请求唯一key
    uqKey: '',
  }
}

export default {
  name: 'formDialog',
  components: { FileUpload },
  emits: ['submitSuccess', 'afterClose'],
  data() {
    return {
      visible: false,
      loading: false,
      formData: initFormData(),
      formRules: {
        // 通用校验
        zipUrl: [{ required: true, message: '请先上传文件', trigger: 'blur' }],
      },
      loadingText: '数据解析中，请稍后...',
      uploadPercent: 0,
      failList: [],
    }
  },
  methods: {
    /**
     * 上传oss完成
     */
    async uploadSuccess() {
      this.openProgressDownPage()
      this.close()
    },

    /**
     * 打开下载进度页
     */
    openProgressDownPage() {
      const tempPage = window.open("", "_blank")
      const routeUrl = this.$router.resolve({
        path: "/downloadProgressView",
        query: {
          ...this.formData,
          zipUrl: window.encodeURIComponent(this.formData.zipUrl),
          downtype: 4
        }
      })
      tempPage.location = routeUrl.href
    },

    /**
     * 提交表单
     */
    async onSubmit() {},

    /**
     * 重置数据
     */
    afterClose() {
      this.failList = []
      this.uploadPercent = 0
      this.loadingText = '数据解析中，请稍后...'
      this.formData = initFormData()
      this.$refs['formRef'] && this.$refs['formRef'].clearValidate()
      this.$refs.uploaderRef && this.$refs.uploaderRef.reset()
      this.$emit('afterClose')
    },

    /**
     * 打开弹框
     */
    open(row) {
      if (this.visible) return
      this.visible = true
      if (row) {
        const { imgType, asrID, apId, replaceRecordId } = row
        this.formData = {
          ...this.formData,
          replaceRecordId,
          imgType,
          asrID,
          apId
        }
      }
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

.desc {
  color: #F56C6C;
  color: 14px;
  line-height: 22px;
  margin-top: 8px;
}

</style>
