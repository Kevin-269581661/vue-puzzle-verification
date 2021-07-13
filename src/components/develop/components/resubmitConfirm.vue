<!--
 * @Author: penglei
 * @Date: 2021-07-13 11:50:50
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-13 14:10:17
 * @FilePath: /frontend/src/components/develop/components/resubmitConfirm.vue
-->
<template>
  <!-- 重新提交审核 -->
  <el-dialog
    :visible.sync="resubmitVisible"
    width="388px"
    top="22vh"
    :show-close="false"
    :close-on-click-modal="false"
    custom-class="custom-confirm2-dialog"
  >
    <div slot="title"><i class="el-icon-question"></i>是否重新提交审核？</div>
    <div class="message-content">
      确定后，<span class="active">{{ currentContract.resName }}</span> 的
      <span class="active">{{
        `${contractTypeArr[currentContract.dcType] || ""}`
      }}</span>
      将被重新提交审核
    </div>

    <template slot="footer">
      <el-button @click="$emit('update:resubmitVisible', false)">取 消</el-button>
      <el-button v-preventReClick type="primary" @click="resubmitFun">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import mixin from "./mixins/minix";
import api from "../../../api/api";
export default {
  name: "resubmitConfirm",
  props: {
    resubmitVisible: {
      type: Boolean,
      default: () => false,
    },
    currentContract: {
      type: Object,
      default: () => {},
    },
  },
  mixins: [mixin],
  data() {
    return {};
  },
  methods: {
    resubmitFun() {
      api
        .postApi("/addsp/devContract/changeDCState", {
          dcID: this.currentContract.id,
          passState: 1,
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.$emit("update:resubmitVisible", false);
            this.$message.success(res.data.MSG || "重新提交成功！");
            this.$router.push("./contractList");
          } else {
            this.$message.warning(res.data.MSG || "");
          }
        });
    },
  },
};
</script>

<style lang="scss" scope>
.custom-confirm2-dialog {
  border-radius: 4px;
  .el-dialog__header {
    padding: 24px 24px 8px;
    border: none !important;
    font-weight: 600;
    text-align: left;
    .el-icon-question {
      margin-right: 16px;
      color: #fa8c16;
      &:before {
        font-size: 24px;
      }
    }
  }
  .el-dialog__body {
    padding: 0 24px;
    border: none !important;
    /* 重新提交和删除合同 */
    .message-content {
      padding-left: 40px;
      line-height: 22px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      & .active {
        color: #1890ff;
        font-weight: 600;
      }
    }
  }
  .el-dialog__footer {
    display: flex;
    justify-content: flex-end;
    padding: 24px;
    .el-button + .el-button {
      margin-left: 16px;
    }
  }
}
</style>