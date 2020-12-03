<template>
  <div class="index-map-row">
    <div :class="['map-wrap', mapContainer]">
      <div :id="mapContainer" class="map-container"></div>
      <div class="fad-map-info" v-if="infoBoxShow">
        <i class="el-icon-info" />
        <span class="info-text">点位分布: 这段时间内可投点位的位置分布</span>
        <i v-if="instanceMap" @click="closeInfoBox" class="el-icon-close info-close" />
      </div>
      <div v-if="instanceMap" class="fad-map-control">
        <i class="el-icon-rank map-full-screen" @click="fullMap(1)" />
        <!-- <a-slider
          vertical
          :marks="distanceMarks"
          :step="25"
          v-model="sliderValue1"
          @change="sliderChange"
        /> -->
        <div>
          <div class="zoom-btn">
            <i class="el-icon-zoom-in" @click="setMapZoom('plus')" />
          </div>
          <div class="zoom-btn">
            <i class="el-icon-zoom-out" @click="setMapZoom('minus')" />
          </div>
        </div>
      </div>
    </div>
    <el-table :data="tableData" max-height="540" style="flex: unset; width: auto;">
      <el-table-column label="排名" type=index width="60">
      </el-table-column>
      <el-table-column prop="rName" label="城市" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="totalResCnt" label="社区" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="totalMediaCnt" label="媒体" width="120" show-overflow-tooltip>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import $ from "jquery";
import { initMap, snowStyle, whiteStyle } from "@/commonFun/mapCommon.js";
import api from "../../../api/api";
import sessFun from "../../../commonFun/sessFun.js";
export default {
  name: "pointDistribution",
  components: {},
  props: {
    mapContainer: {
      type: String,
      required: true,
    },
    hasMpvgl: {
      type: Boolean,
      default: false,
    },
    actived: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    hasMpvgl(val) {
      if (val === true) {
        setTimeout(() => {
          this.setMap();
        }, 1000);
      }
    },
    actived(val) {
      if (this.hasMpvgl && val === true) {
        setTimeout(() => {
          this.setMap();
        }, 1000);
      }
    },
  },
  data() {
    return {
      instanceMap: null,
      fullFlag: null,
      sessionData: null,
      infoBoxShow: true,
      tableData: []
    };
  },
  mounted() {
    this.sessionData = sessFun.getSess();
    this.getPointDistributionReport();
  },
  methods: {
    // 首页的地图点位投放 /report /homepage/getPointDistributionReport
    getPointDistributionReport() {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
      };
      api
        .getApi(
          this.apiVar.report + "/homepage/getPointDistributionReport",
          params
        )
        .then((res) => {
          if (res.data.SysCode === 200200) {
            this.tableData = res.data.data;
            // this.setMap();
          } else {
            this.messageFun("warning", res.data.MSG);
          }
        })
        .catch((err) => {
          console.log("err", err);
        })
        .finally((_) => {});
    },
    setMap() {
      let mapData = []
      if(this.tableData.length>0) {
        this.tableData.forEach(item=>{
          if(Array.isArray(item.latLngList)) {
            item.latLngList.forEach(point=>{
              mapData.push({
                geometry: {
                  type: "Point",
                  coordinates: [
                    parseFloat(point.split(';')[0]),
                    parseFloat(point.split(';')[1]),
                  ],
                },
                properties: {
                  time: Math.random() * 100,
                  // count: Math.random() * 100,
                  count: item.totalMediaCnt || 0,
                },
              });
            })
          }
        })
      }
      if (this.instanceMap == null) {
        this.instanceMap = initMap({
          id: this.mapContainer,
          tilt: 48.8,
          heading: 0,
          center: [105.348145, 28.165926],
          zoom: 6,
          style: whiteStyle,
        });
        this.instanceMap.addEventListener("zoomend", (e) => {
          let level = e.target.getZoom();
          // this.sliderValue1 = this.getSliderValue(level);
        });
      }
      if(mapData.length == 0) return
      var view = new mapvgl.View({
        map: this.instanceMap,
      });

      let layer1 = new mapvgl.PointLayer({
        blend: "lighter",
        shape: "circle",
        color: "rgba(17, 95, 255, 0.8)", // 点图层1颜色
        // data: mapData,
        size: 3,
      });
      view.addLayer(layer1);

      let layer2 = new mapvgl.PointLayer({
        blend: "lighter",
        shape: "circle",
        color: "rgba(24, 144, 255, 0.6)", // 点图层2颜色
        // data: mapData,
        size: 5,
      });
      view.addLayer(layer2);

      let layer3 = new mapvgl.PointLayer({
        blend: "lighter",
        shape: "circle",
        color: "rgba(24, 144, 255, 0.4)", // 点图层3颜色
        // data: mapData,
        size: 8,
      });
      view.addLayer(layer3);

      let layer4 = new mapvgl.PointTripLayer({
        blend: "lighter",
        shape: "circle",
        startTime: 0,
        endTime: 100,
        step: 0.1,
        trailLength: 10,
        color: "rgba(24, 144, 255, 0.5)", // 点动画图层颜色
        // data: mapData,
        size: 10,
      });
      view.addLayer(layer4);
      layer1.setData(mapData)
      // layer2.setData(mapData)
      layer3.setData(mapData)
      layer4.setData(mapData)
    },
    // 放大或缩小地图
    setMapZoom(type) {
      if (type === "plus") {
        this.instanceMap.zoomIn();
      } else if (type === "minus") {
        this.instanceMap.zoomOut();
      }
    },
    closeInfoBox() {
      this.infoBoxShow = false;
    },
    fullMap(key) {
      let obj = $("." + this.mapContainer);
      if (obj.hasClass("map-wrap-full")) {
        obj.removeClass("map-wrap-full");
        $("body").css({ overflow: "auto" });
      } else {
        $("." + this.mapContainer).addClass("map-wrap-full");
        $("body").css({ overflow: "hidden" });
      }
    },
  },
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
  flex-flow: row nowrap;
}
%flex-column-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column nowrap;
}
.index-map-row {
  @extend %flex-row-center;
  align-items: flex-start;
}
.map-container {
  height: 100%;
}
.map-wrap {
  position: relative;
  flex-grow: 1;
  /* min-height: 551px; */
  height: 540px;
  margin-right: 24px;
}
.map-wrap-full {
  position: fixed !important;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100% !important;
  z-index: 10000;
}
.fad-map-info {
  position: absolute;
  top: 12px;
  right: 0;
  left: 0;
  width: 85%;
  height: 32px;
  padding: 0 17px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  display: flex;
  margin: 0 auto 0 12px;
  align-items: center;
  justify-content: flex-start;
  flex-flow: row nowrap;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  z-index: 1000;
  .info-text {
    margin-left: 4px;
    line-height: 22px;
  }
  .info-close {
    margin: 0 0 0 auto;
  }
}
.fad-map-control {
  position: absolute;
  top: 20px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-flow: column;
  height: 500px;
  z-index: 1000;
  .map-full-screen {
    font-size: 25px;
    margin-bottom: 28px;
    cursor: pointer;
  }
  .zoom-btn {
    width: 25px;
    height: 25px;
    margin-top: 2px;
    border-radius: 2px;
    background: #fff;
    text-align: center;
    i.anticon {
      vertical-align: middle;
    }
  }
}
/deep/ .anchorBL {
  & > img,
  a > img {
    display: none;
  }
  .BMap_scaleBar {
    background-color: black;
  }
}
/deep/ .BMap_cpyCtrl {
  display: none;
}
/deep/ .BMap_scaleCtrl div {
  position: absolute;
  overflow: hidden;
}
</style>
