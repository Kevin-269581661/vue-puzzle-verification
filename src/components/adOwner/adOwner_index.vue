<template>
  <div>
    <div class="ad_index_container">
      <ul class="ad_index_panel clearfix">
        <li>
          <router-link :to="{path:'/adOwner/orderList'}" class="mask"></router-link>
          <div class="panel_top">
            <div class="panel_top_icon_wrap">
              <div class="panel_top_icon">
              </div>
            </div>
            <div class="panel_top_right">
              <h1>订单管理</h1>
              <span>查 看<img src="../../assets/images/rightArr.png" alt=""></span>
            </div>
          </div>

        </li>
        <li>
          <router-link :to="{path:'/adOwner/ADReport'}" class="mask"></router-link>
          <div class="panel_top">
            <div class="panel_top_icon_wrap">
              <div class="panel_top_icon">
              </div>
            </div>
            <div class="panel_top_right">
              <h1>亲邻智邻</h1>
              <span>查 看<img src="../../assets/images/rightArr.png" alt=""></span>
            </div>
          </div>

        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "sale_index"
  }
</script>

<style scoped>
  .ad_index_container{
    /*padding-top: 61px;*/
  }
  .ad_index_panel .mask{
    height: 146px;
    line-height: 146px;
  }
  .ad_index_panel li {
    height: 146px;
  }
  .panel_top{
    border-bottom: none;
    height: 146px;

  }
  .panel_top_right{
    top: 45px;
  }
  .ad_index_panel li:nth-child(1) .panel_top_icon_wrap,.ad_index_panel li:nth-child(2) .panel_top_icon_wrap{
    margin-top: 35px;
  }

</style>
