<!--
 * @Author: penglei
 * @Date: 2021-06-28 09:17:27
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-12 17:38:43
 * @FilePath: /frontend/src/components/develop/components/nextContractDialog.vue
-->
<template>
  <!-- 合同续签 -->
  <el-dialog
    title="续签合同"
    :visible.sync="mergeVisible"
    width="388px"
    top="22vh"
    :show-close="false"
    :close-on-click-modal="false"
    custom-class="custom-dialog-wrapper adjust-dialog"
  >
    <div class="content-form">
      <el-select
        multiple
        placeholder="请选择合同对象（可多选）"
        v-model="mergeOriginList"
        size="small"
      >
        <el-option
          v-for="(item, index) in contractOriginList"
          :key="index"
          :label="item.originName"
          :value="item.dcID + ',' + item.originID"
        >
        </el-option>
      </el-select>
    </div>

    <template slot="footer">
      <el-button @click="$emit('update:mergeVisible', false)">取 消</el-button>
      <el-button type="primary" @click="routeNextContract">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import api from "../../../api/api";
export default {
  name: "nextContractDialog",
  props: {
    mergeVisible: {
      type: Boolean,
      default: () => false,
    },
    currentContract: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 合同对象列表
      contractOriginList: [],
      // 需要合并的合同对象
      mergeOriginList: [],
    };
  },
  watch: {
    mergeVisible(val) {
      val && this.getOriginList();
    },
  },
  created() {},
  mounted() {},
  methods: {
    // 获取可续签的合同对象
    getOriginList() {
      this.mergeOriginList = [];
      api
        .getApi("/addsp/devContract/getOriginList", {
          resID: this.currentContract.resID,
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.contractOriginList = res.data.data || [];
            if (this.currentContract.id && this.currentContract.originID) {
              let dcIDAndOriginID = `${this.currentContract.id},${this.currentContract.originID}`;
              for (let i = 0; i < this.contractOriginList.length; i++) {
                let originItem = this.contractOriginList[i];
                if (
                  dcIDAndOriginID == `${originItem.dcID},${originItem.originID}`
                ) {
                  this.mergeOriginList = [dcIDAndOriginID];
                }
                break;
              }
            }
          } else {
            this.$message.warning(res.data.MSG || "");
          }
        });
    },
    // 验证是否可以续签和补签
    valiateNextContract(originIDs) {
      return new Promise((resolve, reject) => {
        api
          .getApi("/addsp/devContract/valiateNextContract", {
            originIDs,
          })
          .then((res) => {
            if (res.data.SysCode == 200200) {
              resolve(res.data.data);
            } else {
              this.$message.warning("尚有续签/补充协议申请未完成！");
              resolve(false);
            }
          })
          .catch((error) => {
            resolve(false);
          });
      });
    },
    // 调转到合同续签
    async routeNextContract() {
      if (this.mergeOriginList.length > 0) {
        let originIDs = [],
          dcIDs = [];
        this.mergeOriginList.forEach((item) => {
          item = item.split(",");
          dcIDs.push(item[0] || "");
          originIDs.push(item[1] || "");
        });
        dcIDs = dcIDs.join(",");
        originIDs = originIDs.join(",");
        let date = await this.valiateNextContract(originIDs);
        date &&
          this.$router.push({
            path: "./nextContract",
            query: { dcID: dcIDs, originID: originIDs, handleType: 1, date },
          });
      } else {
        this.$message.warning("请选择合同对象！");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .adjust-dialog {
  border-radius: 4px;
  .el-dialog__header {
    padding: 16px 24px 24px;
    border: none !important;
    font-weight: 600;
  }
  .el-dialog__body {
    border: none !important;
    .content-form {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 24px;
    }
    .el-select {
      width: 100%;
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