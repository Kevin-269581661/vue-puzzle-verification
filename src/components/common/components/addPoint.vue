<template>
  <div>
    <el-dialog
      title="智能配点"
      :visible.sync="dialogVisible"
      width="418px"
      :show-close="false"
      :before-close="handleClose"
      :close-on-click-modal="false"
      custom-class="add-point-dialog"
      center
    >
      <div v-loading="loading">
        <div class="board board1">
          <div class="board-title">配点信息</div>
          <ul class="info-list">
            <li class="info-item">
              <span class="item-label">意向投放小区：</span>
              <span class="item-content">
                {{ intentionInfo.planResCount||'--' }}个
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
                {{ `${intentionInfo.pdStartDate}~${intentionInfo.pdEndDate}` }}
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
                <el-checkbox
                  label="isSpaceTimeLongFirst"
                  name="type"
                >优先选择空置久的点位</el-checkbox>
                <el-checkbox label="isSingleMediaChoose" name="type">1个门选择1个点位</el-checkbox>
                <el-checkbox label="isSingleConnectChoose" name="type">联排门仅选1面</el-checkbox>
              </el-checkbox-group>
              <div>
                <el-checkbox
                  v-model="formDataObj.aFaceRateChecked"
                  class="combination"
                  name="type"
                >A面占比(%)</el-checkbox>
                <el-input-number v-model="formDataObj.aFaceRate" controls-position="right" size="mini" :min="0" :max="100"></el-input-number>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="board board3">
          <div class="board-title">点位排斥</div>
          <el-form label-position="left" label-width="82px">
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :disabled="loading" type="primary" @click="matchRes"
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
      width="83%"
    >
      <div slot="topTip" class="table-top-tip">
        <i class="el-icon-info" style="color: #1890ff"></i>
        <h4>
          <span>
            意向小区共
            <span class="tip-active">{{
              intentionInfo.planResCount || ""
            }}</span>
            <template v-for="(item, index) in intentionInfo.resPdNumGroup">
              <span :key="index">
                个，选{{ item.resPdNum }}面的小区
                <span class="tip-active">{{ item.resCount }}</span>
              </span>
            </template>
          </span>
        </h4>
        <span class="tip-active right" @click="export2Excel">下载</span>
      </div>
      <template slot="dialogFooter" class="dialog-footer">
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
      width="83%"
    >
      <div slot="topTip">
        <span class="table-top-comment">
          意向投放小区：<span>{{
            tipObj.planResCount
          }}</span>
          <span class="active comment-item" @click="getIntentionList">查看</span>
          计划投放点位：<span class="comment-item">{{ tipObj.planAdSpaceCount }}</span
          >个 客户预算：<span class="comment-item">{{ (tipObj.customerBudget/100) | moneyFormat("¥") }}</span>
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
              选2面:<span class="tip-active">{{ tipObj.selectLab2 }}</span>
              选择3面:<span class="tip-active">{{ tipObj.selectLab3 }}</span
              >)
              <div class="divide-border"></div>
              媒体:<span class="tip-active">{{ tipObj.mediaCount }}</span>
              <div class="divide-border"></div>
              点位:<span class="tip-active">{{ tipObj.faceCount }}</span>
              (A面:<span class="tip-active">{{ tipObj.afaceCount }}</span>
              B面:<span class="tip-active">{{ tipObj.bfaceCount }}</span
              >)
              <div class="divide-border"></div>
              上刊率50%以上的点位:<span class="tip-active">{{
                tipObj.underHalfSpaceRate
              }}</span>
              <div class="divide-border"></div>
              配点失败小区<span class="tip-active warn">{{
                tipObj.failResCount
              }}</span
              >个
            </span>
          </h4>
          <span class="tip-active right" @click="getFailRes"
            >失败小区</span
          >
          <div class="divide-border"></div>
          <span class="tip-active" @click="downLoadMatchResult">下载结果</span>
        </div>
      </div>
      <template slot="aheadColumn">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item label="商圈：">
                <div class="cell-ellipsis" style="width: 80px">
                  <span class="cell-ellipsis">{{ props.row.tradingArea||'' }}</span>
                </div>
              </el-form-item>
              <el-form-item label="楼栋数量：">
                <div class="cell-ellipsis" style="width: 80px">
                  <span class="cell-ellipsis">{{ props.row.fNum||'' }}</span>
                </div>
              </el-form-item>
              <el-form-item label="资产编号：">
                <div class="cell-ellipsis" style="width: 80px">
                  <span class="cell-ellipsis">{{ props.row.assetTag||'' }}</span>
                </div>
              </el-form-item>
              <el-form-item label="入住年份：">
                <div class="cell-ellipsis" style="width: 80px">
                  <span class="cell-ellipsis">{{ props.row.chDay||'' }}</span>
                </div>
              </el-form-item>
              <el-form-item label="广告限制：">
                <div class="cell-ellipsis" style="width: 80px">
                  <span class="cell-ellipsis">{{ props.row.notPush||'' }}</span>
                </div>
              </el-form-item>
              <el-form-item label="巡点问题：">
                <div class="cell-ellipsis" style="width: 80px">
                  <span class="cell-ellipsis">{{ props.row.remark||'' }}</span>
                </div>
              </el-form-item>
              <el-form-item label="通行情况：">
                <div class="cell-ellipsis" style="width: 80px">
                  <span class="cell-ellipsis">{{ props.row.trafficState||'' }}</span>
                </div>
              </el-form-item>
              <el-form-item label="通电情况：">
                <div class="cell-ellipsis" style="width: 80px">
                  <span class="cell-ellipsis">{{ props.row.electrifyState||'' }}</span>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </template>
      <el-table-column slot="otherColumn" label="操作" align="left">
        <template slot-scope="scope">
          <el-button
            style="text-align: left"
            type="text"
            size="small"
            @click="deleteAsignItem(scope)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <template slot="dialogFooter" class="dialog-footer">
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
    </dialog-table>
    <dialog-table
      :tableData="failTableData"
      :tableColumn="failTableColumn"
      :visible="showFailDialogTable"
      @closeDialog="showFailDialogTable = false"
      title="配点失败小区"
      width="83%"
    >
      <template slot="aheadColumn">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item label="商圈：">
                <div class="cell-ellipsis" style="width: 80px">
                  <span class="cell-ellipsis">{{ props.row.tradingArea||'' }}</span>
                </div>
              </el-form-item>
              <el-form-item label="楼栋数量：">
                <div class="cell-ellipsis" style="width: 80px">
                  <span class="cell-ellipsis">{{ props.row.fNum||'' }}</span>
                </div>
              </el-form-item>
              <el-form-item label="资产编号：">
                <div class="cell-ellipsis" style="width: 80px">
                  <span class="cell-ellipsis">{{ props.row.assetTag||'' }}</span>
                </div>
              </el-form-item>
              <el-form-item label="入住年份：">
                <div class="cell-ellipsis" style="width: 80px">
                  <span class="cell-ellipsis">{{ props.row.chDay||'' }}</span>
                </div>
              </el-form-item>
              <el-form-item label="广告限制：">
                <div class="cell-ellipsis" style="width: 80px">
                  <span class="cell-ellipsis">{{ props.row.notPush||'' }}</span>
                </div>
              </el-form-item>
              <el-form-item label="巡点问题：">
                <div class="cell-ellipsis" style="width: 80px">
                  <span class="cell-ellipsis">{{ props.row.remark||'' }}</span>
                </div>
              </el-form-item>
              <el-form-item label="通行情况：">
                <div class="cell-ellipsis" style="width: 80px">
                  <span class="cell-ellipsis">{{ props.row.trafficState||'' }}</span>
                </div>
              </el-form-item>
              <el-form-item label="通电情况：">
                <div class="cell-ellipsis" style="width: 80px">
                  <span class="cell-ellipsis">{{ props.row.electrifyState||'' }}</span>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </template>
      <template slot="dialogFooter" class="dialog-footer">
        <el-button @click="showFailDialogTable = false">关 闭</el-button>
      </template>
    </dialog-table>
  </div>
