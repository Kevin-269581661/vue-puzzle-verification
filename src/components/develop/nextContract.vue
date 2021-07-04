<!--
 * @Author: penglei
 * @Date: 2021-06-11 10:03:35
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-04 21:26:24
 * @FilePath: /frontend/src/components/develop/nextContract.vue
-->
<template>
  <div class="new-contract-page">
    <el-breadcrumb separator="/" class="contract-crumb">
      <el-breadcrumb-item>合同管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{ contractTypeArr[handleType].breadcrumb }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <el-row style="text-align: center; padding: 32px 0">
        <span v-for="item in 2" :key="item" class="step-item">
          <div
            v-if="item < activeStep"
            class="number-circle number-circle--default"
          >
            <i class="el-icon-check"></i>
          </div>
          <div
            v-else-if="item == activeStep"
            class="number-circle number-circle--active"
          >
            {{ item }}
          </div>
          <div
            v-else-if="item > activeStep"
            class="number-circle number-circle--default"
          >
            {{ item }}
          </div>
          <span
            :class="['step-text', { 'step-text-active': item == activeStep }]"
            >{{
              item === 1 ? "完善合同信息" : item === 2 ? contractTypeArr[handleType].stepText : ""
            }}</span
          >
          <span v-if="item < 2" class="step-line"></span>
        </span>
      </el-row>
      <keep-alive>
        <component
          ref="needValidForm"
          :handleType="handleType"
          :dcID="dcID"
          :originID="originID"
          :resFormData="resFormData"
          :contractFormData="contractFormData"
          :startDate="startDate"
          :is="componentName"
          @submitContract="newContract"
        ></component>
      </keep-alive>
    </div>
    <div class="footer">
      <div v-if="activeStep == 1" class="footer-btn-group">
        <el-button type="default" @click="cancelFirstStep">取消</el-button>
        <el-button type="primary" @click="secondStep">创建</el-button>
      </div>
      <div v-else-if="activeStep == 2" class="footer-btn-group">
        <el-button type="default" @click="routeContractList">合同列表</el-button>
        <el-button type="primary" @click="routeContractDetail"
          >查看详情</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../api/api.js";
import contractInput from "./components/contractInput.vue";
import contractFinished from "./components/contractFinished.vue";
export default {
  name: "newContract",
  components: {
    contractInput,
    contractFinished,
  },
  props: {},
  data() {
    return {
      contractTypeArr: {
        1: {breadcrumb: "续签合同", stepText: "合同续签成功"},
        2: {breadcrumb: "加门合同", stepText: "合同创建成功"},
        3: {breadcrumb: "补充协议", stepText: "补充协议创建成功"}
      },
      handleType: 0,
      sessionData: JSON.parse(sessionStorage.getItem("session_data")),
      resFormData: {},

      activeStep: 1,
      componentName: "contractInput",
      contractFormData: {},
      dcID: "",
      originID: "",
      editFlag: 0,
      startDate: ""
    };
  },
  watch: {},
  computed: {},
  created() {
    let queryParams = this.$route.query || {};
    // 1-续签 2-补充 3-加门
    this.handleType = queryParams.handleType;
    this.resFormData.resName = queryParams.resName;
    this.resFormData.pmcName = queryParams.pmcName;
    this.resID = queryParams.resID;
    this.dcID = queryParams.dcID+"";
    this.originID = queryParams.originID||"";
    this.editFlag = queryParams.edit;
    this.startDate = queryParams.date;
  },
  mounted() {},
  methods: {
    /* 跳转至合同列表 */
    routeContractList() {
      this.$router.push({
        path: "./contractList"
      });
    },
    /* 跳转至合同详情 */
    routeContractDetail() {
      this.$router.push({
        path: "./contractDetail",
        query: { resID: this.resFormData.resID },
      });
    },
    /* 第一步取消 */
    cancelFirstStep() {
      // this.$router.go(-1);
      this.$router.push("./contractList");
    },
    async secondStep() {
      // 表单验证
      let needValidFormResult = await this.$refs.needValidForm.submitForm();
      if (needValidFormResult) {
        this.contractFormData = this.$refs.needValidForm.contractForm;
        // 文件上传（完成后继续提交合同信息）
        this.$refs.needValidForm.submitUpload();
      }
    },
    newContract(fileIDs) {
      console.log("contractForm", this.contractFormData)
      let loading = this.$loading({
        text: "请耐心等待...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let params = {
        resID: this.resFormData.resID,
        resName: this.resFormData.resName,
        pmcName: this.resFormData.pmcName,
        ...this.contractFormData,
        fileIDs,
      };
      params.venueFee = params.venueFee * 100;
      params.venueDate = params.venueDate.replace("-", "");
      params.devFee = params.devFee * 100;
      params.devDate = params.devDate.replace("-", "");
      if(Array.isArray(params.demolishMediaIDs)) {
        params.demolishMediaIDs = params.demolishMediaIDs.join(",");
      }
      // 合同类型：0-首签 1-续约 2-加门 3-补充 此处无首签
      params.dcType = this.handleType*1;
      // 续约，加门或者补充时父单的id （首签时传0）
      params.pID = this.dcID;
      // 多个合同续签时传originIDs
      this.handleType == 1 && this.originID.split(",").length > 1 && (params.originIDs = this.originID);
      !this.editFlag && delete params.id;
      return new Promise((resolve) => {
        api
          .postApi_json("/addsp/devContract/create", params)
          .then((res) => {
            if (res.data.SysCode === 200200) {
              resolve(true);
              this.activeStep = 2;
              this.componentName = "contractFinished";
            } else {
              this.$message.warning(res.data.MSG || "创建失败！");
            }
          })
          .finally(() => {
            loading.close();
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.contract-crumb {
  margin: 12px 0;
}
.new-contract-page {
  margin: 0 60px;
  position: relative;
  .content {
    padding: 0 32px;
    margin-bottom: 55px;
    border: 1px solid #e6e7e9;
    background: #fff;
  }
  .step-line {
    display: inline-block;
    vertical-align: middle;
    width: 120px;
    height: 1px;
    margin: 0 16px;
    background: rgba(0, 0, 0, 0.15);
  }
  .step-item {
    display: inline-flex;
    align-items: center;
    .step-text {
      margin-left: 8px;
      line-height: 24px;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.45);
    }
    .step-text-active {
      color: rgba(0, 0, 0, 0.85);
    }
  }
  .number-circle {
    display: inline-block;
    width: 32px;
    height: 32px;
    box-sizing: border-box;
    border-radius: 16px;
    text-align: center;
    line-height: 32px;
    font-size: 16px;
    cursor: default;
    &.number-circle--active {
      background: #1890ff;
      color: #ffffff;
    }
    &.number-circle--default {
      border: 1px solid rgba(0, 0, 0, 0.25);
      color: rgba(0, 0, 0, 0.25);
    }
  }
  .footer-btn-group {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    padding: 7px 0;
    border-top: 1px solid #e6e7e9;
    background: #fff;
    z-index: 9;
    .el-button + .el-button {
      margin-left: 16px;
    }
  }
}
</style>
