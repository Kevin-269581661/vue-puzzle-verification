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
              <div class="handleBtn" v-if="planDetail.isSimpleRight === 1">
                <el-tooltip
                  v-if="
                    ['ADN_MD_COUNTRY', 'ADN_MD'].includes(role) &&
                    planDetail.lockStatus == 1
                  "
                  effect="dark"
                  content="从今天起重新预锁七天"
                  placement="top"
                >
                  <el-button @click="reLock">预 锁</el-button>
                </el-tooltip>
                <!-- apState：0已完成；1进行中；2未投放；3投放中；5强制结束；-1待配点 -->
                <template v-if="planDetail.apState == 1">
                  <!-- planMode：0普通 1意向 -->
                  <el-button
                    v-if="
                      customPermission.proposalPermission == 1 &&
                      planDetail.planMode == 1
                    "
                    type="default"
                    @click="createShareCode"
                    >协同选点</el-button
                  >
                  <el-button
                    type="default"
                    @click="setPlanPrice"
                    >设置金额</el-button
                  >
                  <el-button
                    v-if="
                      customPermission.proposalPermission == 1 &&
                      planDetail.planMode == 1 && role == 'ADN_BD'
                    "
                    type="default"
                    :disabled="matchCnt >= 10"
                    @click="matchRes"
                    >{{ `配点(${10 - matchCnt})` }}</el-button
                  >
                  <!-- 1:普通销售编辑非意向方案2:权限销售编辑意向小区3:媒介编辑所有方案 -->
                  <el-button
                    type="primary"
                    @click="edit()"
                    v-if="
                      (['ADN_BD_KA', 'ADN_BD'].includes(role) &&
                        customPermission.proposalPermission == 0 &&
                        planDetail.planMode != 1) ||
                      (['ADN_BD_KA', 'ADN_BD'].includes(role) &&
                        customPermission.proposalPermission == 1 &&
                        planDetail.planMode == 1) ||
                      ['ADN_MD_COUNTRY', 'ADN_MD'].includes(role)
                    "
                    >编辑</el-button
                  >
                </template>
              </div>
            </div>
            <div>
              <detail :detail="planDetail"  :isSimpleRight="planDetail.isSimpleRight"  v-if="isShow"></detail>
            </div>
          </div>
        </div>
        <div class="mediaList_wrap margin_16_64">
          <el-tabs v-model="planPanel" @tab-click="handleClick()">
            <el-tab-pane label="选点排期" name="first">
              <schedule-alter :detailData="planDetail" />
              <div class="first-wrap box-wrap">
                <div class="table_wrap">
                  <div class="table-setting">
                    <el-button
                      plain
                      type="default"
                      icon="el-icon-download"
                      class="searchBtn"
                      v-if="planPanel == 'first'"
                      @click="export2Excel(planDetail.apName)"
                      :disabled="isDown"
                      >导出</el-button
                    >
                    <!-- 列设置 -->
                    <TableSetting refresh space filter :columns="currentColumn" cacheKey="planDetail" @filterColumn="filterColumn"
                      @refreshTable="refreshTable" @spaceSetting="spaceSetting">
                    </TableSetting>
                  </div>
                  <el-table
                    :data="currentPagination"
                    :default-sort="{prop: 'recName', order: 'descending'}"
                    border
                    style="width: 100%"
                    v-loading="loading" element-loading-text="玩命加载中.."
                    max-height="500"
                    element-loading-spinner="el-icon-loading"
                    :size="rowSpace"
                    :key="itemKey"
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
                          <el-form-item
                            v-if="
                              sessionData.uType == 'ADN_MD_COUNTRY' ||
                              sessionData.uType == 'ADN_BD_KA'
                            "
                            label="归属公司："
                          >
                            <span class="ellipsis-td">{{
                              props.row.asName || ''
                            }}</span>
                          </el-form-item>
                        </el-form>
                        <el-form
                          v-if="customPermission.patrolPermission"
                          label-position="left"
                          inline
                          class="demo-table-expand"
                        >
                          <el-form-item label="巡点问题：">
                            <span class="ellipsis-td">{{
                              props.row.remark
                            }}</span>
                          </el-form-item>
                          <el-form-item label="通行情况：">
                            <span class="ellipsis-td">{{
                              props.row.trafficState
                            }}</span>
                          </el-form-item>
                          <el-form-item
                            label="通电情况："
                            v-if="customPermission.patrolPermission == 2"
                          >
                            <span class="ellipsis-td">{{
                              props.row.electrifyState
                            }}</span>
                          </el-form-item>
                        </el-form>
                      </template>
                    </el-table-column>

                    <template v-for="item in currentColumn">
                      <template v-if="item.label === '资源名称'">
                        <el-table-column
                          
                          show-overflow-tooltip
                          :prop="item.prop"
                          :label="item.label"
                          v-if="item.isChecked"
                          :fixed="item.fix === 'left' ? true : false"
                        >
                        </el-table-column>
                      </template>

                      <template v-else-if="item.label === '城市'">
                        <el-table-column
                          :filters="filterCityData"
                          :filter-method="filterCity"
                          :prop="item.prop"
                          :label="item.label"
                          v-if="item.isChecked"
                          :fixed="item.fix === 'left' ? true : false"
                        >
                        </el-table-column>
                      </template>

                      <template v-else-if="item.label === '区域'">
                        <el-table-column
                          :filters="filtersArea"
                          :filter-method="filterOrigin"
                          :prop="item.prop"
                          :label="item.label"
                          v-if="item.isChecked"
                          :fixed="item.fix === 'left' ? true : false"
                        >
                        </el-table-column>
                      </template>

                      <template v-else-if="item.label === '楼盘类型'">
                        <el-table-column
                          :prop="item.prop"
                          :label="item.label"
                          v-if="item.isChecked"
                          :fixed="item.fix === 'left' ? true : false"
                        >
                          <template slot-scope="scope">
                            <span>{{ scope.row.cType || '--' }}</span>
                          </template>
                        </el-table-column>
                      </template>
 
                      <template v-else-if="item.label === '小区户数'">
                        <el-table-column
                          align="right"
                          :prop="item.prop"
                          :label="item.label"
                          v-if="item.isChecked"
                          :fixed="item.fix === 'left' ? true : false"
                        >
                          <template slot-scope="scope">
                            <span>{{ priceToFormat(scope.row.hNum) }}</span>
                          </template>
                        </el-table-column>
                      </template>

                      <template v-else-if="item.label === '楼盘价格'">
                        <el-table-column
                          align="right"
                          :label="item.label"
                          v-if="item.isChecked"
                          :fixed="item.fix === 'left' ? true : false"
                        >
                          <template slot-scope="scope">
                            <span
                              >&yen;{{
                                scope.row.hPrice
                                  ? priceFormat(scope.row.hPrice / 100)
                                  : 0
                              }}</span
                            >
                          </template>
                        </el-table-column>
                      </template>

                      <template v-else-if="item.label === '排期'">
                        <el-table-column
                          :filters="filtersData"
                          :filter-method="filterTimeRange"
                          :prop="item.prop"
                          :label="item.label"
                          v-if="item.isChecked"
                          :fixed="item.fix === 'left' ? true : false"
                        >
                          <template slot-scope="scope">
                            <template v-if="scope.row.lState == 2">
                              <span>{{ scope.row.finishTimeRange }}</span>
                              <el-tooltip placement="top">
                                <div slot="content">
                                  <span>{{ scope.row.timeRange }}</span>
                                </div>
                                <i class="el-icon-question"> </i>
                              </el-tooltip>
                            </template>
                            <span v-else>{{ scope.row.timeRange }}</span>
                          </template>
                        </el-table-column>
                      </template>

                      <template v-else>
                        <el-table-column
                          :prop="item.prop"
                          :label="item.label"
                          v-if="item.isChecked"
                          :fixed="item.fix === 'left' ? true : false"
                        >
                        </el-table-column>
                      </template>
                    </template>
                    
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
            <el-tab-pane label="物料信息" name="third" v-if="planDetail.isSimpleRight === 1">
              <material
                :materialInfoData="materialInfoJson"
                :loading="maLoading"
                :isOrder="false"
                v-if="planPanel == 'third'"
              ></material>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="content_bottom_btn">
          <el-button plain class="cancel" @click="goBack()">返回</el-button>
        </div>
        <el-dialog
          title="设置方案金额"
          :visible.sync="settlementFormVisible"
          width="368px"
          custom-class="settlement-dialog"
          :show-close="false"
          :close-on-click-modal="false"
          :close-on-press-escap="false"
          :before-close="resetSettlement"
        >
          <el-form
            ref="settlementForm"
            :model="settlementForm"
            :rules="settlementFormRules"
          >
            <el-form-item
              label="点位单价："
              prop="unitPrice"
              :label-width="formLabelWidth"
            >
              <el-input
                placeholder="请输入金额"
                v-model.number="settlementForm.unitPrice"
                size="small"
                maxlength="7"
              >
                <template slot="append">元/面·周</template>
              </el-input>
            </el-form-item>
            <div class="form__line"></div>
            <el-form-item
              class="special-padding"
              label="现金结算："
              prop="cash"
              :label-width="formLabelWidth"
            >
              <el-input
                placeholder="请输入金额"
                v-model.number="settlementForm.cash"
                size="small"
                maxlength="7"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item
              class="special-padding"
              label="置换结算："
              prop="displace"
              :label-width="formLabelWidth"
            >
              <el-input
                placeholder="请输入金额"
                v-model.number="settlementForm.displace"
                size="small"
                maxlength="7"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item
              class="special-padding"
              label="其它结算："
              prop="other"
              :label-width="formLabelWidth"
            >
              <el-input
                placeholder="请输入金额"
                v-model.number="settlementForm.other"
                size="small"
                maxlength="7"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="方案总价：" :label-width="formLabelWidth">
              <span class="form-item__price"
                >{{
                  (
                    (isNaN(settlementForm.cash) ? 0 : settlementForm.cash * 1) +
                    (isNaN(settlementForm.displace)
                      ? 0
                      : settlementForm.displace * 1) +
                    (isNaN(settlementForm.other) ? 0 : settlementForm.other * 1)
                  ).toFixed(2)
                }}
                元</span
              >
            </el-form-item>
            <div class="form__line"></div>
            <el-form-item
              label="金额备注："
              prop="settlementRemark"
              :label-width="formLabelWidth"
            >
              <el-input
                type="textarea"
                placeholder="请输入备注"
                v-model="settlementForm.settlementRemark"
                size="small"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer__button">
            <el-button
              @click="resetSettlement(() => (settlementFormVisible = false))"
              >取 消</el-button
            >
            <el-button type="primary" @click="setPlanPrice('settlementForm')"
              >确 定</el-button
            >
          </div>
        </el-dialog>
      </div>
      <!--智能配点-->
      <add-point
        :dialogVisible="addPointDialogVisible"
        :showMatchResult="false"
        :matchCnt.sync="matchCnt"
        :apID="planDetail.apID"
        :rejectAdPlan="rejectAdPlan"
        :ADLimit="ADLimit"
        :customPermission="customPermission"
        @closeAddPoint="addPointDialogVisible = false"
        @openAddPoint="addPointDialogVisible = true"
        @merge2ShopList="BDSaveMatchToPlan"
      ></add-point>
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
  import { getLocalCache } from "@/utils/user.js";

  // 报价单
  import material from "./components/materialInfo.vue";
  import detail from "./components/detailInfo.vue";
  import addPoint from './components/addPoint.vue';
  import TableSetting from "./components/TableSetting";

  import {
    Message,
    MessageBox,
  } from "element-ui";
  import ScheduleAlter from '@/components/common/components/Alter/ScheduleAlter'

  export default {
    name: "planDetail",
    components: {
      material,
      detail,
      addPoint,
      ScheduleAlter,
      TableSetting
    },
    data () {
      let validatPrice = (rule, value, callback) => {
        if (value) {
          let reg = /^\d{1,}$/;
          if (!reg.test(value)) {
            callback(new Error("请输入正整数"));
          } else if (value > 9999999) {
            callback(new Error("预算不能大于9,999,999"));
          } else {
            callback();
          }
        } else {
          callback();
          // this.$refs["customerBudgetRef"].clearValidate()
        }
      };
      return {
        materialInfoJson:{},  //物料信息数据
        // 登录信息
        sessionData: {},
        addPointDialogVisible: false,
        matchCnt: 10,
        rejectAdPlan: [],                  // 排斥方案选项
        // showMatchResult: false,
        ADLimit: [                      // step2 广告限制
          { value: '地产', label: '地产' },
          { value: '汽车', label: '汽车' },
          { value: '美容', label: '美容' },
          { value: '餐饮', label: '餐饮' },
          { value: '食品', label: '食品' },
          { value: '金融', label: '金融' },
          { value: '医学', label: '医学' },
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
        // 设置方案金额
        formLabelWidth: '70px',
        settlementFormVisible: false,
        settlementForm: {
          unitPrice: 0,
          cash: 0,
          displace: 0,
          other: 0,
          settlementRemark: ''
        },
        settlementFormRules: {
          unitPrice: [{ validator: validatPrice, trigger: "blur" }],
          cash: [{ validator: validatPrice, trigger: "blur" }],
          displace: [{ validator: validatPrice, trigger: "blur" }],
          other: [{ validator: validatPrice, trigger: "blur" }]
        },

        // 表头数据
        currentColumn: [
          { id: 0, label: "资源名称", prop: "resName", isChecked: true, fix: "not" },
          { id: 5, label: "媒体名称", prop: "mTitle", isChecked: true, fix: "not" },
          { id: 7, label: "媒体类型", prop: "mediaTypeName", isChecked: true, fix: "not" },
          { id: 12, label: "投放面", prop: "asLab", isChecked: true, fix: "not" },
          { id: 1, label: "城市", prop: "city", isChecked: true, fix: "not" },
          { id: 2, label: "区域", prop: "rName", isChecked: true, fix: "not" },
          { id: 9, label: "楼盘类型", prop: "cType", isChecked: true, fix: "not" },
          { id: 17, label: "小区户数", prop: "hNum", isChecked: true, fix: "not" },
          { id: 16, label: "楼盘价格", prop: "hPrice", isChecked: true, fix: "not" },
          { id: 18, label: "排期", prop: "timeRange", isChecked: true, fix: "left" },
          { id: 3, label: "街道", prop: "street", isChecked: false, fix: "not" },
          { id: 4, label: "商圈", prop: "tradingArea", isChecked: false, fix: "not" },
          { id: 10, label: "单元", prop: "unitName", isChecked: false, fix: "not" },
          { id: 6, label: "媒体位ID", prop: "assetTag", isChecked: false, fix: "not" },
          { id: 8, label: "位置类型", prop: "siteType", isChecked: false, fix: "not" },
          { id: 11, label: "位置朝向", prop: "siteOrientation", isChecked: false, fix: "not" },
          { id: 13, label: "媒体状态", prop: "asState", isChecked: false, fix: "not" },
          { id: 14, label: "售卖状态", prop: "asSaleState", isChecked: false, fix: "not" },
          { id: 15, label: "创建日期", prop: "createTime", isChecked: false, fix: "not" },
        ],
        itemKey: '',
        rowSpace: ''
      };
    },
    created () {
       //获取物料信息
      this.getMaterialInfo();
      // 获取角色
      this.getRole();
      // 获取选点排期数据
      this.getInitData();
      this.getMatchCnt(sessionStorage.getItem("plan_apid"));
      this.getADLimit()       // 获取广告限制列表

    },
    computed: {
      currentPagination () {
        this.totalNum = this.setpointArr.length;
        return this.setpointArr.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
      }
    },
    methods: {
      handleSizeChange (val) {
        this.pageSize = val;
      },
      handleCurrentChange (val) {
        this.currentPage = val;
      },
      // 导出excel
      export2Excel (name) {
        this.isDown = true;
        let resultArr = [];
        for (let data of this.setpointArr) {
        let obj = {
            province: data.province || "",
            city: data.city,
            rName: data.rName,
            street: data.street, //街道
            tradingArea: data.tradingArea,
            resName: data.resName,
            resAddress: data.resAddress,
            fNum: data.fNum == '0' ? '#' : data.fNum,
            unitCount: data.unitCount, //单元数量
            cType: data.cType,
            hPrice: data.hPrice / 100,
            hNum: data.hNum == '0' ? '#' : data.hNum,
            chDay: data.chDay,
            notPush: data.notPush,
            resAlias: data.alias,
            description: data.description,
            supportingFacilities: data.supportingFacilities,
            dNum: data.dNum, //出入口数
            liveRate: data.liveRate, //入住率
            liftType: data.liftType, // 配套电梯
            parkSpaceNum: data.parkSpaceNum || "",
            lat: data.lng, //经度
            lng: data.lat, //纬度
            mediaTypeName: data.mediaTypeName,
            mTitle: data.mTitle,
            buildingName: data.buildingName, //楼栋
            unitName: data.unitName, //单元
            siteOrientation: data.siteOrientation, //位置朝向
            assetTag: data.assetTag,
            mType: data.mType,
            site: data.site,
            asLab: data.asLab,
            adSize: data.adSize,
            adViewSize: data.adViewSize,
            mRemark: data.mRemark,
            timeRange: data.timeRange,
            mapCenter: data.mapCenterName || '',
            finishTimeRange: data.finishTimeRange,
            remark: data.remark,
            trafficState: data.trafficState || '',
            electrifyState: data.electrifyState || '',
            asName: data.asName,
        };
        resultArr.push(obj);
        }
        require.ensure([], () => {
        const { export_json_to_excel } = require('../../vendorExcel/Export2Excel');
        let tHeader = [
            '省份',
            '城市',
            '区域',
            '街道',
            '商圈',
            '资源名称',
            '详细地址',
            '楼栋数量',
            '单元数量',
            '楼盘类型',
            '楼盘价格',
            '住户数量',
            '入住年份',
            '广告限制',
            '资源别名',
            '楼盘介绍',
            '周边配套',
            '出入口数',
            '入住率',
            '配套电梯',
            '车位数',
            '经度',
            '纬度',
            '媒体类型',
            '媒体名称',
            '楼栋',
            '单元',
            '位置朝向',
            '媒体位ID',
            '设备型号',
            '位置类型',
            '投放面',
            '素材尺寸',
            '可视尺寸',
            '媒体备注',
            '投放排期',
            '地图中心点',
            '终止日期',
        ];
        let filterVal = [
            'province',
            'city',
            'rName',
            'street',
            'tradingArea',
            'resName',
            'resAddress',
            'fNum',
            'unitCount',
            'cType',
            'hPrice',
            'hNum',
            'chDay',
            'notPush',
            'resAlias',
            'description',
            'supportingFacilities',
            'dNum',
            'liveRate',
            'liftType',
            'parkSpaceNum',
            'lat',
            'lng',
            'mediaTypeName',
            'mTitle',
            'buildingName',
            'unitName',
            'siteOrientation',
            'assetTag',
            'mType',
            'site',
            'asLab',
            'adSize',
            'adViewSize',
            'mRemark',
            'timeRange',
            'mapCenter',
            'finishTimeRange',
        ];

        switch (this.customPermission.patrolPermission) {
            case 1:
            tHeader.push('巡点问题', '通行情况');
            filterVal.push('remark', 'trafficState');
            break;
            case 2:
            tHeader.push('巡点问题', '通行情况', '通电情况');
            filterVal.push('remark', 'trafficState', 'electrifyState');
            break;
        }

        if ((this.sessionData.uType == 'ADN_MD_COUNTRY') || (this.sessionData.uType == 'ADN_BD_KA')) {
            tHeader.push('归属公司')
            filterVal.push('asName');
        }

        const list = resultArr;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, name);
        this.isDown = false;
        })
  },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      // tab点击
      handleClick () {
        if (this.planPanel == "first") {
          this.getSetPoint();
        } else if (this.planPanel == "second") {
        } else if (this.planPanel == "third") {
        }
      },
      // 获取选点排期列表数据
      getInitData (updateDetail = false) {
        this.isShow = updateDetail;
        // 真实数据
        let apid = sessionStorage.getItem("plan_apid");
        let info = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          apid: apid
        };
        // uid         int【必填】     当前账户UserID
        // apid        int             公司对应方案apID
        api.getApi(this.apiVar.Advertisement + "/GetFanganInfo", info)
          .then(res => {
            if (res.data.SysCode == 200200) {
              let info = res.data.data;
              this.planDetail = {
                adcID: info.adcID,
                apID: info.apID,
                apName: info.apName,
                apState: info.apState,
                planMode: info.planMode,
                lockStatus: info.lockStatus,
                apTotal: info.apTotal,
                apcTime: dateFormat.toDateTime(info.apcTime, '/'),
                bTitle: info.bTitle,
                cName: info.cName,
                cuName: info.cuName,
                cityList: info.cityList || [],
                customerDemand: info.customerDemand || '',
                pdEnd: info.pdEnd,
                pdStar: info.pdStar,
                rID: info.rID,
                rIDs: info.rIDs,
                realName: info.realName,
                remark: info.remark,
                pdTotal: this.priceFormat(info.apTotal / 100 - info.otherFee - info.sendFee),
                pdSendFee: this.priceFormat(info.sendFee),
                pdOtherFee: this.priceFormat(info.otherFee),
                Total: this.priceFormat(info.apTotal / 100),
                AdDoor: {
                  pdTotal: this.priceFormat((info.AdDoor.pdTotal - info.AdDoor.adOtherFee - info.AdDoor.adSendFee) / 100),
                  pdSendFee: this.priceFormat(info.AdDoor.adSendFee / 100),
                  pdOtherFee: this.priceFormat(info.AdDoor.adOtherFee / 100),
                },
                barrier: {
                  pdTotal: this.priceFormat((info.barrier.pdTotal - info.barrier.adOtherFee - info.barrier.adSendFee) / 100),
                  pdSendFee: this.priceFormat(info.barrier.adSendFee / 100),
                  pdOtherFee: this.priceFormat(info.barrier.adOtherFee / 100),
                },
                isSimpleRight: info.isSimpleRight
              };
              // 选点排期
              !updateDetail && this.getSetPoint();
              this.getRejectPlanList(res.data.data.suID);
            } else {
              Message.warning(res.data.MSG);
            }
          })
          .catch(res => {
            console.log(res);
          });
      },
      // 获取选点排期
      getSetPoint () {
        if (this.setpointArr.length) {
          return;
        }
        // 真实数据
        let apid = sessionStorage.getItem("plan_apid");
        let info = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          apid: apid
        };
        if (this.planDetail.apState == 1) {
          // apState: 1 方案并未转成订单
          this.funcToInit(this.apiVar.Advertisement + '/GetADB', info, this.planDetail.apState);
        } else {
          this.funcToInit(this.apiVar.Advertisement + '/GetAdLaunch', info, this.planDetail.apState);
        }
      },
      getADLimit () {
        this.ADLimit = []
        let params = {
          "uid": this.sessionData.uID,
          "token": this.sessionData.token,
          "service": "GetNotPush",
          "data": {}
        }
        api.postApi_new(this.apiVar.Media, params).then(res => {
          console.log('广告限制列表', res)
          if (res.data.SysCode === 200200) {
            let limit = res.data.data
            let limitArr = []
            for (let i = 0; i < limit.length; i++) {
              let limitObj = { value: limit[i].nTitle, label: limit[i].nTitle }
              limitArr.push(limitObj)
            }
            this.ADLimit = limitArr
          }
        })
      },
      // 获取排斥方案选择列
      getRejectPlanList (suID) {
        let params = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          sales_user: suID
        }
        api.getApi(this.apiVar.Advertisement + '/getSalesProject', params).then(res => {
          console.log('销售所属方案', res)
          if (res.data.SysCode == 200200) {
            let resData = res.data.data
            let tempList = []
            for (let key of resData) {
              if (this.apid != key.apId) {
                tempList.push({
                  value: key.apId,
                  label: key.apName + '（' + key.cname + ' · ' + key.apcTime + '）'
                })
              }
            }
            this.rejectAdPlan = tempList
          } else {
            sessFun.messageFun('warning', res.data.MSG)
          }
        })
      },
      // 请求数据整合
      funcToInit (apiUrl, info, state) {
        // uid         int【必填】     当前账户UserID
        // apid        int             公司对应方案apID
        api.getApi(apiUrl, info)
          .then(res => {
            if (!res.data.SysCode) {
              let initData = res.data;
              let resInfo = initData.adSpaceInfo;
              // 城市中文名称
              for (let data of resInfo) {
                let time = "";
                if (state == 1) {
                  time = this.formatTime(data.pbStar) + "-" + this.formatTime(data.pbEnd);
                } else {
                  time = this.formatTime(data.lStar) + "-" + this.formatTime(data.lEnd);
                }
                data.timeRange = time;
                let finishTimeRange = '';
                if (data.lState == 2) {
                  finishTimeRange = this.formatTime(data.lStar) + "-" + this.formatTime(data.lSetTime);
                }
                data.finishTimeRange = finishTimeRange;
              }
              // 城市筛选过滤
              this.filterCityData = filterFormat(resInfo, "city");
              this.filtersArea = filterFormat(resInfo, "rName");
              this.filtersData = filterFormat(resInfo, "timeRange");
              // 选点排期
              this.setpointArr = resInfo;
              this.loading = false;
              this.maLoading = false;

              this.$nextTick(function () {
                this.isShow = true;
              });
            } else {
              Message.warning(res.data.MSG);
            }
          })
          .catch(res => {
            this.loading = false;
            this.maLoading = false;
            console.log(res);
          });
      },

      // 获取物料新接口
      getMaterialInfo (){
        let apID = sessionStorage.getItem("plan_apid");
        let info = {
          apID
        };
        api.getApi("/addsp/material/getMaterialCntByPlan", info).then(res=>{
          if(res.data.SysCode== 200200){
            let _data=res.data.data;
            let _materialCntInfoList=[];
            let _mediaTypeName=[];
            _data.forEach((item)=>{
              _mediaTypeName.push(item.mediaTypeName);
              _materialCntInfoList.push(item.materialCntInfoList);
            })
            this.materialInfoJson={
              mediaTypeName:_mediaTypeName,
              materialCntInfoList:_materialCntInfoList
            };
          }else{
            this.$message({
                message: res.data.MSG,
                type: 'error'
            });
          }
        }).catch(err => {
          console.log(err);
        })
      },

      // 时间格式规范
      formatTime (val) {
        return dateFormat.toDate(val, "/");
      },
      // 价格加上逗号
      priceFormat (price) {
        return commaFormat.init(price);
      },
      priceToFormat (price) {
        if (!price) {
          return 0
        }
        return commaFormat.format(price);
      },
      // 返回
      goBack () {
        this.$router.push("./planList");
      },
      // 弹出框修改路径
      changeRoute () {
        MessageBox.confirm(
          `该方案被预锁,请先解除预锁,是否去解锁？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.$router.push("./planList");
          })
          .catch(() => {
            Message.info("已取消操作");
          });
      },
      // 重新预锁
      reLock () {
        this.$confirm('是否确定对该方案重新进行预锁？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 方案详情的预锁重置
          api.postApi(this.apiVar.Advertisement + "/ResetFangLock", {
            uid: this.sessionData.uID,
            token: this.sessionData.token,
            apid: sessionStorage.getItem("plan_apid")
          }).then(res => {
            if (!res.data.SysCode) {
              console.log('res.data', res.data)
            } else {
              Message.success('重新预锁成功！');
            }
          });
        }).catch(() => { })
      },
      /**
       * @description: 生成协同选点链接
       * @param {*}
       * @return {*}
       */
      createShareCode () {
        api.postApi('/addsp/proposal/share/createShareCode', {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          apID: this.planDetail.apID
        }).then((res) => {
          if (res.data.SysCode === 200200) {
            // let Url = this.apiVar.qadnUrl + '/shareADList?apid=' + res.data.data.apID + '&aicode=' + res.data.data.aiCode;
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
      /**
       * @description: 设置方案金额
       * @param {*}
       * @return {*}
       */
      setPlanPrice (formName) {
        if (this.settlementFormVisible) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let params = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                apID: this.planDetail.apID,
                adsWeekFee: this.settlementForm.unitPrice * 100,
                cashFee: this.settlementForm.cash * 100,
                sendFee: this.settlementForm.displace * 100,
                otherFee: this.settlementForm.other * 100,
                remark: this.settlementForm.settlementRemark || ''
              }
              api.postApi('/addsp/proposal/updatePlanMoney', params).then((res) => {
                if (res.data.SysCode === 200200) {
                  this.settlementFormVisible = false
                  this.getInitData(true)
                  console.log("金额结算成功");
                } else {
                  sessFun.messageFun("warning", "金额结算失败");
                }
              });
            } else {
              console.warn('valid---')
              return false;
            }
          });
        } else {
          // 表单弹框显示
          this.settlementFormVisible = true
        }
      },
      // 销售配点
      matchRes () {
        let info = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          apid: this.planDetail.apID,
        };
        api.postApi(this.apiVar.Advertisement + "/CheckLock", info).then(async res => {
          if (!res.data.SysCode) {
            if (!res.data.IsLock) {
              /* if(this.planDetail.apState!==-1) {
                  // 方案已配点，显示上次配点结果
                  this.showMatchResult = true
                  this.$nextTick(()=>{
                      // 重置显示参数，方便下次触发watch
                      this.showMatchResult = false
                  })
              } else { */
              // 方案未配点
              this.addPointDialogVisible = true
              // }
            } else {
              this.changeRoute();
            }
          }
        });
      },
      // 获取该用户下的配点次数
      getMatchCnt (apID) {
        return new Promise((resolve) => {
          api.getApi("/addsp/match/getMatchCnt?apID=" + apID).then(res => {
            if (res.data.SysCode == 200200) {
              this.matchCnt = res.data.data || 0
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
      BDSaveMatchToPlan () {
        let info = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          apID: this.planDetail.apID
        };
        api.postApi("/addsp/match/UpdatePlan", info).then((res) => {
          if (res.data.SysCode === 200200) {
            location.reload(false)
            sessFun.messageFun("success", '保存配点成功！');
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        });
      },
      //
      resetSettlement (done) {
        if (this.$refs.settlementForm) {
          this.$refs.settlementForm.resetFields()
          done()
        }
      },
      //清空草稿箱数据
      clearDrafts (apid) {
        let params = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          apID: apid
        };
        return new Promise(resolve => {
          api.postApi(this.apiVar.CleanAdBackUp, params).then((res) => {
            if (res.data.SysCode === 200200) {
              console.log("清除草稿箱成功");
              resolve(1)
            } else {
              sessFun.messageFun("warning", "清除草稿箱失败");
            }
          });
        })
      },
      // 编辑
      edit () {
        let apid = sessionStorage.getItem("plan_apid");
        sessionStorage.setItem("planDetail", JSON.stringify(this.planDetail))
        let session = this.sessionData;
        let info = {
          uid: session.uID,
          token: session.token,
          apid: apid,
        };
        api.postApi(this.apiVar.Advertisement + "/CheckLock", info).then(async res => {
          if (!res.data.SysCode) {
            if (!res.data.IsLock) {
              // 意向方案
              if (this.planDetail.planMode == 1) {
                if (['ADN_BD_KA', 'ADN_BD'].includes(this.role)) {
                  // 编辑意向小区
                  (await this.clearDrafts(apid)) && this.$router.push("./editEmptyPointPlan");
                } else {
                  this.$router.push("./editPlan");
                }
              } else {
                // 非意向方案
                this.$router.push("./editPlanOld");
              }
            } else {
              this.changeRoute();
            }
          }
        });
      },
      // 获取角色
      getRole () {
        this.sessionData = sessFun.getSess();
        this.role = this.sessionData.uType;
        this.customPermission = this.sessionData.customPermission;
      },
      filterCity (value, row) {
        return row.city === value;
      },
      filterOrigin (value, row) {
        return row.rName === value;
      },
      filterTimeRange (value, row) {
        return row.timeRange === value;
      },

      // 列展示
      filterColumn(columns) {
        this.currentColumn = columns
        this.itemKey = Math.random()
      },

      // 刷新列表
      refreshTable() {
        this.search();
      },

      // 更改列表行距
      spaceSetting(size) {
        this.rowSpace = size;
      },
    },
  };
  </script>

  <style lang="scss" scoped>
  .ellipsis-td {
    width: 132px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* 设置方案金额 */
  /deep/ .settlement-dialog {
    .el-form-item {
      padding: 8px 0;
      margin: 0;
      .el-form-item__label {
        color: rgba(0, 0, 0, 0.65);
      }
      ::placeholder {
        /*Firefox,Chrome,Opera*/
        font-size: 14px;
        color: rgba(0, 0, 0, 0.25);
      }
      :-ms-input-placeholder {
        /*InternetExplorer10-11*/
        font-size: 14px;
        color: rgba(0, 0, 0, 0.25);
      }
      ::-ms-input-placeholder {
        /*MicrosoftEdge*/
        font-size: 14px;
        color: rgba(0, 0, 0, 0.25);
      }
    }
    .form__line {
      margin: 16px 0;
      height: 1px;
      background: #e9e9e9;
    }
    .el-form-item__content {
      line-height: unset;
      .el-input__inner {
        color: rgba(0, 0, 0, 0.65);
      }
      .el-input-group__append {
        padding: 4px 12px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.25);
      }
    }
    .special-padding.el-form-item {
      .el-input-group__append {
        padding: 4px 9px;
      }
    }
    .form-item__price {
      line-height: 32px;
      color: rgba(0, 0, 0, 0.65);
    }
    .el-dialog__header {
      padding: 16px 24px;
      .el-dialog__title {
        font-size: 16px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
        line-height: 24px;
      }
    }
    .el-dialog__body {
      padding: 0 24px;
    }
    .el-dialog__footer {
      padding: 16px 24px 24px;
      .dialog-footer__button {
        word-spacing: -1em;
        .el-button + .el-button {
          margin-left: 16px;
        }
      }
    }
    .el-form-item__label {
      padding: 0;
      line-height: 32px;
    }
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
    .handleBtn--plain {
      color: #000000a6;
    }
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
    float: right;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    text-align: right;
    color: #999999;
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
  /deep/ .el-table__expanded-cell[class*='cell'] .el-form {
    height: 44px;
    line-height: 44px;
  }
  /deep/ .el-table__expanded-cell[class*='cell'] {
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

  .table-setting {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 16px;
    .searchBtn {
      margin-right: 8px;
      background: #1890FF;
      border: 1px solid #1890FF;
      box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.043);
      border-radius: 2px;
      color: #FFFFFF;
    }
  }
  </style>
