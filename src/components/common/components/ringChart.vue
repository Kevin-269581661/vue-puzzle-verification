<template>
  <div :id="container"></div>
</template>

<script>
import { Chart } from "@antv/g2";

const data = [
  { item: "事例一", count: 40, percent: 0.4 },
  { item: "事例二", count: 21, percent: 0.21 },
  { item: "事例三", count: 17, percent: 0.17 },
  { item: "事例四", count: 13, percent: 0.13 },
  { item: "事例五", count: 9, percent: 0.09 },
];

export default {
  name: "ringChart",
  components: {},
  props: {
    container: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      data,
    };
  },
  methods: {},
  mounted() {
    const chart = new Chart({
      container: this.container,
      autoFit: true,
      height: 500,
    });

    chart.coordinate("theta", {
      radius: 0.75,
      innerRadius: 0.5,
    });

    chart.data(data);

    chart.scale("percent", {
      formatter: (val) => {
        val = val * 100 + "%";
        return val;
      },
    });

    // chart.tooltip(false);
    chart.legend(false);
    chart
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
    chart.interaction("element-active");
    chart.annotation().text({
      content: ()=> `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <span>媒体总数</span>
                <span style="font-family: DINEngschrift;">2052</span>
                <div style="font-size: 14px;">
                    <span>
                        <span style="width: 8px; height: 8px; border-radius: 4px; background: rgba(24, 144, 255, 1);"></span>
                        正常
                    </span>
                    <span>
                        <span style="width: 8px; height: 8px; border-radius: 4px; background: rgba(110, 203, 83, 1);"></span>
                        待安装
                    </span>
                    <span>
                        <span style="width: 8px; height: 8px; border-radius: 4px; background: rgba(250, 173, 20, 1);"></span>
                        待维修
                    </span>
                    <span>
                        <span style="width: 8px; height: 8px; border-radius: 4px; background: rgba(255, 120, 117, 1);"></span>
                        禁用
                    </span>
                </div>
      </div>`,
      offsetY: 15,
    });
    chart.render('svg');
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
