<template>
  <div>
    <div class="ad_index_container">
      <div class="index-top-row">
        <div class="left-layout">
          <personal-info
            :rank="rankInfo[0].rank || ''"
            :user-info="sessionData"
            :honor-img="companyHonor"
            :linkArr="linkArrNew"
          ></personal-info>
          <div class="card-group">
            <el-row :gutter="24">
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
        <el-col :span="12">
          <index-custom-card>
            <template slot="head"> 业绩目标 </template>
            <template slot="content">
              <gauge-chart
                container="gaugeChart"
                :gaugeData="gaugeData"
              ></gauge-chart>
              <div class="bottom-box">
                您本年业绩目标为
                <span class="avtive">
                  {{ gaugeData.targetPrice | moneyFormat("¥") }}
                </span>
                完成了<span class="avtive"> {{ gaugeData.finshProcess }}% </span
                >业绩排名第<span class="avtive"> {{ gaugeData.rank }} </span
                >，请继续努力
              </div>
            </template>
          </index-custom-card>
        </el-col>
        <el-col :span="12">
          <index-custom-card>
            <template slot="head"> 合作客户 </template>
            <template slot="content">
              <el-table :data="clientArr" max-height="483">
                <el-table-column
                  show-overflow-tooltip
                  prop="cname"
                  label="客户"
                  width="150"
                >
                </el-table-column>
                <el-table-column show-overflow-tooltip label="品牌" width="150">
                  <template slot-scope="scope">
                    <span>{{ scope.row.bTitle || "--" }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  sortable
                  prop="dayDiff"
                  label="沉默天数"
                  width="120"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  sortable
                  prop="totalAdPrice"
                  label="合作金额"
                  width="auto"
                >
                  <template slot-scope="scope">
                    <mini-progress
                      style="cursor: unset"
                      slot="reference"
                      :target="0"
                      :percentage="scope.row.rate * 1"
                      :value="scope.row.totalAdPrice | moneyFormat('¥')"
                      :height="'20px'"
                      :color="'rgba(24, 144, 255, 1)'"
                    ></mini-progress>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </index-custom-card>
        </el-col>
      </el-row>
      <el-row class="index-row">
        <el-col :span="24">
          <index-custom-card height="auto">
            <template slot="head"> 点位分布 </template>
            <template slot="content">
              <point-distribution
                style="padding-bottom: 24px"
                mapContainer="mapContainer1"
                :hasMpvgl="hasMpvgl"
                :actived="true"
              ></point-distribution>
            </template>
          </index-custom-card>
        </el-col>
      </el-row>
    </div>
    <!-- 动效 -->
    <div class="monthly_ranking" v-show="isMonthlyRanking">
      <div class="monthly_ranking_box">
        <div class="monthly_ranking_title">
          <img src="../../assets/images/index/BD.png" alt="" />
        </div>
        <div class="monthly_ranking_content">
          <el-row>
            <el-col :span="8">
              <div class="monthly_ranking_city monthly_ranking_content_first">
                <div id="first_box">
                  <img
                    src="../../assets/images/index/left-star.png"
                    alt=""
                    class="monthly_ranking_img_top_left"
                  />
                  <img
                    src="../../assets/images/index/right-star.png"
                    alt=""
                    class="monthly_ranking_img_top_right"
                  />
                  <img
                    src="../../assets/images/index/left.png"
                    alt=""
                    class="monthly_ranking_img_left"
                  />
                  <img
                    src="../../assets/images/index/header_min.png"
                    alt=""
                    class="monthly_ranking_img_meiddle"
                  />
                  <img
                    :src="rankInfo[0].headPic"
                    alt=""
                    class="monthly_ranking_img_meiddle header_style"
                  />
                  <img
                    src="../../assets/images/index/right.png"
                    alt=""
                    class="monthly_ranking_img_right"
                  />
                  <img
                    src="../../assets/images/index/name.png"
                    alt=""
                    class="monthly_ranking_img_bottom"
                  />
                  <span class="monthly_ranking_city_name city_name_left">{{
                    rankInfo[0].username
                  }}</span>
                  <span class="ranking_num first_ranking_num"
                    >第{{ rankInfo[0].rank }}名</span
                  >
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="monthly_ranking_city monthly_ranking_content_second">
                <img
                  id="second_top_left"
                  src="../../assets/images/index/left-star.png"
                  alt=""
                  class="monthly_ranking_img_top_left"
                />
                <img
                  id="second_top_right"
                  src="../../assets/images/index/right-star.png"
                  alt=""
                  class="monthly_ranking_img_top_right"
                />
                <img
                  id="second_img_left"
                  src="../../assets/images/index/left.png"
                  alt=""
                  class="monthly_ranking_img_left"
                />
                <img
                  id="meiddle"
                  src="../../assets/images/index/header_min.png"
                  alt=""
                  class="monthly_ranking_img_meiddle"
                />
                <img
                  id="meiddle"
                  :src="rankInfo[1].headPic"
                  alt=""
                  class="monthly_ranking_img_meiddle center_header"
                />
                <img
                  id="second_img_right"
                  src="../../assets/images/index/right.png"
                  alt=""
                  class="monthly_ranking_img_right"
                />
                <img
                  id="second_img_name"
                  src="../../assets/images/index/name.png"
                  alt=""
                  class="monthly_ranking_img_bottom"
                />
                <span
                  id="second_city_name"
                  class="monthly_ranking_city_name city_name_meiddle"
                  >{{ rankInfo[1].username }}</span
                >
                <span class="ranking_num second_ranking_num"
                  >第{{ rankInfo[1].rank }}名</span
                >
              </div>
            </el-col>
            <el-col :span="8">
              <div class="monthly_ranking_city monthly_ranking_content_three">
                <div id="three_box">
                  <img
                    src="../../assets/images/index/left-star.png"
                    alt=""
                    class="monthly_ranking_img_top_left"
                  />
                  <img
                    src="../../assets/images/index/right-star.png"
                    alt=""
                    class="monthly_ranking_img_top_right"
                  />
                  <img
                    src="../../assets/images/index/left.png"
                    alt=""
                    class="monthly_ranking_img_left"
                  />
                  <img
                    src="../../assets/images/index/header_min.png"
                    alt=""
                    class="monthly_ranking_img_meiddle"
                  />
                  <img
                    :src="rankInfo[2].headPic"
                    alt=""
                    class="monthly_ranking_img_meiddle header_style"
                  />
                  <img
                    src="../../assets/images/index/right.png"
                    alt=""
                    class="monthly_ranking_img_right"
                  />
                  <img
                    src="../../assets/images/index/name.png"
                    alt=""
                    class="monthly_ranking_img_bottom"
                  />
                  <span class="monthly_ranking_city_name city_name_right">{{
                    rankInfo[2].username
                  }}</span>
                  <span class="ranking_num three_ranking_num"
                    >第{{ rankInfo[2].rank }}名</span
                  >
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="monthly_ranking_bottom">
            <div
              class="monthly_ranking_bottom_btn"
              @click="isMonthlyRanking = !isMonthlyRanking"
            >
              继续努力
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Message } from "element-ui";
import homeLink from "../common/components/homeLink.vue";
import { api } from "../../api/api";
import timeFormat from "../../commonFun/timeFormat";
import sessFun from "../../commonFun/sessFun.js";
import appCenter from "../../commonFun/json/appCenter.json";
import indexIsDateFirst from "../../commonFun/indexIsDateFirst.js";
import noSearchResult from "../../components/common/components/noSearchResult.vue";

