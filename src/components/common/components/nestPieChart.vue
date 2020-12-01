<template>
  <div id="nestPie"></div>
</template>

<script>
import { DataView } from "@antv/data-set";
import { Chart } from "@antv/g2";

export default {
  name: "nestPieChart",
  components: {},
  props: {
    sourceData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },
  watch: {
    sourceData(newVal, oldVal) {
      if (newVal.length > 0) {
        this.render(newVal);
      }
    },
  },
  mounted() {},
  methods: {
    render(data) {
      // 通过 DataSet 计算百分比
      const dv = new DataView();
      dv.source(data).transform({
        type: "percent",
        field: "value",
        dimension: "type",
        as: "percent",
      });
      const chart = new Chart({
        container: "nestPie",
        autoFit: true,
        height: 500,
        padding: [15, 0],
      });
      chart.data(dv.rows);
      chart.scale({
        percent: {
          formatter: (val) => {
            val = (val * 100).toFixed(2) + "%";
            return val;
          },
        },
      });
      chart.coordinate("theta", {
        radius: 0.59,
      });
      chart.tooltip({
        showTitle: false,
        showMarkers: false,
      });
      chart.legend(false);
      chart
        .interval()
        .adjust("stack")
        .position("percent")
        .color("type", ["rgb(24, 144, 255)", "rgb(250, 173, 20)"])
        .label("type", {
          offset: -65,
          autoRotate: false,
          textStyle: {
            textAlign: "center",
            fontSize: "12px",
            fill: "#FFFFFF",
            lineHeight: "17px",
            fontFamily: "PingFangSC-Regular, PingFang SC",
          },
        })
        .tooltip("type*percent", (item, percent) => {
          percent = (percent * 100).toFixed(2) + "%";
          return {
            name: item,
            value: percent,
          };
        })
        .style({
          fillOpacity: 1,
        })
        .state({
          active: {
            style: (element) => {
              const shape = element.shape;
              return {
                lineWidth: 10,
                stroke: shape.attr("fill"),
                strokeOpacity: shape.attr("fillOpacity"),
              };
            },
          },
        });

      const outterView = chart.createView();
      const dv1 = new DataView();
      dv1.source(data).transform({
        type: "percent",
        field: "value",
        dimension: "name",
        as: "percent",
      });

      outterView.data(dv1.rows);
      outterView.scale({
        percent: {
          formatter: (val) => {
            val = (val * 100).toFixed(2) + "%";
            return val;
          },
        },
      });
      outterView.coordinate("theta", {
        innerRadius: 0.66 / 1,
        radius: 1,
      });
      outterView
        .interval()
        .adjust("stack")
        .position("percent")
        .color("name", [
          "rgb(24, 144, 255)",
          "rgb(24, 144, 255)",
          "rgb(93, 112, 146)",
          "rgb(250, 173, 20)",
          "rgb(250, 173, 20)",
        ])
        .label("name", {
          offset: -35,
          autoRotate: false,
          textStyle: {
            textAlign: "center",
            fontSize: "12px",
            fill: "#FFFFFF",
            lineHeight: "17px",
            fontFamily: "PingFangSC-Regular, PingFang SC",
          },
        })
        .tooltip("name*percent", (item, percent) => {
          percent = (percent * 100).toFixed(2) + "%";
          return {
            name: item,
            value: percent,
          };
        })
        .style({
          fillOpacity: 1,
        })
        .state({
          active: {
            style: (element) => {
              const shape = element.shape;
              return {
                lineWidth: 10,
                stroke: shape.attr("fill"),
                strokeOpacity: shape.attr("fillOpacity"),
              };
            },
          },
        });

      chart.interaction("element-active");

      chart.render();
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
</style>
