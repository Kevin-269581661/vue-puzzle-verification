<template>
<el-popover
  :ref="refName"
  :style="{width: `${Math.floor(1/12*100*boxWidthUnitNum)}%`, height: `${max?barData.totalLabCnt/max*100:'100'}%`}"
  placement="right-start"
  :visible-arrow="false"
  width="200"
  trigger="hover">
  <div class="tip-box">
      <div class="pop-title">
          <em>{{barData.time||''}}</em>
      </div>
      <ul>
          <li class="pop-item">
            <em>已售</em>
            <span class="align-right">{{barData.onPubLabCnt | moneyFormat('', 0)}}面周</span>
            <span class="tip-rate">{{barData.onPubRate}}%</span>
          </li>
          <li class="pop-item">
            <em>未售出</em>
            <span class="align-right">{{barData.overdueLabCnt | moneyFormat('', 0)}}面周</span>
            <span class="tip-rate">{{barData.overdueRate}}%</span>
          </li>
          <li class="pop-item">
            <em>禁用</em>
            <span class="align-right">{{barData.banLabCnt | moneyFormat('', 0)}}面周</span>
            <span class="tip-rate">{{barData.banLabRate}}%</span>
          </li>
          <li class="pop-item">
            <em>维修</em>
            <span class="align-right">{{barData.repairLabCnt | moneyFormat('', 0)}}面周</span>
            <span class="tip-rate">{{barData.repairRate}}%</span>
          </li>
      </ul>
  </div>
  <div slot="reference" style="width: 100%; height: 100%;">
    <svg @click="catDetail" class="chart-wave-bar" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" :viewBox="'0,0,'+boxWidth+','+boxHeight" preserveAspectRatio="xMinYMin meet">
      <defs>
          <linearGradient id="blue" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#6DB9FF;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#1890FF;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="yellow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#FABF14;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#FAAD14;stop-opacity:1" />
          </linearGradient>
      </defs>
      <g>
          <!--维修禁用-->
          <g>
            <g fill="#FABF14">
              <path :d="wavePath1"></path>
              <animateTransform attributeName="transform" attributeType="XML" type="translate" from="0" :to="`-${boxWidth}`" dur="3s" repeatCount="indefinite"></animateTransform>
              <animateTransform attributeName="transform" attributeType="XML" type="translate" :from="`0 ${boxHeight-waveHeight1}`" :to="`-${boxWidth} 0`" dur="1.5s" calcMode="linear"></animateTransform>
            </g>
            <g fill="#FAAD14">
              <path :d="wavePath1"></path>
              <animateTransform attributeName="transform" attributeType="XML" type="translate" from="0" :to="`-${boxWidth}`" dur="1.5s" repeatCount="indefinite"></animateTransform>
              <animateTransform attributeName="transform" attributeType="XML" type="translate" :from="`0 ${boxHeight-waveHeight1}`" :to="`-${boxWidth} 0`" dur="1.5s" calcMode="linear"></animateTransform>
            </g>
            <text v-if="waveHeight2-waveHeight1 > 14" :x="boxWidth/2" :y="(waveHeight2+waveHeight1)/2" style='dominant-baseline:middle;text-anchor:middle;' fill="#fff" font-family="DIN-Medium" font-size="14">{{barData.banRepairRate||'0.00'}}%</text>
          </g>
          <!--已售-->
          <g>
            <g fill="#1890FF">
              <path :d="wavePath2"></path>
              <animateTransform attributeName="transform" attributeType="XML" type="translate" from="0" :to="`-${boxWidth}`" dur="3s" repeatCount="indefinite"></animateTransform>
              <animateTransform attributeName="transform" attributeType="XML" type="translate" :from="`0 ${boxHeight-waveHeight2}`" :to="`-${boxWidth} 0`" dur="1.5s" calcMode="linear"></animateTransform>
            </g>
            <g fill="#6DB9FF" fill-opacity=".5">
              <path :d="wavePath2"></path>
              <animateTransform attributeName="transform" attributeType="XML" type="translate" from="0" :to="`-${boxWidth}`" dur="1.5s" repeatCount="indefinite"></animateTransform>
              <animateTransform attributeName="transform" attributeType="XML" type="translate" :from="`0 ${boxHeight-waveHeight2}`" :to="`-${boxWidth} 0`" dur="1.5s" calcMode="linear"></animateTransform>
            </g>
            <text v-if="boxHeight-waveHeight2 > 14" :x="boxWidth/2" :y="(boxHeight+waveHeight2)/2" style='dominant-baseline:middle;text-anchor:middle;' fill="#fff" font-family="DIN-Medium" font-size="14">{{barData.onPubRate||'0.00'}}%</text>
          </g>
      </g>
    </svg>
    <span v-if="barData.time" class="bar-bottom">{{barData.time}}</span>
  </div>
