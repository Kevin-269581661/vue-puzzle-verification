<!-- 文字提示框-组件 -->
<template>
  <div class="text_alert">
    <i v-if="showIcon" class="el-icon-warning icon"></i>
    <div class="text_alert_content">
      <slot>{{ title }}</slot>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TextAlert',
  props: {
    title: {
      type: String,
      default: ''
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // visible: false,
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped="scoped">
.text_alert {
  padding: 8px 15px;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  background-color: #e6f7ff;
  box-sizing: border-box;
  position: relative;
  display: flex;
  // align-items: center;
  word-wrap: break-word;

  .text_alert_content {
    flex: 1;
    overflow: hidden;
    font-size: 14px;
    line-height: 22px;
    color: #000000;
  }

  .icon {
    color: #1890ff;
    margin-right: 10px;
    line-height: 22px;
  }
}
</style>
