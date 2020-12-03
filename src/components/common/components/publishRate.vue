<template>
  <div class="index-row">
    <div :class="['map-wrap', mapContainer]">
      <div :id="mapContainer" class="map-container"></div>
      <div class="fad-map-info" v-if="infoBoxShow">
        <i class="el-icon-info" />
        <span class="info-text"
          >点位利用率:
          这段时间内可投点位每天的上刊率与点位填充率的综合平均</span
        >
        <i
          v-if="instanceMap"
          @click="closeInfoBox"
          class="el-icon-close info-close"
        />
      </div>
      <div class="fad-map-control">
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
    <el-table
      :data="tableData"
      max-height="540"
      style="flex: unset; width: auto"
    >
      <el-table-column
        prop="index"
        label="排名"
        width="60"
        type=index
      >
      </el-table-column>
      <el-table-column
        prop="cityName"
        label="城市"
        width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="districtName"
        label="地区"
        width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="onPubRate"
        label="上刊率"
        width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.onPubRate+'%' }}</span>
        </template>
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
  name: "publishRate",
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
      setTimeout(() => {
        this.setMap();
      }, 1000);
    },
    actived(val) {
      setTimeout(() => {
        this.setMap();
      }, 1000);
    },
  },
  data() {
    return {
      instanceMap: null,
      fullFlag: null,
      sessionData: null,
      infoBoxShow: true,
      tableData: [],
    };
  },
  mounted() {
    this.sessionData = sessFun.getSess();
    this.getDistrictOnPubRateReport();
  },
  methods: {
    // 首页的地图上刊率 /report /homepage/getDistrictOnPubRateReport
    getDistrictOnPubRateReport() {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
      };
      api
        .getApi(
          this.apiVar.report + "/homepage/getDistrictOnPubRateReport",
          params
        )
        .then((res) => {
          if (res.data.SysCode === 200200) {
            this.tableData = res.data.data || [];
            this.setMap();
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
      if(!this.hasMpvgl) return
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
      if(!this.tableData) return;
      // this.instanceMap.setCenter(
      //   new BMapGL.Point(105.348145, 28.165926)
      // );
      this.instanceMap.clearOverlays();
      this.tableData.forEach((item) => {
        if (item.latlng) {
          let label = new BMapGL.Label(item.onPubRate + "%", {
            offset: new BMapGL.Size(22, 2),
            position: new BMapGL.Point(
              item.latlng.split(";")[0],
              item.latlng.split(";")[1]
            ),
          });
          // 三色区间 rgb(195, 219, 241) rgb(24, 144, 255) R:171 G:75 B:14 A:0.5
          let colorR = 195 - Math.floor((171 * item.onPubRate) / 100),
            colorG = 219 - Math.floor((75 * item.onPubRate) / 100),
            colorB = 241 + Math.floor((14 * item.onPubRate) / 100),
            colorA = 0.8 + ((0.2 * item.onPubRate) / 100).toFixed(2) * 1;
          let size =
            item.onPubRate > 85
              ? '55px'
              : item.onPubRate < 55
              ? '40px'
              : item.onPubRate < 30
              ? '45px'
              : '50px';
          label.setStyle({
            width: size,
            height: size,
            borderRadius: "50%",
            border: "none",
            textAlign: "center",
            lineHeight: size,
            background: `rgba(${colorR}, ${colorG}, ${colorB}, ${colorA})`,
            color: "#fff",
            "box-shadow": "0px 0px 2px",
            "box-sizing": "content-box",
            // cursor: "pointer",
          });
          this.instanceMap.addOverlay(label);
        }
      });
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
  align-items: center;
  flex-flow: row nowrap;
}
%flex-column-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column nowrap;
}
.index-row {
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
