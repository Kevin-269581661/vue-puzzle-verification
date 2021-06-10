<!--
 * @Author: penglei
 * @Date: 2021-06-09 16:28:22
 * @LastEditors: penglei
 * @LastEditTime: 2021-06-10 16:17:52
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
              v-model="scope.row.time"
              controls-position="right"
              size="mini"
              :min="0"
              :max="100"
              :precision="0"
              :step="1"
              step-strictly
            ></el-input-number>
            <span>{{ `${scope.row.timeUnit}` }}</span>
          </div>
          <div v-else>
            <span>{{
              `${scope.row.warnTxt}${scope.row.time}${scope.row.timeUnit}`
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column key="3" prop="operate" label="操作" width="198">
        <template slot-scope="scope">
          <div v-if="scope.row.operate" class="operate-column">
            <span class="operate-column-btn" @click="saveFiled(scope.row)"
              >保存</span
            >
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
export default {
  name: "warnCfg",
  props: {},
  data() {
    return {
      tableData: [
        {
          content: "合同即将到期",
          warnTxt: "距合同到期日期剩余",
          time: 8,
          timeUnit: "天",
          operate: true,
        },
        {
          content: "场地费待支付",
          warnTxt: "距场地费待支付剩余",
          time: 8,
          timeUnit: "天",
          operate: false,
        },
        {
          content: "开发费待支付",
          warnTxt: "距开发费待支付剩余",
          time: 8,
          timeUnit: "天",
          operate: true,
        },
      ],

      loading: false,
      totalNum: 0,
    };
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {
    saveFiled(row) {
      console.log("save--", row);
    },
    editFiled(row) {
      row.operate = true;
      console.log("edit--");
    },
    cancelEditFiled(row) {
      console.log("cancelEditFiled--");
      row.operate = false;
    }
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
          width: 64px;
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
        cursor: default;
      }
    }
  }
}
</style>
