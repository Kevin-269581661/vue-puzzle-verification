<!-- 订单/方案详情-导出点位明细-城市选择-弹框组件 -->
<template>
  <el-dialog
    width="800px"
    append-to-body
    show-close
    title="城市选择"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="afterClose"
  >
    <div v-loading="loading" class="dialog_content">
      <div class="custom_dialog_body">
        <el-form ref="formRef" class="form" label-width="120px" size="small"  :model="formData" :rules="formRules">
          <el-form-item label="类型：" prop="type">
            <el-radio-group v-model="formData.type" @change="handleChangeType">
              <el-radio-button v-for="(item, i) in preparedData.typeSelectList" :key="i" :label="item.value">
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="城市：" prop="regionIds">
            <div style="margin-bottom: 10px">
              <el-checkbox v-model="isCheckAll" :disabled="formData.type !== 2" @change="handleCheckAll">全选</el-checkbox>
            </div>
            <el-checkbox-group v-model="formData.regionIds" style="width: 100%" :disabled="formData.type !== 2">
              <el-row>
                <el-col v-for="(item, i) in cityList" :key="i" :span="8">
                  <el-checkbox :label="item.id">{{ item.name }}</el-checkbox>
                </el-col>
              </el-row>
            </el-checkbox-group>
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
    type: 1,
    regionIds: []
  }
}

export default {
  name: 'exportOrderCitySelectDialog',
  emits: ['submitSuccess', 'afterClose'],
  props: {
    cityList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      isEdit: false,
      formData: initFormData(),
      formRules: {
        // 通用校验
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        // 特殊校验
        regionIds: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.formData.type === 2 && (!value || !value.length)) {
                callback(new Error('请选择城市'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      // 预加载数据
      preparedData: {
        typeSelectList: [
          { label: '仅当前订单', value: 1 },
          { label: '按城市导出', value: 2 },
        ]
      },
      isCheckAll: false
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
        this.$emit('submitSuccess', { ...this.formData })
        this.close()
      } catch (err) {
        this.$message.error(String(err) || '操作失败')
        console.error('onSubmit error:', err)
      } finally {
        this.loading = false
      }
    },

    handleChangeType(val) {
      this.formData.regionIds = []
      this.isCheckAll = false
    },

    handleCheckAll() {
      if (this.isCheckAll) {
        this.formData.regionIds = this.cityList.map((item) => item.id)
      } else {
        this.formData.regionIds = []
      }
    },

    /**
     * 重置数据
     */
    afterClose() {
      this.isEdit = false
      this.isCheckAll = false
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
