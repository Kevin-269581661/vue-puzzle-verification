<template>
  <div class="dialog_container">
    <!-- 弹框模板组件 -->
    <el-dialog
      :visible.sync="visible"
      :append-to-body="true"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="`${isEdit ? '编辑' : '新建'}模板弹框`"
      width="60%"
      @closed="close"
    >
      <div v-loading="dialogLoading" class="dialog_content">
        <div class="custom_dialog_body">
          <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" size="small" class="form">
            <el-form-item label="示例一：" prop="propOne">
              <el-input v-model="formData.propOne" placeholder="请输入" clearable></el-input>
            </el-form-item>

            <el-form-item label="示例二：" prop="propTwo">
              <el-select v-model.trim="formData.propTwo" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="(cell, j) in preparedData.propTwoOptions"
                  :key="cell.val"
                  :value="cell.val"
                  :label="cell.label"
                />
              </el-select>
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
/*

vue2 通用弹窗组件模板

  使用方法：全部复制，粘贴，根据业务需求修改，多余的删掉

  属性：
    preparedData

  事件：
    @close // 当弹窗关闭
    @submitSuccess // 当提交成功

  父组件调用（采用调用方法的方式打开，保证数据传递及时性，以及方便控制打开时的初始化逻辑处理，且父组件无需维护多余子组件的变量）：

    组件标签：
    <FormDialog ref='formDialogRef' :preparedData="formDialogPreparedData" @close="onClose" @submitSuccess="onSubmitSuccess"/>

    打开：
    this.$refs.formDialogRef && this.$refs.formDialogRef.open() // 新增
    this.$refs.formDialogRef && this.$refs.formDialogRef.open(row) // 编辑

    关闭：
    this.$refs.formDialogRef && this.$refs.formDialogRef.close()

 */

import { Message } from "element-ui";
// import { cloneDeep } from "lodash";
import sessFun from "@/commonFun/sessFun.js";

/**
 * 初始化表单数据
 */
const initFormData = () => {
  return {
    propOne: null,
    propTwo: null
  }
}

export default {
  name: 'formDialog',
  emits: ['submitSuccess', 'close'],
  props: {
    preparedData: {
      type: Object,
      default: () => {
        return {
          propTwoSelectList: []
        }
      }
    }
  },
  data() {
    return {
      visible: false,
      dialogLoading: false,
      isEdit: false,
      formData: initFormData(),
      formRules: {
        propOne: [{ required: true, message: '请输入示例一', trigger: 'blur' }],
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
      preparedData: {

      }
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
        const res = await this.$api.postApi_json('/addsp/patrolPoint/web/getList', {
          ...this.formData,
          uid,
          token,
        })
        const { SysCode: code, MSG: message, data } = res.data
        if (code !== 200200) return Message.error(message || '操作失败')
        Message.success('操作成功')
        this.$emit('submitSuccess')
        this.close()
      } catch (err) {
        Message.error(String(err) || '操作失败')
        console.error('onSubmit error:', err)
      } finally {
        this.dialogLoading = false
      }
    },
    /**
     * 获取详情
     */
    async getDetail(id) {
      if (!id) return console.error('getDetail error: id 不能为空')
      try {
        this.dialogLoading = true
        const res = await this.$api.getApi('/aaaa/bbbb', { id })
        const { SysCode: code, MSG: message, data = [] } = res.data
        if (code !== 200200) return Message.error(message || '获取数据失败')
        this.formData = data
      } catch (err) {
        Message.error(String(err) || '获取数据失败')
        console.error('getDetail error:', err)
      } finally {
        this.dialogLoading = false
      }
    },
    /**
     * 打开弹框
     * （弹框打开时调用，一些弹框打开时的初始化处理可以在此方法内进行，譬如：通过 row.id 请求详情...）
     */
    open(row) {
      if (row) {
        this.isEdit = true
        this.formData = {
          ...this.formData,
          ...row
        }
        // 根据 id 获取详情，二选一
        // this.getDetail(row.id)
      } else {
        this.isEdit = false
      }
      this.visible = true
    },
    /**
     * 关闭弹框
     */
    close() {
      if (this.visible) {
        this.formData = initFormData()
        this.$refs['formRef'].clearValidate()
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

.dialog_container {
  .custom_dialog_footer{
    padding: 10px 20px 20px;
  }
}
</style>
