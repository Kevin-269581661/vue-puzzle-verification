<!-- 新建客户监播-弹窗 -->
<template>
  <el-dialog
    width="500px"
    append-to-body
    show-close
    :title="`${isEdit ? '编辑' : '新建'}监播`"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="afterClose"
  >
    <div v-loading="loading" class="dialog_content">
      <div class="custom_dialog_body">
        <el-form ref="formRef" class="form" label-width="130px" size="small"  :model="formData" :rules="formRules">
          <el-form-item label="标题：" prop="title">
            <el-input v-model.trim="formData.title" placeholder="请输入标题" clearable maxlength="100"></el-input>
          </el-form-item>

          <el-form-item label="所属客户公司：" prop="cId">
            <el-input v-if="isEdit" v-model="formData.companyName" size="small" disabled></el-input>
            <el-select
              v-else
              v-model="formData.cId"
              placeholder="请选择所属客户公司"
              filterable
              clearable
              style="width: 100%"
              @change="handleChangeCId"
            >
              <el-option
                v-for="item in customerCompanyOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="所属客户品牌：" prop="bIds">
            <el-input v-if="isEdit" v-model="formData.brandName" size="small" disabled></el-input>
            <el-select
              v-else
              v-model="formData.bIds"
              placeholder="请选择所属客户品牌"
              multiple
              filterable
              clearable
              style="width: 100%"
              :disabled="!formData.cId"
            >
              <el-option
                v-for="item in customerBrandOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="自动添加开启：" prop="autoAddStatus">
            <div class="item_box">
              <el-radio-group v-model="formData.autoAddStatus">
                <el-radio
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
              <div class="desc">注：开启后，如创建新订单属于本人且同客户公司及品牌会自动加入此监播项目</div>
            </div>
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
import sessFun from "@/commonFun/sessFun.js";

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    id: null,
    title: '',
    cId: null,
    bIds: [],
    companyName: '',
    brandName: '',
    // 自动添加状态：0-关闭 1-开启
    autoAddStatus: 0,
  }
}

export default {
  name: 'monitoringFormDialog',
  emits: ['submitSuccess', 'afterClose'],
  props: {
    // 预加载数据（默认是由父组件传入，如果不是，则需要写在 data 里，并创建方法获取预加载数据）
    customerCompanyList: {
      type: Array,
      default: () => []
    },
    statusOptions: {
      type: Array,
      default: () => []
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
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        autoAddStatus: [{ required: true, message: '请选择是否自动添加开启', trigger: 'blur' }],
        // 特殊校验
        cId: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!this.isEdit && !value) {
                callback(new Error('请选择所属客户公司'))
              } else {
                callback()
              }
            }
          }
        ],
        bIds: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!this.isEdit && (!value || !value.length)) {
                callback(new Error('请选择所属客户品牌'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      customerBrandOptions: []
    }
  },
  computed: {
    customerCompanyOptions() {
      return this.customerCompanyList.map(item => {
        return {
          label: item.cName,
          value: item.cId
        }
      })
    }
  },
  methods: {
    handleChangeCId() {
      this.formData.bIds = []
      const current = this.customerCompanyList.find(it => it.cId === this.formData.cId)
      if (!current) return
      this.customerBrandOptions = (current.brandList || []).map(it => {
        return {
          label: it.bTitle,
          value: it.bId
        }
      })
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
        let res = null
        if (this.formData.id) {
          res = await this.$api.detecting.editItem({
            id: this.formData.id,
            title: this.formData.title,
            autoAddStatus: this.formData.autoAddStatus
          })
        } else {
          res = await this.$api.detecting.addItem({
            ...this.formData,
          })
        }
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
     * （弹框打开时调用，一些弹框打开时的初始化处理可以在此方法内进行，譬如：通过 row.id 请求详情...）
     */
    open(row) {
      if (this.visible) return
      this.visible = true
      if (row) {
        this.isEdit = true
        const { id, title, companyName, brandName, autoAddStatus } = row
        this.formData = {
          ...this.formData,
          id,
          title,
          companyName,
          brandName,
          autoAddStatus
        }
      }
    },
    /**
     * 关闭弹框
     * （可以处理一些收尾操作，如：清除定时器、事件监听等等）
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

.item_box {
  background: #fafafa;
  padding: 10px;
  border-radius: 4px;
  padding-left: 15px;
}

.desc {
  color: #F56C6C;
  color: 14px;
  line-height: 22px;
}

</style>
