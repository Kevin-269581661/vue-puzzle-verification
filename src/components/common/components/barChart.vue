<!--
 * @Author: penglei
 * @Date: 2021-07-19 15:24:30
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-23 17:36:02
 * @FilePath: /frontend/src/components/common/components/barChart.vue
-->
<template>
  <div :id="chartCfg.container"></div>
</template>
<script>
import { Chart } from "@antv/g2";
export default {
  name: "barChart",
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
    barType: {
      type: String,
      default: () => "bar",
    },
    axis: {
      type: Object,
      required: true,
    },
    tooltip: {
      type: Object,
      default: () => {},
    },
    color: {
      type: [Array, String],
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
        // chartInstance.changeData(val);
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
      let tempGeometry = chart
        .interval()
        .position("week*value")
        .color(...this.color);
      if (this.barType == "stackBar") {
        tempGeometry.adjust("stack");
      }
      chart.render();
    },
  },
};
</script>