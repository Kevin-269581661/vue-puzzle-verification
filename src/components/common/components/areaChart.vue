<!--
 * @Author: penglei
 * @Date: 2021-07-19 15:24:30
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-23 17:28:58
 * @FilePath: /frontend/src/components/common/components/areaChart.vue
-->
<template>
  <div :id="chartCfg.container"></div>
</template>
<script>
import { Chart } from "@antv/g2";
export default {
  name: "areaChart",
  props: {
    chartCfg: {
      type: Object,
      required: true,
    },
    scale: {
      type: Object,
      required: true,
    },
    legend: {
      type: Boolean,
      default: () => false,
    },
    axis: {
      type: Object,
      required: true,
    },
    tooltip: {
      type: Object,
      default: () => {},
    },
    line: {
      type: Object,
      default: () => {},
    },
    area: {
      type: Object,
      default: () => {},
    },
    chartData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  watch: {
    chartData(val) {
      if (Array.isArray(val)) {
        console.log("chartInstance.changeData");
        this.newChart(val);
      }
    },
  },
  mounted() {
    // this.newChart(this.chartData);
  },
  beforeDestroy() {
    // chartInstance && chartInstance.destroy();
  },
  methods: {
    newChart(chartData) {
      let chart = new Chart(this.chartCfg);
      chart.data(chartData);
      chart.scale(this.scale);
      chart.legend(this.legend);
      for (let key in this.axis) {
        if (Object.hasOwnProperty.call(this.axis, key)) {
          let axisContent = this.axis[key];
          if (false === axisContent.show) {
            chart.axis(key, false);
          } else {
            chart.axis(key, axisContent);
          }
        }
      }

      chart.tooltip(this.tooltip);
      chart.interaction("active-region");
      chart
        .area()
        .position(this.area.position)
        .style(this.area.style);
      chart
        .line()
        .position(this.line.position)
        .size(this.line.size || 2)
        .color(...this.line.color)
        .shape('smooth');
      chart.render();
    },
  },
};
</script>