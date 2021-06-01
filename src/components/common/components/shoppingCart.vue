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
          <el-row style="margin-bottom: 11px; text-align: right;">
            <!-- <el-col :span="16" style="text-align: left"> -->
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
                <el-button v-if="apState!=null" plain @click="getShareADList" size="small" class="mapBtn"
                  v-qadn-mta-h5="{id: 'a004_b008_c001_d001_bt062_ck05'}">更新客户选点</el-button>
              </span>
              <!-- 2-移除可投数量为0的意向小区 3-移除未配点小区 4-移除非客户选点的小区 -->
              <el-dropdown v-if="apState!=null" size="small" type="primary">
                <el-button type="primary" style="padding: 0 8px;">
                  一键移除<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native.prevent="deletePartBackUp(4)">移除非客户选点</el-dropdown-item>
                  <el-dropdown-item @click.native.prevent="deletePartBackUp(2)">移除可投数量为0的小区</el-dropdown-item>
                  <el-dropdown-item @click.native.prevent="deletePartBackUp(3)">移除未配点小区</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            <!-- </el-col> -->
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
          <!-- :default-sort="{ prop: 'mID', order: 'descending' }" -->
          <el-table
            ref="shoppingCartRef"
            border
            :data="shoppingCartShowList"
            :row-class-name="tableRowClassName"
            @row-click="handleCurrentRowChange"
            style="width: 100%"
            height="500"
            @expand-change="senceOpen"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="商圈：">
                    <div class="shopList_adLimit" >
                      <span>{{ props.row.tradingArea }}</span>
                    </div>
                  </el-form-item>
                  <el-form-item label="小区户数：">
                    <span>{{ props.row.hNum }}</span>
                  </el-form-item>
                  <el-form-item label="楼盘价格：">
                    <span>&yen;{{ props.row.hPrice }}</span>
                  </el-form-item>
                  <el-form-item label="楼栋数量：">
                    <span>{{ props.row.fNum }}</span>
                  </el-form-item>
                  <el-form-item label="入住年份：">
                    <span>{{ props.row.chDay }}</span>
                  </el-form-item>
                  <el-form-item label="广告限制：">
                    <div class="shopList_adLimit">
                      <span>{{ props.row.notPush }}</span>
                    </div>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="资源名称" min-width="150" prop="resName" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.isCustomerSelect" class="custom-select">*</span>
                <span>{{ scope.row.resName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="cityName" label="城市" min-width="60">
            </el-table-column>
            <el-table-column prop="districtName" label="区域" min-width="60">
            </el-table-column>
            <el-table-column prop="schedule" label="排期" min-width="160">
              <template slot-scope="scope">
                <span>{{ scope.row.schedule }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="scope" label="地图中心点" min-width="80">
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
              label="媒体数量(门)"
              min-width="100"
              align="right"
            >
            </el-table-column>
            <el-table-column
              prop="actualAdsCnt"
              label="可投数量(面)"
              min-width="100"
              align="right"
            >
            </el-table-column>
            <el-table-column
              label="计划投放数(面)"
              min-width="130"
              align="center"
            >
              <template slot-scope="scope">
                <el-input-number style="width: 80px" :class="{'custom-select': scope.row.isCustomerSelect}" size="mini" :step="1" :min="1" :max="scope.row.normalAdsCnt||1" v-model="scope.row.planAdsCnt" @change="updatePlanAdsCnt(scope.row)"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column
              v-if="apState==1"
              label="配点情况"
              min-width="120"
            >
            <template slot-scope="scope">
                <span>{{ !scope.row.carAdsCnt?'未配点':scope.row.planAdsCnt==scope.row.carAdsCnt?'已完成':'已配('+(scope.row.carAdsCnt||0)+')' }}</span>
              </template>
            </el-table-column>
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
                    style="color: #108de7; margin-left: 6px"
                  ></i>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="row-table-bottom">
            <p class="warningInfo">
              <span style="background: #FFC1BE;" class="warningInfoColor"></span>
              <span class="warningInfoName">可投面数为0的小区</span>
              <span style="background: #FFE093;" class="warningInfoColor"></span>
              <span class="warningInfoName">可投面数不满足计划投放面数的小区</span>
            </p>
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="[10, 20, 50, 100, 500]"
              :page-size="cartPageSize"
              :pager-count="5"
              class="cart-pagination"
              layout="total, sizes, prev, pager, next, jumper"
              :total="shoppingCartList.length"
              style="text-align: right"
            >
            </el-pagination>
          </div>
        
        </div>
          <span slot="footer">
             <div style="text-align: center;">
            <el-button @click="continueSelect">继续选点 </el-button>

            <el-button
              v-if="this.$route.path == '/sale/editEmptyPointPlan'"
              @click="next"
              type="primary"
              >编辑完成
            </el-button>
            <el-button
              v-else
              @click="next"
              type="goon"
              v-qadn-mta-h5="{ id: 'a004_b008_c001_d001_bt072_ck03' }"
              >创建方案
            </el-button>
          </div>
          </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
var timeOut = null;
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
    apState: {
      type: Number,
      default: null
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
      totalNum: 0,
      //所有的数据，如果是一次全部返回的话
      shopDelRowClick: false
    };
  },
 
  methods: {
     //手风琴
    senceOpen(row, rowsList) {
      if(rowsList.length > 1){
          this.shoppingCartShowList.forEach(ele => {
            if(ele.resID !== row.resID){
              this.$refs.shoppingCartRef.toggleRowExpansion(ele,false)
            }
          });
      }
    },
    // 表格当前行是否高亮
    tableRowClassName({row}) {
      if (row.actualAdsCnt==0) {
        // 可投面数为0
        return "warning-row";
      } else if (row.planAdsCnt>row.actualAdsCnt) {
          // 可投面数不满足计划投放面数
        return "warning-row-conncet";
      }else {
        return "";
      }
    },
    handleCurrentRowChange(currentRow) {
      // 可投面数为0
      if (currentRow && (currentRow.actualAdsCnt==0||currentRow.planAdsCnt>currentRow.actualAdsCnt) && currentRow.earliestOnPubDate) {
        this.$message({type: 'warning', message: `该小区所选排期内无合适的点位可连续投放，最早可投日期从${currentRow.earliestOnPubDate}开始`})
      }
    },
    //继续选点
    continueSelect() {
      this.$emit("update:dialogTableVisible", false);
    },
    //删除购物车行
    deleteRow(event, rows) {
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
    // 购物车-获取地图选择的点位列表
    getMapADList() {
      console.log("触发获取地图选点信息click");
      this.$emit("getMapADList");
    },
    // 购物车- 获取协同选点的数据
    getShareADList() {
      this.currentPage = 1;
      this.$emit("getShareADList");
    },
    // 一键移除
    deletePartBackUp(val) {
      this.currentPage = 1;
      this.$emit("deletePartBackUp", val);
    },
    // 自定义购物车表头-清空
    renderHeader(h, { column }) {
      return h(
        "span",
        {
          class: "clearShopping",
          on: {
            click: () => {
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
    updatePlanAdsCnt(row) {
      clearTimeout(timeOut);
      timeOut = setTimeout(()=>{
        if(row.planAdsCnt===null||row.planAdsCnt===undefined) {
          row.planAdsCnt = 1
        }
        this.$emit('updateShopCartRow', row)
      }, 500);
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
      /* if (this.$refs.shoppingCartRef) {
        this.$refs.shoppingCartRef.bodyWrapper.scrollTop = 0;
      } */
      return this.shoppingCartList.slice(
        (this.currentPage - 1) * this.cartPageSize,
        this.currentPage * this.cartPageSize
      );
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .shoppingCart-dialog {
    width: 1134px;
    .el-dialog__header {
    padding: 15px 24px;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
    margin-bottom: 22px;
  }
    .el-dialog__body {
    padding: 4px 24px 24px;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
    .row-table-bottom{
      margin-top:16px
    }
  }
    .el-dialog__footer {
    display: block;
    padding: 11px 0;
    text-align: center;
    .el-button--goon {
    color: #FFF;
    background-color: rgba(24, 144, 255, 1);
    border-color: rgba(24, 144, 255, 1);
    margin-left: 16px;
    }
  }
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
  height: 40px;
  line-height: 30px;
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
  color: rgba(0, 0, 0, 0.65);
}
.car-title span em{
  font-size: 14px;
  font-weight: 600;
  margin: 0 6px;
  color:rgba(24, 144, 255, 1)
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
  .el-input-number--mini {
    .el-input__inner {
      height: 26px;
      padding-left: 28px;
      padding-right: 28px;
    }
    .el-input-number__decrease, .el-input-number__increase {
      width: 26px;
    }
  }
  .custom-select {
    color: red;
    .el-input__inner {
      color: red;
    }
  }
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
.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 48%;
}
/deep/ .el-form-item__content {
  line-height: 40px;
}
/deep/ .el-table__expand-column .cell{
  height: auto
}

.shopList_adLimit {
  width: 132px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.row-table-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}
.warningInfoColor {
  display: inline-block;
  height: 16px;
  width: 16px;
  border-radius: 1px;
  vertical-align: middle;
}

.warningInfo .warningInfoName {
  margin-right: 24px;
  line-height: 22px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
}

/*状态行*/
/deep/ .el-table .warning-row {
  background: rgba(255, 0, 0, 0.08);
}

/deep/ .el-table .warning-row-conncet {
  background: rgba(255, 199, 0, 0.1);
}
</style>  