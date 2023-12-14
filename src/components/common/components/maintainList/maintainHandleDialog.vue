<template>
  <div class="dialog_container">
    <!-- 媒体维护-历史记录-处理弹框组件 -->
    <el-dialog
      :visible.sync="visible"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="dialogTitle"
      width="470px"
      @closed="close"
    >
      <div v-loading="dialogLoading" class="dialog_content">
        <div class="custom_dialog_body">
          <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" size="small" class="form">
            <el-form-item label="处理日期" prop="updateTime">
              <el-date-picker
                v-model="formData.updateTime"
                :picker-options="datePickerOptions"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                clearable
                placeholder="请选择出现时间"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item :label="dialogTitle === '维修处理' ? '处理说明' : '媒体备注'" prop="feedback">
              <el-input
                v-model="formData.feedback"
                :autosize="{ minRows: 2, maxRows: 4 }"
                :maxlength="100"
                show-word-limit
                type="textarea"
                clearable
                placeholder="请填处理说明"
                size="small"
                resize="none"
                class="textarea_box"
              ></el-input>
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
import sessFun from "@/commonFun/sessFun.js";
import dayjs from "dayjs";

/**
 * 初始化表单数据
 */
const initFormData = () => {
  return {
    updateTime: null,
    feedback: null,
    recordId: null
  }
}

export default {
  name: 'maintainHandleDialog',
  emits: ['submitSuccess', 'close'],
  data() {
    return {
      visible: false,
      dialogLoading: false,
      formData: initFormData(),
      formRules: {
        updateTime: [{ required: true, message: '请选择出现时间', trigger: 'blur' }],
        feedback: [{ required: true, message: '请填处理说明', trigger: 'blur' }],
      },
      typeName: '',
      datePickerOptions: {
        disabledDate: (t) =>  dayjs().isBefore(t, 'day')
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.typeName === '巡点' ? '巡点处理' : '维修处理'
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
        const res = await this.$request.postApi_new(this.apiVar.Media, {
          uid,
          token,
          service: "UpdateMediaMaintenanceAction",
          data: this.formData
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
     * 打开弹框
     */
    open(row) {
      if (!row) return console.error('打开弹框时，请携带 row 参数')
      this.formData.recordId = row.recordId
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
.dialog_container {
  /deep/ .el-dialog__body {
    padding: 0;
  }
  .custom_dialog_footer{
    padding: 10px 20px 20px;
  }
  .textarea_box {
    width: 100%;
    max-height: 100px;
  }
}
</style>
