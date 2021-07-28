<template>
  <div>
    <div class="car_title_wrapper">
      <div class="car_title">
        <slot name="icon">
          <i class="el-icon-info"
             style="color: #1890FF;"/>
        </slot>
        <slot name="default">
          <span>这里用span标签有样式</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.car_title_wrapper {
  padding: 0 32px;
  margin: 9px 0 8px;
  .car_title {
    background: #e6f7ff;
    border: 1px solid #bae7ff;
    border-radius: 4px;
    padding: 5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    span {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
    }
  }
}
</style>