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
        <el-table border :data="adResMatchSpaceVos" style="width: 100%" height="440">
          <el-table-column label="资源名称" min-width="140" prop="resName">
          </el-table-column>

          <el-table-column prop="city" label="城市"> </el-table-column>

          <el-table-column prop="origin" label="区域"> </el-table-column>

          <el-table-column prop="schedules" label="排期" min-width="160">
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

          <el-table-column prop="site" label="位置类型"> </el-table-column>

          <el-table-column prop="mediaTypeName" label="设备型号" min-width="110">
          </el-table-column>

          <el-table-column prop="asLab" label="投放面"> </el-table-column>

          <el-table-column prop="siteOrientation" label="位置朝向">
          </el-table-column>

          <el-table-column prop="mediaName" label="媒体名称"> </el-table-column>

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
// 时间格式化
import timeFormat from "../../../../commonFun/timeFormat";

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
  },

  data() {
    return {
      // 成功小区
      adResMatchSpaceVos: []
    };
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
  methods: {
    initData() {
      this.adResMatchSpaceVos = this.setTableData(this.importData.adResMatchSpaceVos) || []
    },
    // 勾选表格数据格式
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

    // 选点列表数据到购物车数据
    setShopingTable(mediaInfo, adSpaceInfo) {
      let selectInfo = {
        rid: mediaInfo.rid,
        mID: mediaInfo.mID,
        mediaTypeName: mediaInfo.mediaTypeName,
        mediaTypeId: mediaInfo.mediaTypeId,
        asID: adSpaceInfo.asID,
        asLab: adSpaceInfo.asLab,
        resName: mediaInfo.resName,
        resID: mediaInfo.resID,
        city: mediaInfo.city,
        origin: mediaInfo.origin,
        buildType: mediaInfo.buildType,
        houseNum: mediaInfo.houseNum,
        buildPrice: mediaInfo.buildPrice,
        mediaName: mediaInfo.mediaName,
        mediaRemark: mediaInfo.mediaRemark,
        buildNum: mediaInfo.buildNum,
        schedules: mediaInfo.schedules,
        tradingArea: mediaInfo.tradingArea,
        assetTag: mediaInfo.assetTag,
        liveYear: mediaInfo.liveYear,
        adLimit: mediaInfo.adLimit,
        mapCenter: mediaInfo.reference || "", // 地图中心点
        recommendReason: mediaInfo.recommendReason || "", //  亲粤邻定制：推荐理由
        address: mediaInfo.address || "",
        dNum: mediaInfo.dNum || "", // 出入口数
        connData: {
          connectResName: "",
          connectMedia: "",
          commentWorkRes: "",
          commentworkMedia: "",
        },
        connID: mediaInfo.connID, // 连排门id
        industryInfos: mediaInfo.industryInfos, // 同行业资源回避
        adPrice: mediaInfo.adPrice, // 点位价格
        mediaLevel: mediaInfo.mediaLevel, // 媒体等级
        asrID: mediaInfo.asrID, // 所属公司id
        asName: mediaInfo.asName, // 所属公司名称
        unitId: mediaInfo.unitId, // 单元ID
        buildingId: mediaInfo.buildingId, // 楼栋ID
        actualAdsCnt: mediaInfo.actualAdsCnt, // 最多可添加点位数量
        buildingName: mediaInfo.buildingName,
        unitName: mediaInfo.unitName,
      };
      return selectInfo;
    },

    downLoadExcel() {
      if (this.adResMatchSpaceVos.length === 0) {
        return this.$message.warning("数据为空！");
      }
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
      console.log(arr, 'arrarrarrarrarrarrarrarrarrarr')
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

.el-checkbox {
  margin-right: 5px;
  vertical-align: middle;
}
.el-checkbox__label {
  padding-left: 4px;
}
/* 头部导入成功个数以及失败个数 */
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

/* 表头全勾选 */
/deep/ .el-table .el-table-column-checkbox .cell {
  min-width: 110px;
  height: auto;
}
.adsTable {
  position: relative;
  .space-group {
    display: flex;
    align-items: center;
    flex-flow: row wrap;
    overflow: auto;
    .space-item {
      margin-right: 12px;
    }
  }
}
.myCheckbox {
  position: absolute;
  width: 120px;
  height: 42px;
  text-align: center;
  line-height: 42px;
  top: 0;
  left: 0;
  z-index: 99;
}

.button_box {
  text-align: right;
  margin-top: 20px;
}
/deep/.import_result .el-table__body-wrapper {
  min-height: 440px;
  max-height: 440px;
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
</style>
  