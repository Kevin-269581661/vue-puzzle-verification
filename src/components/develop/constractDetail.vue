<!--
 * @Author: penglei
 * @Date: 2021-06-16 20:01:37
 * @LastEditors: penglei
 * @LastEditTime: 2021-06-17 17:40:35
 * @FilePath: /frontend/src/components/develop/constractDetail.vue
-->
<template>
  <div class="constract-detail-page">
    <el-breadcrumb separator="/" class="constract-crumb">
      <el-breadcrumb-item>合同管理</el-breadcrumb-item>
      <el-breadcrumb-item>合同详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="detail-common">
      <el-row>
        <el-col :span="24">
          <span class="detail-common-title">金地荔湖城湾岸坊</span>
        </el-col>
        <el-col :span="6" v-for="item in 5" :key="item" class="detail-item">
          <label class="detail-item-label">合同类型：</label>
          <div class="detail-item-content">首签首签首签首签首签首签首</div>
        </el-col>
      </el-row>
    </div>
    <div class="tab-container">
      <el-tabs v-model="activeTabName">
        <el-tab-pane
          label="首签 (2018年6月8日)"
          name="first"
          class="custom-tabs__content"
        >
          <el-row type="flex" justify="space-between" class="title-row">
            <el-col :span="6" class="row-left">
              <label class="title-label">合同类型：</label>
              <div class="title-content">暂无</div>
            </el-col>
            <el-col :span="6" class="row-right">
              <el-button type="default" size="mini">删 除</el-button>
              <el-button type="primary" size="mini">编 辑</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-row>
                <el-col
                  :span="8"
                  v-for="item in 5"
                  :key="item"
                  class="detail-item"
                >
                  <label class="detail-item-label">合同类型：</label>
                  <div class="detail-item-content">
                    首签首签首签首签首签首签首
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6" class="constract-status">
              <div class="constract-status__text">状态</div>
              <div class="constract-status-name">
                <span class="constract-status__dot"></span>
                正常
              </div>
            </el-col>
          </el-row>
          <!-- 基本信息 -->
          <div class="emphasize-text">基本信息</div>
          <el-row :gutter="46" class="content-row">
            <el-col :span="6" v-for="item in 5" :key="item" class="detail-item">
              <label class="detail-item-label">合同类型：</label>
              <div class="detail-item-content">首签首签首签首签首签首签首</div>
            </el-col>
          </el-row>
          <!-- 安装信息 -->
          <div class="emphasize-text">安装信息</div>
          <el-row :gutter="46" class="content-row">
            <el-col :span="6" v-for="item in 5" :key="item" class="detail-item">
              <label class="detail-item-label">合同类型：</label>
              <div class="detail-item-content">首签首签首签首签首签首签首</div>
            </el-col>
          </el-row>
          <!-- 费用信息 -->
          <div class="emphasize-text">费用信息</div>
          <el-row :gutter="46" class="content-row">
            <el-col :span="6" v-for="item in 5" :key="item" class="detail-item">
              <label class="detail-item-label">合同类型：</label>
              <div class="detail-item-content">首签首签首签首签首签首签首</div>
            </el-col>
          </el-row>
          <!-- 其它信息 -->
          <div class="emphasize-text">其它信息</div>
          <el-row :gutter="46" class="content-row">
            <el-col :span="6" v-for="item in 5" :key="item" class="detail-item">
              <label class="detail-item-label">合同类型：</label>
              <div class="detail-item-content">首签首签首签首签首签首签首</div>
            </el-col>
          </el-row>
          <!-- 附件 -->
          <div class="emphasize-text">附件</div>
          <el-row :gutter="46" class="content-row">
            <el-col :span="6" v-for="item in 5" :key="item" class="detail-item">
              <label class="detail-item-label">合同类型：</label>
              <div class="detail-item-content">首签首签首签首签首签首签首</div>
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
      activeTabName: "first",
      // 合同状态和颜色映射
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
    margin: 8px 24px;
    .title-label,
    .title-content {
      white-space: nowrap;
    }
    .row-left {
      display: flex;
      align-items: center;
      height: 32px;
      font-size: 20px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 32px;
    }
    .row-right {
      text-align: right;
    }
  }
  .content-row {
    padding: 0 23px;
  }
  .emphasize-text {
    padding: 10px 16px;
    margin: 24px 12px 8px;
    line-height: 22px;
    font-size: 16px;
    font-weight: 600;
    background: #f5f6fa;
    color: #333333;
  }
  .detail-item {
    display: flex;
    align-items: center;
    line-height: 22px;
    font-size: 14px;
    padding: 8px 24px;
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
  .constract-status {
    margin-top: 8px;
    text-align: right;
    .constract-status__text {
      height: 22px;
      margin-right: 25px;
      line-height: 22px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
    }
    .constract-status-name {
      height: 28px;
      margin-right: 25px;
      line-height: 28px;
      font-size: 20px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
    }
    .constract-status__dot {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 6px;
      background: linear-gradient(180deg, #faad14 0%, #ffaa00 100%);
    }
  }
  .tab-container {
    margin-top: 16px;
    height: 974px;
    background: #ffffff;
    border: 1px solid #e6e7e9;
    .custom-tabs__content {
      margin: 0 20px;
    }
    /deep/ .el-tabs__nav-scroll {
      padding-left: 44px;
      line-height: 52px;
      font-size: 16px;
      font-weight: 500;
      color: #1890ff;
    }
  }
}
</style>