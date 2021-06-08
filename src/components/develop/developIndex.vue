<template>
  <div class="media_index">
    <div class="ad_index_container">
      <div class="index-top-row">
        <div class="left-layout">
          <personal-info
            :user-info="userInfo"
            :honor-img="companyHonor"
            :imgSize="[51, 62]"
            :linkArr="linkArrNew"
          >
            <template slot-scope="{ showImgNum }">
              <img
                v-show="index < showImgNum"
                v-for="(item, index) of companyHonor"
                :key="index"
                style="width: 51px; height: 62px"
                :src="item.url"
                :alt="item.title"
                :title="item.title"
              />
            </template>
          </personal-info>
          <div class="card-group">
            <el-row :gutter="24" style="margin-bottom: 24px">
              <el-col :span="8"
                ><chart-card :cardData="cardData1"></chart-card
              ></el-col>
              <el-col :span="8"
                ><chart-card :cardData="cardData2"></chart-card
              ></el-col>
              <el-col :span="8"
                ><chart-card :cardData="cardData3"></chart-card
              ></el-col>
            </el-row>
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
      <el-row :gutter="24" class="index-row">
        <!-- 媒体概况 -->
        <el-col :span="12">
          <index-custom-card height="520px">
            <template slot="head">
              媒体概况&nbsp;
              <el-tooltip
                v-if="isPoint"
                effect="dark"
                content="Top center"
                placement="top"
              >
                <ul slot="content">
                  <li style="line-height: 20px">数据更新至昨日</li>
                  <li style="line-height: 20px">
                    总点位数：统计所属公司累计所有录入的媒体点位数
                  </li>
                  <li style="line-height: 20px">
                    正常：指状态为“正常”的媒体点位数量
                  </li>
                  <li style="line-height: 20px">
                    待维修：指状态为“待维修”的媒体点位数量
                  </li>
                  <li style="line-height: 20px">
                    待安装：指状态为“待安装”的媒体点位数量
                  </li>
                  <li style="line-height: 20px">
                    禁用：指状态为“禁用”的媒体点位数量
                  </li>
                </ul>
                <img
                  class="quesition-icon"
                  src="../../assets/images/question_icon.png"
                />
              </el-tooltip>
              <el-tooltip
                v-else
                effect="dark"
                content="Top center"
                placement="top"
              >
                <ul slot="content">
                  <li style="line-height: 20px">数据更新至昨日</li>
                  <li style="line-height: 20px">
                    总媒体数：统计所属公司累计所有录入的媒体数
                  </li>
                  <li style="line-height: 20px">
                    正常：指状态为“正常”的媒体数量
                  </li>
                  <li style="line-height: 20px">
                    待维修：指状态为“待维修”的媒体数量
                  </li>
                  <li style="line-height: 20px">
                    待安装：指状态为“待安装”的媒体数量
                  </li>
                  <li style="line-height: 20px">
                    禁用：指状态为“禁用”的媒体数量
                  </li>
                </ul>
                <img
                  class="quesition-icon"
                  src="../../assets/images/question_icon.png"
                />
              </el-tooltip>
              <el-radio-group
                v-model="isPoint"
                size="small"
                class="achievement-radio-group"
              >
                <el-radio-button :label="false">媒体</el-radio-button>
                <el-radio-button :label="true">点位(面)</el-radio-button>
              </el-radio-group>
            </template>
            <template slot="content">
              <ring-chart
                container="ringChart"
                :sourceData="ringData[isPoint * 1]"
              ></ring-chart>
              <div class="bottom-box">
                贵公司<span class="avtive">
                  {{ ringData[2][isPoint * 1][0] }} </span
                >个媒体处于不可投状态，多于全国<span class="avtive">
                  {{ ringData[2][isPoint * 1][1] }} </span
                >的公司，请尽快处理下吧！
              </div>
            </template>
          </index-custom-card>
        </el-col>
        <el-col :span="12">
          <index-custom-card height="520px">
            <template slot="head">
              预锁概况&nbsp;
              <el-tooltip effect="dark" content="Top center" placement="top">
                <ul slot="content">
                  <li style="line-height: 20px">数据每5分钟更新一次</li>
                </ul>
                <img
                  class="quesition-icon"
                  src="../../assets/images/question_icon.png"
                />
              </el-tooltip>
            </template>
            <template slot="content">
              <div style="padding: 20px 25px 10px">
                <el-table
                  :data="preLockArr"
                  class="lock-table"
                  max-height="486"
                >
                  <el-table-column prop="apName" label="方案" width="230">
                    <template slot-scope="scope">
                      <span
                        @click="routePage(scope.row)"
                        style="color: #1890ff; cursor: pointer"
                        >{{ scope.row.apName || "" }}</span
                      >
                    </template>
                  </el-table-column>
                  <el-table-column prop="dayDiffer" label="预锁剩余天数">
                    <template slot-scope="scope">
                      <mini-progress
                        slot="reference"
                        :target="0"
                        :percentage="(scope.row.dayDiffer / 7) * 100"
                        :value="scope.row.dayDiffer + '天'"
                        :height="'20px'"
                        :color="
                          scope.row.dayDiffer > 4
                            ? '#1890FF'
                            : scope.row.dayDiffer > 1
                            ? '#FAAD14'
                            : '#FF7875'
                        "
                      ></mini-progress>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </index-custom-card>
        </el-col>
      </el-row>

      <el-tabs
        class="index-tab-group"
        style="height: 643px; border: 1px solid #e5e6e9"
        v-model="activeTabsName"
      >
        <!-- <el-tab-pane label="点位分布" name="pointDistribution">
          <point-distribution
            mapContainer="mapContainer1"
            :hasMpvgl="hasMpvgl"
            :actived="activeTabsName === 'pointDistribution'"
          ></point-distribution>
        </el-tab-pane>
        <el-tab-pane label="点位上刊率" name="pointPublication">
          <publish-rate
            mapContainer="mapContainer2"
            :hasMpvgl="hasMpvgl"
            :actived="activeTabsName === 'pointPublication'"
          ></publish-rate>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { Button, Message } from "element-ui";
