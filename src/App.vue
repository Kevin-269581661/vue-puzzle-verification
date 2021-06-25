
<template>
  <div id="app-body">
    <!-- <router-view></router-view> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
/* export default {
  watch: {
    $route() {
      let locationHash = window.location.hash;
      //把路由存在缓存中，此处你可以console.log看出路由变化
      sessionStorage.setItem("hashLocation", locationHash);
    }
  },
}; */
</script>

<style scoped>
</style>
