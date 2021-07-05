<template>
  <div class="media_index">
    <div class="ad_index_container">
      <div class="index-top-row">
        <div class="left-layout">
          <personal-info
            :user-info="userInfo"
            :honorImg="[]"
            :imgSize="[51, 62]"
            :linkArr="linkArrNew"
          ></personal-info>
          <div class="card-group">
            <el-row :gutter="24">
              <el-col :span="8"
                ><chart-card :cardData="cardDataOther1"></chart-card
              ></el-col>
              <el-col :span="8"
                ><chart-card :cardData="cardDataOther2"></chart-card
              ></el-col>
              <el-col :span="8"
                ><chart-card :cardData="cardDataOther3"></chart-card
              ></el-col>
            </el-row>
          </div>
        </div>
        <!-- 消息推送和应用市场 -->
        <div class="right-board">
          <message-and-app
            :appCenter="appCenter"
            @goToPage="goToPage"
          ></message-and-app>
        </div>
      </div>
      <el-row class="index-row">
        <index-custom-card>
          <template slot="head"> 合同预警 </template>
          <template slot="content">
            <div style="padding: 24px">
              <div class="table-top-tip">
                <i class="el-icon-info" style="color: #1890ff"></i>
                <h4>
                  <span>
                    近
                    <span class="tip-active">{{ maxDayDiffer }}</span>
                    天内，待处理的预警合同共有
                    <span class="tip-active">{{
                      contractWarningList.length
                    }}</span>
                    份
                  </span>
                </h4>
              </div>
              <el-table :data="contractWarningList" border max-height="415">
                <el-table-column
                  show-overflow-tooltip
                  label="资源名称"
                  width="230"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.resName || "" }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  label="合同对象"
                  width="230"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.originName || "待定" }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="contractNo"
                  label="合同编号"
                  width="100"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    {{ scope.row.contractNo || "--" }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="pmcName"
                  label="物业名称"
                  width="100"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="合同日期"
                  width="100"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column prop="fee" label="费用" width="100">
                  <template slot-scope="scope">
                    {{ (scope.row.fee / 100) | moneyFormat("¥") }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="warnType"
                  label="预警说明"
                  width="100"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    {{ scope.row.warnType || "--" }}
                  </template>
                </el-table-column>
                <el-table-column prop="dayDiffer" label="预警倒计时">
                  <template slot-scope="scope">
                    <el-popover
                      v-if="scope.row.dayDiffer < 0"
                      placement="top"
                      trigger="hover"
                      min-width="80"
                      popper-class="warn-pop"
                    >
                      <span
                        @click="
                          ignoreVisible = true;
                          currentIgnore = scope.row;
                        "
                        >忽略</span
                      >
                      <mini-progress
                        slot="reference"
                        :target="0"
                        :percentage="scope.row.rate"
                        :value="scope.row.dayDiffer"
                        :height="'20px'"
                        color="rgba(24, 144, 255, 1)"
                      ></mini-progress>
                    </el-popover>
                    <mini-progress
                      v-else
                      :target="0"
                      :percentage="scope.row.rate"
                      :value="scope.row.dayDiffer"
                      :height="'20px'"
                      color="rgba(24, 144, 255, 1)"
                    ></mini-progress>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </index-custom-card>
      </el-row>
      <el-row class="index-row">
        <index-custom-card>
          <template slot="head">{{
            sessionData.devManageLevel == 2 ? "待处理事项" : "合同动态"
          }}</template>
          <template slot="content">
            <div style="padding: 24px">
              <el-table :data="contractNews" border max-height="470">
                <el-table-column
                  show-overflow-tooltip
                  label="资源名称"
                  width="230"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.resName || "" }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="contractNo"
                  label="合同编号"
                  width="150"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.contractNo || "--" }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="dcType" label="合同类型" width="120">
                  <template slot-scope="scope">
                    <span>{{ contractTypeArr[scope.row.dcType] || "" }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  label="创建日期"
                  min-width="160"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="updateTime"
                  label="更新日期"
                  min-width="160"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="logType"
                  label="审批类型"
                  min-width="120"
                >
                  <template slot-scope="scope">
                    {{ scope.row.logType == 2 ? "付款审批" : "合同审批" }}
                  </template>
                </el-table-column>
                <el-table-column prop="cost" label="最新动态" min-width="120">
                  <template slot-scope="scope">
                    {{ statusMap[scope.row.logType][scope.row.state] || "--" }}
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="操作" width="160">
                  <template slot-scope="scope">
                    <span
                      v-if="sessionData.devManageLevel == 2"
                      class="table-row__btn"
                      @click="showContractReview(scope.row)"
                      >处理</span
                    >
                    <span
                      v-else
                      class="table-row__btn"
                      @click="routeContractDetail(scope.row)"
                      >查看</span
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </index-custom-card>
      </el-row>
      <el-row
        v-if="
          sessionData.devManageLevel == 1 || sessionData.devManageLevel == 2
        "
        class="index-row"
      >
        <index-custom-card>
          <template slot="head">
            业绩排行
            <div class="date-interval">
              <span
                :class="{ active: dateInterval === 1 }"
                @click="getRankList('dateInterval', 1)"
                >全年</span
              >
              <span
                :class="{ active: dateInterval === 2 }"
                @click="getRankList('dateInterval', 2)"
                >本月</span
              >
              <span
                :class="{ active: dateInterval === 3 }"
                @click="getRankList('dateInterval', 3)"
                >上月</span
              >
            </div>
          </template>
          <template slot="content">
            <el-row :gutter="0">
              <el-col :span="12">
                <ul class="item-list">
                  <li class="rank-title">新签</li>
                  <li
                    class="item"
                    v-for="(rankItem, index) in newContractRank"
                    :key="index"
                  >
                    <span :title="rankItem.realName"  class="label">{{
                      rankItem.realName
                    }}</span>
                    <mini-progress
                      :percentage="rankItem.rate"
                      :value="rankItem.total"
                      :height="'20px'"
                      :color="'rgba(24, 144, 255, 1)'"
                    ></mini-progress>
                  </li>
                </ul>
              </el-col>
              <el-col :span="12">
                <ul class="item-list">
                  <li class="rank-title">续签</li>
                  <li
                    class="item"
                    v-for="(rankItem, index) in renewContractRank"
                    :key="index"
                  >
                    <span :title="rankItem.realName" class="label">{{
                      rankItem.realName
                    }}</span>
                    <mini-progress
                      :percentage="rankItem.rate"
                      :value="rankItem.total"
                      :height="'20px'"
                      :color="'rgba(24, 144, 255, 1)'"
                    ></mini-progress>
                  </li>
                </ul>
              </el-col>
            </el-row>
          </template>
        </index-custom-card>
      </el-row>
    </div>
    <!-- 是否忽略该预警信息 -->
    <el-dialog
      :visible.sync="ignoreVisible"
      width="388px"
      top="22vh"
      :show-close="false"
      :close-on-click-modal="false"
      custom-class="custom-dialog-wrapper custom-confirm-dialog"
    >
      <div slot="title"><i class="el-icon-question"></i>是否忽略该预警信息</div>
      <div class="message-content">确定后，该预警信息将不在显示在首页</div>

      <template slot="footer">
        <el-button @click="ignoreVisible = false">取 消</el-button>
        <el-button type="primary" @click="createWarnIgnore">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 合同审核 -->
    <contract-review-dialog
      :dcID="currentReviewDcID"
      :contractReviewVisible.sync="contractReviewVisible"
      @refreshList="getContractNews"
    ></contract-review-dialog>
  </div>
</template>

<script>
import timeFormat from "../../commonFun/timeFormat.js";
import homeLink from "../common/components/homeLink.vue";
import { api } from "../../api/api";
import sessFun from "../../commonFun/sessFun.js";
import noSearchResult from "../common/components/noSearchResult.vue";
import appCenter from "../../commonFun/json/appCenter.json";

import personalInfo from "../common/components/personalInfo.vue";
import messageAndApp from "../common/components/messageAndApp.vue";
import chartCard from "../common/components/chartCard.vue";
import indexCustomCard from "../common/components/indexCustomCard.vue";
import miniProgress from "../common/components/miniProgress.vue";
import contractReviewDialog from "./components/contractReviewDialog.vue";
export default {
  name: "developIndex",
  components: {
    homeLink,
    noSearchResult,
    personalInfo,
    messageAndApp,
    chartCard,
    indexCustomCard,
    miniProgress,
    contractReviewDialog,
  },
  data() {
    return {
      sessionData: {},
      linkArrNew: [],
      userInfo: {
        userName: "",
        avator: require("../../assets/images/tvQNA_img3.jpg"),
      },
      // 应用中心
      appCenter: "",
      cardDataOther1: {
        title: "本月首签合同",
        tip: "统计时间：本月1号起至昨天",
        value: 0,
        valueAlias: "新增合同数量",
        compare: 0,
        trendLabel: "同比上周",
        data: [],
      },
      cardDataOther2: {
        title: "本月续签合同",
        tip: "统计时间：本月1号起至昨天",
        value: 0,
        valueAlias: "续签数量",
        compare: 0,
        trendLabel: "月环比",
        data: [],
      },
      cardDataOther3: {
        title: "本月加门合同",
        tip: "统计时间：本月1号起至昨天",
        value: 0,
        valueAlias: "安装数量",
        compare: 0,
        trendLabel: "月环比",
        data: [],
      },
      // 合同预警列表
      contractWarningList: [],
      maxDayDiffer: 0,
      contractTypeArr: {
        0: "首签",
        1: "续签",
        2: "补充",
        3: "加门",
      },
      // 合同动态列表
      contractNews: [],
      // 业绩排行(新签)
      newContractRank: [],
      // 业绩排行(续签)
      renewContractRank: [],
      dateInterval: 1,
      ignoreVisible: false,
      currentIgnore: null,
      currentReviewDcID: "",
      statusMap: {
        1: {
          "-1": "审核不通过",
          0: "待审核",
          1: "待签约",
          2: "待安装",
          3: "待拆除",
          4: "正常",
          5: "合同到期",
          6: "强制终止",
        },
        2: {
          "-1": "审核不通过",
          0: "待审核",
          1: "代付款",
          2: "待开票",
          3: "已完成",
        },
      },
      // 合同审核弹框
      contractReviewVisible: false,
    };
  },
  mounted() {
    this.getSession();
    if (this.sessionData.devManageLevel == 1) {
      this.linkArrNew.push({
        imgurl: require("../../assets/images/gua.png"),
        title: "合同设置",
        link: "./f_develop/contractCfg",
      });
    } else if (this.sessionData.devManageLevel == 0) {
      this.linkArrNew.push({
        imgurl: require("../../assets/images/addMedia.png"),
        title: "新建合同",
        link: "./f_develop/newContract",
      });
    }
    this.appCenter = appCenter;
    this.uploadEvent(1);
    this.getCardData();
    this.getContractWarningList();
    this.getContractNews();
    this.getRankList();
  },
  methods: {
    getSession() {
      this.sessionData = sessFun.getSess();
      let sess = this.sessionData;
      this.userInfo.userName = sess.realName;
      this.userInfo.role = this.sessionData.uType;
      this.userInfo.avator = sess.headPic
        ? sess.headPic
        : require("../../assets/images/index/niu.png");
    },
    // 应用中心跳转
    goToPage(item) {
      if (item) {
        this.uploadEvent(2, item.name);
        item.descTooltip = false;
        window.open(item.link, "_blank");
      } else {
        this.uploadEvent(2, "home");
        window.open("https://apps.qinlinad.com", "_blank");
      }
    },
    getUuid() {
      let s = [];
      let hexDigits = "0123456789abcdef";
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";
      let uuid = s.join("");
      return uuid;
    },
    // 用户中心事件上报 1展示2点击
    uploadEvent(type, name) {
      this.$nextTick(function () {
        //用户中心渲染完成
        let params = [];
        if (type == 1) {
          //展现
          for (let i = 0; i < this.appCenter.length; i++) {
            if (this.isSlideDown) {
              if (i < 8) {
                let obj = {
                  userId: this.sessionData.uID,
                  behaviorTime: timeFormat.toDateTime(new Date()),
                  componentName: this.appCenter[i].name,
                  requestId: this.getUuid(),
                  type: type,
                };
                params.push(obj);
              }
            } else {
              if (i > 7) {
                let obj = {
                  userId: this.sessionData.uID,
                  behaviorTime: timeFormat.toDateTime(new Date()),
                  componentName: this.appCenter[i].name,
                  requestId: this.getUuid(),
                  type: type,
                };
                params.push(obj);
              }
            }
          }
        } else {
          //点击
          let obj = {
            userId: this.sessionData.uID,
            behaviorTime: timeFormat.toDateTime(new Date()),
            componentName: name,
            requestId: this.getUuid(),
            type: type,
          };
          params.push(obj);
        }
        api
          .postApi(this.apiVar.UCAPI + "/UserStaticReport", {
            userStatics: JSON.stringify(params),
          })
          .then((res) => {});
      });
    },
    // 获取顶部卡片数据
    getCardData() {
      api
        .getApi("/report/devContract/getCardData", {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
        })
        .then((res) => {
          if (res.data.SysCode === 200200) {
            let temp = res.data.data || {};
            if (Array.isArray(temp.weekDataList)) {
              let weekDataList = temp.weekDataList,
                tempcCardData1 = [],
                tempcCardData2 = [],
                tempcCardData3 = [];
              weekDataList.forEach((item, index) => {
                let commonObj = {
                  dateStr: `第${index + 1}周`,
                  week: item.weekStartDate + "~" + item.weekEndDate,
                };
                tempcCardData1.push({
                  ...commonObj,
                  value: item.weekNewCCnt || 0,
                });
                tempcCardData2.push({
                  ...commonObj,
                  value: item.weekRenewCCnt || 0,
                });
                tempcCardData3.push({
                  ...commonObj,
                  value: item.weekAddDoorCCnt || 0,
                });
              });
              Object.assign(this.cardDataOther1, {
                value: temp.monthNewCCnt,
                data: tempcCardData1,
                compare: temp.newIncrRate,
              });
              Object.assign(this.cardDataOther2, {
                value: temp.monthRenewCCnt,
                data: tempcCardData2,
                compare: temp.renewIncrRate,
              });
              Object.assign(this.cardDataOther3, {
                value: temp.monthAddDoorCCnt,
                data: tempcCardData3,
                compare: temp.installInctRate,
              });
            }
          } else {
            this.$message.warning(res.data.MSG);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    // 该账号内忽略该合同预警
    createWarnIgnore() {
      api
        .postApi("/addsp/devContractWarn/createWarnIgnore", {
          warnType: row.warnType,
          tokedcIDn: row.dcID,
        })
        .then((res) => {
          if (res.data.SysCode === 200200) {
            this.ignoreVisible = false;
          } else {
            this.$message.warning(res.data.MSG);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    // 合同预警
    getContractWarningList() {
      api
        .getApi("/report/devContract/getWarnData", {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
        })
        .then((res) => {
          if (res.data.SysCode === 200200) {
            this.contractWarningList = res.data.data || [];
            this.maxDayDiffer = this.contractWarningList.reduce((pre, cur) => {
              if (cur.dayDiffer > pre) {
                return cur.dayDiffer;
              } else {
                return pre;
              }
            }, 1);
          } else {
            this.$message.warning(res.data.MSG);
          }
        })
        .catch((err) => {
          console.error("err", err);
        });
    },
    // 合同动态列表
    getContractNews() {
      let apiUri = "/report/devContract/getContractNews";
      if (this.sessionData.devManageLevel == 2) {
        apiUri = "/report/devContract/getVerifyDataList";
      }
      api
        .getApi(apiUri, {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
        })
        .then((res) => {
          if (res.data.SysCode === 200200) {
            this.contractNews = res.data.data || [];
            console.log("contractNews--", this.contractNews);
          } else {
            this.$message.warning(res.data.MSG);
          }
        })
        .catch((err) => {
          console.error("err", err);
        });
    },
    // 获取业绩排行
    getRankList(field = "dateInterval", val = 1) {
      // 日期区间切换等
      if (field) {
        this[field] = val;
      }
      let startDate = "",
        endDate = "",
        tempDate = new Date(),
        year = tempDate.getFullYear(),
        month = tempDate.getMonth(),
        day = tempDate.getDate();
      function zero(num) {
        if (num < 10) return `0${num}`;
        else return num;
      }
      switch (val) {
        case 1:
          startDate = `${year}-01-01`;
          endDate = `${year}-12-31`;
          break;
        case 2:
          startDate = `${year}-${zero(month + 1)}-01`;
          endDate = `${year}-${zero(month + 1)}-${zero(day)}`;
          break;
        case 3:
          startDate = `${year}-${zero(month)}-01`;
          endDate = `${year}-${zero(month)}-${zero(
            new Date(year, month, 0).getDate()
          )}`;
          break;
      }
      api
        .getApi("/report/devContract/getDevRank", {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          startDate,
          endDate,
        })
        .then((res) => {
          if (res.data.SysCode === 200200) {
            let temp = res.data.data || {};
            this.newContractRank = temp.newContractRank || [];
            this.renewContractRank = temp.renewContractRank || [];
          } else {
            this.$message.warning(res.data.MSG || "");
          }
        })
        .catch((err) => {
          console.error("getDevRank", err);
        });
    },
    /* 跳转至合同详情（资产、开发） */
    routeContractDetail(row) {
      console.log("0-0", row.resID);
      this.$router.push({
        path: "./f_develop/contractDetail",
        query: {
          resID: row.resID,
        },
      });
    },
    // 总监审核
    showContractReview(row) {
      this.contractReviewVisible = true;
      this.currentReviewDcID = row.dcID;
    },
  },
};
</script>
<style>
.warn-pop.el-popover {
  min-width: 50px;
  text-align: center;
}
</style>
<style scoped lang="scss">
@import "../../assets/component.scss";
/deep/ .custom-confirm-dialog {
  border-radius: 4px;
  .el-dialog__header {
    padding: 24px 24px 8px;
    border: none !important;
    .el-dialog__title {
      font-size: 16px;
      color: rgba($color: #000, $alpha: 0.85);
    }
    .el-icon-question {
      margin-right: 16px;
      color: #fa8c16;
      &:before {
        font-size: 21px;
      }
    }
  }
  .el-dialog__body {
    border: none !important;
    .message-content {
      padding-left: 40px;
      line-height: 22px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      & .active {
        color: #1890ff;
        font-weight: 600;
      }
    }
  }
  .el-dialog__footer {
    display: flex;
    justify-content: flex-end;
    padding: 24px;
    .el-button + .el-button {
      margin-left: 16px;
    }
  }
}

.quesition-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  vertical-align: middle;
  filter: brightness(0.75);
}
/deep/ .lock-table .el-table__body {
  width: inherit !important;
}
.index-top-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  .left-layout {
    display: flex;
    flex: 1;
    width: 75%;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-right: 24px;
    .card-group {
      position: relative;
      height: 202p xpx;
      width: 100%;
      margin-top: 24px;
    }
  }
  .right-board {
    width: calc(25% - 24px);
    height: 356px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 1);
    border: 1px solid #e6e7e9;
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
}
.index-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  & > div {
    flex: 1;
  }
  .table-row__btn {
    cursor: pointer;
    color: #1890ff;
  }
  .date-interval {
    margin: 0 0 0 auto;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
    line-height: 20px;
    cursor: pointer;
    span {
      margin: 0 8px;
    }
    .active {
      font-weight: 600;
      color: rgba(24, 144, 255, 1);
    }
  }
  .item-list {
    height: 100%;
    padding: 16px 24px;
    box-sizing: border-box;
    .rank-title {
      margin-bottom: 7px;
      line-height: 24px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }
    .item {
      display: flex;
      align-items: center;
      margin: 9px 0;
      .progress {
        flex: 1;
        cursor: pointer;
      }
      .label {
        width: 56px;
        height: 20px;
        margin-right: 8px;
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
}

/**新增 */
.ad_index_container {
  margin: 24px 64px;
  height: auto;
}
</style>
