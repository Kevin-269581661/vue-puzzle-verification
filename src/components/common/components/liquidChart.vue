<template>
  <div id="mountNode"></div>
</template>

<script>
import { Chart, registerShape } from "@antv/g2";
export default {
  name: "liquidChart",
  components: {},
  props: {
    container: {
      type: String,
      //   required: true,
    },
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {
    var data = [
      {
        gender: "male",
        path: "M0 0h30v20h-30v-20z",
        value: 50,
      },
      {
        gender: "male",
        path: "M30 0h30v20h-30v-20z",
        value: 50,
      },
    ];

    var chart = new G2.Chart({
      container: "mountNode",
      forceFit: true,
      padding: [0, 0 , 0, 0],
    });
    chart.legend(false);
    chart.axis(false);
    const viewOne = chart.view({
      start: {
        x: 0,
        y: 0,
      }, // 指定该视图绘制的起始位置，x y 为 [0 - 1] 范围的数据
      end: {
        x: 0.5,
        y: 1,
      }, // 指定该视图绘制的结束位置，x y 为 [0 - 1] 范围的数据
      padding: [0, 0], // 指定视图的留白
    });
    const viewTwo = chart.view({
      start: {
        x: 0.2,
        y: 0,
      }, // 指定该视图绘制的起始位置，x y 为 [0 - 1] 范围的数据
      end: {
        x: 1,
        y: 1,
      }, // 指定该视图绘制的结束位置，x y 为 [0 - 1] 范围的数据
      padding: [0, 0], // 指定视图的留白
    });

    viewOne.source(
      [
        {
          gender: "male",
          path: "M0 0h30v20h-30v-20z",
          value: 50,
        },
      ],
      {
        value: {
          min: 0,
          max: 100,
        },
      }
    );
    viewTwo.source(
      [
        {
          gender: "male2",
          path: "M0 0h30v20h-30v-20z",
          value: 70,
        },
      ],
      {
        value: {
          min: 0,
          max: 100,
        },
      }
    );
    viewOne
      .interval()
      .position("gender*value")
      .color("gender")
      .shape("path", function (path) {
        return ["liquid-fill-path", path];
      })
      // .shape('liquid-fill-gauge')
      .style({
        fillOpacity: 0,
        lineWidth: 1,
        stroke: "rgb(24, 144, 255)",
        opacity: 0.1,
      })
      viewOne.guide()
      .text({
        top: true,
        position: {
          gender: 'male',
          value: 50,
        },
        content: '50' + "%",
        style: {
          opacity: 0.75,
          fill: "#fff",
          fontSize: window.innerWidth / 20,
          textAlign: "center",
        },
      });

    viewTwo
      .interval()
      .position("gender*value")
      .color("gender")
      .shape("path", function (path) {
        return ["liquid-fill-path", path];
      })
      // .shape('liquid-fill-gauge')
      .style({
        fillOpacity: 0,
        lineWidth: 1,
        stroke: "rgb(24, 144, 255)",
        opacity: 0.1,
      })
      viewTwo.guide()
      .text({
        top: true,
        position: {
          gender: 'male2',
          value: 50,
        },
        content: '50' + "%",
        style: {
          opacity: 0.75,
          fill: "#fff",
          fontSize: window.innerWidth / 20,
          textAlign: "center",
        },
      });

    chart.render('svg');
  },
};
</script>

<style scoped lang="scss">
html,
body,
#container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
