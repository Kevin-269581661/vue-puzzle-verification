<template>
  <div :v-loading="loading" class="chart-card">
    <div class="chart-card-header">
      <div class="meta">
        <span class="chart-card-title">{{ cardData.title }}</span>
        <span class="chart-card-action">
          <el-tooltip content="Top center" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </span>
      </div>
      <div class="row">
        <div class="row-left">
          <countTo
            style="font-size: 30px; color: rgba(0, 0, 0, 0.85)"
            :startVal="oldTotal || 0"
            :endVal="cardData.value || 0"
            :duration="500"
            :prefix="cardData.prefix"
            :suffix="cardData.suffix"
            @callback="mountedCallback"
          ></countTo>
        </div>
        <div class="row-right">
            <trend
                style="margin-right: 16px;"
                :term="cardData.trendLabel"
                :percentage="cardData.compare"
              ></trend>
        </div>
      </div>
    </div>
    <div class="chart-card-content">
      <v-chart
        v-if="cardData.stack"
        :forceFit="true"
        :height="height"
        :data="stackData"
        :scale="scale"
        :padding="[0, 'auto', 'auto', 'auto']"
      >
        <v-axis dataKey="value" :show="false"></v-axis>
        <v-axis dataKey="year" :tickLine="{length: -5}" :label="{textStyle: {fill: 'rgba(0, 0, 0, 0.45)'}}"></v-axis>
        <v-tooltip :hideMarkers="false" />
        <v-stack-bar position="year*value" :color="stackColor" />
      </v-chart>

      <v-chart
        v-else
        :forceFit="true"
        :height="height"
        :data="data"
        :scale="scale"
        :padding="[0, 'auto', 'auto', 'auto']"
      >
        <!-- <v-axis position="bottom" /> -->
        <v-axis dataKey="value" :show="false"></v-axis>
        <v-axis dataKey="year" :tickLine="{length: -5}" :label="{textStyle: {fill: 'rgba(0, 0, 0, 0.45)'}}"></v-axis>
        <v-tooltip :shared="false" :hideMarkers="false" />
        <v-smooth-line
          position="year*value"
          :size="2"
          color="rgba(24,144,255,1)"
        />
        <v-smooth-area
          position="year*value"
          :color="['l(90) 0:rgba(24, 144, 255, .2) 1:rgba(24, 144, 255, 0)']"
        />
      </v-chart>
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
// import moment from "moment";
const tooltip = [
  "x*y",
  (x, y) => ({
    name: x,
    value: y,
  }),
];
const data = [
  { year: "第1周", value: 15468 },
  { year: "第2周", value: 16100 },
  { year: "第3周", value: 15900 },
  { year: "第4周", value: 17409 },
  { year: "第5周", value: 17000 },
  { year: "第6周", value: 31056 },
  { year: "第7周", value: 31982 },
  { year: "第8周", value: 32040 },
  { year: "第9周", value: 33233 },
];
const stackData = [
  {name: '新增道闸', year: "第1周", value: 15490 },
  {name: '新增道闸', year: "第2周", value: 16500 },
  {name: '新增道闸', year: "第3周", value: 13900 },
  {name: '新增道闸', year: "第4周", value: 17609 },
  {name: '新增道闸', year: "第5周", value: 17300 },
  {name: '新增道闸', year: "第6周", value: 30056 },
  {name: '新增道闸', year: "第7周", value: 31582 },
  {name: '新增道闸', year: "第8周", value: 33040 },
  {name: '新增道闸', year: "第9周", value: 33633 },
  {name: '新增广告门', year: "第1周", value: 15468 },
  {name: '新增广告门', year: "第2周", value: 16100 },
  {name: '新增广告门', year: "第3周", value: 15900 },
  {name: '新增广告门', year: "第4周", value: 17409 },
  {name: '新增广告门', year: "第5周", value: 17000 },
  {name: '新增广告门', year: "第6周", value: 31056 },
  {name: '新增广告门', year: "第7周", value: 31982 },
  {name: '新增广告门', year: "第8周", value: 32040 },
  {name: '新增广告门', year: "第9周", value: 33233 },
];
const scale = [
  {
    dataKey: "value",
    alias: '别名',
    min: 10000,
  },
  {
    dataKey: "year",
    type: 'cat',
    min: 0,
    max: 1,
    tickCount: 6,
    range: [ 0, 1 ]
  },
];

export default {
  name: "chartCard",
  components: { countTo, Trend },
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
    tipAlias: {
      type: String,
      default: "y",
    },
    showTip: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Array,
      default: () => [
        {
          x: 1,
          y: 2,
        },
        {
          x: 1,
          y: 2,
        },
        {
          x: 1,
          y: 2,
        },
        {
          x: 1,
          y: 2,
        },
        {
          x: 1,
          y: 2,
        },
      ],
    },
  },
  data() {
    return {
      data,
      stackData,
      scale,
      stackColor: ['name', ['rgba(24, 144, 255, 0.65)', 'rgba(24, 144, 255, 1)']],
      tooltip,
      height: 100,
      oldTotal: 0,
    };
  },
  mounted(){
  },
  methods: {
    mountedCallback() {
      this.oldTotal = this.cardData.value;
    },
  },
  mounted() {},
};
</script>

<style scoped lang="scss">
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
  box-sizing: border-box;
  background: #fff;
}
.chart-card-header {
  position: relative;
  overflow: hidden;
  // width: 100%;

  .meta {
    position: relative;
    overflow: hidden;
    // width: 100%;
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
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
      color: #000;
      margin-top: 4px;
      margin-bottom: 0;
      font-size: 30px !important;
      line-height: 38px;
      height: 38px;
    }
    .row-right {
      height: 26px;
      padding: 2px 8px;
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
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
}

.chart-card-content {
  position: relative;
  margin-bottom: 12px;
  // width: 100%;
}
</style>
