<template>
  <div>
    <v-chart renderer='canvas' padding="auto" :forceFit="true" :height="height" :data="data" :scale="scale">
      <v-tooltip :showTitle="false" :itemTpl="itemTpl" />
      <v-coord type="theta" :radius="0.62" />
      <v-pie
        position="percent"
        :color="colorInner"
        :label="labelInner"
        :vStyle="style"
        :tooltip="tooltip"
        :onMouseMove="clickSeries"
        :onMouseLeave="mouseLeaveSeries"
      />
      <v-view :data="viewData" :scale="scale">
        <v-coord type="theta" :radius="1" :innerRadius="0.66 / 1" />
        <v-pie
          position="percent"
          :color="color"
          :label="label"
          :vStyle="style"
          :tooltip="tooltip"
          :onMouseMove="clickSeries"
          :onMouseLeave="mouseLeaveSeries"
        />
      </v-view>
    </v-chart>
  </div>
</template>

<script>
const DataSet = require("@antv/data-set");

const sourceData = [
  { value: 251, type: "大事例一", name: "子事例一" },
  { value: 1048, type: "大事例一", name: "子事例二" },
  { value: 610, type: "大事例二", name: "子事例三" },
  { value: 335, type: "大事例二", name: "子事例四" },
  { value: 250, type: "大事例二", name: "子事例五" },
];

const dv = new DataSet.View().source(sourceData);
dv.transform({
  type: "percent",
  field: "value",
  dimension: "type",
  as: "percent",
});
const data = dv.rows;
// console.log(data);

const viewDv = new DataSet.View().source(sourceData);
viewDv.transform({
  type: "percent",
  field: "value",
  dimension: "name",
  as: "percent",
});
const viewData = viewDv.rows;
console.log(viewData);
const scale = {
  dataType: "percent",
  formatter: ".2%",
};

const itemTpl =
  '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>';

const style = {
  lineWidth: 1,
  stroke: "#fff",
};

const label = ["name", { offset: -35, autoRotate: false, textStyle: { textAlign: 'center', fontSize: '12px', fill: '#FFFFFF', lineHeight: '17px', fontFamily: 'PingFangSC-Regular, PingFang SC' } }];
const labelInner = ["type", { offset: -65, autoRotate: false, textStyle: { textAlign: 'center', fontSize: '12px', fill: '#FFFFFF', lineHeight: '17px', fontFamily: 'PingFangSC-Regular, PingFang SC' } }];

const tooltip = [
  "name*percent",
  (item, percent) => {
    percent = (percent * 100).toFixed(2) + "%";
    return {
      name: item,
      value: percent,
    };
  },
];

const color = [
  "name",
  ["rgba(24, 144, 255, 0.75)", "rgba(24, 144, 255, 0.75)", "rgba(93, 112, 146, 0.4)", "rgba(250, 173, 20, 0.75)", "rgba(250, 173, 20, 0.75)"],
];
const colorInner = [
    "type",
    ["rgba(24, 144, 255, 1)", "rgba(250, 173, 20, 1)"],
]

export default {
  name: "nestPieChart",
  components: {},
  props: {},
  data() {
    return {
      data,
      scale,
      viewData,
      height: 406,
      itemTpl,
      tooltip,
      color,
      colorInner,
      label,
      labelInner,
      style
    };
  },
  methods: {
      clickSeries(ev, chart) {
          console.log(ev)
        ev.shape._attrs.lineWidth = 10
        ev.shape._attrs.stroke = ev.shape._attrs.fill
        // ev.shape._attrs.strokeOpacity = ev.shape._attrs.fillOpacity
      },
      mouseLeaveSeries(ev, chart) {
        ev.shape._attrs.lineWidth = 1
        ev.shape._attrs.stroke = '#fff'
        ev.shape._attrs.strokeOpacity = 1
      }
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
