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

            <h4 style="display: flex;">
              <!-- <img src="../../assets/images/orderlogo.png" alt="" /> -->
              <span v-if="!planDetail.papID" class="order_type_tag blue">母</span>
              <span v-else class="order_type_tag green">子</span>
              <span>{{ planDetail.apName }}</span>
            </h4>

            <div class="handleBtn">
              <!--<el-button plain>导出</el-button>-->
              <el-tooltip
                v-if="['ADN_MD_COUNTRY', 'ADN_MD'].includes(role) && planDetail.lockStatus == 1"
                effect="dark"
                content="从今天起重新预锁七天"
                placement="top"
              >
                <el-button @click="reLock">预 锁</el-button>
              </el-tooltip>
              <template v-if="planDetail.apState == -1">
                <el-button v-if="customPermission.proposalPermission == 1 && ['ADN_BD_KA', 'ADN_BD'].includes(role)" plain @click="createShareCode">协同选点</el-button>
                <el-button v-if="customPermission.proposalPermission == 1 && ['ADN_BD_KA', 'ADN_BD'].includes(role) && sessionData.uType != 'ADN_BD_KA'" plain :disabled="matchCnt>=10" @click="matchRes(planDetail.apID)">{{`配点(${10-matchCnt})`}}</el-button>
                <el-button v-if="customPermission.proposalPermission && ['ADN_MD_COUNTRY', 'ADN_MD'].includes(role)" plain @click="editPlan">配点</el-button>
                <el-button
                  type="primary"
                  @click="edit()"
                  v-if="customPermission.proposalPermission && (['ADN_MD_COUNTRY', 'ADN_MD'].includes(role) || ['ADN_BD_KA', 'ADN_BD'].includes(role))"
                  >编辑</el-button
                >
              </template>

              <!-- 母单显示 -->
              <el-button
                v-if="!planDetail.papID"
                type="plain"
                @click="openInfoDialog"
              >
                资料补充
              </el-button>
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
                        <span>投放城市：</span>
                        <em>{{filter(planDetail.rIDs)}}</em>
                      </li>
                      <li>
                        <span>所属销售：</span>
                        <em>{{planDetail.realName}}</em>
                      </li>
                      <li>
                        <span>公司品牌：</span>
                        <em>{{planDetail.bTitle || '--'}}</em>
                      </li>
                      <li>
                        <span>意向小区总数：</span>
                        <em>{{planDetail.proposalResCnt}}</em>
                      </li>
                      <li>
                        <span>联系人：</span>
                        <em>{{planDetail.cuName}}</em>
                      </li>
                      <li>
                        <span>计划投放面数：</span>
                        <em>{{planDetail.planPdNum}}</em>
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
                      <dd>
                        <b class="order-badge" :style="{background: stateToText(planDetail.apState).color}"></b>
                        {{stateToText(planDetail.apState).text}}
                      </dd>
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
                        <el-form-item label="入住年份：">
                          <span>{{ props.row.chDay }}</span>
                        </el-form-item>
                        <el-form-item label="广告限制：">
                          <span>{{ props.row.notPush }}</span>
                        </el-form-item>
                        <el-form-item
                          v-if="
                            sessionData.uType == 'ADN_MD_COUNTRY' ||
                            sessionData.uType == 'ADN_BD_KA'
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
                  <el-table-column label="楼盘价格" min-width="9.0%" align="right">
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
                    label="媒体数量(门)"
                    min-width="7.4%"
                    align="right"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="planAdsCnt"
                    label="计划投放数量(面)"
                    min-width="7.4%"
                    align="right"
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
        </el-tabs>
      </div>
      <div class="content_bottom_btn">
        <el-button
          v-if="planPanel == 'first'"
          plain
          type="default"
          icon="el-icon-download"
          class="searchBtn"
          :disabled="isDown"
          @click="export2Excel(planDetail.apName)"
        >
          导出
        </el-button>
        <el-button
          plain
          class="cancel"
          @click="goBack()"
        >
          返回
        </el-button>
      </div>
    </div>

    <!--智能配点-->
    <add-point :dialogVisible="addPointDialogVisible" :showMatchResult="false" :matchCnt.sync="matchCnt" :apID="planDetail.apID" :rejectAdPlan="rejectAdPlan" :ADLimit="ADLimit" :customPermission="customPermission" @closeAddPoint="addPointDialogVisible=false" @openAddPoint="addPointDialogVisible=true" @merge2ShopList="BDSaveMatchToPlan"></add-point>

    <!-- 订单详情-资料补充-弹窗 -->
    <OrderReplenishInfoDialog ref="orderReplenishInfoDialogRef" />
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
import detail from "./components/detailInfo.vue";
import addPoint from './components/addPoint.vue'
import {
  Message,
  MessageBox,
} from "element-ui";
import OrderReplenishInfoDialog from  './components/orderReplenishInfoDialog.vue'