import timeFormat from "../../commonFun/timeFormat.js";
import homeLink from "../common/components/homeLink.vue";
import { api } from "../../api/api";
import sessFun from "../../commonFun/sessFun.js";
import indexIsDateFirst from "../../commonFun/indexIsDateFirst.js";
import noSearchResult from "../common/components/noSearchResult.vue";
import appCenter from "../../commonFun/json/appCenter.json";

import personalInfo from "../common/components/personalInfo.vue";
import messageAndApp from "../common/components/messageAndApp.vue";
import chartCard from "../common/components/chartCard.vue";
import indexCustomCard from "../common/components/indexCustomCard.vue";
import ringChart from "../common/components/ringChart.vue";
import miniProgress from "../common/components/miniProgress.vue";
import pointDistribution from "../common/components/pointDistribution.vue";
import publishRate from "../common/components/publishRate.vue";

import QRCode from "qrcodejs2";
var visible = null;
export default {
  name: "media_index",
  components: {
    homeLink,
    noSearchResult,
    personalInfo,
    messageAndApp,
    chartCard,
    indexCustomCard,
    ringChart,
    miniProgress,
    pointDistribution,
    publishRate,
    QRCode,
  },
  data() {
    return {
      hasMpvgl: false,
      activeTabsName: "pointDistribution",

      isAllMedia: false,
      isShowNum: false,
      // 勋章弹出框
      // isShowMedal: false,
      linkArrNew: [
        {
          imgurl: require("../../assets/images/importPoint.png"),
          title: "导出空位",
          link: "",
        },
        {
          imgurl: require("../../assets/images/fangan.png"),
          title: "新建方案",
          link: "./media/createPlanOld",
        },
        {
          imgurl: require("../../assets/images/addMedia.png"),
          title: "新建媒体",
          link: "./media/mediaInput",
        },
        {
          imgurl: require("../../assets/images/gua.png"),
          title: "维护管理",
          link: "./media/maintainList",
        },
        {
          imgurl: require("../../assets/images/gua.png"),
          title: "点位表盘",
          link: "./media/adsDialPlate",
        },
      ],
      userInfo: {
        userName: "",
        greetings: "祝您开心每一天!",
        avator: require("../../assets/images/tvQNA_img3.jpg"),
      },
      // 勋章排名
      medalInfo: {
        point: 1,
        help: 2,
        release: 3,
        pointNum: 0,
        helpNum: 0,
        releaseNum: 0,
      },
      imginfo: [
        {
          name: "录点能手",
          num: "",
          url: "",
          unit: "个",
          rank: 0,
        },
        {
          name: "协助新人",
          num: "",
          url: "",
          unit: "个",
          rank: 0,
        },
        {
          name: "发布之星",
          num: "",
          url: "",
          unit: "单",
          rank: 0,
        },
      ],
      // 公司勋章
      comimgInfo: [],
      companyHonor: [],
      // 应用中心
      appCenter: "",
      isSlideDown: true,

      cardData1: {
        type: "bar",
        title: "明日预锁到期方案",
        tip: "数据每5分钟更新一次，指明日将到期自动解锁的方案数量",
        value: 0,
        valueAlias: "方案个数",
        compare: 0,
        trendLabel: "同比上周",
        data: [],
      },
      cardData2: {
        type: "bar",
        title: "本月发布订单",
        tip: "数据每5分钟更新一次，本月该媒介发布的订单数量",
        value: 0,
        valueAlias: "订单数",
        compare: 0,
        trendLabel: "月环比",
        data: [],
      },
      cardData3: {
        type: "bar",
        title: "本月创建方案",
        tip: "数据每5分钟更新一次，本月该媒介协助创建的方案数量",
        value: 0,
        valueAlias: "方案数",
        compare: 0,
        trendLabel: "月环比",
        data: [],
      },
      cardDataOther1: {
        title: "社区总数",
        tip: "数据截止至昨日，社区总数数据来源为统计周期内新增的社区数量总和",
        value: 0,
        valueAlias: "新增小区数量",
        compare: 0,
        trendLabel: "同比去年",
        data: [],
      },
      cardDataOther2: {
        title: "在刊点位",
        tip: "数据每5分钟更新一次，当前正在被投放的点位数量",
        value: 0,
        valueAlias: "在刊点位数量",
        compare: 0,
        trendLabel: "同比上周",
        data: [],
        formatter: (text, item, index) => {
          if (index % 2 === 1 && index > 0 && index < 12) {
            return text.substr(5);
          }
        },
      },
      cardDataOther3: {
        title: "禁用点位",
        tip: "数据每5分钟更新一次，公司禁用的总点位数",
        value: 0,
        valueAlias: "禁用点位数量",
        compare: 0,
        trendLabel: "同比上周",
        data: [],
        formatter: (text, item, index) => {
          if (index % 2 === 1 && index > 0 && index < 12) {
            return text.substr(5);
          }
        },
      },
      // 媒体概况 媒体和点位切换
      isPoint: false,
      // 媒体概况饼图数据
      ringData: [
        [],
        [],
        [
          ["0", "0%"],
          ["0", "0%"],
        ],
      ],
      // 媒介预锁概况表格
      preLockArr: [],
    };
  },
  beforeCreate() {
    var glSript = document.createElement("script");
    glSript.type = "text/javascript";
    glSript.src =
      "https://api.map.baidu.com/api?type=webgl&v=1.0&ak=OuaBKFQpjyuK6a2BvVW7qbNagMkSAKqI&callback=init";
    document.body.appendChild(glSript);
    glSript.onload = () => {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "/static/mapvgl.min.js";
      document.body.appendChild(script);
      script.onload = () => {
        this.hasMpvgl = true;
      };
    };
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
        // console.log('用户中心渲染完成')
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
        // console.log(params)
        api
          .postApi(this.apiVar.UCAPI + "/UserStaticReport", {
            userStatics: JSON.stringify(params),
          })
          .then((res) => {
            // console.log('UserStaticReport---',res.data);
          });
      });
    },
    // 跳转到客户列表页面
    routePage(row) {
      sessionStorage.setItem("plan_apid", row.apID);
      this.$router.push("./media/planDetail");
    },
    // 首页报表接口
    allReportApi() {
      
    },
  },
  beforeRouteEnter(to, from, next) {
    /* 在渲染该组件的对应路由被 confirm 前调用
    不！能！获取组件实例 `this`
		因为当守卫执行前，组件实例还没被创建
		从登录页面过来后才可以弹出 */
    if (from.path == "/login") {
      visible = true;
    }
    next();
  },
  mounted() {
    this.getSession();
    let nowDate = timeFormat.toDate(new Date(), "/");
    if (indexIsDateFirst.getIsFirst(this.sessionData.uID, nowDate)) {
      this.isShowNum = true;
    }
    if (this.sessionData.mediaManageLevel == 1) {
      this.linkArrNew.pop();
    }
    this.appCenter = appCenter;
    this.uploadEvent(1);
    this.allReportApi();
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
.index-tab-group {
  background: #fff;
  position: relative;
  /deep/ .el-tabs__nav-scroll {
    padding-left: 40px;
    line-height: 52px;
    font-size: 16px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(24, 144, 255, 1);
  }
  /deep/ .el-tabs__item {
    font-size: 16px;
  }
  /deep/ .el-tabs__content {
    padding: 9px 24px 24px 24px;
    height: calc(100% - 67px);
    box-sizing: border-box;
    .el-tab-pane {
      height: 100%;
    }
  }
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
      height: 428px;
      width: 100%;
      margin-top: 24px;
    }
  }
  .right-board {
    width: calc(25% - 24px);
    height: 582px;
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

  .achievement-radio-group {
    margin-left: auto;
    /deep/ .el-radio-button__inner {
      width: 88px;
      font-size: 14px;
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
