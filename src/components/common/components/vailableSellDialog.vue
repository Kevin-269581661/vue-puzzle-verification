<template>
  <el-dialog
    :visible="true"
    :show-close="false"
    width="392px"
    :before-close="handleClose"
  >
    <h2 class="u-title">
      <img class="icon" src="../../../assets/images/question_icon.png" />
      是否将该媒体或投放面恢复为可售卖状态？
    </h2>

    <div class="m-container">
      <div class="u-centent">
        确定后，<b>{{ resourceName }}</b> 媒体或某一投放面将恢复为可售卖状态
      </div>

      <h3 class="u-title">原不可售卖原因：</h3>
      <ul class="u-targetRadio">
        <li v-for="(item, index) in unSaleableReason" :key="index">
          {{ index + 1 }}.{{ item }}
        </li>
      </ul>

      <h3 class="u-title">请选择恢复可售卖目标：</h3>
      <el-radio-group
        v-model="targetRadio"
        class="u-targetRadio"
        @change="handleAslbChange"
      >
        <el-radio :label="1" class="u-radio">设备</el-radio>
        <el-radio
          :label="item.asID"
          v-for="item in mediaAdsStateAction"
          :key="item.asID"
          :disabled="item.asSaleState === 1"
          class="u-radio"
          >{{ item.asLab }}面
          <el-tooltip
            v-if="item.asSaleState === 1"
            effect="dark"
            content="此面当前为可售卖状态"
            placement="top"
          >
            <img
              class="quesition-icon"
              src="../../../assets/images/question_icon.png"
            /> </el-tooltip
        ></el-radio>
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
import sessFun from "../../../commonFun/sessFun.js";
import api from '../../../api/api';


export default {
  name: "vailableSellDialog",

  props: ['visible', 'resourceName', 'activeAsLab', 'mID', 'unSaleableReason', 'mTitle'],

  data () {
    return {
      targetRadio: 0,
      vailableResaon: '',
      mediaAdsStateAction: [],
      asLabName: ''
    }
  },

  mounted () {
    this.sessionData = sessFun.getSess()
    this.targetRadio = this.activeAsLab
    this.getMediaAdsStateAction()
  },

  methods: {
    handleClose () {
      this.$emit('update:visible', false)
    },

    // 获取媒体面
    getAslab (asID, mediaAdsStateAction) {
      const asLabName = mediaAdsStateAction.filter(item => {
        return item.asID === asID
      })[0]
      this.asLabName =  asLabName ? `${asLabName.asLab}面` : `设备`
    },

    handleConfirm () {
      const { asLabName, resourceName, mTitle } = this
      const text = `是否将 ${resourceName}-${mTitle}-${asLabName} 媒体状态改为可售卖?`
      this.$confirm(text, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'delete_media_confirm'
      }).then(() => {
        this.setMediaAdsSaleState().then(() => {
          this.$emit('handleConfirm')
          this.handleClose()
        })
      }).catch(() => {
        sessFun.messageFun('info', '已取消')
      })
    },

    setMediaAdsSaleState () {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        service: "CtrlMediaAdsSaleState",
        data: {
          mID: this.mID,
          asIDS: [this.targetRadio],
          asSaleState: 1, // 可售卖
          saleableRemark: [this.vailableResaon]
        }
      }

      // 如果对整个媒体设置进行设置，只传mID不用传asIDS
      if (this.targetRadio === 1) {
        delete params.data.asIDS
      }

      return new Promise((resolve, reject) => {
        api.postApi_new(this.apiVar.Media, params).then(res => {
          if (res.data.SysCode === 200200) {
            resolve()
          } else {
            sessFun.messageFun('warning', res.data.MSG);
          }
        })
      })

    },

    handleAslbChange (val) {
      this.getAslab(val, this.mediaAdsStateAction)
    },

    // 获取媒体的所有广告位的状态
    getMediaAdsStateAction () {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        service: "GetMediaAdsState",
        data: {
          mID: this.mID
        }
      }
     api.postApi_new(this.apiVar.Media, params).then(res => {
        if (res.data.SysCode === 200200) {
          this.mediaAdsStateAction = res.data.data;
          this.getAslab(this.activeAsLab, res.data.data)
        } else {
          sessFun.messageFun('warning', res.data.MSG);
        }
      })
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
  .icon {
    display: inline-block;
    margin-left: 17px;
    width: 21px;
    height: 21px;
    border-radius: 50%;
    vertical-align: middle;
    filter: drop-shadow(-19px 0 0 #fa8c16);
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

.quesition-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  vertical-align: middle;
  filter: brightness(0.75);
}

.u-radio {
  margin-bottom: 5px;
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