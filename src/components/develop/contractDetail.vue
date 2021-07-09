<!--
 * @Author: penglei
 * @Date: 2021-06-16 20:01:37
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-09 14:03:36
 * @FilePath: /frontend/src/components/develop/contractDetail.vue
-->
<template>
  <div class="contract-detail-page">
    <el-breadcrumb separator="/" class="contract-crumb">
      <el-breadcrumb-item>合同管理</el-breadcrumb-item>
      <el-breadcrumb-item>合同详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="detail-common">
      <el-row>
        <el-col :span="24">
          <span class="detail-common-title">{{ resName || "" }}</span>
        </el-col>
        <el-col
          :span="6"
          v-for="(item, index) in resInfo"
          :key="index"
          class="detail-item"
        >
          <label class="detail-item-label">{{ `${item.label}：` }}</label>
          <div class="detail-item-content">{{ item.value }}</div>
        </el-col>
      </el-row>
    </div>
    <div class="tab-container">
      <el-tabs
        v-model="activeTabName"
        type="border-card"
        @tab-click="handleTabClick"
      >
        <el-tab-pane
          v-for="(item, index) in originDataList"
          :key="index"
          :name="item.poriginID + ''"
          class="custom-tabs__content"
        >
          <el-tooltip
            slot="label"
            :content="item.originName || '待定'"
            placement="top"
            effect="light"
          >
            <span class="custom-tab-laber">{{
              item.originName || "待定"
            }}</span>
          </el-tooltip>
          <el-container>
            <el-aside width="200px">
              <el-menu :default-active="currentDcID + ''">
                <el-menu-item
                  v-for="(
                    contractItem, contractIndex
                  ) in item.devContractDataList"
                  :key="contractIndex"
                  :index="contractItem.dcID + ''"
                  @click="currentDcID = contractItem.dcID"
                >
                  <div slot="title">
                    <div class="contract-name">
                      {{ contractTypeArr[contractItem.dcType] }}
                    </div>
                    <div class="contract-date">
                      {{ contractItem.createTime.split(" ")[0] }}
                    </div>
                  </div>
                </el-menu-item>
              </el-menu>
            </el-aside>
            <el-main>
              <contractDetailCommon
                v-if="item.poriginID==activeTabName"
                :dcID="currentDcID"
                @refresh="getContractDetailList"
              ></contractDetailCommon>
            </el-main>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import api from "../../api/api.js";
import commaFormat from "../../commonFun/commaFormat.js";
import contractDetailCommon from "./components/contractDetailCommon.vue";
export default {
  name: "contractDetail",
  components: {
    contractDetailCommon,
  },
  props: {},
  created() {},
  data() {
    return {
      contractTypeArr: {
        0: "首签合同",
        1: "续签合同",
        2: "加门合同",
        3: "补充协议",
      },
      resID: this.$route.query.resID || "",
      originDataList: [],
      resName: "",
      resInfo: [],
      activeTabName: "",
      detailArr: [],
      currentDcID: "",
    };
  },
  watch: {},
  computed: {},
  mounted() {
    // 获取该小区合同详情
    this.getContractDetailList();
  },
  methods: {
    handleTabClick(tab) {
      let originIndex = this.originDataList.findIndex(
        (item) => this.activeTabName == item.poriginID
      );
      if (originIndex != -1) {
        let contractArr = this.originDataList[originIndex].devContractDataList;
        contractArr[0] && (this.currentDcID = contractArr[0].dcID);
      }
    },
    getContractDetailList() {
      if (!this.resID) {
        this.$message.warning("资源信息获取失败！");
        return;
      }
      api
        .getApi("/addsp/devContract/getContractDetailList", {
          resID: this.resID,
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let detailObj = res.data.data;
            for (const key in detailObj) {
              if (Object.hasOwnProperty.call(detailObj, key)) {
                if (detailObj[key] == undefined || detailObj[key] == null) {
                  detailObj[key] = "--";
                }
              }
            }
            this.resName = detailObj.resName;
            this.resInfo = [
              { label: "资源地址", value: detailObj.resAddress },
              { label: "楼盘类型", value: detailObj.cType },
              {
                label: "楼盘价格",
                value: commaFormat.format(Math.floor(detailObj.hPrice / 100)),
              },
              { label: "小区户数", value: detailObj.hNum },
              { label: "楼栋数量", value: detailObj.fNum },
              { label: "入住年份", value: detailObj.chDay },
              { label: "总合同媒体数", value: detailObj.totalMediaCnt },
              { label: "总安装媒体数", value: detailObj.totalInstallMediaCnt },
              {
                label: "总付款金额",
                value:
                  "¥" + commaFormat.init(Math.floor(detailObj.payTotal / 100)),
              },
            ];
            this.originDataList = detailObj.originDataList || [];
            if (this.originDataList.length > 0) {
              this.activeTabName = this.originDataList[0].poriginID + "";
              if (this.originDataList[0])
                this.currentDcID =
                  this.originDataList[0].devContractDataList[0].dcID;
            }
          } else {
            this.$message.warning(res.data.MSG || "小区合同信息获取失败！");
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.contract-crumb {
  margin: 12px 0;
}
.contract-detail-page {
  margin: 0 60px;
  position: relative;
  .el-menu {
    box-sizing: border-box;
    height: 100%;
    padding: 7px 0;
  }
  .el-menu-item {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    .contract-name {
      line-height: 20px;
      font-size: 14px;
    }
    .contract-date {
      margin-top: 2px;
      line-height: 18px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
    }
    .is-active {
      font-weight: 600;
      color: #1890ff;
      background-color: #e9f7fe;
      border-right: 2px solid #1890ff;
    }
  }
  .detail-item {
    display: flex;
    align-items: center;
    line-height: 22px;
    font-size: 14px;
    padding: 8px 24px;
    .detail-item-label {
      white-space: nowrap;
      color: rgba(0, 0, 0, 0.85);
    }
    .detail-item-content {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: rgba(0, 0, 0, 0.65);
    }
  }
  .detail-common {
    padding: 24px 24px;
    background: #ffffff;
    border: 1px solid #e6e7e9;
    .detail-common-title {
      margin: 8px 24px 0;
      line-height: 28px;
      font-size: 20px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
    }
  }
  .tab-container {
    margin-top: 16px;
    min-height: 900px;
    background: #ffffff;
    border: 1px solid #e6e7e9;
    .el-tabs--border-card {
      border: 0;
      box-shadow: unset;
    }
    .custom-tabs__content {
      // margin: 0 20px;
    }
    /deep/ .el-tabs__nav-scroll {
      // padding-left: 44px;
      font-size: 16px;
      font-weight: 500;
      color: #1890ff;
      .el-tabs__item {
        padding: 0 30px;
        .custom-tab-laber {
          height: 34px;
          line-height: 40px;
          max-width: 156px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          display: inline-block;
        }
      }
    }
    .el-main {
      overflow: hidden;
    }
  }
}
</style>