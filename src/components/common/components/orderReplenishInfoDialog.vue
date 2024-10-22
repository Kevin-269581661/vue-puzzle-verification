<!-- 订单详情-资料补充-弹窗 -->
<template>
  <el-dialog
    width="550px"
    append-to-body
    show-close
    title="资料补充"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="afterClose"
  >
    <div v-loading="loading" class="dialog_content">
      <div class="custom_dialog_body">
        <el-form ref="formRef" class="form" label-width="100px" size="small"  :model="formData" :rules="formRules">
          <el-form-item label="活动名称：" prop="activityName">
            <el-input v-model.trim="formData.activityName" placeholder="活动名称" clearable maxlength="50"></el-input>
          </el-form-item>

          <el-form-item label="上传素材：" prop="materialUrl">
            <FileUpload
              ref="picUploaderRef"
              v-model="formData.materialUrl"
              accept=".jpeg,.jpg,.png"
              uploaderType="img"
              :maxSize="10"
            />
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
// import sessFun from "@/commonFun/sessFun.js";
import FileUpload from '@/components/common/components/FileUpload/index.vue'

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    apId: null,
    activityName: '',
    materialUrl: '',
  }
}

export default {
  name: 'orderReplenishInfoDialog',
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
        activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        materialUrl: [{ required: true, message: '请上传素材', trigger: 'blur' }],
      },
    }
  },
  methods: {
    /**
     * 提交表单
     */
    async onSubmit() {
      if (this.loading) return
      // 判断图片是否上传中
      if (this.$refs.picUploaderRef && this.$refs.picUploaderRef.loading) {
        this.$message.warning('图片正在上传中，请稍等')
        return
      }
      try {
        const isPass = await this.$refs['formRef'].validate()
        if (!isPass) return
      } catch (err) {
        return
      }
      try {
        this.loading = true
        const res = await this.$api.adPlan.setActivityInfo({
          ...this.formData,
        })
        const { SysCode: code, MSG: message, data } = res.data
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
    async getDetail() {
      try {
        this.loading = true
        const res = await this.$api.adPlan.getActivityInfo({ apId: this.formData.apId })
        const { SysCode: code, MSG: message, data = {} } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.formData.activityName = data.activityName
        this.formData.materialUrl = data.materialUrl
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
      this.$refs.picUploaderRef && this.$refs.picUploaderRef.reset()
      this.$emit('afterClose')
    },

    /**
     * 打开弹框
     */
    open(apId) {
      if (!apId) return
      if (this.visible) return
      this.visible = true
      if (apId) {
        this.isEdit = true
        this.formData.apId = apId
        this.getDetail()
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

</style>
