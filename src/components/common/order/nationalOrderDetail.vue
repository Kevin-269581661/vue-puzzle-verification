<template>
  <!-- 全国单-详情 -->
  <div class="page_container">
    <div class="page_navigation">
      <p class="clearfix">
        <a href="#">全国单管理-详情</a>
      </p>
    </div>

    <div v-loading="pageLoading" class="page_content">
      <div class="page_content_top">

      </div>

    </div>

    <!-- <MaintainHistoryDialog ref="maintainHistoryDialogRef" @refresh="getTableList"/> -->
  </div>
</template>

<script>
import sessFun from "@/commonFun/sessFun.js";
import MaintainPicDialog from '@/components/common/components/maintainList/maintainPicDialog.vue'
import MaintainHistoryDialog from '@/components/common/components/maintainList/maintainHistoryDialog.vue'
import DownloadFileButton from "@/components/common/components/downloadFileButton.vue";
import { deserialize } from '@/utils/common'

export default {
  name: "nationalOrderDetail",
  components: {
    MaintainHistoryDialog,
    DownloadFileButton
  },
  data () {
    return {
      pageLoading: false,
      // 登录信息
      sessionData: {},

      // 预加载数据
      // preparedData: {},
      statusColorObj: {
        '已处理': 'rgba(82,196,26,1)',
        '未处理': 'rgba(250,173,20,1)',
      }
    };
  },
  computed: {

  },
  methods: {




  },
  async mounted () {
    this.sessionData = sessFun.getSess();
  },
};
</script>

<style scoped lang="scss"></style>
