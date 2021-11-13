<template>
  <el-dialog
    :visible="true"
    :show-close="false"
    width="392px"
    :before-close="handleClose"
  >
    <h2 class="u-title">
      <img class="icon" src="../../../assets/images/question_icon.png" />
      是否将该媒体或投放面设为不可售卖状态？
    </h2>

    <div class="m-container">
      <div class="u-centent">
        确定后，<b>{{ resourceName }}</b>
        媒体或某一投放面将不可被方案、订单选中售卖
      </div>

      <h3 class="u-title">请选择不可售卖目标：</h3>
      <el-radio-group
        v-model="targetRadio"
        class="u-targetRadio"
        @change="handleRadioChange"
      >
        <el-radio :label="1">设备</el-radio>
        <el-radio
          :label="item.asID"
          v-for="item in mediaAdsStateAction"
          :key="item.asID"
          :disabled="item.asSaleState === 2"
          >{{ item.asLab }}面
          <el-tooltip
            v-if="item.asSaleState === 2"
            effect="dark"
            content="此面当前为不可售卖状态"
            placement="top"
          >
            <img
              class="quesition-icon"
              src="../../../assets/images/question_icon.png"
            /> </el-tooltip
        ></el-radio>
      </el-radio-group>

      <h3 class="u-title">请选择不可售卖原因：</h3>
      <el-checkbox-group v-model="resaonList" @change="handleChange">
        <el-checkbox-button
          :label="item.reason"
          v-for="item in unvailableResaons"
          :key="item.id"
          >{{ item.reason }}</el-checkbox-button
        >
        <el-checkbox-button label="other">
          <i class="el-icon-edit"></i> 其他</el-checkbox-button
        >
      </el-checkbox-group>
      <el-input
        v-model="unvailableResaon"
        placeholder="请填写其他原因"
        class="u-unvailableResaon"
        v-if="resaonList.includes('other')"
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
  name: "unvailableSellDialog",

  props: ['visible', 'resourceName', 'activeAsLab', 'mID'],

  data () {
    return {
      resaonList: [],
      unvailableResaon: '',
      targetRadio: '',
      unvailableResaons: [],
      mediaAdsStateAction: [],

      sessionData: ''
    }
  },

  mounted () {
    this.sessionData = sessFun.getSess()
    this.targetRadio = this.activeAsLab
    this.getMediaAdsStateAction()
    this.getAdsUnSaleableReason()
  },

  methods: {
    handleChange (e) {
      console.log(e)
    },

    handleClose () {
      this.$emit('update:visible', false)
    },

    handleConfirm () {
      let { resaonList, unvailableResaon } = this
      if (!resaonList.length) {
        return sessFun.messageFun('warning', '请选择不可售卖原因')
      }

      if (resaonList.includes('other') && !unvailableResaon) {
        return sessFun.messageFun('warning', '请填写其它原因')
      }

      if (resaonList.includes('other')) {
        resaonList = resaonList.map(item => {
          if (item === 'other') {
            return unvailableResaon
          } else {
            return item
          }
        })
      }

      console.log(resaonList, 'resaonListresaonListresaonList')

      this.$confirm('点击确定后该媒体将不可被方案、订单选中售卖', '确定要设置该媒体不可售卖吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'delete_media_confirm'
      }).then(() => {
        this.handleClose()
      }).catch(() => {
        sessFun.messageFun('info', '已取消')
      })
    },

    handleRadioChange () {

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
        } else {
          sessFun.messageFun('warning', res.data.MSG);
        }
      })
    },


    // 获取预置的广告位不可售卖原因
    getAdsUnSaleableReason () {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        service: "GetAdsUnSaleableReasonConfig"
      }
      api.postApi_new(this.apiVar.Media, params).then(res => {
        console.log(res, 'ressssssss')
        if (res.data.SysCode === 200200) {
          this.unvailableResaons = res.data.data;
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

.u-targetRadio {
  margin-bottom: 24px;
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

/deep/ .el-checkbox-button {
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
  &.is-checked {
    border-color: #1890ff;
    background: none !important;
  }
  .el-checkbox-button__inner {
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
  &.is-checked .el-checkbox-button__inner {
    background: none !important;
    color: #1890ff !important;
    box-shadow: none;
  }
}

/deep/ .el-dialog__footer {
  padding-top: 0;
}
</style>