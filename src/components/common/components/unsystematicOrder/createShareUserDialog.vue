<!-- 非系统订单-分享设置-新建分享列表用户-弹窗 -->
<template>
  <div class="dialog_container">
    <el-dialog
      top="30vh"
      width="400px"
      append-to-body
      show-close
      :title="`${isEdit ? '编辑' : '新建'}分享用户`"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @closed="afterClose"
    >
      <div v-loading="dialogLoading" class="dialog_content">
        <div class="custom_dialog_body">
          <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" size="small" class="form">

            <el-form-item label="用户名：" prop="name">
              <el-input v-model.trim="formData.name" placeholder="请输入用户名" clearable :maxlength="30"></el-input>
            </el-form-item>

            <el-form-item label="手机号：" prop="phone">
              <el-input
                v-model="formData.phone"
                placeholder="请输入手机号"
                clearable
                :maxlength="11"
                :disabled="isEdit"
              ></el-input>
            </el-form-item>

          </el-form>
        </div>
        <div class="custom_dialog_footer">
          <el-button size="small" @click="close">取消</el-button>
          <el-button type="primary" @click="onSubmit" size="small">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    id: null,
    // 用户名称
    name: '',
    // 用户手机
    phone: ''
  }
}

export default {
  name: 'createShareUserDialog',
  emits: ['submitSuccess', 'afterClose'],
  props: {
    userList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      dialogLoading: false,
      isEdit: false,
      formData: initFormData(),
      formRules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        phone: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入手机号'))
              } else if (!/^1\d{10}$/.test(value)) {
                callback(new Error('请输入正确的手机号'))
              } else if (!this.isEdit && this.userList.some(it => it.phone === value)) {
                callback(new Error('输入的手机号已经存在'))
              } else {
                callback()
              }
            }
          }
        ]
      },
    }
  },
  methods: {
    /**
     * 提交表单
     */
    async onSubmit() {
      try {
        const isPass = await this.$refs['formRef'].validate()
        if (!isPass) return
      } catch (err) {
        return
      }
      try {
        // this.dialogLoading = true
        this.$emit('submitSuccess', { ...this.formData })
        this.close()
      } catch (err) {
        this.$message.error(String(err) || '操作失败')
        console.error('onSubmit error:', err)
      } finally {
        this.dialogLoading = false
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

/deep/ .el-dialog__header {
  border-bottom: 0;
}

.dialog_content {
  .custom_dialog_footer{
    padding: 10px 20px 20px;
    border-top: 0;
  }
  .custom_dialog_body {
    padding: 10px 20px 0px;
  }
}
</style>
