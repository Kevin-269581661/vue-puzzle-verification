<!-- 设置方案金额-弹框组件 -->
<template>
  <el-dialog
    width="400px"
    append-to-body
    show-close
    title="设置方案金额"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="afterClose"
  >
    <div v-loading="loading" class="dialog_content">
      <div class="custom_dialog_body">
        <el-form ref="formRef" class="form" label-width="120px" size="small"  :model="formData" :rules="formRules">
          <el-form-item label="点位单价：" prop="unitPrice">
            <el-input v-model.number="formData.unitPrice" placeholder="请输入" clearable maxlength="7">
              <template slot="append">元/面·周</template>
            </el-input>
          </el-form-item>

          <div class="form__line"></div>

          <el-form-item label="现金结算：" prop="cash">
            <el-input v-model.number="formData.cash" placeholder="请输入" clearable maxlength="7">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>

          <el-form-item label="置换结算：" prop="displace">
            <el-input v-model.number="formData.displace" placeholder="请输入" clearable maxlength="7">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>

          <el-form-item label="其它结算：" prop="other">
            <el-input v-model.number="formData.other" placeholder="请输入" clearable maxlength="7">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>

          <el-form-item label="方案总价：">
            <div style="line-height: 32px">{{ totalPrice }}元</div>
          </el-form-item>

          <div class="form__line"></div>

          <el-form-item label="金额备注：" prop="settlementRemark">
            <el-input
              v-model="formData.settlementRemark"
              type="textarea"
              placeholder="请输入"
              clearable
              maxlength="500"
            ></el-input>
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
    apId: null,
    // 点位单价
    unitPrice: 0,
    // 现金结算
    cash: 0,
    // 置换结算
    displace: 0,
    // 其它结算
    other: 0,
    // 金额备注
    settlementRemark: ''
  }
}

export default {
  name: 'editPlanPriceDialog',
  emits: ['submitSuccess', 'afterClose'],
  props: {},
  data() {
    const PRICE_REGEX = /^\d+$/;
    const MAX_PRICE = 9999999;
    let validatPrice = (rule, value, callback) => {
      if (!value) return callback()
      // 检查输入值是否为正整数
      if (!PRICE_REGEX.test(value)) {
        callback(new Error("请输入正整数"));
        return;
      }
      // 将输入值转换为数字
      const numValue = parseInt(value, 10);
      // 检查输入值是否超过最大限制
      if (numValue > MAX_PRICE) {
        callback(new Error("预算不能大于9,999,999"));
        return;
      }
      // 如果所有检查都通过，调用回调函数
      callback();
    };

    return {
      visible: false,
      loading: false,
      isEdit: false,
      formData: initFormData(),
      formRules: {
        // 特殊校验
        unitPrice: [{ validator: validatPrice, trigger: "blur" }],
        cash: [{ validator: validatPrice, trigger: "blur" }],
        displace: [{ validator: validatPrice, trigger: "blur" }],
        other: [{ validator: validatPrice, trigger: "blur" }]
      },
    }
  },

  computed: {
    totalPrice() {
      return (
        (isNaN(this.formData.cash)? 0 : this.formData.cash * 1) +
        (isNaN(this.formData.displace)
         ? 0
          : this.formData.displace * 1) +
        (isNaN(this.formData.other)? 0 : this.formData.other * 1)
      ).toFixed(2)
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
        const { token, uID: uid } = sessFun.getSess()
        this.loading = true
        const res = await this.$api.proposal.updatePlanMoney({
          uid,
          token,
          apID: this.formData.apId,
          adsWeekFee: this.formData.unitPrice * 100,
          cashFee: this.formData.cash * 100,
          sendFee: this.formData.displace * 100,
          otherFee: this.formData.other * 100,
          remark: this.formData.settlementRemark
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
    open(apId) {
      if (this.visible) return
      this.visible = true
      if (apId) {
        this.formData.apId = apId
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
