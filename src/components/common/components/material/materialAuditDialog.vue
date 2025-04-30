<!-- 素材审核-弹框组件 -->
<template>
  <el-dialog
    width="600px"
    append-to-body
    show-close
    title="素材审核"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="afterClose"
  >
    <div v-loading="loading" class="dialog_content">
      <div class="custom_dialog_body">
        <TextAlert showIcon title="提示：请将链接或二维码发送至管理员进行确认审核后可正常投放。" class="alert_box" />
        <div class="qrcode_box">
          <div id="file_audit_link_qrcode"></div>
        </div>
        <div class="action_box">
          <el-input
            v-model="formData.shareLink"
            placeholder=""
            readonly
            class="form_item_width"
          >
            <div slot="append">
              <el-button
                type="primary"
                size="small"
                :disabled="!formData.shareLink"
                @click="handleCopyLink">
                复制链接
              </el-button>
            </div>
          </el-input>
        </div>
      </div>
      <div class="custom_dialog_footer">
        <el-button size="small" @click="close">关 闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import sessFun from "@/commonFun/sessFun.js";
import TextAlert from '@/components/common/components/TextAlert/index.vue'
import { setClipboardData } from '@/utils/common'
import QRCode from 'qrcodejs2';

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    apId: null,
    shareLink: '',
  }
}

export default {
  name: 'materialAuditDialog',
  components: {
    TextAlert
  },
  emits: ['submitSuccess', 'afterClose'],
  props: {},
  data() {
    return {
      visible: false,
      loading: false,
      formData: initFormData(),
    }
  },
  methods: {
    /**
     * 获取H5审核分享链接
     */
     async getAuditShareLink() {
      try {
        const res = await this.$api.voice.getAuditShareLink({ apId: this.formData.apId })
        const { code, message, data } = res.data || {}
        if (code !== 200) return this.$message.error(message)
        this.formData.shareLink = data
        this.generateQRCode()
      } catch (err) {
        console.error('getAuditShareLink error:', err)
      }
    },

    /**
     * 生成二维码
     */
    generateQRCode() {
      this.$nextTick(() => {
        const { shareLink } = this.formData
        if (!shareLink) return
        // 清除之前的二维码
        const container = document.getElementById('file_audit_link_qrcode');
        container.innerHTML = '';
        // 生成二维码
        new QRCode(container, {
          text: shareLink,
          width: 200,
          height: 200,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
      })
    },

    /**
     * 复制链接
     */
     async handleCopyLink() {
      try {
        let text = ''
        const { shareLink } = this.formData
        text = `审核链接：${shareLink}`
        await setClipboardData(text)
        this.$message.success('已复制到剪切板')
      } catch (err) {
        this.$message.error('复制失败')
      }
    },

    /**
     * 重置数据
     */
    afterClose() {
      this.formData = initFormData()
      // 清除之前的二维码
      const container = document.getElementById('file_audit_link_qrcode');
      if (container) container.innerHTML = '';
      this.$emit('afterClose')
    },

    /**
     * 打开弹框
     */
    open(apId) {
      if (this.visible) return
      this.visible = true
      if (apId) {
        this.formData.apId = apId
        this.getAuditShareLink()
      }
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

.desc_text {
  font-size: 14px;
  color: #F56C6C;
  line-height: 20px;
}

.alert_box {
  margin-bottom: 20px;
}

.qrcode_box {
  width: 200px;
  height: 200px;
  background-color: #f0f2f5;
  margin: 0 auto 20px;
}
/deep/ .el-input-group__append .el-button.is-disabled {
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
  background-color: #FAFAFA;
  border-top: 1px solid rgba(0,0,0,0.15);
  border-bottom: 0;
  border-left: 0;
  border-right: 0;
}
/deep/ .el-input-group__append button.el-button {
  height: 40px;
  color: #fff;
  background-color: #1890FF;
  border-color: #1890FF;
  border: 1px solid #1890FF;
  border-radius: 0 4px 4px 0;
}
</style>
