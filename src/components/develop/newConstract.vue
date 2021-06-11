<!--
 * @Author: penglei
 * @Date: 2021-06-11 10:03:35
 * @LastEditors: penglei
 * @LastEditTime: 2021-06-11 18:31:31
 * @FilePath: /frontend/src/components/develop/newConstract.vue
-->
<template>
  <div class="new-constract-page">
    <el-breadcrumb separator="/" class="constract-crumb">
      <el-breadcrumb-item>合同管理</el-breadcrumb-item>
      <el-breadcrumb-item>新建合同</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <el-row style="text-align: center; padding: 32px 0;">
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
          <span v-if="item < 3" class="step-line"></span>
        </span>
      </el-row>
      <keep-alive>
        <component :is="componentName"></component>
      </keep-alive>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script>
import resInput from "../common/components/resInput.vue"
export default {
  name: "newConstract",
  components: {
    resInput
  },
  props: {},
  data() {
    return {
      activeStep: 1,
      componentName: "resInput"
    };
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {},
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
    border: 1px solid #E6E7E9;
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
}
</style>