</template>

<script>
import api from "../../../api/api";
// 时间格式化
import timeFormat from "../../../commonFun/timeFormat.js";
import sessFun from "../../../commonFun/sessFun.js";
import dialogTable from "./dialogTable.vue";
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
    }
  },
  components: {
    dialogTable,
  },
  data() {
    return {
      matched: false,
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
      formDataObj: {
        pointDemand: [],
        aFaceRate: 50,
        aFaceRateChecked: false,
        apExclude: "",
        adLimits: []
      },
      tipObj: {},
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
          value: (row)=>`${row.pdStartDate}~${row.pdEndDate}`
        },
        {
          label: "媒体数量（门）",
          prop: "resMediaCount",
          width: "120px",
          align: "right",
        },
        {
          label: "计划投放数量（面）",
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
          label: "已配/计划",
          prop: "mediaNum",
          width: "120px",
          value: (row)=>`${row.actualPdNum}/${row.planPdNum}`,
          align: "right"
        },
        {
          label: "媒体名称",
          prop: "mTitle",
          width: "160px",
          align: "right"
        },
        {
          label: "投放面",
          prop: "asLab",
          width: "160px",
          value: (row)=>`${row.asLab}面`,
          align: "right"
        },
        {
          label: "近3月上刊率",
          prop: "publishRate",
          width: "160px",
          value: (row)=>`${(row.publishRate||0)*100}`
        },
      ],
    };
  },
  watch: {
    dialogVisible(val) {
      val && this.getIntentionInfo()
    },
    showMatchResult(val) {
      val && (this.matched = true) && this.getSuccessPoint()
    }
  },
  created() {
    
  },
  mounted() {
  },
  methods: {
    // 重新配点
    rematchPoint() {
      this.$confirm('重新配点会使原购物车里的点位被覆盖',
        "是否重新配点？", {
        confirmButtonText: "确 定",
        dangerouslyUseHTMLString: true,
        type: "warning",
        showCancelButton: true,
        closeOnClickModal:false,
        closeOnPressEscape: false,
        showClose: false
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
    // 获取意向信息
    getIntentionInfo() {
      this.loading = true
      api.getApi("/addsp/proposal/getSummarize?apID="+this.apID).then(res => {
          if (res.data.SysCode == 200200) {
            this.loading = false
            Object.assign(this.intentionInfo, res.data.data)
          } else {
            this.messageFun('warning', res.data.MSG)
          }
      }).catch(err => {
          console.log(err);
      });
    },
    // 意向小区列表
    getIntentionList() {
      api.getApi("/addsp/proposal/getProposalResInfo?apID="+this.apID+'&pageNo=1&pageSize=10').then(res => {
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
      if(this.formDataObj.aFaceRateChecked) {
        params.aFaceRate = this.formDataObj.aFaceRate||0
      }
      this.formDataObj.pointDemand.forEach(item => {
        params[item] = true
      });
      new Promise((resolve, reject)=>{
        api.postApi_json("/addsp/match/matchRes", {
          ...params,
          "apID": this.apID,
          "isSingleMediaChoose": params.isSingleMediaChoose||false,
          "apExclude": this.formDataObj.apExclude,
          "adLimits": this.formDataObj.adLimits,
          "isSingleConnectChoose": params.isSingleConnectChoose||false,
          "isSpaceTimeLongFirst": params.isSpaceTimeLongFirst||false
        }).then(res => {
          if (res.data.SysCode == 200200) {
            resolve(res.data.data)
          } else {
            sessFun.messageFun('warning', res.data.MSG)
          }
        }).catch(err => {
          console.log(err);
        })
      }).then((matchRes)=>{
        this.$confirm(`计划投放<span style='color: #1890ff'>${matchRes.planAdSpaceCount}</span>个点位，成功<span style='color: #1890ff'>${matchRes.faceCount}</span>个，失败<span style='color: rgba(250, 173, 20, 1)'>${matchRes.planAdSpaceCount-matchRes.faceCount}</span>个`,
          "恭喜您，配点成功！", {
          confirmButtonText: "查看详情",
          dangerouslyUseHTMLString: true,
          type: "success",
          showCancelButton: false,
          closeOnClickModal:false,
          closeOnPressEscape: false,
          showClose: false
        }).then(() => {
          this.getSuccessPoint(matchRes)
        })
      })
    },
    // 查询配点结果概要
    getMatchSummary(apid) {
      api.getApi("/addsp/match/matchSummary?apID="+this.apID).then(res => {
          if (res.data.SysCode == 200200) {
            this.tipObj = res.data.data
          } else {
            sessFun.messageFun('warning', res.data.MSG)
          }
        }).catch(err => {
          console.log(err);
        })
    },
    // 查询配点成功结果
    getSuccessPoint(matchRes) {
      if(matchRes) {
        // 首次配点
        this.tipObj = matchRes
      } else {
        // 查看已配点方案的配点详情
        this.getMatchSummary(this.apid)
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
            // this.asignPointTableData=this.asignPointTableData.concat(this.asignPointTableData)
            // this.asignPointTableData=this.asignPointTableData.concat(this.asignPointTableData)
            // this.asignPointTableData=this.asignPointTableData.concat(this.asignPointTableData)
            // this.asignPointTableData=this.asignPointTableData.concat(this.asignPointTableData)
            console.time('zhihuan')
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
              item.mapCenter = ''     // 地图中心点名称
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
            console.timeEnd('zhihuan')
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
        // require.ensure([], () => {
        //     const { export_json_to_excel } = require('../../vendorExcel/Export2Excel');
        //     const tHeader = ['资源', '城市', '区域', '排期', '媒体数量（门）',  '计划投放数量（面）'];
        //     const filterVal = ['resName', 'city', 'region', 'period', 'resMediaCount', 'planPdNum'];
        //     const list = this.currentSetpoint;
        //     const data = this.formatJson(filterVal, list);
        //     export_json_to_excel(tHeader, this.intentionTableData, '意向小区');
        //     loading.close()
        // })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => v[j])
      );
    },
    handleClose(done) {
      this.$emit('closeAddPoint')
      /* this.$confirm("确认关闭？")
        .then((_) => {
          // done();
        })
        .catch((_) => {}); */
    },
    closeAsignPointTable() {
      this.$confirm('关闭后，所配点位将被清除',
        "是否取消配点？", {
        confirmButtonText: "确 定",
        dangerouslyUseHTMLString: true,
        type: "warning",
        showCancelButton: true,
        closeOnClickModal:false,
        closeOnPressEscape: false,
        showClose: false
      })
      .then((_) => {
        this.showAsignPointTableData = false;
      })
      .catch(() => {
        sessFun.messageFun('info','已取消')
      });
    },
    deleteAsignItem(scope) {
      this.asignPointTableLoading = true
      api.getApi("/addsp/match/removeSpace?id="+scope.row.id).then(res => {
          if (res.data.SysCode == 200200) {
            this.getMatchSummary(this.apid)
            console.log('deleteAsignItem', scope)
            console.time('splice')
            this.asignPointTableData.splice(scope.$index, 1)

            console.timeEnd('splice')
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

<style lang="scss" scoped>
/deep/ .add-point-dialog {
  .el-dialog__header {
    text-align: left;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
  }
  .el-dialog__header {
    padding: 16px 24px;
  }
  .el-dialog__body {
    padding: 0 24px;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
  }
  .el-dialog__footer {
  }
  .el-form-item {
    .el-form-item__label {
      padding-left: 0;
      color: rgba(0, 0, 0, 0.65);
    }
  }
  .el-checkbox-group {
    display: flex;
    flex-flow: column;
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
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .board2 {
    padding-bottom: 16px;
    .el-form-item {
      margin-bottom: 0;
    }
    .el-form-item__label {
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
        width: 100px;
        height: 28px;
        line-height: 28px;
      }
    }
    .combination {
    }
  }
  .board3 {
    .el-form-item {
      margin-bottom: 0;
      .el-form-item__label {
        line-height: 46px;
      }
    }
  }
}
.table-top-comment {
  display: flex;
  align-items: baseline;
  margin: 0 0 16px;
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
    font-weight: normal;
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
  padding: 9.5px;
  border: 1px solid #bae7ff;
  border-radius: 4px;
  background: #e6f7ff;
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
    font-weight: normal;
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
  .divide-border {
    display: inline-block;
    vertical-align: middle;
    width: 1px;
    height: 14px;
    margin: 0 12px;
    background: rgba(0, 0, 0, 0.1);
  }
}
.merge-btn {
  padding: 0 10px;
}
.cell-ellipsis {
  width: 132px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