</el-popover>
</template>

<script>
export default {
  name: "waveBar",
  props: {
    boxWidthUnitNum: {
      type: Number,
      required: true,
      default: 1
    },
    refName: {
      type: String,
      required: true
    },
    barData: {
      type: Object,
      required: true
    },
    max: {
      type: Number
    },
    filter: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      boxWidth: 50*1,
      boxHeight: 402,
      waveNum: 3,
      waveWidthUnit: 0,
      waveHeightUnit: 0,
      wavePath1: '',
      wavePath2: '',
      waveHeight1: 0,   // 黄色波浪距离顶部的高度
      waveHeight2: 20
    };
  },
  created() {
  },
  mounted() {
    this.setShape()
    window.addEventListener("resize", ()=>{
      this.setShape()
    })
  },
  updated() {
    this.setShape()
  },
  methods: {
    setShape() {
      // console.log(this.$refs[this.refName], $(this.$refs[this.refName].$el)[0].getBoundingClientRect())
      let rectInfo = this.$refs[this.refName]
      if(!rectInfo) return
      rectInfo = $(rectInfo.$el)[0].getBoundingClientRect()
      this.boxWidth = rectInfo.width-6
      this.boxWidth = this.boxWidth>0?this.boxWidth:0
      this.boxHeight = rectInfo.height-6
      this.boxHeight = this.boxHeight>0?this.boxHeight:0
      this.waveHeight1 = this.boxHeight*(this.barData.overdueRate*1/100)
      this.waveHeight2 = this.boxHeight*(this.barData.overdueRate*1+this.barData.banRepairRate*1)/100
      this.waveWidthUnit = this.boxWidth/2/this.waveNum
      this.waveHeightUnit = this.boxWidth*3/50
      this.wavePath1 = `M 0 ${this.waveHeight1}  Q ${this.waveWidthUnit} ${this.waveHeightUnit+this.waveHeight1}, ${this.waveWidthUnit*2} ${this.waveHeight1} T ${this.waveWidthUnit*2*2} ${this.waveHeight1} T ${this.waveWidthUnit*2*3} ${this.waveHeight1} T ${this.waveWidthUnit*2*4} ${this.waveHeight1} T ${this.waveWidthUnit*2*5} ${this.waveHeight1} T ${this.waveWidthUnit*2*6} ${this.waveHeight1} T ${this.waveWidthUnit*2*7} ${this.waveHeight1} T ${this.waveWidthUnit*2*8} ${this.waveHeight1} V ${this.boxHeight} H 0 V ${this.waveHeight1}`
      this.wavePath2 = `M 0 ${this.waveHeight2}  Q ${this.waveWidthUnit} ${this.waveHeightUnit+this.waveHeight2}, ${this.waveWidthUnit*2} ${this.waveHeight2} T ${this.waveWidthUnit*2*2} ${this.waveHeight2} T ${this.waveWidthUnit*2*3} ${this.waveHeight2} T ${this.waveWidthUnit*2*4} ${this.waveHeight2} T ${this.waveWidthUnit*2*5} ${this.waveHeight2} T ${this.waveWidthUnit*2*6} ${this.waveHeight2} T ${this.waveWidthUnit*2*7} ${this.waveHeight2} T ${this.waveWidthUnit*2*8} ${this.waveHeight2} V ${this.boxHeight} H 0 V ${this.waveHeight2}`
    },
    catDetail() {
      if(this.filter!==2) return
      this.$emit('emitFun', this.barData)
    }
  }
};
</script>

<style lang="scss" scoped>
.bar-bottom {
  display: block;
  text-align: center;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.85);
}
.chart-wave-bar {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 1px;
  border-radius: 2px;
  border: 2px solid #1890FF;
}

.tip-box {
  border-radius: 2px;
  line-height: 16px;
  font-size: 12px;
  font-weight: 400;
  font-family: PingFangSC-Regular, PingFang SC;
  .pop-title {
    display: flex;
    padding-bottom: 6px;
    border-bottom: 1px solid rgba(216, 216, 216, .65);
    line-height: 20px;
    color: rgba(0, 0, 0, 0.85);
  }
  ul {
      padding-top: 3px;
  }
  .pop-item {
    display: flex;
    justify-content: space-between;
    padding: 3px 0;
    color: rgba(0, 0, 0, 0.65);
    .align-right {
      margin: 0 16px 0 auto;
    }
    .tip-rate {
      width: 45px;
      text-align: right;
    }
  }
}
</style>
