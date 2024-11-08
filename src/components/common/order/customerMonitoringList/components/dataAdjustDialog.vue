<!-- 客户监播-数据调整-弹框组件 -->
<template>
  <el-dialog
    width="600px"
    append-to-body
    show-close
    title="数据调整"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="afterClose"
  >
    <div v-loading="loading" class="dialog_content">
      <div class="custom_dialog_body">
        <div class="desc">
          注：<span style="color: red">覆盖人数 = 户数 x 平均每户人数</span>，以下填写将控制客户侧覆盖人数数据的展示结果，请谨慎使用。
        </div>
        <el-form ref="formRef" class="form" label-width="140px" size="small"  :model="formData" :rules="formRules">
          <el-form-item label="平均每户人数 =" prop="userMulti">
            <el-input-number v-model="formData.userMulti" controls-position="right" :min="0" :max="99999"></el-input-number>
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

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    // 项目id, 编辑操作必填
    id: null,
    // 数据调整中小区住户放大倍数
    userMulti: null,
  }
}

export default {
  name: 'dataAdjustDialog',
  emits: ['submitSuccess', 'afterClose'],
  props: {},
  data() {
    return {
      visible: false,
      loading: false,
      isEdit: false,
      formData: initFormData(),
      formRules: {
        // 通用校验
        userMulti: [{ required: true, message: '请输入平均每户人数', trigger: 'blur' }],
      }
    }
  },
  methods: {
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
        // const { token, uID: uid } = sessFun.getSess()
        this.loading = true
        const res = await this.$request.postApi_json('/addsp/api/xxxxx', {
          ...this.formData,
          // uid,
          // token,
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
     * 重置数据
     */
    afterClose() {
      this.isEdit = false
      this.formData = initFormData()
      this.$refs['formRef'] && this.$refs['formRef'].clearValidate()
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
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 20px;
}

</style>
