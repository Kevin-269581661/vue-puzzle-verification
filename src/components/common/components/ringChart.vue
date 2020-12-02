<template>
  <div :id="container"></div>
</template>

<script>
import { DataView } from "@antv/data-set";
import { Chart } from "@antv/g2";

export default {
  name: "ringChart",
  components: {},
  props: {
    container: {
      type: String,
      required: true,
    },
    sourceData: {
      type: Array,
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
        });
      }
      const dv = new DataView();
      dv.source(data).transform({
        type: "percent",
        field: "count",
        dimension: "item",
        as: "percent",
      });
      this.chartInstance.coordinate("theta", {
        radius: 0.75,
        innerRadius: 0.5,
      });
      this.chartInstance.data(dv.rows);
      this.chartInstance.scale("percent", {
        formatter: (val) => {
          val = val * 100 + "%";
          return val;
        },
      });

      // chart.tooltip(false);
      this.chartInstance.legend(false);
      this.chartInstance
        .interval()
        .adjust("stack")
        .position("percent")
        .color("item")
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
      this.chartInstance.annotation().text({
      //   content: () => `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
      //           <span>媒体总数</span>
      //           <span style="font-family: DINEngschrift;">2052</span>
      //           <div style="font-size: 14px;">
      //               <span>
      //                   <span style="width: 8px; height: 8px; border-radius: 4px; background: rgba(24, 144, 255, 1);"></span>
      //                   正常
      //               </span>
      //               <span>
      //                   <span style="width: 8px; height: 8px; border-radius: 4px; background: rgba(110, 203, 83, 1);"></span>
      //                   待安装
      //               </span>
      //               <span>
      //                   <span style="width: 8px; height: 8px; border-radius: 4px; background: rgba(250, 173, 20, 1);"></span>
      //                   待维修
      //               </span>
      //               <span>
      //                   <span style="width: 8px; height: 8px; border-radius: 4px; background: rgba(255, 120, 117, 1);"></span>
      //                   禁用
      //               </span>
      //           </div>
      // </div>`,
        offsetY: 15,
      });
      this.chartInstance.render();
    },
  },
};
</script>

<style scoped lang="scss">
.idsuaus {
  border-radius: unset;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
* {
  font-family: "Helvetica Neue", Helvetica, Arial, "PingFang ",
    "Hiragino Sans GB" "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei",
    sans-serif;
}
li {
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
</style>
