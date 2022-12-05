<template>
  <el-dialog
    title="配点结果详情"
    :visible.sync="dialogVisible"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="54%"
  >
    <div class="import_result" v-if="dialogVisible">
      <h3 class="yxxq">意向投放小区:{{importData.adResMatchSummaryVO.planResCount || 0}}个</h3>
      <div class="car-title">
        <i class="el-icon-info" style="color: #1890ff"></i>
        <h4>
          小区<span>{{ importData.adResMatchSummaryVO.successResCount || 0 }}</span>
          | 楼栋<span>{{ importData.adResMatchSummaryVO.floorCount }}</span> |
          单元<span>{{ importData.adResMatchSummaryVO.unitCount }}</span> |
          点位<span>{{ importData.adResMatchSummaryVO.faceCount }}</span>
          （位置朝外：<span>{{
            importData.adResMatchSummaryVO.outWardCount
          }}</span>
          位置朝内：<span>{{ importData.adResMatchSummaryVO.inWardCount }}</span
          >） 配点失败小区<span>{{
            importData.adResMatchSummaryVO.failResCount
          }}</span
          >个
          <span class="down-result" @click="downLoadExcel()"
            >下载结果<i class="el-icon-download"></i
          ></span>
        </h4>
      </div>

      <div class="adsTable">
        <el-table border :data="adResMatchSpaceVos" style="width: 100%" height="400">
          <el-table-column label="资源名称" width="140" prop="resName" fixed="left">
          </el-table-column>

          <el-table-column prop="city" width="100" label="城市"> </el-table-column>

          <el-table-column prop="origin" width="100" label="区域"> </el-table-column>

          <el-table-column prop="schedules" label="排期" width="200">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.schedules"
                placement="bottom"
              >
                <span>{{ scope.row.schedules }}</span>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="site" label="位置类型" width="90"> </el-table-column>

          <el-table-column prop="mediaTypeName" label="设备型号" width="110">
          </el-table-column>

          <el-table-column prop="asLab" label="投放面" width="90"> </el-table-column>

          <el-table-column prop="siteOrientation" label="位置朝向" width="90">
          </el-table-column>

          <el-table-column prop="mediaName" label="媒体名称" width="130"> </el-table-column>

        </el-table>
      </div>

      <p class="button_box">
        <el-button @click="resetPoint" size="small" class="padd"
          >重新配点({{ importData.adResMatchSpaceVos.length }})</el-button
        >
        <el-button type="primary" @click="savePoint" size="small"
          >保存配点</el-button
        >
      </p>
    </div>
  </el-dialog>
</template>
  
<script>
import FileSaver from 'file-saver';

// 时间格式化
import timeFormat from "../../../../commonFun/timeFormat";
import api from "../../../../api/api";
import sessFun from "../../../../commonFun/sessFun";

