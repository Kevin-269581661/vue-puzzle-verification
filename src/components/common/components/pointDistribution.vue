<template>
  <div class="index-map-row">
    <div :class="['map-wrap', mapContainer]">
      <div :id="mapContainer" class="map-container"></div>
      <div class="fad-map-info" v-if="infoBoxShow">
        <i class="el-icon-info" />
        <span class="info-text">点位分布: 展示公司覆盖的所有小区资源，数据截止至昨日</span>
        <i v-if="instanceMap" @click="closeInfoBox" class="el-icon-close info-close" />
      </div>
      <div v-if="instanceMap" class="fad-map-control">
        <svg t="1607428653397" v-if="fullFlag" @click="fullMap" class="icon map-full-screen" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3052" width="200" height="200"><path d="M313.6 358.4H177.066667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h213.333333c4.266667 0 8.533333 0 10.666667-2.133333 8.533333-4.266667 14.933333-8.533333 17.066666-17.066667 2.133333-4.266667 2.133333-8.533333 2.133334-10.666667v-213.333333c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v136.533333L172.8 125.866667c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l185.6 187.733333zM695.466667 650.666667H832c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H618.666667c-4.266667 0-8.533333 0-10.666667 2.133333-8.533333 4.266667-14.933333 8.533333-17.066667 17.066667-2.133333 4.266667-2.133333 8.533333-2.133333 10.666666v213.333334c0 17.066667 14.933333 32 32 32s32-14.933333 32-32v-136.533334l200.533333 200.533334c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466667-8.533333c12.8-12.8 12.8-32 0-44.8l-204.8-198.4zM435.2 605.866667c-4.266667-8.533333-8.533333-14.933333-17.066667-17.066667-4.266667-2.133333-8.533333-2.133333-10.666666-2.133333H192c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h136.533333L128 851.2c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333l200.533334-200.533333V832c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V618.666667c-2.133333-4.266667-2.133333-8.533333-4.266667-12.8zM603.733333 403.2c4.266667 8.533333 8.533333 14.933333 17.066667 17.066667 4.266667 2.133333 8.533333 2.133333 10.666667 2.133333h213.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32h-136.533333L896 170.666667c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0l-187.733333 187.733333V177.066667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333333c2.133333 4.266667 2.133333 8.533333 4.266666 12.8z"></path></svg>
        <svg t="1607428042158" v-else @click="fullMap" class="icon map-full-screen" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2918" width="200" height="200"><path d="M149.333333 394.666667c17.066667 0 32-14.933333 32-32v-136.533334l187.733334 187.733334c6.4 6.4 14.933333 8.533333 23.466666 8.533333s17.066667-2.133333 23.466667-8.533333c12.8-12.8 12.8-32 0-44.8l-187.733333-187.733334H362.666667c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H149.333333c-4.266667 0-8.533333 0-10.666666 2.133334-8.533333 4.266667-14.933333 10.666667-19.2 17.066666-2.133333 4.266667-2.133333 8.533333-2.133334 12.8v213.333334c0 17.066667 14.933333 32 32 32zM874.666667 629.333333c-17.066667 0-32 14.933333-32 32v136.533334L642.133333 597.333333c-12.8-12.8-32-12.8-44.8 0s-12.8 32 0 44.8l200.533334 200.533334H661.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h213.333334c4.266667 0 8.533333 0 10.666666-2.133334 8.533333-4.266667 14.933333-8.533333 17.066667-17.066666 2.133333-4.266667 2.133333-8.533333 2.133333-10.666667V661.333333c2.133333-17.066667-12.8-32-29.866666-32zM381.866667 595.2l-200.533334 200.533333V661.333333c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333334c0 4.266667 0 8.533333 2.133334 10.666666 4.266667 8.533333 8.533333 14.933333 17.066666 17.066667 4.266667 2.133333 8.533333 2.133333 10.666667 2.133333h213.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32h-136.533333l200.533333-200.533333c12.8-12.8 12.8-32 0-44.8s-29.866667-10.666667-42.666666 0zM904.533333 138.666667c0-2.133333 0-2.133333 0 0-4.266667-8.533333-10.666667-14.933333-17.066666-17.066667-4.266667-2.133333-8.533333-2.133333-10.666667-2.133333H661.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h136.533334l-187.733334 187.733333c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466667-8.533333l187.733333-187.733333V362.666667c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V149.333333c-2.133333-4.266667-2.133333-8.533333-4.266667-10.666666z"></path></svg>
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
    <el-table :data="tableData" max-height="540" style="flex: unset; width: auto; border: 1px solid #e8e8e8;">
      <el-table-column label="排名" type=index width="60">
      </el-table-column>
      <el-table-column v-if="isPlatformSM" prop="rName" label="城市" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column v-else prop="rName" label="地区" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="totalResCnt" label="社区" width="120" align="right" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="totalMediaCnt" label="媒体" width="120" align="right" show-overflow-tooltip>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import $ from "jquery";
