<!--
 * @Author: penglei
 * @Date: 2021-06-11 10:03:35
 * @LastEditors: penglei
 * @LastEditTime: 2021-06-16 20:25:42
 * @FilePath: /frontend/src/components/develop/newConstract.vue
-->
<template>
  <div class="new-constract-page">
    <el-breadcrumb separator="/" class="constract-crumb">
      <el-breadcrumb-item>合同管理</el-breadcrumb-item>
      <el-breadcrumb-item>新建合同</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <el-row style="text-align: center; padding: 32px 0">
        <span v-for="item in 3" :key="item" class="step-item">
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
              item === 1
                ? "完善资源信息"
                : item === 2
                ? "完善合同信息"
                : "合同创建成功"
            }}</span
          >
          <span v-if="item < 3" class="step-line"></span>
        </span>
      </el-row>
      <keep-alive>
        <component ref="needValidForm" :recFormData="recFormData" :constractFormData="constractFormData" :is="componentName"></component>
      </keep-alive>
    </div>
    <div class="footer">
      <div v-if="activeStep == 1" class="footer-btn-group">
        <el-button type="default" @click="cancelFirstStep">取消</el-button>
        <el-button type="primary" @click="secondStep">下一步</el-button>
      </div>
      <div v-else-if="activeStep == 2" class="footer-btn-group">
        <el-button type="default" @click="cancelFirstStep">取消</el-button>
        <el-button type="default" @click="activeStep = 1">上一步</el-button>
        <el-button type="primary" @click="thirdStep">保存</el-button>
      </div>
      <div v-else-if="activeStep == 3" class="footer-btn-group">
        <el-button type="default" @click="cancelFirstStep">合同列表</el-button>
        <el-button type="primary" @click="secondStep">查看详情</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import resInput from "../common/components/resInput.vue";
import constractInput from "./components/constractInput.vue";
import constractFinished from "./components/constractFinished.vue";
export default {
  name: "newConstract",
  components: {
    resInput,
    constractInput,
    constractFinished,
  },
  props: {},
  data() {
    return {
      activeStep: 1,
      componentName: "resInput",
      recFormData: {},
      constractFormData: {}
    };
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {
    /* 第一步取消 */
    cancelFirstStep() {},
    /* 第一步进入第二部 */
    async secondStep() {
      let needValidFormResult = await this.$refs.needValidForm.submitForm();
      console.log("test1", needValidFormResult);
      if (needValidFormResult) {
        this.activeStep = 2;
        this.recFormData = this.$refs.needValidForm.recForm
        this.componentName = "constractInput";
      }
    },
    async thirdStep() {
      let needValidFormResult = await this.$refs.needValidForm.submitForm();
      console.log("test1", needValidFormResult);
      if (needValidFormResult) {
        this.activeStep = 3;
        this.constractFormData = this.$refs.needValidForm.constractForm;
        this.componentName = "constractFinished";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.constract-crumb {
  margin: 12px 0;
}
.new-constract-page {
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
