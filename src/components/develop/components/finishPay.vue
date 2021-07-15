<!--
 * @Author: penglei
 * @Date: 2021-06-29 11:19:58
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-07 22:17:38
 * @FilePath: /frontend/src/components/develop/components/finishPay.vue
-->
<template>
  <!-- 完成付款 -->
  <el-dialog
    title="完成付款"
    :visible.sync="finishPayVisible"
    width="388px"
    top="22vh"
    :show-close="false"
    :close-on-click-modal="false"
    custom-class="custom-dialog-wrapper custom-confirm-dialog"
  >
    <el-form
      v-model="finishPayForm"
      label-position="right"
      label-width="91px"
      class="content-form"
    >
      <el-form-item label="支付款项：">
        <el-input disabled :value="['场地费', '开发费', '其它'][payLog.payType-1]" size="small"> </el-input>
      </el-form-item>
      <el-form-item label="实付金额：">
        <el-input disabled :value="Number(payLog.actualPayTotal/100).toFixed(2)" size="small"></el-input>
      </el-form-item>
      <el-form-item label="已开票/收据：" prop="isReceipt ">
        <el-radio v-model="finishPayForm.isReceipt" label="1">是</el-radio>
        <el-radio v-model="finishPayForm.isReceipt" label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="付款日期：" prop="finishDate">
        <el-date-picker
          v-model="finishPayForm.finishDate"
          size="small"
          align="right"
          value-format="yyyy-MM-dd"
          placeholder="请选择付款日期"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>

    <template slot="footer">
      <el-button @click="$emit('update:finishPayVisible', false)"
        >取 消</el-button
      >
      <el-button type="primary" @click="finishPayFun">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import api from "../../../api/api";
export default {
  name: "finishPay",
  props: {
    payLog: {
      type: Object,
      default: () => {
        return { payType: 0, actualPayTotal: 0 };
      },
    },
    finishPayVisible: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      // 签约表单数据
      finishPayForm: {
        passState: 1,
        dcpID: "",
        finishDate: undefined,
        isReceipt: "0",
      },
    };
  },
  watch: {},
  mounted() {},
  methods: {
    // 完成付款
    finishPayFun() {
      this.finishPayForm.dcpID = this.payLog.id;
      if(!this.finishPayForm.finishDate) {
        this.$message.warning("请选择付款日期！");
        return;
      }
      api
        .postApi("/addsp/devContract/changePayState", this.finishPayForm)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.$emit("refreshPayLog");
            this.$emit("update:finishPayVisible", false);
            this.$message.success(res.data.MSG || "付款完成！");
          } else {
            this.$message.warning(res.data.MSG || "");
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>