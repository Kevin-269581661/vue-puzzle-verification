<template>
  <div class="custom-card">
    <div class="custom-card-head">
      <slot name="head"></slot>
    </div>
    <div class="custom-card-content" :style="{ height: height }">
      <slot name="content"></slot>
    </div>
    <div class="custom-card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "indexCustomCard",
  components: {},
  props: {
    height: {
      type: String,
      default: "520px",
    },
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped lang="scss">
* {
  font-family: "Helvetica Neue", Helvetica, Arial, "PingFang ",
    "Hiragino Sans GB" "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei",
    sans-serif;
}
::-webkit-scrollbar {
  width: 4px;
  background: #fafafa;
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  background: #fafafa;
  border-radius: 4px;
}
%flex-row-center {
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
}
%flex-column-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column nowrap;
}
.custom-card {
  @extend %flex-column-center;
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid #e6e7e9;
  background: #fff;
  font-family: PingFangSC-Regular, PingFang SC;
  & > div {
    box-sizing: border-box;
  }
  .custom-card-head {
    @extend %flex-row-center;
    height: 54px;
    width: 100%;
    padding: 0 24px;
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    line-height: 54px;
  }
  .custom-card-content {
    width: 100%;
    border-top: 1px solid rgba(233, 233, 233, 1);
    overflow-y: auto;
  }
  .custom-card-footer {
  }
}
</style>
