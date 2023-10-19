<template>
  <div class="dialog_container">
    <!-- 巡点配置组件 -->
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

            <el-form-item label="巡点表单配置：" prop="templateId">
              <el-select v-model="formData.templateId" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="(cell, j) in preparedData.patrolPointOptions"
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

import { Message } from "element-ui";
import api from "../../../../api/api.js";

/**
 * 初始化表单数据
 */
const initFormData = () => {
  return {
    templateId: null,
    companyId: null
  }
}

export default {
  name: 'patrolPointDialog',
  emits: ['submitSuccess', 'close'],
  data() {
    return {
      formData: initFormData(),
      formRules: {
        patrolPoint: [
          { required: true, trigger: 'blur', message: '请选择巡点表单配置' }
        ]
      },
      dialogLoading: false,
      isEdit: false,
      visible: false,
      preparedData: {
        patrolPointOptions:[]
      }
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
        const res = await api.postApi_json('/addsp/patrolPoint/web/setTemplateRel', this.formData)
        const { SysCode: code, MSG: message} = res.data
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
     async getPatrolPointOptions() {
      if (!this.formData.companyId) return console.error('getDetail error: id 不能为空')
       try {
        this.dialogLoading = true
        const res = await api.getApi(`/addsp/patrolPoint/web/getTemplateList?companyId=${this.formData.companyId}`)
        const { SysCode: code, MSG: message, data } = res.data
        if (code !== 200200) return Message.error(message || '获取模板列表失败')
        this.preparedData.patrolPointOptions = data.items
        this.formData.templateId = data.id
      } catch (err) {
        Message.error(String(err) || '获取模板列表失败')
        console.error('getDetail error:', err)
      } finally {
        this.dialogLoading = false
      }
    },
    /**
     * 打开弹框
     */
    open(row) {
      this.formData.companyId = row.asrID
      this.getPatrolPointOptions()
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
