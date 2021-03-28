<template>
  <div>
    <el-dialog
      title="已选小区"
      :visible.sync="dialogTableVisible"
      :before-close="handleClose"
      custom-class="shoppingCart-dialog"
    >
      <template>
        <!-- 头部 -->
        <div class="table_wrap car-list" style="margin-top: 60px">
          <el-row style="margin-bottom: 10px">
            <el-col :span="16" style="text-align: left">
              <span class="button_point">
                <el-button
                  plain
                  @click="getMapADList"
                  size="small"
                  class="mapBtn"
                  :disabled="mapBtn"
                  v-qadn-mta-h5="{
                    id: 'a004_b008_c001_d001_bt061_ck05',
                  }"
                  >获取地图选点</el-button
                >
              </span>
            </el-col>
          </el-row>
          <el-row class="car-title">
            <el-col>
              <i class="el-icon-info" style="color: #1890ff"></i>
              <span>
                已选小区<em>{{ shopMedia_ADNum.total }}</em
                >个,选1面的小区<em>{{ shopMedia_ADNum.oneNum }}</em
                >个， 选2面的小区<em>{{ shopMedia_ADNum.twoNum }}</em
                >个， 选3面的小区<em>{{ shopMedia_ADNum.threeNum }}</em
                >个， 更多面的小区<em>{{ shopMedia_ADNum.moreNum }}</em
                >个
              </span>
            </el-col>
          </el-row>
          <!-- 表格 -->
          <el-table
            ref="shoppingCartRef"
            border
            :data="shoppingCartShowList"
            :default-sort="{ prop: 'mID', order: 'descending' }"
            @row-click="shopRowClick"
            style="width: 100%"
          >
            <!-- :row-class-name="tableRowClassName" -->
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="商圈：">
                    <div class="shopList_adLimit" style="width: 80px">
                      <span>{{ props.row.tradingArea }}</span>
                    </div>
                  </el-form-item>
                  <el-form-item label="小区户数：">
                    <span>{{ props.row.houseNum }}</span>
                  </el-form-item>
                  <el-form-item label="楼盘价格：">
                    <span>&yen;{{ props.row.buildPrice }}</span>
                  </el-form-item>
                  <el-form-item label="资产编号：">
                    <div class="shopList_adLimit" style="width: 80px">
                      <span>{{ props.row.assetTag }}</span>
                    </div>
                  </el-form-item>
                  <el-form-item label="入住年份：">
                    <span>{{ props.row.liveYear }}</span>
                  </el-form-item>
                  <el-form-item label="广告限制：">
                    <div class="shopList_adLimit">
                      <span>{{ props.row.adLimit }}</span>
                    </div>
                  </el-form-item>
                </el-form>
                <el-form
                  v-if="customPermission.patrolPermission"
                  label-position="left"
                  inline
                  class="demo-table-expand"
                >
                  <el-form-item label="巡点问题：">
                    <div class="shopList_adLimit">
                      <span>{{ props.row.remark }}</span>
                    </div>
                  </el-form-item>
                  <el-form-item label="通行情况：">
                    <div class="shopList_adLimit">
                      <span>{{ props.row.trafficState }}</span>
                    </div>
                  </el-form-item>
                  <el-form-item
                    label="通电情况："
                    v-if="customPermission.patrolPermission == 2"
                  >
                    <div class="shopList_adLimit">
                      <span>{{ props.row.electrifyState }}</span>
                    </div>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="资源" min-width="60" prop="resName">
            </el-table-column>
            <!-- <el-table-column label="媒体名称" min-width="130">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.mediaName"
                  placement="bottom"
                >
                  <span>{{ scope.row.mediaName }}</span>
                </el-tooltip>
              </template>
            </el-table-column> -->
            <el-table-column prop="cityName" label="城市" min-width="60">
            </el-table-column>
            <el-table-column prop="districtName" label="区域" min-width="60">
            </el-table-column>
            <el-table-column prop="schedule" label="排期" min-width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.schedule }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="scope" label="地图中心点" min-width="105">
              <template slot-scope="scope">
                <el-tooltip
                  v-if="scope.row.mapCenterName"
                  :content="scope.row.mapCenterName"
                  placement="bottom-start"
                  :visible-arrow="false"
                >
                  <span>{{ scope.row.mapCenterName || "--" }}</span>
                </el-tooltip>
                <span v-else> {{ scope.row.mapCenterName || "--" }} </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="actualMediaCnt"
              label="媒体数量（门）"
              min-width="100"
            >
            </el-table-column>
            <el-table-column
              prop="actualMediaCnt"
              label="可投数量（面）"
              min-width="100"
            >
            </el-table-column>
            <el-table-column
              prop="planAdsCnt"
              label="计划投放数（面）"
              min-width="100"
            >
            </el-table-column>
            <!-- <el-table-column label="楼盘类型" min-width="85">
              <template slot-scope="scope">
                {{ scope.row.buildType || "--" }}
              </template>
            </el-table-column> -->
            <!-- <el-table-column prop="mediaLevel" label="媒体等级" min-width="85">
              <template slot-scope="scope">
                {{
                  scope.row.mediaLevel !== ""
                    ? scope.row.mediaLevel + "级"
                    : "--"
                }}
              </template>
            </el-table-column> -->

            <!-- <el-table-column min-width="65">
              <template slot-scope="scope">
                <span>{{ scope.row.A_B }}面</span>
              </template>
            </el-table-column> -->
            <el-table-column min-width="50" :render-header="renderHeader">
              <template slot-scope="scope">
                <span
                  style="cursor: pointer; color: #1890ff"
                  @click="deleteRow($event, scope.row)"
                  v-qadn-mta-h5="{
                    id:
                      activeName == 1
                        ? 'a004_b008_c001_d001_bt058_ck04'
                        : 'a004_b008_c001_d002_bt073_ck04',
                  }"
                >
                  <i
                    class="el-icon-delete"
                    style="color: #108de7; font-size: 20px; margin-left: 6px"
                  ></i>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="row-table-bottom">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50, 100, 500]"
              :page-size="cartPageSize"
              :pager-count="5"
              class="cart-pagination"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalNum"
              style="text-align: right"
            >
            </el-pagination>
          </div>
          <div style="text-align: center; margin-top: 10px">
            <el-button @click="continueSelect">继续选点 </el-button>
            <el-button
              @click="next"
              type="primary"
              v-qadn-mta-h5="{ id: 'a004_b008_c001_d001_bt072_ck03' }"
              >创建方案
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// 时间格式化
import timeFormat from "@/commonFun/timeFormat";

