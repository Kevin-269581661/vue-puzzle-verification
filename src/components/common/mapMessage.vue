<template>
  <div>
    <el-dialog
      title="提示"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :visible.sync="mapDialogVisible">
      <span>点位选择成功，请在购物车模块点击相应的位置获取地图选择的点位数据！</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeWin">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import sessFun from "../../commonFun/sessFun.js";
    export default {
      name: "mapMessage",
      data(){
          return{
            sessionData:'',
            mapDialogVisible: true,
            isBD: true,
          }
      },
      mounted(){
        this.getSessionData()
      },
      methods:{
        getSessionData(){
          this.sessionData = sessFun.getSess();
          if (this.sessionData.uType === 'BD') {
            this.$router.push('/sale/mapMessage')
          }else if(this.sessionData.uType === 'MD'){
            this.$router.push('/media/mapMessage')
          }else{
            this.$router.push('/login')
          }
        },
        closeWin() {
          window.opener = null;
          window.open('', '_self');
          window.close();
        }
      }
    }
</script>

<style scoped>

</style>
