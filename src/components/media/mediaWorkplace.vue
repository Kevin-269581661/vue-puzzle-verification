<template>
  <div>
    <el-card class="workplace-card">
      <el-input
        class="u-input"
        v-model="searchKeyword"
        size="mini"
        :placeholder="searchPlaceholder"
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
                        {{ trItem.projectName || "--" }}
                      </div>
                      <div class="font-base">
                        {{ `${trItem.mTitle || "--"}·${trItem.assetTag}` }}
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

        <el-tab-pane
          label="全国单投放确认"
          name="launch"
          v-if="!['ADN_MD'].includes(sessionData.uType)"
        >
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
                      {{ trItem.opportunityName || "--" }}
                    </div>
                    <div class="font-base">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="`${trItem.companyName || '--'}·${
                          trItem.customerName
                        }`"
                        placement="top-start"
                      >
                        <div class="ellipsis">
                          {{
                            `${trItem.companyName || "--"}·${
                              trItem.customerName
                            }`
                          }}
                        </div>
                      </el-tooltip>
                    </div>
                  </td>

                  <td class="table-td" style="width: 60px">
                    <div class="font-base">所属销售</div>
                    <div class="font-base font-bold">
                      {{ `${trItem.saleName || "--"}` }}
                    </div>
                  </td>

                  <td class="table-td" style="width: 60px">
                    <div class="font-base">投放城市</div>
                    <div class="font-base font-bold">
                      {{ trItem.cities || "--" }}
                    </div>
                  </td>

                  <td class="table-td" style="width: 60px">
                    <div class="font-base">预计投放节点</div>
                    <div class="font-base font-bold">
                      {{ trItem.launchTime || "--" }}
                    </div>
                  </td>

                  <td class="table-td">
                    <div class="font-base">更新时间</div>
                    <div class="font-base font-bold">
                      {{ trItem.updateTime || "--" }}
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

        <el-tab-pane
          label="下刊日期调整"
          name="updateOrderEndTimeList"
          v-if="!['ADN_MD'].includes(sessionData.uType)"
        >
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
                      {{ trItem.opportunityName || "--" }}
                    </div>
                    <div class="font-base">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="`${trItem.companyName || '--'}·${
                          trItem.customerName
                        }`"
                        placement="top-start"
                      >
                        <div class="ellipsis">
                          {{
                            `${trItem.companyName || "--"}·${
                              trItem.customerName
                            }`
                          }}
                        </div>
                      </el-tooltip>
                    </div>
                  </td>

                  <td class="table-td" style="width: 60px">
                    <div class="font-base">所属销售</div>
                    <div class="font-base font-bold">
                      {{ `${trItem.saleName || "--"}` }}
                    </div>
                  </td>

                  <td class="table-td" style="width: 60px">
                    <div class="font-base">投放城市</div>
                    <div class="font-base font-bold">
                      {{ trItem.cities || "--" }}
                    </div>
                  </td>

                  <td class="table-td" style="width: 60px">
                    <div class="font-base">原投放排期</div>
                    <div class="font-base font-bold">
                      {{ `${trItem.startTime} - ${trItem.endTime}` }}
                    </div>
                  </td>

                  <td class="table-td">
                    <div class="font-base">调整后下刊日期</div>
                    <div class="font-base font-bold">
                      {{ trItem.newEndTime || "--" }}
                    </div>
                  </td>

                  <td class="table-td">
                    <div class="font-base">更新时间</div>
                    <div class="font-base font-bold">
                      {{ trItem.updateTime || "--" }}
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

        <el-tab-pane
          label="订单图片审核"
          name="orderImgCheck"
          v-if="!['ADN_MD'].includes(sessionData.uType)"
        >
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
              <div class="handel_ul">
                <li class="handel_ul_li">
                  <span class="li-label">订单名称：</span>
                  <el-input
                    v-model="searchParams.apName"
                    style="width: 236px"
                    placeholder="请输入订单名称"
                    class="input-with-select u-key"
                    size="small"
                  >
                  </el-input>
                </li>
                <li class="handel_ul_li">
                  <span class="li-label">监播类型：</span>
                  <el-select
                    v-model="searchParams.type"
                    placeholder="请选择监播类型"
                    :clearable="true"
                    style="width: 236px"
                    size="small"
                  >
                    <el-option label="上刊" :value="0"></el-option>
                    <el-option label="下刊" :value="1"></el-option>
                    <el-option label="换刊" :value="2"></el-option>
                  </el-select>
                </li>
                <li class="handel_ul_li">
                  <span class="li-label">审核状态：</span>
                  <el-select
                    v-model="searchParams.auditStatus"
                    placeholder="请选择审核状态"
                    :clearable="true"
                    style="width: 236px"
                    size="small"
                  >
                    <el-option label="未审核" :value="0"></el-option>
                    <el-option label="已审核" :value="1"></el-option>
                  </el-select>
                </li>
                <li class="handel_ul_li">
                  <span class="li-label">监播日期：</span>
                  <el-date-picker
                    v-model="aduitDate"
                    size="small"
                    type="daterange"
                    range-separator="-"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  >
                  </el-date-picker>
                </li>
                <li class="handel_ul_li handel_ul_li_btn">
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="toSearchParams()"
                  >
                    搜索</el-button
                  >
                  <el-button plain @click="toResetParams()">重置</el-button>
                </li>
              </div>
              <table v-if="tableData.length" style="width: 100%">
                <tbody>
                  <tr
                    v-for="(trItem, trIndex) in tableData"
                    :key="trIndex"
                    class="table-tr"
                  >
                    <td class="table-td" style="width: 60px">
                      <div class="font-base font-bold" style="font-size: 16px">
                        {{ trItem.apName || "--" }}
                      </div>
                      <div class="font-base">
                        <div class="ellipsis">
                          {{ trItem.type === 0 ? "上刊报告" : trItem.type === 1 ? "下刊报告" : trItem.type === 2 ? "换刊报告" : "--"}}
                        </div>
                      </div>
                    </td>

                    <td class="table-td" style="width: 60px">
                      <div class="font-base">投放排期</div>
                      <div class="font-base font-bold" v-if="trItem.startDate">
                        {{
                          `${trItem.startDate.replace(
                            /-/g,
                            "."
                          )} - ${trItem.endDate.replace(/-/g, ".")}` || "--"
                        }}
                      </div>
                    </td>

                    <td class="table-td" style="width: 60px">
                      <div class="font-base">监播点位</div>
                      <div class="font-base font-bold">
                        {{ `${trItem.asDoneCount}/${trItem.asCount}` || "--" }}
                      </div>
                    </td>

                    <td class="table-td" style="width: 60px">
                      <div class="font-base">审核状态</div>
                      <div class="font-base font-bold">
                        <span
                          class="point"
                          :class="
                            trItem.auditStatus === 0 ? 'warning' : 'success'
                          "
                        ></span>
                        {{
                          trItem.auditStatus === 0
                            ? `未审核 (${trItem.asAuditCount}/${trItem.asDoneCount})`
                            : " 已审核" || "--"
                        }}
                      </div>
                    </td>

                    <td class="operate-text" @click="checkOrderImg(trItem)">
                      查看
                    </td>
                  </tr>
                </tbody>
              </table>
              <el-empty v-else :image-size="200"></el-empty>
              <!-- :hide-on-single-page="true" -->
              <el-pagination
                background
                @size-change="sizeChange"
                @current-change="changePage"
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

    <ReportImage
      :dialogVisible.sync="reportImageVisible"
      :reportImageApID="reportImageApID"
      :reportImageType="reportImageType"
      @refresh="getData"
    ></ReportImage>
  </div>
</template>

<script>
import api from "../../api/api.js";
import sessFun from "../../commonFun/sessFun.js";

import RegistrationMedia from "../../components/media/components/RegistrationMedia.vue";
import LaunchMedia from "../../components/media/components/LaunchMedia.vue";
import UpdateOrderEndTime from "../../components/media/components/UpdateOrderEndTime.vue";
import ReportImage from "../../components/media/components/ReportImage.vue";

export default {
  name: "mediaWorkplace",
  components: {
    RegistrationMedia,
    LaunchMedia,
    UpdateOrderEndTime,
    ReportImage,
  },
  data() {
    return {
      searchParams: {},
      aduitDate: "",
      sessionData: {},

      loading: false,
      registrationMediaVisible: false,
      currentRegistration: {},
      tableData: [],
      pageSizes: [10, 20, 30],
      pageSize: 10,
      currentPage: 1,
      paginationTotal: 0,
      searchKeyword: "",
      activeName: "register",

      launchMediaVisible: false,
      orderData: {},

      updateOderVisible: false,
      updateOrderData: {},

      reportImageVisible: false,
      reportImageApID: -1,
      reportImageType: -1,

      searchPlaceholder: "项目名称/资产编号/合同编号",
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

    sizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getData();
    },

    changePage(page) {
      this.currentPage = page;
      this.getData();
    },

    // 点击处理
    dealRegister(rowData) {
      this.registrationMediaVisible = true;
      this.currentRegistration = rowData;
    },

    dealLaunchMedia(rowData) {
      this.orderData = rowData;
      this.launchMediaVisible = true;
    },

    dealOrderEndTime(rowData) {
      this.updateOrderData = rowData;
      this.updateOderVisible = true;
    },

    getConfirmLaunchList() {
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
            console.log(resData);
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

    getUpdateOrderEndTimeList() {
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

    // 获取订单图片审核列表
    getOrderImgCheckList() {
      this.loading = true;
      for (let key in this.searchParams) {
        if (this.searchParams[key] === "") {
          delete this.searchParams[key];
        }
      }
      let params = {
        ...this.searchParams,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      };
      api
        .postApi_json("/addsp/api/v1/audit/adPlans", params)
        .then((res) => {
          if (res.data.SysCode) {
            const resData = res.data.data;
            this.tableData = resData.list || [];
            this.paginationTotal = resData.total || 0;
          } else {
            this.$message({
              type: "warning",
              message: res.data.MSG || "图片审核列表获取异常！",
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

    // 查看订单图片审核
    checkOrderImg(item) {
      this.reportImageApID = item.apID;
      this.reportImageType = item.type
      this.reportImageVisible = true;
    },

    toSearchParams() {
      if (this.aduitDate) {
        this.searchParams.startDate = this.aduitDate[0];
        this.searchParams.endDate = this.aduitDate[1];
      } else if (this.searchParams.startDate && this.searchParams.endDate) {
        delete this.searchParams.startDate;
        delete this.searchParams.endDate;
      }
      this.getData();
    },

    toResetParams() {
      for (let key in this.searchParams) {
        delete this.searchParams[key];
      }
      this.aduitDate = "";
      this.getData();
    },

    getData() {
      switch (this.activeName) {
        case "register":
          this.searchPlaceholder = "项目名称/资产编号/合同编号";
          this.getRegistrationList();
          break;

        case "launch":
          this.searchPlaceholder = "公司名称/品牌名称/所属销售";
          this.getConfirmLaunchList();
          break;

        case "updateOrderEndTimeList":
          this.searchPlaceholder = "公司名称/品牌名称/所属销售";
          this.getUpdateOrderEndTimeList();
          break;

        case "orderImgCheck":
          this.searchPlaceholder = "公司名称/品牌名称/所属销售";
          this.getOrderImgCheckList();

        default:
          break;
      }
    },

    handleClick() {
      this.tableData = [];
      this.paginationTotal = 0;
      this.currentPage = 1;
      this.getData();
    },

    handleTabClick() {
      this.searchKeyword = "";
      this.handleClick();
    },
  },
  mounted() {
    this.sessionData = sessFun.getSess();
    console.log(this.sessionData, "this.sessionDatathis.sessionData");

    this.getData();
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-input-group__append {
  background: none;
}
/deep/ .el-tabs__item {
  font-family: "PingFang SC";
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
.point {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &.success {
    background: rgb(82, 196, 26);
  }

  &.warning {
    background-color: rgb(250, 173, 20);
  }
}
.primary-title {
  display: flex;
  align-items: center;
}
.handel_ul {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.handel_ul_li {
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  width: 306px;
  margin: 8px 32px 8px 0px;
  .li-label {
    font-size: 14px;
    white-space: nowrap;
    color: rgba(0, 0, 0, 0.65);
  }
}

.handel_ul_li_btn {
  .el-button + .el-button {
    margin-left: 8px;
  }
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
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.06);
    &:first-child {
      border-top: 1px solid rgba($color: #000000, $alpha: 0.06);
      margin-top: 24px;
    }
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

.ellipsis {
  max-width: 100%;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/deep/ .el-dialog__title {
  font-weight: 600;
  color: #000;
}
</style>
