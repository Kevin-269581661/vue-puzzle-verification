<!--
 * @Author: penglei
 * @Date: 2021-06-17 20:11:38
 * @LastEditors: penglei
 * @LastEditTime: 2021-06-22 18:24:52
 * @FilePath: /frontend/src/components/develop/constractList.vue
-->
<template>
  <div class="ad_mediaDetail_wrap clearfix">
    <div class="ad_mediaDetail_nav">
      <p class="clearfix">
        <a href="#" style="color: #999">合同管理</a><em> / </em
        ><a href="#">合同列表</a>
      </p>
    </div>
    <div class="mediaList_wrap">
      <div class="mediaList_head">
        <h2>合同列表</h2>
      </div>
      <div class="mediaList_container">
        <el-form
          :model="searchInfo"
          ref="constractSearchForm"
          class="search-row"
        >
          <el-row :gutter="36">
            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
              <el-form-item label="关键字：" :prop="searchInfo.keywordType">
                <el-input
                  placeholder="请输入内容"
                  v-model="searchInfo[searchInfo.keywordType]"
                  size="small"
                  class="search-row-item"
                >
                  <el-select
                    v-model="searchInfo.keywordType"
                    slot="prepend"
                    size="small"
                    placeholder="请选择"
                  >
                    <el-option label="资源名称" value="resName"></el-option>
                    <el-option label="物业名称" value="pmcName"></el-option>
                    <!-- “业务员”只有开发总监与资产人员可筛选 -->
                    <el-option label="业务员" value="contactsName"></el-option>
                    <el-option label="合同编号" value="contractNo"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
              <el-form-item label="城市区域：" prop="districtId">
                <el-cascader
                  v-model="searchInfo.districtId"
                  placeholder="请选择城市区域"
                  size="small"
                  class="search-row-item"
                  :options="areaArr"
                  :clearable="true"
                  filterable
                  :props="{ checkStrictly: true }"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col
              :xs="12"
              :sm="8"
              :md="8"
              :lg="8"
              :xl="6"
              class="combination-serch"
            >
              <el-form-item label="选择日期：" :prop="searchInfo.rangeDateType">
                <el-select
                  size="small"
                  v-model="searchInfo.rangeDateType"
                  placeholder="请选择日期"
                  class="combination-serch-select"
                >
                  <el-option label="合同开始日期" value="startDate"></el-option>
                  <el-option label="合同签约日期" value="signDate"></el-option>
                  <el-option label="最近待付款日期" value="payDate"></el-option>
                  <el-option label="合同结束日期" value="endDate"></el-option>
                  <el-option label="创建日期" value="createDate"></el-option>
                </el-select>
                <el-date-picker
                  v-model="searchInfo[searchInfo.rangeDateType]"
                  size="small"
                  type="daterange"
                  align="right"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="combination-serch-date"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col
              :xs="12"
              :sm="8"
              :md="8"
              :lg="8"
              :xl="6"
              class="row-btn-group"
            >
              <el-button type="primary" @click="searchFun">搜索</el-button>
              <el-button plain @click="constractSearchForm">重置</el-button>
              <el-button plain size="small" @click="routeCreateConstract"
                >新建</el-button
              >
              <el-button plain size="small" @click="exportConstract"
                >导出</el-button
              >
            </el-col>
          </el-row>
        </el-form>

        <div class="table_wrap">
          <el-table
            border
            :data="constractList"
            style="width: 100%"
            v-loading="loading"
            element-loading-text="玩命加载中.."
            element-loading-spinner="el-icon-loading"
          >
            <el-table-column prop="resName" label="资源名称" width="160" show-overflow-tooltip></el-table-column>
            <el-table-column
              prop="dcType"
              label="合同线"
              width="160"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="dcType"
              label="合同类型"
              min-width="160"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="startDate"
              label="合同开始日期"
              min-width="160"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="endDate"
              label="合同结束日期"
              width="160"
              align="right"
            >
              <template slot-scope="scope"> </template>
            </el-table-column>
            <el-table-column
              prop="mediaCnt"
              label="合同媒体数"
              min-width="120"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="installMediaCnt"
              label="已装媒体数"
              min-width="120"
            >
            </el-table-column>

            <el-table-column
              prop="venueFee"
              label="场地费"
              width="120"
              :filters="[
                { text: '无场地费', value: 0 },
                { text: '有场地费', value: 1 },
              ]"
              :filter-method="filterIsVenueFeeFun"
              :filter-multiple="false"
            >
              <template slot-scope="scope">
                <span>{{ formatTime(scope.row.venueFee) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="devFee"
              label="开发费"
              width="120"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ formatTime(scope.row.devFee) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="payDate"
              label="最近待付款日期"
              width="160"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ formatTime(scope.row.payDate) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createUserName"
              label="业务员"
              width="120"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ scope.row.createUserName||"" }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="contractNo"
              label="合同编号"
              width="120"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ formatTime(scope.row.contractNo) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建日期"
              width="120"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ scope.row.createTime||"" }}</span>
              </template>
            </el-table-column>
            <el-table-column
              class="tac"
              prop="dcState"
              label="合同状态"
              min-width="160"
              show-overflow-tooltip
              fixed="right"
              :filters="[
                { text: '禁用', value: '0' },
                { text: '正常', value: '1' },
                { text: '待安装', value: '2' },
                { text: '待维修', value: '3' },
              ]"
              :filter-multiple="true"
            >
              <template slot-scope="scope"> </template>
            </el-table-column>
            <el-table-column label="操作" width="100px" fixed="right">
              <template slot-scope="scope">
                <el-dropdown
                  size="small"
                  trigger="click"
                  placement="bottom-start"
                >
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native.prevent="addPoint(scope.row)"
                      :disabled="isDisable || scope.row.apState !== -1"
                      >编辑
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click.native.prevent="preload(scope.row)"
                      :disabled="
                        isDisable ||
                        scope.row.apState !== 1 ||
                        (scope.row.apState == 1 && !scope.row.canLock)
                      "
                      >重新提交
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click.native.prevent="release(scope.row)"
                      :disabled="
                        isDisable ||
                        scope.row.apState !== 1 ||
                        (scope.row.apState != 1 &&
                          scope.row.apControlLevel !== 1)
                      "
                      >加门
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click.native.prevent="clearLock(scope.row)"
                      :disabled="
                        isDisable ||
                        scope.row.apState !== 1 ||
                        (scope.row.apState == 1 && !scope.row.unLock)
                      "
                      >补充协议
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click.native.prevent="splitAdPlan(scope.row)"
                      v-if="
                        scope.row.apControlLevel === 2 &&
                        sessionData.uType === 'BD'
                      "
                    >
                      媒体录入
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click.native.prevent="splitAdPlan(scope.row)"
                      v-if="
                        scope.row.apControlLevel === 2 &&
                        sessionData.uType === 'BD'
                      "
                    >
                      续签
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click.native.prevent="splitAdPlan(scope.row)"
                      v-if="
                        scope.row.apControlLevel === 2 &&
                        sessionData.uType === 'BD'
                      "
                    >
                      付款
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click.native.prevent="splitAdPlan(scope.row)"
                      v-if="
                        scope.row.apControlLevel === 2 &&
                        sessionData.uType === 'BD'
                      "
                    >
                      删除
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click.native.prevent="splitAdPlan(scope.row)"
                      v-if="
                        scope.row.apControlLevel === 2 &&
                        sessionData.uType === 'BD'
                      "
                    >
                      付款记录
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>

          <div class="ad_pagination">
            <el-pagination
              background
              @size-change="sizeChange"
              @current-change="changePage"
              :current-page.sync="currPage"
              :page-sizes="[10, 20, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalNum"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 预锁公司 -->
    <el-dialog
      :title="isLock ? '请选择预锁公司' : '请选择解锁公司'"
      :visible.sync="dialogVisible"
      width="35%"
      center
    >
      <el-checkbox-group v-model="cityChoose">
        <template v-if="isLock">
          <el-checkbox
            :label="item.asrID"
            v-for="item of cityList"
            :key="item.rid"
            border
            :disabled="item.RemainDay >= 0"
            size="mini"
            >{{ item.asName }}
          </el-checkbox>
        </template>
        <template v-else>
          <el-checkbox
            :label="item.asrID"
            v-for="item of cityList"
            :key="item.rid"
            border
            :disabled="item.RemainDay == undefined || item.RemainDay == null"
            size="mini"
            >{{ item.asName }}
          </el-checkbox>
        </template>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="cancelLock">取 消</el-button>
        <el-button type="primary" @click="confirmLock">确 定</el-button>
      </span>
    </el-dialog>

    <!--发布方案-->
    <el-dialog
      title="发布方案"
      :visible.sync="publishPlanDialog"
      :close-on-click-modal="false"
      custom-class="publish_dialog"
      :show-close="false"
      width="368px"
    >
      <span class="comment">完善以下信息后提交，即可完成发布</span>
      <el-form label-position="top">
        <el-form-item label="合同编号" label-width="80px">
          <el-input size="small" v-model="QCinfo"></el-input>
        </el-form-item>
        <el-form-item label="订单类型" label-width="80px">
          <el-select
            v-model="planType"
            size="small"
            placeholder="请选择活动区域"
          >
            <el-option label="常规" value="0"></el-option>
            <el-option label="续刊" value="1"></el-option>
            <el-option label="补刊" value="2"></el-option>
            <el-option label="空刊" value="3"></el-option>
            <el-option label="赠送" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="planType == 1 || planType == 2"
          :label="`${['常规', '续刊', '补刊', '空刊', '赠送'][planType]}订单`"
          label-width="80px"
        >
          <el-select
            v-model="relatedApId"
            size="small"
            :placeholder="`请选择${
              ['常规', '续刊', '补刊', '空刊', '赠送'][planType]
            }的订单`"
            filterable
            :clearable="true"
          >
            <el-option
              v-for="item in apList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="publishPlanDialog = false">取 消</el-button>
        <el-button type="primary" @click="commitRelease">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../api/api.js";
// 价格格式化
import commaFormat from "../../commonFun/commaFormat.js";
// 时间格式化
import dateFormat from "../../commonFun/timeFormat.js";
import sessFun from "../../commonFun/sessFun.js";
// 方案缓存
import cacheAdPlan from "../../commonFun/cacheAdPlan";
import downloadVacancy from "../../components/common/components/vacancyDownload.vue";
// import noSearchResult from "./components/noSearchResult.vue";
// 筛选过滤
import filterFormat from "../../commonFun/filterTableData.js";

import timeFormat from "../../commonFun/timeFormat.js";

export default {
  name: "projectList",
  components: {
    downloadVacancy,
    // noSearchResult,
  },

  data() {
    return {
      // 角色 合同类型 合同状态 合同列表权限 
      
      areaArr: [],
      // 搜索数据
      searchInfo: {
        keywordType: "resName",
        rangeDateType: "startDate",
        resName: "",
        pmcName: "",
        contactsName: "",
        contractNo: "",
        districtId: "",
        isVenueFee: "",
        startDate: "",
        endDate: "",
        signDate: "",
        payDate: "",
        createDate: "",
      },
      // 公司列表
      companyData: [],
      // 分页信息
      pageSize: 10,
      currPage: 1,
      totalPage: 0,
      totalNum: 0,
      isAll: false,
      Ctrlloading: false,
      // 登录信息、
      sessionData: {},
      // 合同编号
      QCinfo: "",
      // 登录者角色
      role: "",
      //   判断是否有发布，预锁解锁等功能
      isDisable: true,
      isShowExportBtn: false, //资源导出按钮
      //加载中
      loading: false,
      currentItem: {},
      // 解锁还是预锁
      isLock: false,
      // 预锁弹出框
      dialogVisible: false,
      // 选择要预锁的城市
      cityChoose: [],
      // 预锁的城市列表
      cityList: [],
      // 状态列表
      stateList: [
        { text: "未配点", value: -1 },
        { text: "已完成", value: 0 },
        { text: "进行中", value: 1 },
        { text: "未投放", value: 2 },
        { text: "投放中", value: 3 },
        { text: "强制结束", value: 5 },
      ],
      // 根据角色判断是否显示新建按钮
      showNewBtn: true,
      isSearch: true,
      isReset: true,
      // 表格数据
      constractList: [],
      // 权限城市过滤数组
      filterCityData: [],
      // 未完成方案提示
      unfinishedDialogVisible: false,
      // 未完成方案
      planInfo: "",
      // 继续编辑未完成方案跳转时的loading
      continueEditLoading: "",
      isSale: false, //销售权限
      // 资源导出
      exportRescityList: [],
      isResExport: false,
      // 当前步骤
      exportAction: "/advertisement/GetCenterPointRes",
      exportResStep: 1,
      exportInfo: {
        citys: [],
        cityName: "",
        radius: "",
        type: "",
      },
      // 导出时到提示标签
      isShowExportTag: true,
      // 请求参数
      exportParams: { cityId: "", asrId: "", type: "", radius: "" },
      // 上传的文件
      exportFileData: [],
      // 导出中
      isBroundImport: false,
      publishPlanDialog: false,
      planType: "0",
      relatedApId: null,
      apList: [],
      IsSevenBD: false,
    };
  },
  created() {
    this.getSessionData();
    // this.getRole();
    // this.getFanCity();
    // if (this.isAll) {
    //   this.getCompany();
    // }
    this.searchFun();
    // if (this.isSale) {
    //   this.getSubSaleList();
    // }
    this.getCity();
  },
  methods: {
    // 切换页码
    changePage(page) {
      this.currPage = page;
      console.log("page----", page);
      this.searchFun();
    },
    // 每页条数切换
    sizeChange(val) {
      console.log("val----", val);
      this.pageSize = val;
      this.currPage = 1;
      this.searchFun();
    },
    // 获取公司
    getCompany() {
      let sess = this.sessionData;
      let info = {
        uid: sess.uID,
        token: sess.token,
      };
      if (sess.ascType == 0) {
        api
          .getApi(this.apiVar.UCAPI + "/GetDirectAscr", info)
          .then((res) => {
            console.log(res);
            if (!res.data.SysCode) {
              let result = [];
              for (let data of res.data) {
                let obj = {
                  label: data.asName,
                  value: data.asrID,
                };
                result.push(obj);
              }
              this.companyData = result;
            } else if (res.data.SysCode == 100403) {
              console.error("获取投放城市", res.data.MSG);
            } else {
              this.messageFun("warning", res.data.MSG);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        api
          .getApi(this.apiVar.UCAPI + "/ShowAscr", info)
          .then((res) => {
            console.log(res);
            if (!res.data.SysCode) {
              let result = [];
              for (let data of res.data) {
                let obj = {
                  label: data.asName,
                  value: data.asrID,
                };
                result.push(obj);
              }
              this.companyData = result;
            } else {
              this.messageFun("warning", res.data.MSG);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 滚动加载获取数据(无搜索数据)
    getData(params) {
      api
        .getApi(this.apiVar.Advertisement + "/GetProposal", params)
        .then((res) => {
          if (!res.data.SysCode) {
            let dataInfo = res.data;
            this.totalNum = dataInfo.total;
            this.currentPlan = this.funcData(dataInfo.list);
            this.loading = false;
            if (dataInfo.totalpage == 0) {
              this.messageFun("warning", "暂无数据");
            }
          } else {
            this.messageFun("warning", res.data.MSG);
          }
        });
    },

    filterIsVenueFeeFun(value, row) {
      return (this.searchInfo.isVenueFee = value);
    },
    // 数据处理
    funcData(dataArr) {
      let result = [];
      for (let data of dataArr) {
        let tmpObj = {};
        // tmpObj = this.setTableData(data);
        result.push(tmpObj);
      }
      console.log("result: ", result);
      return result;
    },
    // 获取session数据
    getSessionData() {
      this.sessionData = sessFun.getSess();
      let sess = this.sessionData;
      if (
        sess.ascType == 0 ||
        (sess.uType == "MD" && sess.mediaManageLevel == 1) ||
        (sess.uType == "BD" && sess.saleManageLevel == 1)
      ) {
        this.isAll = true;
      } else {
        this.isAll = false;
      }
    },
    // 获取城市
    getFanCity() {
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
      };
      api
        .getApi(this.apiVar.Advertisement + "/GetAPDCityNames", info)
        .then((res) => {
          let arr = res.data;
          let result = [];
          if (!arr.SysCode) {
            for (let data of arr) {
              result.push({
                rName: data.rName,
                rID: data.rID,
                text: data.rName,
                value: data.rName,
              });
            }
            this.filterCityData = result;
          } else {
            this.messageFun("warning", res.data.MSG);
          }
        });
    },
    // 判断角色是否有新建按钮(媒介和销售有)
    getRole() {
      let role = this.sessionData.uType;
      this.role = role;
      this.IsSevenBD =
        this.sessionData.customPermission.proposalPermission == 1 &&
        this.sessionData.uType == "BD";
      console.log(role);
      if (role == "MD") {
        this.isDisable = false;
      }
      if (role == "BD") {
        this.isSale = true;
      }
      if (role != "BD" && role != "MD") {
        this.showNewBtn = false;
      }
      if (role == "BD" || role == "SM") {
        this.isDisable = true;
      }
      if (this.sessionData.rela == "直营") {
        this.isShowExportBtn = true;
      } else {
        this.isShowExportBtn = false;
      }
    },
    // 状态转换成文本
    stateToText(val) {
      let state = [
        { text: "已完成", value: 0, color: "rgba(196,203,211,1)" },
        { text: "未配点", value: -1, color: "rgba(250, 173, 20, 1)" },
        { text: "进行中", value: 1, color: "rgba(113, 213, 217, 1)" },
        { text: "未投放", value: 2, color: "rgba(82,196,26,1)" },
        { text: "投放中", value: 3, color: "rgba(24,144,255,1)" },
        { text: "强制结束", value: 5, color: "rgba(245,34,45,1)" },
      ];
      for (let data of state) {
        if (val == data.value) {
          return data;
        }
      }
    },
    // 时间格式规范预锁
    formatTime(val) {
      return dateFormat.toDate(val, "/");
    },
    // 价格加上逗号
    priceFormat(price) {
      return commaFormat.init(price);
    },
    routeSelect() {
      if (this.sessionData.customPermission.proposalPermission == 1) {
        // 直营
        if (this.sessionData.uType == "BD") {
          this.$router.push("./createPlan");
        } else {
          this.$router.push("./createPlanOld");
        }
      } else {
        // 加盟
        this.$router.push("./createPlanOld");
      }
    },
    //新增意向方案查询意向方案草稿箱
    getProposalAdBackUp(params) {
      api
        .getApi(this.apiVar.AddspProposal + "/getAdBackUp", params)
        .then((res) => {
          console.log("获取意向方案缓存", res);
          this.continueEditLoading.close();
          if (res.data.SysCode == 200200) {
            console.log("获取意向方案缓存成功", res.data);
            let data = res.data.data;
            if (JSON.stringify(data) === "{}" || !data) {
              this.$router.push("./createPlan");
            } else {
              // let planInfo = JSON.parse(data)
              this.showProposalCookeAdPlan(data);
              // 缓存到localStorage
              // data.uiD = params.uid
              // cacheAdPlan.setData(data)
            }
          } else {
            // 后台返回异常则查看前台是否有缓存
            let returnData = cacheAdPlan.getData(this.sessionData.uID);
            if (returnData) {
              this.showCookeAdPlan(returnData);
            } else {
              this.routeSelect();
            }
          }
        })
        .catch((err) => {
          console.log("err", err);
          this.continueEditLoading.close();
          if (this.$route.path.includes("planList")) {
            this.routeSelect();
          }
        });
    },
    // 新建方案
    routeCreateConstract() {
      this.$router.push("./newConstract");
    },
    // 点位表盘
    goToDiaPlate() {
      console.log("this.$router", this.$router);
      this.$router.push("./adsDialPlate");
    },
    //显示意向方案缓存信息
    showProposalCookeAdPlan(adPlan) {
      this.planInfo = {
        planName: adPlan.apName,
        ownerSales: adPlan.saleRealName,
        cleatTime: adPlan.lSetTime,
        adsNum: adPlan.resList.length,
      };
      this.unfinishedDialogVisible = true;
    },
    // 显示缓存方案的信息
    showCookeAdPlan(adPlan) {
      // this.planForm.realNamesName
      let ownerSales =
        this.sessionData.uType === "MD" &&
        adPlan.planData.baseInfo.realNamesName
          ? adPlan.planData.baseInfo.realNamesName
          : adPlan.planData.baseInfo.ownerSales;
      this.planInfo = {
        planName: adPlan.planData.baseInfo.planName,
        ownerSales: ownerSales,
        cleatTime: adPlan.setTime,
        adsNum: adPlan.planData.adsList.length,
      };
      this.unfinishedDialogVisible = true;
    },
    // 删除
    deleteOne(row) {
      console.log(row);
    },
    // 随机生成合同编号编码格式： 合同编码固定[QC],日期[20180328],省份[44],城市[01],等几份合同[001](随机数)
    getContractNo(rid) {
      let date = new Date();
      let result = "QC";
      result = result + dateFormat.toDate(date, "");
      result = result + rid.toString().substring(0, 4);
      result = result + "00" + Math.round(Math.random() * 9);
      return result;
    },
    // 获取方案列表
    getPlanList(apID, suID) {
      return new Promise((resolve, reject) => {
        let params = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          sales_user: suID,
        };
        api
          .getApi(this.apiVar.Advertisement + "/getSalesProject", params)
          .then((res) => {
            console.log("销售所属方案", res);
            if (res.data.SysCode == 200200) {
              let resData = res.data.data;
              let tempList = [];
              for (let key of resData) {
                if (apID != key.apId) {
                  tempList.push({
                    value: key.apId,
                    label:
                      key.apName +
                      "（" +
                      key.cname +
                      " · " +
                      (key.pdStar || "") +
                      "-" +
                      (key.pdEnd || "") +
                      "）",
                  });
                }
              }
              this.apList = tempList;
              resolve();
            } else {
              sessFun.messageFun("warning", res.data.MSG);
            }
          });
      });
    },
    // 发布
    release(row) {
      // 1)	全国媒介可发布全部销售的方案
      // 2)	地方媒介只能发布只选择了该所属公司点位的方案

      this.QCinfo = "";
      // 真实数据
      this.currentItem = row;
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apid: row.apID,
      };
      let dataArr = row.cityArea;
      let sess = this.sessionData;
      let isRelease = false;
      if (sess.uType == "MD" && sess.mediaManageLevel == 1) {
        isRelease = true;
      } else {
        let num = 0;
        for (let data of dataArr) {
          if (data.asrID == sess.asrID) {
            num++;
          }
        }
        if (num == dataArr.length) {
          isRelease = true;
        }
      }
      if (isRelease) {
        // uid         int【必填】     当前账户UserID
        // apid        int             公司对应方案apID
        api
          .getApi(this.apiVar.Advertisement + "/GetFanganInfo", info)
          .then((res) => {
            console.log(res.data);
            if (res.data.SysCode == 200200) {
              let text = res.data.data;
              if (text.apQC) {
                this.QCinfo = text.apQC;
              } else {
                this.QCinfo = this.getContractNo(text.rID);
              }
              this.getPlanList(text.apID, text.suID).then((resolve) => {
                this.publishPlanDialog = true;
              });
            } else {
              this.messageFun("warning", res.data.MSG);
            }
          });
      } else {
        this.messageFun("warning", "您没有权限发布该方案");
      }
    },
    // 提交
    commitRelease() {
      if (/^[^\u4e00-\u9fa5]{0,}$/.test(this.QCinfo)) {
        this.Ctrlloading = Loading.service({
          text: "请耐心等待...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        // 保存合同编号
        this.saveContractNo(this.QCinfo, this.planType, this.relatedApId);
      } else {
        this.messageFun("warning", "只能输入数字,字母,字符");
      }
    },
    // 保存合同编号
    saveContractNo(contractNo, planType, relatedApId) {
      // uid         int【必填】     当前账户UserID
      // apid        int【必填】     方案apID
      // qc          String【必填】  方案合同编号
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apid: this.currentItem.apID,
      };
      info.qc = contractNo;
      info.planType = planType;
      if (planType == 1 || planType == 2) {
        if (!relatedApId) {
          this.messageFun(
            "warning",
            `请选择${["常规", "续刊", "补刊", "空刊", "赠送"][planType]}的订单`
          );
          this.Ctrlloading.close();
          return;
        }
        info.relatedApId = relatedApId;
      }
      api
        .postApi(this.apiVar.Advertisement + "/SetAdPlan", info)
        .then((res) => {
          console.log(res);
          if (res.data.SysCode == 300200) {
            // 查看是否被锁
            api
              .postApi(this.apiVar.Advertisement + "/CheckLock", info)
              .then((res) => {
                console.log(res.data);
                if (!res.data.SysCode) {
                  if (!res.data.IsLock) {
                    this.releaseFun();
                  } else {
                    this.messageFun("warning", "该方案被预锁,请先解除预锁");
                    this.Ctrlloading.close();
                  }
                }
              });
          } else {
            this.messageFun("warning", res.data.MSG);
            this.Ctrlloading.close();
          }
        })
        .catch((res) => {
          console.log(res);
          this.Ctrlloading.close();
        });
    },
    releaseFun() {
      let reseleInfo = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apid: this.currentItem.apID,
        qc: this.QCinfo,
        act: "R",
      };
      this.releaseFangan(reseleInfo);
    },
    // 发布方案(优化后的接口)
    releaseFangan(info) {
      api
        .postApi(this.apiVar.Advertisement + "/SetFangan", info)
        .then((res) => {
          console.log(res.data);
          if (res.data.SysCode == 300200) {
            this.messageFun("success", res.data.MSG);
            for (let data of this.currentPlan) {
              if (data.apID == this.currentItem.apID) {
                this.$set(data, "apState", 2);
                break;
              }
            }
            this.publishPlanDialog = false;
          } else if (res.data.SysCode == 300500) {
            if (res.data.asList) {
              // 存在点位被占，是否立即去方案详情修改？
              this.changeRoute();
            } else {
              this.messageFun("warning", res.data.MSG);
            }
          } else {
            this.messageFun("warning", res.data.MSG);
          }
          this.Ctrlloading.close();
        })
        .catch((res) => {
          this.Ctrlloading.close();
        });
    },
    // 跳转到详情页面
    ToDetail(row) {
      sessionStorage.setItem("plan_apid", row.apID);
      sessionStorage.setItem("cityArea", JSON.stringify(row.cityArea));
      if (row.apState == -1) {
        // 未配点意向方案详情
        this.$router.push("./planEmptyPointDetail");
      } else if (row.planMode == 1) {
        // 已配点意向方案
        this.$router.push("./planDetail");
      } else {
        this.$router.push("./planDetail");
      }
    },
    // 跳转到编辑页面
    ToEdit(row) {
      sessionStorage.setItem("plan_apid", row.apID);
      sessionStorage.setItem("cityArea", JSON.stringify(row.cityArea));
      console.log("roweedit", row);
      if (row.planMode == 1) {
        // 意向方案
        this.$router.push("./editPlan");
      } else {
        // 非意向方案
        this.$router.push("./editPlanOld");
      }
    },
    // 比较两个时间大小
    compareTime(arr, sField, eField) {
      return dateFormat.compareTime(arr, sField, eField);
    },
    // 意向方案配点（直营媒介配点）
    addPoint(row) {
      if (
        this.sessionData.uType == "MD" &&
        this.sessionData.customPermission.proposalPermission == 1
      ) {
        this.ToEdit(row);
      } else {
        this.$message.warning("暂无权限！");
      }
    },
    //预锁
    preload(row) {
      this.$confirm(
        "<p>锁定后，方案中的点位将被占用</p>",
        "是否确认锁定该方案的点位",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true,
        }
      )
        .then(() => {
          this.currentItem = row;
          let startObj = this.compareTime(row.cityArea, "pdStar", "pdEnd");
          let date = timeFormat.toDate(new Date(), "/");
          if (startObj.startTime <= date) {
            this.messageFun(
              "warning",
              "开始投放时间已经早于当前时间,请直接发布！"
            );
            return;
          }
          this.cityList = this.getCityList(row.cityArea);
          if (this.cityList.length) {
            this.cityChoose = [];
            this.isLock = true;
          } else {
            this.messageFun("warning", "方案权限城市内您没有可以预锁的城市");
          }
          if (this.isNation) {
            this.dialogVisible = true;
          } else {
            //地方媒介
            this.Ctrlloading = Loading.service({
              text: "请耐心等待...",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)",
            });
            if (this.isLock) {
              this.LockCity(this.cityList, "L");
            } else {
              this.noLockCity(this.cityList);
            }
            this.dialogVisible = false;
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    // 获取权限城市内的城市,进行勾选
    getCityList(arr) {
      // 1)	全国媒介可发布全部销售的方案
      // 2)	地方媒介只能发布只选择了该所属公司点位的方案
      // 1)	全国媒介可预锁全部的方案
      // 2)	地方媒介只能预锁方案中投放至该公司的部分
      let sess = this.sessionData;
      let resultArr = [];
      if (sess.uType == "MD" && sess.mediaManageLevel == 1) {
        resultArr = arr;
      } else {
        for (let data of arr) {
          if (data.asrID == sess.asrID) {
            resultArr.push(data);
          }
        }
      }
      let asrIDs = [];
      let resultInfo = [];
      for (let com of resultArr) {
        if (!asrIDs.join(",").includes(com.asrID)) {
          asrIDs.push(com.asrID);
          resultInfo.push(com);
        }
      }
      return resultInfo;
    },
    // 解除预锁
    clearLock(row) {
      this.$confirm(
        "<p>解锁后，方案中的点位将被释放</p>",
        "是否确认解锁该方案的点位",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true,
        }
      )
        .then(() => {
          this.cityChoose = [];
          this.isLock = false;
          this.currentItem = row;
          this.cityList = this.getCityList(row.cityArea);
          if (this.isNation) {
            this.dialogVisible = true;
          } else {
            //地方媒介
            this.Ctrlloading = Loading.service({
              text: "请耐心等待...",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)",
            });
            if (this.isLock) {
              this.LockCity(this.cityList, "L");
            } else {
              this.noLockCity(this.cityList);
            }
            this.dialogVisible = false;
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    // 检查当前拆分方案是否有点位被删除
    checkPoin(row) {
      let params = {
        apID: row.apID,
      };
      return new Promise((resolve, reject) => {
        api
          .getApi(this.apiVar.Advertisement + "/BeforeSplitAdPlanCheck", params)
          .then((res) => {
            console.log("检查点位是否被占用", res);
            if (res.data.SysCode === 200200) {
              resolve(true);
            } else if (res.data.SysCode === 200500) {
              this.$confirm(`${res.data.data}`, "确认拆单", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  // 方案拆单
                  resolve(true);
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消拆单",
                  });
                  resolve(false);
                });
            } else {
              sessFun.messageFun("warning", res.data.MSG || "检查占用点位异常");
              resolve(false);
            }
          });
      }).catch(() => resolve(false));
    },
    // KA方案拆分
    splitAdPlan(row) {
      if (row.planMode == 1) {
        // 意向方案
        api
          .postApi("/addsp/proposal/splitAdPlan", { apID: row.apID })
          .then((res) => {
            console.log("方案拆分res", res);
            if (res.data.SysCode === 200200) {
              sessFun.messageFun("success", "拆分成功");
              this.searchFun();
            } else {
              sessFun.messageFun("warning", res.data.MSG || "方案异常");
            }
          });
      } else {
        this.checkPoin(row)
          .then((res) => {
            if (res === true) {
              api
                .getApi(this.apiVar.Advertisement + "/SplitAdPlan", {
                  apID: row.apID,
                })
                .then((res) => {
                  console.log("方案拆分res", res);
                  if (res.data.SysCode === 200200) {
                    sessFun.messageFun("success", "拆分成功");
                    this.searchFun();
                  } else {
                    sessFun.messageFun("warning", res.data.MSG || "方案异常");
                  }
                });
            }
          })
          .catch((error) => {});
      }
    },
    cancelLock() {
      this.dialogVisible = false;
      Message.info("已取消操作");
    },
    // 确定预锁
    confirmLock() {
      console.log(this.cityChoose);
      if (this.cityChoose.length) {
        this.Ctrlloading = Loading.service({
          text: "请耐心等待...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        let arr = [];
        for (let select of this.cityChoose) {
          for (let data of this.cityList) {
            if (data.asrID == select) {
              arr.push(data);
              break;
            }
          }
        }

        if (this.isLock) {
          this.LockCity(arr, "L");
        } else {
          this.noLockCity(arr);
        }
        this.dialogVisible = false;
      } else {
        if (this.isLock) {
          this.messageFun("warning", "请选择预锁公司！");
        } else {
          this.messageFun("warning", "请选择解锁公司！");
        }
      }
    },
    // 预锁
    LockCity(arr, act) {
      console.log("lockcity----", arr);
      let asrIDs = [];
      for (let data of arr) {
        asrIDs.push(data.asrID);
      }
      let apid = arr[0].apID;
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        act: act,
        apid: apid,
        asrIDs: asrIDs.join(","),
      };
      console.log(info);
      api
        .postApi(this.apiVar.Advertisement + "/SetFangan", info)
        .then((res) => {
          if (res.data.SysCode == 300200) {
            this.searchFun();
            this.messageFun("success", res.data.MSG);
          } else if (res.data.SysCode == 300500) {
            if (res.data.asList) {
              // 存在点位被占，是否立即去方案详情修改？
              this.changeRoute();
            } else {
              this.messageFun("warning", res.data.MSG);
            }
          } else {
            this.messageFun("warning", res.data.MSG);
          }
          this.Ctrlloading.close();
        })
        .catch((err) => {
          console.log(err);
          this.Ctrlloading.close();
        });
    },
    // 解锁
    noLockCity(arr) {
      let asrIDs = [];
      for (let data of arr) {
        asrIDs.push(data.asrID);
      }
      let apid = arr[0].apID;
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apId: apid,
        asrIDs: asrIDs,
      };
      console.log(info);
      api
        .postApi(this.apiVar.Advertisement + "/ClFangan", info)
        .then((res) => {
          console.log(res.data);
          this.Ctrlloading.close();
          this.searchFun();
          this.messageFun("success", res.data.MSG);
        })
        .catch((err) => {
          console.log(err);
          this.Ctrlloading.close();
        });
    },
    // 7天以上显示7天,否则显示相隔天数
    countDay(time) {
      let dayA = Math.abs(timeFormat.getDayBetween(time, new Date()));
      console.log("dayA-----", dayA);
      let RemainDay = dayA > 7 ? 7 : dayA;
      return RemainDay;
    },
    // 弹出框修改路径
    changeRoute() {
      MessageBox.confirm(`存在点位被占，是否修改方案？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.ToEdit(this.currentItem);
        })
        .catch(() => {
          Message.info("已取消操作");
        });
    },
    searchFun() {
      // this.loading = true;
      let info = this.searchFormat();
      console.log("info---", this.searchInfo);
      // this.getData(info);
    },
    // 搜索数据格式化
    searchFormat() {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        pageNum: this.currPage,
        pagesize: this.pageSize,
        [this.searchInfo.keywordType]:
          this.searchInfo[this.searchInfo.keywordType],
        [this.searchInfo.rangeDateType]:
          this.searchInfo[this.searchInfo.rangeDateType],
        districtId: this.searchInfo.districtId,
        isVenueFee: this.searchInfo.isVenueFee,
      };

      api.getApi("/addsp/devContract/list", params).then((res) => {
        if (res.data.SysCode == 200200) {
          this.constractList = [
            {
              dcID: null,
              resID: 40170,
              resName: "大鹏街安置房",
              dcType: 0,
              startDate: "2021-06-16",
              endDate: "2021-07-16",
              nearPayDate: "2021-07-01",
              mediaCnt: 1,
              installMediaCnt: null,
              venueFee: 1000,
              venueDate: "2021-07-01",
              devDate: "2021-07-01",
              devFee: 1000,
              payDate: null,
              createUserName: "杰",
              contractNo: null,
              createTime: "2022-01-01T10:10:48",
              dcState: 0,
            },
          ];
        } else {
          this.$message.warning(res.data.MSG);
        }
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    // 重置
    constractSearchForm() {
      this.$refs["constractSearchForm"].resetFields();
      return;

      this.currPage = 1;
      this.isReset = false;
      let timer = setTimeout(() => {
        this.isReset = true;
        clearTimeout(timer);
      }, 1000);
      this.searchFun();
    },
    //清除意向方案缓存
    clearProposalAdPlanBackups(params) {
      api
        .postApi(this.apiVar.AddspProposal + "/cleanAdBackUp", params)
        .then((res) => {
          console.log("清空意向方案缓存的方案", res);
          if (res.data.SysCode == 200200) {
            console.log("缓存意向方案清除成功");
          } else {
            console.log("缓存意向方案清除失败");
          }
        });
      cacheAdPlan.removeData(this.sessionData.uID);
      this.routeSelect();
    },
    // 放弃继续编辑
    cancelEdit() {
      this.$confirm("放弃后将清除该方案信息!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false,
        type: "warning ",
      })
        .then(() => {
          this.unfinishedDialogVisible = false;
          let params = {
            uid: this.sessionData.uID,
            token: this.sessionData.token,
          };
          if (this.IsSevenBD) {
            this.clearProposalAdPlanBackups(params);
          } else {
            api
              .postApi(
                this.apiVar.Advertisement + "/clearAdPlanBackups",
                params
              )
              .then((res) => {
                console.log("清空缓存的方案", res);
                if (res.data.SysCode == 200200) {
                  console.log("缓存方案清除成功");
                } else {
                }
              });
            cacheAdPlan.removeData(this.sessionData.uID);
            this.routeSelect();
          }
        })
        .catch(() => {
          Message.info("取消成功");
        });
    },
    // 继续创建
    continueEdit() {
      this.continueEditLoading = this.$loading({
        lock: true,
        text: "方案数据获取中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.5)",
      });
      if (this.IsSevenBD) {
        this.$router.push("./createPlan?unfinishedPlan");
      } else {
        this.$router.push("./createPlanOld?unfinishedPlan");
      }

      this.unfinishedDialogVisible = false;
    },
    /**
     * 周边小区导出
     * */
    // 获取权限城市
    getCity() {
      let info = {
        service: "GetCompanyCitiesAction",
        token: this.sessionData.token,
        uid: this.sessionData.uID,
      };
      api
        .postApi_new(this.apiVar.Media, info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let result = [];
            for (let data of res.data.data) {
              let obj = {
                label: data.cityName,
                value: data.cityId,
                children: [],
              };
              if (data.districtList) {
                for (let data2 of data.districtList) {
                  let obj2 = {
                    label: data2.districtName,
                    value: data2.districtId,
                  };
                  obj.children.push(obj2);
                }
              }
              result.push(obj);
            }
            this.areaArr = result;
          } else {
            this.$message.warning(res.data.MSG);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    exportConstract() {},
    exportCityFun(val) {
      console.log("val", val);
      if (val.length) {
        for (let key of this.exportRescityList) {
          if (key.value == val) {
            this.exportInfo.cityName = key.label;
          }
        }
      }
    },
    exportUploadFile(params) {
      this.exportFileData = [];
      let fileObj = params.file;
      this.exportFileData.push(fileObj);
      console.log("上传周边", params);
    },
    // 文件删除
    exportFileRemove(file, fileList) {
      console.log(file, fileList);
      this.exportFileData = fileList;
    },
    //周边小区导出下一步
    nextExportRes() {
      if (this.exportResStep === 1) {
        if (!this.exportInfo.citys.length) {
          sessFun.messageFun("warning", "请选择城市");
          return;
        }
        if (!this.exportInfo.radius) {
          sessFun.messageFun("warning", "请填写半径范围");
          return;
        } else {
          if (
            !/(^[1-9]\d*$)/.test(this.exportInfo.radius) ||
            this.exportInfo.radius > 10000
          ) {
            sessFun.messageFun("warning", "请输入1~10000的整数");
            return;
          }
        }
        if (!this.exportInfo.type) {
          sessFun.messageFun("warning", "请选择类型");
          return;
        }
        this.exportResStep += 1;
        console.log("exportInfo", this.exportInfo);
      } else if (this.exportResStep < 3) {
        this.exportResStep += 1;
      } else {
        console.log("exportFileData", this.exportFileData);
        this.isBroundImport = true;
        if (this.exportFileData.length) {
          sessFun.messageFun("warning", "导出excel可能需要一分钟甚至更长时间!");
          this.exportParams = {
            radius: this.exportInfo.radius,
            cityId: this.exportInfo.citys,
            asrId: this.sessionData.asrID,
            type: this.exportInfo.type,
          };
          console.log(this.exportParams);
          this.importBroundRes();
        } else {
          sessFun.messageFun("warning", "请先上传文件！");
          this.isBroundImport = false;
        }
      }
    },
    // 导出周边小区
    importBroundRes() {
      let formData = new FormData();
      formData.append("file", this.exportFileData[0]);
      formData.append("radius", this.exportInfo.radius);
      formData.append("cityId", this.exportInfo.citys);
      formData.append("asrId", this.sessionData.asrID);
      formData.append("type", this.exportInfo.type);
      // 上传文件
      api
        .postExportFile(this.exportAction, formData, "blob")
        .then((res) => {
          console.log("导出周边小区", res, res.data.type);
          if (res.data.type === "text/html") {
            let reader = new FileReader();
            reader.readAsText(res.data, "utf-8");
            reader.onload = () => {
              let resData = JSON.parse(reader.result);
              console.log("data", resData);
              sessFun.messageFun("warning", resData.MSG || "导出异常！");
            };
          } else {
            let blob = new Blob([res.data], {
              type: "application/vnd.ms-excel;charset=utf-8",
            });
            let downloadElement = document.createElement("a");
            let href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            downloadElement.download = this.exportInfo.cityName + ".xlsx"; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click();
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
            this.isResExport = false;
            sessFun.messageFun("success", "导出成功");
          }
          this.isBroundImport = false;
        })
        .catch((res) => {
          console.log(res);
        });
    },
  },
  beforeDestroy() {
    if (this.continueEditLoading) {
      this.continueEditLoading.close();
    }
  },
};
</script>
<style lang="scss" scoped>
a {
  color: #108ee9;
}

/*筛选*/
/deep/ .el-checkbox-group .el-checkbox + .el-checkbox {
  margin-left: 0;
}
.search-row {
  /deep/ .el-form-item {
    display: flex;
    align-items: center;
    flex-grow: 1;
    margin-bottom: 16px;
    .el-form-item__label {
      padding: 0;
      line-height: 32px;
      white-space: nowrap;
    }
    .el-form-item__content {
      flex-grow: 1;
      display: flex;
      line-height: 32px;
    }
  }
  .search-row-item {
    width: 100%;
    // margin-bottom: 16px;
  }
}

.typeBox p {
  height: 30px;
  font-size: 12px;
  text-align: center;
  line-height: 30px;
  border-top: 1px solid #cccccc;
}

/deep/ .el-checkbox__label {
  font-size: 10px;
  color: #8a8a8a;
}

/*下拉搜索框*/
/deep/ .el-input-group__prepend {
  width: 64px;
  background-color: #fff;
}
/deep/ .combination-serch {
  display: flex;
  flex-flow: row nowrap;
  .combination-serch-select .el-input__inner {
    width: 126px;
    border-radius: 4px 0 0 4px;
  }
  .combination-serch-date {
    width: 100%;
    border-left: none;
    border-radius: 0 4px 4px 0;
  }
}
.row-btn-group {
  clear: both;
  margin-bottom: 16px;
}
/*日期控件*/
.block {
  display: inline-block;
  margin-left: 2px;
  position: relative;
}

/deep/ .el-range-separator {
  position: relative;
  top: -2px;
}
/*锁*/
.fa.fa-lock.fa-lg,
.fa.fa-unlock.fa-lg {
  font-size: 16px;
  color: #d8d8d8 !important;
  position: relative;
  top: -1px;
}

/*操作*/
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.mediaList_wrap .mediaList_container .table_wrap {
  margin: 0 auto 16px;
}

.el-button + .el-button {
  margin-left: 0;
}

.table_wrap .city_p span {
  float: none !important;
}

.table_wrap .city_p {
  position: relative;
}

.table_wrap .city_p .lock-icon {
  position: absolute;
  right: -10px;
  top: 0px;
}

.table_wrap .city_p .lock-icon b {
  display: inline-block;
  padding: 0 4px;
  font-size: 12px;
  height: 16px;
  line-height: 16px;
  text-align: center;
}

.table_wrap .city_p .lock-icon b.blue {
  color: #1890ff;
  background: rgba(230, 247, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(145, 213, 255, 1);
}

.table_wrap .city_p .lock-icon b.red {
  color: #fa541c;
  background: rgba(255, 242, 232, 1);
  border-radius: 2px;
  border: 1px solid rgba(255, 187, 150, 1);
}

.el-dialog__footer span {
  float: none !important;
}

/deep/ .el-table td .cell {
  padding: 2px 10px;
  height: auto;
  line-height: 28px;
}

/*未完成方案*/
/deep/ .unfinished_plan_dialog .el-dialog__header {
  padding: 20px 20px;
  border-bottom: 1px solid #e8e8e8;
}

/deep/ .unfinished_plan_dialog .el-dialog__title {
  font-size: 15px;
}

/deep/ .unfinished_plan_dialog .el-dialog__body {
  padding: 10px 20px;
}

/deep/ .unfinished_plan_dialog .el-dialog__title {
  font-weight: bold;
}

.unfinished_plan_li {
  line-height: 28px;
}

/*资源导出*/
.export_step_box {
  border: 1px solid rgba(218, 218, 218, 1);
  padding: 12px 18px;
  color: rgba(102, 102, 102, 1);
  font-size: 15px;
  position: relative;
}

.export_ul .el-select {
  width: 82%;
}

.radius_input.el-input-group {
  width: 82%;
}

.export_ul li {
  margin-bottom: 16px;
}

.export_ul li:last-child {
  margin-bottom: 0;
}

.export_ul li > span {
  width: 70px;
  text-align: right;
  display: inline-block;
}

.info_box {
  height: 32px;
  background: rgba(230, 247, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(145, 213, 255, 1);
  line-height: 32px;
  padding: 0 16px;
  position: relative;
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 16px;
}

.info_box /deep/ .el-icon-close {
  cursor: pointer;
  margin-left: 24px;
  position: absolute;
  top: 9px;
  right: 8px;
}

.export_step_box img {
  width: 24px;
  height: 27px;
  vertical-align: middle;
}

.downloag_btn {
  position: absolute;
  right: 18px;
  top: 14px;
  cursor: pointer;
  color: rgba(102, 102, 102, 1);
}
/deep/ .publish_dialog {
  .el-dialog__header {
    padding: 16px 24px 6px;
  }
  .el-dialog__body {
    padding: 0 24px 4px;
    .comment {
      display: block;
      color: rgba(0, 0, 0, 0.45);
      line-height: 24px;
      margin-bottom: 16px;
    }
    .el-form-item {
      margin-bottom: 12px;
    }
    .el-form-item__label {
      padding-bottom: 4px;
      line-height: 24px;
      white-space: nowrap;
    }
    .el-input__inner {
      padding: 0 12px;
    }
    .el-input--small,
    .el-select--small {
      width: 100%;
    }
  }
  .el-dialog__footer {
    padding-top: 0;
    .el-button + .el-button {
      margin-left: 10px;
    }
  }
}
/deep/ .Import_dialog .el-upload-list__item {
  width: 100%;
}

/deep/ .Import_dialog .el-upload-dragger {
  padding-top: 9%;
  width: 424px;
  height: 135px;
  background: rgba(0, 0, 0, 0.06);
}

/deep/ .Import_dialog .el-upload-dragger img {
  width: 28px;
  height: 30px;
}
.u-bk-btn {
  padding: 0 3px;
  width: 30px;
  height: 16px;
  background: rgba(24, 144, 255, 1);
  border-radius: 2px;
  color: #fff;
  font-size: 12px;
}
</style>