import personalInfo from "../common/components/personalInfo.vue";
import messageAndApp from "../common/components/messageAndApp.vue";
import chartCard from "../common/components/chartCard.vue";
import indexCustomCard from "../common/components/indexCustomCard.vue";
import gaugeChart from "../common/components/gaugeChart.vue";
import miniProgress from "../common/components/miniProgress.vue";
import pointDistribution from "../common/components/pointDistribution.vue";

export default {
  name: "sale_index",
  components: {
    homeLink,
    noSearchResult,
    elButton: Button,

    personalInfo,
    messageAndApp,
    chartCard,
    miniProgress,
    indexCustomCard,
    gaugeChart,
    pointDistribution,
  },
  data() {
    return {
      sessionData: {},
      hasMpvgl: false,
      // 动效
      isMonthlyRanking: false,
      dataArr: [
        {
          name: "当月激活客户数",
          data: 87,
        },
        {
          name: "当月订单数",
          data: 18,
        },
        {
          name: "当月成交金额",
          data: 388,
        },
      ],
      priceList: [0, 25, 50, 75, 100],
      // 是否显示进度条
      isShowLine: true,
      // 进度排名
      saleInfo: {
        price: 30,
        rank: 9,
      },
      // 排名信息
      rankInfo: [
        {
          username: "",
          rank: "",
          headPic: require("../../assets/images/index/niu.png"),
        },
        {
          username: "",
          rank: "",
          headPic: require("../../assets/images/index/niu.png"),
        },
        {
          username: "",
          rank: "",
          headPic: require("../../assets/images/index/niu.png"),
        },
      ],
      // 勋章
      companyHonor: [],
      isCom: false,
      // 应用中心
      appCenter: "",
      isSlideDown: true,
      cardData1: {
        name: "cardData1",
        title: "本月成交金额",
        tip: "数据截止至昨日，销售额数据来源为统计周期内发布的订单金额总和",
        value: 0,
        valueAlias: "成交额",
        prefix: "¥",
        compare: 0,
        trendLabel: "月环比",
        data: [],
      },
      cardData2: {
        name: "cardData2",
        title: "本月订单",
        tip: "数据每5分钟更新一次，统计当月发布的订单数量",
        value: 0,
        valueAlias: "订单数",
        compare: 0,
        trendLabel: "月环比",
        data: [],
      },
      cardData3: {
        name: "cardData3",
        title: "本月激活客户",
        tip: "数据每5分钟更新一次，统计该销售当月发布过订单的客户数量",
        value: 0,
        valueAlias: "客户数",
        compare: 0,
        trendLabel: "月环比",
        data: [],
      },
      // 客户列表
      clientArr: [],
      // 业绩目标仪表盘数据
      gaugeData: {},
    };
  },
  computed: {
    linkArrNew() {
      const { permissions = [] } = sessFun.getSess() || {}
      const list = [
        {
          imgurl: require("../../assets/images/map.png"),
          title: "地图选点",
          link: "",
        },
        {
          imgurl: require("../../assets/images/importPoint.png"),
          title: "导出空位",
          link: "",
        },
        {
          imgurl: require("../../assets/images/fangan.png"),
          title: "新建方案",
          link: "./sale/createPlanOld",
        },
        {
          imgurl: require("../../assets/images/img.png"),
          title: "行业图片",
          link: "./sale/photoGallery",
        },
        {
          imgurl: require("../../assets/images/client.png"),
          title: "新建客户",
          link: "./sale/createClient",
        },
        {
          imgurl: require("../../assets/images/gua.png"),
          title: "点位表盘",
          link: "./sale/adsDialPlate",
        },
      ]
      // 客户投放
      if (permissions.includes('customerDetecting')) {
        list.unshift({
          imgurl: require("../../assets/images/fangan.png"),
          title: "客户投放",
          link: "./sale/customerMonitoringList",
        })
      }
      return list
    }
  },
  methods: {
    getSession() {
      this.sessionData = sessFun.getSess();
    },
    resizeRank(price) {
      let rankLength =
        document.getElementsByClassName("timeline")[0].offsetWidth;
      let maxPrice = this.priceList[this.priceList.length - 1];
      let truePrice = document.getElementById("rank_info");
      let side = (price / maxPrice) * rankLength;
      truePrice.style.left = side + "px";
      document.getElementsByClassName("rank_line")[0].style.width = side + "px";
    },
    // 排名弹窗
    getRank() {
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
      };
      api
        .getApi(this.apiVar.report + "/GetMonthRankOfBD", info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let resinfo = res.data.data;
            let result = [];
            for (let data of resinfo) {
              let obj = {
                username: data.realName,
                headPic: data.headPic
                  ? data.headPic
                  : require("../../assets/images/index/niu.png"),
                rank: data.rankNumber,
              };
              result.push(obj);
            }
            if (result.length == 3) {
              this.rankInfo = result;
            } else if (result.length == 1) {
              let obj = {
                username: "张三",
                headPic: require("../../assets/images/index/niu.png"),
                rank: result[0].rank + 1,
              };
              result.unshift(obj);
              let otherObj = {
                username: "老五",
                headPic: require("../../assets/images/index/niu.png"),
                rank: result[0].rank + 1,
              };
              result.push(otherObj);
              this.rankInfo = result;
            } else if (result.length == 2) {
              let max = Math.max(result[1].rank, result[0].rank);
              let obj = {
                username: "王五",
                headPic: require("../../assets/images/index/niu.png"),
                rank: max + 1,
              };
              result.push(obj);
              this.rankInfo = result;
            }
            let timer = setTimeout(() => {
              this.animateFun();
              clearTimeout(timer);
            }, 200);
          } else {
            this.$message({
              type: "warning",
              message: res.data.MSG,
              duration: 1000,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取数据
    getData() {
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
      };
      api
        .getApi(this.apiVar.report + "/GetHomePageInfoOfBD", info)
        .then((res) => {
          // console.log(res.data);
          if (res.data.SysCode == 200200) {
            let resInfo = res.data.data;
            this.dataArr[0].data = resInfo.customerCount;
            this.dataArr[1].data = resInfo.orderCount;
            this.dataArr[2].data = resInfo.apTotal / 100;
          } else {
            Message.warning(res.data.MSG);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取业绩进度
    getTarget() {
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
      };
      api
        .getApi(this.apiVar.report + "/GetTargetOfYear", info)
        .then((res) => {
          // console.log(res.data);
          if (res.data.SysCode == 200200) {
            let target = res.data.data.targetOfYear / 1000000;
            let oneTarget = target / 4;
            // this.priceList = [0, oneTarget, oneTarget*2, oneTarget*3, oneTarget*4, target];
            this.priceList = [
              0,
              oneTarget,
              oneTarget * 2,
              oneTarget * 3,
              target,
            ];
            if (target) {
              this.getAptotal();
            } else {
              this.isShowLine = false;
            }
          } else {
            this.isShowLine = false;
            // Message.warning(res.data.MSG);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取这个月销售额
    getAptotal() {
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
      };
      api
        .getApi(this.apiVar.report + "/GetApTotalSoFarOfBD", info)
        .then((res) => {
          // console.log(res.data);
          if (res.data.SysCode == 200200) {
            let resinfo = res.data.data;
            this.saleInfo = {
              price: resinfo.apTotalSoFar / 1000000,
              rank: resinfo.rankNumber,
            };
            let price = 0;
            if (
              resinfo.apTotalSoFar / 1000000 >
              this.priceList[this.priceList.length - 1]
            ) {
              price = this.priceList[this.priceList.length - 1];
            } else {
              price = this.saleInfo.price;
            }
            this.resizeRank(price);
            // 实时监听body宽度变化
            window.addEventListener("resize", () => {
              this.resizeRank(price);
            });
          } else {
            Message.warning(res.data.MSG);
          }
        });
    },
    // 开场动画
    animateFun() {
      this.isMonthlyRanking = true;
      $(".monthly_ranking_title").animate(
        {
          top: "-10px",
          opacity: 1,
        },
        400,
        () => {
          $(".monthly_ranking_title").animate(
            {
              top: "0px",
            },
            150
          );
        }
      );
      // 中间主图
      let time1 = setTimeout(() => {
        $("#meiddle").animate(
          {
            left: "47px",
            height: "162px",
            width: "162px",
          },
          400,
          () => {
            $("#meiddle").animate(
              {
                height: "152px",
                width: "152px",
              },
              150,
              () => {
                // 左边喇叭
                document.getElementById("second_img_left").style.display =
                  "block";
                $("#second_img_left").animate(
                  {
                    left: "0px",
                  },
                  200
                );
                // 右边喇叭
                document.getElementById("second_img_right").style.display =
                  "block";
                $("#second_img_right").animate(
                  {
                    right: "-3px",
                  },
                  200,
                  () => {
                    // 底下城市名称背景图
                    document.getElementById("second_img_name").style.display =
                      "block";
                    $("#second_img_name").animate(
                      {
                        top: "114px",
                      },
                      200,
                      () => {
                        // 左边花
                        document.getElementById(
                          "second_top_left"
                        ).style.display = "block";
                        $("#second_top_left").animate(
                          {
                            top: "-20px",
                          },
                          200,
                          () => {
                            // 右边花
                            document.getElementById(
                              "second_top_right"
                            ).style.display = "block";
                            $("#second_top_right").animate(
                              {
                                top: "-22px",
                              },
                              200
                            );
                          }
                        );
                      }
                    );
                    // 底下城市名称
                    document.getElementById("second_city_name").style.display =
                      "block";
                    $("#second_city_name").animate(
                      {
                        top: "115px",
                      },
                      200,
                      () => {
                        //  底部名次
                        $(".second_ranking_num").animate(
                          {
                            bottom: "-25px",
                            opacity: 1,
                          },
                          100
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
        clearTimeout(time1);
      }, 550);
      // 左边动画 first_box three_box
      let time2 = setTimeout(() => {
        // 左边动画
        document.getElementById("first_box").style.display = "block";
        $("#first_box").animate(
          {
            bottom: "20px",
          },
          300,
          () => {
            $("#first_box").animate(
              {
                bottom: "0px",
              },
              100
            );
          }
        );
        // 右边动画
        document.getElementById("three_box").style.display = "block";
        $("#three_box").animate(
          {
            bottom: "20px",
          },
          300,
          () => {
            $("#three_box").animate(
              {
                bottom: "0px",
              },
              100,
              () => {
                // 底部按钮
                $(".monthly_ranking_bottom_btn").animate(
                  {
                    bottom: "0px",
                    opacity: 1,
                  },
                  150
                );
                // 左边名次
                $(".first_ranking_num").animate(
                  {
                    bottom: "-3px",
                    opacity: 1,
                  },
                  150
                );
                // 右边名次
                $(".three_ranking_num").animate(
                  {
                    bottom: "-3px",
                    opacity: 1,
                  },
                  150
                );
              }
            );
          }
        );
        clearTimeout(time2);
      }, 1750);
    },
    // 应用中心的展开和收起
    slideAppCenterItem() {
      this.isSlideDown = !this.isSlideDown;
      if (!this.isSlideDown) {
        this.uploadEvent(1);
      }
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
    // 首页报表接口
    allReportApi() {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
      };
      // 销售的成交金额 /report /homepage/getBDCardReport
      api
        .getApi(this.apiVar.report + "/homepage/getBDCardReport", params)
        .then((res) => {
          if (res.data.SysCode === 200200) {
            let temp = res.data.data;
            Object.assign(this.cardData1, {
              value: temp.orderPrice,
              compare: temp.orderPriceIncrRate,
            });
            Object.assign(this.cardData2, {
              value: temp.orderCnt,
              compare: temp.orderCntIncrRate,
            });
            Object.assign(this.cardData3, {
              value: temp.customCnt,
              compare: temp.customCntIncrRate,
            });
          } else {
            Message.warning(res.data.MSG);
          }
        })
        .catch((err) => {
          console.log("err", err);
        })
        .finally((_) => {});

      // 销售的周报数据 /report /homepage/getBDWeekReport
      api
        .getApi(this.apiVar.report + "/homepage/getBDWeekReport", params)
        .then((res) => {
          if (res.data.SysCode === 200200 && Array.isArray(res.data.data)) {
            let temp = res.data.data,
              tempcCardData1 = [],
              tempcCardData2 = [],
              tempcCardData3 = [];
            temp.forEach((item, index) => {
              let commonObj = {
                dateStr: `第${index + 1}周`,
                week: item.weekStart + "~" + item.weekEnd,
              };
              tempcCardData1.push({
                ...commonObj,
                value: item.orderPrice || 0,
              });
              tempcCardData2.push({
                ...commonObj,
                value: item.orderCnt || 0,
              });
              tempcCardData3.push({
                ...commonObj,
                value: item.customCnt || 0,
              });
            });
            Object.assign(this.cardData1, {
              data: tempcCardData1,
            });
            Object.assign(this.cardData2, {
              data: tempcCardData2,
            });
            Object.assign(this.cardData3, {
              data: tempcCardData3,
            });
          } else {
            Message.warning(res.data.MSG);
          }
        })
        .catch((err) => {
          console.log("err", err);
        })
        .finally((_) => {});
      // 销售业绩目标 /report /homepage/getBDAchievementReport
      api
        .getApi(this.apiVar.report + "/homepage/getBDAchievementReport", params)
        .then((res) => {
          if (res.data.SysCode === 200200) {
            let temp = res.data.data;
            this.gaugeData = {
              uID: temp.uID || null, //销售id
              totalPrice: temp.totalPrice || 0, //销售本年完成的金额
              targetPrice: temp.targetPrice || 0, //销售本年的业绩
              rank: temp.rank || 0, //公司排名
              finshProcess: temp.finshProcess * 1 || 0, //完成进度,要是number
            };
          } else {
            Message.warning(res.data.MSG);
          }
        })
        .catch((err) => {
          console.log("媒体概况", err);
        })
        .finally((_) => {});
      // 合作客户 /report /homepage/getBDActiveCustomerReport
      api
        .getApi(
          this.apiVar.report + "/homepage/getBDActiveCustomerReport",
          params
        )
        .then((res) => {
          if (res.data.SysCode === 200200) {
            this.clientArr = res.data.data || [];
          } else {
            Message.warning(res.data.MSG);
            console.error("getBDActiveCustomerReport", res.data.MSG);
          }
        })
        .catch((err) => {
          console.error("err", err);
        })
        .finally((_) => {});
    },
  },
  beforeCreate() {
    var glSript = document.createElement("script");
    glSript.type = "text/javascript";
    glSript.src =
      "https://api.map.baidu.com/api?type=webgl&v=1.0&ak=lUXDm9ximz8kysFkEXggFm1qYK9HCBx8&callback=init";
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
  mounted() {
    this.getSession();
    // this.getIsCom();
    let nowDate = timeFormat.toDate(new Date(), "/");
    if (indexIsDateFirst.getIsFirst(this.sessionData.uID, nowDate)) {
      this.getRank();
    }
    // 获取数据
    this.getData();
    // 获取目标
    // this.getTarget();
    // 那句话
    // this.getOneTalk();
    //用户中心
    this.appCenter = appCenter;
    this.uploadEvent(1);
    this.allReportApi();
  },
};
</script>

<style scoped lang="scss">
/** 新增*/
/deep/ .custom-card-content {
  padding: 25px 25px 0;
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
      // height: 428px;
      width: 100%;
      margin-top: 24px;
    }
  }
  .right-board {
    width: calc(25% - 24px);
    height: 356px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid #e6e7e9;
  }
}
.index-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  & > div {
    flex: 1;
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

.h2_style {
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  background: #fff;
  font-size: 16px;
  font-weight: bold;
  height: 52px;
  line-height: 52px;
  padding-left: 24px;
  border-bottom: 1px solid #ececec;
}

.loglist_box {
  padding: 10px 24px 0;
  height: 150px;
  overflow-x: hidden;
  overflow-y: scroll;
}

.loglist_box::-webkit-scrollbar {
  width: 4px;
  background: #fafafa;
}

.loglist_box::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  background: #c1c1c1;
  border-radius: 4px;
}

/* 进度条 */
.timeline {
  /* width: 98%; */
  margin: 0;
  font-size: 14px;
  list-style: none;
  display: flex;
}

.timeline_item {
  margin: 0 !important;
  padding: 0 0 12px;
  list-style: none;
  position: relative;
}

.line_tail {
  width: 100%;
  border-top: 1px solid #e8eaec;
  position: absolute;
  left: 4px;
  top: 4px;
}

.line_head {
  width: 8px;
  height: 8px;
  background-color: #2d8cf0;
  border-radius: 50%;
  border: 1px solid transparent;
  position: absolute;
  border-color: #2d8cf0;
  color: #2d8cf0;
}

.line_content {
  padding: 1px 1px 10px 24px;
  font-size: 12px;
  position: relative;
  left: -25px;
  bottom: -15px;
  width: 50px;
}

.timeline_item:last-child {
  width: 0% !important;
}

.timeline_item:last-child .line_tail {
  display: none;
}

#rank_info {
  width: 100px;
  top: -30px;
}

.rank_img img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  vertical-align: middle;
}

// .rank_line {
//     border-radius: 50%;
//     border: 1px solid #2d8cf0;
//     position: absolute;
//     top: 4px;
//     background-color: rgba(191, 191, 191, 1);
//     color: #2d8cf0;
//     z-index: 20;
// }

.span_rank {
  float: right;
  padding-right: 24px;
  font-size: 14px;
  font-weight: normal;
}

/* 你的助手 */
.time_box {
  text-align: center;
  padding-top: 10px;
}

.time {
  width: 120px;
  height: 24px;
  background: rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  color: #fff;
  padding: 2px 5px;
  font-size: 12px;
}

.info_box {
  margin: 15px 0;
}

.info_box img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-block;
}

.info_content {
  background: #fff;
  position: relative;
  margin-left: 10px;
  padding: 10px;
  font-size: 14px;
  color: rgba(102, 102, 102, 1);
  display: inline-block;
  max-width: 260px;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid #ebeef5;
  word-break: break-all;
}

.info_arrow {
  position: absolute;
  left: -10px;
  top: 35%;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;

  border-width: 10px;
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.03));

  border-left-width: 0;
  border-right-color: #fff;
}

.info_arrow::after {
  border-left-width: 0;
  border-right-color: #fff;
}

/* 动效 */
/* #rank_model{
        position: relative;
        width: 960px;
        height: 420px;
        margin: 200px auto 0;
    }
    #rank_model img{
        position: absolute;
        top: 113px;
        left: -1000px;
    }
    #rank_model .on{
        left: -8px;
        transition: 0.5s 1s;
    } */

#rank_model {
  width: 190px;
  height: 120px;
  padding: 3px;
  position: absolute;
  z-index: 12;
  top: 100px;
  left: 50%;
}

/*动画名字， 动画运行的时间，alternate平滑过渡， infinite是反复执行*/
#rank_model {
  animation-name: imgAnimation;
  animation: imgAnimation 2s alternate;
  -webkit-animation: imgAnimation 2s alternate;
  -moz-animation: imgAnimation 2s alternate infinite;
}

/* 动效 */
/*城市月季排行*/
.monthly_ranking {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 998;
  background: rgba(0, 0, 0, 0.3);
}

.monthly_ranking_box {
  width: 720px;
  margin: 190px auto;
  height: 470px;
  /*border: 1px solid #fff;*/
}

.monthly_ranking_title {
  position: relative;
  margin: 0 auto;
  text-align: center;
  top: 70px;
  opacity: 0;
}

.monthly_ranking_title img {
  width: 389px;
  height: 152px;
}

.monthly_ranking_city {
  position: relative;
  margin-top: 32px;
  height: 160px;
}

/*顶部花*/
.monthly_ranking_img_top_left,
.monthly_ranking_img_top_right {
  position: absolute;
  z-index: 999;
}

.monthly_ranking_img_left {
  position: absolute;
  left: 0;
}

.monthly_ranking_img_meiddle {
  position: absolute;
  left: 47px;
  width: 126px;
  height: 126px;
  z-index: 1000;
}

.monthly_ranking_img_right {
  position: absolute;
  right: 8%;
}

/*底部名次*/
.ranking_num {
  position: absolute;
  color: #fff;
  letter-spacing: 8px;
  font-size: 18px;
  /*display: none;*/
}

.monthly_ranking_img_bottom {
  position: absolute;
  z-index: 1001;
  top: 90px;
  width: 142px;
  left: 40px;
}

.monthly_ranking_city_name {
  position: absolute;
  z-index: 1001;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
  text-align: center;
  display: inline-block;
  width: 142px;
}

/*左边城市名称*/
.city_name_left {
  bottom: 45px;
  /* left: 88px; */
  left: 42px;
}

/*左边*/
#first_box {
  display: none;
  position: absolute;
  height: 160px;
  width: 100%;
  bottom: -120px;
}

.monthly_ranking_content_first .monthly_ranking_img_top_left {
  top: -26px;
  left: 53px;
}

.monthly_ranking_content_first .monthly_ranking_img_top_right {
  right: 66px;
  top: -27px;
}

.first_ranking_num {
  /*bottom: -3px;*/
  bottom: -30px;
  left: 75px;
  opacity: 0;
}

/*中间*/
.monthly_ranking_content_second .monthly_ranking_img_meiddle {
  left: 100px;
  width: 0;
  height: 0;
}

.monthly_ranking_content_second .monthly_ranking_img_left {
  display: none;
  left: 40px;
}

.monthly_ranking_content_second .monthly_ranking_img_right {
  right: 30px;
  top: 1px;
  display: none;
}

.monthly_ranking_content_second .monthly_ranking_img_bottom {
  top: 180px;
  display: none;
  left: 53px;
}

.city_name_meiddle {
  left: 54px;
  top: 180px;
  display: none;
}

.monthly_ranking_content_second .monthly_ranking_img_top_left {
  left: 58px;
  display: none;
  top: -50px;
}

.monthly_ranking_content_second .monthly_ranking_img_top_right {
  right: 45px;
  top: -50px;
  display: none;
}

.second_ranking_num {
  bottom: -50px;
  left: 88px;
  opacity: 0;
}

/*右边*/
#three_box {
  display: none;
  position: absolute;
  height: 160px;
  width: 100%;
  bottom: -120px;
}

.monthly_ranking_content_three .monthly_ranking_img_top_left {
  top: -22px;
  left: 75px;
}

.monthly_ranking_content_three .monthly_ranking_img_top_right {
  right: 40px;
  top: -28px;
}

.monthly_ranking_content_three .monthly_ranking_img_meiddle {
  left: 30%;
}

.monthly_ranking_content_three .monthly_ranking_img_left {
  left: 25px;
  top: 0;
}

.monthly_ranking_content_three .monthly_ranking_img_right {
  right: -3px;
}

.monthly_ranking_content_three .monthly_ranking_img_bottom {
  left: 64px;
}

.monthly_ranking_bottom {
  color: #ffd424;
  text-align: center;
  margin-top: 48px;
}

.monthly_ranking_bottom_btn {
  position: relative;
  margin: 0 auto;
  width: 102px;
  height: 34px;
  line-height: 34px;
  background: #f25a5a;
  border-radius: 3px;
  cursor: pointer;
  z-index: 999;
  bottom: -50px;
  opacity: 0;
}

.city_name_right {
  bottom: 45px;
  /* left: 114px; */
  left: 64px;
}

.three_ranking_num {
  bottom: -30px;
  left: 100px;
  opacity: 0;
}

.header_style {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  position: absolute;
  left: 60px;
  top: 16px;
}

.monthly_ranking_content_three .header_style {
  left: 85px;
}

.monthly_ranking_content_second .center_header {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  left: 62px;
  top: 20px;
}

@-webkit-keyframes imgAnimation {
  0% {
    top: 500px;
    left: 50%;
  }
  100% {
    top: 100px;
    left: 50%;
  }
}

.img_point {
  text-align: center;
  color: #666;
  margin-top: 20px;
  padding-bottom: 20px;
}
</style>
