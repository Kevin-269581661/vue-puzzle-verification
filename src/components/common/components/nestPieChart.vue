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
      chartInstance: null,
    };
  },
  watch: {
    sourceData(newVal, oldVal) {
      if (newVal.length > 0) {
        // console.log("renData", newVal);
        this.render(newVal);
      }
    },
  },
  mounted() {},
  methods: {
    render(data) {
      if (this.chartInstance == null) {
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
      // console.log("dv.rows", dv.rows);
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
          layout: {
            type: "fixed-overlap",
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
          lineWidth: 2,
          stroke: '#fff',
        })
        .state({
          selected: {
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
      this.chartInstance.on("interval:click", (ev) => {
        const tempElement = ev.target.get("element");
        const data = tempElement.getModel().data; // 单条数据
        this.$emit('activeData', data, ev)
        // console.log("elementData", ev, data);
      });

      const outterView = this.chartInstance.createView();
      const dv1 = new DataView();
      // console.log("dv1data", data);
      dv1.source(data).transform({
        type: "percent",
        field: "value",
        dimension: "name",
        as: "percent",
      });
      dv1.rows.forEach(item => {
        item.view = 'out'
      });
      // console.log("dv1.rows", dv1.rows);
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
        .color("name", ["#52acff", "#52acff", "#bec6d3", "#fbc24f", "#fbc24f"])
        .label("name", (name) => {
          return {content: name.split('-')[0]}
        }, {
          offset: -35,
          autoRotate: false,
          textStyle: {
            textAlign: "center",
            fontSize: "12px",
            fill: "#FFFFFF",
            lineHeight: "17px",
            fontFamily: "PingFangSC-Regular, PingFang SC",
          },
          layout: {
            type: "fixed-overlap",
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
          lineWidth: 2,
          stroke: '#fff',
        })
        .state({
          selected: {
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
      this.chartInstance.interaction('element-single-selected', {
        start: [{ trigger: 'element:click', action: 'element-single-selected:toggle' }],
        end: [{ trigger: 'element:mouseleave', action: 'element-single-selected:reset' }],
      });
      // this.chartInstance.interaction("element-selected");

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
