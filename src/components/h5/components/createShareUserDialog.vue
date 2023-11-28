<template>
  <div class="dialog_container">
    <!-- 新建分享列表用户-组件 -->
    <el-dialog
      :visible.sync="visible"
      :append-to-body="true"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="`${isEdit ? '编辑' : '新建'}分享用户`"
      top="30vh"
      width="400px"
      @closed="close"
    >
      <div v-loading="dialogLoading" class="dialog_content">
        <div class="custom_dialog_body">
          <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" size="small" class="form">

            <el-form-item label="用户名：" prop="name">
              <el-input v-model.trim="formData.name" placeholder="请输入用户名" clearable :maxlength="30"></el-input>
            </el-form-item>

            <el-form-item label="手机号：" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入手机号" clearable :maxlength="11"></el-input>
            </el-form-item>

          </el-form>
        </div>
        <div class="custom_dialog_footer">
          <el-button @click="close" size="small">取消</el-button>
          <el-button type="primary" @click="onSubmit" size="small">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

// import { cloneDeep } from "lodash";
import sessFun from "@/commonFun/sessFun.js";

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    id: null,
    // 订单ID
    apId: null,
    // 分享页面 CODE
    code: '',
    // 用户名称
    name: '',
    // 用户手机
    phone: ''
  }
}

export default {
  name: 'createShareUserDialog',
  emits: ['submitSuccess', 'close'],
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
              } {
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
        const { token, uID: uid } = sessFun.getSess()
        this.dialogLoading = true
        const res = await this.$api.postApi_json('/addsp/api/v1/share/admin/user/create', {
          ...this.formData,
          uid,
          token,
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
        this.dialogLoading = false
      }
    },
    /**
     * 重置数据
     */
    handleReset() {
      this.formData = initFormData()
      this.$refs['formRef'] && this.$refs['formRef'].clearValidate()
    },
    /**
     * 打开弹框
     */
    open({ apId, code, id, name = '', phone = '' }) {
      if (!apId || !code) return console.error('open error: apId, code 不能为空')
      if (id) {
        this.isEdit = true
        this.formData = {
          ...this.formData,
          apId, code, id, name, phone
        }
      } else {
        this.formData = {
          ...this.formData,
          apId, code
        }
        this.isEdit = false
      }
      this.visible = true
    },
    /**
     * 关闭弹框
     */
    close() {
      if (this.visible) {
        this.handleReset()
        this.$emit('close')
        this.visible = false
      }
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
