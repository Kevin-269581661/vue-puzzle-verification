<template>
  <div :id="container"></div>
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
    container: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      chartInstance: null
    };
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
      if(this.chartInstance == null) {
        this.chartInstance = new Chart({
          container: this.container,
          autoFit: true,
          height: 450,
          padding: [15, 0],
        });
      }
      // 通过 DataSet 计算百分比
      const dv = new DataView();
      dv.source(data).transform({
        type: "percent",
        field: "value",
        dimension: "type",
        as: "percent",
      });
      this.chartInstance.data(dv.rows);
      this.chartInstance.scale({
        percent: {
          formatter: (val) => {
            val = (val * 100).toFixed(2) + "%";
            return val;
          },
        },
      });
      this.chartInstance.coordinate("theta", {
        radius: 0.59,
      });
      this.chartInstance.tooltip({
        showTitle: false,
        showMarkers: false,
      });
      this.chartInstance.legend(false);
      this.chartInstance
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

      const outterView = this.chartInstance.createView();
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

      this.chartInstance.interaction("element-active");

      this.chartInstance.render();
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
