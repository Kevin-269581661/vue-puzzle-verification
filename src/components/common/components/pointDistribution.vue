<template>
  <div class="map-wrap map-wrap-index1">
    <div :id="mapContainer" class="map-container"></div>
    <div class="fad-map-info">
      <!-- <a-icon type="info-circle" /> -->
      <span class="info-text">点位分布: 这段时间内可投点位的位置分布</span>
      <!-- <a-icon @click="closeInfoBox(7)" class="info-close" type="close" /> -->
    </div>
    <!-- <div class="fad-map-control">
      <a-icon
        @click="fullMap(1)"
        class="map-full-screen"
        :type="fullFlag == 1 ? 'fullscreen-exit' : 'fullscreen'"
      />
      <a-slider
        vertical
        :marks="distanceMarks"
        :step="25"
        v-model="sliderValue1"
        @change="sliderChange"
      />
      <div>
        <div class="zoom-btn">
          <a-icon type="plus" @click="setMapZoom(1, 'plus')" />
        </div>
        <div class="zoom-btn">
          <a-icon type="minus" @click="setMapZoom(1, 'minus')" />
        </div>
      </div>
    </div> -->
  </div>
</template>
<script>
import $ from "jquery";
import { initMap, snowStyle, whiteStyle } from "@/commonFun/mapCommon.js";
// var instanceMap1 = null;
export default {
  name: "pointDistribution",
  components: {},
  props: {
    mapContainer: {
      type: String,
      required: true
    },
    hasMpvgl: {
      type: Boolean,
      default: false
    },
    actived: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    hasMpvgl(val) {
      if (val === true) {
        setTimeout(() => {
          this.pointsDistribution();
        }, 1000);
      }
    },
    actived(val) {
      if (this.mapFinish == false && this.hasMpvgl && val === true) {
        setTimeout(() => {
          this.pointsDistribution();
        }, 1000);
      }
    }
  },
  data() {
    return {
      instanceMap1: null,
      mapFinish: false
    };
  },
  methods: {
    pointsDistribution() {
      this.instanceMap1 = initMap({
        id: this.mapContainer,
        tilt: 48.8,
        heading: 0,
        center: [105.348145, 28.165926],
        zoom: 11,
        style: whiteStyle,
      });
      this.instanceMap1.addEventListener("zoomend", (e) => {
        let level = e.target.getZoom();
        // this.sliderValue1 = this.getSliderValue(level);
      });
      var view = new mapvgl.View({
        map: this.instanceMap1,
      });

      let layer1 = new mapvgl.PointLayer({
        blend: "lighter",
        shape: "circle",
        color: "rgba(17, 95, 255, 0.8)", // 点图层1颜色
        // data: data1,
        size: 3,
      });
      view.addLayer(layer1);

      let layer2 = new mapvgl.PointLayer({
        blend: "lighter",
        shape: "circle",
        color: "rgba(24, 144, 255, 0.6)", // 点图层2颜色
        // data: data2,
        size: 5,
      });
      view.addLayer(layer2);

      let layer3 = new mapvgl.PointLayer({
        blend: "lighter",
        shape: "circle",
        color: "rgba(24, 144, 255, 0.4)", // 点图层3颜色
        // data: data3,
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
        // data: data1,
        size: 10,
      });
      view.addLayer(layer4);
      this.mapFinish = true;
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
.map-container {
  height: 540px;
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
