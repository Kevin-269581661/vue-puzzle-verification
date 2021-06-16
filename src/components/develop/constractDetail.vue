<!--
 * @Author: penglei
 * @Date: 2021-06-16 20:01:37
 * @LastEditors: penglei
 * @LastEditTime: 2021-06-16 21:45:59
 * @FilePath: /frontend/src/components/develop/constractDetail.vue
-->
<template>
  <div class="constract-detail-page">
    <el-breadcrumb separator="/" class="constract-crumb">
      <el-breadcrumb-item>合同管理</el-breadcrumb-item>
      <el-breadcrumb-item>合同详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="detail-common"></div>
    <div class="tab-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="首签 (2018年6月8日)" name="first">
          <el-row type="flex" justify="space-between">
            <el-col :span="6" class="title-row">
              <label class="title-label">合同类型：</label>
              <div class="title-content">
                首签首签首签首签首签首签首签首签首签首签首签
              </div>
            </el-col>
            <el-col :span="6" class="row-right">
              <el-button type="default" size="mini">删 除</el-button>
              <el-button type="primary" size="mini">编 辑</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="45">
            <el-col :span="18">
              <el-row>
                <el-col
                  :span="6"
                  v-for="item in 5"
                  :key="item"
                  class="detail-item"
                >
                  <label class="detail-item-label">合同类型：</label>
                  <div class="detail-item-content">
                    首签首签首签首签首签首签首签首签首签首签首签
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <div class="class">状态</div>
              <div class="class">正常</div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="续签 (2021年6月20日)" name="second"
          >配置管理</el-tab-pane
        >
      </el-tabs>
    </div>
  </div>
</template>

<script>
import resInput from "../common/components/resInput.vue";
import constractInput from "./components/constractInput.vue";
import constractFinished from "./components/constractFinished.vue";
export default {
  name: "constractDetail",
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
      constractFormData: {},
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
        this.recFormData = this.$refs.needValidForm.recForm;
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
.constract-detail-page {
  margin: 0 60px;
  position: relative;
  .title-row {
    display: flex;
    align-items: center;
    height: 32px;
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 32px;
    .row-right {
      text-align: right;
    }
  }
  .detail-item {
    display: flex;
    align-items: center;
    height: 22px;
    line-height: 22px;
    font-size: 14px;
    margin: 0 23px 16px 23px;
    .detail-item-label {
      width: 70px;
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
    height: 172px;
    background: #ffffff;
    border: 1px solid #e6e7e9;
  }
  .tab-container {
    margin-top: 16px;
    height: 974px;
    background: #ffffff;
    border: 1px solid #e6e7e9;
  }
}
</style>