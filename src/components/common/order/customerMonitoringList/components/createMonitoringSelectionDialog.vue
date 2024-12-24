<!-- 新建客户监播-选择-弹窗 -->
<template>
  <el-dialog
    width="500px"
    append-to-body
    show-close
    title="新建监播"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="afterClose"
  >
    <div v-loading="loading" class="dialog_content">
      <div class="custom_dialog_body">
        <div class="cell_box">
          <el-button type="primary" @click="handleClick('hasSysOrder')">存在系统单</el-button>
          <i class="el-icon-question icon"></i>
        </div>
        <div class="cell_box">
          <el-button type="primary" @click="handleClick('noneSysOrder')">不存在系统单</el-button>
          <i class="el-icon-question icon"></i>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'createMonitoringSelectionDialog',
  emits: ['select', 'afterClose'],
  props: {},
  data() {
    return {
      visible: false,
      loading: false,
    }
  },

  methods: {
    handleClick(type) {
      this.$emit('select', type)
      this.close()
    },

    /**
     * 重置数据
     */
    afterClose() {
      this.$emit('afterClose')
    },
    /**
     * 打开弹框
     */
    open(row) {
      if (this.visible) return
      this.visible = true
    },
    /**
     * 关闭弹框
     */
    close() {
      if (!this.visible) return
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped="scoped">

/deep/ .el-dialog__body {
  padding: 0;
}

.custom_dialog_footer{
  padding: 10px 20px 20px;
}

.cell_box {
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  /deep/ .el-button {
    width: 200px;
  }

  .icon {
    color: #999;
    font-size: 18px;
    cursor: pointer;
    margin-left: 5px;
  }
}

</style>
