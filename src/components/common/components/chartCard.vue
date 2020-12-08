<template>
  <div :v-loading="loading" class="chart-card">
    <div class="chart-card-header">
      <div class="meta">
        <span class="chart-card-title">{{ cardData.title }}</span>
        <span class="chart-card-action">
          <el-tooltip :content="cardData.tip || ''" placement="top">
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
            :decimals='cardData.decimals || 0'
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
      <v-chart
        v-if="cardData.type"
        :forceFit="true"
        :height="height"
        :data="cardData.data"
        :scale="scale"
        :padding="[0, 'auto', 'auto', 'auto']"
      >
        <v-axis dataKey="value" :show="false"></v-axis>
        <v-axis dataKey="week" :tickLine="{length: -3}" :label="{formatter: formatter, textStyle: {fill: 'rgb(0, 0, 0)', opacity: 0.45}}"></v-axis>
        <v-tooltip :hideMarkers="false"/>
        
        <v-bar v-if="cardData.type == 'bar'" position="week*value" :color="stackColor[1][0]" />
        <v-stack-bar v-if="cardData.type == 'stackBar'" position="week*value" :color="stackColor" />
      </v-chart>

      <v-chart
        v-else
        :forceFit="true"
        :height="height"
        :data="cardData.data"
        :scale="scale"
        :padding="[0, 'auto', 'auto', 'auto']"
      >
        <v-axis dataKey="value" :show="false"></v-axis>
        <v-axis dataKey="week" :tickLine="{length: -5}" :label="{formatter: cardData.formatter || formatter, textStyle: {fill: 'rgb(0, 0, 0)', opacity: 0.45}}"></v-axis>
        <v-tooltip :shared="false" :hideMarkers="false" />
        <v-smooth-line
          position="week*value"
          :size="2"
          color="#1890ff"
        />
        <v-smooth-area
          position="week*value"
          :color="['l(90) 0:#1890ff 1:#fff']"
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
  },
  data() {
    return {
      scale: [
        {
          dataKey: "value",
          min: 0,
          alias: this.cardData.valueAlias || '',
        },
        {
          dataKey: "week",
          type: 'cat',
          min: 0,
          max: 1,
          tickCount: 7,
          range: [ 0, 1 ]
        }
      ],
      stackColor: ['name', ['rgba(24, 144, 255, 0.65)', 'rgba(24, 144, 255, 1)']],
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
    formatter(text, item, index) {
        return this.cardData.data[index].dateStr
    }
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
