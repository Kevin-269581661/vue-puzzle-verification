<template>
  <div class="ad_mediaDetail_wrap clearfix">
    <div class="ad_mediaDetail_nav">
      <p><a href="#">媒体管理</a><em> / </em><a href="#">媒体列表</a></p>
    </div>
    <div class="mediaList_wrap">
      <div class="mediaList_head">
        <h2>媒体列表</h2>
      </div>
      <div class="mediaList_container">
        <div class="handel_ul">
          <li class="handel_ul_li handel_ul_li_select">
            <span class="li-label">关键词：</span>
            <el-input
              placeholder="请输入内容"
              v-model="keyword"
              class="input-with-select u-key"
              size="small"
              @change="initData"
            >
              <el-select
                v-model="selectInfo"
                slot="prepend"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in SelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-input>
          </li>
          <li class="handel_ul_li handel_ul_li_city">
            <span class="li-label">城市：</span>
            <el-cascader
              :options="cityOptions"
              v-model="selectedOptions"
              separator="-"
              :show-all-levels="false"
              placeholder="请选择城市"
              filterable
              size="small"
              style="width: 236px"
              clearable
              @change="handleChange"
            >
            </el-cascader>
          </li>
          <li class="handel_ul_li handel_ul_li_area">
            <span class="li-label">区域：</span>
            <el-select
              v-model="selectRName"
              placeholder="请选择区域"
              :clearable="true"
              style="width: 236px"
              size="small"
              @change="getRegion"
            >
              <el-option
                v-for="item in regionOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </li>
          <li class="handel_ul_li handel_ul_li_btn">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="searchFun"
              :disabled="searchBtnAbled"
              >搜索</el-button
            >
            <el-button plain @click="clearSearch">重置</el-button>
            <el-button plain @click="newMedia" v-if="showNewBtn"
              >新建</el-button
            >
            <el-button plain @click="importMedia" v-if="showImportBtn"
              >导入媒体</el-button
            >
            <el-button v-if="showImportBtn" plain @click="showPushMap"
              >推送地图</el-button
            >
          </li>
        </div>
        <div class="table_wrap">
          <el-table
            v-loading="loading"
            element-loading-text="拼命加载中..."
            element-loading-spinner="el-icon-loading"
            border
            :data="currentPlan"
            style="width: 100%"
            @filter-change="filterChange"
            :default-sort="{ prop: 'resName', order: 'descending' }"
            ref="tableEl"
          >
            <el-table-column
              label="资源名称"
              min-width="210"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span
                  @click="mediaDetail(scope.row)"
                  style="color: #108ee9; cursor: pointer"
                >
                  {{ scope.row.resName }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              prop="mVehicle"
              label="媒体类型"
              width="127"
              :show-overflow-tooltip="true"
            >
            </el-table-column>

            <el-table-column
              prop="mTitle"
              label="媒体名称"
              width="127"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.mTitle || '--' }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="投放面"
              width="130"
              prop="asLab"
              :show-overflow-tooltip="true"
            >
            </el-table-column>

            <el-table-column
              prop="assetTag"
              label="资产编号"
              min-width="215"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ scope.row.assetTag || '--' }}
              </template>
            </el-table-column>

            <el-table-column
              column-key="rtName"
              prop="rtName"
              label="资源类型"
              width="130"
              :filters="[
                { text: '社区', value: '1' },
                { text: '写字楼', value: '2' }
              ]"
              :filter-multiple="false"
            >
            </el-table-column>

            <el-table-column
              prop="city"
              label="城市"
              width="120"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.city || '--' }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="rName"
              label="区域"
              width="113"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.rName || '--' }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="tradingArea"
              label="商圈"
              width="127"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.tradingArea || '--' }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="createTime"
              label="创建日期"
              width="130"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.createTime || '--' }}</span>
              </template>
            </el-table-column>

            <el-table-column
              column-key="asState"
              prop="asState"
              label="媒体状态"
              width="112"
              :filters="[
                { text: '正常', value: 1 },
                { text: '待安装', value: '2' },
                { text: '已拆除', value: 4 }
              ]"
              :filter-multiple="false"
              fixed="right"
            >
              <!-- { text: '待安装', value: '2' }, -->
              <template slot-scope="scope">
                <point-state
                  :state-text="stateToText(scope.row.asState).text"
                  :color="stateToText(scope.row.asState).color"
                ></point-state>
              </template>
            </el-table-column>

            <el-table-column
              column-key="asSaleState"
              prop="asSaleState"
              label="售卖状态"
              width="112"
              :filters="[
                { text: '可售卖', value: 1 },
                { text: '不可售卖', value: 2 }
              ]"
              :filter-multiple="false"
              fixed="right"
            >
              <template slot-scope="scope">
                <point-state
                  :state-text="stateToSellText(scope.row.asSaleState).text"
                  :color="stateToSellText(scope.row.asSaleState).color"
                ></point-state>
              </template>
            </el-table-column>

            <el-table-column
              v-if="showNewBtn"
              label="操作"
              width="80"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-dropdown
                  size="small"
                  trigger="click"
                  placement="bottom-start"
                  :hide-on-click="true"
                >
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native.prevent="
                        changeState('6', scope.$index, scope.row)
                      "
                      :disabled="
                        scope.row.asSaleState === 1 || scope.row.asState == 4
                      "
                      >可售卖</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click.native.prevent="
                        changeState('7', scope.$index, scope.row)
                      "
                      :disabled="scope.row.asSaleState === 2"
                      >不可售卖</el-dropdown-item
                    >

                    <el-dropdown-item
                      @click.native.prevent="
                        changeState('5', scope.$index, scope.row)
                      "
                      :disabled="scope.row.asState == 5"
                      >删除</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click.native.prevent="
                        changeState('4', scope.$index, scope.row)
                      "
                      :disabled="scope.row.asState == 4"
                      >拆除</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>

            <div slot="empty">
              <no-search-result></no-search-result>
            </div>
          </el-table>
        </div>
        <div class="ad_pagination">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="changePage"
            @size-change="changeSize"
            :page-sizes="[10, 20, 50]"
            :current-page.sync="pageData.pageNum"
            :page-size="pageData.pageSize"
            :total="pageData.totalSize"
          >
          </el-pagination>
        </div>
      </div>

      <!--媒体拆除-->
      <el-dialog
        :visible.sync="dismantleVisible"
        :close-on-click-modal="false"
        width="480px"
        custom-class="mStatueDialog"
      >
        <h3 slot="title" class="dismantle_title">
          <i class="el-icon-question"></i>
          媒体拆除
        </h3>
        <div>
          <p style="line-height: 28px">被拆除的媒体将不可重新被启用</p>
          <el-input
            type="textarea"
            v-model.trim="dismantleInfo"
            placeholder="请填写拆除记录"
          ></el-input>
          <p class="push_map_box_p" v-show="isShowTag">
            <i class="el-icon-warning" style="color: #faad14"></i>
            在【维护管理】页面，可查阅每个拆除的媒体记录
            <i class="el-icon-close" @click="hideTag()"></i>
          </p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dismantleVisible = false"
            >取 消</el-button
          >
          <el-button
            size="mini"
            type="primary"
            style="margin-left: 35px"
            @click="dismantleMedia"
            >确 定</el-button
          >
        </div>
      </el-dialog>

      <!--媒体导入模态框-->
      <el-dialog
        title="媒体导入"
        :visible.sync="ImportDialogVisible"
        :close-on-click-modal="false"
        custom-class="Import_dialog"
        top="30vh"
        width="300px"
      >
        <ul class="import_ul">
          <li>
            <el-select
              v-model="importAsrID"
              size="small"
              filterable
              :loading="importSelectLoading"
              placeholder="请选择所属公司"
            >
              <el-option
                v-for="(item, index) in companyList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </li>
          <li>
            <el-upload
              class="upload_file"
              ref="upload"
              accept=".xlsx,.xls"
              :action="doUpload"
              :show-file-list="true"
              :file-list="fileData"
              :http-request="uploadFile"
              :on-remove="fileRemove"
              :multiple="false"
            >
              <a
                :href="apiVar.qadnUrl + '/importTemplate/mediaTemplate.xlsx'"
                class="el-icon-download aButton"
                download="媒体导入模板.xlsx"
                @click="dowmLoadFun"
                >下载模板</a
              >
              <el-button plain icon="el-icon-upload2" class="el_upload_btn"
                >上传文件</el-button
              >
            </el-upload>
          </li>
        </ul>
        <div slot="footer" class="">
          <el-button @click="ImportDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitUpload">导 入</el-button>
        </div>
      </el-dialog>

      <!--导入失败的媒体列表-->
      <el-dialog
        :visible.sync="showUploadFail"
        :close-on-click-modal="false"
        title="导入媒体失败信息"
        custom-class="error_media"
        top="20vh"
        width="60%"
      >
        <div class="car-title">
          <i class="el-icon-info" style="color: #1890ff"></i>
          <h4>
            已成功导入媒体<span>{{ excelObj.successNum }}</span
            >个,问题媒体<span>{{ excelObj.failNum }}</span
            >个
            <span @click="downLoadExcel()"
              >下载表格<i class="el-icon-download"></i
            ></span>
          </h4>
        </div>
        <el-table border :data="excelDataUpload" style="width: 100%">
          <el-table-column prop="resName" label="资源名称" min-width="80">
          </el-table-column>
          <el-table-column prop="city" label="城市" min-width="80">
          </el-table-column>
          <el-table-column prop="area" label="区域" min-width="80">
          </el-table-column>
          <el-table-column prop="mTitle" label="媒体名称" min-width="85">
          </el-table-column>
          <el-table-column prop="assetTag" label="资产编号" min-width="85">
          </el-table-column>
          <el-table-column prop="errorMsg" label="失败信息" min-width="90">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.errorMsg"
                placement="bottom-start"
              >
                <span>{{ scope.row.errorMsg || '--' }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <!--推送地图-->
      <el-dialog
        title="推送地图"
        :visible.sync="pushMapDialogVisible"
        :close-on-click-modal="false"
        custom-class="Import_dialog"
        :show-close="false"
        top="30vh"
        width="448px"
      >
        <div class="push_map_box">
          <div>
            <span>推送日期：</span>
            <el-date-picker
              v-model="selectDay"
              size="small"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy/MM/dd"
              format="yyyy/MM/dd"
              :picker-options="dayOptionsSelect"
            >
            </el-date-picker>
          </div>
          <p class="push_map_box_p" v-show="isShowTag">
            <i class="el-icon-warning" style="color: #faad14"></i>
            请选择推送的日期，将当日新增的媒体推送至地图
            <i class="el-icon-close" @click="hideTag()"></i>
          </p>
        </div>
        <div slot="footer" class="">
          <el-button @click="pushMapDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitPushMap">确 认</el-button>
        </div>
      </el-dialog>

      <!-- 不可售卖弹窗  -->
      <unvailable-sellDialog
        :visible.sync="isUnvailableSell"
        :resourceName="resourceName"
        :activeAsLab="activeAsLab"
        :mID="mID"
        :mTitle="mTitle"
        @handleConfirm="getData()"
        v-if="isUnvailableSell"
      ></unvailable-sellDialog>

      <!-- 可售卖弹窗  -->
      <vailable-sellDialog
        :visible.sync="isVailableSell"
        :resourceName="resourceName"
        :activeAsLab="activeAsLab"
        :mID="mID"
        :mTitle="mTitle"
        :unSaleableReason="unSaleableReason"
        @handleConfirm="getData"
        v-if="isVailableSell"
      ></vailable-sellDialog>
    </div>
  </div>
</template>

<script>
import api from '../../api/api'
import areaPackageNew from '../../commonFun/areaPackage_new'
import areaToTextNew from '../../commonFun/areaToText_new'
import sessFun from "../../commonFun/sessFun.js";
import noSearchResult from "./components/noSearchResult.vue";
import pointState from './components/pointState.vue';
import timeFormat from '../../commonFun/timeFormat';
import unvailableSellDialog from './components/unvailableSellDialog.vue';
import vailableSellDialog from './components/vailableSellDialog.vue';

import {
  Form,
  FormItem,
  Table,
  TableColumn,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
  Row,
  Button,
  Tooltip,
  Message,
  Select,
  Option
} from 'element-ui';

export default {
  name: "mediaList",
  components: {
    noSearchResult,
    pointState,
    elForm: Form,
    elFormItem: FormItem,
    elTable: Table,
    elTableColumn: TableColumn,
    elDropdown: Dropdown,
    elDropdownMenu: DropdownMenu,
    elDropdownItem: DropdownItem,
    elInput: Input,
    elRow: Row,
    elButton: Button,
    elTooltip: Tooltip,
    elSelect: Select,
    elOption: Option,
    unvailableSellDialog,
    vailableSellDialog
  },
  data () {
    return {
      //加载中
      loading: true,
      loadSign: true,
      // 页码及条数
      pageData: {
        pageNum: 1,
        pageSize: 10,
        totalSize: 0,
      },
      showNewBtn: false,   // 新建按钮
      haveDetail: true,
      //搜索框和下拉列表
      keyword: '',
      selectInfo: '1',
      SelOptions: [
        {
          value: '1',
          label: '资源名称'
        }, {
          value: '2',
          label: '商圈'
        }
      ],
      resType: '',                    // 搜索的资源类型
      asState: '',                     // 搜索的媒体状态
      asSaleState: '',                //  搜索的售卖状态
      planList: [],                   //  table的所有数据
      currentPlan: [],                // 显示在table中的数据
      cityOptions: [],                //城市数组
      selectedOptions: [],            // 当前选择的城市rid数组
      regionOpt: [],                  // 地区
      selectRName: '',                // 当前选择的区域rid
      cityArea: { cName: '', rName: '' },   // 当前选择的城市名称和区域名称
      loadScroll: true,
      provinceCity: [],               //省份及其地级市
      timeID: '',                     // 计时器
      cityRid: '',                    // 搜索前置条件为城市时,转换成rid
      sessionData: '',
      pageNo: 1,                      // 页数
      totalPage: 1,                   // 总页数
      searchBtnAbled: false,           // 搜索按钮禁止
      mStatusDialogVisible: false,    // 媒体状态修改模态框
      normalToDisabled: true,         //  是否为正常转禁用
      doorState: { asState: false, adState: '' },  // 广告门单面禁用：媒体状态、点位状态
      // 修改媒体状态时的行数据
      rowData: {
        asState: {
          A: false,
          B: false
        }
      },
      rowIndex: '',                   // 修改媒体状态时的行下标
      selectState: '',                // 修改到媒体状态
      ImportDialogVisible: false,     // 媒体导入弹出框
      importAsrID: '',                // 导入媒体时所选择的公司id
      importSelectLoading: true,      // 公司下拉选项
      companyList: [],                // SA媒体导入时获取的公司列表
      doUpload: this.apiVar.qadnUrl + '/addsp/api/v1/media/batchImport',
      fileData: [],                            // 当前上传文件的数据- 表格
      excelDataUpload: [],                     // 导入excel之后返回的数组
      showUploadFail: false,                  // 导入失败的媒体弹出框
      excelObj: { successNum: 0, failNum: 0 },   // 导入excel之后返回的失败成功点数
      ImportLoading: '',                      // 导入excel提交loading
      showImportBtn: false,                   // SA才显示导入媒体按钮
      pushMapDialogVisible: false,            // 推送地图弹出框
      isShowTag: true,
      selectDay: [],                          // 选择的时间
      canSelectDayTime: [],                    // 限制选择区间
      dayOptionsSelect: {
        disabledDate: (time) => {
          return time.getTime() < Date.parse(this.canSelectDayTime[0]) || time.getTime() > Date.parse(this.canSelectDayTime[1])
        }
      },
      // 媒体状态禁用、启用弹出框
      mStateDialogVisible: false,
      // 媒体状态
      mediaState: {
        allState: false,
        AState: false,
        BState: false,
        ADisable: false,
        BDisable: false,
      },
      // 标识启用（true）还是禁用(false)
      isDisabled: false,
      // 拆除
      dismantleVisible: false,
      // 拆除信息
      dismantleInfo: '',

      // 不可售卖弹窗
      isUnvailableSell: false,
      // 可售卖弹窗
      isVailableSell: false,
      // 更改售卖状态时 媒体的所有广告位的状态
      mediaAdsStateAction: [],
      // 更改售卖状态时 资源名称
      resourceName: '',
      // 更改售卖状态时 选择的投放面
      activeAsLab: '',
      // 投放门id
      mID: '',
      // 不可售卖原因
      unSaleableReason: [],
      // 媒体名称
      mTitle: ''
    }
  },
  mounted: function () {
    // 判断角色确定是否有操作这一列
    this.sessionData = sessFun.getSess();
    ["ADN_MD_COUNTRY", "ADN_MD"].includes(this.sessionData.uType) ? this.showNewBtn = true : this.showNewBtn = false
    this.sessionData.uType === 'ADN_SA' ? this.showImportBtn = true : this.showImportBtn = false
    this.getData();
    let endTime = timeFormat.returnDayCount(0, '/');
    let startTime = timeFormat.returnDayCount(-180, '/');
    this.canSelectDayTime = [startTime, endTime]
  },
  
  methods: {
    // 媒体状态转换
    stateToText (state) {
      let mediaArr = [
        {
          text: '正常',
          value: 1,
          color: 'rgba(82,196,26,1)',
        },
        {
          text: '待安装',
          value: 2,
          color: 'rgba(196,203,211,1)',
        },
        {
          text: '已拆除',
          value: 4,
          color: 'rgba(199, 203, 206, 1)',
        }
      ];

      return mediaArr.filter(item => {
        return item.value === state
      })[0] || {}
    },

    // 售卖状态转换
    stateToSellText (state) {
      let mediaArr = [
        {
          text: '可售卖',
          value: 1,
          color: 'rgba(82,196,26,1)',
        },
        {
          text: '不可售卖',
          value: 2,
          color: 'rgba(199, 203, 206, 1)',
        }
      ];

      return state === 2 ? mediaArr[1] : mediaArr[0];
    },

    //新建跳转
    newMedia () {
      this.$router.push('./mediaInput');
    },

    // 维护管理
    maintain () {
      this.$router.push('./maintainList');
    },

    // 推送地图
    showPushMap () {
      this.pushMapDialogVisible = true
    },

    // 确认推送
    submitPushMap () {
      this.pushMapDialogVisible = true
      if (this.selectDay.length && this.selectDay.length >= 2) {
        let params = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          service: "SynchronizeMediaToDTWYAction",
          data: {
            startDate: this.selectDay[0],
            endDate: this.selectDay[1],
          }
        }
        console.log('params', params)
        api.postApi_new(this.apiVar.Media, params).then(res => {
          console.log('确认推送接口', res)
          if (res.data.SysCode === 200200) {
            sessFun.messageFun('success', '推送成功')
          } else {
            sessFun.messageFun('warning', '推送失败')
          }
        })
      } else {
        sessFun.messageFun('warning', '请选择日期')
      }
    },

    hideTag () {
      this.isShowTag = false;
    },

    filterChange (filters) {
      console.log('filters', filters)
      for (let key in filters) {
        if (key === 'rtName') {
          if (filters[key].length) {
            this.resType = filters[key][0]
          } else {
            this.resType = ''
          }
        } else if (key === 'asState') {
          if (filters[key].length) {
            this.asState = filters[key][0]
          } else {
            this.asState = ''
          }
        } else if (key === 'asSaleState') {
          if (filters[key].length) {
            this.asSaleState = filters[key][0]
          } else {
            this.asSaleState = ''
          }
        }
      }
      this.pageData.pageNum = 1
      this.getData()
    },

    // 分页
    changePage (val) {
      console.log('当前页', val)
      this.pageData.pageNum = val
      this.getData()
    },

    // 每页的条数
    changeSize (val) {
      console.log('每页的条数', val)
      this.pageData.pageNum = 1
      this.pageData.pageSize = val
      this.getData()
    },

    // 获取媒体列表
    getData () {
      this.loading = true
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        service: "GetRMListV2",
        data: {
          pageNo: this.pageData.pageNum,
          pageSize: this.pageData.pageSize,
          cityName: this.cityArea.cName,
          regionName: this.cityArea.rName,
          resType: this.resType,
          asState: this.asState,
          asSaleState: this.asSaleState
        }
      }
      if (this.selectInfo === '1') {
        params.data.resName = this.keyword
      } else if (this.selectInfo === '2') {
        params.data.tradeArea = this.keyword
      }
      for (let i in params.data) {
        if (params.data[i] === '') {
          delete params.data[i]
        }
      }
      api.postApi_new(this.apiVar.Media, params).then(res => {
        this.pageData.totalSize = res.data.data.total
        let RMList = res.data.data.list;
        if (res.data.SysCode == 200200) {
          if (RMList) {
            let mediaList = []
            for (let key of RMList) {
              mediaList.push(key)
            }
            this.currentPlan = mediaList
            //正在加载
            this.loading = false;
          } else {
            Message.warning({
              message: '数据为空',
              duration: 1500
            });
          }
        } else {
          Message({
            type: 'warning',
            message: res.data.MSG
          })
        }
        this.searchBtnAbled = false
      })
      this.setCityAreaByUWho()
    },

    // 设置可搜索的区域
    setCityAreaByUWho () {
      this.cityOptions = areaPackageNew.province()
    },

    // 根据市级城市rid，获取它的下属区、县
    handleChange (value) {
      console.log('handleChange', value)
      this.regionOpt = []
      this.selectRName = ''
      this.cityArea.rName = ''
      if (value.length) {
        let cityRID = value[1]
        let regionArr = areaPackageNew.findArea(cityRID)
        this.cityArea.cName = areaToTextNew.toTextCity(value[1])
        console.log('获取选中城市的区域', regionArr, 'this.cityArea', this.cityArea)
        let region = []
        for (let key of regionArr) {
          region.push({
            label: key.rName,
            value: key.rID
          })
        }
        this.regionOpt = region
        console.log('this.regionOpt', this.regionOpt, 'selectedOptions', this.selectedOptions)
      } else {
        this.cityArea.cName = ''
      }
    },

    //获取区域
    getRegion (val) {
      console.log('获取区域val', val, this.regionOpt)
      if (val) {
        for (let key of this.regionOpt) {
          if (key.value == val) {
            this.cityArea.rName = key.label
          }
        }
      } else {
        this.cityArea.rName = ''
      }
      console.log('选择的区域为', this.cityArea)
    },

    // 下拉选择状态
    changeState (selectState, index, rows) {
      console.log('选择的状态', selectState)
      console.log('行内容', rows)
      this.rowIndex = index
      this.rowData = rows
      this.selectState = selectState
      // 初始化
      for (let i in this.mediaState) {
        this.mediaState[i] = false
      }

      if (selectState === '6' || selectState === '7') {
        this.resourceName = rows.resName;
        this.activeAsLab = rows.asID
        this.mID = rows.mID
        this.unSaleableReason = JSON.parse(rows.unSaleableReason || '[]')
        this.mTitle = rows.mTitle
      }

      if (selectState === '4') {
        // 拆除
        this.dismantleInfo = ''
        this.isShowTag = true
        this.dismantleVisible = true
      } else if (selectState === '5') {
        // 删除
        this.judgeResHaveMediaNum()
      } else if (selectState === '6') {
        console.log('可售卖')
        if (!rows.assetTag && rows.asState == 2) {
          return sessFun.messageFun('warning', '该媒体尚未填写资产编号，请在详情页中点击【编辑】修改媒体状态并补全资产编号')
        }
        this.isVailableSell = true;
      } else if (selectState === '7') {
        console.log('不可售卖')
        this.isUnvailableSell = true
      }
    },

    // 判断当前删除的媒体所在小区是否只有一个媒体
    judgeResHaveMediaNum () {
      let judgeLoading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        "service": "CountMediaByResinfoIdAction",
        "data": {
          "resId": this.rowData.resID
        }
      }
      api.postApi_new(this.apiVar.Media, params).then(res => {
        if (res.data.SysCode === 200200 || res.data.MSG === '操作成功') {
          let isOneMore = false
          if (res.data.data && res.data.data == 1) {
            isOneMore = true
          } else {
            isOneMore = false
          }
          // 删除
          this.deleteMedia(isOneMore)
        } else {
          sessFun.messageFun('warning', res.data.MSG)
        }
        judgeLoading.close()
      }).catch(err => {
        judgeLoading.close()
      })
    },

    // 删除媒体
    deleteMedia (flag) {
      let text = '媒体被删除后将不可恢复!'
      if (flag) {
        text = '媒体和资源连同被删除，不可恢复!'
      }
      this.$confirm(text, '确定要删除该媒体吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'delete_media_confirm'
      }).then(() => {
        let submitLoading = this.$loading({
          lock: true,
          text: '删除中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let params = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          "service": "DelMediaAction",
          "data": {
            "mId": this.rowData.mID,
            "resId": this.rowData.resID
          }
        }
        console.log('删除params', params)
        api.postApi_new(this.apiVar.Media, params).then(res => {
          console.log('res', res)
          if (res.data.SysCode === 200200 || res.data.MSG === '操作成功') {
            sessFun.messageFun('success', '删除成功！')
            this.getData()
          } else {
            sessFun.messageFun('warning', res.data.MSG)
          }
          submitLoading.close()
        }).catch(err => {
          sessFun.messageFun('warning', '删除异常！')
          submitLoading.close()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },

    // 拆除媒体
    dismantleMedia () {
      if (!this.dismantleInfo) {
        sessFun.messageFun('warning', '请填写拆除备注信息!')
        return
      }
      let params = {
        "uid": this.sessionData.uID,
        "token": this.sessionData.token,
        "service": "AddDismantleRecord",
        "data": {
          "mID": this.rowData.mID,
          "remark": this.dismantleInfo,
          "resName": this.rowData.resName,
          "rId": this.rowData.rID
        }
      }
      console.log('拆除媒体params', params)
      api.postApi_new(this.apiVar.Media, params).then(res => {
        if (res.data.SysCode === 200200) {
          this.dismantleVisible = false
          sessFun.messageFun('success', '拆除成功!')
          this.rowData.asState = '4'
          this.clearSearch()
          // this.rowData.asState.A = '4'
          // this.rowData.asState.B = '4'
        } else {
          sessFun.messageFun('warning', res.data.MSG)
        }
      })
    },

    // 跳转到媒体详情界面
    mediaDetail (data) {
      this.$router.push('./mediaDetail');
      sessionStorage.setItem("resID", data.resID);
    },

    // 当搜索框为空的时候进行重置显示
    initData (val) {
      console.log('搜索框变化的值', val)
      if (!this.keyword) {
        this.setPageNoAndTableData()
        this.getData({ "pageNo": this.pageNo, "pageSize": 50 })
      }
    },

    // 搜索按钮
    searchFun () {
      this.searchBtnAbled = true
      if ((this.keyword === '' || this.keyword === null) && this.cityArea.cName === '') {
        Message.warning({
          message: '请先输入搜索条件',
          duration: 1000
        })
        this.searchBtnAbled = false
      } else {
        this.pageData.pageNum = 1
        this.getData()

      }
    },

    // 重置搜索
    clearSearch () {
      this.keyword = ''
      this.selectedOptions = []
      this.selectRName = ''
      this.regionOpt = [];
      this.pageData.pageNum = 1
      this.pageData.pageSize = 10
      this.cityArea = { cName: '', rName: '' }
      this.asSaleState = ''
      this.asState = ''
      this.resType = ''
      this.$refs.tableEl.clearFilter()
      this.getData()
    },

    // 导入媒体
    importMedia () {
      if (!this.companyList.length) {
        let params = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
        }
        api.getApi(this.apiVar.UCAPI + '/getCompany', params).then(res => {
          console.log('公司列表', res)
          if (res.data.SysCode == 200200) {
            let tempList = []
            for (let key of res.data.data) {
              if (key.ascType > 0) {
                tempList.push({
                  value: key.asrID,
                  label: key.asName
                })
              }
            }
            this.companyList = tempList.concat()
            this.importSelectLoading = false
          } else {
            this.$message.warning(res.data.MSG);
          }
        })
      }
      this.ImportDialogVisible = true
    },

    // 自定义上传
    uploadFile (params) {
      this.fileData = []
      console.log(params)
      let fileObj = params.file
      this.fileData.push(fileObj)
    },

    // 文件删除
    fileRemove (file, fileList) {
      console.log(file, fileList);
      this.fileData = fileList
    },

    // 导入模版下载
    dowmLoadFun (event) {
      // 阻止冒泡事件
      event.stopPropagation();
    },

    // 确认上传
    submitUpload () {
      console.log('this.importAsrID', this.importAsrID, this.fileData)
      if (!this.importAsrID) {
        this.$message.warning('请选择所属企业')
        return
      }
      if (this.fileData.length) {
        this.ImportLoading = this.$loading({
          lock: true,
          text: '上传中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        let formData = new FormData();
        formData.append('file', this.fileData[0]);
        // 上传文件
        api.postUpload_file(this.doUpload + '?uid=' + this.sessionData.uID + '&token=' +
          this.sessionData.token + '&asrID=' + this.importAsrID, formData).then(res => {
            console.log('导入媒体', res)
            if (res.data.SysCode === 200200) {
              let resData = res.data.data
              if (resData.errorList.length) {
                console.log('导入失败媒体', resData.errorList)
                this.setErrorMediaTable(resData.errorList)
                this.excelObj = {
                  successNum: resData.mediaCount,
                  failNum: resData.errorList.length
                }
              }
              if (resData.mediaCount > 0) {
                this.$message.success('成功导入' + resData.mediaCount + '条数据') // mediaCount resCount
                // this.setPageNoAndTableData()
                this.pageData.pageNum = 1
                this.getData()
              }
              this.ImportDialogVisible = false
              this.fileData = []
              this.importAsrID = ''
            } else {
              this.$message.warning(res.data.MSG)
            }
            this.ImportLoading.close()
          }).catch(res => {
            console.log(res)
          })
      } else {
        this.$message.warning('请上传文件！')
      }
    },

    // 导入失败的媒体
    setErrorMediaTable (errorList) {
      let resultarr = []
      for (let data of errorList) {
        resultarr.push({
          errorMsg: data.msg,
          resName: data.resInfo.resName,
          city: data.resInfo.city,
          area: data.resInfo.area,
          mTitle: data.resInfo.mTitle,
          mVehicle: data.resInfo.mVehicle,
          assetTag: data.resInfo.assetTag
        })
      }
      this.excelDataUpload = resultarr
      this.showUploadFail = true
    },

    // 导出有问题的点
    downLoadExcel () {
      let resultarr = [];
      for (let data of this.excelDataUpload) {
        let obj = {
          errorMsg: data.errorMsg,
          resName: data.resName,
          city: data.city,
          area: data.area,
          mTitle: data.mTitle,
          assetTag: data.assetTag
        };
        resultarr.push(obj);
      }
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../vendorExcel/Export2Excel');
        const tHeader = ['资源名称', '城市', '区域', '媒体名称', '资产编号', '失败信息'];
        const filterVal = ['resName', 'city', 'area', 'mTitle', 'assetTag', 'errorMsg'];
        const list = resultarr;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '问题媒体表');
      })
    },

    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-table-filter {
  height: 400px !important;
  overflow-y: auto !important;
}

a {
  color: #108ee9;
}

.input-with-select /deep/ .el-input__inner {
  font-size: 14px;
  line-height: 32px;
}

/deep/ .el-table th > .cell.highlight {
  color: #409eff !important;
}

/deep/ .el-tooltip__popper.is-light {
  color: #666666 !important;
  border: 1px solid #666666 !important;
}

/deep/ .el-table-filter {
  height: 180px;
}

/*过滤条件样式*/
.handel_ul {
  list-style: none;
  display: flex;
  align-items: center;
}

.handel_ul_li {
  // float: left;
  // flex-grow: 1;
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  width: 306px;
  margin-right: 32px;
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
/*下拉搜索框*/
/deep/ .el-input-group__prepend {
  width: 98px;
  position: relative;
  background-color: #fff;
  box-sizing: border-box;
  .el-input__inner {
    padding: 0 12px !important;
  }
}

/deep/ .el-input-group--prepend .el-select {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

/*滚动条*/
/deep/ .el-table__body-wrapper {
  min-height: 530px;
  overflow-y: auto;
}

/deep/ .error_media .el-table__body-wrapper {
  min-height: 420px;
}

/*筛选*/
/deep/ .el-table__column-filter-trigger {
  margin-left: 6px;
  line-height: 0px;
  overflow-y: hidden;
}

/deep/ .el-table th > .cell.highlight {
  color: #409eff !important;
}

/deep/ div.el-table-filter {
  left: 1106px !important;
}

/*操作*/
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

/*提示框*/
/deep/ .el-message {
  top: 65px;
  padding: 7px 15px 7px 20px;
}

.content_bottom_btn /deep/ .el-button span {
  position: relative;
  top: -2px;
}

.content_bottom_btn /deep/ .el-button span a {
  color: #606266;
}

/deep/ .mStatueDialog {
  width: 285px;
}

/deep/ .mStatueDialog h4 {
  margin: 12px 0;
}

/deep/ .mStatueDialog .el-dialog__body {
  padding: 0 20px 10px;
}

/*拆除*/
.dismantle_title {
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.dismantle_title .el-icon-question {
  font-size: 21px;
  color: #faad14;
}

/*待维修*/
.edit_media_ul li {
  margin-bottom: 16px;
}

.edit_media_ul /deep/ .el-date-editor.el-input,
.edit_media_ul /deep/ .el-date-editor.el-input__inner {
  width: calc(100% - 78px);
}

.edit_media_ul /deep/ .el-textarea {
  width: 81%;
  vertical-align: top;
}

/*导入媒体*/
.upload_file {
  display: inline-block;
  /*display: none;*/
}

.import_ul li {
  margin-bottom: 16px;
}

.import_ul /deep/ .el-select {
  width: 100%;
}

.import_ul /deep/ .el-button {
  width: 126px;
}

.import_ul .aButton {
  width: 124px;
  height: 29px;
  /*padding: 3px;*/
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

/deep/ .Import_dialog .el-dialog__header {
  padding: 16px 24px 0;
}

/deep/ .Import_dialog .el-dialog__body {
  padding: 16px 24px 16px;
}

/deep/ .Import_dialog .el-dialog__footer {
  padding: 8px 24px 24px;
}

/deep/ .el-upload-list__item {
  width: 259px;
}

/*导入失败媒体*/
/deep/ .error_media .el-dialog__body {
  padding: 10px 20px 20px;
}

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

.car-title span {
  font-size: 14px;
  font-weight: normal;
  margin: 0 6px;
  cursor: pointer;
  color: #1890ff;
}

/*  推送地图  */
.push_map_box /deep/ .el-select.el-select--small {
  width: 333px;
}
.push_map_box /deep/ .el-date-editor {
  width: 333px;
}

.push_map_box_p {
  height: 32px;
  background: rgba(255, 251, 230, 1);
  border-radius: 4px;
  border: 1px solid rgba(255, 229, 143, 1);
  line-height: 32px;
  padding: 0 16px;
  margin-top: 16px;
  position: relative;
}

.push_map_box_p /deep/ .el-icon-close {
  cursor: pointer;
  margin-left: 24px;
  position: absolute;
  top: 9px;
  right: 8px;
}

.u-key {
  /deep/ & > .el-input__inner {
    width: 137px;
  }
}

/deep/ .el-table th {
  background: #fafafa;
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

// 滚动条的宽度
/deep/ .el-table__body-wrapper::-webkit-scrollbar {
  width: 6px; // 横向滚动条
  height: 12px; // 纵向滚动条 必写
}
// 滚动条的滑块
/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 3px;
}
</style>

<style>
.delete_media_confirm .el-message-box__title {
  font-size: 16px;
  font-weight: 600;
}
</style>
