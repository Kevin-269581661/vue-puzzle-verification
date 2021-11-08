<template>
  <el-dialog
    title="回收站"
    :visible="true"
    width="688"
    :before-close="handleClose"
  >
    <el-table :data="tableData" v-loading="loading" border class="m-table">
      <el-table-column property="name" label="方案名称"></el-table-column>
      <el-table-column property="createTime" label="创建日期"></el-table-column>
      <el-table-column property="deleteTime" label="删除时间"></el-table-column>
      <el-table-column label="操作" width="95">
        <template slot-scope="scope">
          <span class="opt">重新编辑</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="pagination clearfix">
      <el-pagination
        class="fr"
        :total="total"
        :page-size="searchParams.pageSize"
        :current-page.sync="searchParams.currentPage"
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
export default {
  name: "recycleBinDialog",

  props: ['visible'],

  data () {
    return {
      tableData: [
        {
          name: '招商银行广州分行10.16-12.17',
          createTime: '2021/10/08',
          deleteTime: '2021/10/10 08:26'
        }
      ],
      loading: false,
      total: 0,
      searchParams: {
        pageSize: 10,
        currentPage: 1
      }
    }
  },

  methods: {
    handleClose () {
      this.$emit('update:visible', false)
    },

    handleCurrentPageChange () {

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
</style>