export default {
  name: "planDetail",
  components: {
    detail,
    addPoint,
    OrderReplenishInfoDialog
  },
  data() {
    return {
      // 登录信息
      sessionData: {},
      addPointDialogVisible: false,
      matchCnt: 10,
      rejectAdPlan: [],                  // 排斥方案选项
      // showMatchResult: false,
      ADLimit: [                      // step2 广告限制
        {value: '地产', label: '地产'},
        {value: '汽车', label: '汽车'},
        {value: '美容', label: '美容'},
        {value: '餐饮', label: '餐饮'},
        {value: '食品', label: '食品'},
        {value: '金融', label: '金融'},
        {value: '医学', label: '医学'},
      ],
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
      // 报价单详情
      priceSheet: [],
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
    this.getMatchCnt(sessionStorage.getItem("plan_apid"));
  },
  mounted() {
    if(this.$route.query.option) {
      // 销售创建完成时配点跳转到该页面触发，不需要获取方案详情，就可弹框(该方案为未配点状态)
      let apID = this.$route.query.option.split('match')[1];
      if(apID) {
        this.planDetail.apID = apID;
        apID && this.matchRes(apID, 'created');
      }
    }
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
    /**
     * 打开资料补充弹框
     */
    openInfoDialog() {
      const apId = sessionStorage.getItem('plan_apid')
      this.$refs.orderReplenishInfoDialogRef && this.$refs.orderReplenishInfoDialogRef.open(apId)
    },

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
            { text: "未配点", state: -1, color: 'rgba(250, 173, 20, 1)' },
            { text: "已完成", state: 0, color: 'rgba(196,203,211,1)' },
            { text: "进行中", state: 1, color: 'rgb(113, 213, 217)' },
            { text: "未投放", state: 2, color: 'rgba(82,196,26,1)' },
            { text: "投放中", state: 3, color: 'rgba(24,144,255,1)' },
            { text: "强制结束", state: 5, color: 'rgba(245,34,45,1)' }
        ];
        for (let data of state) {
            if (val == data.state) {
                return data;
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
          "资源名称",
          "省份",
          "城市",
          "区域",
          "详细地址",
          "媒介载体",
          "商圈",
          "楼栋数量",
          "住户数量",
          "楼盘价格",
          "楼盘类型",
          "入住时间",
          "广告限制",
          "车位数",
          "车流量",
          "人流量",
          "媒体数量（门）",
          "可投数量(面)",
          "地图中心点",
          "计划投放数量(面)",
        ];
        const filterVal = [
          "resName",
          "provinceName", //省份
          "cityName",
          "districtName",
          "resAddress",    // 地址
          "mVehicle",  //媒介载体
          "tradingArea",
          "fNum",    //楼栋数量
          "hNum",
          "hPrice",
          "cType",
          "chDay",
          "notPush", //广告限制
          "parkSpaceNum", //车位数
          "carFlow", //车流量
          "peopleFlow",    //人流量
          "actualMediaCnt",
          "actualAdsCnt",
          "mapCenterName",
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
      api
        .getApi(this.apiVar.Advertisement + "/GetFanganInfo", info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let info = res.data.data;
            this.planDetail = {
              ...info,
              apcTime: dateFormat.toDateTime(info.apcTime, "/"),
              pdTotal: this.priceFormat(
                (info.apTotal/100 - info.otherFee - info.sendFee)
              ),
              pdSendFee: this.priceFormat(info.sendFee),
              pdOtherFee: this.priceFormat(info.otherFee),
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
            this.getRejectPlanList(res.data.data.suID);
          } else {
            Message.warning(res.data.MSG);
          }
        })
        .catch((res) => {
          console.log(res);
        });
    },
    createShareCode() {
      api.postApi('/addsp/proposal/share/createShareCode', {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          apID: this.planDetail.apID
      }).then((res) => {
          if (res.data.SysCode === 200200) {
              let Url = `${window.location.protocol}//${window.location.host}/shareADListProposal?apid=${res.data.data.apID}&aicode=${res.data.data.aiCode}`;
              console.log('url', Url);
              let oInput = document.createElement('input');
              oInput.value = Url;
              document.body.appendChild(oInput);
              oInput.select();                // 选择对象
              document.execCommand("Copy"); // 执行浏览器复制命令
              oInput.style.display = 'none';
              sessFun.messageFun("success", '协同选点链接复制成功，马上分享');
          } else {
              sessFun.messageFun("warning", res.data.MSG);
          }
      });
    },
    // 销售配点
    matchRes(apID, created) {
      if(!apID) return
      let info = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          apid: apID
      };
      api.postApi(this.apiVar.Advertisement+"/CheckLock", info).then(async res =>{
          if(!res.data.SysCode){
              if(!res.data.IsLock){
                // if(created || this.planDetail.apState==-1) {
                  // 方案未配点
                    this.addPointDialogVisible = true
                /* } else {
                  // 方案已配点，显示上次配点结果
                  this.showMatchResult = true
                  this.$nextTick(()=>{
                    // 重置显示参数，方便下次触发watch
                    this.showMatchResult = false
                  })
                } */
              } else{
                this.changeRoute();
              }
          }
      });
    },
    // 获取该用户下的配点次数
    getMatchCnt(apID) {
      return new Promise((resolve)=>{
        api.getApi("/addsp/match/getMatchCnt?apID="+apID).then(res => {
          if (res.data.SysCode == 200200) {
            this.matchCnt = res.data.data||0
            resolve(true)
          } else {
            sessFun.messageFun('warning', res.data.MSG)
            resolve(false)
          }
          }).catch(err => {
            console.log(err);
            resolve(false)
          });
      })
    },
    // 替换方案中的点位
    BDSaveMatchToPlan() {
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apID: this.planDetail.apID
      };
      api.postApi("/addsp/match/UpdatePlan", info).then((res) => {
        if (res.data.SysCode === 200200) {
          this.$router.push("./planDetail");
          sessFun.messageFun("success", '保存配点成功！');
        } else {
          sessFun.messageFun("warning", res.data.MSG);
        }
      });
    },
    // 获取选点排期
    getSetPoint() {
      if (this.setpointArr.length) {
        // 防止重复点击tab
        return;
      }
      // 真实数据
      let apid = sessionStorage.getItem("plan_apid");
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apid: apid,
      };
      // 未配点方案
      if(this.planDetail.apState == -1) {
        this.getPlanResList();
      }
    },
    getADLimit() {
      this.ADLimit = []
      let params = {
          "uid": this.sessionData.uID,
          "token": this.sessionData.token,
          "service":"GetNotPush",
          "data": {}
      }
      api.postApi_new(this.apiVar.Media, params).then(res => {
          console.log('广告限制列表', res)
          if(res.data.SysCode === 200200 ){
              let limit = res.data.data
              let limitArr = []
              for (let i = 0; i < limit.length; i++) {
                  let limitObj = {value: limit[i].nTitle, label: limit[i].nTitle}
                  limitArr.push(limitObj)
              }
              this.ADLimit = limitArr
          }
      })
  },
  // 获取排斥方案选择列
  getRejectPlanList(suID){
      let params = {
          uid:this.sessionData.uID,
          token: this.sessionData.token,
          sales_user: suID
      }
      api.getApi(this.apiVar.Advertisement + '/getSalesProject', params).then(res => {
          console.log('销售所属方案',res)
          if (res.data.SysCode == 200200) {
              let resData =  res.data.data
              let tempList = []
              for(let key of resData){
                  if(this.apid != key.apId){
                      tempList.push({
                          value: key.apId,
                          label: key.apName + '（' + key.cname + ' · ' + key.apcTime + '）'
                      })
                  }
              }
              this.rejectAdPlan = tempList
          } else {
              sessFun.messageFun('warning',res.data.MSG)
          }
      })
  },
    //获取新业务逻辑数据
    getPlanResList() {
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
            this.setpointArr = resInfo;
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
        apID: apid
      };
      api.postApi(this.apiVar.CleanAdBackUp, params).then((res) => {
        if (res.data.SysCode === 200200) {
          console.log("清除草稿箱成功");
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

.plan-detail-left {
  ul {
    flex-direction: column;
    flex-wrap: wrap;
    height: 96px;
  }
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

.order_type_tag {
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  font-size: 18px;
  color: #fff;
  border-radius: 4px;
  margin-right: 10px;
  &.blue {
    background-color: #1890FF;
  }
  &.green {
    background-color: #67c23a;
  }
}
</style>
