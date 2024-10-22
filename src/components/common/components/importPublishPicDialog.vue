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
    <div v-loading="loading" class="dialog_content">
      <div class="custom_dialog_body">
        <el-form ref="formRef" class="form" label-width="100px" size="small"  :model="formData" :rules="formRules">
          <el-form-item label="选择文件：" prop="url">
            <FileUpload
              ref="uploaderRef"
              v-model="formData.url"
              drag
              useOss
              showFileList
              listType="text-plain"
              accept=".zip"
              :ossOptions="{
                uploadUrl: '/national/upload/getTemporaryKey',
                params: {
                  key: 'nationalPhotoPackage'
                }
              }"
              :maxSize="1024 * 10"
              :handleUploadRes="handleUploadRes"
              @success="uploadSuccess"
            />
            <div class="desc">注：上传中请勿关闭弹窗，否则上传将被取消！</div>
          </el-form-item>
        </el-form>
      </div>
      <div class="custom_dialog_footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import FileUpload from '@/components/common/components/FileUpload/index.vue'
// import sessFun from "@/commonFun/sessFun.js";

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    url: '',
    propTwo: null
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
      isEdit: false,
      formData: initFormData(),
      formRules: {
        // 通用校验
        url: [{ required: true, message: '请先上传文件', trigger: 'blur' }],
        // 特殊校验
        // propTwo: [
        //   {
        //     required: true,
        //     trigger: 'blur',
        //     validator: (rule, value, callback) => {
        //       if (!value) {
        //         callback(new Error('请选择示例二'))
        //       } else {
        //         callback()
        //       }
        //     }
        //   }
        // ]
      },
    }
  },
  methods: {
    handleUploadRes(res) {
      // const { SysCode: code, MSG: message, data } = res.data || {}
      // if (code !== 200200) throw new Error(message || '上传失败 code != 200')
      // this.errorList = data.errorList || []
      // this.successSize = data.successSize || 0
      // this.formData.nonSystemApId = data.apId || null
      return ''
    },

    uploadSuccess() {
      // if (this.errorList.length) {
      //   this.$refs.uploaderRef && this.$refs.uploaderRef.reset()
      //   this.openUnsuccessful()
      //   return
      // }
    },
    /**
     * 提交表单
     */
    async onSubmit() {
      if (this.loading) return
      try {
        const isPass = await this.$refs['formRef'].validate()
        if (!isPass) return
      } catch (err) {
        return
      }
      try {
        const { token, uID: uid } = sessFun.getSess()
        this.loading = true
        const res = await this.$request.postApi_json('/addsp/api/xxxxx', {
          ...this.formData,
          uid,
          token,
        })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '操作失败')
        this.$message.success('操作成功')
        this.$emit('submitSuccess')
        this.close()
      } catch (err) {
        this.$message.error(String(err) || '操作失败')
        console.error('onSubmit error:', err)
      } finally {
        this.loading = false
      }
    },
    /**
     * 获取详情
     */
    async getDetail(id) {
      if (!id) return console.error('getDetail error: id 不能为空')
      try {
        this.loading = true
        const res = await this.$request.getApi('/aaaa/bbbb', { id })
        const { SysCode: code, MSG: message, data = [] } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.formData = data
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getDetail error:', err)
      } finally {
        this.loading = false
      }
    },

    /**
     * 重置数据
     */
    afterClose() {
      this.isEdit = false
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
        this.isEdit = true
        this.formData = {
          ...this.formData,
          ...row
        }
        // this.getDetail(row.id)
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
