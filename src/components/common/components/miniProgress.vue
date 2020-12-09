<template>
  <div class="chart-mini-progress">
    <div v-if="target > 0" class="target" :style="{ left: 'calc(' + target + '% + 3px', backgroundColor: color}">
      <!-- <span :style="{ backgroundColor: color }" />
      <span :style="{ backgroundColor: color }" /> -->
    </div>
    <div class="progress-wrapper" :style="{ height: height }">
      <div
        class="progress"
        :style="{ backgroundColor: color, width: percentage + '%', height: height }"
      ><div class="value" :style="{ 'line-height': height }">¥{{value}}</div></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "miniProgress",
  props: {
    target: {
      type: [Number, String],
      default: 0,
    },
    height: {
      type: String,
      default: "10px",
    },
    color: {
      type: String,
      default: "#13C2C2",
    },
    percentage: {
      type: [Number, String],
      default: 0,
    },
    value: {
      type: [Number, String],
      default: 0,
    }
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.chart-mini-progress {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 5px;
  background: rgba(0, 0, 0, 0.06);
  // cursor: pointer;
  .target {
    position: absolute;
    top: 2px;
    bottom: 2px;
    width: 1px;
    span {
      border-radius: 100px;
      position: absolute;
      top: 0;
      left: 0;
      height: 30px;
      width: 1px;
      &:last-child {
        top: auto;
        bottom: 0;
      }
    }
  }
  .progress-wrapper {
    position: relative;
    overflow: hidden;
    .progress {
      height: 20px;
      width: 0;
      transition: width 1.2s ease;
      border-radius: 1px 0 0 1px;
      background-color: rgba(24, 144, 255, 1);
      .value {
        margin-left: 8px;
        font-size: 12px;
        color: #fff;
        font-family: HelveticaNeue;
      }
    }
  }
}
</style>
