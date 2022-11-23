<template>
  <div class="import_result">
    <div class="car-title">
      <i class="el-icon-info" style="color: #1890ff"></i>
      <h4>
        已成功导入小区<span>{{ successRes }}</span
        >个,问题小区<span>{{ errorRes }}</span
        >个
        <span @click="downLoadExcel()"
          >下载失败小区数据<i class="el-icon-download"></i
        ></span>
      </h4>
    </div>

    <p>
      <el-radio-group v-model="activeType" size="small" class="marin10">
        <el-radio-button :label="1">成功小区</el-radio-button>
        <el-radio-button :label="2">失败小区</el-radio-button>
      </el-radio-group>
      <span
        >提示：已选择 <b>{{ resNum }}</b> 个社区，<b>{{ pointNum }}</b>
        个点位</span
      >
    </p>
    <template v-if="activeType == 1">
      <div class="adsTable">
        <div class="myCheckbox" v-if="!isPointSetting">
          <el-checkbox v-model="isAll" @change="allCheckboxAds"></el-checkbox>
        </div>
        <el-table border :data="successList" style="width: 100%">
          <el-table-column width="120px" class-name="el-table-column-checkbox" v-if="!isPointSetting">
            <template slot-scope="scope">
              <div class="space-group">
                <div
                  v-for="(adSpaceItem, adSpaceIndex) in scope.row.adsList"
                  :key="adSpaceIndex"
                  class="space-item"
                >
                  <el-checkbox
                    v-if="adSpaceItem.checkFlag"
                    v-model="adSpaceItem.checkBox"
                    :label="adSpaceItem.asLab || '--'"
                    @change="changeCheckBox(scope.row, adSpaceItem)"
                  >
                  </el-checkbox>
                  <el-popover
                    v-else
                    placement="top-start"
                    width="310"
                    trigger="hover"
                  >
                    <span v-if="scope.row.adlInfo === ''"
                      >暂无被禁用的信息</span
                    >
                    <ul v-else>
                      <li
                        v-for="(item, index) in scope.row.adlInfo"
                        :key="index"
                      >
                        <template v-if="item.lState == null">
                          <p style="margin-bottom: 5px">
                            <span style="color: #333"
                              >该点位：{{ item.asState }}中</span
                            >
                          </p>
                          <div style="margin-bottom: 5px">
                            <span style="color: #333">状态原因：</span>
                            <span
                              style="color: #333"
                              v-for="(u, i) in item.unSaleableReason"
                              :key="i"
                            >
                              <template v-if="item.unSaleableReason.length > 1"
                                >{{ i + 1 }}.</template
                              >
                              {{ u }}
                            </span>
                          </div>
                        </template>
                        <template v-else>
                          <p style="margin-bottom: 5px">
                            <span style="color: #333">占点方案：</span>
                            <span>
                              <span style="font-weight: bold">{{
                                ["ADN_MD_COUNTRY", "ADN_MD"].includes(
                                  sessionData.uType
                                )
                                  ? item.beOccupieApName
                                  : "******"
                              }}</span>
                              方案（{{
                                item.lState == 0
                                  ? "预锁"
                                  : item.lState == 1
                                  ? "被占"
                                  : "强制停止"
                              }}）
                            </span>
                          </p>
                          <p style="margin-bottom: 5px">
                            <span style="color: #333">占点排期：</span
                            >{{ item.schedules }}
                          </p>
                        </template>
                      </li>
                    </ul>
                    <el-checkbox
                      slot="reference"
                      v-model="adSpaceItem.checkBox"
                      :label="adSpaceItem.asLab || '--'"
                      :disabled="true"
                    >
                    </el-checkbox>
                  </el-popover>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="资源名称" min-width="140" prop="resName">
          </el-table-column>
          <el-table-column prop="mediaName" label="媒体名称" min-width="130">
          </el-table-column>
          <el-table-column prop="city" label="城市" min-width="85">
          </el-table-column>
          <el-table-column prop="origin" label="区域" min-width="85">
          </el-table-column>
          <el-table-column prop="assetTag" label="资产编号" min-width="130">
          </el-table-column>
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
          <template v-if="customPermission.patrolPermission">
            <el-table-column prop="feedback" label="巡点问题" min-width="130">
            </el-table-column>
            <el-table-column
              prop="trafficState"
              label="通行情况"
              min-width="130"
            >
            </el-table-column>
            <el-table-column
              v-if="customPermission.patrolPermission == 2"
              prop="electrifyState"
              label="通电情况"
              min-width="130"
            >
            </el-table-column>
          </template>
        </el-table>
      </div>
    </template>
    <template v-if="activeType == 2">
      <el-table border :data="errorList" style="width: 100%">
        <el-table-column label="资源名称" min-width="140" prop="resName">
        </el-table-column>
        <el-table-column prop="province" label="省份" min-width="85">
        </el-table-column>
        <el-table-column prop="city" label="城市" min-width="85">
        </el-table-column>
        <el-table-column prop="origin" label="区域" min-width="85">
        </el-table-column>
        <el-table-column prop="resAddress" label="详细地址" min-width="85">
        </el-table-column>
        <el-table-column prop="schedules" label="投放排期" min-width="160">
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
        <el-table-column
          prop="failReason"
          label="失败原因"
          show-overflow-tooltip
        >
        </el-table-column>
      </el-table>
    </template>
    <p class="button_box">
      <el-button @click="cancelImport()" size="small">取 消</el-button>
      <el-button type="primary" v-if="isPointSetting" @click="handlePointSetting">配点</el-button>
      <el-button v-else type="primary" @click="confirmImport()" size="small"
        >确 定</el-button
      >
    </p>
  </div>
