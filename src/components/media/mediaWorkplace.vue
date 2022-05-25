<template>
  <div>
    <el-card class="workplace-card">
      <div slot="header" class="workplace-card__header">
        <span>媒体登记</span>
        <el-input
          style="float: right; width: 240px; padding: 3px 0"
          v-model="searchKeyword"
          size="mini"
          placeholder="输入关键字搜索"
          @change="getRegistrationList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </div>
      <table style="width: 100%">
        <tbody>
          <tr
            v-for="(trItem, trIndex) in tableData"
            :key="trIndex"
            class="table-tr"
          >
            <td class="table-td" style="width: 60px">
              <div class="font-base font-bold" style="font-size: 16px">
                {{ trItem.projectName || "--" }}
              </div>
              <div class="font-base">
                {{ `${trItem.mediaTitle || "--"}·${trItem.assetTag}` }}
              </div>
            </td>
            <td class="table-td" style="width: 60px">
              <div class="font-base">媒体类型</div>
              <div class="font-base font-bold">
                {{ `${trItem.mediaTypeName || "--"}` }}
              </div>
            </td>
            <td class="table-td" style="width: 60px">
              <div class="font-base">登记类型</div>
              <div class="font-base font-bold">
                {{ trItem.registerTypeName || "--" }}
              </div>
            </td>
            <td class="table-td" style="width: 60px">
              <div class="font-base">合同编号</div>
              <div class="font-base font-bold">
                {{ trItem.contractCode || "--" }}
              </div>
            </td>
            <td class="table-td">
              <div class="font-base">更新时间</div>
              <div class="font-base font-bold">
                {{ trItem.updateTime || "--" }}
              </div>
            </td>
            <td class="operate-text" @click="dealRegister(trItem)">处理</td>
          </tr>
        </tbody>
      </table>
      <el-pagination
        background
        @size-change="sizeChange"
        @current-change="changePage"
        :hide-on-single-page="false"
        :current-page.sync="currentPage"
        :page-sizes="pageSizes"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginationTotal"
        style="margin-top: 14px; text-align: right"
      >
      </el-pagination>
    </el-card>
    <Registration-Media
      :dialogVisible.sync="registrationMediaVisible"
      :registrationData="currentRegistration"
      @refreshWorkplace="getRegistrationList"
    ></Registration-Media>
  </div>
</template>

<script>
import api from "../../api/api.js";
import RegistrationMedia from "../../components/media/components/RegistrationMedia.vue";
export default {
  name: "mediaWorkplace",
  components: {
    RegistrationMedia,
  },
  data() {
    return {
      registrationMediaVisible: false,
      currentRegistration: {},
      tableData: [],
      pageSizes: [10, 20, 30],
      pageSize: 10,
      currentPage: 1,
      paginationTotal: 0,
      searchKeyword: "",
    };
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    // 获取待登记列表
    getRegistrationList() {
      api
        .getApi("/addsp/api/v1/register/page", {
          keyword: this.searchKeyword || "",
          pageNum: this.currentPage,
          pageSize: this.pageSize,
        })
        .then((res) => {
          if (res.data.SysCode === 200200) {
            const resData = res.data.data;
            this.tableData = resData.list || [];
            this.paginationTotal = resData.total || 0;
          } else {
            this.$message({
              type: "warning",
              message: res.data.MSG || "媒体登记列表获取异常！",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    sizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getRegistrationList();
    },
    changePage(page) {
      this.currentPage = page;
      this.getRegistrationList();
    },
    // 点击处理
    dealRegister(rowData) {
      this.registrationMediaVisible = true;
      this.currentRegistration = rowData;
    },
  },
  mounted() {
    this.getRegistrationList();
  },
};
</script>

<style lang="scss" scoped>
.font-base {
  font-style: normal;
  font-size: 14px;
  line-height: 22px;
  color: #000000;
  mix-blend-mode: normal;
  opacity: 0.45;
}
.font-bold {
  font-weight: 600;
  opacity: 0.85;
}
.workplace-card {
  margin: 24px 64px;
  .workplace-card__header {
    /deep/ .el-input-group__append {
      padding: 0;
    }
  }
  .table-tr {
    display: flex;
    align-items: center;
    margin: 0 0 0 -12px;
    // & + .table-tr {
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.06);
    // }
    .table-td {
      flex-grow: 1;
      padding: 10px 12px;
      overflow-x: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .operate-text {
      font-size: 14px;
      line-height: 22px;
      color: #1890ff;
      cursor: pointer;
    }
  }
}
</style>