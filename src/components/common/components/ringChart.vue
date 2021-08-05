<template>
  <div :id="container"></div>
</template>

<script>
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
      Chart: null,
      DataView: null,
      chartInstance: null,
    };
  },
  computed: {
    renderFlag() {
      if(Array.isArray(this.sourceData) && this.sourceData.length && this.Chart && this.DataView) {
        return this.sourceData
      } else {
        return false
      }
    },
  },
  watch: {
    renderFlag(val) {
      if (val) {
        this.render(this.sourceData);
      }
    },
  },
  beforeCreate() {
    import(/* webpackChunkName: "g2Chart" */ "@antv/g2").then((_) => {
      this.Chart = _.Chart;
    });
    import(/* webpackChunkName: "g2DataSet" */ "@antv/data-set").then((_) => {
      this.DataView = _.DataView;
    });
  },
  methods: {
    render(data) {
      if (this.chartInstance == null) {
        this.chartInstance = new this.Chart({
          container: this.container,
          autoFit: true,
          height: 450,
          padding: [-30, 0, 0, 0],
        });
      }
      const dv = new this.DataView();
      dv.source(data).transform({
        type: "percent",
        field: "count",
        dimension: "item",
        as: "percent",
      });
      this.chartInstance.coordinate("theta", {
        radius: 0.8,
        innerRadius: 0.7,
      });
      this.chartInstance.data(dv.rows);
      this.chartInstance.scale("percent", {
        formatter: (val) => {
          val = (val * 100).toFixed(2) + "%";
          return val;
        },
      });

      // chart.tooltip(false);
      this.chartInstance.legend(false);
      this.chartInstance
        .interval()
        .adjust("stack")
        .position("percent")
        .color("item", ["#1890FF", "#6ECB53", "#FAAD14", "#FF7875"])
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
      let temp = (this.sourceData || []).reduce((total, num) => {
        return total + num.count * 1;
      }, 0);
      // if(temp == 0) return;
      this.chartInstance.annotation().clear(true);
      this.chartInstance.annotation().text({
        position: ["50%", "50%"],
        content: "媒体总数",
        style: {
          fontSize: 16,
          fill: "rgba(0, 0, 0, 0.85)",
          textAlign: "center",
        },
        offsetY: -50,
      });
      this.chartInstance.annotation().text({
        position: ["50%", "50%"],
        content: temp,
        style: {
          fontSize: 48,
          fill: "rgba(0, 0, 0, 0.85)",
          fontWeight: 500,
          textAlign: "center",
          fontFamily: "DINEngschrift",
        },
        offsetY: -10,
      });
      // this.chartInstance.annotation().image({
      //   src: '../../../../static/images/status.png',
      //   top: true,
      //   width: '40px',
      //   height: '50px',
      //   start: 50,
      //   end: 60,
      //   offsetY: 100,
      // });
      this.chartInstance.annotation().text({
        position: ["50%", "55%"],
        content: "●",
        style: {
          fontSize: 16,
          fill: "#1890FF",
          textAlign: "center",
        },
        offsetX: -115,
        offsetY: 0,
      });
      this.chartInstance.annotation().text({
        position: ["50%", "55%"],
        content: "正常",
        style: {
          fontSize: 14,
          fill: "rgba(0, 0, 0, 0.65)",
        },
        offsetX: -105,
      });
      this.chartInstance.annotation().text({
        position: ["50%", "55%"],
        content: "●",
        style: {
          fontSize: 16,
          fill: "#6ECB53",
        },
        offsetX: -65,
        offsetY: 0,
      });
      this.chartInstance.annotation().text({
        position: ["50%", "55%"],
        content: "待安装",
        style: {
          fontSize: 14,
          fill: "rgba(0, 0, 0, 0.65)",
        },
        offsetX: -50,
      });
      this.chartInstance.annotation().text({
        position: ["50%", "55%"],
        content: "●",
        style: {
          fontSize: 16,
          fill: "#FAAD14",
        },
        offsetX: 5,
        offsetY: 0,
      });
      this.chartInstance.annotation().text({
        position: ["50%", "55%"],
        content: "待维修",
        style: {
          fontSize: 14,
          fill: "rgba(0, 0, 0, 0.65)",
        },
        offsetX: 20,
      });
      this.chartInstance.annotation().text({
        position: ["50%", "55%"],
        content: "●",
        style: {
          fontSize: 16,
          fill: "#FF7875",
          textBaseline: "middle",
          lineHeight: 40,
        },
        offsetX: 75,
        offsetY: 0,
      });
      this.chartInstance.annotation().text({
        position: ["50%", "55%"],
        content: "禁用",
        style: {
          fontSize: 14,
          fill: "rgba(0, 0, 0, 0.65)",
          textBaseline: "middle",
          lineHeight: 40,
        },
        offsetX: 90,
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
@font-face {
  font-family: "DINEngschrift";
  src: url("../../../assets/font/DINEngschrift-Alternate.otf");
}
* {
  font-family: "Helvetica Neue", Helvetica, Arial, "PingFang ",
    "Hiragino Sans GB" "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei",
    sans-serif;
}
</style>