import { initMap, whiteStyle, cityCenter } from "@/commonFun/mapCommon.js";
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
    isPlatformSM: {
      type: Boolean,
      default: false,
    }
  },
  watch: {
    hasMpvgl(val) {
      if (val === true) {
        let time1 = setTimeout(() => {
          this.setMap();
          clearTimeout(time1)
        }, 1000);
      }
    },
    actived(val) {
      if (this.hasMpvgl && val === true) {
        let time2 = setTimeout(() => {
          this.setMap();
          clearTimeout(time2)
        }, 1000);
      }
    },
  },
  data() {
    return {
      instanceMap: null,
      fullFlag: false,
      sessionData: null,
      infoBoxShow: true,
      tableData: []
    };
  },
  mounted() {
    this.sessionData = sessFun.getSess();
    this.getPointDistributionReport();
  },
  beforeDestroy() {
    console.log('destroy-pointDistribution');
    this.instanceMap.destroy();
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
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        })
        .catch((err) => {
          console.log("err", err);
        })
        .finally((_) => {});
    },
    setMap() {
      let mapData = []
      let flyToCoordinates = ''
      if(this.tableData.length>0) {
        flyToCoordinates = cityCenter.getCenterByCityName(this.tableData[0].rName)
        this.tableData.forEach(item=>{
          if(Array.isArray(item.latLngList)) {
            item.latLngList.forEach(point=>{
              let tempCoordinate = point.split(';')
              mapData.push({
                geometry: {
                  type: "Point",
                  coordinates: [
                    parseFloat(tempCoordinate[0]),
                    parseFloat(tempCoordinate[1])
                  ],
                },
                properties: {
                  time: Math.random() * 100,
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

      /* let layer2 = new mapvgl.PointLayer({
        blend: "lighter",
        shape: "circle",
        color: "rgba(24, 144, 255, 0.6)", // 点图层2颜色
        // data: mapData,
        size: 5,
      });
      view.addLayer(layer2); */

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
      if(!flyToCoordinates) {
        flyToCoordinates = mapData[0].geometry.coordinates
        flyToCoordinates = {lng: flyToCoordinates[0], lat: flyToCoordinates[1]}
      }
      this.instanceMap.flyTo(flyToCoordinates, 12)
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
    fullMap() {
      let obj = $("." + this.mapContainer);
      if (obj.hasClass("map-wrap-full")) {
        obj.removeClass("map-wrap-full");
        $("body").css({ overflow: "auto" });
        this.fullFlag = false;
      } else {
        $("." + this.mapContainer).addClass("map-wrap-full");
        $("body").css({ overflow: "hidden" });
        this.fullFlag = true;
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
  position: absolute;
  width: 100%;
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
  z-index: 999;
}
.fad-map-info {
  position: absolute;
  top: 12px;
  right: 45px;
  left: 0;
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
  top: 15px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-flow: column;
  height: 500px;
  z-index: 1000;
  .map-full-screen {
    width: 25px;
    height: 25px;
    fill: #fff;
    cursor: pointer;
  }
  .zoom-btn {
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2px;
    border-radius: 2px;
    background: #fff;
    text-align: center;
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
