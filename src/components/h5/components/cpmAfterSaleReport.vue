<template>
  <div class="cpm_after_sale_report">
    <!-- CPM 售后报告组件 -->
    <div class="header_bar">
      <el-date-picker
        v-model="scheduleDate"
        :picker-options="scheduleDatePickerOptions"
        type="daterange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        placeholder="选择日期"
        size="small"
      >
      </el-date-picker>

      <el-button type="plain" size="small" style="width: 100px" @click="handleShareBtnclick">
        <!-- <img src="@/assets/images/icons/share_icon.png" /> -->
        <i class="el-icon-share"></i>
        分享设置
      </el-button>
    </div>

    <!-- 分享设置弹窗 -->
    <ShareConfigDialog ref="shareConfigDialogRef" />
  </div>
</template>

<script>

import { Message } from "element-ui";
import sessFun from "@/commonFun/sessFun.js";
import dayjs from "dayjs";
import ShareConfigDialog from "./shareConfigDialog.vue"

/**
 * 初始化表单数据
 */
const initFormData = () => {
  return {
  }
}

export default {
  name: 'cpmAfterSaleReport',
  components: { ShareConfigDialog },
  // emits: ['submitSuccess', 'close'],
  props: {
    // 订单ID
    apId: {
      type: Number,
    }
  },
  data() {
    return {
      scheduleDate: [],
      scheduleDateStart: '',
      scheduleDateEnd: '',
      scheduleDatePickerOptions: {
        disabledDate: (t) =>  dayjs().isBefore(t, 'day')
      }
    }
  },
  computed: {

  },
  methods: {
    /**
     * 点击分享配置
     */
     handleShareBtnclick() {
      console.log('点击分享配置 ===')
      this.$refs.shareConfigDialogRef && this.$refs.shareConfigDialogRef.open(this.apId) // 新增
    }
  }
}
</script>

<style lang="scss" scoped="scoped">
.cpm_after_sale_report {
  .header_bar {
    display: flex;
    justify-content: space-between
  }
}
</style>
