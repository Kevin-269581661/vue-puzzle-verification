<template>
  <div>
    <div class="ad_mediaDetail_wrap clearfix">
      <div class="ad_mediaDetail_nav">
        <p>
          <a href="#">方案管理</a>
          <em> / </em>
          <a href="#">方案详情</a>
        </p>
        <div class="tip">
          该方案由 {{ planDetail.realName }} 创建于 {{ planDetail.apcTime }}
        </div>
      </div>
      <!--资源信息-->
      <div class="mediaList_wrap">
        <div
          class="content_top_wrap"
          v-loading="loading"
          element-loading-text="玩命加载中.."
          element-loading-spinner="el-icon-loading"
        >
          <div class="plan-title">
            <h4>
              <img src="../../assets/images/orderlogo.png" alt="" />{{
                planDetail.apName
              }}
            </h4>
            <div class="handleBtn">
              <!--<el-button plain>导出</el-button>-->
              <el-tooltip
                v-if="role == 'MD' && planDetail.lockStatus == 1"
                effect="dark"
                content="从今天起重新预锁七天"
                placement="top"
              >
                <el-button @click="reLock">预 锁</el-button>
              </el-tooltip>
              <template v-if="planDetail.apState == -1">
                <el-button
                  type="primary"
                  @click="edit()"
                  v-if="customPermission.proposalPermission && (role == 'MD' || role == 'BD')"
                  v-qadn-mta-h5="{ id: 'a004_b010_c000_d000_bt097_ck03' }"
                  >编辑</el-button
                >
                <el-button type="primary" @click="editPlan" v-if="customPermission.proposalPermission && role == 'MD'"
                  >配点</el-button
                >
              </template>
            </div>
          </div>
          <div>
            <detail :detail="planDetail" v-if="isShow" ref="detailRef">
              <div class="plan-detail">
                <div class="plan-detail-left">
                    <ul>
                        <li>
                            <span>公司名称：</span>
                            <em>{{planDetail.cName}}</em>
                        </li>
                         <li>
                            <span>公司品牌：</span>
                            <em>{{planDetail.bTitle || '--'}}</em>
                        </li>
                        <li>
                            <span>联系人：</span>
                            <em>{{planDetail.cuName}}</em>
                        </li>
                        <li>
                            <span>投放城市：</span>
                            <em>{{filter(planDetail.rIDs)}}</em>
                        </li>
                        <li>
                            <span>意向小区总数</span>
                            <em>{{planDetail.proposalResCnt}}</em>
                        </li>
                        <li>
                            <span>计划投放面数</span>
                            <em>{{planDetail.planPdNum}}</em>
                        </li>
                        <li>
                            <span>所属销售：</span>
                            <em>{{planDetail.realName}}</em>
                        </li>
                    </ul>
                </div>
                <div class="plan-detail-right">
                    <dl>
                        <dt></dt>
                        <dd></dd>
                    </dl>
                    <dl>
                        <dt>状态</dt>
                        <dd>{{stateToText(planDetail.apState)}}</dd>
                    </dl>
                </div>
            </div>
            </detail>
          </div>
        </div>
      </div>
      <div class="mediaList_wrap margin_16_64">
        <el-tabs v-model="planPanel" @tab-click="handleClick()">
          <el-tab-pane label="选点排期" name="first">
            <div class="first-wrap box-wrap">
              <div
                class="table_wrap"
                :default-sort="{ prop: 'recName', order: 'descending' }"
                v-loading="loading"
                element-loading-text="玩命加载中.."
                element-loading-spinner="el-icon-loading"
              >
                <el-table
                  border
                  :data="currentPagination"
                  style="width: 100%"
                  max-height="500"
                >
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-form
                        label-position="left"
                        inline
                        class="demo-table-expand"
                      >
                        <el-form-item label="商圈：">
                          <span>{{ props.row.tradingArea }}</span>
                        </el-form-item>
                        <el-form-item label="小区户数">
                          <span>{{ props.row.hNum }}</span>
                        </el-form-item>
                        <el-form-item label="楼盘价格：">
                          <span>{{ props.row.hPrice }}</span>
                        </el-form-item>
                        <el-form-item label="楼栋数量：">
                          <span>{{ props.row.fNum }}</span>
                        </el-form-item>
                        <!-- <el-form-item label="资产编号：">
                          <span>{{ props.row.assetTag }}</span>
                        </el-form-item> -->
                        <el-form-item label="入住年份：">
                          <span>{{ props.row.chDay }}</span>
                        </el-form-item>
                        <el-form-item label="广告限制：">
                          <span>{{ props.row.notPush }}</span>
                        </el-form-item>
                        <el-form-item
                          v-if="
                            sessionData.mediaManageLevel == 1 ||
                            sessionData.saleManageLevel == 2
                          "
                          label="归属公司："
                        >
                          <span class="ellipsis-td">{{
                            props.row.asName || ""
                          }}</span>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="资源名称"
                    min-width="8%"
                    prop="resName"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="cityName"
                    label="城市"
                    min-width="6%"
                    :filters="filterCityData"
                    :filter-method="filterCity"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="districtName"
                    label="区域"
                    min-width="7.4%"
                    :filters="filtersArea"
                    :filter-method="filterOrigin"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="cType"
                    label="楼盘类型"
                    min-width="8.8%"
                  >
                    <template slot-scope="scope">
                      <span>{{ scope.row.cType || "--" }}</span>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="hNum" label="小区户数" min-width="6.0%" align="right">
                                        <template slot-scope="scope">
                                            <span>{{priceToFormat(scope.row.hNum)}}</span>
                                        </template>
                                    </el-table-column> -->
                  <el-table-column label="楼盘价格" min-width="9.0%">
                    <template slot-scope="scope">
                      <span
                        >&yen;{{
                          scope.row.hPrice ? priceFormat(scope.row.hPrice) : 0
                        }}</span
                      >
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="actualMediaCnt"
                    label="媒体数量（门）"
                    min-width="7.4%"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="planAdsCnt"
                    label="计划投放数量（面）"
                    min-width="7.4%"
                  >
                  </el-table-column>
                  <el-table-column prop="timeRange" label="排期" min-width="14.2%" :filters="filtersData" :filter-method="filterTimeRange">
                    <template slot-scope="scope">
                        <template v-if="scope.row.lState==2">
                            <span>{{scope.row.finishTimeRange}}</span>
                            <el-tooltip placement="top">
                                <div slot="content">
                                    <span>{{scope.row.timeRange}}</span>
                                </div>
                                <i class="el-icon-question"> </i>
                            </el-tooltip>
                        </template>
                        <span v-else>{{scope.row.timeRange}}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[50, 100, 200, 300]"
                  :page-size="pageSize"
                  style="text-align: right; margin-top: 10px"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalNum"
                >
                </el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="报价单" name="second">
                        <ap-quotation @detailInfo="setInfo" :quotationData="quotation" :copydata="copyAsidArr" :shopingList="[]" class="price_quo"></ap-quotation>
                    </el-tab-pane> -->
          <!-- <el-tab-pane label="物料信息" name="third">
                        <material :material="materialInfo" :daomater="daoInfo" :loading="maLoading" :isOrder="false"></material>
                    </el-tab-pane> -->
        </el-tabs>
      </div>
      <div class="content_bottom_btn">
        <el-button
          plain
          type="default"
          icon="el-icon-download"
          class="searchBtn"
          v-if="planPanel == 'first'"
          v-qadn-mta-h5="{ id: 'a004_b010_c002_d000_bt102_ck04' }"
          @click="export2Excel(planDetail.apName)"
          :disabled="isDown"
          >导出</el-button
        >
        <el-button
          plain
          class="cancel"
          @click="goBack()"
          v-qadn-mta-h5="{ id: 'a004_b010_c000_d000_bt098_ck03' }"
          >返回</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "../../api/api.js";
