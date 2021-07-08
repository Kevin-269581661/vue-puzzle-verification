<!--
 * @Author: penglei
 * @Date: 2021-06-09 16:28:22
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-08 21:55:02
 * @FilePath: /frontend/src/components/develop/components/warnCfg.vue
-->
<template>
  <div>
    <h1 class="custom-title">合同预警</h1>
    <el-table
      :data="tableData"
      style="width: 100%"
      height="500px"
      v-loading="loading"
      element-loading-text="玩命加载中..."
      element-loading-spinner="el-icon-loading"
      class="custom-filed-table"
      border
    >
      <el-table-column
        key="1"
        prop="content"
        label="预警内容"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column
        key="2"
        prop="warnTxt"
        label="预警设置"
        min-width="450px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div v-if="scope.row.operate">
            <span>{{ `${scope.row.warnTxt}` }}</span>
            <el-input-number
              v-model="scope.row.tempDayCnt"
              controls-position="right"
              size="mini"
              :min="0"
              :max="365"
              :precision="0"
              :step="1"
              step-strictly
            ></el-input-number>
            <span>{{ `${scope.row.timeUnit}` }}</span>
          </div>
          <div v-else>
            <span>{{
              `${scope.row.warnTxt} ${scope.row.dayCnt} ${scope.row.timeUnit}`
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column key="3" prop="operate" label="操作" width="198">
        <template slot-scope="scope">
          <div v-if="scope.row.operate" class="operate-column">
            <span class="operate-column-btn" @click="saveFiled(scope.row)"
              >保存</span
            >&nbsp;
            <span class="operate-column-btn" @click="cancelEditFiled(scope.row)"
              >取消</span
            >
          </div>
          <div v-else class="operate-column">
            <span class="operate-column-btn" @click="editFiled(scope.row)"
              >编辑</span
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import api from "../../../api/api";
export default {
  name: "warnCfg",
  props: {},
  data() {
    return {
      tableData: [
        {
          warnType: 1,
          content: "合同即将到期",
          warnTxt: "距合同到期日期剩余",
          dayCnt: "--",
          tempDayCnt: "",
          timeUnit: "天",
          operate: false,
        },
        {
          warnType: 2,
          content: "场地费待支付",
          warnTxt: "距场地费待支付剩余",
          dayCnt: "--",
          tempDayCnt: "",
          timeUnit: "天",
          operate: false,
        },
        {
          warnType: 3,
          content: "开发费待支付",
          warnTxt: "距开发费待支付剩余",
          dayCnt: "--",
          tempDayCnt: "",
          timeUnit: "天",
          operate: false,
        },
      ],
      loading: false,
      totalNum: 0,
    };
  },
  watch: {},
  computed: {},
  mounted() {
    // 获取该用户合同预警设置
    this.getWarnList();
  },
  methods: {
    // 获取该用户合同预警设置
    getWarnList() {
      api.getApi("/addsp/devContractWarn/warnList").then((res) => {
        if (res.data.SysCode == 200200) {
          (res.data.data || []).forEach((item) => {
            if (item.warnType > 0) {
              let rowIndex = this.tableData.findIndex(
                (rowData) => rowData.warnType == item.warnType
              );
              if (rowIndex != -1) {
                this.tableData[rowIndex].dayCnt = item.dayCnt;
                this.tableData[rowIndex].tempDayCnt = item.dayCnt;
                this.tableData[rowIndex].id = item.id;
              }
            }
          });
        } else {
          this.$message.warning(res.data.MSG || "获取预警信息失败！");
        }
      });
    },
    saveFiled(row) {
      console.log("save--", row);
      if (row.tempDayCnt) {
        // 预警类型，1-合同到期预警 2-场地费预警 3-开发费预警
        api
          .postApi("/addsp/devContractWarn/createWarn", {
            warnType: row.warnType,
            dayCnt: row.tempDayCnt,
            id: row.id || "",
          })
          .then((res) => {
            if (res.data.SysCode == 200200) {
              row.dayCnt = row.tempDayCnt;
              row.operate = false;
              this.getWarnList()
              this.$message.success(res.data.MSG || "保存成功！");
            } else {
              this.$message.warning(res.data.MSG || "保存失败！");
            }
          });
      } else {
        this.$message.warning("请先完成填写！");
      }
    },
    editFiled(row) {
      row.operate = true;
    },
    cancelEditFiled(row) {
      row.operate = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-title {
  text-align: left;
  padding-bottom: 24px;
}

/deep/ .custom-filed-table.el-table tr {
  th,
  td {
    // height: 46px;
    .cell {
      // height: 25px;
      // line-height: 25px;
      .el-input-number {
        width: unset;
        // line-height: 24px;
        margin: 0;
        .el-input__inner {
          width: 88px;
          // height: 24px;
          padding: 0 28px 0 8px;
          // line-height: 24px;
          text-align: center;
        }
      }
    }
    .operate-column {
      color: #1890ff;
      .operate-column-btn {
        cursor: pointer;
      }
    }
  }
}
</style>
