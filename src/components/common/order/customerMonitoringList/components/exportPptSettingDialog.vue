<!-- 客户监播项目列表-订单管理-导出PPT管理-弹框组件 -->
<template>
  <el-dialog
    width="700px"
    append-to-body
    show-close
    title="导出PPT管理"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="afterClose"
  >
    <div v-loading="loading" class="dialog_content">
      <div class="custom_dialog_body">
        <el-form
          ref="formRef"
          class="form"
          label-width="120px"
          size="small"
          label-position="top"
          :model="formData"
          :rules="formRules"
        >

          <el-form-item label="选择开启导出PPT城市：" prop="codeList">
            <el-transfer
              v-model="formData.codeList"
              filterable
              filter-placeholder="请输入"
              :data="cityList"
              :filter-method="filterMethod"
              :props="{
                key: 'code',
                label: 'city'
              }"
              :titles="['待选列表', '已选列表']"
            >
            </el-transfer>
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
    // 客户监播项目id
    itemId: null,
    // 订单id
    apId: null,
    codeList: []
  }
}

export default {
  name: 'formDialog',
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
        codeList: [{ required: true, message: '请选择城市', trigger: 'blur' }],
      },
      cityList: []
    }
  },
  methods: {
    /**
     * 筛选
     */
    filterMethod(query, item) {
      return item.city.indexOf(query) > -1;
    },

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
        this.loading = true
        const res = await this.$api.detecting.setPPTStatus({
          ...this.formData
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
     * 获取详情
     */
    async getDetail() {
      try {
        this.loading = true
        const res = await this.$api.detecting.listPptStatus({ ...this.formData })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.cityList = (data || []).map(item => {
          return {
            ...item,
            city: item.isSystemOrder ? item.city : `${item.city}（非系统单）`
          }
        })
        this.formData.codeList = this.cityList.filter(it => it.status).map(it => it.code)
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
      this.cityList = []
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
        const { apId, itemId } = row
        this.formData = {
          ...this.formData,
          apId,
          itemId
        }
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
