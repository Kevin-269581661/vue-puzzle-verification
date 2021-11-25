<template>
  <el-dialog
    title="回收站"
    :visible="true"
    width="688"
    :before-close="handleClose"
    top="12vh"
  >
    <el-table :data="tableData" v-loading="loading" border class="m-table">
      <el-table-column property="apName" label="方案名称"></el-table-column>
      <el-table-column property="apcTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ formatTime(scope.row.apcTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column property="apdTime" label="删除时间">
        <template slot-scope="scope">
          <span>{{ formatTime(scope.row.apdTime, true) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="95">
        <template slot-scope="scope">
          <el-popconfirm
            title="确定还原该方案？"
            @confirm="restoreAdPlan(scope.row)"
          >
            <span slot="reference" class="opt">恢复</span>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="pagination clearfix">
      <el-pagination
        class="fr"
        :total="total"
        :page-size="searchParams.pageSize"
        :current-page.sync="searchParams.start"
        layout="total, prev, pager, next"
        :background="true"
        @current-change="handleCurrentPageChange"
      >
      </el-pagination>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import api from "../../../api/api.js";
import sessFun from "../../../commonFun/sessFun.js";
// 时间格式化
import dateFormat from "../../../commonFun/timeFormat.js";

export default {
  name: "recycleBinDialog",

  props: ['visible'],

  data () {
    return {
      tableData: [],
      loading: false,
      total: 0,
      searchParams: {
        pageSize: 10,
        start: 1
      },

      sessionData: {}
    }
  },

  created () {
    this.getSessionData()
  },

  mounted () {
    this.getData()
  },

  methods: {
    handleClose () {
      this.$emit('update:visible', false)
    },

    handleCurrentPageChange () {
      this.getData()
    },

    getData () {
      this.loading = true
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        start: this.searchParams.start,
        pagesize: this.searchParams.pageSize
      }
      api.postApi(this.apiVar.Advertisement + "/GetDeletedAdPlan", info).then(res => {
        this.loading = false
        if (res.status === 200) {
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          sessFun.messageFun('warning', res.statusText || '获取数据失败')
        }
      }).catch(() => {
        sessFun.messageFun('warning', res.statusText || '获取数据失败')
      })
    },

    // 还原方案
    restoreAdPlan (row) {
      console.log(row, 'rowrowrow')
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apid: row.apID
      }
      api.postApi(this.apiVar.Advertisement + "/RestoreDeletedAdPlan", info).then(res => {
        if (res.status === 200) {
          this.searchParams.start = 1
          this.getData()
          this.$emit('confirm')
          sessFun.messageFun('success', '方案已恢复')
        } else {
          sessFun.messageFun('warning', res.statusText || '方案恢复失败')
        }
      }).catch(() => {
          sessFun.messageFun('warning', res.statusText || '方案恢复失败')
      })
    },

    getSessionData () {
      this.sessionData = sessFun.getSess()
    },

    // 时间格式化
    formatTime (val, isNeedMinute = false) {
      if (!isNeedMinute) {
        return dateFormat.toDate(val, '/');
      } else {
        return dateFormat.toDateTime(new Date(val), '/');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m-table {
  width: 100%;
  /deep/ table {
    width: 100% !important;
    th {
      background: #fafafa;
      height: 46px;
      & > .cell {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }
  /deep/ .el-table__empty-block {
    width: 100% !important;
  }
}

.pagination {
  padding: 16px 0 24px 0;
  display: flex;
  justify-content: flex-end;
}

.opt {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #1890ff;
  cursor: pointer;
}

/deep/.el-pagination {
  padding: 0;
  button:last-of-type {
    margin-right: 0;
  }
}

/deep/ .el-dialog__body {
  padding: 24px;
  padding-bottom: 0;
}

/deep/ .el-dialog__footer {
  padding: 11px 24px;
  border-top: 1px solid #e9e9e9;
}

/deep/ .el-table__row {
  .cell {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
  }
}

/deep/ .el-table tr td {
  height: 46px;
  padding: 0;
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #e9e9e9;
  padding: 15px 24px;
  .el-dialog__title {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
}
</style>