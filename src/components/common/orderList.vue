<template>
  <div class="ad_mediaDetail_wrap clearfix">
    <div class="ad_mediaDetail_nav">
      <p>
        <a href="#" style="color: #999">订单管理</a>
      </p>
    </div>
    <div class="mediaList_wrap">
      <div class="mediaList_head">
        <h2>订单列表</h2>
      </div>
      <div class="mediaList_container">
        <el-row class="search_row" :gutter="36">
          <el-col class="row-unit" :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
            <span class="search_label">关键词：</span>
            <el-input
              placeholder="请输入内容"
              v-model="searchInfo.keyword"
              size="small"
            >
              <el-select
                v-model="searchInfo.select"
                slot="prepend"
                placeholder="请选择"
              >
                <el-option label="订单名称" value="1"></el-option>
                <el-option label="客户名称" value="2"></el-option>
                <el-option
                  v-if="role !== 'ADN_EP'"
                  label="合同编号"
                  value="3"
                ></el-option>
                <el-option
                  v-if="['ADN_MD_COUNTRY', 'ADN_MD'].includes(role)"
                  label="所属销售"
                  value="4"
                ></el-option>
              </el-select>
            </el-input>
          </el-col>
          <el-col class="row-unit" :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
            <span class="search_label">日期：</span>
            <div class="date-group">
              <el-select
                size="small"
                v-model="searchInfo.dateType"
                placeholder="请选择"
                class="date-type-select"
              >
                <el-option label="上刊日期" value="0"></el-option>
                <el-option label="下刊日期" value="1"></el-option>
                <el-option label="发布日期" value="3"></el-option>
                <el-option label="换画日期" value="2"></el-option>
              </el-select>
              <el-date-picker
                size="small"
                v-model="searchInfo.rangeDate"
                type="daterange"
                range-separator="⇀"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                start-placeholder="选择日期"
                end-placeholder="选择日期"
              >
              </el-date-picker>
            </div>
          </el-col>
          <el-col v-if="isAll" class="row-unit" :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
            <span class="search_label">所属公司：</span>
            <el-select
              v-model="searchInfo.company"
              placeholder="请选择所属公司"
              filterable
              size="small"
            >
              <el-option
                v-for="item of companyData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="row-unit" :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
            <span class="search_label">城市：</span>
            <el-select
              v-model="searchInfo.cityWord"
              placeholder="请选择城市"
              filterable
              size="small"
            >
              <el-option
                v-for="item of filterCityData"
                :key="item.rID"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <!-- <el-col class="row-unit" :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
            <span class="search_label">订单状态：</span>
            <el-select
              v-model="searchInfo.status"
              placeholder="请选择状态"
              size="small"
            >
              <el-option
                v-for="item of stateList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col> -->
          <el-col class="row-unit" :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="search()"
              :disabled="!isSearch"
              >搜索
            </el-button>
            <el-button
              plain
              @click="reset()"
              :disabled="!isReset"
              >重置
            </el-button>
          </el-col>
        </el-row>
        <div class="table_wrap">
          <el-table
            border
            :data="currentOrder"
            style="width: 100%"
            @sort-change="sortChange"
            v-loading="loading"
            element-loading-text="玩命加载中"
            element-loading-spinner="el-icon-loading"
            @filter-change="filterChange"
          >
            <el-table-column
              label="订单名称"
              min-width="12.6%"
              class-name="custom-column-order"
            >
              <template slot-scope="scope">
                <span class="u-bk-btn" v-if="scope.row.apSrc != 0">贝壳</span>
                <span
                  style="color: #108ee9; cursor: pointer"
                  @click="ToDetail(scope.row)"
                  >{{ scope.row.apName }}</span
                >
                <el-tooltip
                  v-if="scope.row.planType == 1 || scope.row.planType == 2"
                  effect="dark"
                  :content="scope.row.relatedApName || ''"
                >
                  <span class="plan-type">{{
                    ["常规", "续刊", "补刊", "空刊", "赠送"][scope.row.planType]
                  }}</span>
                </el-tooltip>
                <span v-else-if="scope.row.planType >= 0" class="plan-type">{{
                  ["常规", "续刊", "补刊", "空刊", "赠送"][scope.row.planType]
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="cName"
              label="客户名称"
              min-width="12.6%"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="bTitle"
              label="品牌名称"
              min-width="8%"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="apQC"
              label="合同编号"
              v-if="role !== 'ADN_EP'"
              width="180px"
            >
            </el-table-column>
            <el-table-column
              prop="apTotal"
              sortable="custom"
              label="订单总价"
              width="120px"
              align="right"
              v-if="role !== 'ADN_EP'"
            >
              <template slot-scope="scope">
                <span
                  >&yen;{{
                    scope.row.apTotal ? priceFormat(scope.row.apTotal / 100) : 0
                  }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              label="投放城市(点位面数，排期)"
              prop="cityArea"
              min-width="25.8%"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <template v-if="isAll">
                  <div
                    v-for="(item, index) of scope.row.companyList"
                    :key="index"
                    class="city_p"
                  >
                    {{ item.asName }}
                    <p v-for="city of item.cityList" :key="city.city">
                      {{
                        city.city +
                        "(" +
                        city.num +
                        "面," +
                        formatTime(city.pdStart) +
                        "至" +
                        formatTime(city.pdEnd) +
                        ")"
                      }}
                    </p>
                  </div>
                </template>
                <div
                  v-else
                  v-for="item of scope.row.companyList"
                  :key="item.rid + '-' + item.asrID"
                  class="city_p"
                >
                  <p v-for="city of item.cityList" :key="city.city">
                    {{
                      city.city +
                      "(" +
                      city.num +
                      "面," +
                      formatTime(city.pdStart) +
                      "至" +
                      formatTime(city.pdEnd) +
                      ")"
                    }}
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="mediaTypeNames"
              label="媒体类型"
              width="150px"
              column-key="mediaTypeNames"
              :filters="mediaTypesList"
              :filter-multiple="true"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.mediaTypeNames || '--' }}</span>
                </template>
            </el-table-column>
            <el-table-column
              prop="realName"
              label="所有人"
              min-width="6.1%"
              show-overflow-tooltip
              :filters="filterRealName"
              :filter-method="filterRealNameFun"
              :filter-multiple="true"
              v-if="['ADN_BD_KA', 'ADN_BD'].includes(role)"
            >
            </el-table-column>
            <el-table-column
              prop="realName"
              label="所有人"
              min-width="6.1%"
              show-overflow-tooltip
              v-if="role === 'ADN_EP'"
            >
            </el-table-column>
            <el-table-column
              prop="skProgress"
              label="上刊进度"
              width="100px"
              show-overflow-tooltip
              v-if="role === 'ADN_EP'"
            >
            </el-table-column>
            <el-table-column
              prop="xkProgress"
              label="下刊进度"
              width="100px"
              show-overflow-tooltip
              v-if="role === 'ADN_EP'"
            >
            </el-table-column>
            <el-table-column
              prop="appTime"
              label="发布日期"
              width="120px"
              sortable="custom"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ formatTime(scope.row.appTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              class="Status"
              column-key="apState"
              prop="apState"
              label="状态"
              min-width="6%"
              show-overflow-tooltip
              :filters="stateList"
              :filter-multiple="false"
            >
              <template slot-scope="scope">
                <point-state
                  :state-text="stateToText(scope.row.apState).text"
                  :color="stateToText(scope.row.apState).color"
                ></point-state>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="80px"
              v-if="
                !['ADN_OP', 'AD', 'ADN_BD_KA', 'ADN_BD', 'ADN_EP'].includes(role)
              "
            >
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
                      v-if="
                        !(
                          scope.row.apState == 0 ||
                          scope.row.apState == 5 ||
                          role != 'ADN_SM'
                        )
                      "
                      @click.native.prevent="finishOrder(scope.row)"
                      class="finish"
                      >结束订单
                    </el-dropdown-item>
                    <el-dropdown-item
                      :disabled="
                        scope.row.apState == 0 ||
                        scope.row.apState == 5 ||
                        !['ADN_MD_COUNTRY', 'ADN_MD'].includes(role)
                      "
                      @click.native.prevent="changePoint(scope.row)"
                      class="update"
                      >更换点位
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>

            <div slot="empty">
              <no-search-result></no-search-result>
            </div>
          </el-table>

          <div class="ad_pagination">
            <el-pagination
              background
              v-if="paginationShow"
              @size-change="sizeChange"
              @current-change="changePage"
              :current-page.sync="currPage"
              :page-sizes="pageSizes"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalNum"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 画像申请的弹出框结束 -->
    <!--修改金额弹框-->
    <changeProposalOrderPrice
      :apID="currApid"
      :requesInfo="{ mark: handleTime, opType: 2 }"
      :settlementFormVisible="changePriceModal"
      @cancel="changePriceModal = false"
      @planMoneyUpdated="
        changePriceModal = false;
        searchFun();
      "
    ></changeProposalOrderPrice>
  </div>
</template>

<script>
import { MessageBox, Message } from "element-ui";
import { api } from "../../api/api";
// 时间格式化
import dateFormat from "../../commonFun/timeFormat.js";
// 价格格式化
import commaFormat from "../../commonFun/commaFormat.js";
import sessFun from "../../commonFun/sessFun.js";
import noSearchResult from "./components/noSearchResult.vue";
import pointState from "./components/pointState.vue";
import changeProposalOrderPrice from "./components/changeProposalOrderPrice.vue";
// 筛选过滤
import filterFormat from "../../commonFun/filterTableData.js";
export default {
  name: "projectList",
  components: {
    noSearchResult,
    pointState,
    changeProposalOrderPrice,
  },
  data() {
    return {
      //过滤所有人
      filterRealName: [],
      // 搜索数据
      searchInfo: {
        // 搜索的select框
        select: "1",
        // 关键字
        keyword: "",
        // 时间范围
        rangeDate: "",
        //日期类型
        dateType: "1",
        // 公司搜索
        company: "",
        // 城市筛选
        cityWord: "",
        // 状态筛选
        status: "",
        // 按照啥排序
        orderby: "",
        // 升序降序0/1
        desc: "",
        // 媒体类型id
        mediaTypeId: "",
      },
      // 公司列表
      companyData: [],
      // 分页信息
      paginationShow: true,
      pageSize: 10,
      pageSizes: [10, 20, 50],
      currPage: 1,
      totalPage: 0,
      totalNum: 0,
      // 登录信息
      sessionData: {},
      // 权限城市过滤数组
      filterCityData: [],
      // 角色
      role: "ADN_BD",
      isAll: false,
      //加载中
      loading: true,
      stateList: [
        { text: "已完成", value: 0 },
        { text: "未投放", value: 2 },
        { text: "投放中", value: 3 },
        { text: "强制结束", value: 5 },
      ],
      //所有数据
      orderList: [],
      // 表格数据
      currentOrder: [],
      // 滚动加载的下标
      orderListIndex: 0,
      isSearch: true,
      isReset: true,
      //修改订单金额数据
      changePriceModal: false,
      changePriceData: {
        AdDoorAdPrice: 0,
        AdDoorMakePrice: 0,
        BreakAdPrice: 0,
        BreakMakePrice: 0,
        orderOldPrice: 0,
        orderCompanyList: [],
        priceCurrCompany: 0,
      },
      priceData: "",
      currApid: "",
      handleTime: "",
      mediaTypesList: [], // 媒体类型筛选字段
    };
  },
  created() {
    // 获取角色
    this.getRole();
  },
  mounted() {
    this.getFanCity();
    if (this.isAll) {
      this.getCompany();
    }
    if (["ADN_BD_KA", "ADN_BD"].includes(this.sessionData.uType)) {
      this.getSubSaleList();
    }
    // 获得初始数据
    this.searchFun();
    // 获取媒体类型
    this.getMediaTypes()
  },
  methods: {
    // 获取媒体类型筛选字段
    getMediaTypes() {
        api.getApi('/addsp/api/v1/mediaTypes/getPersonalAuthMediaTypes')
        .then((res) => {
            if(res.data.SysCode === 200200) {
                const _data = res.data.data
                if(_data.length) {
                    _data.forEach((item) => {
                        this.mediaTypesList.push({
                            text: item.name,
                            value: item.id
                        })
                    })
                }
            }
        })
        .catch((err) => {
            console.log(err);
        })
    },
    //获取下级销售列表
    getSubSaleList() {
      api.getApi(this.apiVar.Advertisement + "/GetSubSaleList").then((res) => {
        console.log(res.data);
        if (res.data.SysCode == 200200) {
          this.filterRealName = filterFormat(res.data.data, "realName", "uID");
        } else {
          this.messageFun("warning", res.data.MSG);
        }
      });
    },
    filterRealNameFun(value, row) {
      return row.realName === value;
    },
    // 切换页码
    changePage(page) {
      this.currPage = page;
      console.log("page----", page);
      this.searchFun();
    },
    // 每页条数切换
    sizeChange(val) {
      this.currPage = 1;
      this.pageSize = val;
      this.searchFun();
    },
    // 获取公司
    getCompany() {
      let sess = this.sessionData;
      let info = {
        uid: sess.uID,
        token: sess.token,
      };
      if (sess.ascType == 0 && sess.uType !== 'ADN_MD_COUNTRY') {
        api
          .getApi(this.apiVar.UCAPI + "/GetDirectAscr", info)
          .then((res) => {
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
              console.error("获取公司", res.data.MSG);
            } else {
              Message.warning(res.data.MSG);
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
              Message.warning(res.data.MSG);
            }
          })
          .catch((err) => {
            console.log(err);
          });
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
                value: data.rID,
              });
            }

            this.filterCityData = result;
          } else {
            Message.warning(res.data.MSG);
          }
        });
    },
    // 获取角色
    getRole() {
      this.sessionData = sessFun.getSess();
      this.role = this.sessionData.uType;
      let sess = this.sessionData;
      if (
        sess.ascType == 0 ||
        (sess.uType == "ADN_MD_COUNTRY")
      ) {
        this.isAll = true;
      } else {
        this.isAll = false;
      }
    },
    // 搜索数据格式化
    searchFormat() {
      let session = this.sessionData;
      let info = {
        uid: session.uID,
        token: session.token,
        pageNum: this.currPage,
        pageSize: this.pageSize,
      };
      let {
        select,
        keyword,
        rangeDate,
        company,
        cityWord,
        status,
        orderby,
        desc,
        dateType,
        mediaTypeId,
      } = this.searchInfo;
      info = {
        ...info,
        ...((keyword && select == "1" && { orderName: keyword }) ||
          (select == "2" && { customerName: keyword }) ||
          (select == "3" && { contractNum: keyword }) ||
          (select == "4" && { saleName: keyword })),
        ...(rangeDate && { beginTime: rangeDate[0], endTime: rangeDate[1] }),
        ...(status !== "" && status >= 0 && { state: status }),
        ...(company && { asrID: company }),
        ...(cityWord && { rID: cityWord }),
        ...(orderby && { orderby }),
        ...(desc !== "" && desc >= 0 && { desc }),
        ...(rangeDate && { timeType: dateType }),
        ...(mediaTypeId && { mediaTypeId }),
      };
      return info;
    },
    // 滚动加载获取数据(无搜索数据)
    getData(params) {
      api
        .postApi(this.apiVar.Advertisement + "/GetOrderList", params)
        .then((res) => {
          console.log(res.data);
          if (!res.data.SysCode) {
            let dataInfo = res.data;
            this.totalNum = dataInfo.totalCount;
            let dataArr = dataInfo.orderList;
            this.currentOrder = this.funcData(dataArr);
            this.loading = false;
            if (dataInfo.totalPage == 0) {
              Message.warning("暂无数据");
            }
          } else {
            Message.warning(res.data.MSG);
          }
        });
    },
    // 数据处理
    funcData(dataArr) {
      let result = [];
      for (let data of dataArr) {
        let tmpObj = "";
        tmpObj = this.setTableData(data);
        result.push(tmpObj);
      }
      return result;
    },
    // 搜索(优化)
    search() {
      let {
        keyword,
        rangeDate,
        company,
        cityWord,
        status,
        dateType,
        mediaTypeId
      } =this.searchInfo;
      this.isSearch = false;
      let timer = setTimeout(() => {
        this.isSearch = true;
        clearTimeout(timer);
      }, 1000);
      if (
        keyword ||
        rangeDate ||
        company ||
        cityWord ||
        status > 0 ||
        status === 0 ||
        dateType ||
        mediaTypeId
      ) {
        this.currentOrder = [];
        this.loading = true;
        this.currPage = 1;
        this.searchFun();
      } else {
        this.$message.warning("请输入搜索条件");
      }
    },
    searchFun() {
      this.paginationShow = false;
      this.loading = true;
      let info = this.searchFormat();
      this.getData(info);
      this.$nextTick(function () {
        this.paginationShow = true;
      });
    },
    // 设置表格数据
    setTableData(item) {
      let obj = {
        apSrc: item.src,
        adcID: item.adcID,
        apID: item.apID,
        apName: item.apName || "",
        apQC: item.apQC || "",
        apState: item.apState,
        apTotal: item.apTotal || "",
        appTime: item.appTime || "",
        bTitle: item.bTitle || "--",
        cName: item.cName || "",
        realName: item.realName || "",
        companyList: [],
        skProgress: item.skProgress || "",
        xkProgress: item.xkProgress || "",
        planType: item.planType || "",
        planMode: item.planMode,
        relatedApName: item.relatedApName || "",
        relatedApId: item.relatedApId || "",
        mediaTypeNames: item.mediaTypeNames || "",
      };
      for (let data of item.companyList) {
        let objItem = {
          asName: data.asName,
          asrID: data.asrID,
          cityList: [],
        };
        for (let con of data.cityList) {
          let cityObj = {
            city: con.city,
            rID: con.rID,
            num: con.num,
            pdEnd: con.pdEnd,
            pdID: con.pdID,
            pdStart: con.pdStart,
          };
          objItem.cityList.push(cityObj);
        }
        obj.companyList.push(objItem);
      }
      return obj;
    },
    // 跳转到详情页面
    ToDetail(row) {
      if (this.role == "AD") {
        sessionStorage.setItem("ADorder_apid", row.apID);
        sessionStorage.setItem("ADorder_apSrc", row.apSrc);
        this.$router.push("./ADorderDetail");
      } else {
        sessionStorage.setItem("change_point", "no");
        sessionStorage.setItem(
          "order_citylist",
          JSON.stringify(row.companyList)
        );
        sessionStorage.setItem("order_apid", row.apID);
        sessionStorage.setItem("order_apSrc", row.apSrc);
        this.$router.push("./orderDetail");
      }
    },
    // 更换点位
    changePoint(row) {
      sessionStorage.setItem("change_point", "yes");
      sessionStorage.setItem("order_apid", row.apID);
      sessionStorage.setItem("order_citylist", JSON.stringify(row.companyList));
      this.$router.push("./orderDetail");
    },
    // 状态转换成文本
    stateToText(val) {
      let state = [
        { text: "已完成", value: 0, color: "rgba(196,203,211,1)" },
        { text: "未配点", value: -1, color: "rgba(250, 173, 20, 1)" },
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
    // 时间格式规范
    formatTime(val) {
      return dateFormat.toDate(val, "/");
    },
    // 价格时间排序(请求后台接口进行排序)
    sortChange(column) {
      console.log("columm---", column);
      if (column.order == "ascending") {
        this.searchInfo.orderby = column.prop;
        this.searchInfo.desc = 0;
      } else if (column.order == "descending") {
        this.searchInfo.orderby = column.prop;
        this.searchInfo.desc = 1;
      }
      this.currPage = 1;
      this.searchFun();
    },
    // 价格加上逗号
    priceFormat(price) {
      return commaFormat.init(price);
    },
    // 结束订单
    finishOrder(row) {
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apid: row.apID,
        act: "E",
      };
      MessageBox.confirm(
        "结束后，[ <b>" +
          row.apName +
          "</b> ] 将结束投放，该订单涉及点位将被释放",
        "是否确认结束该订单？",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          type: "warning",
        }
      )
        .then(() => {
          this.currApid = row.apID;
          const loading = this.$loading({
            lock: true,
            text: "正在结束订单...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          api
            .postApi(this.apiVar.Advertisement + "/SetFangan", info)
            .then((res) => {
              // console.log(res.data);
              if (res.data.SysCode == 300200) {
                //结束订单成功
                loading.close();
                let price = row.apTotal
                  ? this.priceFormat(row.apTotal / 100)
                  : 0;
                MessageBox.confirm(
                  "现订单金额为 <span style='color: #1890ff'>&yen;" +
                    price +
                    "</span>",
                  "结束订单成功，是否修改订单金额？",
                  {
                    confirmButtonText: "修改",
                    cancelButtonText: "不修改",
                    dangerouslyUseHTMLString: true,
                    type: "success",
                    closeOnClickModal: false,
                  }
                )
                  .then(() => {
                    this.handleTime = new Date().getTime();
                    this.changePriceModal = true;
                  })
                  .catch(() => {
                    // Message.info("已取消操作");
                  });
                this.$set(row, "apState", 5);
              } else {
                loading.close();
                Message.warning(res.data.MSG);
              }
            });
        })
        .catch(() => {
          Message.info("已取消操作");
        });
    },
    //获取订单金额详情
    getOrderPriceDetail(apID) {
      api
        .getApi(this.apiVar.Advertisement + "/GetAPD", { apid: apID })
        .then((res) => {
          if (!res.data.SysCode) {
            // sessionStorage.setItem("priceData", JSON.stringify(res.data));
            let priceData = res.data;
            console.log("订单金额", priceData);
            let obj = {
              AdDoorAdPrice: 0,
              AdDoorMakePrice: 0,
              BreakAdPrice: 0,
              BreakMakePrice: 0,
              orderOldPrice: 0,
              orderCompanyList: [],
              priceCurrCompany: 0,
              handleTime: this.handleTime,
              apID: apID,
              opType: 2,
            };
            for (let item of priceData) {
              let isHave = obj.orderCompanyList.some((key) => {
                if (item.asrID == key.asrID && item.rID == key.rID) {
                  //obj.orderCompanyList里是否已有相同的公司和城市
                  return true;
                }
              });
              if (isHave) {
                for (let data of obj.orderCompanyList) {
                  if (item.asrID == data.asrID && item.rID == data.rID) {
                    let totalPrice =
                      (data.pdAdFee +
                        data.pdAdMake +
                        item.pdAdFee +
                        item.pdAdMake) /
                      100;
                    data.BreakAdPrice = item.pdAdFee / 100;
                    data.BreakMakePrice = item.pdAdMake / 100;
                    data.AdDoorAdPrice = data.pdAdFee / 100;
                    data.AdDoorMakePrice = data.pdAdMake / 100;
                    data.orderOldPrice = this.priceFormat(totalPrice);
                  }
                }
              } else {
                let a = {
                  ...item,
                  company: item.asName,
                };
                obj.orderCompanyList.push(a);
              }
            }
            let result = 0;
            for (let data of obj.orderCompanyList) {
              result +=
                data.AdDoorAdPrice +
                data.AdDoorMakePrice +
                data.BreakAdPrice +
                data.BreakMakePrice;
            }
            console.log(result);
            obj.orderOldPrice = this.priceFormat(result);
            obj.AdDoorAdPrice =
              obj.orderCompanyList[obj.priceCurrCompany].AdDoorAdPrice;
            obj.AdDoorMakePrice =
              obj.orderCompanyList[obj.priceCurrCompany].AdDoorMakePrice;
            obj.BreakAdPrice =
              obj.orderCompanyList[obj.priceCurrCompany].BreakAdPrice;
            obj.BreakMakePrice =
              obj.orderCompanyList[obj.priceCurrCompany].BreakMakePrice;

            this.changePriceData = obj;
            this.changePriceModal = true;
          } else if (res.data.SysCode == 100302) {
            this.loginTimeout();
          } else {
            Message.warning(res.data.MSG);
          }
        });
    },
    cancelChangePrice() {
      this.changePriceModal = false;
      this.changePriceData = {
        AdDoorAdPrice: 0,
        AdDoorMakePrice: 0,
        BreakAdPrice: 0,
        BreakMakePrice: 0,
        orderOldPrice: 0,
        orderCompanyList: [],
        priceCurrCompany: 0,
      };
      Message.info("已取消操作");
    },
    doneChangePrice() {
      this.changePriceModal = false;
      this.changePriceData = {
        AdDoorAdPrice: 0,
        AdDoorMakePrice: 0,
        BreakAdPrice: 0,
        BreakMakePrice: 0,
        orderOldPrice: 0,
        orderCompanyList: [],
        priceCurrCompany: 0,
      };
      Message.success("修改订单金额成功!");
    },
    // 登录超时
    loginTimeout() {
      this.$message({
        message: "登录超时或权限异常,请重新登录",
        type: "warning",
      });
      this.$router.push("/login");
    },
    // 重置
    reset() {
      this.searchInfo = {
        // 搜索的select框
        select: "1",
        // 关键字
        keyword: "",
        // 时间范围
        rangeDate: "",
        // 公司搜索
        company: "",
        // 城市筛选
        cityWord: "",
        // 状态筛选
        status: "",
        dateType: "1",
        mediaTypeId: "",
      };
      this.currPage = 1;
      this.currentOrder = [];
      this.isReset = false;
      let timer = setTimeout(() => {
        this.isReset = true;
        clearTimeout(timer);
      }, 1000);
      this.searchFun();
    },
    // 过滤资源
    filterRes(arr) {
      let result_ = [];
      let resIDS = "";
      for (let data of arr) {
        if (!resIDS.includes(data.resID)) {
          console.log("data", data.resID);
          resIDS += data.resID + ",";
          console.log("resId", resIDS);
          result_.push(data);
          console.log("result----------------------------", result_);
        } else {
          console.log("重复");
        }
      }
      console.log("RESULT---------", result_);
      return result_;
    },
    //表头筛选
    filterChange(filters){
        for (let key in filters) {
            if (key === "apState") {
                if (filters[key].length) {
                    this.searchInfo.status = filters[key][0]
                } else {
                    this.searchInfo.status = "";
                }
            }
            else if (key === "mediaTypeNames") {
                if (filters[key].length) {
                    this.searchInfo.mediaTypeId = filters[key][0];
                } else {
                    this.searchInfo.mediaTypeId = "";
                }
            }
        }
        this.search()
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  color: #108ee9;
}

/deep/ .price-dialog-list .el-textarea__inner {
  height: 134px !important;
  resize: none;
}

/*筛选*/
.el-checkbox + .el-checkbox {
  margin-left: 0;
}

/deep/ .el-checkbox__label {
  font-size: 10px;
  color: #8a8a8a;
}

/*日期控件*/
.block {
  display: inline-block;
  margin-left: 2px;
  position: relative;
}

/deep/ .search_row {
  display: flex;
  flex-wrap: wrap;
  .el-input__inner,
  .el-input-group,
  .el-select--small {
    width: 100%;
  }
  .date-group {
    display: flex;
    align-items: center;
    flex-flow: row nowrap;
    margin-left: -30px;
    .el-range-separator {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.25);
    }
  }
  .date-type-select {
    position: relative;
    left: 30px;
    z-index: 9;
    width: 140px;
    .el-input__inner {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .date-type-select /deep/ .el-input__inner {
    width: 104px !important;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    color: rgb(144, 147, 153);
  }

  .date-type-select /deep/ .el-input.is-focus .el-input__inner {
    border-color: #dcdfe6;
  }
  .row-unit {
    display: flex;
    align-items: baseline;
    margin-bottom: 16px;
    .el-input__inner{
       font-size: 14px;
       &::-webkit-input-placeholder{
         font-size: 14px;
       }
    }
    .el-range-input::-webkit-input-placeholder{
      font-size: 14px;
    }
  }
  .search_label {
    display: inline-block;
    white-space: nowrap;
    min-width: 70px;
    text-align: right;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
  }
  .el-button + .el-button {
    margin-left: 16px;
  }
}

/deep/ .block_box .el-input__inner {
  width: 150px;
}

/deep/ .el-date-editor i,
/deep/ .el-date-editor input,
/deep/ .el-date-editor span {
  float: left;
  position: relative;
}

.el-input {
  width: 290px;
  border-radius: 4px;
}

/*日期控件*/
.block {
  display: inline-block;
  margin-left: 2px;
}

/deep/ .el-date-editor i,
/deep/ .el-date-editor input,
/deep/ .el-date-editor span {
  float: left;
  position: relative;
}

/*下拉搜索框*/
/deep/ .el-input-group__prepend {
  width: 64px;
  background-color: #fff;
}

/deep/ .el-input-group--prepend .el-select .el-input__inner {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  width: 104px;
}

/*操作*/
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.mediaList_wrap .mediaList_container .table_wrap {
  margin: 0 auto 16px;
  /deep/ .custom-column-order {
    .cell {
      margin-right: 28px;
    }
  }
}

.el-button + .el-button {
  margin-left: 0;
}

/deep/ .el-table td .cell {
  padding: 2px 10px;
  height: auto;
  line-height: 28px;
}
</style>
<style lang="scss">
.price-dialog /deep/ .el-dialog__body {
  padding: 10px 20px;
}

.price-dialog /deep/ .el-dialog__body p {
  margin-bottom: 8px;
}
.price-dialog-list .price-dialog .num-input-wrap span {
  top: 2px !important;
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
.plan-type {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  padding: 0 4px;
  line-height: 18px;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 400;
  color: #ffffff;
  background: #1890ff;
}
</style>