export default {
  name: "shoppingCart",
  props: {
    dialogTableVisible: {
      type: Boolean,
      default: false,
    },
    //获取按钮是否可用
    mapBtn: {
      type: Boolean,
      default: true,
    },
    activeName: {
      type: Number,
      default: 1,
    },
    //展示的数据
    shoppingCartList: {
      type: Array,
      default() {
        return [];
      },
    },
    customPermission: {
      type: Object,
      default() {
        return {};
      },
    },
    beOccupiedAdsData: {
      type: Array,
      default() {
        return [];
      },
    },
    ActiveConnectADList: {
      type: Object,
      default() {
        return {};
      },
    },
    connectAdDialogVisible: {
      type: Boolean,
      default: false,
    },
    shopMedia_ADNum: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  created() {},
  data() {
    return {
      // 购物车分页时页面条目数量
      currentPage: 1,
      cartPageSize: 10,
      totalNum: 400,
      //所有的数据，如果是一次全部返回的话
      shopDelRowClick: false,
    };
  },
  methods: {
    //继续选点
    continueSelect() {
      this.$emit("update:dialogTableVisible", false);
    },
    //删除购物车行
    deleteRow(event, rows) {
      console.log("购物车删除行", rows);
      console.log("删除行id", rows.mID);
      this.$emit("shoppingCartdeleteRow", rows);
      event.stopPropagation();
    },
    //点击小×执行的函数
    handleClose() {
      this.$emit("update:dialogTableVisible", false);
    },
    //点击
    next() {
      this.$emit("next");
      this.$emit("update:dialogTableVisible", false);
    },
    //切换分页数据条目
    handleSizeChange(val) {
      this.cartPageSize = val;
    },
    //切换分页
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    //指定行的样式
    // tableRowClassName({ row }) {
    //   if (row.lState !== undefined && row.lState.length > 0) {
    //     return "warning-row";
    //   } else if (
    //     row.connData.connectResName !== "" ||
    //     row.connData.commentWorkRes !== "" ||
    //     row.connData.connectMedia !== ""
    //   ) {
    //     return "warning-row-conncet";
    //   } else {
    //     return "";
    //   }
    // },
    // 购物车行被点击
    shopRowClick(row, event, column) {
      console.log("购物车行被点击row", row, column);
      // if (row.lState !== undefined && row.lState.length > 0) {
      //   let dataArr = row.lState;
      //   console.log("row.asID", row.asID);
      //   let arr = [];
      //   for (let key of dataArr) {
      //     let star = timeFormat.toDate(key.lStar, "/");
      //     let end = timeFormat.toDate(key.lEnd, "/");
      //     arr.push({
      //       beOccupieApName: key.apName,
      //       schedule: star + "-" + end,
      //       lState: key.lState,
      //     });
      //   }
      //   // this.beOccupiedAdsData = arr;
      //   this.$emit("update:beOccupiedAdsData", arr);
      //   console.log("this.beOccupiedAdsData", this.beOccupiedAdsData);
      //   if (!this.shopDelRowClick) {
      //     this.beOccupiedDialogVisible = true;
      //   } else {
      //     this.shopDelRowClick = false;
      //   }
      // } else if (
      //   row.connData.connectResName !== "" ||
      //   row.connData.commentWorkRes !== "" ||
      //   row.connData.connectMedia !== ""
      // ) {
      //   // this.ActiveConnectADList = row.connData;
      //   this.$emit("update:ActiveConnectADList", row.connData);
      //   // this.connectAdDialogVisible = true;
      //   this.$emit("update:connectAdDialogVisible", true);
      // }
    },
    // 购物车-获取地图选择的点位列表
    getMapADList() {
      console.log("触发获取地图选点信息click");
      this.$emit("getMapADList");

      // if (this.ActiveMapType === 1) {
      //   // 无忧地图
      //   this.getMapLoading = this.$loading({
      //     lock: true,
      //     text: "数据获取中...",
      //     spinner: "el-icon-loading",
      //     background: "rgba(0, 0, 0, 0.7)",
      //   });
      //   this.$emit("update:mapBtn", true);
      //   api
      //     .getApi(this.apiVar.Map + "/SendMap", {
      //       uid: this.sessionData.uID,
      //       token: this.sessionData.token,
      //     })
      //     .then((res) => {
      //       console.log("地图选点", res);
      //       if (res.data.code == "500200") {
      //         this.mapADList = res.data.data;
      //         if (this.mapADList.length > 0) {
      //           this.setShopDataByMapAD();
      //         } else {
      //           sessFun.messageFun("warning", "数据为空");
      //           this.getMapLoading.close();
      //         }
      //       } else {
      //         this.getMapLoading.close();
      //         sessFun.messageFun("warning", res.data.MSG || "数据获取异常");
      //       }
      //     });
      // } else {
      //   // 亲邻地图
      //   this.getMapLoading = this.$loading({
      //     lock: true,
      //     text: "数据获取中...",
      //     spinner: "el-icon-loading",
      //     background: "rgba(0, 0, 0, 0.7)",
      //   });
      //   // let params = {
      //   //     code: localStorage.getItem(`qinlinMapCode`)
      //   // };
      //   // if(params.code) {adsListByUid
      //   //     api.getApi(this.apiVar.mapApi + '/adsListByCode',params).then(res=>{
      //   api
      //     .getApi(this.apiVar.mapApi + "/adsListByUid", {
      //       asrIDs: this.planForm.pointOfAsrIDs.join(","),
      //       suID: this.BDData.uid,
      //     })
      //     .then((res) => {
      //       if (res.data.SysCode === 200200) {
      //         this.mapAdsList = res.data.data;
      //         this.setMapAdsListInShopCar();
      //         localStorage.removeItem("qinlinMapCode");
      //       } else {
      //         this.getMapLoading.close();
      //         sessFun.messageFun("warning", res.data.MSG || "数据获取异常");
      //       }
      //     })
      //     .catch((err) => {
      //       this.getMapLoading.close();
      //       sessFun.messageFun("warning", "数据接口异常");
      //     });
      //   // } else {
      //   //     this.getMapLoading.close();
      //   //     sessFun.messageFun('warning','请在地图选择社区并提交')
      //   // }
      // }
    },
    // 自定义购物车表头-清空
    renderHeader(h, { column }) {
      // console.log('********h*******',h,column)
      return h(
        "span",
        {
          class: "clearShopping",
          on: {
            click: () => {
              // console.log('**************123')
              this.clearShop();
              // （广告门，道闸）
              this.MtaStatFun(
                "a004_b008_c001_d001_bt059_ck04",
                "a004_b008_c001_d002_bt074_ck04"
              );
            },
          },
        },
        [h("span", "清空")]
      );
    },
    // 清空购物车
    clearShop() {
      this.$emit("shoppongCartClearData");
    },
    // 事件埋点(无法使用模板指令时)--广告门，道闸
    MtaStatFun(mtaStatIdAdDoor, mtaStatIdRoadGate) {
      if (this.activeName == 1) {
        MtaH5.clickStat(mtaStatIdAdDoor);
      } else if (this.activeName == 2) {
        MtaH5.clickStat(mtaStatIdRoadGate);
      }
    },
  },
  computed: {
    shoppingCartShowList() {
      this.totalNum = this.shoppingCartList.length;
      if (this.$refs.shoppingCartRef) {
        this.$refs.shoppingCartRef.bodyWrapper.scrollTop = 0;
      }
      // console.log("this.$refs.shoppingCartRef: ", this.$refs.shoppingCartRef);
      return this.shoppingCartList.slice(
        (this.currentPage - 1) * this.cartPageSize,
        this.currentPage * this.cartPageSize
      );
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .shoppingCart-dialog .el-dialog__header {
  padding: 12px 24px;
}
/deep/ .shoppingCart-dialog .el-dialog__body {
  padding: 4px 24px 24px;
}
/deep/ .shoppingCart-dialog .el-dialog__footer {
  display: block;
  text-align: center;
}

/deep/ .clearShopping {
  cursor: pointer;
  color: #1890ff;
  font-size: 14px;
}
.cart-pagination /deep/ .el-input__inner {
  width: 100%;
}
/deep/ .el-input__inner {
  width: 100%;
}
/deep/ .el-dialog__footer {
  text-align: center;
}
/*购物车列表*/
.car-title {
  background: #e6f7ff;
  border: 1px solid #bae7ff;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 5px;
}

.car-title h4 {
  font-size: 14px;
  display: inline-block;
}

.car-title p {
  font-size: 14px;
  font-weight: normal;
  display: inline-block;
  margin-left: 10px;
}

.car-title span {
  font-size: 14px;
  font-weight: normal;
  margin: 0 6px;
  cursor: pointer;
  color: #1890ff;
}
.cart-pagination /deep/ .el-input__inner {
  width: 100%;
}

/deep/ .car-list .el-table__expanded-cell[class*="cell"] {
  padding: 0 46px;
  background-color: #f7f7f7;
}

/deep/ .table_wrap.car-list {
  margin-top: 0 !important;
}
.mapBtn {
  min-width: 110px;
  text-align: center;
  display: inline-block;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 5px;
  cursor: pointer;
}
</style>