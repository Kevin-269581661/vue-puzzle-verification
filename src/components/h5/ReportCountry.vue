<template>
  <div>
    <div class="ad_mediaMana_wrap">
      <div class="mediaMana_content_top">
        <div class="content_top_wrap">
          <div class="title">
            <h1>
              {{ report.apName }}{{ stateToText(routeParams.imgType) }}报告
              <span class="button_box">
                <el-button
                  plain
                  @click="showPptxDialog()"
                  size="small"
                  :loading="pptxLoading"
                  >导出PPTX</el-button
                >
                <el-button
                  plain
                  @click="getPDF()"
                  size="small"
                  :loading="pdfLoading"
                  >导出PDF</el-button
                >
              </span>
            </h1>
            <h3>
              {{ report.bTitle }} &nbsp;&nbsp;{{ formatTime(report.apcTime) }}
            </h3>
          </div>
          <div class="detail">
            <p>
              <em>公司名称：</em>
              <i>{{ report.cName }}</i>
              <em>投放城市：</em>
              <i>{{ report.rIDs }}</i>
              <em>{{
                routeParams.imgType === "0" || routeParams.imgType === "1"
                  ? "投放面数："
                  : "换画面数："
              }}</em>
              <i>{{ report.asSpaceSum }}</i>
            </p>
          </div>
        </div>
      </div>
      <div class="plan-panel">
        <el-tabs v-model="planPanel" @tab-click="handleClick()">
          <el-tab-pane label="投放详情" name="first">
            <div class="first-wrap box-wrap">
              <div class="search-wrap">
                <el-select
                  size="small"
                  v-model="select"
                  placeholder="请选择"
                  class="type-select"
                >
                  <el-option
                    v-for="item in typeSelect"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-input
                  size="small"
                  v-model="keyword"
                  placeholder="请输入要搜索的内容"
                  class="searchInput"
                  @change="initData"
                ></el-input>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  class="searchBtn"
                  @click="search()"
                  >搜索
                </el-button>
              </div>
              <div class="table_wrap">
                <el-table
                  border
                  :data="currPutDetail"
                  style="width: 100%"
                  :default-sort="{ prop: 'recName', order: 'descending' }"
                  v-loading="loading"
                  element-loading-text="玩命加载中"
                  element-loading-spinner="el-icon-loading"
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
                        <el-form-item label="楼栋数量：">
                          <span>{{ props.row.fNum }}</span>
                        </el-form-item>
                        <el-form-item label="资产编号：">
                          <span>{{ props.row.assetTag }}</span>
                        </el-form-item>
                        <el-form-item label="入住年份：">
                          <span>{{ props.row.chDay }}</span>
                        </el-form-item>
                        <el-form-item label="广告限制：">
                          <span>{{ props.row.notPush }}</span>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="city"
                    label="城市"
                    min-width="6.7%"
                    :filters="filterCityData"
                    :filter-method="filterCity"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="rName"
                    label="区域"
                    min-width="6.7%"
                    :filters="filtersArea"
                    :filter-method="filterRName"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="resName"
                    label="资源名称"
                    min-width="11.9%"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="resAddress"
                    label="地址"
                    min-width="19.5%"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="cType"
                    label="楼盘类型"
                    min-width="6.1%"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="chDay"
                    label="入住时间"
                    min-width="6.1%"
                  >
                  </el-table-column>
                  <el-table-column
                    label="楼盘价格"
                    min-width="7.6%"
                    align="right"
                  >
                    <template slot-scope="scope">
                      <span>{{
                        typeof scope.row.hPrice === "undefined" ||
                        scope.row.hPrice === null ||
                        scope.row.hPrice === ""
                          ? ""
                          : priceFormat(scope.row.hPrice / 100)
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="hNum"
                    label="户数"
                    min-width="5.6%"
                    align="right"
                  >
                  </el-table-column>
                  <el-table-column
                    label="媒体数量"
                    prop="adSpaceCount"
                    min-width="6.1%"
                    align="right"
                  >
                  </el-table-column>
                  <el-table-column label="操作" min-width="6.1%">
                    <template slot-scope="scope">
                      <el-button type="text" @click="showImg(scope.row)"
                        >查看监播
                      </el-button>
                    </template>
                  </el-table-column>

                  <div slot="empty">
                    <no-search-result></no-search-result>
                  </div>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="监播图片" name="third">
            <div class="sec-wrap box-wrap">
              <el-radio-group
                v-model="mediaType"
                size="medium"
                @change="changeMedia()"
              >
                <el-radio-button
                  v-for="item in mediaTypeList"
                  :key="item.id"
                  :label="item.id"
                  >{{ item.name }}</el-radio-button
                >
              </el-radio-group>
              <div class="pager">
                <el-pagination
                  small
                  background
                  :current-page.sync="currUpPage"
                  :page-sizes="[6, 12]"
                  :page-size="pageUpSize"
                  layout="sizes, prev, pager, next, jumper"
                  :total="totalUpNum"
                  @size-change="sizeChange"
                  @current-change="changePage"
                >
                </el-pagination>
              </div>
              <div class="typeOfRec">
                <div
                  v-for="(up, upIndex) of reportArr"
                  :key="up.asID + '-' + upIndex"
                  @mouseenter="showPreImg = upIndex"
                  @mouseleave="showPreImg = null"
                  class="pic_box"
                >
                  <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                      <!-- <span>{{up.city+"-"+up.rName+"-"+up.resName+"-"+up.mTitle+"-"+up.asLab}}</span> -->
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="
                          up.city +
                          '-' +
                          up.rName +
                          '-' +
                          up.resName +
                          '-' +
                          up.mTitle +
                          '-' +
                          up.asLab
                        "
                        placement="bottom"
                        v-if="
                          (
                            up.city +
                            '-' +
                            up.rName +
                            '-' +
                            up.resName +
                            '-' +
                            up.mTitle +
                            '-' +
                            up.asLab
                          ).length > 24
                        "
                      >
                        <div class="header_title">
                          {{
                            wordlimit(
                              up.city +
                                "-" +
                                up.rName +
                                "-" +
                                up.resName +
                                "-" +
                                up.mTitle +
                                "-" +
                                up.asLab,
                              24
                            )
                          }}
                        </div>
                      </el-tooltip>
                      <span v-else class="header_title">{{
                        up.city +
                        "-" +
                        up.rName +
                        "-" +
                        up.resName +
                        "-" +
                        up.mTitle +
                        "-" +
                        up.asLab
                      }}</span>

                      <el-tooltip
                        placement="top"
                        width="200"
                        trigger="hover"
                        effect="dark"
                      >
                        <div slot="content">
                          <p class="tooltip_p">
                            <b>资产编号</b>
                            <span>{{ up.assetTag }}</span>
                            <b>广告排期</b>
                            <span>{{
                              formatTime(up.lStar) + "-" + formatTime(up.lEnd)
                            }}</span>
                          </p>
                        </div>
                        <i
                          class="el-icon-date"
                          style="float: right; width: 4%; padding: 3px 0"
                          type="text"
                        ></i>
                      </el-tooltip>
                    </div>
                    <el-carousel :autoplay="false" trigger="click">
                      <el-carousel-item
                        v-for="(item, index) in up.upImgArr"
                        :key="index"
                      >
                        <img
                          v-lazyload="item.url"
                          alt=""
                          @click="handlePictureCardPreview(item.url)"
                        />
                        <!-- <img :src="item.url" alt="" @click="handlePictureCardPreview(item.url)"> -->
                        <div class="mask-btn" v-if="showPreImg == upIndex">
                          <i
                            class="el-icon-search"
                            @click="handlePictureCardPreview(item.url)"
                          ></i>
                        </div>
                      </el-carousel-item>
                    </el-carousel>
                  </el-card>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="发布情况" name="forth">
            <div class="forth-wrap box-wrap">
              <div class="table_wrap">
                <el-table
                  border
                  :data="postDetail"
                  style="width: 100%"
                  :default-sort="{ prop: 'recName', order: 'descending' }"
                >
                  <el-table-column prop="city" label="城市" min-width="10.3%">
                  </el-table-column>
                  <el-table-column
                    prop="planNum"
                    label="计划点位数"
                    min-width="18.6%"
                    align="right"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="realNum"
                    label="实际执行点位数"
                    min-width="18.8%"
                    align="right"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="wrongNum"
                    label="问题点位数"
                    min-width="19.3%"
                    align="right"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="resolveNum"
                    label="问题解决数"
                    min-width="19.8%"
                    align="right"
                  >
                  </el-table-column>
                  <div slot="empty">
                    <no-search-result></no-search-result>
                  </div>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <!--缩略图对话框-->
        <el-dialog :visible.sync="dialogVisible">
          <img style="width: 100%; height: 100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
        <!--监播图-->
        <el-dialog :visible.sync="isShowImgArr" class="JB">
          <div style="clear: both">
            <el-carousel :autoplay="false" trigger="click">
              <el-carousel-item v-for="(item, index) in ImgBoxArr" :key="index">
                <img :src="item" alt="" style="width: 100%; height: 100%" />
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-dialog>
      </div>
      <!--导出pptx对话框-->
      <el-dialog
        title="导出PPTX"
        :visible.sync="pptxdialogVisible"
        width="390px"
        custom-class="pptx-dialog"
      >
        <div>
          <ul>
            <li>
              <span class="form-label">选择模板：</span>
              <el-select
                class="pptx-select"
                size="small"
                v-model="templateType"
                placeholder="请选择"
                @change="templateChange"
              >
                <el-option value="0" label="通用模板"></el-option>
                <el-option value="1" label="定制模板"></el-option>
              </el-select>
            </li>
            <!-- 判断是否已开通定制模板 -->
            <li v-if="!isCustomize && templateType > 0">
              <el-alert
                type="warning"
                show-icon
                title=""
                :closable="false"
                class="report-alert"
              >
                <div>
                  贵司尚未定制专属模板，请<a
                    href="https://apps.qinlinad.com/pptVIP.html"
                    target="_blank"
                    style="color: #1890ffff"
                    >点击定制</a
                  >
                </div>
              </el-alert>
            </li>
            <!-- 南宁定制不用选择导出排版 -->
            <!-- 亲粤邻定制 -->
            <li
              v-if="
                templateType !== null &&
                templateType == 1 &&
                customizeCode == '2'
              "
            >
              <span class="form-label">导出排版：</span>
              <el-select
                size="small"
                class="pptx-select"
                v-model="pptxType"
                placeholder="请选择"
              >
                <el-option value="2" label="2张/(点*页)"></el-option>
                <el-option value="3" label="3张/(点*页)"></el-option>
                <el-option value="4" label="4张/(点*页)"></el-option>
                <el-option value="2pointPerPage" label="2点位/页"></el-option>
              </el-select>
            </li>
            <!-- 通用模板 -->
            <li v-if="templateType !== null && templateType == 0">
              <span class="form-label">导出排版：</span>
              <el-select
                size="small"
                class="pptx-select"
                v-model="pptxType"
                placeholder="请选择"
              >
                <el-option value="2" label="2张/页"></el-option>
                <el-option value="3" label="3张/页"></el-option>
                <el-option value="4" label="4张/页"></el-option>
              </el-select>
            </li>
            <!--存在多个档期时显示-->
            <li
              v-if="
                (routeParams.imgType == '0' || routeParams.imgType == '1') && periodArr.length > 1
              "
            >
              <span class="form-label">选择档期：</span>
              <div class="date-wrap">
                <el-checkbox v-model="checkAllDate" @change="chooseAllDate"
                  >全部档期</el-checkbox
                >
                <el-checkbox-group
                  class="date-group-wrap"
                  v-model="checkPeriodArr"
                  @change="chooseDate"
                >
                  <el-checkbox
                    v-for="(item, index) in periodArr"
                    v-bind:key="index"
                    :label="item"
                  ></el-checkbox>
                </el-checkbox-group>
              </div>
            </li>
            <li>
              <span class="form-label">导出条件：</span>
              <el-select
                size="small"
                multiple
                class="pptx-select"
                v-model="pptxFilter"
                placeholder="(选填)选择其他导出条件"
                @change="changeCondition"
              >
                <el-option
                  v-for="(item, index) in conditionArr"
                  :key="index"
                  :value="index"
                  :label="item"
                ></el-option>
              </el-select>
            </li>
          </ul>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="plain" @click="pptxdialogVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="getPTTx()">导 出</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="ad_index_footer clearfix">
      <p>
        深圳市亲邻科技有限公司 版权所有
        <a href="https://beian.miit.gov.cn/" target="_blank"
          >粤ICP备15007183号</a
        >
      </p>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import LazyLoad from "../../commonFun/lazyLoad.js";

Vue.use(LazyLoad);

import { api } from "../../api/api";
// 价格格式化
import commaFormat from "../../commonFun/commaFormat.js";
// 筛选过滤
import filterFormat from "../../commonFun/filterTableData.js";
// 时间格式化
import dateFormat from "../../commonFun/timeFormat.js";
import sessFun from "../../commonFun/sessFun.js";

import noSearchResult from "../common/components/noSearchResult.vue";

import {
  Dialog,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Input,
  Button,
  Upload,
  Select,
  Option,
  Checkbox,
  Card,
  Progress,
  Cascader,
  Pagination,
  MessageBox,
  Message,
  Form,
  FormItem,
  Carousel,
  CarouselItem,
} from "element-ui";

export default {
  name: "Report",
  components: {
    noSearchResult,
    elDialog: Dialog,
    elTabs: Tabs,
    elTabPane: TabPane,
    elTable: Table,
    elTableColumn: TableColumn,
    elInput: Input,
    elButton: Button,
    elUpload: Upload,
    elSelect: Select,
    elOption: Option,
    elCheckbox: Checkbox,
    elCard: Card,
    elProgress: Progress,
    elCascader: Cascader,
    elPagination: Pagination,
    elForm: Form,
    elFormItem: FormItem,
    elCarousel: Carousel,
    elCarouselItem: CarouselItem,
  },
  data() {
    return {
      routeParams: {},
      mediaTypeList: [], //媒体类型
      isCustomize: false, //是否开通自定义模板，
      customizeCode: 0, //为0时为普通模板，大于0自定义模板
      templateType: null, //模板类型
      pptxType: "2", //导出pptx排版类型
      pptxFilter: [], //导出pptx条件
      checkAllDate: true, //全部档期
      checkPeriodArr: [], //导出pptx档期
      periodArr: [],
      pptxdialogVisible: false,
      newDate: new Date().getFullYear(),
      // 原数据存储
      dataFanganInfo: {},
      dataAPD: "",
      dataAdL: "",
      dataImg: "",
      loading: true,
      Info: {},
      // 当前页
      currUpPage: 1,
      pageUpSize: 6,
      totalUpNum: 0,
      //显示预览图蒙版
      showPreImg: null,
      report: {},
      //投放详情
      putDetail: [],
      currPutDetail: [],
      // 城市过滤
      filterCityData: [],
      // 区域过滤
      filtersArea: [],
      //搜索类型
      typeSelect: [
        { value: 1, label: "资源名称" },
        { value: 2, label: "商圈" },
      ],
      //搜索框
      keyword: "",
      select: 1,
      // tab选项
      planPanel: "first",
      //发布情况
      postDetail: [],
      // 媒体类型
      mediaType: null,
      // 监播图片
      reportArr: [],
      // 查看监播
      isShowImgArr: false,
      // 监播图片组合
      ImgBoxArr: [],
      //监播图片内容为true则是按照资源分，false按照图片分
      isActive: true,

      //缩略图对话框
      dialogVisible: false,
      dialogImageUrl: "",
      // 下载按钮loading
      pptxLoading: false,
      pptLoading: false,
      pdfLoading: false,
    };
  },
  computed: {
    conditionArr() {
      if (
        this.pptxType == "2pointPerPage" ||
        !this.isCustomize ||
        this.templateType < 1
      ) {
        this.pptxFilter = this.pptxFilter.filter((item) => {
          return item * 1 === 0;
        });
        return ["剔除被终止点位"];
      } else {
        return ["剔除被终止点位", "推荐理由", "楼盘信息"];
      }
    },
  },
  created() {
    this.getRouter();
    this.getReportInfo();
    this.getPeriod();
    this.getTemplateOptions();
    this.getMediaType();
  },
  mounted() {
    // 缓存不存在时为null
    this.templateType = localStorage.getItem("templateType");
  },
  methods: {
    //获取媒体类型
    getMediaType() {
      const { apID, companyId, replaceRecordId } = this.routeParams;
      api
        .getApi("/national/api/v1/nationalAdPlan/mediaTypeList", {
          apID,
          companyId,
          replaceRecordId,
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.mediaTypeList = res.data.data || [];
            if (this.mediaTypeList.length > 0) {
              this.mediaType = this.mediaTypeList[0].id;
              this.changeMedia();
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 状态变中文
    stateToText(type) {
      return {
        0: "上刊",
        1: "下刊",
        2: "换画",
      }[type];
    },
    // 获取图片列表
    getReportInfo() {
      const { imgType } = this.routeParams;
      if (imgType === "0" || imgType === "1") {
        // 上下刊报告
        this.getData();
      } else {
        // 获取换画
        this.getPainData();
      }
    },
    // tab点击
    handleClick() {},
    showPptxDialog() {
      this.pptxdialogVisible = true;
      this.pptxFilter = [];
    },
    // 缓存模板选项
    templateChange(value) {
      localStorage.setItem("templateType", value);
    },
    //获取排期
    getPeriod() {
      const { apID, companyId } = this.routeParams;
      api
        .getApi("/national/api/v1/nationalAdPlan/getScheduleByApID", {
          apID,
          companyId,
        })
        .then((res) => {
          if (res.data.SysCode === 200200) {
            this.periodArr = res.data.data || [];
          }
        });
    },
    //选择全部排期
    chooseAllDate() {
      if (this.checkAllDate) {
        this.checkPeriodArr = [];
      }
    },
    // 选择排版
    changeCondition(val) {
      console.log(val);
    },
    //选择排期
    chooseDate() {
      if (this.checkPeriodArr.length > 0) {
        this.checkAllDate = false;
      } else {
        this.checkAllDate = true;
      }
    },
    // 获取模板种类
    getTemplateOptions() {
      // 目前当前公司自定义模板只有一个，前端设计也是如此
      api
        .getApi("/national/api/v1/powerPoint/getCustomizeReports")
        .then((res) => {
          if (res.data.SysCode === 200200) {
            if (!!res.data.customList && Array.isArray(res.data.customList)) {
              // 公司下面有不同的定制模板，通过code来区分,
              if (
                res.data.customList.length == 0 ||
                res.data.customList[0].code < 1
              ) {
                _this.isCustomize = false;
              } else {
                _this.isCustomize = true;
                _this.customizeCode = res.data.customList[0].code;
              }
            }
          } else {
            Message.warning(res.data.MSG);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取pptx
    getPTTx() {
      // 定制模板导出时未开通提示
      if (this.templateType > 0 && this.isCustomize == false) {
        this.$message({
          showClose: true,
          message: "贵司尚未定制专属模板，不能导出",
          type: "error",
        });
        return;
      } else if (this.templateType === null) {
        this.$message.error("请选择模板!");
        return;
      }

      if (!this.checkAllDate && this.checkPeriodArr.length == 0) {
        this.$message.error("请选择一个排期选项!");
      } else {
        this.getApiFun(
          "/national/api/v1/powerPoint/getPPTXReport",
          this.pptLoading,
          "pptx"
        );
      }
    },
    // 获取pdf
    getPDF() {
      this.getApiFun(
        "/national/api/v1/powerPoint/getPPTXReport",
        this.pdfLoading,
        "pdf"
      );
    },
    // 接口Fun  0-ppt上刊，1-ppt下刊，2-pdf上刊，3-pdf下刊，4-pptx下刊，5-pptx下刊，6-pptx换画，7-pdf换画
    getApiFun(apiName, loading, type) {
      const { apID, companyId, imgType, replaceRecordId } = this.routeParams;
      let info = {
        apID,
        companyId,
        imgType,
      };
      if (imgType === 2) {
        info.replaceRecordId = replaceRecordId;
      }
      if (type == "pptx") {
        if (this.checkPeriodArr.length > 0) {
          info.periods = this.checkPeriodArr.join(",");
        }
        (info.exportType = 1),
          (info.customizeCode =
            this.templateType == 1 ? this.customizeCode : 0);
        info.exportAllPoint = this.pptxFilter.indexOf(0) != -1 ? 0 : 1;
        // customizeCode: 2 亲粤邻定制模板
        this.customizeCode == "2" &&
          (info.customCondition = this.pptxFilter.reduce(
            (accumulator, currentValue) => {
              if (currentValue > 0) {
                return accumulator !== ""
                  ? accumulator + "," + currentValue
                  : currentValue;
              } else {
                return accumulator;
              }
            },
            ""
          ));
        if (this.pptxType == "2pointPerPage") {
          // 定制2点位/页
          info.pagePointCnt = 2;
          info.photoCountPerPage = 4;
        } else {
          info.photoCountPerPage = this.pptxType * 1;
        }
      } else {
        info.exportType = 2;
      }
      const tempPage = window.open("", "_blank");
      loading = true;
      api.getApi(apiName, info).then((res) => {
        if (typeof res.data.data === "string") {
          let downloadElement = document.createElement("a");
          let href = res.data.data;
          downloadElement.href = href;
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          tempPage.close();
          loading = false;
        } else {
          let fileInfo = {
            downtype: 2,
            apID,
            companyId,
            imgType,
          };
          if (imgType === 2) {
            fileInfo.replaceRecordId = replaceRecordId;
          }
          if (type == "pptx") {
            if (this.checkPeriodArr.length > 0) {
              fileInfo.periods = this.checkPeriodArr.join(",");
            }
            fileInfo.exportType = 1;
            fileInfo.customizeCode =
              this.templateType == 1 ? this.customizeCode : 0;

            if (this.pptxType == "2pointPerPage") {
              // 定制2点位/页
              fileInfo.pagePointCnt = 2;
              fileInfo.photoCountPerPage = 4;
            } else {
              fileInfo.photoCountPerPage = this.pptxType * 1;
            }
            fileInfo.exportAllPoint = this.pptxFilter.indexOf(0) != -1 ? 0 : 1;
            this.customizeCode == "2" &&
              (fileInfo.customCondition = this.pptxFilter.reduce(
                (accumulator, currentValue) => {
                  if (currentValue > 0) {
                    return accumulator !== ""
                      ? accumulator + "," + currentValue
                      : currentValue;
                  } else {
                    return accumulator;
                  }
                },
                ""
              ));
          } else {
            fileInfo.exportType = 2;
          }
          // fileInfo.type = this.stateToNum(type, name);
          this.getFileProcessFun(tempPage, fileInfo);
          loading = false;
        }
      });
    },
    // 0-ppt上刊，1-ppt下刊，2-pdf上刊，3-pdf下刊，4-pptx上刊，5-pptx下刊，6-pptx换画，7-pdf换画
    stateToNum(type, name) {
      let arr = [
        {
          type: "ppt",
          name: "sk",
          num: 0,
        },
        {
          type: "ppt",
          name: "xk",
          num: 1,
        },
        {
          type: "pdf",
          name: "sk",
          num: 2,
        },
        {
          type: "pdf",
          name: "xk",
          num: 3,
        },
        {
          type: "pptx",
          name: "sk",
          num: 4,
        },
        {
          type: "pptx",
          name: "xk",
          num: 5,
        },
        {
          type: "pptx",
          name: "hh",
          num: 6,
        },
        {
          type: "pdf",
          name: "hh",
          num: 7,
        },
      ];
      for (let data of arr) {
        if (data.type == type && data.name == name) {
          return data.num;
        }
      }
    },
    // 获取pptx
    getFileProcessFun(tempPage, info) {
      let routeUrl = this.$router.resolve({
        path: "/progressDownCountry",
        query: info,
      });
      tempPage.location = routeUrl.href;
    },
    // 页数大小改变
    sizeChange(pageVal) {
      console.log("pageVal", pageVal);
      this.currUpPage = 1;
      this.pageUpSize = pageVal;
      this.getDataFromType();
    },
    // 分页功能
    changePage(page) {
      console.log("page----", page);
      this.currUpPage = page;
      this.getDataFromType();
    },
    // 根据type来获取数据
    getDataFromType() {
      if (
        this.routeParams.imgType === "0" ||
        this.routeParams.imgType === "1"
      ) {
        this.searchFun();
      } else {
        this.searchPain();
      }
    },
    // 获取上下刊
    searchFun() {
      let info = this.searchFormat();
      this.getImgData(info);
    },
    // 获取换画
    searchPain() {
      let info = this.searchPainFormat();
      this.getPainImg(info);
    },
    changeMedia() {
      this.currUpPage = 1;
      this.getDataFromType();
    },
    // 换画搜索数据格式化
    searchPainFormat() {
      let info = {
        replaceRecordId: this.routeParams.replaceRecordId,
        mediaTypeId: this.mediaType,
        pageNum: this.currUpPage,
        pageSize: this.pageUpSize,
      };
      return info;
    },
    // 获取换画图片数据
    getPainImg(params) {
      api
        .postApi_json("/national/api/v1/replace/detailInfo", params)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let dataInfo = res.data.data;
            this.totalUpNum = dataInfo.total;
            for (let data of dataInfo.list) {
              data.city = data.cityName;
              data.rName = data.districtName;
              data.lStar = data.beginDate;
              data.lEnd = data.endDate;
              if (data.adPlanPics) {
                for (let item of data.adPlanPics) {
                  item.url = item.pURL;
                }
              } else {
                data.adPlanPics = [];
              }
              let time =
                this.formatTime(data.lStar) + "-" + this.formatTime(data.lEnd);
              data.timeRange = time;
              data.upImgArr = data.adPlanPics;
            }
            this.reportArr = dataInfo.list;

            if (dataInfo.total == 0) {
              sessFun.messageFun("warning", "暂无换画数据");
            }
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        });
    },
    // 获取换画数据
    getPainData() {
      const { replaceRecordId } = this.routeParams;
      api
        .getApi("/national/api/v1/powerPoint/getReplaceDetailInfo", {
          replaceRecordId,
        })
        .then((res) => {
          let data = res.data.data;
          // 换画抬头信息
          this.report = this.getFangInfo(data.adPlanInfo);
          // 投放详情
          let result = this.getResInfo(data.resInfo);
          this.putDetail = result;
          this.currPutDetail = JSON.parse(JSON.stringify(this.putDetail));
          this.filterCityData = filterFormat(result, "city");
          this.filtersArea = filterFormat(result, "rName");
          // 发布情况
          this.postDetail = this.getCityAdSpaceCount(data.cityAdSpaceCount);
          this.loading = false;
        });
    },
    // 搜索数据格式化
    searchFormat() {
      const { apID, companyId, imgType } = this.routeParams;
      let info = {
        apId: apID,
        companyId,
        imgType,
        mediaTypeId: this.mediaType,
        pageNum: this.currUpPage,
        pageSize: this.pageUpSize,
      };
      return info;
    },
    // 获取路由数据
    getRouter() {
      let route = this.$route.query;
      const { apID, companyId, imgType, replaceRecordId } = route;
      this.routeParams = {
        apID,
        companyId,
        imgType,
        replaceRecordId,
      };
    },
    // 获取原始数据
    getData() {
      const { apID, companyId } = this.routeParams;
      api
        .getApi("/national/api/v1/powerPoint/getDetailInfo", {
          apID,
          companyId,
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let data = res.data.data;
            this.report = data.adPlanInfo;
            // 投放详情
            let result = data.resInfo;
            this.putDetail = result;
            this.currPutDetail = JSON.parse(JSON.stringify(this.putDetail));
            this.filterCityData = filterFormat(result, "city");
            this.filtersArea = filterFormat(result, "rName");
            // 发布情况
            this.postDetail = this.getCityAdSpaceCount(data.cityAdSpaceCount);
            this.loading = false;
          } else {
            this.loading = false;
            Message.warning(res.data.MSG);
          }
        })
        .catch((res) => {
          this.loading = false;
          console.log(res);
        });
    },
    // 头部信息
    getFangInfo(data) {
      let info = {
        apID: data.apId,
        apName: data.apName,
        apcTime: dateFormat.toDate(data.apCreateTime, "/"),
        bTitle: data.btitle,
        cName: data.companyName,
        rIDs: data.rIDs,
        asSpaceSum: data.asSpaceSum,
      };
      return info;
    },
    // 投放详情
    getResInfo(arr) {
      let result = [];
      for (let item of arr) {
        let obj = {
          IsLock: item.IsLock,
          adSize: item.adSize,
          adSpaceCount: item.adSpaceCount,
          adViewSize: item.adViewSize,
          asID: item.asID,
          asLab: item.asLab,
          assetTag: item.assetTag,
          cType: item.cType,
          chDay: item.chDay,
          city: item.city,
          fNum: item.fNum,
          hNum: item.hNum,
          hPrice: item.hPrice,
          lEnd: item.lEnd,
          lID: item.lID,
          lSetTime: item.lSetTime,
          lStar: item.lStar,
          lState: item.lState,
          mTitle: item.mTitle,
          mVehicle: item.mVehicle,
          rID: item.rID,
          rName: item.rName,
          resAddress: item.resAddress,
          resID: item.resID,
          resName: item.resName,
          tradingArea: item.tradingArea,
          notPush: item.notPush,
        };
        result.push(obj);
      }
      return result;
    },
    // 发布情况
    getCityAdSpaceCount(arr) {
      let result = [];
      let info = {
        citys: [],
        totalNum: 0,
      };
      for (let data of arr) {
        let obj = {
          city: data.cityName,
          planNum: data.adSpaceCount,
          realNum: data.adSpaceCount,
          wrongNum: 0,
          resolveNum: 0,
        };
        info.citys.push(data.cityName);
        info.totalNum += data.adSpaceCount;
        result.push(obj);
      }
      this.report.rIDs = info.citys.join(",");
      this.report.asSpaceSum = info.totalNum;
      return result;
    },

    // 获取图片信息(广告门)
    getImgData(params) {
      api
        .getApi("/national/api/v1/nationalAdPlan/pageAdsUploadInfo", params)
        .then((res) => {
          if (res.data.SysCode === 200200) {
            let dataInfo = res.data.data;
            this.totalUpNum = dataInfo.total;
            for (let data of dataInfo.list) {
              for (let item of data.photoList || []) {
                item.url = item.pURL;
              }
              let time =
                this.formatTime(data.lStar) + "-" + this.formatTime(data.lEnd);
              data.timeRange = time;
              data.upImgArr = data.photoList;
            }
            this.reportArr = dataInfo.list;
            if (dataInfo.total == 0) {
              Message.warning("暂无监播数据！");
            }
          } else {
            Message.warning(res.data.MSG);
          }
        })
        .catch((res) => {
          console.log(res);
        });
    },
    // 查看监播
    showImg(row) {
      const { apID, companyId, imgType } = this.routeParams;
      api
        .getApi("/national/api/v1/powerPoint/listImgByResId", {
          apID,
          companyId,
          imgType,
          resID: row.resID,
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            if (Array.isArray(res.data.data) && res.data.data.length) {
              this.ImgBoxArr = res.data.data;
              this.isShowImgArr = true;
            } else {
              Message.warning("暂无数据");
            }
          } else {
            Message.warning(res.data.MSG);
          }
        });
    },
    // 当搜索框为空的时候进行重置显示
    initData() {
      if (!this.keyword) {
        this.currPutDetail = this.putDetail;
      }
    },
    // 搜索
    search() {
      let select = this.select;
      let keyword = this.keyword;
      if (this.keyword) {
        let arr = [];
        for (let data of this.putDetail) {
          if (data.resName) {
            if (select == "1" && data.resName.includes(keyword)) {
              arr.push(data);
            }
          }
          if (data.tradingArea) {
            if (select == "2" && data.tradingArea.includes(keyword)) {
              arr.push(data);
            }
          }
        }
        this.currPutDetail = arr;
        return;
      }
      this.currPutDetail = this.putDetail;
    },
    // 时间格式规范
    formatTime(val) {
      return dateFormat.toDate(val, "/");
    },
    // 价格加上逗号
    priceFormat(price) {
      // console.log('price', price);
      return commaFormat.init(price);
    },
    // 字段截取
    wordlimit(word, num) {
      if (document.body.clientWidth <= 1366) {
        if (word && word.length > num) {
          return (word = word.substr(0, num) + "...");
        }
        return word;
      } else {
        return word;
      }
    },
    //缩略图
    handlePictureCardPreview(url) {
      console.log("item", url);
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    filterCity(value, row) {
      return row.city === value;
    },
    filterRName(value, row) {
      return row.rName === value;
    },
    changeImgType() {
      this.isActive = !this.isActive;
    },
    loginTimeout() {
      Message.warning("登录超时,请重新登录");
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped>
.ad_mediaMana_wrap {
  width: 100%;
  padding-top: 32px;
  position: relative;
}

.mediaMana_content_top {
  padding: 24px;
  margin: 0 64px;
  background: #fff url("../../assets/images/upReportBg.png") right no-repeat;
}

.title {
  border-bottom: 1px solid #d8d8d8;
}

.title h1 {
  font-size: 42px;
  margin-bottom: 18px;
  color: rgba(0, 0, 0, 0.85);
}

.title h3 {
  font-size: 24px;
  color: #333333;
  margin-bottom: 19px;
}

.button_box {
  float: right;
}

.detail p {
  margin-top: 23px;
}

.detail p em {
  font-size: 18px;
  color: #333333;
  margin-left: 24px;
}

.detail p em:nth-of-type(1) {
  margin-left: 0;
}

.detail p i {
  font-size: 18px;
  color: #2a2a2a;
  font-style: normal;
}

.plan-panel {
  padding: 12px 24px;
  margin: 16px 64px;
  background: #fff;
}

/deep/ .el-tabs__nav-wrap {
  overflow: initial;
  height: 40px;
  line-height: 41px;
  border-bottom: 1px solid #dedede;
}

/deep/ .el-tabs__nav-wrap::after {
  background-color: transparent;
}

/*投放详情*/

/deep/ .el-button [class*="el-icon-"] + span {
  position: relative;
  top: 0px;
  left: 2px;
}

.searchBtn {
  background: #1890ff;
  border-radius: 4px;
  width: 76px;
  /* height: 34px; */
  position: relative;
  left: 16px;
  padding: 0;
}

.search-wrap {
  margin-left: -30px;
  height: 40px;
  line-height: 40px;
  margin-bottom: 16px;
}

.search-wrap span {
  float: left;
  margin-left: 2px;
}

.first-wrap /deep/ .el-select .el-input .el-select__caret {
  position: relative;
  left: 0;
  top: 2px;
}

.el-input {
  width: 300px;
  /* height: 34px; */
}

/deep/ .el-table td,
.el-table th {
  padding: 2px 0;
}

/deep/ .type-select .el-input,
/deep/ .type-select .el-input__inner {
  width: 95px;
  position: relative;
  top: 2px;
  left: 10px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  padding-right: 0;
  padding-left: 10px;
  /* height: 34px; */
}

.searchInput /deep/ .el-input__inner,
.searchInput {
  width: 224px !important;
  position: relative;
  left: 7px;
  top: 0;
  /* height: 34px; */
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}

/deep/ .el-input__suffix {
  right: -6px;
}

.box-wrap {
  background-color: #ffffff;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
}

.box-wrap > h4 {
  margin-bottom: 26px;
  height: 55px;
  border-bottom: 1px solid #e6e7e9;
  font-size: 16px;
  color: rgba(51, 51, 51, 0.85);
  line-height: 55px;
  font-weight: bold;
}

/*滚动条*/
/deep/ .el-table__body-wrapper {
  height: 450px;
}

.ad_index_footer {
  font-size: 14px;
  color: #8a8a8a;
  text-align: center;
}

/* 监播图片 */
.typeOfRec /deep/ .el-carousel {
  width: 100%;
}

.typeOfRec /deep/ .el-carousel__item img {
  width: 100%;
  height: 100%;
}

/*查看监播*/
.JB /deep/ .el-dialog {
  width: 42%;
  margin-top: 7vh;
}

.JB /deep/ .el-carousel__container {
  height: 650px;
}

/*地图展示*/
.sec-wrap .map {
  width: 1246px;
  height: 527px;
  padding: 21px 29px;
}

/*监播图片*/
/*.JB /deep/ .el-dialog {*/
/*width: 40%;*/
/*}*/

/* /deep/ .el-tabs__header{
      margin-bottom: 10px;
    } */

.tabs {
  padding-left: 38px;
  margin-bottom: 25px;
  height: 34px;
}

.tabs button {
  width: 88px;
  height: 32px;
  outline: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px 0 0 4px;
  background-color: #fff;
  cursor: pointer;
  float: left;
}

.tabs button + button {
  border-radius: 0 4px 4px 0;
}

.tabs button.active {
  border: 1px solid #1890ff;
  font-weight: bold;
  color: #1890ff;
}

/*图片切换*/
.typeOfRec .pic_box {
  width: 30%;
  margin-top: 18px;
  margin-right: 1.6%;
  display: inline-block;
  max-width: 400px;
  min-width: 385px;
}

/deep/ .typeOfRec .el-card {
  width: 100%;
}

/deep/ .typeOfRec .el-card__header {
  padding: 16px;
}

.picBox {
  width: 220px;
  height: 326px;
  padding: 4px;
  box-sizing: border-box;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  display: inline-block;
  margin-bottom: 34px;
  position: relative;
  margin-right: 8px;
  margin-left: 8px;
}

.picBox img {
  width: 210px;
  height: 280px;
  border-bottom: 1px solid #e9e9e9;
}

.picBox .pic-title {
  font-size: 14px;
  color: #666666;
  text-align: center;
  height: 30px;
  line-height: 30px;
}

/deep/ .el-carousel__button {
  width: 18px;
}

/deep/ .el-carousel__indicators {
  position: absolute;
  list-style: none;
  bottom: 0;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  padding: 0;
  z-index: 2;
  width: 100%;
}

/deep/ .el-carousel__button {
  background-color: #666;
}

/*发布情况*/
.tooltip_p b,
.tooltip_p span {
  display: block;
}

.tooltip_p span {
  color: rgba(255, 255, 255, 1);
  margin-bottom: 10px;
}

.mask-btn .el-icon-search {
  position: absolute;
  left: 43%;
  top: 43%;
  font-size: 30px;
  color: #fff;
  cursor: pointer;
  z-index: 2;
}

/deep/ .el-tooltip__popper.is-dark {
  background: rgba(0, 0, 0, 0.75);
}

/deep/ .el-select .el-input .el-select__caret {
  position: relative;
  left: -9px;
}

/deep/ .el-select {
  top: -4px;
}

/deep/ .btn-prev {
  position: relative;
  top: -4px !important;
}

/deep/ .el-pagination {
  position: absolute;
  right: 0;
  top: 10px;
}

/deep/ .el-pagination.is-background .el-pager li {
  font-weight: normal;
  font-size: 13px;
  background-color: transparent;
}

/deep/ .el-pagination button,
.el-pagination span:not([class*="suffix"]) {
  position: relative;
  top: 0px !important;
  background-color: transparent !important;
}

/deep/ .el-pagination__jump {
  margin-left: 13px;
  position: relative;
  top: -4px;
}

/deep/ .el-card__body {
  display: flex;
  flex-wrap: wrap;
}

.search_p {
  clear: both;
  padding-left: 28px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  font-size: 12px;
  color: rgb(102, 102, 102);
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

.header_title {
  width: 95%;
  float: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/*pptx对话框*/

.pptx-dialog li {
  display: flex;
  /*align-items: center;*/
  margin-bottom: 16px;
  .form-label {
    white-space: nowrap;
  }
}
.pptx-dialog li .date-wrap /deep/ .el-checkbox {
  width: 272px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  padding: 0 8px;
  box-sizing: border-box;
  margin-bottom: 10px;
}
/deep/ .pptx-dialog .el-dialog__body {
  padding-bottom: 0;
}

.date-group-wrap /deep/ .el-checkbox {
  margin-left: 0;
}
.pptx-dialog li .date-wrap /deep/ .el-checkbox.is-checked {
  border: 1px solid #1890ff;
}
.pptx-select /deep/ .el-input--suffix .el-input__inner {
  width: 272px;
  height: 32px;
}

/deep/ .report-alert .el-alert__icon {
  width: 14px;
  font-size: 14px !important;
}
</style>


