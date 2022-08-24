<template>
  <div>
    <el-card class="workplace-card">
      <el-input
        class="u-input"
        v-model="searchKeyword"
        size="mini"
        placeholder="项目名称/资产编号/合同编号"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleClick"
        ></el-button>
      </el-input>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="媒体登记" name="register">
          <el-skeleton :loading="loading" animated>
            <template slot="template">
              <div style="padding: 14px">
                <div
                  v-for="i in 6"
                  :key="i"
                  style="
                    display: flex;
                    align-items: center;
                    justify-items: space-between;
                    margin-top: 8px;
                    height: 32px;
                  "
                >
                  <el-skeleton-item variant="rect" style="margin-right: 16px" />
                  <el-skeleton-item variant="rect" style="margin-right: 16px" />
                  <el-skeleton-item variant="rect" style="margin-right: 16px" />
                  <el-skeleton-item variant="rect" style="margin-right: 16px" />
                  <el-skeleton-item variant="rect" style="margin-right: 16px" />
                  <el-skeleton-item variant="rect" style="width: 30%" />
                </div>
              </div>
            </template>
            <template>
              <table v-if="tableData.length" style="width: 100%">
                <tbody>
                  <tr
                    v-for="(trItem, trIndex) in tableData"
                    :key="trIndex"
                    class="table-tr"
                  >
                    <td class="table-td" style="width: 60px">
                      <div class="font-base font-bold" style="font-size: 16px">
                        {{ trItem.projectName || '--' }}
                      </div>
                      <div class="font-base">
                        {{ `${trItem.mediaTitle || '--'}·${trItem.assetTag}` }}
                      </div>
                    </td>
                    <td class="table-td" style="width: 60px">
                      <div class="font-base">媒体类型</div>
                      <div class="font-base font-bold">
                        {{ `${trItem.mediaTypeName || '--'}` }}
                      </div>
                    </td>
                    <td class="table-td" style="width: 60px">
                      <div class="font-base">登记类型</div>
                      <div class="font-base font-bold">
                        {{ trItem.registerTypeName || '--' }}
                      </div>
                    </td>
                    <td class="table-td" style="width: 60px">
                      <div class="font-base">合同编号</div>
                      <div class="font-base font-bold">
                        {{ trItem.contractCode || '--' }}
                      </div>
                    </td>
                    <td class="table-td">
                      <div class="font-base">更新时间</div>
                      <div class="font-base font-bold">
                        {{ trItem.updateTime || '--' }}
                      </div>
                    </td>
                    <td class="operate-text" @click="dealRegister(trItem)">
                      处理
                    </td>
                  </tr>
                </tbody>
              </table>
              <el-empty v-else :image-size="200"></el-empty>
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
                style="margin-top: 14px; text-align: right"
              >
              </el-pagination>
            </template>
          </el-skeleton>
        </el-tab-pane>

        <el-tab-pane label="全国单投放确认" name="launch">
          <template>
            <table v-if="tableData.length" style="width: 100%">
              <tbody>
                <tr
                  v-for="(trItem, trIndex) in tableData"
                  :key="trIndex"
                  class="table-tr"
                >
                  <td class="table-td" style="width: 60px">
                    <div class="font-base font-bold" style="font-size: 16px">
                      {{ trItem.opportunityName || '--' }}
                    </div>
                    <div class="font-base">
                      {{
                        `${trItem.companyName || '--'}·${trItem.customerName}`
                      }}
                    </div>
                  </td>

                  <td class="table-td" style="width: 60px">
                    <div class="font-base">所属销售</div>
                    <div class="font-base font-bold">
                      {{ `${trItem.saleName || '--'}` }}
                    </div>
                  </td>

                  <td class="table-td" style="width: 60px">
                    <div class="font-base">投放城市</div>
                    <div class="font-base font-bold">
                      {{ trItem.cities || '--' }}
                    </div>
                  </td>

                  <td class="table-td" style="width: 60px">
                    <div class="font-base">投放排期</div>
                    <div class="font-base font-bold">
                      {{ trItem.launchTime || '--' }}
                    </div>
                  </td>

                  <td class="table-td">
                    <div class="font-base">更新时间</div>
                    <div class="font-base font-bold">
                      {{ trItem.updateTime || '--' }}
                    </div>
                  </td>

                  <td class="operate-text" @click="dealLaunchMedia(trItem)">
                    处理
                  </td>
                </tr>
              </tbody>
            </table>
            <el-empty v-else :image-size="200"></el-empty>
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
              style="margin-top: 14px; text-align: right"
            >
            </el-pagination>
          </template>
        </el-tab-pane>

        <el-tab-pane label="下刊日期调整" name="updateOrderEndTimeList">
          <template>
            <table v-if="tableData.length" style="width: 100%">
              <tbody>
                <tr
                  v-for="(trItem, trIndex) in tableData"
                  :key="trIndex"
                  class="table-tr"
                >
                  <td class="table-td" style="width: 60px">
                    <div class="font-base font-bold" style="font-size: 16px">
                      {{ trItem.opportunityName || '--' }}
                    </div>
                    <div class="font-base">
                      {{
                        `${trItem.companyName || '--'}·${trItem.customerName}`
                      }}
                    </div>
                  </td>

                  <td class="table-td" style="width: 60px">
                    <div class="font-base">所属销售</div>
                    <div class="font-base font-bold">
                      {{ `${trItem.saleName || '--'}` }}
                    </div>
                  </td>

                  <td class="table-td" style="width: 60px">
                    <div class="font-base">投放城市</div>
                    <div class="font-base font-bold">
                      {{ trItem.cities || '--' }}
                    </div>
                  </td>

                  <td class="table-td" style="width: 60px">
                    <div class="font-base">投放排期</div>
                    <div class="font-base font-bold">
                      {{ trItem.startTime }} - {{ trItem.endTime }}
                    </div>
                  </td>

                  <td class="table-td">
                    <div class="font-base">更新时间</div>
                    <div class="font-base font-bold">
                      {{ trItem.updateTime || '--' }}
                    </div>
                  </td>

                  <td class="operate-text" @click="dealOrderEndTime(trItem)">
                    处理
                  </td>
                </tr>
              </tbody>
            </table>
            <el-empty v-else :image-size="200"></el-empty>
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
              style="margin-top: 14px; text-align: right"
            >
            </el-pagination>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <Registration-Media
      :dialogVisible.sync="registrationMediaVisible"
      :registrationData="currentRegistration"
      @refreshWorkplace="getRegistrationList"
    ></Registration-Media>

    <LaunchMedia
      :dialogVisible.sync="launchMediaVisible"
      :orderData="orderData"
    ></LaunchMedia>

    <UpdateOrderEndTime
      :dialogVisible.sync="updateOderVisible"
      :updateOrderData="updateOrderData"
    ></UpdateOrderEndTime>
  </div>
