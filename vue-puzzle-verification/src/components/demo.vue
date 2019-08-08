<template>
  <div class="container">
    <div class="login-box">
      <button @click="handleClick(1)">最简单用法</button>
      <div class="puzzle-box">
        <PuzzleVerification
          v-model="isVerificationShow1"
          :onSuccess="handleSuccess"
        />
      </div>
    </div>

    <div class="login-box">
      <button @click="handleClick(2)">拼图形滑块</button>
      <div class="puzzle-box">
        <PuzzleVerification
          v-model="isVerificationShow2"
          :puzzleImgList="puzzleImgList"
          blockType="puzzle"
          :onSuccess="handleSuccess"
        />
      </div>
    </div>

    <div class="login-box">
      <button @click="handleClick(3)">控制大小</button>
      <div class="puzzle-box">
        <PuzzleVerification
          v-model="isVerificationShow3"
          width="300"
          height="200"
          blockSize="80"
          blockRadius="5"
          :onSuccess="handleSuccess"
        />
      </div>
    </div>

    <div class="login-box">
      <button @click="handleClick(4)">控制误差</button>
      <div class="puzzle-box">
        <PuzzleVerification
          v-model="isVerificationShow4"
          :puzzleImgList="puzzleImgList"
          deviation="20"
          blockType="puzzle"
          :onSuccess="handleSuccess"
        />
      </div>
    </div>

    <div class="login-box">
      <button @click="handleClick(5)">控制滑块出现位置范围</button>
      <div class="puzzle-box">
        <PuzzleVerification
          v-model="isVerificationShow5"
          wraperPadding="50"
          :onSuccess="handleSuccess"
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
      puzzleImgList:[
        require("../assets/thumbnail-img01.jpg"),
        require("../assets/thumbnail-img02.jpg"),
        require("../assets/thumbnail-img03.jpg")
      ]
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
    handleClick (n) {
      switch(n) {
        case 1:
          this.isVerificationShow1 = true;
          break;
        case 2:
          this.isVerificationShow2 = true;
          break;
        case 3:
          this.isVerificationShow3 = true;
          break;
        case 4:
          this.isVerificationShow4 = true;
          break;
        default:
          this.isVerificationShow5 = true;
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  .container {
    padding-top: 100px;
    position: relative;
    display: flex;
    flex-flow: row wrap;
    .login-box {
      width: 400px;
      height: 300px;
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