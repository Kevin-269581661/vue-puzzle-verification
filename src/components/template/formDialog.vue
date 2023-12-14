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

// import { cloneDeep } from "lodash";
import sessFun from "@/commonFun/sessFun.js";

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
  name: 'formDialog',
  emits: ['submitSuccess', 'close'],
  props: {
    // 预加载数据（默认是由父组件传入，如果不是，则需要写在 data 里，并创建方法获取预加载数据）
    preparedData: {
      type: Object,
      default: () => {
        return {
          /*
            字段名 test
            预加载数据名 test + Options
            获取预加载数据方法名 get + Test + Options
           */
          propTwoOptions: []
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
      try {
        const isPass = await this.$refs['formRef'].validate()
        if (!isPass) return
      } catch (err) {
        return
      }
      try {
        const { token, uID: uid } = sessFun.getSess()
        this.dialogLoading = true
        const res = await this.$api.postApi_json('/addsp/api/xxxxx', {
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
     * 获取详情
     */
    async getDetail(id) {
      if (!id) return console.error('getDetail error: id 不能为空')
      try {
        this.dialogLoading = true
        const res = await this.$api.getApi('/aaaa/bbbb', { id })
        const { SysCode: code, MSG: message, data = [] } = res.data
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.formData = data
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getDetail error:', err)
      } finally {
        this.dialogLoading = false
      }
    },
    /**
     * 获取预加载数据
     */
     async getPropTwoOptions() {
      try {
        this.dialogLoading = true
        const res = await this.$api.getApi('/aaaa/bbbb')
        const { SysCode: code, MSG: message, data = [] } = res.data
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.preparedData.propTwoOptions = data
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getDetail error:', err)
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
      // this.getPropTwoOptions()
    },
    /**
     * 关闭弹框
     * （可以处理一些收尾操作，如：清除定时器、事件监听等等）
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

.dialog_content {
  .custom_dialog_footer{
    padding: 10px 20px 20px;
  }
}
</style>