</template>

<script>
import api from "../../api/api.js";
import RegistrationMedia from "../../components/media/components/RegistrationMedia.vue";
import LaunchMedia from '../../components/media/components/LaunchMedia.vue'
import UpdateOrderEndTime from '../../components/media/components/UpdateOrderEndTime.vue'
export default {
  name: "mediaWorkplace",
  components: {
    RegistrationMedia,
    LaunchMedia,
    UpdateOrderEndTime
  },
  data () {
    return {
      loading: false,
      registrationMediaVisible: false,
      currentRegistration: {},
      tableData: [],
      pageSizes: [10, 20, 30],
      pageSize: 10,
      currentPage: 1,
      paginationTotal: 0,
      searchKeyword: "",
      activeName: 'register',

      launchMediaVisible: false,
      orderData: {},

      updateOderVisible: false,
      updateOrderData: {}
    };
  },
  methods: {
    handleEdit (index, row) {
      console.log(index, row);
    },

    handleDelete (index, row) {
      console.log(index, row);
    },

    // 获取待登记列表
    getRegistrationList () {
      this.loading = true;
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
        })
        .finally(() => {
          this.loading = false;
        });
    },

    sizeChange (val) {
      this.pageSize = val
      this.currentPage = 1
      this.getData()
    },

    changePage (page) {
      this.currentPage = page
      this.getData()
    },

    // 点击处理
    dealRegister (rowData) {
      this.registrationMediaVisible = true
      this.currentRegistration = rowData;
    },

    dealLaunchMedia (rowData) {
      this.orderData = rowData
      this.launchMediaVisible = true
    },

    dealOrderEndTime (rowData) {
      this.updateOrderData = rowData
      this.updateOderVisible = true
    },

    getConfirmLaunchList () {
      this.loading = true;
      api
        .getApi("/addsp/api/v1/sale/confirmLaunchList", {
          keyword: this.searchKeyword || "",
          pageNum: this.currentPage,
          pageSize: this.pageSize,
        })
        .then((res) => {
          if (res.data.code === 200) {
            const resData = res.data.data;
            this.tableData = resData.list || [];
            this.paginationTotal = resData.total || 0;
          } else {
            this.$message({
              type: "warning",
              message: res.data.message || "全国单投放确认列表获取异常！",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    getUpdateOrderEndTimeList () {
      this.loading = true;
      api
        .getApi("/addsp/api/v1/sale/updateOrderEndTimeList", {
          keyword: this.searchKeyword || "",
          pageNum: this.currentPage,
          pageSize: this.pageSize,
        })
        .then((res) => {
          if (res.data.code === 200) {
            const resData = res.data.data;
            this.tableData = resData.list || [];
            this.paginationTotal = resData.total || 0;
          } else {
            this.$message({
              type: "warning",
              message: res.data.message || "下刊日期调整列表获取异常！",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    getData () {
      switch (this.activeName) {
        case 'register':
          this.getRegistrationList();
          break;

        case 'launch':
          this.getConfirmLaunchList();
          break;

        case 'updateOrderEndTimeList':
          this.getUpdateOrderEndTimeList()
          break
        default:
          break;
      }
    },

    handleClick () {
      this.tableData = []
      this.paginationTotal = 0
      this.currentPage = 1;
      this.getData();
    },

    handleTabClick () {
      this.searchKeyword = ''
      this.handleClick()
    }
  },
  mounted () {
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-input-group__append {
  background: none;
}
/deep/ .el-tabs__item {
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.45);
  &.is-active {
    font-weight: 600;
    color: #1890ff;
  }
}
/deep/ .el-card__body {
  padding-top: 11px;
}
.u-input {
  //   float: right;
  width: 240px;
  padding: 3px 0;
  position: absolute;
  right: 24px;
  top: 6px;
  z-index: 9;
  height: 32px;
  /deep/ .el-input-group__append {
    padding: 0 !important;
  }
  /deep/ .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
}
.font-base {
  font-style: normal;
  font-size: 14px;
  line-height: 22px;
  color: #000000;
  mix-blend-mode: normal;
  opacity: 0.45;
  padding: 6px 0;
}
.font-bold {
  font-weight: 600;
  opacity: 0.85;
}
.workplace-card {
  margin: 24px 64px;
  position: relative;
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
