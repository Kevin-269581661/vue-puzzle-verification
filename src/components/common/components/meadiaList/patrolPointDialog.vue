<template>
  <div class="dialog_container">
    <!-- 弹框模板组件 -->
    <el-dialog
      :visible.sync="visible"
      :append-to-body="true"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="巡点配置"
      width="600px"
      @closed="close"
    >
      <div v-loading="dialogLoading" class="dialog_content">
        <div class="custom_dialog_body">
          <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px" size="small" class="form">

            <el-form-item label="巡点表单配置：" prop="patrolPoint">
              <el-select v-model="formData.patrolPoint" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="(cell, j) in formData.patrolPointList"
                  :key="cell.id"
                  :value="cell.id"
                  :label="cell.name"
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
import api from "../../../../api/api.js";

/**
 * 初始化表单数据
 */
const initFormData = () => {
  return {
    patrolPoint:null,
    patrolPointList: null
  }
}

export default {
  name: 'formDialog',
  emits: ['submitSuccess', 'close'],
  data() {
    return {
      formData: initFormData(),
      formRules: {
        patrolPoint: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              console.log(value);
              if (!value) {
                callback(new Error('请选择巡点表单配置'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      dialogLoading: false,
      isEdit: false,
      visible: false,
      companyId: null,
    }
  },
  methods: {
    /**
     * 提交表单
     */
    async onSubmit() {
      console.log(this.formData);
      try {
        const isPass = await this.$refs['formRef'].validate()
        if (!isPass) return
      } catch (err) {
        return
      }
      try {
        this.dialogLoading = true
        let params = {
          templateId: this.formData.patrolPoint,
          companyId: this.companyId
        }
        api.postApi_json('/addsp/patrolPoint/web/setTemplateRel', params).then(res => {
          console.log(res);
          if (res.data.SysCode === 200200) {
            Message.success('操作成功')
            this.$emit('submitSuccess')
            this.close()
          } else {
            Message.error(res.MSG || '操作失败')
          }
        })
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
        const { code, data, message } = await this.$api.apiModule.getById({ id }) || {}
        if (code !== 200) return Message.error(message || '获取数据失败')
        this.formData = data
      } catch (err) {
        Message.error(String(err) || '获取数据失败')
        console.error('getDetail error:', err)
      } finally {
        this.dialogLoading = false
      }
    },
    /**
     * 打开弹框（弹框打开时调用，一些弹框打开时的初始化处理可以在此方法内进行，譬如：通过 row.id 请求详情...）
     */
    open(row) {
      this.companyId = row.asrID
      api.getApi(`/addsp/patrolPoint/web/getTemplateList?companyId=${row.asrID}`).then(res => {
        console.log(res.data)
        this.formData.patrolPointList = res.data.data.items
        this.formData.patrolPoint = res.data.data.id
      })
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
.custom_dialog_footer{
  padding: 10px 20px 20px;
}
</style>