export default {
  props: {
    importData: {
      type: Object,
      default: () => ({}),
    },

    visible: {
      type: Boolean,
      default: false,
    },

    matchKeys: {
      type: Object,
      default: () => {},
    }
  },

  data() {
    return {
      // 成功小区
      adResMatchSpaceVos: [],
      sessionData: {}
    }
  },

  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
  },

  watch: {
    dialogVisible (v) {
      if (v) {
        this.initData();
      }
    }
  },

  created () {
    this.getSession()
  },

  methods: {
    getSession() {
      this.sessionData = sessFun.getSess();
    },

    initData() {
      this.adResMatchSpaceVos = this.setTableData(this.importData.adResMatchSpaceVos) || []
    },
    // 表格数据格式
    setTableData(arr) {
      arr = JSON.parse(JSON.stringify(arr));
      let result = [];
      for (let key of arr) {
        let adObj = {
          mID: key.mID,
          resType: key.resType,
          resID: key.resID,
          resName: key.resName,
          city: key.city,
          rid: key.rID,
          origin: key.rName,
          buildType: key.cType,
          houseNum: key.hNum,
          buildPrice: key.hPrice / 100,
          mediaName: key.mTitle || "",
          mediaTypeName: key.mediaTypeName, // 媒体类型
          mediaTypeId: key.mediaTypeId,
          mediaRemark: key.mRemark || "--",
          parkSpaceNum: key.parkSpaceNum,
          carFlow: key.carFlow,
          peopleFlow: key.peopleFlow,
          buildNum: key.fNum,
          schedules: key.pbStar + "-" + key.pbEnd,
          tradingArea: key.tradingArea || "",
          assetTag: key.assetTag || "",
          liveYear: key.chDay,
          adLimit: key.notPush || "",
          mState:
            key.mState === 1 ? "正常" : key.mState === 2 ? "待安装" : "--",
          adSize: key.adSize || "",
          mapCenter: key.reference || "", // 地图中心点
          recommendReason: key.recommendReason || "", //  亲粤邻定制：推荐理由
          address: key.resAddress || "",
          dNum: key.dNum || "", // 出入口数
          connID: key.connID || "", // 连排门id
          industryInfos: key.industryInfos, // 同行业资源、媒体回避
          mediaLevel: key.grade || "", // 媒体等级
          asName: key.asName, // 点位所属公司名称
          asrID: key.asrID,
          adsList: key.adsList || [],
          trafficState: key.trafficState || "",
          electrifyState: key.electrifyState || "",
          feedback: key.feedback || "",
          connData: {
            connectResName: "",
            connectMedia: "",
            commentWorkRes: "",
            commentworkMedia: "",
          },
          asID: key.asID,
          unitId: key.unitId, // 单元ID
          asLab: key.asLab, // 投放面
          buildingId: key.buildingId, // 楼栋ID
          actualAdsCnt: key.actualAdsCnt, // 最多可添加点位数量
          siteOrientation: key.siteOrientation,
          mediaTypeName: key.mediaTypeName,
          buildingName: key.buildingName,
          unitName: key.unitName,
          site: key.site
        };
        adObj.adsList.forEach((adSpace) => {
          adSpace.checkBox = false;
        });
        if (!!key.adlInfo && key.adlInfo.length > 0) {
          let arr = [];
          for (let akey of key.adlInfo) {
            let star = timeFormat.toDate(akey.lStar, "/");
            let end = timeFormat.toDate(akey.lEnd, "/");
            arr.push({
              asState: akey.asState,
              schedules: star + "-" + end,
              lState: akey.lState,
              unSaleableReason: JSON.parse(akey.unSaleableReason || "[]"),
              beOccupieApName: akey.apName,
            });
          }
          adObj.adlInfo = arr;
        } else {
          adObj.adlInfo = "";
        }
        if (key.asPrice !== null && key.asPrice !== undefined) {
          adObj.adPrice = key.asPrice / 700;
        } else {
          adObj.adPrice = 0;
        }
        result.push(adObj);
      }
      return result;
    },

    downLoadExcel() {
      if (this.adResMatchSpaceVos.length === 0) {
        return this.$message.warning("数据为空！");
      }
      const sess = this.sessionData
      const params = {
        uid: sess.uID,
        token: sess.token,
        matchResultKey: this.matchKeys.matchResultKey,
        matchOriginType: this.matchKeys.matchOriginType
      }
      api
      .getApi_file("/addsp/api/v2/adPlan/exportMatchResultExcel", params)
      .then((res) => {
        if (res.status === 200) {
          // 导出excel
          FileSaver.saveAs(new Blob([res.data], {type: "application/vnd.ms-excel"}), `配点导出结果.xlsx`)
        } else {
          sessFun.messageFun("warning", '下载失败');
        }
      })
      .catch((error) => {
        sessFun.messageFun("warning", '下载失败');
        console.log(error, "error---downLoadExcel");
      });
    },

    // 保存配点
    savePoint() {
      let arr = this.adResMatchSpaceVos
      for (let i = 0; i < arr.length; i++) {
        let mediaInfo = arr[i];
        (mediaInfo.adsList || []).forEach((adSpaceItem) => {
          if (adSpaceItem.checkFlag && !adSpaceItem.checkBox) {
            adSpaceItem.checkBox = true;
          }
        });
      }
      this.$emit("savePoint", arr);
    },
    // 重新配点
    resetPoint() {
      this.$emit("resetPoint");
    },

  },
};
</script>
  
<style scoped lang="scss">
.car-title {
  background: #e6f7ff;
  border: 1px solid #bae7ff;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 5px;
  position: relative;
  .down-result {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
  }
}

.car-title h4 {
  font-size: 14px;
  display: inline-block;
}

.car-title p {
  font-size: 14px;
  font-weight: normal;
  display: inline-block;
  margin-left: 10px;
}

.car-title span {
  font-size: 14px;
  font-weight: normal;
  margin: 0 6px;
  cursor: pointer;
  color: #1890ff;
}

.button_box {
  text-align: right;
  margin-top: 20px;
}
.marin10 {
  margin: 0 20px 10px 0;
}

.yxxq {
 margin-bottom: 16px; 
 font-size: 15px;
}
.padd {
  padding: 0 6px;
}

.adsTable /deep/ .el-table__body-wrapper {
  overflow-x: scroll!important;
} 

.adsTable /deep/ .el-table__body-wrapper, 
.adsTable /deep/ .el-table__empty-block { 
  min-height: auto!important;;
}
</style>
  