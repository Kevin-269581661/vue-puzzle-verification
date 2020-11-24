<template>
  <div class="chart-trend">
    {{ term }}
    <span class="trend-value">{{percentage | formatPercentage}}</span>
    <span :class="['trend-icon', (percentage >= 0 ? 'up' : 'down')]">
      <i :class="[percentage >= 0 ? 'el-icon-caret-top' : 'el-icon-caret-bottom']"></i>
      <!-- <a-icon :type="'caret-' + (percentage >= 0 ? 'up' : 'down')" /> -->
    </span>
  </div>
</template>

<script>
export default {
  name: "Trend",
  props: {
    term: {
      type: String,
      default: "",
      required: true,
    },
    percentage: {
      type: Number,
      default: null,
    },
    type: {
      type: Boolean,
      default: null,
    },
    target: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    fixed: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      trend: (this.percentage >= 0 && "up") || "down",
    };
  },
  filters: {
    formatPercentage(percentage) {
      return percentage !== null ? (Math.abs(percentage) + '%') : "--";
    },
  },
  created() {
    // beforeCreate  ->inject -> Props ->  Methods ->  Data -> Computed -> Watch ->provide-> created
    /* const type = this.type === null ? this.value >= this.target : this.type
    this.trend = type ? 'up' : 'down'
    this.rate = (this.percentage === null ? Math.abs(this.value - this.target) * 100 / this.target : this.percentage).toFixed(this.fixed) */
  },
};
</script>

<style lang="scss" scoped>
.chart-trend {
  display: inline-block;
  font-size: 12px;
  line-height: 22px;
  color: rgba($color: #000000, $alpha: .65);
  .trend-value {
    margin-left: 8px;
    font-family: “Helvetica Neue”, Helvetica, Arial, “PingFang SC”, “Hiragino Sans GB” “Heiti SC”, “Microsoft YaHei”, “WenQuanYi Micro Hei”, sans-serif;
  }
  .trend-icon {
    font-size: 12px;

    &.up,
    &.down {
      margin-left: 4px;
      position: relative;
      /* top: 1px; */

      i {
        font-size: 12px;
        transform: scale(0.83);
      }
    }

    &.up {
      color: #f5222d;
    }
    &.down {
      color: #52c41a;
      top: -1px;
    }
  }
}
</style>
