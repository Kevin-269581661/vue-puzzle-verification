<!-- 检测绑定微信登录-弹框组件 -->
<template>
  <el-dialog
    width="600px"
    append-to-body
    show-close
    title="绑定微信登录"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="afterClose"
  >
    <div v-loading="loading" class="dialog_content">
      <div class="custom_dialog_body">
        <div class="desc">系统检测到您的手机号码尚未绑定微信登录，扫一扫即可绑定哦~</div>
        <div
          v-loading="!isGetWxLoginCode"
          element-loading-text="正在获取二维码..."
          element-loading-background="transparent"
          class="wx_code_wrapper"
        >
          <div id="wx_bind_qrcode" class="wx_bind_qrcode"></div>
        </div>
        <div class="check_disappeared_box">
          <el-checkbox v-model="isCheckDisappeared">{{ disappearedDays }}天内不再提示</el-checkbox>
        </div>
      </div>
      <div class="custom_dialog_footer">
        <el-button size="small" @click="close">关 闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import settings from '@/settings'

export default {
  name: 'checkBindWxDialog',
  emits: ['afterClose'],
  props: {},
  data() {
    return {
      visible: false,
      loading: false,
      // 是否获取到微信扫码登录的二维码
      isGetWxLoginCode: false,
      // 是否勾选不再提示
      isCheckDisappeared: false,
      // 不再提示的天数
      disappearedDays: '--',
      // 是否成功绑定，用来判断是否调用设置不再提醒
      isSuccessBind: false,
      wxLoginState: null
    }
  },
  methods: {
    /**
     * 检测是否打开绑定微信登录弹框
     */
    async checkIsOpenCheckBindWxDialog() {
      try {
        const res = await this.$api.UCAPI.wxBindRemind({ uType: 1 })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message)
        if (data) this.open()
      } catch (err) {
        this.$message.error(String(err))
        console.error('checkIsOpenCheckBindWxDialog error:', err)
      }
    },

    /**
     * 设置不再提示
     */
    async setDisappeared() {
      try {
        const res = await this.$api.UCAPI.wxBindRemind({ uType: 2 })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200 || !data) return this.$message.error(message)
        this.$message.success(`成功设置${this.disappearedDays}天内不再提示`)
      } catch (err) {
        this.$message.error(String(err))
        console.error('setDisappeared error:', err)
      }
    },

    /**
     * 获取天数
     */
     async getDisappearedDays() {
      try {
        const res = await this.$api.UCAPI.wxBindRemind({ uType: 3 })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200 || !data) return this.$message.error(message)
        this.disappearedDays = data
      } catch (err) {
        this.$message.error(String(err))
        console.error('getDisappearedDays error:', err)
      }
    },

    /**
     * 微信扫码登录-初始化二维码
     */
    initWxLogin() {
      this.$nextTick(() => {
        this.wxLoginState = Math.ceil(Math.random() * 1000)
        var obj = new WxLogin({
          self_redirect: true,
          id: "wx_bind_qrcode",
          appid: settings.wxScanLoginConfig.appId,
          scope: "snsapi_login",
          redirect_uri: settings.wxScanLoginConfig.redirectUri,
          state: this.wxLoginState,
          style: 'black',
          // 切换二维码登录样式，值为1时二维码登录将切换到新样式。
          // stylelite: 1,
          href: 'data:text/css;base64,aWZyYW1le2Rpc3BsYXk6IGJsb2NrO21hcmdpbjogMCBhdXRvOyB3aWR0aDogMjI4cHg7fQouaW1wb3dlckJveCAudGl0bGV7ZGlzcGxheTogbm9uZTt9ICAgICAKLmltcG93ZXJCb3ggLmluZm97d2lkdGg6IDIyOHB4O30gICAgICAKLmltcG93ZXJCb3ggLnFyY29kZSB7CiAgICBkaXNwbGF5OiBibG9jazsKICAgIHdpZHRoOiAxNzhweDsKICAgIG1hcmdpbjogMzFweCBhdXRvIDA7CiAgICBib3JkZXI6IDFweCBzb2xpZCAjZTJlMmUyOwp9Ci5pbXBvd2VyQm94IC5zdGF0dXMgewogICAgcGFkZGluZzogN3B4IDA7Cn0KLmltcG93ZXJCb3ggLnN0YXR1cyBwOm50aC1vZi10eXBlKDIpIHsKICAgIGRpc3BsYXk6IG5vbmU7Cn0=',
          onReady: (isReady) => {
            this.isGetWxLoginCode = isReady
            console.log('isReady ===', isReady)
          }
        });
      })
    },

     /**
     * 用户扫码绑定微信
     */
    wxQrCodeBind(wxCode) {
      console.log('wxQrCodeBind wxCode ===', wxCode)
      this.loading = true
      this.$api.UCAPI.wxQrCodeBind({ code: wxCode })
        .then(res => {
          const { SysCode: code, MSG: message, data } = res.data || {}
          if (code !== 200200) return this.$message.error(message || '操作失败')
          this.$message.success('绑定成功')
          this.isSuccessBind = true
          this.close()
        })
        .catch(err => {
          this.$message.error(String(err) || '操作失败')
          console.error('wxQrCodeBind error:', err)
        })
        .finally(() => {
          this.loading = false
        })
    },

    /**
     * 微信扫码登录-接收微信码数据
     */
    wxLoginIframeEvent(event) {
      if (event.origin !== settings.wxScanLoginConfig.redirectOrigin) return;
      if (Number(event.data.state) !== this.wxLoginState) return
      console.log('弹窗收到子消息 ====', event);
      if (event.data && event.data.code) this.wxQrCodeBind(event.data.code)
      else this.$message.error('操作失败，请重试~')
    },

    /**
     * 重置数据
     */
    afterClose() {
      this.loading = false
      this.isGetWxLoginCode = false
      this.$emit('afterClose')
      // 清除监听事件
      window.removeEventListener('message', this.wxLoginIframeEvent)
      // 如果勾选不再弹窗
      if (this.isCheckDisappeared && !this.isSuccessBind) this.setDisappeared()
    },

    /**
     * 打开弹框
     */
    open() {
      if (this.visible) return
      this.visible = true
      this.initWxLogin()
      // 父页面接收 iframe 的回复
      window.addEventListener('message', this.wxLoginIframeEvent)
      this.getDisappearedDays()
    },

    /**
     * 关闭弹框
     */
    close() {
      if (!this.visible) return
      this.visible = false
    },
  },

  mounted() {
    console.log('checkBindWxDialog mounted ================')
    this.checkIsOpenCheckBindWxDialog()
  },

  beforeDestroy() {
    // 清除监听事件
    window.removeEventListener('message', this.wxLoginIframeEvent)
  },
}
</script>

<style lang="scss" scoped="scoped">

/deep/ .el-dialog__body {
  padding: 0;
}

.custom_dialog_footer{
  padding: 10px 20px 20px;
}

.wx_code_wrapper {
  height: 262px;
  width: 296px;
  margin: 0 auto;
  /deep/ .el-loading-spinner {
    .el-loading-text {
      color: #999;
    }
    .path {
      stroke: #999;
    }
  }
}

.desc {
  font-size: 16px;
  text-align: center;
  color: #F56C6C;
}

.check_disappeared_box {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>

<style>
.wx_bind_qrcode  iframe {
  height: 262px;
  width: 296px;
  border: none;
  outline: none;
  display: block;
  margin: 0 auto;
}
</style>