</template>

<script>
// 时间格式化
import timeFormat from "../../../commonFun/timeFormat.js";
// excel导出
import sheetExcel from "../../../commonFun/sheetExcel.js";

export default {
  props: {
    importData: {
      type: Object,
      default: {},
    },
    name: {
      type: String,
      default: "方案名称",
    },
    customPermission: {
      type: Object,
      default: () => {},
    },

    isPointSetting: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // 登录信息
      sessionData: {},
      // 成功小区
      successList: [],
      // 失败小区数据
      errorList: [],
      // 勾选的点位数据
      shopList: [],
      // 是否勾选
      isAll: false,
      // 成功小区还是失败小区
      activeType: 1,
      // 成功失败小区个数
      successRes: 0,
      errorRes: 0,
    };
  },
  computed: {
    resNum() {
      let residArr = [];
      for (let data of this.shopList) {
        if (!residArr.includes(data.resID)) {
          residArr.push(data.resID);
        }
      }
      return residArr.length;
    },
    pointNum() {
      let asidArr = [];
      for (let data of this.shopList) {
        if (!asidArr.includes(data.asID)) {
          asidArr.push(data.asID);
        }
      }
      return asidArr.length;
    },
  },
  created() {
    this.getSessionData();
    console.log("createdd-----1");
    if (this.importData.successList) {
      this.initData();
      console.log("createdd-----2");
    }
  },
  watch: {
    importData() {
      console.log("createdd-----3");
      if (this.importData.successList) {
        this.initData();
        console.log("createdd-----4");
      }
    },
  },
  methods: {
    getSessionData() {
      this.sessionData = JSON.parse(sessionStorage.getItem("session_data"));
    },
    initData() {
      this.shopList = [];
      this.isAll = false;
      let copyData = Object.assign({}, this.importData);
      this.successList = copyData.successList
        ? this.setTableData(copyData.successList)
        : [];
      this.errorList = copyData.errorList
        ? this.checkPointFun(copyData.errorList)
        : [];
      this.successRes = copyData.successSize;
      this.errorRes = copyData.errorSize;
    },
    // 勾选表格数据格式
    setTableData(arr) {
      arr = JSON.parse(JSON.stringify(arr));
      let result = [];
      let pointSet = new Set();
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
          // picSize: key.picSize || "",
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
        };
        adObj.adsList.forEach((adSpace) => {
          adSpace.checkBox = false;
          //本页可选点位
          // if(adSpace.checkFlag) i += 1;
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
        // 点位价格
        // if (key.mVehicle === '道闸') {
        //     adObj.adPrice = key.asPrice / 100;
        // } else {
        if (key.asPrice !== null && key.asPrice !== undefined) {
          adObj.adPrice = key.asPrice / 700;
        } else {
          adObj.adPrice = 0;
        }
        // 每个小区默认勾选一个点位，A、B面五五分
        /* if(!pointSet.has(key.resID)) {
                        if(pointSet.size%2 === 0 && !adObj.box.A) {
                            adObj.checkBox.A = true
                            this.AddShopingInfo(adObj, 'A')
                        } else if(pointSet.size%2 === 1 && !adObj.box.B) {
                            adObj.checkBox.B = true
                            this.AddShopingInfo(adObj, 'B')
                        }
                        pointSet.add(key.resID)
                    } */
        // }
        result.push(adObj);
      }
      return result;
    },
    // 选中A、B面的时候
    changeCheckBox(row, adSpaceItem) {
      if (adSpaceItem.checkBox) {
        this.AddShopingInfo(row, adSpaceItem); // 添加到购物车
      } else {
        this.deleteShopRow(row, adSpaceItem);
      }
    },
    // 取消勾时,删除购物车里对应的数据行
    deleteShopRow(row, adSpaceItem) {
      for (let j = 0; j < this.shopList.length; j++) {
        if (
          this.shopList[j].mID === adSpaceItem.asID &&
          this.shopList[j].schedules === row.schedules
        ) {
          this.shopList.splice(j, 1);
          break;
        }
      }
      this.isAll = false;
    },
    // 表头全选
    allCheckboxAds() {
      if (this.isAll) {
        this.allSelectToShop();
      } else {
        this.cancleSelectAds();
      }
    },
    // 表头勾选重置
    allCheckboxUpdata() {
      if (this.shopList.length <= 0) {
        this.isAll = false;
      } else {
        let isAllCheckBox = true;
        for (let key of this.successList) {
          (key.adsList||[]).forEach((item) => {
            if (!item.checkBox) {
              isAllCheckBox = false;
            }
          })
        }
        this.isAll = isAllCheckBox;
      }
    },
    // 全选放进购物车
    allSelectToShop() {
      for (let i = 0; i < this.successList.length; i++) {
        let mediaInfo = this.successList[i];
        (mediaInfo.adsList || []).forEach((adSpaceItem) => {
          if (adSpaceItem.checkFlag && !adSpaceItem.checkBox) {
            adSpaceItem.checkBox = true;
            let selectInfo = this.setShopingTable(mediaInfo, adSpaceItem);
            this.shopList.push(selectInfo);
          }
        });
      }
    },
    //取消全选
    cancleSelectAds() {
      for (let mediaItem of this.successList) {
        (mediaItem.adsList || []).forEach((adSpaceItem) => {
          if (adSpaceItem.checkFlag && adSpaceItem.checkBox) {
            for (let i = 0; i < this.shopList.length; ) {
              if (adSpaceItem.asID === this.shopList[i].asID) {
                this.shopList.splice(i, 1);
                adSpaceItem.checkBox = false;
              } else {
                i += 1;
              }
            }
          }
        });
      }
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
      };
      return selectInfo;
    },
    // 添加到购物车
    AddShopingInfo(mediaInfo, adSpaceInfo) {
      let selectInfo = this.setShopingTable(mediaInfo, adSpaceInfo);
      this.shopList.push(selectInfo);
      this.allCheckboxUpdata();
    },
    // 处理有问题的点
    checkPointFun(errorList) {
      let resultarr = [];
      for (let data of errorList) {
        let item = {
          resName: data.resName,
          province: data.province,
          city: data.city,
          origin: data.district,
          resAddress: data.resAddress,
          schedules: data.date,
          failReason: data.failReason,
        };
        resultarr.push(item);
      }
      return resultarr;
    },
    // 导出有问题的点
    downLoadExcel() {
      if (this.errorList.length === 0) {
        return this.$message.warning("数据为空！");
      }
      let arr = this.questionPoint(this.errorList);
      let allHead = [
        "资源名称",
        "省份",
        "城市",
        "区域",
        "详细地址",
        "投放排期",
        "失败原因",
      ];
      sheetExcel.toDownload(
        allHead,
        arr,
        "导入失败小区表" + timeFormat.toDate(new Date(), "-")
      );
    },
    // 导入excel后台返回的问题点位
    questionPoint(arr) {
      let resultarr = [
        {
          sheetName: "问题点位",
          showList: [],
        },
      ];
      console.log(arr, "arrr");
      for (let data of arr) {
        let obj = {
          resName: data.resName,
          province: data.province,
          city: data.city,
          origin: data.origin,
          resAddress: data.resAddress,
          schedules: data.schedules,
          failReason: data.failReason || "",
        };
        resultarr[0].showList.push(obj);
      }
      return resultarr;
    },
    // 取消导入
    cancelImport() {
      this.$emit("cancel");
    },
    // 确定导入
    confirmImport() {
      this.$emit("confirmImport", this.shopList);
    },

    // 配点
    handlePointSetting () {
      this.$emit("cancel");
      this.$emit('handlePointSetting')
    }
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
</style>
