<template>
  <el-card class="workplace-card">
    <div slot="header" class="workplace-card__header">
      <span>媒体登记</span>
      <el-input
        style="float: right; width: 240px; padding: 3px 0"
        v-model="search"
        size="mini"
        placeholder="输入关键字搜索"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <table style="width: 100%">
      <tbody>
        <tr
          v-for="(trItem, trIndex) in tableData"
          :key="trIndex"
          class="table-tr"
        >
          <td
            v-for="(tdValue, tdKey, tdIndex) in trItem"
            :key="tdIndex"
            class="table-td"
          >
            {{ tdValue }}
          </td>
          <td class="operate-text">处理</td>
        </tr>
      </tbody>
    </table>
    <el-pagination
      background
      @size-change="sizeChange"
      @current-change="changePage"
      :hide-on-single-page="true"
      :current-page.sync="currentPage"
      :page-sizes="pageSizes"
      :page-size.sync="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="paginationTotal"
    >
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      search: "",
      pageSizes: [10, 20, 30],
      pageSize: 10,
      currentPage: 1,
      paginationTotal: 0,
    };
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    sizeChange(val) {
      console.log("val----", val);
      this.pageSize = val;
      this.currentPage = 1;
      // this.searchFun();
    },
    changePage(page) {
      this.currentPage = page;
      console.log("page----", page);
      // this.searchFun();
    },
  },
};
</script>

<style lang="scss" scoped>
.workplace-card {
  margin: 24px 64px;
  .workplace-card__header {
  }
  .table-tr {
    display: flex;
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.06);
    .table-td {
      flex-grow: 1;
      padding: 10px 0;
    }
    .operate-text {
      font-size: 14px;
      line-height: 22px;
      color: #1890ff;
    }
  }
}
</style>