// 价格格式化
import commaFormat from "../../commonFun/commaFormat.js";
// 筛选过滤
import filterFormat from "../../commonFun/filterTableData.js";
// 时间格式化
import dateFormat from "../../commonFun/timeFormat.js";
import sessFun from "../../commonFun/sessFun.js";
// 报价单
import apQuotation from "./components/apQuotation.vue";
import material from "./components/materialInfo.vue";
import detail from "./components/detailInfo.vue";
import {
  Table,
  TableColumn,
  Tabs,
  TabPane,
  Button,
  Message,
  MessageBox,
} from "element-ui";

export default {
  name: "planDetail",
  components: {
    apQuotation,
    material,
    detail,
    elTable: Table,
    elTableColumn: TableColumn,
    elTabs: Tabs,
    elTabPane: TabPane,
    elButton: Button,
  },
  data() {
    return {
      // 登录信息
      sessionData: {},
      isDown: false,
      isShow: true,
      //加载中
      loading: true,
      maLoading: true,
      role: "",
      customPermission: {},
      // 方案详情
      planDetail: {
        AdDoor: {},
        barrier: {},
      },
      // 选点排期
      setpointArr: [],
      copyAsidArr: [],
      // 广告物料信息
      materialInfo: [],
      // 道闸物料信息
      daoInfo: [],
      // 报价单详情
      priceSheet: [],
      quotation: {
        isDetail: true,
        quotation: [],
      },
      //物料信息
      // materialInfo: [],
      // 城市过滤结果
      filterCityData: [],
      // 排期时间过滤
      filtersData: [],
      // 地区过滤结果
      filtersArea: [],
      planPanel: "first",
      // 分页时页面条目数量
      pageSize: 100,
      currentPage: 1,
      totalNum: 0,
      //新业务逻辑数据列表
      dataList: [],
    };
  },
  created() {
    // 获取角色
    this.getRole();
    // 获取选点排期数据
    this.getInitData();
  },
  computed: {
    currentPagination() {
      this.totalNum = this.setpointArr.length;
      return this.setpointArr.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
  },
  methods: {
    //跳转配点路由
    editPlan(){
      this.$router.push("./editPlan");
    },
    filter(val) {
            let res = "";
            if (val) {
                for (let data of val.split(",")) {
                    if (!res.includes(data)) {
                        res = data + "," + res;
                    }
                }
                console.log(res);
                res = res.toString().substring(0, res.toString().length - 1);
            }
            return res;
        },
        // 状态转换成文本
        stateToText(val) {
            let state = [
                { text: "未配点", state: -1 },
                { text: "已完成", state: 0 },
                { text: "进行中", state: 1 },
                { text: "未投放", state: 2 },
                { text: "投放中", state: 3 },
                { text: "强制结束", state: 5 }
            ];
            for (let data of state) {
                if (val == data.state) {
                    return data.text;
                }
            }
        },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    setInfo(data) {
      this.priceSheet = data;
    },
    // 导出excel
    export2Excel(name) {
      this.isDown = true;
      let resultArr = [];
      for (let data of this.setpointArr) {
        let obj = {
          ...data,
          hNum: data.hNum == "0" ? "#" : data.hNum,
          fNum: data.fNum == "0" ? "#" : data.fNum,
        };
        resultArr.push(obj);
      }
      require.ensure([], () => {
        const {
          export_json_to_excel,
        } = require("../../vendorExcel/Export2Excel");
        const tHeader = [
          "省份",
          "城市",
          "区域",
          "资源名称",
          "空闲点位",
          "商圈",
          "地址",
          "媒介载体",
          "楼栋数量",
          "住户数量",
          "楼盘价格",
          "楼盘类型",
          "地图中心点",
          "入住年份",
          "车位数",
          "车流量",
          "人流量",
          "广告限制",
          "媒体数量（门）",
          "计划投放数量(面)",
        ];
        const filterVal = [
          "provinceName", //省份
          "cityName",
          "districtName",
          "resName",
          "actualAdsCnt",
          "tradingArea", 
          "resAddress",    // 地址
          "mVehicle",  //媒介载体
          "fNum",    //楼栋数量
          "hNum", 
          "hPrice",
          "cType",
          "mapCenterName",
          "chDay",
          "parkSpaceNum", //车位数
          "carFlow", //车流量
          "peopleFlow",    //人流量
          "notPush", //广告限制
          "actualMediaCnt",
          "planAdsCnt",
        ];
        const list = resultArr;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, name);
        this.isDown = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    // tab点击
    handleClick() {
      if (this.planPanel == "first") {
        this.getSetPoint();
        MtaH5.clickStat("a004_b010_c000_d000_bt099_ck09");
      } else if (this.planPanel == "second") {
        MtaH5.clickStat("a004_b010_c000_d000_bt100_ck09");
      } else if (this.planPanel == "third") {
        MtaH5.clickStat("a004_b010_c000_d000_bt101_ck09");
      }
    },
    // 获取选点排期列表数据
    getInitData() {
      this.isShow = false;

      // 真实数据
      let apid = sessionStorage.getItem("plan_apid");
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apid: apid,
      };
      // uid         int【必填】     当前账户UserID
      // apid        int             公司对应方案apID
      api
        .getApi(this.apiVar.Advertisement + "/GetFanganInfo", info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let info = res.data.data;
            // this.planDetail = {
            //   adcID: info.adcID,
            //   apID: info.apID,
            //   apName: info.apName,
            //   apState: info.apState,
            //   lockStatus: info.lockStatus,
            //   apTotal: info.apTotal,
            //   apcTime: dateFormat.toDateTime(info.apcTime, "/"),
            //   bTitle: info.bTitle,
            //   cName: info.cName,
            //   cuName: info.cuName,
            //   pdEnd: info.pdEnd,
            //   pdStar: info.pdStar,
            //   rID: info.rID,
            //   rIDs: info.rIDs,
            //   realName: info.realName,
            //   pdTotal: this.priceFormat(
            //     (info.apTotal - info.adOtherFee - info.adSendFee) / 100
            //   ),
            //   pdSendFee: this.priceFormat(info.adSendFee / 100),
            //   pdOtherFee: this.priceFormat(info.adOtherFee / 100),
            //   Total: this.priceFormat(info.apTotal / 100),
            //   AdDoor: {
            //     pdTotal: this.priceFormat(
            //       (info.AdDoor.pdTotal -
            //         info.AdDoor.adOtherFee -
            //         info.AdDoor.adSendFee) /
            //         100
            //     ),
            //     pdSendFee: this.priceFormat(info.AdDoor.adSendFee / 100),
            //     pdOtherFee: this.priceFormat(info.AdDoor.adOtherFee / 100),
            //   },
            //   barrier: {
            //     pdTotal: this.priceFormat(
            //       (info.barrier.pdTotal -
            //         info.barrier.adOtherFee -
            //         info.barrier.adSendFee) /
            //         100
            //     ),
            //     pdSendFee: this.priceFormat(info.barrier.adSendFee / 100),
            //     pdOtherFee: this.priceFormat(info.barrier.adOtherFee / 100),
            //   },
            // };
            this.planDetail = {
              ...info,
              apcTime: dateFormat.toDateTime(info.apcTime, "/"),
              pdTotal: this.priceFormat(
                (info.apTotal - info.adOtherFee - info.adSendFee) / 100
              ),
              pdSendFee: this.priceFormat(info.adSendFee / 100),
              pdOtherFee: this.priceFormat(info.adOtherFee / 100),
              Total: this.priceFormat(info.apTotal / 100),
              AdDoor: {
                pdTotal: this.priceFormat(
                  (info.AdDoor.pdTotal -
                    info.AdDoor.adOtherFee -
                    info.AdDoor.adSendFee) /
                    100
                ),
                pdSendFee: this.priceFormat(info.AdDoor.adSendFee / 100),
                pdOtherFee: this.priceFormat(info.AdDoor.adOtherFee / 100),
              },
              barrier: {
                pdTotal: this.priceFormat(
                  (info.barrier.pdTotal -
                    info.barrier.adOtherFee -
                    info.barrier.adSendFee) /
                    100
                ),
                pdSendFee: this.priceFormat(info.barrier.adSendFee / 100),
                pdOtherFee: this.priceFormat(info.barrier.adOtherFee / 100),
              },
            };
            // 选点排期
            this.getSetPoint();
          } else {
            Message.warning(res.data.MSG);
          }
        })
        .catch((res) => {
          console.log(res);
        });
    },
    // 获取选点排期
    getSetPoint() {
      if (this.setpointArr.length) {
        return;
      }
      // 真实数据
      let apid = sessionStorage.getItem("plan_apid");
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apid: apid,
      };
      if (this.planDetail.apState == 1) {
        // apState: 1 方案并未转成订单
        this.funcToInit(
          this.apiVar.Advertisement + "/GetADB",
          info,
          this.planDetail.apState
        );
      } else {
        // this.funcToInit(this.apiVar.Advertisement+'/GetAdLaunch', info, this.planDetail.apState);
        this.getPlanResList();
      }
    },
    //获取新业务逻辑数据
    getPlanResList() {
      console.log("this.planDetail: ", this.planDetail);
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apID: this.planDetail.apID,
      };
      api.getApi("/addsp/proposal/getPlanResList", params).then((res) => {
        console.log("获取详情页面小区数据", res);
        if (res.data.SysCode === 200200) {
          this.loading = false;
          let resInfo = res.data.data
           for (let data of resInfo) {
              let time = "";
              if (this.planDetail.apState == 1) {
                time =
                  this.formatTime(data.pbStar) +
                  "-" +
                  this.formatTime(data.pbEnd);
              } else {
                time =
                  this.formatTime(data.lStar) +
                  "-" +
                  this.formatTime(data.lEnd);
              }
              data.timeRange = time;
              let finishTimeRange = "";
              if (data.lState == 2) {
                finishTimeRange =
                  this.formatTime(data.lStar) +
                  "-" +
                  this.formatTime(data.lSetTime);
              }
              data.finishTimeRange = finishTimeRange;
            }
            // 城市筛选过滤
            this.filterCityData = filterFormat(resInfo, "cityName");
            this.filtersArea = filterFormat(resInfo, "districtName");
            this.filtersData = filterFormat(resInfo, "timeRange");
            // 选点排期
            // this.copyAsidArr = JSON.parse(JSON.stringify(resInfo));
            this.setpointArr = resInfo;

          // this.setpointArr = res.data.data;
            this.$nextTick(function () {
              this.isShow = true;
          });
        } else {
          sessFun.messageFun("warning", "获取失败");
        }
      }).catch((res) => {
          this.loading = false;
          console.log(res);
        });
    },
    // 请求数据整合
    funcToInit(apiUrl, info, state) {
      // uid         int【必填】     当前账户UserID
      // apid        int             公司对应方案apID
      api
        .getApi(apiUrl, info)
        .then((res) => {
          if (!res.data.SysCode) {
            let initData = res.data;
            let resInfo = initData.adSpaceInfo;
            // 城市中文名称
            for (let data of resInfo) {
              let time = "";
              if (state == 1) {
                time =
                  this.formatTime(data.pbStar) +
                  "-" +
                  this.formatTime(data.pbEnd);
              } else {
                time =
                  this.formatTime(data.lStar) +
                  "-" +
                  this.formatTime(data.lEnd);
              }
              data.timeRange = time;
              let finishTimeRange = "";
              if (data.lState == 2) {
                finishTimeRange =
                  this.formatTime(data.lStar) +
                  "-" +
                  this.formatTime(data.lSetTime);
              }
              data.finishTimeRange = finishTimeRange;
            }
            // 城市筛选过滤
            this.filterCityData = filterFormat(resInfo, "city");
            this.filtersArea = filterFormat(resInfo, "rName");
            this.filtersData = filterFormat(resInfo, "timeRange");
            // 选点排期
            this.copyAsidArr = JSON.parse(JSON.stringify(resInfo));
            this.setpointArr = resInfo;

            // 广告门物料信息
            let mInfo = initData.gateMaterialInfo;
            let materialRes = [];
            for (let data of mInfo) {
              let str = data.gateMaterialSize.split("-");
              let obj = {
                adSize: str[0],
                adViewSize: str[1],
                pointNum: data.gateMaterialCount,
                resolution: "150dpi",
                colorMode: "CMYK",
                photoFormat: "JPG/TIF/AI/PSD/CDR",
              };
              materialRes.push(obj);
            }
            this.materialInfo = materialRes;

            // 道闸物料信息
            let InfoTest = initData.roadGateMaterialInfo;
            let daoRes = [];
            for (let data of InfoTest) {
              let str = data.roadGateMaterialSize.split("-");
              let obj = {
                adSize: str[1],
                adViewSize: str[0],
                pointNum: data.roadGateMaterialCount,
                resolution: "150dpi",
                colorMode: "CMYK",
                photoFormat: "JPG/TIF/AI/PSD/CDR",
              };
              daoRes.push(obj);
            }
            this.daoInfo = daoRes;
            this.loading = false;
            this.maLoading = false;

            this.$nextTick(function () {
              this.isShow = true;
            });
          } else {
            Message.warning(res.data.MSG);
          }
        })
        .catch((res) => {
          this.loading = false;
          this.maLoading = false;
          console.log(res);
        });
    },
    // 时间格式规范
    formatTime(val) {
      return dateFormat.toDate(val, "/");
    },
    // 价格加上逗号
    priceFormat(price) {
      return commaFormat.init(price);
    },
    priceToFormat(price) {
      if (!price) {
        return 0;
      }
      return commaFormat.format(price);
    },
    // 返回
    goBack() {
      this.$router.push("./planList");
    },
    // 弹出框修改路径
    changeRoute() {
      MessageBox.confirm(`该方案被预锁,请先解除预锁,是否去解锁？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$router.push("./planList");
        })
        .catch(() => {
          Message.info("已取消操作");
        });
    },
    // 重新预锁
    reLock() {
      this.$confirm("是否确定对该方案重新进行预锁？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 方案详情的预锁重置
          api
            .postApi(this.apiVar.Advertisement + "/ResetFangLock", {
              uid: this.sessionData.uID,
              token: this.sessionData.token,
              apid: sessionStorage.getItem("plan_apid"),
            })
            .then((res) => {
              if (!res.data.SysCode) {
                console.log("res.data", res.data);
              } else {
                Message.success("重新预锁成功！");
              }
            });
        })
        .catch(() => {});
    },
    //清空草稿箱数据
    clearDrafts(apid) {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apID:apid
      };
      api.postApi(this.apiVar.CleanAdBackUp, params).then((res) => {
        console.log("清空草稿箱", res);
        if (res.data.SysCode === 200200) {
          console.log("清除草稿箱失败成功");
        } else {
          sessFun.messageFun("warning", "清除草稿箱失败");
        }
      });
    },
    // 编辑
    edit() {
      let apid = sessionStorage.getItem("plan_apid");
      sessionStorage.setItem("planDetail",JSON.stringify(this.planDetail))
      let session = this.sessionData;
      let info = {
        uid: session.uID,
        token: session.token,
        apid: apid,
      };
      api
        .postApi(this.apiVar.Advertisement + "/CheckLock", info)
        .then(async (res) => {
          if (!res.data.SysCode) {
            if (!res.data.IsLock) {
              await this.clearDrafts(apid)
              this.$router.push("./editEmptyPointPlan");
            } else {
              this.changeRoute();
            }
          }
        });
    },
    // 获取角色
    getRole() {
      this.sessionData = sessFun.getSess();
      this.role = this.sessionData.uType;
      this.customPermission = this.sessionData.customPermission;
    },
    filterCity(value, row) {
      return row.cityName === value;
    },
    filterOrigin(value, row) {
      return row.districtName === value;
    },
    filterTimeRange(value, row) {
      return row.timeRange === value;
    },
  },
};
</script>

<style scoped lang="scss">
.ellipsis-td {
  width: 132px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/*状态行*/
/deep/ .el-table .warning-row {
  background: #fff1f1;
}

/*tabbar*/
/deep/ .el-textarea__inner {
  resize: vertical;
}

/deep/ .el-tabs__nav-wrap::after {
  background-color: transparent;
}

.box-wrap {
  background-color: #fff;
}
.price_quo {
  margin: 8px 32px;
}
/deep/ .el-tabs__nav-scroll {
  padding-left: 28px;
}

.baojiadan /deep/ .el-tabs__nav-scroll {
  padding-left: 0;
}

.box-wrap > h4 {
  height: 55px;
  padding-left: 28px;
  border-bottom: 1px solid #e6e7e9;
  font-size: 16px;
  color: rgba(51, 51, 51, 0.85);
  line-height: 55px;
  font-weight: bold;
}

/deep/ .el-table__column-filter-trigger {
  left: 5px;
}

.table_wrap {
  padding: 8px 32px;
}

/*报价单*/

/deep/ .el-tabs--border-card {
  box-shadow: none;
}

/deep/ .el-tabs--border-card > .el-tabs__content {
  padding: 40px;
}

.panel {
  padding: 10px 24px;
}

.step3 {
  padding: 0 105px;
}

/deep/ .el-tabs--border-card > .el-tabs__content {
  padding: 40px;
}
/deep/ .el-button.el-button--text span {
  position: relative;
  top: -5px;
}

/*详情头部*/
.content_top_wrap {
  padding: 24px 32px;
  background: #ffffff;
  height: 145px;
  position: relative;
}

.plan-title .handleBtn {
  position: absolute;
  right: 28px;
  top: 30px;
}

.plan-title .handleBtn button {
  width: 74px;
  height: 32px;
  font-size: 14px;
  line-height: 9px;
  padding: 0;
}

.plan-title h4 {
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;
  margin-bottom: 22px;
}

.plan-title h4 p {
  display: inline-block;
  font-size: 14px;
  color: #666666;
  font-weight: normal;
  margin-left: 11px;
}

.plan-title h4 p img {
  width: 14px;
  height: 14px;
  position: relative;
  top: 1px;
  cursor: pointer;
}

.plan-title h4 img {
  width: 28px;
  height: 28px;
  position: relative;
  top: 5px;
  margin-right: 16px;
}

/*面包屑导航*/
.tip {
  font-size: 14px;
  color: #999999;
  text-align: right;
  line-height: 36px;
  display: inline-block;
  float: right;
  height: 36px;
}

/*按钮*/
.content_bottom_btn {
  margin: 32px 0;
  width: 100%;
  text-align: center;
}

.content_bottom_btn button {
  width: 80px;
  height: 34px;
  line-height: 34px;
  outline: none;
  cursor: pointer;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  background: #ffffff;
  font-size: 14px;
  color: #666666;
}

/deep/ .mediaList_wrap .el-tabs__header {
  border-bottom: 1px solid #e6e7e9;
  height: 53px;
  line-height: 54px;
}
/deep/.mediaList_wrap .baojiadan .el-tabs__header {
  border-bottom: none;
  height: 38px;
  line-height: 38px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  margin: 0;
}

/deep/ .content_bottom_btn .el-button {
  padding: 0;
}
/deep/ .el-table__expanded-cell[class*="cell"] .el-form {
  height: 44px;
  line-height: 44px;
}
/deep/ .el-table__expanded-cell[class*="cell"] {
  padding: 0 46px;
  background-color: #f7f7f7;
}
/deep/ .el-form-item__content {
  line-height: 46px;
}
/deep/ .table_wrap .el-table__body-wrapper {
  min-height: auto;
}
#pane-second {
  margin-bottom: 32px;
}
</style>
