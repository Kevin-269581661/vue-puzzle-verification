<template>
  <div>
    <el-dialog
      width="392px"
      :visible.sync="dialogVisible"
      :show-close="false"
      :before-close="handleClose"
      :close-on-click-modal="false"
      custom-class="custom-dialog-wrapper registration-media"
    >
      <h2 class="title">
        <i class="el-icon-question"></i> 是否确认调整该订单下刊日期？
      </h2>
      <div class="content">
        原排期：{{ oldStartTime }}{{ oldEndTime ? '-' : ''
        }}{{ oldEndTime }}
      </div>
      <div class="content">
        调整为：{{ newTime }}
      </div>
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="handleCommit"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../../api/api";
import timeFormat from "../../../commonFun/timeFormat.js";
import sessFun from "../../../commonFun/sessFun.js";
export default {
  name: "updateOrderEndTime",

  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false,
    },
    updateOrderData: {
      type: Object,
      default: () => { },
    }
  },

  data () {
    return {
      loading: false
    }
  },

  watch: {
    dialogVisible (val) {
      if (val) {

      }
    }
  },

  created () {
    this.sessionData = sessFun.getSess();
  },

  computed: {
    oldStartTime () {
      return timeFormat.toDate(this.updateOrderData.startTime, '-', 'zh-cn')
    },

    oldEndTime () {
      return timeFormat.toDate(this.updateOrderData.endTime, '-', 'zh-cn')
    },

    newTime () {
      return timeFormat.toDate(this.updateOrderData.newEndTime, '-', 'zh-cn')
    }
  },

  methods: {
    handleCommit () {
      this.loading = true
      const bodyData = {
        confirmStatus: 1,
        recordId: this.updateOrderData.recordId
      }
      api
        .postApi_json("/addsp/api/v1/sale/updateOrderEndTime", bodyData)
        .then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.$message({
              type: "success",
              message: '调整下刊时间成功',
            })
            this.handleClose()
          } else {
            this.loading = false
            this.$message({
              type: "warning",
              message: res.data.message || "调整下刊时间失败",
            });
          }
        })
        .catch((err) => {
          this.loading = false
          console.log(err);
        })
    },

    handleClose () {
      this.$emit("update:dialogVisible", false)
    },

  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 0 24px 4px;
}

.title {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8px;
  .el-icon-question {
    font-size: 21px;
    color: #fa8c16;
    margin-right: 17px;
  }
}

.content {
  padding-left: 42px;
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.65);
}
/deep/ .el-dialog__footer {
  padding-top: 22px;
}
</style>
