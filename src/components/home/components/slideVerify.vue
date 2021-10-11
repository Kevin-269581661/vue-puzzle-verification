<!--
 * @Author: penglei
 * @Date: 2021-10-08 18:03:24
 * @LastEditors: penglei
 * @LastEditTime: 2021-10-09 18:36:01
 * @FilePath: /frontend/src/components/home/components/slideVerify.vue
-->
<template>
  <div
    class="login-verify"
  >
    <slide-verify
      :l="42"
      :r="10"
      :w="368"
      :h="200"
      slider-text="向右滑动"
      :imgs="slideImgArr"
      @success="onSuccess"
      @fail="onFail"
      @refresh="onRefresh"
    ></slide-verify>
  </div>
</template>

<script>
export default {
  prop: {

  },
  data() {
    return {
      slideImgArr: [
        "/static/images/loginSlideBg/01.jpg",
        "/static/images/loginSlideBg/02.jpg",
        "/static/images/loginSlideBg/03.jpg",
        "/static/images/loginSlideBg/04.jpg",
        "/static/images/loginSlideBg/05.jpg",
        "/static/images/loginSlideBg/06.jpg",
        "/static/images/loginSlideBg/07.jpg",
        "/static/images/loginSlideBg/08.jpg",
        "/static/images/loginSlideBg/09.jpg",
        "/static/images/loginSlideBg/10.jpg"
      ],
      verified: "beforeTry"
    }
  },
  methods: {
    onSuccess() {
      this.$emit('validateSlide');
    },
    onFail() {
      console.log("verified", this.verified);
    },
    onRefresh() {
      console.log("verified", this.verified);
    }
  }
}
</script>

<style lang="scss" scoped>
.login-verify {
  position: relative;
  left: 50%;
  z-index: 9;
  display: inline-block;
  margin-bottom: 16px;
  transform: translateX(-50%);
   /deep/ .slide-verify {
    canvas {
      border-radius: 4px;
    }
  }
}

</style>