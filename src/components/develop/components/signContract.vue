<!--
 * @Author: penglei
 * @Date: 2021-06-29 09:48:56
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-08 11:20:41
 * @FilePath: /frontend/src/components/develop/components/signContract.vue
-->
<template>
  <!-- 完成签约 -->
    <el-dialog
      title="完成签约"
      :visible.sync="signVisible"
      width="388px"
      top="22vh"
      :show-close="false"
      :close-on-click-modal="false"
      custom-class="custom-dialog-wrapper custom-confirm-dialog"
    >
        <el-form v-model="signContractForm" label-width="70px" class="content-form">
          <el-form-item label="合同编号：" prop="contractNo">
            <el-input
              placeholder="请输入合同编号"
              v-model.trim="signContractForm.contractNo"
              size="small"
              :disabled="currentContract.dcType==3"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="签约日期：" prop="signDate">
            <el-date-picker
              v-model="signContractForm.signDate"
              size="small"
              align="right"
              value-format="yyyy-MM-dd"
              placeholder="请选择续合同签约日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>

      <template slot="footer">
        <el-button @click="$emit('update:signVisible', false)">取 消</el-button>
        <el-button type="primary" @click="signContractFun">确 定</el-button>
      </template>
    </el-dialog>
</template>

<script>
import api from "../../../api/api";
export default {
  name: "signContract",
  props: {
    currentContract: {
      type: Object,
      default: () => {},
    },
    signVisible: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      // 签约表单数据
      signContractForm: {
        passState: 1,
        signDate: undefined,
        contractNo: ""
      },
    };
  },
  watch: {
    currentContract(val) {
      if(val.contractNo && val.dcType==3) {
        this.signContractForm.contractNo = val.contractNo;
      }
    }
  },
  mounted() {},
  methods: {
    // 合同签约
    signContractFun() {
      console.log("signContractForm---", this.signContractForm);
      if(this.signContractForm.signDate && this.signContractForm.contractNo) {
        api
        .postApi("/addsp/devContract/changeDCState", {
          ...this.signContractForm,
          dcID: this.currentContract.id
        }).then((res) => {
          if (res.data.SysCode == 200200) {
            this.$emit("update:signVisible", false);
            this.$emit("refreshList");
            this.$message.success(res.data.MSG || "签约成功！");
          } else {
            this.$message.warning(res.data.MSG || "");
          }
        });
      } else {
        this.$message.warning("请完善签约内容！")
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>