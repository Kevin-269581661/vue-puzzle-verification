<!-- 订单图片审核-弹框组件 -->
<template>
  <el-dialog
    width="400px"
    append-to-body
    show-close
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="afterClose"
  >
    <div slot="title" class="custom_dialog_header">
      <div class="title">{{ title }}</div>
    </div>

    <div v-loading="loading" class="dialog_content">
      <div class="custom_dialog_body">
        <TextAlert showIcon title="小范：检测到当前订单有疑似图片不一致的情况，请及时检查！" class="alert_box" />
        <div class="btn_group">
          <DownloadFileButton
            text="导出审核明细"
            type="primary"
            requestUrl="/addsp/api/v1/audit/exportMaterialCheckResult"
            :requestParams="formData"
            :requestApi="$request.getApi_file"
            :isJoinTimeToFileName="false"
            :showConfirm="false"
          />
          <el-button type="primary" size="small" :loading="auditLoading" @click="reAudit">重新审核</el-button>
        </div>
      </div>

      <div class="custom_dialog_footer">
        <el-button type="danger" plain size="small" @click="closeAndNotAgain">忽略，下次不再弹出</el-button>
        <el-button size="small" @click="close">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import sessFun from "@/commonFun/sessFun.js";
import DownloadFileButton from "@/components/common/components/downloadFileButton.vue"
import TextAlert from "@/components/common/components/TextAlert/index.vue"

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    // 审核类型（0-上画 1-下画 2-换画）
    type: null,
    apID: null
  }
}

export default {
  name: 'orderImgAuditDialog',
  components: {
    DownloadFileButton,
    TextAlert
  },
  emits: ['afterClose'],
  props: {},
  data() {
    return {
      visible: false,
      loading: false,
      auditLoading: false,
      formData: initFormData(),
    }
  },
  computed: {
    title() {
      const titleObj = {
        0: '上刊',
        1: '下刊',
        2: '换画'
      }
      return `${titleObj[this.formData.type]}-订单图片审核`
    }
  },
  methods: {
    /**
     * 订单图片重新审核
     */
    async reAudit() {
      try {
        this.auditLoading = true
        const res = await this.$request.getApi('/addsp/api/v1/audit/redoCheck', { ...this.formData })
        const { SysCode: code, MSG: message, data } = res.data
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.$message.success('重新审核成功')
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getDetail error:', err)
      } finally {
        this.auditLoading = false
      }
    },
    /**
     * 关闭下次不再弹出
     */
    async closeAndNotAgain() {
      try {
        this.auditLoading = true
        const res = await this.$request.getApi('/addsp/api/v1/audit/stopCheck', { ...this.formData })
        const { SysCode: code, MSG: message, data } = res.data
        if (code !== 200200) return this.$message.error(message || '操作失败')
        this.$message.success('操作成功')
        this.close()
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getDetail error:', err)
      } finally {
        this.auditLoading = false
      }
    },
    /**
     * 重置数据
     */
    afterClose() {
      this.auditLoading = false
      this.formData = initFormData()
      this.$emit('afterClose')
    },
    /**
     * 打开弹框
     */
    open(row) {
      if (this.visible) return
      this.visible = true
      if (row) {
        this.formData = {
          ...this.formData,
          ...row
        }
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

.custom_dialog_header {
  display: flex;
  align-items: center;
  .icon {
    font-size: 18px;
    color: #E6A23C;
    margin-right: 8px;
    line-height: 22px;
  }
}

.custom_dialog_footer{
  padding: 10px 20px 20px;
  /deep/ .el-button {
    padding: 0 12px;
  }
}

.alert_box {
  margin-bottom: 20px;
}

.btn_group {
  display: flex;
  align-items: center;
  justify-content: center;
  /deep/ .el-button {
    padding: 0 12px;
    & + .el-button {
      margin-left: 40px;
    }
  }
}

</style>
