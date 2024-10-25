<!-- 模板-弹框组件 -->
<template>
  <el-dialog
    width="60%"
    append-to-body
    show-close
    :title="`${isEdit ? '编辑' : '新建'}模板弹框`"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="afterClose"
  >
    <div v-loading="loading" class="dialog_content">
      <div class="custom_dialog_body">
        <el-form ref="formRef" class="form" label-width="120px" size="small"  :model="formData" :rules="formRules">
          <el-form-item label="示例一：" prop="propOne">
            <el-input v-model.trim="formData.propOne" placeholder="请输入" clearable maxlength="100"></el-input>
          </el-form-item>

          <el-form-item label="示例二：" prop="propTwo">
            <el-select v-model="formData.propTwo" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in preparedData.propTwoOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
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
    propOne: null,
    propTwo: null
  }
}

export default {
  name: 'failListDialog',
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
        propOne: [{ required: true, message: '请输入示例一', trigger: 'blur' }],
        // 特殊校验
        propTwo: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请选择示例二'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      // 预加载数据
      // preparedData: {
      //   propTwoOptions: []
      // }
    }
  },
  methods: {
    /**
     * 提交表单
     */
    async onSubmit() {
      if (this.loading) return
      // try {
      //   const isPass = await this.$refs['formRef'].validate()
      //   if (!isPass) return
      // } catch (err) {
      //   return
      // }
      // try {
      //   this.loading = true
      //   const res = await this.$request.postApi_json('/addsp/api/xxxxx', {
      //     ...this.formData,
      //     uid,
      //     token,
      //   })
      //   const { SysCode: code, MSG: message, data } = res.data || {}
      //   if (code !== 200200) return this.$message.error(message || '操作失败')
      //   this.$message.success('操作成功')
      //   this.$emit('submitSuccess')
      //   this.close()
      // } catch (err) {
      //   this.$message.error(String(err) || '操作失败')
      //   console.error('onSubmit error:', err)
      // } finally {
      //   this.loading = false
      // }
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

</style>
