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
          <el-row style="margin-bottom: 11px">
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
            style="width: 100%"
            max-height="400"
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
            <el-table-column label="资源名称" min-width="150" prop="resName">
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
                <el-input-number style="width: 80px" size="mini" :min="scope.row.actualAdsCnt?1:0" :max="scope.row.actualAdsCnt||0" v-model="scope.row.planAdsCnt" @change="updatePlanAdsCnt(scope.row)"></el-input-number>
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
      default: 0
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
      this.totalNum = this.shoppingCartList.length;
      if (this.$refs.shoppingCartRef) {
        this.$refs.shoppingCartRef.bodyWrapper.scrollTop = 0;
      }
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
</style>  