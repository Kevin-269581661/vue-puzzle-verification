<template>
  <div>
    <div class="box aaa" viewpx="all"></div>          <!-- 四边 -->
    <div class="box" viewpx="left"></div>             <!-- 左边 -->
    <div class="box" viewpx="left top"></div>         <!-- 左边,上边 -->
    <div class="box" viewpx="left top right"></div>   <!-- 左边,上边,右边 -->
  </div>
</template>

<script>
(function (doc, win, width) {
  var docEl = doc.documentElement;
  var head = doc.getElementsByTagName("head")[0];
  var hFirst = head.firstChild || head.firstElementChild;
  var cssEl = doc.createElement("style");
  //手机横屏，竖屏可在此处设置
  var resizeEvt = "orientationchange" in win ? "orientationchange" : "resize";
  var recalc = function () {
    var x;
    var n = win.devicePixelRatio;
    if (n >= 3) {
      x = 3;
    } else if (n >= 2) {
      x = 2;
    } else {
      x = 1;
    }
    var clientWidth = docEl.clientWidth;
    if (!clientWidth) return;
    var pxPerRem = 100 * (clientWidth / width);
    cssEl.innerHTML = "html{ font-size:" + pxPerRem + "px!important; }";
    docEl.setAttribute("data-dpr", x); //x 限制范围取值 1,2,3
    head.appendChild(cssEl);
  };
  recalc();
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener("DOMContentLoaded", recalc, false);
})(document, window, 750);
// 若初始化为 750px, 此时整个屏幕宽度为 7.5rem
// 若初始化为 640px,(document, window,640), 此时整个屏幕宽度为 6.4rem
import Vue from "vue";
import LazyLoad from "../../commonFun/lazyLoad.js";
Vue.use(LazyLoad);
import { api } from "../../api/api";

export default {
  name: "YearStat",
  components: {
  },
  data() {
    return {
    };
  },
  computed: {
    
  },
  created() {
    // MtaH5.clickStat('a006_b011_c011_d000_bt000_sw01')
  },
  mounted() {
  },
  methods: {
    // 获取原始数据
    getData() {
      // 真实数据
      let name = this.Info.name.toString().toLowerCase();
      let val = this.Info.val;
      let info = {
        [name]: val,
      };
      api
        .getApi(this.apiVar.Advertisement + "/GetReportBatch", info)
        .then((res) => {
          console.log(res.data);
          if (res.data.SysCode == 200200) {
            let data = res.data;

            // 上下刊抬头信息
            // this.report = this.getFangInfo(data.adPlanInfo);
            this.report = data.adPlanInfo;
            // 投放详情
            let result = data.resInfo;
            this.putDetail = result;
            this.currPutDetail = JSON.parse(JSON.stringify(this.putDetail));
            this.filterCityData = filterFormat(result, "city");
            this.filtersArea = filterFormat(result, "rName");
            // 发布情况
            this.postDetail = this.getCityAdSpaceCount(data.cityAdSpaceCount);
            this.loading = false;
          } else {
            this.loading = false;
            Message.warning(res.data.MSG);
          }
        })
        .catch((res) => {
          this.loading = false;
          console.log(res);
        });
    },
  },
};
</script>

<style scoped>
/*通过伪元素缩放处理 1px 像素问题*/
[viewpx] {
  position: relative;
  padding: 1px;
}
[viewpx] * {
  position: relative;
}
[viewpx]:before {
  box-sizing: border-box;
  content: " ";
  position: absolute;
  top: -100%;
  right: 0;
  width: 200%;
  height: 200%;
  color: #e5e5e5;
  -webkit-transform-origin: 100% 100%;
  transform-origin: 100% 100%;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
}
[viewpx="all"]:before {
  border: 1px solid #e5e5e5;
}
[viewpx~="top"]:before {
  border-top: 1px solid #e5e5e5;
}
[viewpx~="bottom"]:before {
  border-bottom: 1px solid #e5e5e5;
}
[viewpx~="left"]:before {
  border-left: 1px solid #e5e5e5;
}
[viewpx~="right"]:before {
  border-right: 1px solid #e5e5e5;
}
</style>
 
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
body {
  overflow-y: auto;
}
body::-webkit-scrollbar {
  display: none;
} /*影藏滚动条*/
/*750px设计稿,假设元素 .box 宽750px,高500px*/
.box {
  width: 7.5rem;
  height: 2rem;
  font-size: 14px;
  /* border:1px solid red;    这里1px相当于分辨率的2px或3px */
}
.aaa:before {
  border-color: red; /*这里可改变 1px 边框颜色或其他样式*/
  border-radius: 50%; /*改变圆角需要配合下面一起改*/
}
.aaa {
  border-radius: 50%;
}
</style>