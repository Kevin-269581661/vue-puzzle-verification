<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="adjust-dialog"
    center>
    <div>
      <slot name="topTip"></slot>
      <el-table
        :data="currentPagination"
        style="width: 100%"
        v-loading="loading"
        element-loading-text="玩命加载中..."
        element-loading-spinner="el-icon-loading"
        border
      >
        <slot name="aheadColumn"></slot>
        <el-table-column
          v-for="(item, index) in tableColumn"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :minWidth="item.minWidth"
          :show-overflow-tooltip="item.tip"
          :align="item.align"
        >
        </el-table-column>
        <slot name="otherColumn"></slot>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 2, 50, 100, 300]"
        :page-size="currentPageSize"
        :pager-count="5"
        class="pagination"
        layout="total, prev, pager, next, sizes, jumper"
        :total="totalNum"
      >
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <slot name="dialogFooter">
        <el-button @click="handleClose">取 消</el-button>
      </slot>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "dialogTable",
  props: {
    visible: {
      type: Boolean,
      default: () => false,
    },
    title: {
      type: String,
      default: () => "",
    },
    width: {
      type: String,
    },
    tableColumn: {
      type: Array,
      default: () => [],
    },
    tableData: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      loading: false,
      currentPageSize: 1,
      currentPage: 1,
      totalNum: 0,
    };
  },
  watch: {
  },
  computed: {
    currentPagination() {
      console.time('Pagination')
      this.totalNum = this.tableData.length;
      let temp = this.tableData.slice(
        (this.currentPage - 1) * this.currentPageSize,
        this.currentPage * this.currentPageSize
      );
      console.timeEnd('Pagination')
      return temp
    },
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit('closeDialog')
    },
    handleSizeChange(val) {
      this.currentPageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    }
  },
};
</script>

<style lang="scss" scoped>
/deep/ .adjust-dialog {
  .el-dialog__header {
    text-align: left;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
  }
  .el-dialog__header {
    padding: 16px 24px;
  }
  .el-dialog__body {
    padding: 24px;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
  }
  .el-dialog__footer {
    padding: 11px;
  }
  .el-table tr {
    th, td {
      height: 46px;
      .cell {
        height: 25px;
        line-height: 25px;
      }
    }
    .el-table__expanded-cell[class*=cell] {
      padding: 0;
    }
  }
  .pagination {
    padding: 16px 0 0;
    text-align: right;
    .el-input__inner {
      width: 100%;
      height: 28px;
    }
    .el-pagination__jump {
      margin-left: 0;
    }
  }
}
</style>
