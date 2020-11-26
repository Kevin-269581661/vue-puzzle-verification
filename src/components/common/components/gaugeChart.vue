<template>
  <div :id="container"></div>
</template>

<script>
import { Chart, registerShape } from "@antv/g2";

export default {
  name: "gaugeChart",
  components: {},
  props: {
    container: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {
    // 自定义Shape 部分
    registerShape("point", "pointer", {
      draw(cfg, container) {
        const group = container.addGroup();
        const center = this.parsePoint({ x: 0, y: 0 }); // 获取极坐标系下画布中心点
        // 绘制指针
        group.addShape("line", {
          attrs: {
            x1: center.x,
            y1: center.y,
            x2: cfg.x,
            y2: cfg.y,
            stroke: cfg.color,
            lineWidth: 3,
            lineCap: "round",
          },
        });
        group.addShape("circle", {
          attrs: {
            x: center.x,
            y: center.y,
            r: 9.75,
            stroke: cfg.color,
            lineWidth: 3,
            fill: "#fff",
          },
        });

        return group;
      },
    });

    const data = [{ value: 56 }];
    const chart = new Chart({
      container: this.container,
      autoFit: true,
      height: 500,
      padding: [0, 0, 30, 0],
    });
    chart.data(data);
    chart.scale("value", {
      min: 0,
      max: 100,
      tickInterval: 25,
    });
    chart.coordinate("polar", {
      startAngle: (-9 / 8) * Math.PI,
      endAngle: (1 / 8) * Math.PI,
      radius: 0.75,
    });

    chart.axis("1", false);
    chart.axis("value", {
      line: null,
      label: {
        offset: -36,
        formatter: (val) => {
          return val + "%";
        },
        style: {
          fontSize: 12,
          textAlign: "center",
          textBaseline: "middle",
          fill: "rgba(0, 0, 0, 0.45)",
        },
      },
      subTickLine: {
        count: 3,
        length: -24,
        style: {
            stroke: "rgba(0, 0, 0, 0.35)"
        }
      },
      tickLine: {
        length: -24,
        style: {
            stroke: "rgba(0, 0, 0, 0.35)"
        }
      },
      grid: null,
    });
    chart.legend(false);
    chart
      .point()
      .position("value*1")
      .shape("pointer")
      .color("rgba(87, 134, 245, 1)")
      .animate({
        appear: {
          animation: "fade-in",
        },
      });

    // 绘制仪表盘背景
    chart.annotation().arc({
      top: false,
      start: [0, 1],
      end: [100, 1],
      style: {
        // 底灰色
        stroke: "rgba(240, 240, 240, 1)",
        lineWidth: 40,
        lineDash: null,
      },
    });

    // 绘制指标
    chart.annotation().arc({
      start: [0, 1],
      end: [data[0].value, 1],
      style: {
        stroke: "l(0) 0:rgba(76, 141, 255, 1) 1:rgba(255, 98, 98, 1)",
        lineWidth: 40,
        lineDash: null,
      },
    });
    // 绘制指标数字
    chart.annotation().text({
      position: ["50%", "85%"],
      content: "¥2,328,674",
      style: {
        fontSize: 40,
        fill: "rgba(0, 0, 0, 0.85)",
        textAlign: "center",
        fontFamily: "DINEngschrift",
        lineHeight: 47,
      },
    });
    chart.annotation().text({
      position: ["50%", "90%"],
      content: "本年业绩",
      style: {
        fontSize: 16,
        fill: "rgba(0, 0, 0, 0.85)",
        textAlign: "center",
      },
      offsetY: 15,
    });

    chart.render();
  },
};
</script>

<style scoped lang="scss">
@font-face {
    font-family: 'DINEngschrift';
    src: url('../../../assets/font/DINEngschrift-Alternate.otf');
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
