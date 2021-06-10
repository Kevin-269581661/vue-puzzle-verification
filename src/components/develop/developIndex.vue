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
            <div style="padding: 24px;">
              <el-table :data="contractWarningList" border max-height="500">
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
                  label="合同类型"
                  width="230"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.constractType || "--" }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="constractNum"
                  label="合同编号"
                  width="100"
                >
                </el-table-column>
                <el-table-column
                  prop="clientCompanyName"
                  label="物业名称"
                  width="100"
                >
                </el-table-column>
                <el-table-column
                  prop="constractDate"
                  label="合同日期"
                  width="100"
                >
                </el-table-column>
                <el-table-column prop="cost" label="费用" width="100">
                </el-table-column>
                <el-table-column
                  prop="constractWarnExplain"
                  label="预警说明"
                  width="100"
                >
                </el-table-column>
                <el-table-column prop="price" label="预警倒计时">
                  <template slot-scope="scope">
                    <mini-progress
                      slot="reference"
                      :target="0"
                      :percentage="scope.row.restRate"
                      :value="scope.row.restDay"
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
          <template slot="head">合同动态</template>
          <template slot="content">
            <div style="padding: 24px;">
              <el-table :data="contractWarningList" border max-height="500">
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
                  prop="constractNum"
                  label="合同编号"
                  width="100"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  label="创建日期"
                  width="230"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.constractType || "--" }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="constractNum"
                  label="更新日期"
                  width="100"
                >
                </el-table-column>
                <el-table-column
                  prop="clientCompanyName"
                  label="物业名称"
                  width="100"
                >
                </el-table-column>
                <el-table-column
                  prop="constractDate"
                  label="审核类型"
                  width="100"
                >
                </el-table-column>
                <el-table-column prop="cost" label="最新动态" width="100">
                </el-table-column>
                <el-table-column prop="price" label="操作">
                  <template slot-scope="scope">
                    <span>查看</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </index-custom-card>
      </el-row>
      <el-row class="index-row">
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
            <ul class="item-list">
              <li
                class="item"
                v-for="(rankItem, index) in rankListArr"
                :key="index"
              >
                <span :title="rankItem.realName" class="label">{{
                  rankItem.realName
                }}</span>
                <mini-progress
                  :percentage="rankItem.finshProcess"
                  :value="rankItem.totalPrice | moneyFormat('¥')"
                  :height="'20px'"
                  :color="'rgba(24, 144, 255, 1)'"
                ></mini-progress>
              </li>
            </ul>
          </template>
        </index-custom-card>
      </el-row>
    </div>
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
  },
  data() {
    return {
      isAllMedia: false,
      isShowNum: false,
      linkArrNew: [
        {
          imgurl: require("../../assets/images/gua.png"),
          title: "合同设置",
          link: "./media/maintainList",
        },
        {
          imgurl: require("../../assets/images/addMedia.png"),
          title: "新建合同",
          link: "./media/mediaInput",
        },
      ],
      userInfo: {
        userName: "",
        avator: require("../../assets/images/tvQNA_img3.jpg"),
      },
      // 应用中心
      appCenter: "",
      cardDataOther1: {
        title: "本月新开发合同",
        tip: "",
        value: 0,
        valueAlias: "新增合同数量",
        compare: 0,
        trendLabel: "同比上周",
        data: [],
      },
      cardDataOther2: {
        title: "本月续签合同",
        tip: "",
        value: 0,
        valueAlias: "续签数量",
        compare: 0,
        trendLabel: "月环比",
        data: [],
        formatter: (text, item, index) => {
          if (index % 2 === 1 && index > 0 && index < 12) {
            return text.substr(5);
          }
        },
      },
      cardDataOther3: {
        title: "本月完成安装资源",
        tip: "",
        value: 0,
        valueAlias: "安装数量",
        compare: 0,
        trendLabel: "月环比",
        data: [],
        formatter: (text, item, index) => {
          if (index % 2 === 1 && index > 0 && index < 12) {
            return text.substr(5);
          }
        },
      },
      // 合同预警列表
      contractWarningList: [],
      // 业绩排行
      rankListArr: [],
      // 媒体概况 媒体和点位切换
      isPoint: false,
      // 媒介预锁概况表格
      preLockArr: [],
      dateInterval: 1,
    };
  },
  mounted() {
    this.getSession();
    if (this.sessionData.devManageLevel == 1) {
      this.linkArrNew.pop();
    }
    this.appCenter = appCenter;
    this.uploadEvent(1);
    this.allReportApi();
  },
  methods: {
    getSession() {
      this.sessionData = sessFun.getSess();
      let sess = this.sessionData;
      this.isAllMedia =
        sess.uType == "MD" && sess.mediaManageLevel == 1 ? true : false;
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
    getRankList(field, val) {
      // 日期区间切换等
      if (field) {
        this[field] = val;
      }
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        limit: 10,
        dateType: this.dateInterval,
      };
      if (this.isBehind == false) {
        params.orderType = 1; // 领先，倒序传1
      }
      api
        .getApi(this.apiVar.report + "/homepage/getSMAchievementReport", params)
        .then((res) => {
          if (res.data.SysCode === 200200) {
            let temp = res.data.data;
            this.rankListArr = temp.userList.filter(
              (item) => item.totalPrice > 0
            );
          } else {
            this.$message.warning(res.data.MSG);
          }
        })
        .catch((err) => {
          console.log("err", err);
        })
        .finally((_) => {});
    },
    // 首页报表接口
    allReportApi() {
      this.getContractWarningList();
    },
    // 合同预警
    getContractWarningList() {
      api
        .getApi(this.apiVar.report + "/homepage/getSMCustomerActiveReport", {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
        })
        .then((res) => {
          if (res.data.SysCode === 200200) {
            this.contractWarningList = res.data.data.customerPriceList.slice(
              0,
              10
            );
          } else {
            this.$message.warning(res.data.MSG);
          }
        })
        .catch((err) => {
          console.log("err", err);
        })
        .finally((_) => {
          this.contractWarningList = [
            {
              resName: "资源名称",
              constractType: "合同类型",
              constractNum: "合同编号",
              clientCompanyName: "物业名称",
              constractDate: "合同日期",
              cost: "费用",
              constractWarnExplain: "预警说明",
              restDay: "3",
              restRate: "100",
            },
          ];
        });
    },
  },
};
</script>

<style scoped lang="scss">
/** 新增*/
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
.index-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  & > div {
    flex: 1;
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
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }
}
.bottom-box {
  position: absolute;
  height: 48px;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 24px 32px;
  line-height: 48px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: #f8f8f8;
  border-radius: 2px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  .avtive {
    font-weight: 600;
    color: #1890ff;
  }
}

/**新增 */
.ad_index_container {
  margin: 24px 64px;
  height: auto;
}
</style>
