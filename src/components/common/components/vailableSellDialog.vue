<template>
  <el-dialog
    :visible="true"
    :show-close="false"
    width="392px"
    :before-close="handleClose"
  >
    <h2 class="u-title">
      <i class="el-icon-question"></i> 是否将该媒体或投放面恢复为可售卖状态？
    </h2>

    <div class="m-container">
      <div class="u-centent">
        确定后，<b>保利威座</b> 媒体或某一投放面将恢复为可售卖状态
      </div>

      <h3 class="u-title">原不可售卖原因：</h3>
      <ul class="u-targetRadio">
        <li>原不可售卖原因</li>
        <li>小区更换物业公司了</li>
      </ul>

      <h3 class="u-title">请选择恢复可售卖目标：</h3>
      <el-radio-group v-model="targetRadio" class="u-targetRadio">
        <el-radio :label="0">设备</el-radio>
        <el-radio :label="1">A面</el-radio>
        <el-radio :label="2">B面</el-radio>
      </el-radio-group>

      <h3 class="u-title">请输入处理说明：</h3>
      <el-input
        v-model="vailableResaon"
        placeholder="选填"
        class="u-unvailableResaon"
      ></el-input>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button @click="handleConfirm" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "vailableSellDialog",

  props: ['visible'],

  data () {
    return {
      targetRadio: 0,
      vailableResaon: ''
    }
  },

  methods: {
    handleChange (e) {
      console.log(typeof e)
    },

    handleClose () {
      this.$emit('update:visible', false)
    },

    handleConfirm () {
      this.handleClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.u-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  i {
    display: inline-block;
    margin-right: 17px;
    font-size: 21px;
    color: #fa8c16;
  }
}

.m-container {
  padding-left: 40px;
  .u-centent {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    margin: 8px 0 24px;
    b {
      color: #1890ff;
    }
  }

  .u-title {
    font-size: 14px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 8px;
  }
}

.unvailableResaon {
  width: 304px;
  height: 32px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.15);
}

.u-targetRadio {
  margin-bottom: 24px;
  li {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
  /deep/ .el-radio__label {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
  }
}

/deep/ .el-dialog__header {
  padding: 0;
  margin-bottom: 0;
}

/deep/ .el-dialog__body {
  padding: 24px;
}

/deep/ .el-radio-button {
  height: 32px;
  min-width: 80px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e8e8e8;
  margin-right: 8px;
  margin-bottom: 8px;
  overflow: hidden;
  &:last-of-type {
    margin-right: 0;
  }
  &.is-active {
    border-color: #1890ff;
  }
  .el-radio-button__inner {
    border-radius: 0;
    border: 0 none !important;
    width: 100%;
    padding: 0 12px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 32px;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background: none !important;
    color: #1890ff;
    border: 0 none !important;
    box-shadow: none;
  }
}

/deep/ .el-dialog__footer {
  padding-top: 0;
}
</style>