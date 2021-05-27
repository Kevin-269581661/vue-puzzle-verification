<template>
  <div>
    <el-dialog
      title="智能配点"
      :visible.sync="dialogVisible"
      width="418px"
      :show-close="false"
      :before-close="handleClose"
      :close-on-click-modal="false"
      custom-class="custom-dialog-wrapper add-point-dialog"
      center
    >
      <div v-loading="loading">
        <div class="board board1">
          <div class="board-title">配点信息</div>
          <ul class="info-list">
            <li class="info-item">
              <span class="item-label">意向投放小区：</span>
              <span class="item-content">
                {{ intentionInfo.planResCount||'--' }} 个
                <span class="active" @click="getIntentionList">查看</span>
              </span>
            </li>
            <li class="info-item">
              <span class="item-label">计划投放点位：</span>
              <span class="item-content">
                {{ intentionInfo.planAdSpaceCount||'--' }} 个
              </span>
            </li>
            <li class="info-item">
              <span class="item-label">客户预算：</span>
              <span class="item-content">
                {{ (intentionInfo.customerBudget/100) | moneyFormat("¥") }}
              </span>
            </li>
            <li class="info-item">
              <span class="item-label">投放排期：</span>
              <span class="item-content">
                {{ `${moment(intentionInfo.pdStartDate).format('LL')}-${moment(intentionInfo.pdEndDate).format('LL')}` }}
              </span>
            </li>
            <li class="info-item">
              <span class="item-label">客户要求：</span>
              <span class="item-content ellipsis">
                {{ intentionInfo.customerDemand||'' }}
              </span>
            </li>
          </ul>
        </div>
        <div class="board board2">
          <el-form label-position="top" label-width="82px">
            <el-form-item label="配点要求">
              <el-checkbox-group v-model="formDataObj.pointDemand">
                <el-checkbox v-if="sessionData.uType == 'MD'" label="isSpaceTimeLongFirst" name="type">优先选择空置久的点位</el-checkbox>
                <el-checkbox label="isSingleMediaChoose" name="type">1个门选择1个点位</el-checkbox>
                <el-checkbox label="isSingleConnectChoose" name="type">联排门仅选1面</el-checkbox>
              </el-checkbox-group>
              <div v-if="sessionData.uType == 'MD'">
                <el-checkbox
                  v-model="formDataObj.aFaceRateChecked"
                  name="type"
                >A面占比不高于(%)</el-checkbox>
                <el-input-number :disabled="!formDataObj.aFaceRateChecked" v-model="formDataObj.aFaceRate" controls-position="right" size="mini" :min="0" :max="100"></el-input-number>
              </div>
              <div v-else>
                <el-checkbox
                  disabled
                  checked
                  name="type"
                >A面占比50%
                  <el-tooltip placement="top" trigger="hover" effect="dark">
                      <div slot="content">占比不可更改，如有需要请联系媒介配点</div>
                      <i class="fa fa-info-circle" style="color: #999999;" aria-hidden="true"></i>
                  </el-tooltip>
                </el-checkbox>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="board board3">
          <div class="board-title">点位排斥</div>
          <el-form label-position="left" label-width="70px">
            <el-form-item v-if="sessionData.uType == 'MD'" label="通行情况：">
              <el-select
                multiple
                collapse-tags
                :disabled="!customPermission.patrolPermission"
                v-model="formDataObj.excludeTrafficStateList"
                :placeholder="customPermission.patrolPermission?'请选择通行情况':'尚未开通定制巡点服务，请联系客服开通'"
              >
                <el-option
                  v-for="item in trafficAndmType.excludeTrafficStateList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="门体类型：">
              <el-select
                v-model="formDataObj.excludeMTypeList"
                multiple
                collapse-tags
                placeholder="请选择门体类型"
              >
                <el-option
                  v-for="item in trafficAndmType.excludeMTypeList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="方案名称：">
              <el-select
                size="mini"
                v-model="formDataObj.apExclude"
                placeholder="请选择方案"
                filterable
                :clearable="true"
              >
                <el-option
                  v-for="item in rejectAdPlan"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="广告限制：">
              <el-select
                v-model="formDataObj.adLimits"
                multiple
                collapse-tags
                placeholder="请选择广告限制"
              >
                <el-option
                  v-for="item in ADLimit"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :disabled="loading" type="primary" @click="dialogMatchRangeFormVisible=true"
          >配 点</el-button
        >
      </span>
    </el-dialog>
    <dialog-table
      :tableData="intentionTableData"
      :tableColumn="intentionTableColumn"
      :visible="showDialogTable"
      @closeDialog="showDialogTable=false"
      title="意向投放小区"
      width="1134px"
    >
      <div slot="topTip" class="table-top-tip">
        <i class="el-icon-info" style="color: #1890ff"></i>
        <h4>
          <span>
            意向小区共
            <span class="tip-active">{{
              intentionInfo.planResCount || ""
            }}</span> 个
            <template v-for="(item, index) in intentionInfo.resPdNumGroup">
              <span :key="index">
                ，选{{ item.resPdNum }}面的小区
                <span class="tip-active">{{ item.resCount }}</span> 个
              </span>
            </template>
          </span>
        </h4>
        <span class="tip-active tip-active-handle right" @click="export2Excel">下载</span>
      </div>
      <template slot="dialogFooter">
        <el-button @click="showDialogTable=false"
          >关 闭</el-button
        >
      </template>
    </dialog-table>
    <dialog-table
      v-loading="asignPointTableLoading"
      :tableData="asignPointTableData"
      :tableColumn="asignPointTableColumn"
      :visible="showAsignPointTableData"
      @closeDialog="closeAsignPointTable"
      title="配点结果详情"
      width="1134px"
    >
      <div slot="topTip">
        <span class="table-top-comment">
          意向投放小区：<span>{{
            tipObj.planResCount
          }}</span>个
          <span class="active comment-item" @click="getIntentionList">查看</span>
          计划投放点位：<span class="comment-item">{{ tipObj.planAdSpaceCount }}个</span> 
          客户预算：<span class="comment-item">{{ (tipObj.customerBudget/100) | moneyFormat("¥") }}</span>
          客户要求：<span class="comment-item">{{ tipObj.customerDemand }}</span>
        </span>
        <div class="table-top-tip">
          <i class="el-icon-info" style="color: #1890ff"></i>
          <h4>
            <span>
              小区:<span class="tip-active">{{
                tipObj.resCount
              }}</span>
              (选1面:<span class="tip-active">{{ tipObj.selectLab1 }}</span>
              &nbsp;选2面:<span class="tip-active">{{ tipObj.selectLab2 }}</span>
              &nbsp;选择3面:<span class="tip-active">{{ tipObj.selectLab3 }}</span
              >)
              <div class="divide-border"></div>
              媒体:<span class="tip-active">{{ tipObj.mediaCount }}</span>
              <div class="divide-border"></div>
              点位:<span class="tip-active">{{ tipObj.faceCount }}</span>
              (A面:<span class="tip-active">{{ tipObj.afaceCount }}</span>
              &nbsp;B面:<span class="tip-active">{{ tipObj.bfaceCount }}</span
              >)
              <template v-if="sessionData.uType == 'MD'">
                <div class="divide-border"></div>
                上刊率50%以上的点位:<span class="tip-active">{{
                  (tipObj.underHalfSpaceRate*100).toFixed(2)
                }}%</span>
              </template>
              <div class="divide-border"></div>
              配点失败小区<span class="tip-active warn"> {{
                tipObj.failResCount
              }} </span
              >个
            </span>
          </h4>
          <!-- <span class="tip-active tip-active-handle right" @click="getMatchSummary(apID)">刷新</span>
          <div class="divide-border"></div> -->
          <span class="tip-active tip-active-handle right" @click="getFailRes">失败小区</span>
          <div class="divide-border"></div>
          <span class="tip-active tip-active-handle" @click="downLoadMatchResult">下载结果</span>
        </div>
      </div>
      <template slot="aheadColumn">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item label="商圈：">
                <span class="cell-ellipsis">{{ props.row.tradingArea||'' }}</span>
              </el-form-item>
              <el-form-item label="楼栋数量：">
                <span class="cell-ellipsis">{{ props.row.fNum||'' }}</span>
              </el-form-item>
              <el-form-item label="资产编号：">
                <span class="cell-ellipsis">{{ props.row.assetTag||'' }}</span>
              </el-form-item>
              <el-form-item label="入住年份：">
                <span class="cell-ellipsis">{{ props.row.chDay||'' }}</span>
              </el-form-item>
              <el-form-item label="广告限制：">
                <span class="cell-ellipsis">{{ props.row.notPush||'' }}</span>
              </el-form-item>
            </el-form>

            <el-form label-position="left" inline v-if="customPermission.patrolPermission">
              <el-form-item label="巡点问题：">
                <span class="cell-ellipsis">{{ props.row.remark||'' }}</span>
              </el-form-item>
              <el-form-item label="通行情况：">
                <span class="cell-ellipsis">{{ props.row.trafficState||'' }}</span>
              </el-form-item>
              <el-form-item label="通电情况：" v-if="customPermission.patrolPermission==2">
                <span class="cell-ellipsis">{{ props.row.electrifyState||'' }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </template>
      <el-table-column slot="otherColumn" slot-scope="{currentPage, currentPageSize}" label="操作" align="left">
        <template slot-scope="scope">
          <el-button
            style="text-align: left; color: #1890FF; font-size: 14px; height: 25px; line-height: 25px;"
            type="text"
            size="small"
            @click="deleteAsignItem(scope, currentPage, currentPageSize)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <template slot="dialogFooter">
        <template v-if="sessionData.uType == 'MD'">
          <el-button @click="closeAsignPointTable"
            >关 闭</el-button
          >
          <el-button
            v-if="matched"
            class="merge-btn"
            type="primary"
            @click="rematchPoint">
            重新配点
          </el-button>
          <el-button
            v-else
            class="merge-btn"
            type="primary"
            @click="merge2ShopList">
            确定并添加到购物车
          </el-button>
        </template>
        <template v-else-if="sessionData.uType == 'BD'">
          <el-button
            class="merge-btn"
            type="primary"
            :disabled="matchCnt==10"
            @click="rematchPoint">
            {{`重新配点(${10-matchCnt})`}}
          </el-button>
          <el-button
            class="merge-btn"
            type="primary"
            @click="BDSaveMatchToPlan">
            保存配点
          </el-button>
        </template>
      </template>
    </dialog-table>
    <dialog-table
      :tableData="failTableData"
      :tableColumn="failTableColumn"
      :visible="showFailDialogTable"
      @closeDialog="showFailDialogTable = false"
      title="配点失败小区"
      width="1134px"
    >
      <template slot="aheadColumn">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item label="商圈：">
                <span class="cell-ellipsis">{{ props.row.tradingArea||'' }}</span>
              </el-form-item>
              <el-form-item label="楼栋数量：">
                <span class="cell-ellipsis">{{ props.row.fNum||'' }}</span>
              </el-form-item>
              <el-form-item label="资产编号：">
                <span class="cell-ellipsis">{{ props.row.assetTag||'' }}</span>
              </el-form-item>
              <el-form-item label="入住年份：">
                <span class="cell-ellipsis">{{ props.row.chDay||'' }}</span>
              </el-form-item>
              <el-form-item label="广告限制：">
                <span class="cell-ellipsis">{{ props.row.notPush||'' }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </template>
      <template slot="dialogFooter">
        <el-button @click="showFailDialogTable = false">关 闭</el-button>
      </template>
    </dialog-table>
    <!-- 选择配点范围 -->
    <el-dialog 
      title="请选择配点范围" 
      :visible.sync="dialogMatchRangeFormVisible"
      width="368px"
      :show-close="false"
      :close-on-click-modal="false"
      custom-class="custom-dialog-wrapper match-range-dialog"
    >
      <div class="content-tip">选择“全部小区”则之前的配点将被覆盖</div>
      <el-radio v-model="formDataObj.matchRange" label="1">全部小区</el-radio>
      <el-radio v-model="formDataObj.matchRange" label="0">未配点小区</el-radio>
      <div slot="footer">
        <el-button @click="dialogMatchRangeFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="matchRes">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../../api/api";
// 时间格式化
import moment from "moment";
import timeFormat from "../../../commonFun/timeFormat.js";
import sessFun from "../../../commonFun/sessFun.js";
import dialogTable from "./dialogTable.vue";
moment.locale('zh-cn')
export default {
  name: "addPoint",
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false,
    },
    showMatchResult: {
      type: Boolean,
      default: () => false
    },
    apID: {
      type: [String, Number]
    },
    rejectAdPlan: {
      type: Array,
      default: ()=>[]
    },
    ADLimit: {
      type: Array,
      default: ()=>[]
    },
    customPermission: {
      type: Object,
      default: ()=>{}
    }
  },
  components: {
    dialogTable,
  },
  data() {
    return {
      moment,
      sessionData: null,
      matched: false,
      matchCnt: 0,    // 销售配点次数
      trafficAndmType: {
        excludeTrafficStateList: [],
        excludeMTypeList: []
      },
      loading: false,
      showDialogTable: false,
      showFailDialogTable: false,
      showAsignPointTableData: false,
      intentionInfo: {
        customerBudget: 0,
        customerDemand: "",
        pdEndDate: "",
        pdStartDate: "",
        planAdSpaceCount: 0,
        planResCount: 0
      },
      dialogMatchRangeFormVisible: false,
      formDataObj: {
        matchRange: '1',
        pointDemand: [],
        aFaceRate: 50,
        aFaceRateChecked: false,
        apExclude: "",
        adLimits: [],
        excludeTrafficStateList: [],
        excludeMTypeList: []
      },
      tipObj: {
        selectLab1: 0,
        selectLab2: 0,
        selectLab3: 0
      },
      intentionTableData: [
      ],
      intentionTableColumn: [
        {
          label: "资源",
          prop: "resName",
          minWidth: "100px",
          tip: true,
        },
        {
          label: "城市",
          prop: "city",
          minWidth: "100px",
          tip: true,
        },
        {
          label: "区域",
          prop: "region",
          minWidth: "100px",
          tip: true,
        },
        {
          label: "排期",
          prop: "period",
          minWidth: "160px",
          tip: true,
          value: (row)=>`${timeFormat.toDate(row.pdStartDate, '/')}~${timeFormat.toDate(row.pdEndDate, '/')}`
        },
        {
          label: "媒体数量(门)",
          prop: "resMediaCount",
          width: "120px",
          align: "right",
        },
        {
          label: "计划投放数量(面)",
          prop: "planPdNum",
          width: "160px",
          align: "right",
        },
      ],
      failTableData: [],
      failTableColumn: [
        {
          label: "资源",
          prop: "resName",
          minWidth: "100px",
          tip: true
        },
        {
          label: "城市",
          prop: "city",
          minWidth: "100px",
          tip: true
        },
        {
          label: "区域",
          prop: "region",
          minWidth: "100px",
          tip: true
        },
        {
          label: "排期",
          prop: "period",
          minWidth: "160px",
          value: (row)=>`${row.pdStartDate}~${row.pdEndDate}`,
          tip: true
        },
        {
          label: "总媒体数(门)",
          prop: "resMediaCount",
          width: "120px",
          align: "right"
        },
        {
          label: "计划投放点位(面)",
          prop: "planPdNum",
          width: "160px",
          align: "right"
        },
        {
          label: "已配点位(面)",
          prop: "actualPdNum",
          width: "160px",
          align: "right"
        },
        {
          label: "失败原因",
          prop: "failReasonDesc",
          width: "160px",
        },
      ],
      asignPointTableLoading: false,
      asignPointTableData: [],
      asignPointTableColumn: [
        {
          label: "资源",
          prop: "resName",
          minWidth: "160px",
          tip: true
        },
        {
          label: "城市",
          prop: "city",
          minWidth: "100px",
          tip: true
        },
        {
          label: "区域",
          prop: "region",
          minWidth: "100px",
          tip: true
        },
        {
          label: "排期",
          prop: "schedules",
          minWidth: "180px",
          tip: true
        },
        {
          label: "已配/计划",
          prop: "mediaNum",
          width: "100px",
          value: (row)=>`${row.actualPdNum}/${row.planPdNum}`,
          align: "right"
        },
        {
          label: "媒体名称",
          prop: "mTitle",
          width: "100px"
        },
        {
          label: "投放面",
          prop: "asLab",
          width: "80px",
          value: (row)=>`${row.asLab}面`
        }
      ],
    };
  },
  watch: {
    dialogVisible(val) {
      val && this.getIntentionInfo()
    },
    showMatchResult(val) {
      val && (this.matched = true) && this.getSuccessPoint()
    },
    apID(val) {
      val && this.sessionData.uType=='BD' && this.getMatchCnt()
    }
  },
  created() {
    this.sessionData = sessFun.getSess();
  },
  mounted() {
    this.getExcludeSelect()
    if(this.sessionData.uType == 'MD') {
      this.asignPointTableColumn.push({
        label: "近3月上刊率",
        prop: "publishRate",
        width: "120px",
        value: (row)=>`${((row.publishRate||0)*100).toFixed(2)}%`
      })
    }
  },
  methods: {
    getExcludeSelect() {
      return new Promise((resolve)=>{
        api.getApi("/addsp/match/getExcludeSelect?asrID="+this.sessionData.asrID).then(res => {
          if (res.data.SysCode == 200200) {
            let {excludeTrafficStateList=[], excludeMTypeList=[]} = res.data.data;
            this.trafficAndmType = {
              excludeTrafficStateList,
              excludeMTypeList
            }
          } else {
            sessFun.messageFun('warning', res.data.MSG)
          }
        }).catch(err => {
            console.log(err);
        });
      })
    },
    // 获取该用户下的配点次数
    getMatchCnt() {
      this.loading = true
      return new Promise((resolve)=>{
        api.getApi("/addsp/match/getMatchCnt?apID="+this.apID).then(res => {
          if (res.data.SysCode == 200200) {
            this.matchCnt = res.data.data||0
            this.loading = false
            resolve(true)
          } else {
            sessFun.messageFun('warning', res.data.MSG)
          }
        }).catch(err => {
            console.log(err);
        });
      })
    },
    // 重新配点
    rematchPoint() {
      this.$confirm(this.sessionData.uType=='BD'?'本次配点结果质量高，重新配点可能会错失最优点位配置':'重新配点会清除原配点结果信息',
        "确定放弃本次配点结果吗？", {
        confirmButtonText: "确 定",
        dangerouslyUseHTMLString: true,
        type: "warning",
        showCancelButton: true,
        closeOnClickModal:false,
        closeOnPressEscape: false,
        showClose: false,
        customClass: 'messageBoxCustom'
      })
      .then((_) => {
        this.matched = false
        this.showAsignPointTableData = false
        this.$emit('openAddPoint')
      })
      .catch(() => {
        sessFun.messageFun('info','已取消')
      });
    },
    // 配点结果添加到购物车
    merge2ShopList() {
      this.$emit('merge2ShopList', this.asignPointTableData)
      this.showAsignPointTableData = false
      this.$emit('closeAddPoint')
    },
    // 销售保存配点结果到方案中
    BDSaveMatchToPlan() {
      this.$confirm('即将以本次配点结果覆盖方案中现有的点位，原保存的点位将被移除！',
        "是否保存配点？", {
        confirmButtonText: "确 定",
        dangerouslyUseHTMLString: true,
        type: "warning",
        showCancelButton: true,
        closeOnClickModal:false,
        closeOnPressEscape: false,
        showClose: false,
        customClass: 'messageBoxCustom'
      })
      .then((_) => {
        this.$emit('merge2ShopList', this.asignPointTableData)
        this.showAsignPointTableData = false
        this.$emit('closeAddPoint')
      })
      .catch(() => {
        sessFun.messageFun('info','已取消保存')
      });
    },
    // 获取意向信息
    getIntentionInfo() {
      this.loading = true
      api.getApi("/addsp/proposal/getSummarize?apID="+this.apID).then(res => {
          if (res.data.SysCode == 200200) {
            this.loading = false
            Object.assign(this.intentionInfo, res.data.data)
          } else {
            sessFun.messageFun('warning', res.data.MSG)
          }
      }).catch(err => {
          console.log(err);
      });
    },
    // 意向小区列表
    getIntentionList() {
      api.getApi("/addsp/proposal/getProposalResInfo?apID="+this.apID).then(res => {
          if (res.data.SysCode == 200200) {
              this.showDialogTable = true
              this.intentionTableData = res.data.data
          } else {
              sessFun.messageFun('warning', res.data.MSG)
          }
      }).catch(err => {
          console.log(err);
      });
    },
    // 配点
    matchRes() {
      let params = {}
      if(this.formDataObj.aFaceRateChecked && this.sessionData.uType == 'MD') {
        params.aFaceRate = this.formDataObj.aFaceRate||0
      } else if(this.sessionData.uType == 'BD') {
        params.aFaceRate = this.formDataObj.aFaceRate||50
      }
      this.formDataObj.pointDemand.forEach(item => {
        params[item] = true
      });
      console.log('formDataObj', this.formDataObj, params)
      new Promise((resolve, reject)=>{
        api.postApi_json("/addsp/match/matchRes", {
          ...params,
          "apID": this.apID,
          "isSingleMediaChoose": params.isSingleMediaChoose||false,
          "apExclude": this.formDataObj.apExclude,
          "adLimits": this.formDataObj.adLimits,
          "isSingleConnectChoose": params.isSingleConnectChoose||false,
          "isSpaceTimeLongFirst": params.isSpaceTimeLongFirst||false,
          "allMatch": this.formDataObj.matchRange*1,
          "excludeMTypeList": this.formDataObj.excludeMTypeList,
          "excludeTrafficStateList": this.formDataObj.excludeTrafficStateList
        }).then(res => {
          if (res.data.SysCode == 200200) {
            resolve(res.data.data)
            // 获取销售已配点次数
            this.sessionData.uType=='BD' && this.getMatchCnt()
          } else {
            sessFun.messageFun('warning', res.data.MSG)
          }
        }).catch(err => {
          console.log(err);
        })
      }).then((matchRes)=>{
        this.$confirm(`计划投放<span style='color: #1890ff'> ${matchRes.planAdSpaceCount} </span>个点位，成功<span style='color: #1890ff'> ${matchRes.faceCount} </span>个，失败<span style='color: rgba(250, 173, 20, 1)'> ${matchRes.planAdSpaceCount-matchRes.faceCount} </span>个`,
          "恭喜您，配点成功！", {
          confirmButtonText: "查看详情",
          dangerouslyUseHTMLString: true,
          type: "success",
          showCancelButton: false,
          closeOnClickModal:false,
          closeOnPressEscape: false,
          showClose: false,
          customClass: 'messageBoxCustom'
        }).then(() => {
          this.dialogMatchRangeFormVisible = false
          this.getSuccessPoint(matchRes)
        })
      })
    },
    // 查询配点结果概要
    getMatchSummary(apID) {
      return new Promise((resolve)=>{
        api.getApi("/addsp/match/matchSummary?apID="+apID).then(res => {
          if (res.data.SysCode == 200200) {
            Object.assign(this.tipObj, res.data.data)
            if(Array.isArray(this.tipObj.proposalCountGroup)) {
              this.tipObj.proposalCountGroup.forEach(item=>{
                if(item.resPdNum == 1) {
                  this.tipObj.selectLab1 = item.resCount||0
                } else if(item.resPdNum == 2) {
                  this.tipObj.selectLab2 = item.resCount||0
                } else if(item.resPdNum == 3){
                  this.tipObj.selectLab3 = item.resCount||0
                }
              })
            }
            resolve(true)
          } else {
            sessFun.messageFun('warning', res.data.MSG)
          }
        }).catch(err => {
          console.log(err);
        })
      })
    },
    // 查询配点成功结果
    async getSuccessPoint(matchRes) {
      if(matchRes) {
        // 首次配点
        Object.assign(this.tipObj, matchRes)
        if(Array.isArray(this.tipObj.proposalCountGroup)) {
          this.tipObj.proposalCountGroup.forEach(item=>{
            if(item.resPdNum == 1) {
              this.tipObj.selectLab1 = item.resCount||0
            } else if(item.resPdNum == 2) {
              this.tipObj.selectLab2 = item.resCount||0
            } else if(item.resPdNum == 3){
              this.tipObj.selectLab3 = item.resCount||0
            }
          })
        }
      } else {
        // 查看已配点方案的配点详情
        await this.getMatchSummary(this.apID)
        this.intentionInfo.resPdNumGroup = this.tipObj.proposalCountGroup||[]
        this.intentionInfo.planResCount = this.tipObj.planResCount||0
      }
      this.showAsignPointTableData = true
      this.asignPointTableLoading = true
      api.getApi("/addsp/match/successProposal?apID="+this.apID).then(res => {
          if (res.data.SysCode == 200200) {
            this.asignPointTableData = res.data.data||[]
            let getAdPrice = (data)=>{
              if(!data.asPrice) return 0
              if (data.mVehicle === '道闸') {
                return data.asPrice / 100
              } else {
                if (data.asPrice) {
                  return data.asPrice / 700
                } else {
                  if (data.grade === 'A') {
                    return 3080 / 7
                  } else if (data.grade === 'B') {
                    return 2380 / 7
                  } else if (data.grade === 'C') {
                    return 1800 / 7
                  } else {
                    return 1900 / 7
                  }
                }
              }
            }
            for(let i=0; i<this.asignPointTableData.length; i++) {
              let item = this.asignPointTableData[i]
              item.asIDs = item.asID
              item.asLabs = item.asLab
              item.buildPrice = item.hPrice/100
              item.buildType = item.cType
              item.origin = item.region
              item.mediaName = item.mTitle
              item.mediaLevel = item.grade || ''
              item.schedules = timeFormat.toDate(item.pdStartDate, '/') + '-' + timeFormat.toDate(item.pdEndDate, '/')//item.pdStartDate + '-' + item.pdEndDate
              item.adLimit = item.notPush
              item.mapCenter = item.mapCenter||'--'     // 地图中心点名称
              item.reference = ''
              item.rid = item.cityCode
              item.address = item.address || ''
              item.dNum = item.dNum || ''             // 出入口数
              item.houseNum = item.hNum
              item.buildNum = item.fNum
              item.liveYear = item.chDay
              item.A_B = item.asLab
              item.checkBox = {A: item.asLab=='A'?true:false, B: item.asLab=='B'?true:false, ABC: item.asLab=='ABC'?true:false}
              item.box = {A: false,B: false}
              item.connData = { connectResName: '', connectMedia: '', commentWorkRes:'', commentworkMedia:''}
              item.connID = item.connID || ''      // 连排门id
              item.industryInfos = item.industryInfos||[]   // 同行业资源回避
              item.adPrice = getAdPrice(item)               // 点位价格
              item.mediaLevel = item.mediaLevel        // 媒体等级
              item.asrID = item.asrID               // 所属公司id
              item.asName = item.asName               // 所属公司名称
              item.remark = item.remark
              item.trafficState = item.trafficState || ''
              item.electrifyState = item.electrifyState || ''
            }
            this.asignPointTableLoading = false
          } else {
            sessFun.messageFun('warning', res.data.MSG)
          }
        }).catch(err => {
          console.log(err);
        })
    },
    // 查询配点失败结果
    getFailRes() {
      api.getApi("/addsp/match/failProposal?apID="+this.apID).then(res => {
          if (res.data.SysCode == 200200) {
            this.failTableData = res.data.data||[]
            this.showFailDialogTable = true
          } else {
            sessFun.messageFun('warning', res.data.MSG)
          }
        }).catch(err => {
          console.log(err);
        })
    },
    // 下载配点结果（成功和失败）
    downLoadMatchResult() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      api.getApi_file("/addsp/match/export?apID="+this.apID).then(res=>{
          let blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'});
          let downloadElement = document.createElement('a');
          let href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = decodeURIComponent(res.headers['content-disposition']).split('=')[1]; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
          loading.close()
      })
    },
    // 下载意向小区
    export2Excel() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        require.ensure([], () => {
            const { export_json_to_excel } = require('../../../vendorExcel/Export2Excel');
            const tHeader = ['资源', '城市', '区域', '排期', '媒体数量（门）',  '计划投放数量（面）'];
            const filterVal = ['resName', 'city', 'region', 'period', 'resMediaCount', 'planPdNum'];
            const data = this.formatJson(filterVal, this.intentionTableData);
            export_json_to_excel(tHeader, data, '意向小区');
            loading.close()
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => j=='period'?`${v.pdStartDate}-${v.pdEndDate}`:v[j])
      );
    },
    handleClose(done) {
      this.$emit('closeAddPoint')
    },
    closeAsignPointTable() {
      if(this.matched) {
        this.showAsignPointTableData = false
        return
      }
      this.$confirm('关闭后，所配点位将被清除',
        "是否取消配点？", {
        confirmButtonText: "确 定",
        dangerouslyUseHTMLString: true,
        type: "warning",
        showCancelButton: true,
        closeOnClickModal:false,
        closeOnPressEscape: false,
        showClose: false,
        customClass: 'messageBoxCustom'
      })
      .then((_) => {
        this.showAsignPointTableData = false;
      })
      .catch(() => {
        sessFun.messageFun('info','已取消')
      });
    },
    deleteAsignItem(scope, currentPage, currentPageSize) {
      this.asignPointTableLoading = true
      api.getApi("/addsp/match/removeSpace?id="+scope.row.id).then(res => {
          if (res.data.SysCode == 200200) {
            this.getMatchSummary(this.apID)
            this.asignPointTableData.splice((currentPage-1)*currentPageSize+scope.$index*1, 1)
            this.asignPointTableLoading = false
          } else {
            sessFun.messageFun('warning', res.data.MSG)
          }
      }).catch(err => {
          console.log(err);
      });
    }
  },
};
</script>
<style lang="scss">
.messageBoxCustom {
  padding: 24px 24px;
  .el-button--primary {
    background-color: rgba(24, 144, 255, 1);
  }
  .el-message-box__header {
    padding: 0;
    .el-message-box__title {
      padding-left: 41px;
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
    }
  }
  .el-message-box__content {
    padding: 8px 0 24px;
    .el-message-box__status {
      position: absolute;
      top: -20px;
    }
    .el-message-box__message p {
      font-size: 14px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
    }
  }
  .el-message-box__status+.el-message-box__message {
    padding-left: 40px;
  }
  .el-message-box__status::before {
    padding-left: 0;
  }
  .el-message-box__btns {
    padding: 0;
  }
}
</style>
<style lang="scss" scoped>
@import '../../../assets/component.scss';
/deep/ .match-range-dialog {
  .el-dialog__header {
    padding-bottom: 6px;
    border: none !important;
  }
  .el-dialog__body {
    border: none;
    .content-tip {
      margin-bottom: 16px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 24px;
    }
    .el-radio {
      margin-right: 24px;
    }
    .el-radio__label {
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
    }
  }
  .el-dialog__footer {
    padding-top: 24px;
    padding-bottom: 24px;
  }
}
/deep/ .add-point-dialog {
  .el-checkbox {
    line-height: 27px;
  }
  .el-checkbox__label {
    padding-left: 8px;
  }
  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: rgba(0, 0, 0, 0.65);
  }
  .el-input-number--mini .el-input-number__decrease, .el-input-number--mini .el-input-number__increase {
    width: 20px;
  }
  .el-dialog__footer {
    .el-button+.el-button {
      margin-left: 10px;
    }
  }
  .el-form-item {
    .el-form-item__label {
      padding: 0;
      color: rgba(0, 0, 0, 0.65);
    }
  }
  .el-checkbox-group {
    display: flex;
    flex-flow: column;
  }
  .el-input__inner{
    height: 32px;
  }
  .board {
    padding: 16px 0;
    & + .board {
      border-top: 1px solid rgba(233, 233, 233, 1);
    }
    .board-title {
      line-height: 24px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }
  }
  .board1 .info-item {
    display: flex;
    margin-top: 8px;
    .active {
      color: rgba(24, 144, 255, 1);
      cursor: pointer;
    }
    .item-content.ellipsis {
      width: 290px;
      display: inline-block;
      vertical-align: text-bottom;
      overflow: hidden;
    }
  }
  .board2 {
    padding-bottom: 16px;
    .el-form-item {
      margin-bottom: 0;
    }
    .el-form-item__label {
      margin-bottom: 8px;
      line-height: 24px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }
    .el-form-item__content {
      line-height: 32px;
    }
    .el-input-number {
      width: unset;
      line-height: 28px;
      margin: 0;
      .el-input__inner {
        width: 64px;
        height: 28px;
        padding: 0 28px 0 8px;
        line-height: 28px;
        text-align: center;
      }
    }
  }
  .board3 {
    .board-title {
      margin-bottom: 2px;
    }
    .el-form-item {
      margin-bottom: 0;
      .el-form-item__label {
        line-height: 44px;
      }
      .el-form-item__content {
        line-height: 44px;
      }
      .el-select {
        width: 100%;
        .el-input__inner {
          width: 100%;
        }
      }
    }
  }
}
.table-top-comment {
  display: flex;
  align-items: baseline;
  margin: 0 0 16px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
  h4 {
    font-size: 14px;
    display: inline-block;
  }
  .active {
    color: rgba(24, 144, 255, 1);
    cursor: pointer;
  }
  .comment-item {
    margin-right: 16px;
  }
  .tip-active {
    font-size: 14px;
    font-weight: 400;
    margin: 0 6px;
    cursor: pointer;
    color: #1890ff;
    &.right {
      margin-left: auto;
    }
    &.warn {
      color: rgba(250, 102, 20, 1);
    }
  }
}
.table-top-tip {
  display: flex;
  align-items: baseline;
  margin: 0 0 16px;
  padding: 8px;
  border: 1px solid #bae7ff;
  border-radius: 4px;
  background: #e6f7ff;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
  .el-icon-info {
    color: #1890ff;
    margin-right: 4px;
  }
  h4 {
    font-size: 14px;
    display: inline-block;
  }
  .tip-active {
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    color: #1890ff;
    &.right {
      margin-left: auto;
    }
    &.warn {
      color: rgba(250, 102, 20, 1);
    }
  }
  .tip-active-handle {
    font-weight: 400;
  }
  .divide-border {
    display: inline-block;
    width: 1px;
    height: 14px;
    margin: 0 8px;
    background: rgba(0, 0, 0, 0.1);
  }
}
.merge-btn {
  padding: 0 10px;
}
.cell-ellipsis {
  min-width: 30px;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
