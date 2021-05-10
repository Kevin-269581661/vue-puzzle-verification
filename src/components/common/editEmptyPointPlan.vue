<template>
  <div class="ad_mediaMana_wrap createPlan">
    <div class="ad_mediaMana_nav clearfix">
      <p><a href="#">方案管理</a><em> / </em><a href="#">创建方案</a></p>
    </div>
    <div class="mediaMana_content_top">
      <div class="content_top_wrap">
        <!--选择点位-->
        <div class="step2" v-if="active == 1">
          <div>
            <div class="search-nav">
              <div class="search-wrap">
                <div>
                  <el-input
                    placeholder="请输入要搜索的内容"
                    v-model="searchInput"
                    class="input-with-select"
                    size="small"
                    @change="initData"
                  >
                    <el-select
                      v-model="selectValue"
                      slot="prepend"
                      class="type-select"
                      @change="initData"
                    >
                      <el-option
                        v-for="item in typeSelect"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-input>
                </div>
                <div>
                  <el-date-picker
                    v-model="dateInput"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy/MM/dd"
                    format="yyyy/MM/dd"
                    class="date-select input-with-select"
                    size="small"
                    :picker-options="pickerOptions"
                  >
                  </el-date-picker>
                </div>
                <div>
                  <el-input
                    class="planAdsCntClass"
                    placeholder="请输入内容"
                    v-model="planAdsCnt"
                    @change="planAdsCntChange"
                  >
                    <template slot="prepend">投放面数</template>
                  </el-input>
                </div>
                <div>
                  <el-button
                    type="primary"
                    style="background: #1890ff"
                    icon="el-icon-search"
                    class="searchBtn"
                    @click="searchFun"
                    :disabled="searchBtnAbled"
                    v-qadn-mta-h5="{ id: 'a004_b008_c000_d000_bt049_ck01' }"
                    >搜索
                  </el-button>
                </div>
                <div class="shopcar" @click="dialogVisible()">
                  <el-badge :value="nowPointNum" class="item">
                    <img src="../../assets/images/shopCar.png" alt="" />
                  </el-badge>
                </div>
              </div>
              <el-row class="button_row">
                <el-col>
                  <el-button
                    type="primary"
                    class="map"
                    icon="el-icon-location-outline"
                    @click="setMapParams"
                    v-qadn-mta-h5="{ id: 'a004_b008_c000_d000_bt050_ck03' }"
                    >地图
                  </el-button>
                  <el-button
                    type="success"
                    class="importXle"
                    @click.native.prevent="importFanan('res')"
                    v-qadn-mta-h5="{ id: 'a004_b008_c000_d000_bt051_ck04' }"
                  >
                    导入小区
                  </el-button>
                </el-col>
              </el-row>
            </div>
            <!--类型区域选择面板-->
            <div class="dw-panel" v-show="isOccupied">
              <dl>
                <dt>资源类型：</dt>
                <dd
                  :class="recType === 1 ? 'active' : ''"
                  @click="activeRecType(1)"
                >
                  社区
                </dd>
                <dd
                  :class="recType === 2 ? 'active' : ''"
                  @click="activeRecType(2)"
                >
                  写字楼
                </dd>
              </dl>
              <dl>
                <dt>媒体类型：</dt>
                <dd
                  :class="mediaType === '广告门' ? 'active' : ''"
                  @click="activeMediaType('广告门')"
                >
                  广告门
                </dd>
              </dl>
              <dl style="border: none">
                <dt>城市区域：</dt>
                <dd
                  v-for="(item, index) in city"
                  :key="index"
                  :class="index == activeIndex ? 'active' : ''"
                  @click="activeCity(item, index)"
                >
                  {{ item.rName }}
                </dd>
              </dl>
              <dl
                class="city-proper"
                v-for="(list, index) of area"
                :key="index"
                v-show="index == activeIndex"
              >
                <dd
                  v-for="(item, index) of list"
                  :key="index"
                  :class="item.rName == areaName ? 'active' : ''"
                  @click="activeArea(item)"
                >
                  {{ item.rName }}
                </dd>
              </dl>
              <dl style="border: none">
                <dt>其它条件：</dt>
                <dd class="other-dd">
                  <!-- <el-select
                    v-model="mState"
                    placeholder="媒体状态"
                    class="otherSelect"
                    :class="mState !== '' ? 'otherSelectActive' : ''"
                    size="small"
                    @change="mStateChange"
                  >
                    <el-option label="正常" value="1"></el-option>
                    <el-option label="待安装" value="2"></el-option>
                  </el-select> -->
                  <el-select
                    v-model="limitList"
                    placeholder="广告限制"
                    class="otherSelect adLimitSelect"
                    :class="limitList.length !== 0 ? 'otherSelectActive' : ''"
                    multiple
                    collapse-tags
                    size="small"
                    @change="activeADLimit"
                  >
                    <el-option
                      v-for="item in ADLimit"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <el-select
                    v-model="buildValue"
                    :placeholder="recType == '1' ? '楼盘类型' : '写字楼类型'"
                    :class="buildValue !== '' ? 'otherSelectActive' : ''"
                    size="small"
                    class="otherSelect"
                    @change="tableHeaderFilter_cType"
                  >
                    <el-option
                      v-for="item in buildType"
                      :key="item.buildValue"
                      :label="item.buildValue"
                      :value="item.buildValue"
                    >
                    </el-option>
                  </el-select>
                  <el-popover
                    placement="bottom-start"
                    width="155"
                    trigger="click"
                    popper-class="other-dd-popper"
                  >
                    <div
                      class="input-wrap"
                      :class="HSearch === 'h' ? 'focus' : ''"
                    >
                      <input type="text" class="input" v-model="houseNum[0]" />
                      -
                      <input type="text" class="input" v-model="houseNum[1]" />
                      <el-button @click="emptyFun('H')" class="input-wrap-Btn"
                        >清 除</el-button
                      >
                      <el-button
                        type="primary"
                        class="input-wrap-Btn"
                        @click="tableHeaderFilter_h()"
                        >确 定
                      </el-button>
                    </div>
                    <el-button
                      slot="reference"
                      class="otherBtn"
                      :class="filterData.hNum ? 'otherBtnActive' : ''"
                    >
                      住户数量
                    </el-button>
                  </el-popover>
                  <el-popover
                    placement="bottom-start"
                    width="155"
                    trigger="click"
                    popper-class="other-dd-popper"
                  >
                    <div
                      class="input-wrap"
                      :class="HSearch === 'p' ? 'focus' : ''"
                    >
                      <input
                        type="text"
                        class="input"
                        v-model="buildPrice[0]"
                      />
                      -
                      <input
                        type="text"
                        class="input"
                        v-model="buildPrice[1]"
                      />
                      <el-button @click="emptyFun('P')" class="input-wrap-Btn"
                        >清 除</el-button
                      >
                      <el-button
                        type="primary"
                        class="input-wrap-Btn"
                        @click="tableHeaderFilter_p()"
                        >确 定
                      </el-button>
                    </div>
                    <el-button
                      slot="reference"
                      class="otherBtn"
                      :class="filterData.bPrice ? 'otherBtnActive' : ''"
                    >
                      楼盘价格
                    </el-button>
                  </el-popover>
                  <el-popover
                    placement="bottom-start"
                    width="155"
                    trigger="click"
                    popper-class="other-dd-popper"
                  >
                    <div
                      class="input-wrap"
                      :class="HSearch === 'p' ? 'focus' : ''"
                    >
                      <input type="text" class="input" v-model="liveYear[0]" />
                      -
                      <input type="text" class="input" v-model="liveYear[1]" />
                      <el-button @click="emptyFun('Y')" class="input-wrap-Btn"
                        >清 除</el-button
                      >
                      <el-button
                        type="primary"
                        class="input-wrap-Btn"
                        @click="tableHeaderFilterByLiveYear()"
                        >确 定
                      </el-button>
                    </div>
                    <el-button
                      slot="reference"
                      class="otherBtn"
                      :class="filterData.lYear ? 'otherBtnActive' : ''"
                    >
                      入住年份
                    </el-button>
                  </el-popover>
                  <el-popover
                    placement="bottom-start"
                    width="155"
                    trigger="click"
                    popper-class="other-dd-popper"
                  >
                    <div
                      class="input-wrap"
                      :class="HSearch === 'PF' ? 'focus' : ''"
                    >
                      <input
                        type="text"
                        class="input"
                        v-model="peopleFlow[0]"
                      />
                      -
                      <input
                        type="text"
                        class="input"
                        v-model="peopleFlow[1]"
                      />
                      <el-button @click="emptyFun('PF')" class="input-wrap-Btn"
                        >清 除</el-button
                      >
                      <el-button
                        type="primary"
                        class="input-wrap-Btn"
                        @click="tableHeaderFilterByPeopleFlow()"
                        >确 定
                      </el-button>
                    </div>
                    <el-button
                      slot="reference"
                      class="otherBtn"
                      :class="filterData.pFlow ? 'otherBtnActive' : ''"
                    >
                      人流量
                    </el-button>
                  </el-popover>
                  <el-popover
                    placement="bottom-start"
                    width="155"
                    trigger="click"
                    popper-class="other-dd-popper"
                  >
                    <div
                      class="input-wrap"
                      :class="HSearch === 'PSN' ? 'focus' : ''"
                    >
                      <input type="text" class="input" v-model="carFlow[0]" />
                      -
                      <input type="text" class="input" v-model="carFlow[1]" />
                      <el-button @click="emptyFun('PSN')" class="input-wrap-Btn"
                        >清 除</el-button
                      >
                      <el-button
                        type="primary"
                        class="input-wrap-Btn"
                        @click="tableHeaderFilterByCarFlow()"
                        >确 定
                      </el-button>
                    </div>
                    <el-button
                      slot="reference"
                      class="otherBtn"
                      :class="filterData.cFlow ? 'otherBtnActive' : ''"
                    >
                      车流量
                    </el-button>
                  </el-popover>
                  <el-popover
                    placement="bottom-start"
                    width="155"
                    trigger="click"
                    popper-class="other-dd-popper"
                  >
                    <div
                      class="input-wrap"
                      :class="HSearch === 'CF' ? 'focus' : ''"
                    >
                      <input
                        type="text"
                        class="input"
                        v-model="parkSpaceNum[0]"
                      />
                      -
                      <input
                        type="text"
                        class="input"
                        v-model="parkSpaceNum[1]"
                      />
                      <el-button @click="emptyFun('CF')" class="input-wrap-Btn"
                        >清 除</el-button
                      >
                      <el-button
                        type="primary"
                        class="input-wrap-Btn"
                        @click="tableHeaderFilterByParkSpaceNum()"
                        >确 定
                      </el-button>
                    </div>
                    <el-button
                      slot="reference"
                      class="otherBtn"
                      :class="filterData.pSNum ? 'otherBtnActive' : ''"
                    >
                      车位数
                    </el-button>
                  </el-popover>
                </dd>
              </dl>
            </div>
            <div
              class="filter-condition"
              v-show="isOccupied && filterCondition.length > 0"
            >
              <el-tag
                v-for="(tag, index) in filterCondition"
                :key="index"
                closable
                :disable-transitions="false"
                @close="filterTagCloseFun(tag, index)"
                :type="tag.type"
                size="medium"
              >
                {{ tag.name }}
              </el-tag>
            </div>
            <!--提示-->
            <div class="tip">
              <i class="el-icon-info"></i>
              <p>
                共 <span>{{ total ? total : 0 }}</span> 个资源，已选资源
                <span>{{ nowPointNum > 0 ? nowPointNum : 0 }}</span> 个
              </p>
            </div>
            <!--表格-->
            <div class="table_wrap adsTable">
              <div class="myCheckbox" v-if="isOccupied">
                <el-checkbox v-model="IsAll" @change="allCheckboxAds"
                  >全选本页</el-checkbox
                >
              </div>
              <el-table
                v-loading="loading"
                element-loading-text="玩命加载中.."
                element-loading-spinner="el-icon-loading"
                border
                :data="planList"
                :default-sort="{ prop: 'resID', order: 'descending' }"
                @cell-mouse-enter="mouseEnter"
                style="width: 100%"
                class="selectAdsTable"
                height="595"
              >
                <el-table-column
                  fixed
                  class-name="el-table-column-checkbox"
                  width="110px"
                >
                  <template slot-scope="scope">
                    <div v-if="isOccupied">
                      <div class="adDoor" v-if="mediaType === '广告门'">
                        <el-checkbox
                          v-model="scope.row.checkBox"
                          @change="ChangeCommunity(scope.row)"
                          :disabled="scope.row.box"
                        >
                        </el-checkbox>
                      </div>
                      <div class="roadGate" v-else>
                        <el-checkbox
                          v-model="scope.row.checkBox"
                          @change="changeBarrierGate(scope.row)"
                        >
                        </el-checkbox>
                      </div>
                    </div>
                    <div v-else>{{ scope.row.asLabs }}面</div>
                  </template>
                </el-table-column>

                <el-table-column
                  fixed
                  class-name="el-table-column-resName"
                  label="资源名称"
                  width="200"
                  prop="resName"
                >
                </el-table-column>
                <el-table-column
                  prop="actualMediaCnt"
                  label="媒体数量(门)"
                  min-width="120"
                  align="right"
                >
                </el-table-column>
                <el-table-column
                  prop="actualAdsCnt"
                  label="可投数量(面)"
                  min-width="120"
                  align="right"
                >
                </el-table-column>
                <el-table-column prop="cityName" label="城市" min-width="110">
                </el-table-column>
                <el-table-column
                  prop="districtName"
                  label="区域"
                  min-width="110"
                >
                </el-table-column>
                <el-table-column label="商圈" min-width="130">
                  <template slot-scope="scope">
                    {{ scope.row.tradingArea || "--" }}
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="customPermission.patrolPermission == 2"
                  label="通电情况"
                  align="right"
                  min-width="110"
                >
                  <template slot-scope="scope">
                    {{ scope.row.electrifyState || "--" }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="广告限制"
                  min-width="130"
                  prop="notPush"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.notPush || "--" }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="recType == '1' ? '楼盘类型' : '写字楼类型'"
                  min-width="100"
                  prop="cType"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.cType || "--" }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="楼盘价格" align="right" min-width="110">
                  <template slot-scope="scope">
                    <span>&yen;{{ scope.row.hPrice }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fNum"
                  label="楼栋数量"
                  align="right"
                  min-width="100"
                >
                </el-table-column>
                <el-table-column
                  prop="chDay"
                  align="right"
                  :label="recType === 1 ? '入住年份' : '建成年份'"
                  min-width="90"
                >
                </el-table-column>
                <el-table-column
                  prop="hNum"
                  align="right"
                  :label="recType === 1 ? '小区户数' : '办公室数量'"
                  min-width="90"
                >
                </el-table-column>
                <el-table-column label="人流量" align="right" min-width="110">
                  <template slot-scope="scope">
                    {{ scope.row.peopleFlow }}
                  </template>
                </el-table-column>
                <el-table-column label="车位数" align="right" min-width="110">
                  <template slot-scope="scope">
                    {{ scope.row.parkSpaceNum }}
                  </template>
                </el-table-column>
                <el-table-column label="车流量" align="right" min-width="110">
                  <template slot-scope="scope">
                    {{ scope.row.carFlow }}
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  prop="schedule"
                  label="排期"
                  min-width="190"
                >
                </el-table-column>
              </el-table>
              <div class="ad_pagination" v-if="total">
                <el-pagination
                  background
                  layout="total, sizes, prev, pager, next, jumper"
                  @current-change="changePage"
                  @size-change="sizeChange"
                  :page-sizes="[10, 20, 50, 100, 500]"
                  :current-page.sync="pageNum"
                  :page-size="pageSize"
                  :total="total"
                >
                </el-pagination>
              </div>
            </div>
            <!-- 修改逻辑后的购物车组件 -->
            <shopping-cart
              :dialogTableVisible.sync="dialogTableVisible"
              :mapBtn.sync="mapBtn"
              @next="next"
              :activeName="activeName"
              :shoppingCartList="shopingList"
              :customPermission="customPermission"
              @shoppingCartdeleteRow="changeCheck"
              @shoppongCartClearData="clearShop"
              :connectAdDialogVisible.sync="connectAdDialogVisible"
              @getMapADList="getMapADList"
              :shopMedia_ADNum="shopMedia_ADNum"
            ></shopping-cart>
          </div>
        </div>
        <div class="step4" v-if="active == 2">
          <div class="createSuccess">
            <div class="successIcon">
              <img src="../../assets/images/createSuccess.png" alt="" />
              <!--<i class="fa fa-check-circle fa-4x" style="color:#67C23A;"></i>-->
              <h2>编辑成功</h2>
              <p>编辑时间：{{ dateTime }}</p>
            </div>
            <div class="planPanel noShareUl">
              <ul>
                <li><em>方案名称：</em>{{ FAInfo.apName }}</li>
                <li><em>所属客户：</em>{{ cName || "--" }}</li>
                <li><em>所属品牌：</em>{{ cBand || "--" }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content_bottom_btn">
      <div class="finishBtn" v-if="active == 2">
        <el-button type="default" @click="continueCreate">继续创建</el-button>
        <el-button plain type="default" @click="ToDetail"> 查看方案 </el-button>
        <el-button @click="downLoadFanan()" type="primary" class="urlBtn"
          >导出方案</el-button
        >
      </div>
    </div>
    <!--添加商品到购物车的动画效果-->
    <div class="shopAnimate" v-show="shoppingShow">
      <img src="../../assets/images/select.png" alt="" />
    </div>
    <div class="shopAnimateAll" v-show="selectAll">
      <img src="../../assets/images/allselect.png" alt="" />
    </div>
    <!-- 导出空位时间弹出框 -->
    <el-dialog
      :visible.sync="showEmptyPoint"
      :modal="false"
      top="35vh"
      width="40%"
    >
      <p>
        <el-radio-group v-model="dateType">
          <el-radio label="1" v-if="isShowHalfYear">默认半年日期</el-radio>
          <el-radio label="2">自定义日期</el-radio>
        </el-radio-group>
      </p>
      <p v-if="dateType == '2'" style="margin-top: 10px">
        <el-date-picker
          v-model="emptyRange"
          type="daterange"
          size="mini"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy/MM/dd"
          format="yyyy/MM/dd"
          class="date-select input-with-select"
          :picker-options="emptyPointPickerOptions"
        >
        </el-date-picker>
      </p>
      <span slot="footer">
        <el-button size="small" type="primary" @click="downEmptyPoint()"
          >确认</el-button
        >
      </span>
    </el-dialog>
    <!-- 导出空位弹出框 -->
    <el-dialog
      title="链接地址："
      :visible.sync="showEmpty"
      :modal="false"
      top="35vh"
      width="40%"
    >
      <p id="shareDownUrl">{{ downUrl }}</p>
      <p style="text-align: center; margin-top: 25px">
        <el-button
          type="primary"
          @click="copyUrlDown()"
          size="small"
          style="width: 80px; height: 34px; outline: none; cursor: pointer"
          >复制链接
        </el-button>
      </p>
    </el-dialog>
    <!-- 导入表格组件 -->
    <import-village-by-excel
      ref="importexcel"
      :isDialogImport.sync="isDialogImport"
      @skipAndAddShopping="handleSkipAndAdd"
      @submitBtn="submitUpload"
      :importInfoData="importInfoData"
      :importAction="doUpload"
    ></import-village-by-excel>
  </div>
</template>

<script>
import {
  Input,
  Dialog,
  Button,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Cascader,
  DatePicker,
  Select,
  Option,
  Form,
  FormItem,
  Steps,
  Step,
  Badge,
  Checkbox,
  Message,
  InputNumber,
  Radio,
} from "element-ui";
import api from "../../api/api";
import areaArr from "../../commonFun/areaPackage_new";
import commaFormat from "../../commonFun/commaFormat";
import sessFun from "../../commonFun/sessFun.js";
// 时间格式化
import timeFormat from "../../commonFun/timeFormat";
// 筛选过滤
import filterFormat from "../../commonFun/filterTableData.js";
import sheetExcel from "../../commonFun/sheetExcel.js";
// 方案缓存
import cacheAdPlan from "../../commonFun/cacheAdPlan";
// 方案导入结果
import importResult from "./components/importResult.vue";
//导入表格
import importVillageByExcel from "./components/importVillageByExcel";
//购物车页面
import shoppingCart from "./components/shoppingCart";

export default {
  name: "createPlan",
  components: {
    elInput: Input,
    elDialog: Dialog,
    elButton: Button,
    elTabs: Tabs,
    elTabPane: TabPane,
    elTable: Table,
    elTableColumn: TableColumn,
    elCascader: Cascader,
    elDatePicker: DatePicker,
    elSelect: Select,
    elOption: Option,
    elForm: Form,
    elFormItem: FormItem,
    elSteps: Steps,
    elStep: Step,
    elBadge: Badge,
    elCheckbox: Checkbox,
    elInputNumber: InputNumber,
    importResult,
    importVillageByExcel,
    shoppingCart,
  },
  data() {
    //客户预算自定义校验
    let validateBudget = (rule, value, callback) => {
      if (value) {
        // 数字/货币金额 (只支持正数、不支持校验千分位分隔符)
        let reg = /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0){1}$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/;
        if (!reg.test(value)) {
          callback(new Error("请输入正数"));
        } else {
          if (value > 9999999) {
            callback(new Error("预算不能大于9,999,999"));
          } else {
            callback();
          }
        }
      } else {
        callback();
      }
    };
    let validateSales = (rule, value, callback) => {
      if (value) {
        if (this.BDData.uid === "0") {
          callback(new Error("请输入正确的账号"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let validateName = (rule, value, callback) => {
      if (value) {
        if (value.match(/\s/)) {
          callback(new Error("方案名称不能带有空格"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let validateNum = (rule, value, callback) => {
      let reg = /^[0-9]+$/;
      if (!reg.test(value)) {
        callback(new Error("只能输入整数值"));
      } else {
        if (value < 1) {
          callback(new Error("点位数不能为0"));
        } else {
          callback();
        }
      }
    };
    let validateCale = (rule, value, callback) => {
      let reg = /^\d+(\.\d+)?$/;
      if (value !== "" && !reg.test(value)) {
        callback(new Error("只能输入数字"));
      } else {
        if (value < 0 || value > 100) {
          callback(new Error("只能输入数字(0-100)"));
        } else {
          callback();
        }
      }
    };
    return {
      FAInfo: {},
      //导入草稿箱子的数据
      importDraftsList: [],
      importDraftsType: 1,
      importDraftsConfig: {},
      //搜索旁投放面数
      planAdsCnt: 1,
      isDialogImport: false,
      handleTime: "", //上传时间
      isSelectPoint: false, //是否展示点位选择弹窗
      // 导空点是否展示半年json下载(全国媒介或全国销售有权限下载)
      isShowHalfYear: false,
      doUpload: "/addsp/proposal/importResExcel",
      // 空位导出url
      downUrl: "",
      // 是否显示空位导出弹出框
      showEmpty: false,
      showEmptyPoint: false,
      dateType: "1",
      emptyRange: [],
      active: 1, // 当前步骤step
      mapADDialog: false,
      loading: true, //加载中
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      selectedOptions: [],
      cityOther: false, // 判断是否可选择全国城市
      isBD: true, // 判断登录用户是否为销售
      // username: '',               // 获取登录用户的userName
      recType: 1, // step2  1:社区 2:写字楼
      mediaType: "广告门", // 媒体类型 广告门、道闸
      shopXY: { x: "", y: "" }, // 动画起始坐标
      shoppingShow: false, //动画效果的显示隐藏
      selectAll: false, // 是否全选
      bodyWidth: 1920,
      city: [], // step2 城市
      area: [], // step2城市下属区域
      activeIndex: 0, //step2当前选中的城市下标
      activeRName: "", //step2当前选中的城市名称
      areaName: "全市", // step2当前选中的区域
      areaRid: "", // step2当前选中的区域rid
      remark: "无", //备注
      customer: [], // step1公司客户
      companyName: [], //step1公司名称
      cName: "", // 选中公司名称
      companyBrand: [], //step1公司品牌
      cBand: "", // 选中的品牌
      adcID: [], //step1联系人
      //step1投放城市
      throwCity: [],
      //购物车
      dialogTableVisible: false,
      //选中
      checkAB: true,
      //搜索类型
      typeSelect: [
        {
          value: "资源名称",
          label: "资源名称",
        },
        {
          value: "商圈",
          label: "商圈",
        },
      ],
      //默认
      selectValue: "资源名称",
      //楼盘类型
      buildType: [
        { buildlabel: "高端住宅", buildValue: "高端住宅" },
        { buildlabel: "普通住宅", buildValue: "普通住宅" },
        { buildlabel: "单体楼", buildValue: "单体楼" },
        { buildlabel: "别墅", buildValue: "别墅" },
        { buildlabel: "洋房", buildValue: "洋房" },
        { buildlabel: "商住或商用", buildValue: "商住或商用" },
        { buildlabel: "公共场所", buildValue: "公共场所" },
      ],
      village: [
        // 社区
        { buildlabel: "高端住宅", buildValue: "高端住宅" },
        { buildlabel: "普通住宅", buildValue: "普通住宅" },
        { buildlabel: "单体楼", buildValue: "单体楼" },
        { buildlabel: "别墅", buildValue: "别墅" },
        { buildlabel: "洋房", buildValue: "洋房" },
        { buildlabel: "商住或商用", buildValue: "商住或商用" },
        { buildlabel: "公共场所", buildValue: "公共场所" },
      ],
      officeBuilding: [
        // 写字楼类型
        { buildValue: "单纯性写字楼", buildlabel: "单纯性写字楼" },
        { buildValue: "商住型写字楼", buildlabel: "商住型写字楼" },
        { buildValue: "综合型写字楼", buildlabel: "综合型写字楼" },
        { buildValue: "工业园区", buildlabel: "工业园区" },
      ],
      buildValue: "",
      //搜索框
      searchInput: "",
      planSelect: "",
      mState: "", // 媒体状态
      activeGrade: "", // 媒体等级
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now();
        },
      },
      emptyPointPickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now() - 1000 * 3600 * 24;
        },
      },
      dateInput: [], // 时间输入框
      beforeDate: [], // 时间输入框的前一次时间
      //setp1创建方案表单
      planForm: {
        planName: "",
        ownerSales: "", // 所属销售
        companyName: "",
        companyBrand: "",
        throwCity: [],
        adcID: "", // 所属联系人
        planRemark: "",
        pointOfAsrIDs: [], // 点位所属公司id组合，根据城市联动
        customerBudget: "",
        customerDemand: "",
      },
      pointOfAsrIDs: [],
      // 媒介选择所属销售列表
      salerList: [],
      // 获取销售选项loading
      salerListLoading: false,
      //
      industryID: "", // 所选公司所在的行业
      planRules: {
        planName: [
          { validator: validateName, trigger: "blur" },
          {
            required: true,
            type: "string",
            message: "方案名称不能为空",
            trigger: "blur",
          },
          { max: 30, message: "最多只能输入30个字节", trigger: "blur" },
        ],
        adcID: [{ required: true, message: "请选择联系人", trigger: "change" }],
        ownerSales: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { validator: validateSales, trigger: "blur" },
        ],
        companyName: [
          { required: true, message: "请选择公司名称", trigger: "change" },
        ],
        companyBrand: [
          { required: true, message: "请选择公司品牌", trigger: "change" },
        ],
        throwCity: [
          {
            required: true,
            message: "请选择投放城市(可多选)",
            trigger: "change",
          },
        ],
        pointOfAsrIDs: [
          {
            required: true,
            message: "请选择归属公司(可多选)",
            trigger: "blur",
          },
        ],
        //客户预算
        customerBudget: [{ validator: validateBudget, trigger: "blur" }],
        //客户要求
        customerDemand: [
          // {validator: validateRequst, trigger: 'blur'},
          { max: 200, message: "字数不能超过200字", trigger: "blur" },
        ],
      },
      shopingList: [], // step2购物车列表
      // 购物车展示的数据
      typeShopList: [],
      activeName: 1,
      // 事件选择
      eventType: "",
      eventList: [],
      // 购物车表格数据
      shopShowList: [],
      planList: [], //step2可选点位列表
      IsAll: false, //当前是否为全选状态
      sessionData: "", // 登录用户的数据
      FAData: { apID: "" }, // 创建方后台返回的数据
      timeout: null,
      BDData: { uid: "0", realName: "", saleManageLevel: 0 },
      HSearch: "", // 获取传值显示‘清除’、‘确定’按钮
      houseNum: ["", ""], // 表头搜索住户数量
      buildNum: ["", ""], // 表头搜索楼栋数量
      buildPrice: ["", ""], // 表头搜索楼盘价格
      liveYear: ["", ""], // 表头搜索入住年份
      peopleFlow: ["", ""], // 表头搜索人流量
      carFlow: ["", ""], // 表头搜索车位数
      parkSpaceNum: ["", ""], // 表头搜索车流量
      filterData: {
        // 记录判断含有哪些表头的过滤条件
        hNum: false,
        bNum: false,
        bPrice: false,
        lYear: false,
        pFlow: false,
        cFlow: false,
        pSNum: false,
      },
      loadSign: true, // table滚轮
      shopMedia_ADNum: {
        total: 0,
        oneNum: 0,
        twoNum: 0,
        threeNum: 0,
        moreNum: 0,
      },
      ADloading: "", // 创建方案、提交选点和报价单时的loading
      activeCityData: {}, // 城市切换的数据，默认为this.city[0]
      loadScroll: true, // 搜索后不执行滚动加载
      dateTime: "", // 获取今天日期
      ADLimit: [
        // step2 广告限制
        { value: "地产", label: "地产" },
      ],
      limitName: "全部", // 当前广告限制高亮，默认为全部
      limitList: [], // 当前选择的广告限制
      filterCondition: [], // 当前过滤条件
      commentMediaADNum: [], // 统计同一城市相同因不同排期而选择相同的asid
      mapADList: [], // 地图选择的点位数据
      mapParams: {}, // 记录当前地图选点时的参数，包括排期、城市名和rid
      mapBtn: true, // 获取地图选点数据的按钮，默认不可点击
      getMapLoading: "", // 获取地图选点时的loading
      importType: "",
      isShowTag: true,
      // 当前上传文件的数据- 表格
      fileData: [],
      // 导入excel之后返回的失败成功点数
      excelObj: {
        successNum: 0,
        failNum: 0,
      },
      // excel导入返回来的数据
      importInfoData: {},
      // 导入excel之后返回的数组
      excelDataUpload: [],
      // 复制方案
      isCopy: false,
      // 搜索方案时的loading
      loadingOrder: false,
      // 搜索方案名称
      orderName: "",
      // 返回的订单列表
      orderArr: [],
      apAicode: "", // 方案的协同aicode
      shareADUrl: "", // 协同选点的url https://beta.qinlinad.com/shareADList?apid=649&aicode=0DDD2685D9D3842ECB0DDC45D79D2131
      isOccupied: true, // 被占搜索时隐藏过滤条件
      pageNum: 1, // 页码
      totalPage: 1, // 总页数
      pageSize: 20, //每页条数
      getAdsParamsData: {}, //　获取点位列表的参数data
      apMinTime: "", // 方案创建的开始时间
      ADLimitActiveName: "1",
      isShowAll: false, // 控制表头显示时的过渡效果
      searchBtnAbled: false, // 搜索按钮禁止
      isCityPrice: false, // 判断城市最大价格是否大于2000w
      connectAdDialogVisible: false, // 连排门模态框
      saleManageLevel: 0, // 销售权限 0地方销售 1全国销售
      asrIDList: [], // 已选点位里存在的公司及城市
      indexData: "", // 首页来源的数据-前置地图选点
      unfinishedData: "", // 未完成方案信息
      /*方案排斥*/
      activeSelect: "1", //
      rejectAdPlan: [], // 排斥方案选项
      activeAdPlan: "", // 当前选择的方案
      isSelect: false, // 判断是否已经选择过点位
      // 方案是否创建中，防多次点击创建-节流
      creating: false,
      ActiveMapType: 2,
      // 亲邻地图
      mapAdsList: [],
      currPageAsLength: 0, //当前页面可选的点位总数
      currPageSelect: 0, //当前页面已选择的点位数
      total: 0, //总可选点位
      // 定制权限
      customPermission: {},
      pullMap: false,
    };
  },
  mounted() {
    this.getsessionData(); // 获取session中的数据
    this.FanganInfoByApid(); //获取选点排期数据
    this.getADLimit(); // 获取广告限制列表
    // 设置购物车动画起点位置
    this.setShopAnimate();
  },
  computed: {
    nowPointNum() {
      return this.shopingList.length;
    },
  },
  watch: {
    "planForm.throwCity": {
      handler: function () {
        this.planForm.pointOfAsrIDs = [];
        this.pointOfAsrIDs = [];
        if (this.planForm.throwCity.length == 0) return;
        this.getPointOfAsr();
      },
    },
    nowPointNum(val) {
      if (val >= 0 && this.FAInfo.apID) {
        this.changeApInfo();
        // this.computeMedia_AD();
      }
    },
  },
  methods: {
    //投放面数限制
    planAdsCntChange(value) {
      let reg = /^\d{1,}$/;
      let boolean = reg.test(value);
      if (!boolean) {
        sessFun.messageFun("warning", "计划面数仅能输入正整数");
        this.planAdsCnt = 1;
      }
    },
    //获取新业务逻辑数据
    getPlanResList() {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apID: this.FAInfo.apID,
      };
      // this.clearDrafts();
      api.getApi("/addsp/proposal/getAdBackUp", params).then((res) => {
        console.log("获取已选小区数据", res);
        //TODO:没有设置第0步的数据
        if (res.data.SysCode === 200200) {
          this.loading = false;
          if (res.data.data.resList.length) {
            // this.clearDrafts();
            res.data.data.resList.forEach((item) => {
              item.checkBox = false;
              item.city = item.cityName;
            });
            this.handleImportDrafts(1, res.data.data.resList);

            this.shopingList = res.data.data.resList;
          }
        } else {
          sessFun.messageFun("warning", "获取失败");
        }
      });
    },
    // 时间格式规范
    formatTime(val) {
      return timeFormat.toDate(val, "/");
    },
    // 根据编辑方案的apid获取该方案的详情
    FanganInfoByApid() {
      this.dialogVisible();
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apid: sessionStorage.getItem("plan_apid"),
      };
      api
        .getApi(this.apiVar.Advertisement + "/GetFanganInfo", params)
        .then((res) => {
          console.log("方案详情", res.data);
          if (res.data.SysCode == 200200) {
            this.FAInfo = res.data.data;
            this.getPlanResList();
            this.planName = this.FAInfo.apName;
            this.cName = this.FAInfo.cName;
            this.cBand = this.FAInfo.bTitle;
            this.industryID = this.FAInfo.piID;
            this.BDData.uid = this.FAInfo.suID || "";
            this.BDData.asrIDs = this.FAInfo.asrIDs || "";
            this.setCityAndArea(this.FAInfo.cityList);
            this.getAdsParamsData = {
              prID: this.city[0].rid,
              // rid: "440100",
              act: 1,
              dateTimeBegin: this.dateInput[0],
              dateTimeEnd: this.dateInput[1],
              resType: this.recType,
              mVehicle: this.mediaType,
              pageNo: this.pageNo,
              pageSize: this.pageSize,
            };
            this.getAdList(); // 获取选点列表
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        });
    },
    //清空草稿箱缓存
    clearDrafts() {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
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

    //购物车清空购物车
    clearShop() {
      if (this.shopingList.length > 0) {
        this.$confirm("此操作将删除已选的所有数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.handleImportDrafts(0, this.shopingList);
            this.shopingList = [];
            this.allCheckboxUpdata();
            sessFun.messageFun("success", "删除成功");
            this.resetPlanList(); // 重置planList的勾选
          })
          .catch(() => {
            sessFun.messageFun("info", "已取消删除");
          });
      } else {
        sessFun.messageFun("warning", "无数据可删除");
      }
    },
    //在购物车里删除行，改变总表前面的check
    //TODO:在购物车里删除行
    changeCheck(rows) {
      this.handleImportDrafts(0, [rows]);
      console.log("rows: ", rows);
      if (this.planList.length > 0 && rows.city === this.planList[0].city) {
        for (let i = 0; i < this.planList.length; i++) {
          if (rows.resID === this.planList[i].resID) {
            this.planList[i].checkBox = false;
          }
        }
      }
      for (let j = 0; j < this.shopingList.length; j++) {
        if (
          this.shopingList[j].resID === rows.resID &&
          this.shopingList[j].schedule === rows.schedule
        ) {
          this.shopingList.splice(j, 1);
          break;
        }
      }
      this.allCheckboxUpdata();
    },

    //导入表格，点击确定放入购物车后的处理函数
    handleSkipAndAdd(successList) {
      console.log("点击添加到购物车后页面变更");
      // //将导入表格组件中传递出来的成功数据放入购物车
      successList = this.setShopDataByImport(successList);
      this.handleImportDrafts(1, successList);
      this.shopingList.push(...successList);
      this.computeMedia_AD(); //统计购物车里选择小区的面数个数
      this.judgeByselect(); //导入购物车中的数据与已有列表是否重复

      // this.AddShopingInfo(row, "A"); // 添加到购物车
    },
    //导入表格选点
    automaticSelectPoint() {
      this.isSelectPoint = false;
      this.isDialogImport = true;
    },
    // 分页
    changePage(val) {
      // console.log('当前页',val)
      this.currPageSelect = 0;
      this.IsAll = false;
      this.pageNum = val;
      this.getAdsParamsData.pageNum = this.pageNum;
      this.getAdList();
    },
    // 每页条数切换
    sizeChange(val) {
      this.IsAll = false;
      this.pageSize = val;
      this.pageNum = 1;
      this.getAdsParamsData.pageNum = this.pageNum;
      this.getAdsParamsData.pageSize = this.pageSize;
      this.getAdList();
    },
    // 获取浏览器session数据
    getsessionData() {
      this.sessionData = sessFun.getSess();
      this.customPermission = this.sessionData.customPermission;
      if (this.sessionData.uType === "BD") {
        this.BDData.realName = this.sessionData.username; //sessionStorage.getItem('username')
        this.planForm.ownerSales = this.BDData.realName;
        this.BDData.uid = this.sessionData.uID;
        this.saleManageLevel = this.sessionData.saleManageLevel;
        this.isBD = true;
      } else {
        this.isBD = false;
      }
      let starTime, endTime;
      this.dateTime = timeFormat.returnDayCount(0, "/");
      starTime = timeFormat.returnDayCount(1, "/");
      endTime = timeFormat.returnDayCount(14, "/");
      this.dateInput = [starTime, endTime]; // 设置默认时间
      this.beforeDate = [starTime, endTime];
    },
    // 动态设置购物车动画起点位置
    setShopAnimate() {
      // 注：window.onresize只能在项目内触发1次
      let that = this;
      // 实时监控body的宽带。注：修改该方法后要重启项目并重新打开页面
      window.onresize = function windowResize() {
        // 通过捕获系统的onresize事件触发我们需要执行的事件
        that.bodyWidth = document.body.offsetWidth;
        that.shopXY.x = that.bodyWidth - 170;
        shopAnimate.style.right = that.shopXY.x + "px";
      };
      let Right = document.body.offsetWidth - 835;
      this.shopXY.x = Right;
      let shopAnimate = document.getElementsByClassName("shopAnimate")[0];
      shopAnimate.style.right = this.shopXY.x + "px";
    },
    // 跳转来源于首页地图选点-设置部分默认数据
    // TODO跳转来源于首页地图选点-设置部分默认数据
    setDataByIndex() {
      this.indexData = JSON.parse(sessionStorage.getItem("indexData"));
      this.ActiveMapType = this.indexData.activeMapType;
      // this.mapADList = this.indexData.mapADList
      this.dialogTableVisible = true;
      if (this.saleManageLevel == 1) {
        this.selectedOptions = [
          this.indexData.rid.toString().substring(0, 4) + "00",
          this.indexData.rid,
        ];
        this.throwCity.push({
          value: this.indexData.rid,
          label: this.indexData.city,
        });
        this.dynamicTags.push(this.indexData.city);
      } else {
      }
      this.planForm.throwCity.push(this.indexData.rid);
    },
    // 根据方案详情的rIDs，例如: "广州市,深圳市",构建城市区域
    setCityAndArea(cityArr=[]) {
      let cityList = [];
      for (let j = 0; j < cityArr.length; j++) {
        cityList.push({
          rName: cityArr[j].rName,
          rid: cityArr[j].rID,
        });
      }
      this.city = cityList;
      this.city.sort(this.compareFun); // 排序
      this.activeCityData = this.city[0]; // 设置默认显示可选点城市的信息
      this.activeRName = this.activeCityData.rName;
      let areaList = [];
      for (let j = 0; j < cityList.length; j++) {
        let area_Arr = areaArr.findArea(cityList[j].rid);
        area_Arr.unshift({ rid: cityList[j].rid, rName: "全市" });
        areaList.push(area_Arr);
      }
      this.area = areaList;
    },
    // 获取所选权限城市下的点位所属公司
    getPointOfAsr() {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        suID: this.BDData.uid,
        cityIds: this.planForm.throwCity.join(","),
      };
      api
        .getApi(this.apiVar.Advertisement + "/GetCityAscrList", params)
        .then((res) => {
          if (res.data.SysCode === 200200) {
            this.pointOfAsrIDs = res.data.data;
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        });
    },
    // 下一步
    next() {
      if (this.active === 0) {
      } else if (this.active === 1) {
        // 防多次点击创建
        if (!this.creating) {
          this.creating = true;
          let timer = setTimeout(() => {
            this.creating = false;
            this.ADloading = this.$loading({
              lock: true,
              text: "加急创建中...",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)",
            });
            this.getBand(); // 获取公司品牌
            this.creatAdPlan(); // 创建方案
            clearTimeout(timer);
          }, 500);
        }
      }
      if (this.active > 2) {
        this.active = 1;
      }
    },
    // 确认导出空位
    downEmptyPoint() {
      if (this.dateType == "1") {
        this.exportExcelData();
      } else {
        if (this.emptyRange.length) {
          this.dateRangeEmpty();
        } else {
          sessFun.messageFun("warning", "请先选择日期");
        }
      }
    },
    // 导出时间段的空位
    dateRangeEmpty() {
      let loadingPoint = this.$loading({
        lock: true,
        text: "玩命加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let rid = this.planForm.throwCity.join(",");
      console.log(this.emptyRange, rid);
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        rIDs: rid,
        startTime: this.emptyRange[0],
        endTime: this.emptyRange[1],
        asrIDs: this.planForm.pointOfAsrIDs.join(","),
      };
      api
        .postApi(this.apiVar.Advertisement + "/ExportSpareRes", info)
        .then((res) => {
          // console.log(res.data);
          if (!res.data.SysCode) {
            if (res.data.length) {
              let returnobj = this.formatData(res.data);
              let head = [
                "省份",
                "城市",
                "区域",
                "资源名称",
                "商圈",
                "地址",
                "媒介载体",
                "楼栋数量",
                "住户数量",
                "楼盘价格",
                "楼盘类型",
                "入住时间",
                "车流量",
                "车位数",
                "人流量",
                "广告限制",
                "点位备注",
                "媒体数量(面)",
              ];
              let customPermission = JSON.parse(
                sessionStorage.getItem("session_data")
              ).customPermission;
              if (
                (this.sessionData.uType == "MD" &&
                  this.sessionData.mediaManageLevel == 1) ||
                (this.sessionData.uType == "BD" &&
                  this.sessionData.saleManageLevel == 2)
              ) {
                head.push("归属公司");
              }
              switch (customPermission.patrolPermission) {
                case 1:
                  head.push("巡点问题", "通行情况");
                  break;
                case 2:
                  head.push("巡点问题", "通行情况", "通电情况");
                  break;
              }
              let allHead = head.concat([info.startTime + "-" + info.endTime]);
              let filename =
                returnobj.city.join("-") +
                "-" +
                info.startTime +
                "~" +
                info.endTime +
                "空位表";
              sheetExcel.toDownload(allHead, returnobj.arr, filename);
            } else {
              sessFun.messageFun("warning", "此城市没有点位");
            }
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
          loadingPoint.close();
        })
        .catch((err) => {
          console.log(err);
          loadingPoint.close();
        });
    },
    // 导出空点格式化数据
    formatData(arr) {
      let returnObj = {
        city: [],
        arr: "",
      };
      let result = [];
      for (let data of arr) {
        let resObj = {
          sheetName: this.getCityName(data.rID),
          showList: [],
        };
        returnObj.city.push(resObj.sheetName);
        let dataArr = data.adDoor.concat(data.barrier);
        for (let item of dataArr) {
          let obj = {
            province: item.prName || "--",
            city: item.crName || "--",
            rName: item.rName || "--",
            resName: item.resName || "--",
            tradingArea: item.tradingArea || "--",
            resAddress: item.resAddress || "--",
            mVehicle: item.mVehicle,
            fNum: item.fNum || "--",
            hNum: item.hNum || "--",
            hPrice: item.hPrice / 100,
            cType: item.cType || "--",
            chDay: item.chDay || "--",
            carFlow: item.carFlow || "--",
            parkSpaceNum: item.parkSpaceNum || "--",
            peopleFlow: item.peopleFlow || "--",
            notPush: item.allNotPush || "--",
            remark: item.allremark || "--",
            adsNum: item.adsNum || 0,
          };
          let customPermission = JSON.parse(
            sessionStorage.getItem("session_data")
          ).customPermission;
          if (
            (this.sessionData.uType == "MD" &&
              this.sessionData.mediaManageLevel == 1) ||
            (this.sessionData.uType == "BD" &&
              this.sessionData.saleManageLevel == 2)
          ) {
            obj.asNames = item.asNames;
          }
          // 巡点定制
          if (customPermission) {
            switch (customPermission.patrolPermission) {
              case 1:
                obj.allRemark = item.allRemark;
                obj.allTrafficState = item.allTrafficState;
                break;
              case 2:
                obj.allRemark = item.allRemark;
                obj.allTrafficState = item.allTrafficState;
                obj.allElectrifyState = item.allElectrifyState;
                break;
            }
          }
          obj[this.emptyRange[0] + "-" + this.emptyRange[1]] =
            item.DateInfo.adsNum || 0;
          resObj.showList.push(obj);
        }
        result.push(resObj);
      }
      returnObj.arr = result;
      return returnObj;
    },
    // 获取城市中文名称
    getCityName(rid) {
      let str = "";
      for (let data of this.throwCity) {
        if (data.value == rid) {
          str = data.label;
          break;
        }
      }
      return str;
    },
    // 导出空位表
    exportEmpty() {
      if (this.planForm.throwCity.length) {
        this.showEmptyPoint = true;
      } else {
        sessFun.messageFun("warning", "请先选择投放城市");
      }
    },
    // 导出空点导出次数接口
    postDownLoadNum(type) {
      let data = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        type,
      };
      api
        .postApi(this.apiVar.Advertisement + "/AddExportLog", data)
        .then((res) => {
          console.log(res);
        });
    },
    /*step1*/
    // 导出数据
    exportExcelData: function () {
      this.postDownLoadNum(0);
      // this.planForm.throwCity = [110100, 440100];
      if (this.planForm.throwCity.length) {
        let loadingPoint = this.$loading({
          lock: true,
          text: "玩命加载中...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        let dateArr = [];
        let self = this;
        let request_times = self.planForm.throwCity.length; //计算分几次请求
        let funcs = []; //Promise.all要用到的参数, 存放每次请求的Promise对象

        for (let i = 0; i < request_times; i++) {
          // 循环请求次数，构造请求的Promise对象并插入funcs数组
          let func = new Promise((resolve, reject) => {
            //定义Promise并处理请求逻辑
            let data = [];
            api
              .getApi(
                // this.apiVar.jsonLink + self.planForm.throwCity[i] + '.json'
                this.apiVar.Advertisement + "/ExportHalfYearSpaceRes",
                {
                  cityIds: self.planForm.throwCity[i],
                  asrIDs: this.planForm.pointOfAsrIDs.join(","),
                }
              )
              .then(function (response) {
                if (response.data.SysCode == 200200) {
                  let dataArr = response.data.data[0];
                  data.push(dataArr);
                  resolve(data);
                } else {
                  resolve("");
                }
              })
              .catch(function (error) {
                resolve("");
              });
          });
          funcs.push(func);
        }

        Promise.all(funcs).then((values) => {
          //使用Promise.all调用funcs里面的函数，并合并数据，最后给js-xlsx生成Excel
          let resultValus = [];
          for (let val of values) {
            if (val) {
              resultValus.push(val);
            }
          }
          if (resultValus.length) {
            let returnobj = self.hasPointData(resultValus);
            console.log("returnobj----", returnobj);
            let date = returnobj.date;
            let head = [
              "省份",
              "城市",
              "区域",
              "资源名称",
              "商圈",
              "地址",
              "媒介载体",
              "楼栋数量",
              "住户数量",
              "楼盘价格",
              "楼盘类型",
              "入住时间",
              "广告限制",
              "点位备注",
              "媒体数量(面)",
            ];
            let customPermission = JSON.parse(
              sessionStorage.getItem("session_data")
            ).customPermission;
            if (
              (this.sessionData.uType == "MD" &&
                this.sessionData.mediaManageLevel == 1) ||
              (this.sessionData.uType == "BD" &&
                this.sessionData.saleManageLevel == 2)
            ) {
              head.push("归属公司");
            }
            switch (customPermission.patrolPermission) {
              case 1:
                head.push("巡点问题", "通行情况");
                break;
              case 2:
                head.push("巡点问题", "通行情况", "通电情况");
                break;
            }
            let allHead = head.concat(date);
            let filename =
              returnobj.filename +
              "-" +
              date[0].substring(0, 10) +
              "~" +
              date[date.length - 1].substring(11) +
              "空位表";
            sheetExcel.toDownload(allHead, returnobj.arr, filename);
          } else {
            sessFun.messageFun("warning", "此城市没有点位");
          }
          loadingPoint.close();
        });
      } else {
        sessFun.messageFun("warning", "请先选择投放城市");
      }
    },
    // 处理数据
    hasPointData(arr) {
      let returnObj = {
        arr: "",
        date: "",
        filename: "",
      };
      let result = [];
      let allDateArr = [];
      let filenameArr = [];
      for (let data of arr) {
        if (data.length === 0 || data[0].length === 0) {
          continue;
        }
        let resObj = {
          sheetName: data[0][0].crName,
          showList: [],
        };
        filenameArr.push(resObj.sheetName);
        for (let k = 0, kLen = data.length; k < kLen; k++) {
          for (let item of data[k]) {
            let dateArr = [];
            let dataStr = [];
            let obj = {
              province: item.prName,
              city: item.crName,
              rName: item.rName,
              resName: item.resName,
              tradingArea: item.tradingArea,
              resAddress: item.resAddress,
              mVehicle: item.mVehicle,
              fNum: item.fNum,
              hNum: item.hNum,
              hPrice: item.hPrice / 100,
              cType: item.cType,
              chDay: item.chDay,
              notPush: item.allNotPush || "",
              remark: item.allremark || "",
              adsNum: item.adsNum,
            };
            if (
              (this.sessionData.uType == "MD" &&
                this.sessionData.mediaManageLevel == 1) ||
              (this.sessionData.uType == "BD" &&
                this.sessionData.saleManageLevel == 2)
            ) {
              obj.asNames = item.asNames;
            }
            let customPermission = JSON.parse(
              sessionStorage.getItem("session_data")
            ).customPermission;
            if (customPermission) {
              switch (customPermission.patrolPermission) {
                case 1:
                  obj.allRemark = item.allRemark;
                  obj.allTrafficState = item.allTrafficState;
                  break;
                case 2:
                  obj.allRemark = item.allRemark;
                  obj.allTrafficState = item.allTrafficState;
                  obj.allElectrifyState = item.allElectrifyState;
                  break;
              }
            }
            let showData = item.DateInfo.sort(this.sortDate);
            for (let date of showData) {
              dateArr.push(
                timeFormat.toDate(date.starDate, "/") +
                  "-" +
                  timeFormat.toDate(date.endDate, "/")
              );
              dataStr.push(date.adsNum);
            }
            let dateObj = this.concatObj(dateArr, dataStr);
            let resultObj = Object.assign(obj, dateObj);
            resObj.showList.push(obj);
            if (k >= kLen - 1) {
              allDateArr = dateArr;
            }
          }
        }
        result.push(resObj);
      }
      returnObj = {
        arr: result,
        date: allDateArr,
        filename: filenameArr.join("-"),
      };
      return returnObj;
    },
    // 键转换为值
    concatObj(dateArr, dataStr) {
      let obj = {};
      for (let dateI = 0, dateLen = dateArr.length; dateI < dateLen; dateI++) {
        obj[dateArr[dateI]] = dataStr[dateI];
      }
      return obj;
    },
    // 时间比较
    sortDate(a, b) {
      let aDate = timeFormat.toDate(a.starDate, "");
      let bDate = timeFormat.toDate(b.starDate, "");
      return aDate - bDate;
    },
    // 导入方案弹出框
    importFanan(type) {
      if (type == "res") {
        this.importType = "1";
        this.doUpload = "/addsp/proposal/importResExcel";
      }
      this.isDialogImport = true;
      this.fileData = [];
      this.importInfoData = {};
    },
    // 自定义上传
    uploadFile(params) {
      this.fileData = [];
      console.log(params);
      let fileObj = params.file;
      this.fileData.push(fileObj);
    },
    // 文件删除
    fileRemove(file, fileList) {
      console.log(file, fileList);
      this.fileData = fileList;
    },
    // 导入模版下载
    dowmLoadFun(event) {
      // 阻止冒泡事件
      event.stopPropagation();
    },
    hideTag() {
      this.isShowTag = false;
    },
    // 确认上传
    submitUpload(importFileData) {
      if (importFileData.length) {
        let rids = this.planForm.throwCity.join(",");
        let sess = this.sessionData;
        let info = `?uid=${sess.uID}&token=${sess.token}&suID=${
          this.BDData.uid
        }&rIDs=${rids}&asrIDs=${this.planForm.pointOfAsrIDs.join(",")}`;
        let formData = new FormData();
        formData.append("file", importFileData[0].raw);
        this.resImport(formData, info);
      } else {
        sessFun.messageFun("warning", "请先上传文件");
      }
    },

    // 小区导入
    // TODO:小区导入
    resImport(formData, info) {
      let Loading = this.$loading({
        lock: true,
        text: "快马加鞭选点中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // 上传文件
      api
        .postApi_new(this.doUpload + info, formData)
        .then((res) => {
          console.log("res: ", res);
          if (res.data.SysCode == 200200) {
            let importInfo = res.data.data;
            console.log("importInfo: ", importInfo);
            this.importInfoData = importInfo;
            this.$refs.importexcel.dialogResult = true;
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
          Loading.close();
        })
        .catch((res) => {
          console.log(res);
          Loading.close();
        });
    },
    // 根据导入方案返回的数据,设置购物车所需要的数据格式
    setShopDataByImport(arr) {
      console.log("arr: ", arr);
      Message.success("成功导入" + arr.length + "条数据");
      setTimeout(() => {
        this.dialogTableVisible = true;
      }, 500);
      arr.forEach((item) => {
        item.checkBox = false;
        // item.city = this.city[this.activeIndex].rName;
        item.city = item.cityName;
      });

      return arr;
    },
    // 判断点位是否已存在购物车(同点位同排期去重、同点位排期交叉则合并、同点位排期联系则合并)
    isHaveDiffPush(obj) {
      console.log("obj----", obj, this.shopingList);
      let ADData = obj;
      let shopArr = this.shopingList;
      let sameMidArr = [];
      let resultArr = [];
      for (let k = 0, kLen = shopArr.length; k < shopArr.length; ) {
        if (ADData.resID === shopArr[k].resID) {
          sameMidArr.push(shopArr[k]);
          shopArr.splice(k, 1);
        } else {
          k++;
        }
      }
      console.log("sameMidArr-----1111", sameMidArr, this.shopingList, shopArr);
      for (let data of sameMidArr) {
        let ADScheArr = ADData.schedule.split("-");
        let shopScheArr = data.schedule.split("-");
        if (
          ADScheArr[0] < shopScheArr[0] &&
          shopScheArr[0] <= ADScheArr[1] &&
          ADScheArr[1] < shopScheArr[1]
        ) {
          // 左相交(购物车相交选点)
          ADData.schedule = ADScheArr[0] + "-" + shopScheArr[1];
        } else if (
          shopScheArr[0] <= ADScheArr[0] &&
          ADScheArr[1] <= shopScheArr[1]
        ) {
          ADData.schedule = shopScheArr[0] + "-" + shopScheArr[1];
          // 购物车包含选点
        } else if (
          shopScheArr[0] < ADScheArr[0] &&
          ADScheArr[0] <= shopScheArr[1] &&
          shopScheArr[1] < ADScheArr[1]
        ) {
          // 右相交(购物车相交选点)
          ADData.schedule = shopScheArr[0] + "-" + ADScheArr[1];
        } else if (
          ADScheArr[0] <= shopScheArr[0] &&
          shopScheArr[1] <= ADScheArr[1]
        ) {
          // 购物车被选点包含
          ADData.schedule = ADScheArr[0] + "-" + ADScheArr[1];
        } else {
          let timeArr = [
            ADScheArr[0],
            ADScheArr[1],
            shopScheArr[0],
            shopScheArr[1],
          ];
          timeArr.sort((a, b) => {
            return Date.parse(a) - Date.parse(b);
          });
          if (Date.parse(timeArr[2]) - Date.parse(timeArr[1]) == 86400000) {
            ADData.schedule = timeArr[0] + "-" + timeArr[3];
          } else {
            resultArr.push(data);
          }
        }
      }
      console.log("resultArr----ADData----", resultArr, ADData);
      resultArr.push(ADData);
      console.log("resultArr*****", resultArr, this.shopingList);
      this.shopingList = this.shopingList.concat(resultArr);
    },
    // 获取订单
    remoteGetOrder(query) {
      if (query !== "") {
        let sess = this.sessionData;
        let info = {
          uid: sess.uID,
          token: sess.token,
          apName: query,
          suId: this.BDData.uid,
          rIds: this.planForm.throwCity.join(","),
        };
        this.loadingOrder = true;
        api
          .getApi(this.apiVar.Advertisement + "/GetSaleAdPlan", info)
          .then((res) => {
            console.log(res.data);
            this.loadingOrder = false;
            if (res.data.SysCode == 200200) {
              this.orderArr = res.data.data.map((item) => {
                return {
                  label: item.apName,
                  value: item.apID,
                };
              });
            } else {
              sessFun.messageFun("warning", res.data.MSG);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.orderArr = [];
      }
    },
    //获取导出方案数据
    getPreExcelData() {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apID: this.FAData.apID,
      };
      return api.getApi("/addsp/proposal/getPlanResList", params);
    },
    // 第四步的导出方案
    async downLoadFanan() {
      let { data } = await this.getPreExcelData();
      let arr = this.excelData(data.data);
      let allHead = [
        "省份",
        "城市",
        "区域",
        "资源名称",
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
        "可投数量(面)",
        "计划投放数量(面)",
      ];

      sheetExcel.toDownload(allHead, arr, this.planName);
    },
    // 处理数据
    excelData(arr) {
      console.log("arrr------excelData", arr);
      let dateArr = [];
      let arr2 = [];
      //将得到的数据除去不需要的
      for (let item of arr) {
        let obj = {
          provinceName: item.provinceName,
          cityName: item.cityName,
          districtName: item.districtName,
          resName: item.resName,
          tradingArea: item.tradingArea,
          resAddress: item.resAddress,
          mVehicle: item.mVehicle,
          fNum: item.fNum,
          hNum: item.hNum,
          hPrice: item.hPrice,
          cType: item.cType,
          map: item.mapCenterName || "",
          chDay: item.chDay,
          parkSpaceNum: item.parkSpaceNum,
          carFlow: item.carFlow,
          peopleFlow: item.peopleFlow,
          notPush: item.notPush,
          actualMediaCnt: item.actualMediaCnt,
          actualAdsCnt: item.actualAdsCnt || "",
          planAdsCnt: item.planAdsCnt,
        };
        arr2.push(obj);
      }
      let obj = {
        sheetName: "小区列表",
        showList: arr2,
      };
      dateArr.push(obj);
      return dateArr;
    },
    // 导出空位
    downEmpty() {
      console.log("this.planForm.throwCity----", this.planForm.throwCity);
      if (this.planForm.throwCity.length) {
        let rID = this.planForm.throwCity.join(",");
        this.downUrl = window.location.origin + "/emptyPoint?rid=" + rID;
        console.log("downUrl-----", this.downUrl);
        this.showEmpty = true;
      } else {
        sessFun.messageFun("warning", "请先选择投放城市");
      }
    },
    // 复制空位导出链接
    copyUrlDown() {
      let Url = document.getElementById("shareDownUrl").innerText;
      console.log("url", Url);
      let oInput = document.createElement("input");
      oInput.value = Url;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.style.display = "none";
      sessFun.messageFun("success", "复制成功");
    },
    
    // 获取公司及品牌
    getBand() {
      for (let n = 0; n < this.companyName.length; n++) {
        if (this.companyName[n].value === this.planForm.companyName) {
          this.cName = this.companyName[n].label;
        }
      }
      for (let n = 0; n < this.companyBrand.length; n++) {
        if (this.companyBrand[n].value === this.planForm.companyBrand) {
          this.cBand = this.companyBrand[n].label;
        }
      }
    },
    // step2 获取广告限制列表
    getADLimit() {
      this.ADLimit = [];
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        service: "GetNotPush",
        data: {},
      };
      api.postApi_new(this.apiVar.Media, params).then((res) => {
        console.log("广告限制列表", res);
        if (res.data.SysCode === 200200) {
          let limit = res.data.data;
          let limitArr = [];
          for (let i = 0; i < limit.length; i++) {
            let limitObj = { value: limit[i].nTitle, label: limit[i].nTitle };
            limitArr.push(limitObj);
          }
          this.ADLimit = limitArr;
        }
      });
    },
    // 获取广告点位列表
    //按小区选点
    getAdList() {
      this.loading = true;
      this.getAdsParamsData.startDate = this.dateInput[0];
      this.getAdsParamsData.endDate = this.dateInput[1];
      this.getAdsParamsData.apName = this.planForm.planName;
      this.getAdsParamsData.asrIDs = this.planForm.pointOfAsrIDs.join(",");
      this.getAdsParamsData.suID = this.BDData.uid;
      this.getAdsParamsData.planAdsCnt = this.planAdsCnt ? this.planAdsCnt : 1;
      this.getAdsParamsData.pageNum = this.pageNum;

      //   startDate: this.dateInput[0], //开始时间  必填
      //   endDate: this.dateInput[1], //结束时间 必填
      //   suID: this.BDData.uid, //方案所属销售用户id 必填
      //   apName: this.planForm.planName, //意向方案名称 必填
      //   asrIDs: this.planForm.pointOfAsrIDs.join(","), //附属公司id拼接，逗号相隔
      //   pageNum: this.pageNum, //第几页
      //   pageSize: this.pageSize, //每页条数
      //   asrIDs:"", //附属公司id拼接，逗号相隔
      //   rID, //区域id
      //   resType, //资源类型
      //   mVehicle, //媒体类型
      //   pageNum, //第几页
      //   pageSize, //每页大小
      //   apID, //意向方案id，编辑的时候需要带

      for (let i in this.getAdsParamsData) {
        if (!this.getAdsParamsData[i]) {
          delete this.getAdsParamsData[i];
        }
      }
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        ...this.getAdsParamsData,
      };
      let timer = setTimeout(() => {
        // setTimeout 异步让table出现loading
        let url = this.apiVar.ResList;
        api.getApi(url, params).then((res) => {
          console.log("选点列表：", res);
          if (res.data.SysCode == 200200) {
            if (res.data.data) {
              let ADList = res.data.data;
              this.setTableDataADDoor(ADList);
              this.totalPage = res.data.totalPage;
              this.total = res.data.total;
              this.judgeByselect(); //判断购物车是否存在得到的数据
              this.searchBtnAbled = false;
            } else {
              this.planList = [];
            }
            this.loading = false;
          } else {
            sessFun.messageFun("warning", res.data.MSG);
            this.loading = false;
          }
          this.searchBtnAbled = false;
        });
        clearTimeout(timer);
      }, 0);
    },
    // 接口数据转成table
    setTableDataADDoor(ADSdata) {
      let i = 0;
      console.log("接口数据转成table当前时间", this.dateInput);
      this.planList = [];
      for (let key of ADSdata) {
        let adObj = {
          ...key,
          checkBox: false,
          city: this.city[this.activeIndex].rName,
        };
        this.planList.push(adObj);
        i++;
      }
      this.currPageAsLength = i;
      this.loadScroll = true;
    },
    setpageNumAndTableData() {
      this.loadScroll = false;
      this.IsAll = false;
      this.HSearch = "";
      this.pageNum = 1;
      this.planList = [];
    },
    //step2搜索按钮
    searchFun() {
      this.searchBtnAbled = true;
      console.log("this.planAdsCnt: ", this.planAdsCnt);
      console.log("搜索排期时间", this.dateInput);
      console.log("this.searchInput: ", this.searchInput);
      this.areaName = "全市";
      if (this.selectValue === "被占查询") {
        this.loadScroll = false;
      } else {
        this.loadScroll = true;
        this.isOccupied = true; //  || this.dateInput !== this.beforeDate
        if (this.searchInput !== "" && this.dateInput !== null) {
          this.setpageNumAndTableData();
          this.ResOriginSearch();
        } else if (
          this.searchInput === "" &&
          this.dateInput !== this.beforeDate &&
          this.dateInput !== null
        ) {
          this.setpageNumAndTableData();
          this.getAdList();
          this.beforeDate = this.dateInput;
        } else if (this.planAdsCnt) {
          this.setpageNumAndTableData();
          this.ResOriginSearch();
        } else if (!this.dateInput) {
          sessFun.messageFun("warning", "搜索时间不能为空");
          this.searchBtnAbled = false;
        } else {
          this.searchBtnAbled = false;
        }
      }
    },
    // 资源名称\商圈搜索typeSelect
    ResOriginSearch() {
      if (this.selectValue === "资源名称") {
        this.getAdsParamsData.resName = this.searchInput;
        this.getAdsParamsData.tradingArea = "";
        this.getAdsParamsData.assetTag = "";
      } else if (this.selectValue === "商圈") {
        this.getAdsParamsData.tradingArea = this.searchInput;
        this.getAdsParamsData.resName = "";
        this.getAdsParamsData.assetTag = "";
      } else if (this.selectValue === "资产编号") {
        this.getAdsParamsData.assetTag = this.searchInput;
        this.getAdsParamsData.tradingArea = "";
        this.getAdsParamsData.resName = "";
      }
      this.getAdList();
    },
    // 当搜索框为空的时候进行重置显示
    initData(val) {
      console.log("搜索框变化的值", val);
      if (!this.searchInput && this.selectValue !== "被占查询") {
        this.isOccupied = true;
        this.getAdsParamsData.tradingArea = "";
        this.getAdsParamsData.assetTag = "";
        this.getAdsParamsData.resName = "";
        this.setpageNumAndTableData();
        this.getAdList();
      }
    },
    // 设置地图选点参数
    setMapParams() {
      localStorage.removeItem("qinlinMapCode");
      this.ActiveMapType = 2;
      console.log("this.planAdsCnt: ", this.planAdsCnt);
      this.mapParams = {
        rid: this.activeCityData.rid,
        city: this.activeCityData.rName,
        ls: this.dateInput[0],
        le: this.dateInput[1],
        planAdsCnt: this.planAdsCnt ? this.planAdsCnt : 1,
        mVehicle: this.mediaType,
      };
      console.log("this.planAdsCnt: ", this.planAdsCnt);
      localStorage.setItem(
        "mapParams",
        JSON.stringify({
          rid: this.activeCityData.rid,
          ls: this.dateInput[0],
          le: this.dateInput[1],
          adSystemId: [this.industryID],
          suID: this.BDData.uid,
          asrIDs: this.planForm.pointOfAsrIDs,
          planAdsCnt: this.planAdsCnt ? this.planAdsCnt : 1,
          mVehicle: this.mediaType,
        })
      );
      let url = `${window.location.protocol}//${window.location.host}/ADResourceMap/chooseRes?flag=true&city=${this.mapParams.city}`;
      window.open(url);
      this.mapBtn = false;
      this.dialogVisible();
    },
    // step2, 资源类型切换
    activeRecType(num) {
      this.buildValue = "";
      this.getAdsParamsData.buildType = "";
      if (num == "1") {
        this.buildType = this.village;
      } else if (num == "2") {
        this.buildType = this.officeBuilding;
      }
      this.setpageNumAndTableData();
      this.recType = num;
      this.getAdsParamsData.resType = num;
      this.getAdList();
    },
    //媒体类型切换
    activeMediaType(mType) {
      console.log("媒体类型", mType);
      this.setpageNumAndTableData();
      this.mediaType = mType;
      this.getAdsParamsData.mVehicle = mType;
      this.getAdList();
    },
    // tab切换城市
    activeCity(item, index) {
      console.log("item", item, "index", index);
      this.activeIndex = index;
      this.activeRName = item.rName;
      this.activeCityData = item;
      this.areaName = "全市";
      // this.getAdsParamsData.area = "";
      this.getAdsParamsData.rID = "";
      this.getAdsParamsData.prID = this.city[index].rid;
      this.setpageNumAndTableData();
      this.getAdList();
    },
    //  stpe2, 切换区域
    activeArea(item) {
      console.log("item: ", item);
      this.areaName = item.rName;
      this.areaRid = item.rID;
      this.setpageNumAndTableData();
      if (this.areaName === "全市") {
        this.getAdsParamsData.rID = "";
      } else {
        this.getAdsParamsData.rID = item.rID;
      }
      this.getAdList();
    },
    // 选点表格头部过滤条件tab删除方法
    filterTagCloseFun(tab, index) {
      console.log("tab", tab, "index", index);
      if (tab.condition === "mstate") {
        // 媒体状态
        this.mState = "";
        this.getAdsParamsData.mState = "";
      } else if (tab.condition === "grade") {
        // 媒体等级
        this.activeGrade = "";
        this.getAdsParamsData.grade = "";
      } else if (tab.condition === "ADLimit") {
        // 广告限制
        this.limitList = [];
        this.getAdsParamsData.adLimit = "";
      } else if (tab.condition === "cType") {
        // 楼盘类型
        this.buildValue = "";
        this.getAdsParamsData.buildType = "";
      } else if (tab.condition === "houseNum") {
        // 住户数量
        this.houseNum[0] = "";
        this.houseNum[1] = "";
        this.filterData.hNum = false;
        this.getAdsParamsData.houseNumMin = "";
        this.getAdsParamsData.houseNumMax = "";
      } else if (tab.condition === "buildPrice") {
        // 楼盘价格
        this.buildPrice[0] = "";
        this.buildPrice[1] = "";
        this.filterData.bPrice = false;
        this.getAdsParamsData.hPriceMin = "";
        this.getAdsParamsData.hPriceMax = "";
      } else if (tab.condition === "liveYear") {
        // 入住年份
        this.liveYear[0] = "";
        this.liveYear[1] = "";
        this.filterData.lYear = false;
        this.getAdsParamsData.liveYearMin = "";
        this.getAdsParamsData.liveYearMax = "";
      } else if (tab.condition === "peopleFlow") {
        // 人流量
        this.peopleFlow[0] = "";
        this.peopleFlow[1] = "";
        this.filterData.pFlow = false;
        this.getAdsParamsData.peopleFlowMin = "";
        this.getAdsParamsData.peopleFlowMax = "";
      } else if (tab.condition === "carFlow") {
        // 车流量
        this.carFlow[0] = "";
        this.carFlow[1] = "";
        this.filterData.cFlow = false;
        this.getAdsParamsData.carFlowMin = "";
        this.getAdsParamsData.carFlowMax = "";
      } else if (tab.condition === "parkSpaceNum") {
        // 车位数
        this.parkSpaceNum[0] = "";
        this.parkSpaceNum[1] = "";
        this.filterData.pSNum = false;
        this.getAdsParamsData.parkSpaceNumMin = "";
        this.getAdsParamsData.parkSpaceNumMax = "";
      }
      this.filterCondition.splice(index, 1);
      this.setpageNumAndTableData();
      this.getAdList();
    },
    // 判断是否存在该条件的tag
    isHaveThisTag(letter, tagName) {
      console.log("letter", letter, "tagName", tagName);
      let isHave = false;
      for (let i in this.filterCondition) {
        if (this.filterCondition[i].condition === letter) {
          isHave = true;
          this.filterCondition[i].name = tagName;
          break;
        }
      }
      if (!isHave) {
        this.filterCondition.push({
          name: tagName,
          type: "info",
          condition: letter,
        });
      }
    },
    // 修改搜索中的媒体状态 filterCondition
    mStateChange(state) {
      if (this.selectValue !== "被占查询") {
        console.log("切换媒体状态", state, this.mState);
        let stateName = "";
        if (state === "1") {
          stateName = "正常";
        } else {
          stateName = "待安装";
        }
        this.isHaveThisTag("mstate", stateName);
        if (stateName !== "不限") {
          this.getAdsParamsData.mState = state;
        } else {
          this.getAdsParamsData.mState = "";
        }
        this.setpageNumAndTableData();
        this.getAdList();
      } else {
        sessFun.messageFun("warning", "被占查询状态下，无效切换!");
      }
    },
    // 广告限制切换
    activeADLimit(limit) {
      console.log("广告限制limit", limit); // 保险,恶俗医疗
      let limitText = limit.join(",");
      let stateName = "广告限制：" + limit.join("/");
      if (limit.length > 0) {
        this.isHaveThisTag("ADLimit", stateName);
      } else {
        for (let i in this.filterCondition) {
          if (this.filterCondition[i].condition === "ADLimit") {
            this.filterCondition.splice(i, 1);
            break;
          }
        }
      }
      this.getAdsParamsData.adLimit = limitText;
      this.setpageNumAndTableData();
      this.getAdList();
    },
    // 住户数量过滤
    tableHeaderFilter_h() {
      if (this.houseNum[0] == "" || this.houseNum[1] == "") {
        sessFun.messageFun("warning", "数据区间填写有误");
      } else {
        let tagName = "住户数量:" + this.houseNum[0] + "-" + this.houseNum[1];
        this.isHaveThisTag("houseNum", tagName);
        this.filterData.hNum = true;
        this.getAdsParamsData.houseNumMin = this.houseNum[0];
        this.getAdsParamsData.houseNumMax = this.houseNum[1];
        this.setpageNumAndTableData();
        this.getAdList();
      }
    },
    // 楼盘价格过滤
    tableHeaderFilter_p() {
      if (this.buildPrice[0] == "" || this.buildPrice[1] == "") {
        sessFun.messageFun("warning", "数据区间填写有误");
      } else {
        let tagName =
          "楼盘价格:" + this.buildPrice[0] + "-" + this.buildPrice[1];
        this.isHaveThisTag("buildPrice", tagName);
        this.filterData.bPrice = true;
        this.getAdsParamsData.hPriceMin = this.buildPrice[0] * 100;
        this.getAdsParamsData.hPriceMax = this.buildPrice[1] * 100;
        this.setpageNumAndTableData();
        this.getAdList();
      }
    },
    // 年份过滤
    tableHeaderFilterByLiveYear() {
      if (this.liveYear[0] == "" || this.liveYear[1] == "") {
        sessFun.messageFun("warning", "数据区间填写有误");
      } else {
        let tagName = "入住年份:" + this.liveYear[0] + "-" + this.liveYear[1];
        this.isHaveThisTag("liveYear", tagName);
        this.filterData.lYear = true;
        this.getAdsParamsData.liveYearMin = this.liveYear[0];
        this.getAdsParamsData.liveYearMax = this.liveYear[1];
        this.setpageNumAndTableData();
        this.getAdList();
      }
    },
    // 楼盘类型过滤
    tableHeaderFilter_cType(data) {
      console.log("楼盘类型过滤", data);
      this.isHaveThisTag("cType", data);
      if (data === "全部") {
        this.getAdsParamsData.buildType = "";
      } else {
        this.getAdsParamsData.buildType = this.buildValue;
      }
      this.setpageNumAndTableData();
      this.getAdList();
    },
    //人流量过滤
    tableHeaderFilterByPeopleFlow() {
      if (this.peopleFlow[0] == "" || this.peopleFlow[1] == "") {
        sessFun.messageFun("warning", "数据区间填写有误");
      } else {
        let tagName = "人流量:" + this.peopleFlow[0] + "-" + this.peopleFlow[1];
        this.isHaveThisTag("peopleFlow", tagName);
        this.filterData.pFlow = true;
        this.getAdsParamsData.peopleFlowMin = this.peopleFlow[0];
        this.getAdsParamsData.peopleFlowMax = this.peopleFlow[1];
        this.setpageNumAndTableData();
        this.getAdList();
      }
    },
    // 车流量过滤
    tableHeaderFilterByCarFlow() {
      if (this.carFlow[0] == "" || this.carFlow[1] == "") {
        sessFun.messageFun("warning", "数据区间填写有误");
      } else {
        let tagName = "车流量:" + this.carFlow[0] + "-" + this.carFlow[1];
        this.isHaveThisTag("carFlow", tagName);
        this.filterData.cFlow = true;
        this.getAdsParamsData.carFlowMin = this.carFlow[0];
        this.getAdsParamsData.carFlowMax = this.carFlow[1];
        this.setpageNumAndTableData();
        this.getAdList();
      }
    },
    // 车位数过滤
    tableHeaderFilterByParkSpaceNum() {
      if (this.parkSpaceNum[0] == "" || this.parkSpaceNum[1] == "") {
        sessFun.messageFun("warning", "数据区间填写有误");
      } else {
        let tagName =
          "车位数:" + this.parkSpaceNum[0] + "-" + this.parkSpaceNum[1];
        this.isHaveThisTag("parkSpaceNum", tagName);
        this.filterData.pSNum = true;
        this.getAdsParamsData.parkSpaceNumMin = this.parkSpaceNum[0];
        this.getAdsParamsData.parkSpaceNumMax = this.parkSpaceNum[1];
        this.setpageNumAndTableData();
        this.getAdList();
      }
    },
    emptyFun(letter) {
      // 清空
      if (letter === "H") {
        this.houseNum = ["", ""];
      } else if (letter === "B") {
        this.buildNum = ["", ""];
      } else if (letter === "P") {
        this.buildPrice = ["", ""];
      } else if (letter === "Y") {
        this.liveYear = ["", ""];
      } else if (letter === "PSN") {
        this.carFlow = ["", ""];
      } else if (letter === "CF") {
        this.parkSpaceNum = ["", ""];
      } else if (letter === "PF") {
        this.peopleFlow = ["", ""];
      }
    },
    // 根据购物车已有的mID对应AB面判断勾选
    judgeByselect() {
      console.log("judgeByselect");
      this.currPageSelect = 0;
      let shopingLength = this.shopingList.length;
      if (shopingLength > 0) {
        for (let i = 0; i < shopingLength; i++) {
          this.hadADByshop(this.shopingList[i]);
        }
        if (this.currPageSelect == this.currPageAsLength) {
          this.IsAll = true;
        } else {
          this.IsAll = false;
        }
      }
    },
    // planList的勾选
    hadADByshop(data) {
      let shopAD = data;
      if (this.activeRName === shopAD.city) {
        for (let key of this.planList) {
          if (
            key.resID === shopAD.resID &&
            this.crossschedule(shopAD.schedule)
          ) {
            key.checkBox = true;
            this.currPageSelect++;
            break;
          }
        }
      } else {
        console.log("不同城市");
      }
    },
    // 区选重置planList的勾选
    resetPlanList() {
      console.log("重置planList的勾选开始");
      for (let i = 0; i < this.planList.length; i++) {
        if (this.planList[i].checkBox) {
          console.log("有勾选");
          this.planList[i].checkBox = false;
        } else {
          console.log("无勾选");
        }
      }
      console.log("重置planList的勾选结束");
    },
    //点位有时间交叉
    // TODO:点位有时间交叉
    crossschedule(sche) {
      let scheArr = sche.split("-");
      if (this.dateInput[0] <= scheArr[0] && this.dateInput[1] >= scheArr[0]) {
        return true;
      } else if (
        this.dateInput[0] <= scheArr[1] &&
        this.dateInput[1] >= scheArr[1]
      ) {
        return true;
      } else {
        return false;
      }
    },
    // 表头全选
    //TODO:表头全选
    allCheckboxAds() {
      console.log("allCheckboxAds", this.IsAll);
      if (this.IsAll) {
        this.allSelectAdsBtn();
      } else {
        this.cancleSelectAds();
      }
    },
    // 表头勾选重置
    allCheckboxUpdata() {
      if (this.shopingList.length <= 0) {
        this.IsAll = false;
      } else {
        let isCheckBox = false;
        for (let key of this.planList) {
          if (key.checkBox) {
            isCheckBox = true;
            break;
          }
        }
        if (!isCheckBox) {
          this.IsAll = false;
        }
      }
    },
    // 全选表格点位
    allSelectAdsBtn() {
      console.log("全选");

      if (this.mediaType === "广告门") {
        this.allSelectToShop_adDoor();
      } else if (this.mediaType === "道闸") {
        this.allSelectToShop_roadGate();
      }
      this.shopShow_hide("all");
      // this.allSelectToShop(selection)
    },
    //取消全选
    //TODO取消全选
    cancleSelectAds() {
      console.log("取消全选", this.planList);
      let arr1 = []; //收集被删除的项
      let arr2 = [...this.shopingList]; //拷贝购物车
      for (let pkey of this.planList) {
        if (pkey.checkBox) {
          for (let i = 0; i < arr2.length; i++) {
            if (pkey.resID === arr2[i].resID) {
              arr1.push(...arr2.splice(i, 1));
              pkey.checkBox = false;
            }
          }
        }
      }
      this.handleImportDrafts(0, arr1);
      this.shopingList = arr2;
      this.currPageSelect = 0;
    },
    //获取mouseEnter屏幕时的坐标像素
    mouseEnter(row, column, cell, event) {
      let e = event || window.event;
      this.shopXY.y = e.clientY;
    },

    //新业务逻辑小区替代选AB面，勾选广告门的时候
    ChangeCommunity(row) {
      console.log("row: ", row);
      if (row.checkBox) {
        this.shopShow_hide(); // 动画效果
        this.handleImportDrafts(1, [row]);
        this.AddShopingInfo(row); // 添加到购物车
      } else {
        this.deleteShopRow(row);
      }
    },
    // 勾选道闸的时候
    changeBarrierGate(row) {
      console.log("row: ", row);
      if (row.checkBox) {
        // let obj = this.setShopingTable(row, "ABC");
        // let obj = this.setShopingTable(row);
        this.shopShow_hide();
        // this.shopingList.push(obj);
        this.handleImportDrafts(1, [row]);
        this.AddShopingInfo(row); // 添加到购物车
        // this.IsAll = true
      } else {
        this.handleImportDrafts(0, [row]);
        this.deleteShopRow(row);
      }
    },

    // 全选是放进购物车-广告门
    //TODO:全选
    allSelectToShop_adDoor() {
      let arr = [];
      for (let i = 0; i < this.planList.length; i++) {
        let info = this.planList[i];
        let selectInfo = this.setShopingTable(info);
        if (!info.checkBox) {
          info.checkBox = true;
          this.currPageSelect++;
          arr.push(selectInfo);
        }
      }
      this.handleImportDrafts(1, arr);
      this.shopingList.push(...arr);

      console.log("广告门全选时购物车", this.shopingList);
    },
    // 全选是放进购物车-道闸
    allSelectToShop_roadGate() {
      for (let pkey of this.planList) {
        if (!pkey.checkBox) {
          pkey.checkBox = true;
          // let selectInfo = this.setShopingTable(pkey, "ABC");
          let selectInfo = this.setShopingTable(pkey);
          this.shopingList.push(selectInfo);
        }
      }
      console.log("道闸全选时购物车", this.shopingList);
    },
    //TODO:取消勾时,删除购物车里对应的数据行
    deleteShopRow(row) {
      this.currPageSelect--;
      this.IsAll = false;
      let delArr = [];
      let copyArr = [...this.shopingList];
      for (let j = 0; j < copyArr.length; j++) {
        if (
          copyArr[j].resID === row.resID &&
          this.crossschedule(copyArr[j].schedule)
        ) {
          delArr.push(...copyArr.splice(j, 1));
          break;
        }
      }
      this.handleImportDrafts(0, delArr);
      this.shopingList = copyArr;
      this.allCheckboxUpdata();
    },
    // 购物车-获取地图选择的点位列表
    // TODO购物车-获取地图选择的点位列表
    getMapADList() {
      console.log("触发获取地图选点信息click");
      // 亲邻地图
      this.getMapLoading = this.$loading({
        lock: true,
        text: "数据获取中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let params = {
        asrIDs: this.FAInfo.asrIDs,
        suID: this.FAInfo.suID,
        apID: this.FAInfo.apID, //意向方案id
      };
      api
        .postApi_json(this.apiVar.mapApi + "/proposal/resListByUid", params)
        .then((res) => {
          if (res.data.SysCode === 200200) {
            this.mapAdsList = res.data.data;
            sessFun.messageFun(
              "success",
              `成功获取到${this.mapAdsList.length}条数据`
            );
            this.setMapAdsListInShopCar();
            // localStorage.removeItem("qinlinMapCode");
            this.mapBtn = true;
          } else {
            this.getMapLoading.close();
            sessFun.messageFun("warning", res.data.MSG || "数据获取异常");
          }
        })
        .catch((err) => {
          this.getMapLoading.close();
          sessFun.messageFun("warning", "数据接口异常");
        });
    },
    // 根据地图选点返回的数据，设置成购物车所需的数据格式（亲邻地图）
    setMapAdsListInShopCar() {
      let mapAdsList = this.mapAdsList.length ? this.mapAdsList : [];
      this.handleImportDrafts(1, mapAdsList);
      this.changeApInfo(true);
    },
    // 统计已选小区选n面个数
    computeMedia_AD() {
      this.shopMedia_ADNum.total = this.shopingList.length;
      this.shopMedia_ADNum.oneNum = this.getResAsidNum(1, this.shopingList);
      this.shopMedia_ADNum.twoNum = this.getResAsidNum(2, this.shopingList);
      this.shopMedia_ADNum.threeNum = this.getResAsidNum(3, this.shopingList);
      this.shopMedia_ADNum.moreNum =
        this.shopingList.length -
        this.shopMedia_ADNum.oneNum -
        this.shopMedia_ADNum.twoNum -
        this.shopMedia_ADNum.threeNum;
    },
    getResAsidNum(num, arr) {
      return arr.filter((item) => {
        return item.planAdsCnt == num;
      }).length;
    },
    // dialog购物筐的显示全选中后添加到购物车
    dialogVisible() {
      this.dialogTableVisible = true;
      this.computeMedia_AD();
    },
    // 添加到购物车
    AddShopingInfo(info) {
      console.log("选中的row信息", info);
      this.currPageSelect++;
      // let selectInfo = this.setShopingTable(info, letter);
      let selectInfo = this.setShopingTable(info);
      this.shopingList.push(selectInfo);
      console.log("this.shopingList: ", this.shopingList);
      if (this.currPageSelect == this.currPageAsLength) {
        this.IsAll = true;
      } else {
        this.IsAll = false;
      }
    },
    // 选点列表数据到购物车数据
    setShopingTable(info) {
      console.log("info: ", info);
      let selectInfo = info;
      return selectInfo;
    },
    //修改动画效果及显示隐藏
    shopShow_hide(all) {
      let R = this.shopXY.x;
      let T = this.shopXY.y;
      console.log("Right:", R, ",Top:", T);
      let shopAnimate = document.getElementsByClassName("shopAnimate")[0];
      let animateAll = document.getElementsByClassName("shopAnimateAll")[0];

      shopAnimate.style.top = this.shopXY.y + "px";
      shopAnimate.style.right = this.shopXY.x + "px";

      animateAll.style.top = this.shopXY.y + "px";
      animateAll.style.right = this.shopXY.x - 140 + "px";
      let that = this;
      if (all === "all") {
        this.selectAll = true;
        $(".shopAnimateAll").animate(
          {
            right: "37px",
            top: "77px",
            width: "18px",
            height: "18px",
          },
          700,
          function () {
            $(".shopAnimateAll").css({
              top: T,
              right: R,
              width: "790px",
              height: "386px",
            });
            that.selectAll = false;
          }
        );
      } else {
        this.shoppingShow = true;
        $(".shopAnimate").animate(
          {
            right: "37px",
            top: "77px",
            width: "18px",
            height: "18px",
          },
          700,
          function () {
            $(".shopAnimate").css({
              top: T,
              right: R,
              width: "650px",
              height: "49px",
            });
            that.shoppingShow = false;
          }
        );
      }
    },
    // 数组排序，城市rid从小到大排
    compareFun(obj1, obj2) {
      let val1 = obj1.rid;
      let val2 = obj2.rid;
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    },
    // 数组排序，城市区域按rid从小到大排
    compareArea(obj1, obj2) {
      let val1 = obj1[0].rID;
      let val2 = obj2[0].rID;
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    },
    // TODO:创建方案
    creatAdPlan() {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apID: this.FAInfo.apID,
      };
      api.postApi(this.apiVar.CreatePlan, params).then((res) => {
        console.log("creatAdPlancreatAdPlanres: ", res);
        if (res.data.SysCode == 200200) {
          sessionStorage.setItem("plan_apid", res.data.data.apID);
          this.FAData.apID = res.data.data.apID;
          if (res.data.data.errorResNames) {
            this.ADloading.close();
            sessFun.messageFun(
              "warning",
              "存在失败小区：" + res.data.data.errorResNames || ""
            );
            return;
          }
          // this.PushADBFun(res.data.Data);
          // this.CreateShareADSFun();
          this.active++;
          //清除草稿箱缓存
          this.clearDrafts();
          this.ADloading.close();
          // sessionStorage.setItem("cityArea", JSON.stringify(cityArea));
        } else {
          this.ADloading.close();
          sessFun.messageFun("warning", "失败");
        }
      });
    },
    //查看方案
    ToDetail() {
      this.$router.push("./planEmptyPointDetail");
    },
    // 继续创建
    continueCreate() {
      this.$router.push("./createPlan");
      // location.reload(false);
    },
    // 公用方法
    // 方案异常时，存储当前方案基本数据及购物车点位等临时信息
    handleImportDrafts(type, list) {
      this.importDraftsType = type;
      this.importDraftsList = [...list];
    },
    changeApInfo(pullMap) {
      if (this.pullMap === true) {
        this.pullMap = false;
        return;
      }
      this.importDraftsConfig.suID = this.BDData.uid;
      this.importDraftsConfig.type = this.importDraftsType;
      this.importDraftsConfig.resList = JSON.stringify(this.importDraftsList);
      for (let i in this.importDraftsConfig == "") {
        if (!this.importDraftsConfig[i]) {
          delete this.importDraftsConfig[i];
        }
      }
      let params = {
        apID: this.FAInfo.apID,
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        ...this.importDraftsConfig,
      };
      api.postApi(this.apiVar.CreateAdBackUp, params).then((res) => {
        console.log("res创建方案缓存", res);
        if (res.data.SysCode == 200200) {
          // 地图拉取时使用草稿箱进行全量填充
          if (pullMap) {
            let draftsData = res.data.data;
            draftsData.forEach((item) => {
              item.checkBox = false;
              item.city = item.cityName;
            });
            this.shopingList = draftsData;
            this.pullMap = true;
            if (this.getMapLoading) {
              this.getMapLoading.close();
            }
            this.dialogTableVisible = true;
            this.computeMedia_AD();
            this.judgeByselect();
          }
        } else {
          sessFun.messageFun("warning", res.data.MSG);
        }
      });
    },
    // 时间戳转换成日期格式 2018-06-18 10:33:24
    timestampToTime(timestamp) {
      let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = date.getDate() + " ";
      let h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      let m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":"; //date.getMinutes() + ':';
      let s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(); //date.getSeconds();
      return Y + M + D + h + m + s;
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
  // 页面销毁
  destroyed() {
    if (this.active == 1 || this.active == 2) {
      console.log("页面销毁----");
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
      };
      api
        .postApi(this.apiVar.Advertisement + "/AddCreatePlanLog", params)
        .then((res) => {
          console.log("上报成功-----", res);
        })
        .catch((err) => {
          console.log("上报失败-----", err);
        });
    }
  },
};
</script>

<style scoped lang="scss">
/deep/ .el-table__fixed,
/deep/ .el-table__fixed-right {
  height: 584px !important;
}

/deep/ .el-table__fixed-right {
  right: 6px !important;
}

/deep/ .selectAdsTable .el-table__empty-text {
  left: 25%;
}

/deep/ .selectAdsTable .el-table_1_column_1 {
  text-align: center;
}

/deep/ .el-loading-mask {
  z-index: 990;
}

/deep/ .el-step__main {
  height: 20px;
}

.adsTable {
  position: relative;
  margin-top: 5px;
  .adDoor,
  .roadGate {
    display: flex;
    // justify-content: space-between;
    justify-content: center; // 内容自适应：上下居中
    align-items: center; // 子项对齐方式：左右居中
  }
}

.myCheckbox {
  position: absolute;
  width: 100px;
  height: 54px;
  text-align: center;
  line-height: 54px;
  top: 0;
  left: 0;
  z-index: 99;
}

.button_row {
  margin-top: 12px;
}

/deep/ .el-form--inline .el-form-item {
  margin-right: 7px !important;
}

.row-table-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

/*购物车提示信息*/
.warningInfoColor {
  display: inline-block;
  height: 16px;
  width: 16px;
  border-radius: 4px;
  vertical-align: middle;
}

.warningInfo .warningInfoName {
  color: #333;
  font-size: 12px;
}

/*状态行*/
/deep/ .el-table .warning-row {
  background: rgba(255, 0, 0, 0.08);
}

/deep/ .el-table .warning-row-conncet {
  background: rgba(255, 199, 0, 0.1);
}

.shopList_adLimit {
  width: 132px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/deep/ .el-input__inner:hover {
  border-color: #dcdfe6;
}

/deep/ .el-select .el-input.is-focus .el-input__inner {
  border-color: #dcdfe6;
}

.inputNewTag /deep/ .el-input__inner {
  width: 140px !important;
}

.input-with-select /deep/ .el-input__inner {
  font-size: 14px;
  padding: 10px 10px;
  height: 34px;
  line-height: 14px;
}

/deep/ .el-input__inner {
  font-size: 14px;
  line-height: 14px;
  width: 300px;
  height: 34px;
}

.shopAnimate,
.shopAnimateAll {
  position: fixed;
  top: 574px;
  right: 170px;
  width: auto;
  height: auto;
  color: #fff;
  z-index: 1000;
}

/*面包屑导航*/
.ad_mediaMana_nav {
  position: relative;
  height: 0;
}

.ad_mediaMana_nav p {
  padding-left: 57px;
  position: absolute;
  left: 0;
  top: 12px;
  font-size: 14px;
  line-height: 18px;
}

.ad_mediaMana_nav p em {
  font-size: 14px;
  color: #d9d9d9;
  line-height: 18px;
}

.ad_mediaMana_nav p a {
  color: #666;
}

.ad_mediaMana_nav p a:nth-of-type(1) {
  color: #999;
}

.ad_mediaMana_wrap {
  margin-bottom: 145px;
  position: relative;
}

.mediaMana_content_top {
  padding: 42px 60px 0 60px;
}

.content_top_wrap,
.content_bottom_wrap {
  background: #ffffff;
  border: 1px solid #dedede;
  padding: 32px 18px;
}

.content_top_wrap .content_top_head {
  width: 100%;
  height: 35px;
  border-bottom: 1px solid #dedede;
}

.content_bottom_wrap .content_bottom_head {
  width: 100%;
  height: 35px;
  border-bottom: 1px solid #dedede;
}

.content_top_wrap .content_top_head h2,
.content_bottom_wrap .content_bottom_head h2 {
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: #2c313c;
  font-weight: bold;
  padding-left: 16px;
  height: 24px;

  margin-top: 8px;
}

.content_top_wrap .content_top_form_wrap,
.content_bottom_wrap .content_bottom_form_wrap {
  padding: 18px;
}

/*按钮*/
.content_bottom_btn {
  width: 100%;
  position: absolute;
  bottom: -100px;
  margin-bottom: 22px;
  text-align: center;
}

.content_bottom_btn button {
  width: 80px;
  height: 34px;
  outline: none;
  cursor: pointer;
}

.content_bottom_btn button.create {
  background: #108ee9;
  border-radius: 4px;
  font-size: 14px;
  border: none;
  color: #ffffff;
}

.content_bottom_btn button.cancel {
  background: #ffffff;
  font-size: 14px;
  color: #666666;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-left: 10px;
}

/*创建方案表单*/
/deep/ .el-form.demo-ruleForm {
  width: 416px;
  margin: 0 auto;
}

.el-input {
  width: 262px;
  height: 34px !important;
  border-radius: 4px;
}

/deep/ .el-textarea__inner {
  width: 260px;
  height: 80px;
  resize: vertical;
}
/deep/ textarea.el-textarea__inner {
  transform: translateY(-4px);
}

/*选择点位*/
/deep/ .type-select .el-input,
/deep/ .type-select .el-input__inner {
  width: 95px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  padding-right: 0;
}

/deep/ .type-select .el-input__inner {
  padding-left: 10px;
  color: rgb(144, 147, 153);
}

/*方案排斥*/
/deep/ .reject_select {
  left: -6px;
}

/deep/ .reject_select .el-input,
/deep/ .reject_select .el-input__inner {
  width: 185px;
  border-top-left-radius: 0;
}

/deep/ .date-select.el-input__inner {
  width: 260px;
  position: relative;
}

/*日期*/
/*日期控件*/
.block {
  display: inline-block;
  margin-left: 2px;
  position: relative;
}

/deep/ .el-date-editor .el-range__icon {
  position: relative;
  line-height: 26px;
  /* top: -3px; */
  margin-right: 2px;
}

/deep/ .el-range-separator {
  position: relative;
  top: -2px;
}

/deep/ .el-input__inner {
  width: 300px;
  height: 34px;
  line-height: 32px;
}

/deep/ .el-date-editor i,
/deep/ .el-date-editor input,
/deep/ .el-date-editor span {
  float: left;
  position: relative;
}

/deep/ .el-range-editor .el-range-input {
  line-height: 20px;
}

/deep/ .el-dialog__header {
  font-weight: 700;
}

/*step2 四个按钮*/
.importXle.el-button--success {
  background: #51e171;
  border-color: #51e171;
}

/deep/ .map.el-button--primary {
  background: #ff8f49;
  border-color: #ff8f49;
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

/deep/ .el-input-group--prepend .el-input__inner {
  width: 185px;
}

.content_bottom_btn /deep/ .el-button span a {
  color: #606266;
}

.search-wrap {
  position: relative;
  /*清除浮动*/
  overflow: hidden;
}

.search-wrap > div {
  float: left;
  margin-right: 7px;
  /*margin-bottom: 18px;*/
}

/*购物车图标*/
.shopcar {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  position: fixed;
  right: 29px;
  top: 75px;
  z-index: 998;
}

/deep/ .shopcar .el-badge__content.is-fixed {
  position: absolute;
  top: 10px;
  right: 25px;
}

.shopcar img {
  width: 59px;
  height: 59px;
  border-radius: 50%;
}

/*面板*/
.dw-panel {
  border: 1px solid #d8d8d8;
  /*margin-top: 30px;*/
  margin-top: 18px;
  padding: 0 18px 0 18px;
}

.dw-panel dl {
  border-bottom: 1px dashed #d8d8d8;
  line-height: 40px;
}

.dw-panel dt {
  display: inline-block;
  font-size: 14px;
  color: #999999;
  height: 40px;
}

.dw-panel .city-proper {
  padding-left: 75px;
  line-height: 34px;
}

.dw-panel dd {
  font-size: 14px;
  color: #666666;
  display: inline-block;
  line-height: 22px;
  padding: 3px 10px;
  cursor: pointer;
  margin-left: 6px;
}

.dw-panel dd.active {
  color: #1890ff;
  border: 1px solid #1890ff;
}

.dw-panel .other-dd {
  padding-left: 0px;
}

.otherSelect {
  /deep/ .el-input__inner {
    max-width: 135px;
    height: 30px;
    padding-left: 10px;
    color: #1890ff;
    border-radius: 0;
    overflow: hidden;
  }
  /deep/ .el-select__tags-text {
    display: inline-block;
    max-width: 30px;
    overflow: hidden;
    // text-overflow: ellipsis;
  }
  /deep/ .el-tag__close.el-icon-close {
    right: -5px;
    top: -5px;
  }
}

.adLimitSelect /deep/ .el-select__tags > span {
  width: 68px;
  height: 28px;
  overflow: hidden;
}

.otherSelect /deep/ .el-tag {
  background: #fff;
  color: #1890ff;
}

.otherSelect /deep/ .el-input__inner:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.otherSelectActive /deep/ .el-input__inner {
  border-color: #1890ff;
}

.otherSelectActive /deep/ .el-input .el-select__caret {
  color: #1890ff;
}

.otherBtn.el-button {
  border-radius: 0;
  color: rgba(0, 0, 0, 0.35);
}

.otherBtn.el-button:hover {
  border-color: #1890ff;
}

.otherBtnActive.el-button {
  border-color: #1890ff;
  color: #1890ff;
}

.input-wrap {
  text-align: center;
}

.input-wrap .input {
  width: 66px;
  height: 26px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(194, 194, 194, 1);
}

.input-wrap .input-wrap-Btn {
  width: 44px;
  min-width: 72px;
  height: 22px;
  margin-top: 6px;
  padding: 0;
  font-size: 12px;
  text-align: center;
  line-height: 22px;
  border-radius: 0;
}

/*筛选条件*/
.filter-condition {
  width: 100%;
  height: 36px;
  line-height: 36px;
  margin: 5px 0 0;
  background: rgb(241, 241, 241);
}

.filter-condition /deep/ .el-tag {
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.35);
  margin-left: 10px;
}

.filter-condition /deep/ .el-tag:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.filter-condition /deep/ .el-tag:hover .el-tag__close.el-icon-close {
  color: #1890ff;
}

/* /deep/ .el-tag__close.el-icon-close:hover {
  background: #fff;
} */

/*表格*/
/deep/ .el-table th,
.el-table tr {
  background: #f7f7f7;
  padding: 10px 0;
}

/deep/ .el-table th > .cell {
  color: #666666;
  line-height: 14px;
  font-weight: bold;
}

/deep/ .el-table-column-checkbox .el-checkbox {
  margin-right: 0;
}

// /deep/ .el-table__expanded-cell[class*="cell"] {
//   padding: 0 86px;
//   background-color: #f7f7f7;
// }

// /deep/ .el-table__expanded-cell[class*="cell"] .el-form {
//   height: 44px;
//   line-height: 44px;
// }

/deep/ .el-form-item__content {
  line-height: 46px;
}

/deep/ .el-form-item__label {
  padding: 0 0 0 12px;
}

/deep/ .selectAdsTable .el-table__body-wrapper {
  overflow-x: auto !important;
}

/deep/ .selectAdsTable .el-checkbox__label {
  padding-left: 4px;
}

/*滚动条*/
/deep/ .el-table__body-wrapper {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden !important;
}

/deep/ .el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 8px;
  background: #fafafa;
}

/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #c1c1c1;
  border-radius: 4px;
}

/deep/ .el-form--inline .el-form-item {
  margin-right: 45px;
}

/deep/ .el-dialog {
  width: 1000px;
  /*height: 680px;*/
}

.step2 /deep/ .el-dialog {
  width: 1134px;
  min-height: 680px;
}
/*提示*/
.tip {
  width: 100%;
  background: rgba(230, 247, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(145, 213, 255, 1);
  padding: 10px 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  margin: 8px 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.tip span {
  color: #1890ff;
}

.tip /deep/ .el-icon-info {
  color: #1890ff;
  margin-right: 8px;
}

/*超出省略*/
/deep/ .el-table .cell {
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/deep/ .el-table__row .cell span {
  overflow-x: initial;
}

/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #ecf5ff;
}

/deep/ .el-tabs--border-card > .el-tabs__content {
  padding: 40px;
}

.tab-info h4 {
  width: 100%;
  background: #fafafa;
  border-radius: 2px;
  font-size: 16px;
  color: #333333;
  height: 34px;
  line-height: 34px;
  padding-left: 20px;
  font-weight: bold;
}

.tab-info p {
  margin-bottom: 40px;
  margin-top: 20px;
  margin-left: 20px;
  font-size: 14px;
  color: #666666;
}

/*确认报价单修改框*/
/deep/ .el-dialog__body {
  padding: 2px 20px 8px 20px;
}
/*计数器*/
/deep/ .el-input-number__decrease,
/deep/ .el-input-number__increase {
  background-color: transparent !important;
}

/deep/ .el-icon-arrow-down {
  position: relative;
  top: 1px;
}

/deep/ .el-input-number .el-input__suffix {
  right: 42px !important;
}

.createPlan .type-select /deep/ .el-input__suffix {
  right: 4px;
}

/deep/
  .el-input-number.is-controls-right
  .el-input-number__decrease
  [class*="el-icon"],
.el-input-number.is-controls-right
  .el-input-number__increase
  [class*="el-icon"] {
  position: relative;
  top: 2px;
}

/deep/ .el-input-number {
  width: 304px;
  margin-bottom: 5px;
}

/deep/ .el-table th > .cell.highlight {
  color: #409eff !important;
}

/deep/ .el-input-number.is-controls-right .el-input__inner {
  text-align: left;
}

/deep/ .el-tabs--border-card {
  box-shadow: none;
  border: 1px solid #d8d8d8;
}

/*完成创建*/
.successIcon img {
  width: 72px;
}

.successIcon h2 {
  font-size: 24px;
  color: #333333;
  margin-top: 22px;
  margin-bottom: 8px;
  font-weight: bold;
}

.successIcon p {
  font-size: 14px;
  color: #999999;
  margin-bottom: 16px;
}

.planPanel,
.successIcon {
  text-align: center;
}

.planPanel {
  width: 557px;
  height: 220px;
  background: #fafafa;
  border-radius: 2px;
  padding: 19px 0;
  box-sizing: border-box;
  margin: 0 auto;
}
.planPanel ul {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  height: 100%;
}

.planPanel ul li {
  padding-left: 207px;
  text-align: left;
  font-size: 14px;
  color: #666666;
  margin-bottom: 10px;
}

.planPanel ul li.money {
  margin-bottom: 10px;
  font-size: 20px;
  color: #666666;
}

.planPanel ul li em {
  font-size: 14px;
  color: #333333;
}

.planPanel ul .money i {
  font-style: normal;
  font-size: 12px;
  color: #666666;
}

// .noShareUl {
//   height: 245px !important;
// }

.noShareUl ul li {
  margin-bottom: 15px !important;
}

/*一键选点*/
.el-dialog__footer {
  text-align: center;
}
/* 方案导入 */
.import_fanan a {
  color: #606266;
}

.import_fanan .fileButton {
  width: 126px;
}

.upload_file {
  display: inline-block;
}

.warning_box {
  margin-top: 20px;
  background: rgba(255, 251, 230, 1);
  border-radius: 4px;
  border: 1px solid rgba(255, 229, 143, 1);
  color: rgba(0, 0, 0, 0.65);
  padding: 0 5px;
}

.upload_file .aButton {
  width: 124px;
  height: 29px;
  line-height: 31px;
  text-align: center;
  display: inline-block;
  color: #666;
  margin-right: 3px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.aButton:hover {
  border: 1px solid #409eff;
  color: #409eff;
}

/*safari下表头错位*/
/deep/ .el-table .el-table-column-checkbox .cell {
  width: 110px;
}

/deep/ .el-table .el-table-column-resName .cell {
  width: 200px;
}

/deep/ .el-table .el-table-column-mediaName .cell {
  width: 140px;
}

/deep/ .el-table .el-table-column-mediaRemark .cell {
  width: 140px;
}

.ad_pagination /deep/ .el-pagination__sizes .el-input__inner {
  width: 100px;
}

.ad_pagination /deep/ .el-pagination__editor.el-input .el-input__inner {
  width: 45px;
}
/deep/ .el-upload--text {
  width: 100%;
}

/deep/ .el-upload--text .el-upload-list__item {
  width: 100%;
}

/deep/ .el-upload--text .el-upload-dragger {
  padding-top: 9%;
  width: 100%;
  height: 135px;
  background: rgba(0, 0, 0, 0.06);
}

.unit {
  display: inline-block;
  font-style: normal;
  background-color: #f5f5f5;
  color: rgba(0, 0, 0, 0.65);
  height: 32px;
  width: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 0 4px 4px 0;
  transform: translateX(-40px);
  border-left: 1px solid #d9d9d9;
}
/deep/ .planAdsCntClass.el-input {
  width: 200px;
  .el-input__inner {
    width: 105px !important;
  }
}
</style>
<style>
.el-tooltip__popper.is-dark {
  max-width: 200px;
}

.other-dd-popper {
  padding: 6px;
}
</style>
