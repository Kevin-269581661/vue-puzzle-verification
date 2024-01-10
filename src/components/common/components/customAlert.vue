<template>
  <!-- 消息提示组件 -->
  <div class="custom_alert" v-if="visible">
    <div class="content_left">
      <slot name="left">
        <img src="@/assets/images/icons/notice_icon.png" alt="" class="notice_icon">
        <div class="content">{{text}}</div>
      </slot>
    </div>
    <div class="content_right">
      <slot name="right">
        <div class="view_more_btn">查看更多</div>
        <i class="el-icon-close close_btn" @click="hide"></i>
      </slot>
    </div>
  </div>
</template>

<script>

export default {
  name: 'customAlert',
  props: {
    /**
     * 文字
     */
    text: {
      type: String,
      default: ''
    },
    /**
     * 默认是否显示
     */
    defaultVisible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    /**
     * 显示
     */
    show() {
      this.visible = true
    },
    /**
     * 隐藏
     */
    hide() {
      this.visible = false
    },
  },
  created() {
    this.visible = this.defaultVisible
  }
}
</script>

<style lang="scss" scoped="scoped">
.custom_alert {
  border-radius: 2px;
  border: 1px solid  #91D5FF;
  background:  #E6F7FF;
  padding: 9px 16px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .content_left {
    flex: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
    .notice_icon {
      width: 18px;
      height: 18px;
      margin-right: 10px;
    }
    .content {
      color: rgba(0, 0, 0, 0.85);
      font-family: Roboto;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
    }
  }
  .content_right {
    display: flex;
    align-items: center;
  }
  .view_more_btn {
    color: #1890FF;
    font-family: Roboto;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    margin-right: 16px;
    cursor: pointer;
  }
  .close_btn {
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
  }

}
</style>
