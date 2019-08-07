<template>
  <div class="container">
    <div class="login-box">
      <button @click="handleClick(1)">最简单用法</button>
      <button @click="handleClick(2)">方形滑块</button>
      <button @click="handleClick(3)">拼图形滑块</button>
      <button @click="handleClick(4)">大小可控</button>
      <button @click="handleClick(5)">位置可控</button>
      <div class="puzzle-box">
        <PuzzleVerification
          v-model="isVerificationShow"
          :onSuccess="handleSuccess1"
        />
        <PuzzleVerification
          v-model="isVerificationShow"
          width="300"
          height="200"
          :puzzleImgList="puzzleImgList"
          blockSize="80"
          deviation="10"
          blockRadius="5"
          blockType="puzzle"
          wraperPadding="50"
        />
        <PuzzleVerification
          v-model="isVerificationShow"
          width="300"
          height="200"
          :puzzleImgList="puzzleImgList"
          blockSize="80"
          deviation="10"
          blockRadius="5"
          blockType="puzzle"
          wraperPadding="50"
        />
        <PuzzleVerification
          v-model="isVerificationShow"
          width="300"
          height="200"
          :puzzleImgList="puzzleImgList"
          blockSize="80"
          deviation="10"
          blockRadius="5"
          blockType="puzzle"
          wraperPadding="50"
        />
        <PuzzleVerification
          v-model="isVerificationShow"
          width="300"
          height="200"
          :puzzleImgList="puzzleImgList"
          blockSize="80"
          deviation="10"
          blockRadius="5"
          blockType="puzzle"
          wraperPadding="50"
        />
      </div>
    </div>
  </div>
</template>
<script>
import PuzzleVerification from '@/components/puzzleVerification'

export default {
  components: {
    PuzzleVerification
  },
  data () {
    return {
      isVerificationShow1: false,
      isVerificationShow2: false,
      isVerificationShow3: false,
      isVerificationShow4: false,
      isVerificationShow5: false,
      puzzleImgList:[]
    }
  },
  watch: {
    isVerificationShow(val) {
      console.log('父组件-isVerificationShow', val)
    }
  },
  methods: {
    handleSuccess() {
      console.log('验证成功了')
    },
    handleClick () {
      this.isVerificationShow = true;
    }
  }
}
</script>
<style lang="stylus" scoped>
  .container {
    padding-top: 100px;
    position: relative;
    .login-box {
      width: 300px;
      margin: 0 auto;
    }
    .puzzle-box {
      position: absolute;
      // bottom: 0;
      // left: 0;
    }
    button {
      color: #fff;
      background-color: #50AAD0;
      border-color: #50AAD0;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #dcdfe6;
      color: #606266;
      -webkit-appearance: none;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      outline: 0;
      margin: 0;
      -webkit-transition: .1s;
      transition: .1s;
      font-weight: 500;
      padding: 12px 20px;
      font-size: 14px;
      border-radius: 4px;
      &:hover {
        border-color: #50AAD0;
      }
    }
  }
</style>