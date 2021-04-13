<template>
  <div class="wrap">
    <div class="imgs">
      <img src="../../assets/images/notfound.png" alt="">
    </div>
    <div class="txt">
      <h1>404</h1>
      <p>抱歉，你访问的页面不存在</p>
      <el-button type="primary">
        <a href="/">
          返回首页
      </a>
      </el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "NotFoundPage",
    beforeCreate() {
      if(!sessionStorage.getItem("session_data")) {
        this.$router.replace({path: '/'})
      }
    }
  }
</script>

<style scoped>
  .wrap {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-top: 200px;
  }

  .wrap .imgs{
    width: 60%;
    text-align: center;
  }
  .wrap .txt{
    width: 40%;
  }
  .wrap .imgs img {
    width: 443px;
    height: 341px;
  }
  .wrap .txt h1{
    color:  #434E59;
    font-size: 100px;

  }
  .wrap .txt p{
    font-size: 20px;
    margin-bottom: 24px;
    color: rgba(0,0,0,0.45);
  }
  .wrap .txt button{
    width: 88px;
    height: 32px;
    line-height: 8px;
  }
  .wrap .txt button a{
    color: #fff;
    text-decoration: none;
    position: relative;
    left: -3px;
  }

</style>
