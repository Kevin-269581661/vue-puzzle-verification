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
      <div>
        <div class="board board1">
          <div class="board-title">配点信息</div>
          <ul class="info-list">
            <li class="info-item">
              <span class="item-label">意向投放小区：</span>
              <span class="item-content">
                80个
                <span class="active" @click="showDialogTable = true">查看</span>
              </span>
            </li>
            <li class="info-item">
              <span class="item-label">计划投放点位：</span>
              <span class="item-content"> 100 个 </span>
            </li>
            <li class="info-item">
              <span class="item-label">客户预算：</span>
              <span class="item-content"> ¥3,000,000 </span>
            </li>
            <li class="info-item">
              <span class="item-label">投放排期：</span>
              <span class="item-content"> 2021年3月29日 - 2021年4月28日 </span>
            </li>
            <li class="info-item">
              <span class="item-label">投放排期：</span>
              <span class="item-content"> 2021年3月29日 - 2021年4月28日 </span>
            </li>
            <li class="info-item">
              <span class="item-label">客户要求：</span>
              <span class="item-content ellipsis">
                客户要求广告门朝向必须朝南
              </span>
            </li>
          </ul>
        </div>

        <div class="board board2">
          <el-form label-position="top" label-width="82px">
            <el-form-item label="配点要求">
              <el-checkbox-group v-model="formDataObj.pointDemand">
                <el-checkbox
                  label="优先选择空置久的点位"
                  name="type"
                ></el-checkbox>
                <el-checkbox label="1个门选择1个点位" name="type"></el-checkbox>
                <el-checkbox label="联排门仅选1面" name="type"></el-checkbox>
              </el-checkbox-group>
              <el-checkbox
                class="combination"
                label="A面占比"
                disabled
                name="type"
              ></el-checkbox>
            </el-form-item>
          </el-form>
        </div>
        <div class="board board3">
          <div class="board-title">点位排斥</div>
          <el-form label-position="left" label-width="82px">
            <el-form-item label="方案名称：">
              <el-select
                size="mini"
                v-model="formDataObj.planName"
                placeholder="请选择方案"
              >
                <el-option
                  v-for="item in excludePlanList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="广告限制：">
              <el-select
                v-model="formDataObj.region"
                placeholder="请选择广告限制"
              >
                <el-option
                  v-for="item in excludePlanList"
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
        <el-button type="primary" @click="showAsignPointTableData=true"
          >配 点</el-button
        >
      </span>
    </el-dialog>
    <dialog-table
      :tableData="intentionTableData"
      :tableColumn="intentionTableColumn"
      :visible="showDialogTable"
      @closeDialog="handleDialogClose('showDialogTable')"
      title="意向投放小区"
      width="83%"
    >
      <div slot="topTip" class="table-top-tip">
        <i class="el-icon-info" style="color: #1890ff"></i>
        <h4>
          <span>
            意向小区共
            <span class="tip-active">{{tipObj.intentionNeighbourhood}}</span>
            个，选1面的小区
            <span class="tip-active">{{tipObj.selectLab1}}</span>
            个，选2面的小区
            <span class="tip-active">{{tipObj.selectLab2}}</span>
            个，选3面的小区
            <span class="tip-active">{{tipObj.selectLab3}}</span>
            个，更多面的小区 
            <span class="tip-active">{{tipObj.selectLabOther}}</span>
            个
          </span>
        </h4>
        <span class="tip-active right">下载</span>
      </div>
      <template slot="dialogFooter" class="dialog-footer">
        <el-button @click="handleDialogClose('showDialogTable')">关 闭</el-button>
      </template>
    </dialog-table>
    <dialog-table
      :tableData="asignPointTableData"
      :tableColumn="asignPointTableColumn"
      :visible="showAsignPointTableData"
      @closeDialog="handleDialogClose('showAsignPointTableData')"
      title="配点结果详情"
      width="83%"
    >
      <div slot="topTip">
        <span>
          意向投放小区：<span class="tip-active">{{tipObj.intentionNeighbourhood}}</span>
          <span class="active" @click="showDialogTable = true">查看</span>
          计划投放点位：<span class="tip-active">{{tipObj.selectLab1}}</span>个
          客户预算：<span class="tip-active">{{tipObj.selectLab2}}</span>
          客户要求：<span class="tip-active">{{tipObj.selectLab3}}</span>
        </span>
        <div class="table-top-tip">
          <i class="el-icon-info" style="color: #1890ff"></i>
          <h4>
            <span>
              小区:<span class="tip-active">{{tipObj.intentionNeighbourhood}}</span>
              (选1面:<span class="tip-active">{{tipObj.selectLab1}}</span>
              选2面:<span class="tip-active">{{tipObj.selectLab2}}</span>
              选择3面:<span class="tip-active">{{tipObj.selectLab3}}</span>)
              <div class="divide-border"></div>
              媒体:<span class="tip-active">{{tipObj.selectLabOther}}</span>
              <div class="divide-border"></div>
              点位:<span class="tip-active">{{tipObj.selectLabOther}}</span>
              (A面:<span class="tip-active">{{tipObj.selectLabOther}}</span>
              B面:<span class="tip-active">{{tipObj.selectLabOther}}</span>)
              <div class="divide-border"></div>
              上刊率50%以上的点位:<span class="tip-active">{{tipObj.selectLabOther}}</span>
              <div class="divide-border"></div>
              配点失败小区<span class="tip-active warn">{{tipObj.selectLabOther}}</span>个
            </span>
          </h4>
          <span class="tip-active right" @click="showFailDialogTable=true">失败小区</span>
          <div class="divide-border"></div>
          <span class="tip-active">下载结果</span>
        </div>
      </div>
      <template slot="aheadColumn">
        <el-table-column type="expand">
          <template slot-scope="props">
              <el-form label-position="left" inline>
                <el-form-item label="商圈：">
                    <div class="cell-ellipsis" style="width: 80px;">
                        <span class="cell-ellipsis">{{ props.row.resource}}</span>
                    </div>
                </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </template>
      <el-table-column slot="otherColumn" label="操作" align="left">
        <template slot-scope="scope">
          <el-button style="text-align: left;" type="text" size="small" @click="deleteAsignItem(scope)">删除</el-button>
        </template>
      </el-table-column>
      <template slot="dialogFooter" class="dialog-footer">
        <el-button @click="handleDialogClose('showAsignPointTableData')">关 闭</el-button>
        <el-button type="primary" @click="handleDialogClose('showAsignPointTableData')">确定并添加到购物车</el-button>
      </template>
    </dialog-table>
    <dialog-table
      :tableData="failTableData"
      :tableColumn="failTableColumn"
      :visible="showFailDialogTable"
      @closeDialog="showFailDialogTable=false"
      title="配点失败小区"
      width="83%"
    >
      <template slot="aheadColumn">
        <el-table-column type="expand">
          <template slot-scope="props">
              <el-form label-position="left" inline>
                <el-form-item label="商圈：">
                    <div class="cell-ellipsis" style="width: 80px;">
                        <span class="cell-ellipsis">{{ props.row.resource}}</span>
                    </div>
                </el-form-item>
            </el-form>
          </template>
      </el-table-column>
      </template>
      <template slot="dialogFooter" class="dialog-footer">
        <el-button @click="showFailDialogTable=false">关 闭</el-button>
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
    }
  },
  components: {
    dialogTable,
  },
  data() {
    return {
      showDialogTable: false,
      showFailDialogTable: false,
      showAsignPointTableData: false,
      formDataObj: {
        planName: "",
        pointDemand: [],
        excludeAd: [],
        excludePlan: "",
      },
      excludePlanList: [
        {
          label: "排斥方案label",
          value: "排斥方案value",
        },
      ],
      tipObj: {
        intentionNeighbourhood: 10,
        selectLab1: 10,
        selectLab2: 20,
        selectLab3: 30,
        selectLabOther: 60
      },
      intentionTableData: [
        {
          rowKey: 1,
          resource: "尚东峰景雅苑二期",
          city: "广州市",
          area: "海珠区",
          period: "2021/03/20 ~ 2021/04/23",
          mediaNum: 3,
          pointNum: 1,
        },
        {
          rowKey: 2,
          resource: "尚东峰景雅苑二期",
          city: "北京市",
          area: "海淀区",
          period: "2021/03/10 ~ 2021/06/23",
          mediaNum: 6,
          pointNum: 3,
        },
        {
          rowKey: 3,
          resource: "尚东峰景雅苑二期",
          city: "北京市",
          area: "海淀区",
          period: "2021/03/10 ~ 2021/06/23",
          mediaNum: 6,
          pointNum: 3,
        },
      ],
      intentionTableColumn: [
        {
          label: "序号",
          prop: "rowKey",
          width: "92px",
        },
        {
          label: "资源",
          prop: "resource",
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
          prop: "area",
          minWidth: "100px",
          tip: true,
        },
        {
          label: "排期",
          prop: "period",
          minWidth: "160px",
          tip: true,
        },
        {
          label: "媒体数量（门）",
          prop: "mediaNum",
          width: "120px",
          align: "right",
        },
        {
          label: "计划投放数量（面）",
          prop: "pointNum",
          width: "160px",
          align: "right",
        },
      ],
      failTableData: [
        {
          rowKey: 1,
          resource: "尚东峰景雅苑二期",
          city: "广州市",
          area: "海珠区",
          period: "2021/03/20 ~ 2021/04/23",
          mediaNum: 3,
          pointNum: 1,
        },
        {
          rowKey: 2,
          resource: "尚东峰景雅苑二期",
          city: "北京市",
          area: "海淀区",
          period: "2021/03/10 ~ 2021/06/23",
          mediaNum: 6,
          pointNum: 3,
        },
        {
          rowKey: 3,
          resource: "尚东峰景雅苑二期",
          city: "北京市",
          area: "海淀区",
          period: "2021/03/10 ~ 2021/06/23",
          mediaNum: 6,
          pointNum: 3,
        },
      ],
      failTableColumn: [
        {
          label: "序号",
          prop: "rowKey",
          width: "92px"
        },
        {
          label: "资源",
          prop: "resource",
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
          prop: "area",
          minWidth: "100px",
          tip: true
        },
        {
          label: "排期",
          prop: "period",
          minWidth: "160px",
          tip: true
        },
        {
          label: "总媒体数(门)",
          prop: "mediaNum",
          width: "120px",
          align: "right"
        },
        {
          label: "计划投放点位(面)",
          prop: "pointNum",
          width: "160px",
          align: "right"
        },
        {
          label: "已配点位(面)",
          prop: "pointNum",
          width: "160px",
          align: "right"
        },
        {
          label: "失败原因",
          prop: "pointNum",
          width: "160px",
        },
      ],
      asignPointTableData: [{
        rowKey: 1,
        resource: "尚东峰景雅苑二期",
        city: "广州市",
        area: "海珠区",
        period: "2021/03/20 ~ 2021/04/23",
        mediaNum: 3,
        pointNum: 1,
      }, {
        rowKey: 2,
        resource: "尚东峰景雅苑二期",
        city: "北京市",
        area: "海淀区",
        period: "2021/03/10 ~ 2021/06/23",
        mediaNum: 6,
        pointNum: 3,
      }, {
        rowKey: 3,
        resource: "尚东峰景雅苑二期",
        city: "北京市",
        area: "海淀区",
        period: "2021/03/10 ~ 2021/06/23",
        mediaNum: 6,
        pointNum: 3,
      }],
      asignPointTableColumn: [
        {
          label: "序号",
          prop: "rowKey",
          width: "92px"
        },
        {
          label: "资源",
          prop: "resource",
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
          prop: "area",
          minWidth: "100px",
          tip: true
        },
        {
          label: "排期",
          prop: "period",
          minWidth: "160px",
          tip: true
        },
        {
          label: "已配/计划",
          prop: "mediaNum",
          width: "120px",
          align: "right"
        },
        {
          label: "媒体名称",
          prop: "pointNum",
          width: "160px",
          align: "right"
        },
        {
          label: "投放面",
          prop: "pointNum",
          width: "160px",
          align: "right"
        },
        {
          label: "近3月上刊率",
          prop: "pointNum",
          width: "160px",
        },
      ],
    };
  },
  mounted() {
    this.testBigData()
  },
  methods: {
    testBigData() {
      console.time('生成array')
      let temp = [] 
      for(let i=0; i<100000; i++) {
        temp.push({
          rowKey: i,
          resource: "尚东峰景雅苑二期",
          city: "广州市",
          area: "海珠区",
          period: "2021/03/20 ~ 2021/04/23",
          mediaNum: 3,
          pointNum: 1,
        })
      }
      this.asignPointTableData = temp
      console.timeEnd('生成array')
      
      console.time('arr2map')
      let tempMap = new Map(temp)
      console.timeEnd('arr2map')
      console.time('-delete-map')
      tempMap.delete('100')
      console.timeEnd('-delete-map')

      console.time('setShopingTable')
      for(let i=0; i<temp.length; i++) {
        this.setShopingTable(temp[i])
      }
      console.timeEnd('setShopingTable')
    },
    setShopingTable(info,letter){
      let selectInfo = {
        rid: info.rid,
        mID: info.mID,
        mVehicle: info.mVehicle,
        asID: info.asIDs,
        asIDs: info.asIDs,
        asLabs: info.asLabs,
        resName: info.resName,
        resID: info.resID,
        city: info.city,
        origin: info.origin,
        buildType: info.buildType,
        houseNum: info.houseNum,
        buildPrice: info.buildPrice,
        mediaName: info.mediaName,
        buildNum: info.buildNum,
        schedules: info.schedules,
        tradingArea: info.tradingArea,
        assetTag: info.assetTag,
        liveYear: info.liveYear,
        adLimit: info.adLimit,
        mapCenter: info.reference ||'',      // 地图中心点名称
        reference: info.reference ||'',
        address: info.address || '',
        dNum: info.dNum || '',              // 出入口数
        A_B: letter,
        // checkBox: {A: info.checkBox.A||false, B: info.checkBox.B||false,ABC:  info.checkBox.ABC||false},
        // box: {A:info.box.A||false,B:info.box.B||false},
        connData: { connectResName: '', connectMedia: '', commentWorkRes:'', commentworkMedia:''},
        connID: info.connID,        // 连排门id
        industryInfos: info.industryInfos,   // 同行业资源回避
        adPrice: info.adPrice,               // 点位价格
        mediaLevel: info.mediaLevel,        // 媒体等级
        asrID: info.asrID,                // 所属公司id
        asName: info.asName,                // 所属公司名称
        asName: info.asName,
        remark: info.remark,
        trafficState: info.trafficState || '',
        electrifyState: info.electrifyState || '',
    }
    return selectInfo
  },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          // done();
          this.$emit('closeAddPoint')
        })
        .catch((_) => {});
    },
    handleDialogClose(dialogName) {
      this.$confirm("确认关闭？")
        .then((_) => {
          this[dialogName] = false;
        })
        .catch((_) => {});
    },
    deleteAsignItem(scope) {
      console.log('deleteAsignItem', scope)
      console.time('splice')
      this.asignPointTableData.splice(scope.$index, 1)
      console.timeEnd('splice')
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
.cell-ellipsis{
  width: 132px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
