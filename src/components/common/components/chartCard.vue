<template>
  <div :v-loading="loading" class="chart-card">
    <div class="chart-card-header">
      <div class="meta">
        <span class="chart-card-title">{{ cardData.title }}</span>
        <span class="chart-card-action">
          <el-tooltip :content="cardData.tip || ''" placement="top">
            <img
              class="quesition-icon"
              src="../../../assets/images/question_icon.png"
            />
          </el-tooltip>
        </span>
      </div>
      <div class="row">
        <div class="row-left">
          <countTo
            style="
              font-size: 28px;
              color: rgba(0, 0, 0, 0.85);
              fontfamily: DIN-Medium;
            "
            :startVal="oldTotal || 0"
            :endVal="cardData.value || 0"
            :duration="500"
            :prefix="cardData.prefix"
            :suffix="cardData.suffix"
            :decimals="cardData.decimals || 0"
            @callback="mountedCallback"
          ></countTo>
        </div>
        <div class="row-right">
          <trend
            :term="cardData.trendLabel"
            :percentage="cardData.compare"
          ></trend>
        </div>
      </div>
    </div>
    <div class="chart-card-content">
      <bar-chart
        v-if="cardData.type"
        :chartCfg="{
          container: cardData.name,
          renderer: 'svg',
          autoFit: true,
          height: height,
          padding: [16, 16, 32, 16],
        }"
        :barType="cardData.type"
        :scale="scale"
        :legend="false"
        :axis="{
          value: {
            show: false,
          },
          week: {
            line: { stroke: '#E8E8E8' },
            tickLine: null,
            label: {
              autoRotate: false,
              autoHide: false,
              autoEllipsis: true,
              formatter: cardData.type == 'stackBar' ? formatter2 : formatter1,
              style: {
                fill: 'rgb(0, 0, 0)',
                opacity: 0.45,
              },
            },
          },
        }"
        :tooltip="{
          showMarkers: false,
          shared: true,
          enterable: true,
          domStyles: {
            'g2-tooltip': {
              background: 'rgba(255, 255, 255, .85)',
            },
          },
        }"
        :color="cardData.type == 'stackBar' ? stackColor : barColor"
        :chartData="cardData.data"
      ></bar-chart>
      <area-chart
        v-else
        :chartCfg="{
          container: cardData.name,
          renderer: 'svg',
          autoFit: true,
          height: height,
          padding: [16, 16, 32, 16],
        }"
        :scale="scale"
        :legend="false"
        :axis="{
          value: {
            show: false,
          },
          week: {
            line: { stroke: '#E8E8E8' },
            tickLine: null,
            label: {
              autoRotate: false,
              autoHide: false,
              autoEllipsis: true,
              formatter: cardData.formatter || formatter1,
              style: {
                fill: 'rgb(0, 0, 0)',
                opacity: 0.45,
              },
            },
          },
        }"
        :tooltip="{
          showMarkers: true,
          shared: false,
          enterable: true,
          domStyles: {
            'g2-tooltip': {
              background: 'rgba(255, 255, 255, .85)',
            },
          },
        }"
        :line="{
          position: 'week*value',
          size: 2,
          color: ['#1890ff'],
        }"
        :area="{
          position: 'week*value',
          style: {
            fill: 'l(90) 0:#1890FFFF 1:#fff',
            fillOpacity: 0.2,
          },
        }"
        :chartData="cardData.data"
      ></area-chart>
    </div>
    <div class="chart-card-footer">
      <div class="field">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from "vue-count-to";
import Trend from "./Trend.vue";
import BarChart from "./barChart.vue";
import AreaChart from "./areaChart.vue";
export default {
  name: "chartCard",
  components: { countTo, Trend, BarChart, AreaChart },
  props: {
    cardData: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "area",
    },
    color: {
      type: String,
      default: "#1890FF",
    },
    showTip: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      scale: {
        value: {
          min: 0,
          alias: this.cardData.valueAlias || "",
        },
        week: {
          type: "cat",
          range: [0, 1],
        },
      },
      stackColor: ["name", ["#69B7FF", "#1890FF"]],
      barColor: ["#1890FF"],
      height: 107,
      oldTotal: 0,
    };
  },
  methods: {
    mountedCallback() {
      this.oldTotal = this.cardData.value;
    },
    formatter1(text, item, index) {
      if (index % 2 === 1 && index > 0 && index < 12) {
        return this.cardData.data[index].dateStr;
      } else {
        return "";
      }
    },
    formatter2(text, item, index) {
      if (index % 2 === 1 && index > 0 && index < 12) {
        return `第${index + 1}周`;
      } else {
        return "";
      }
    },
  },
};
</script>

<style scoped lang="scss">
@font-face {
  font-family: DIN-Medium;
  src: url("../../../assets/font/DIN-Medium.otf");
}
* {
  font-family: "Helvetica Neue", Helvetica, Arial, "PingFang ",
    "Hiragino Sans GB" "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei",
    sans-serif;
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
.number {
  font-family: “Helvetica Neue”, Helvetica, Arial, “PingFang SC”,
    “Hiragino Sans GB” “Heiti SC”, “Microsoft YaHei”, “WenQuanYi Micro Hei”,
    sans-serif;
}
.chart-card {
  position: relative;
  height: 202px;
  padding: 20px 24px 15px;
  border: 1px solid #e6e7e9;
  box-sizing: border-box;
  background: #fff;
}
.chart-card-header {
  position: relative;
  overflow: hidden;

  .meta {
    position: relative;
    overflow: hidden;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
    .chart-card-title {
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
    }
  }
  .row {
    @extend %flex-row-center;
    .row-left {
      flex-shrink: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
      color: #000;
      margin-top: 4px;
      margin-bottom: 0;
      font-size: 30px !important;
      line-height: 32px;
      height: 38px;
    }
    .row-right {
      height: 26px;
      padding: 2px 10px;
      margin-left: auto;
      text-align: center;
      font-size: 12px;
      line-height: 26px;
      color: rgba(0, 0, 0, 0.65);
      border-radius: 2px;
      background: rgba(248, 248, 248, 1);
      font-family: HelveticaNeue;
    }
  }
}

.chart-card-action {
  position: absolute;
  top: 0;
  right: 0;
}

.chart-card-content {
  position: relative;
  margin-bottom: 12px;
}
.quesition-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  vertical-align: middle;
  filter: brightness(0.75);
}
</style>
