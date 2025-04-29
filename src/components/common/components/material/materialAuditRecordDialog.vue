<!-- 素材审核记录-弹框组件 -->
<template>
  <div class="dialog_container">
    <el-dialog
      width="800px"
      append-to-body
      show-close
      title="素材审核记录"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @closed="afterClose"
    >

      <div v-loading="loading" class="dialog_content">
        <div class="custom_dialog_body">
          <div class="record_list">
            <div v-for="(item, i) in formData.logs" class="record_item" :key="i">
              <div class="item_left">
                <el-tag style="color: #409eff">{{ item.handleStatusDesc }}</el-tag>
              </div>
              <div class="item_right">
                <div class="name">{{ item.userName }}</div>
                <div class="time">{{ item.createTime }}</div>
                <div class="desc">{{ item.comment }}</div>
                <div
                  v-if="(item.picUrls && item.picUrls.length) || item.videoUrl"
                  class="attachment"
                >
                  <i class="el-icon-paperclip icon"></i>
                  <el-link type="primary" @click="viewLogImg(item)">查看附件</el-link>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="custom_dialog_footer">
          <el-button size="small" @click="close">关 闭</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 图片、视频资源预览-弹框组件 -->
    <PreviewResourceDialog ref="previewResourceDialogRef" />
  </div>
</template>

<script>
import PreviewResourceDialog from '@/components/common/components/PreviewResourceDialog/index.vue'

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    apId: null,
    logs: [
      {
        handleStatusDesc: '审核通过',
        userName: '张三',
        createTime: '2023-01-01 00:00:00',
        comment: '审核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核通过',
        picUrls: [
          'https://qadn-test-1256017579.cos.ap-guangzhou.myqcloud.com/crm/dsp/web/1724120279416_activity_98516c6b169a4cef88f4947cbab2698-copy.png',
        ],
        videoUrl: 'https://test-mall-video.oss-cn-zhangjiakou.aliyuncs.com/product_d997233b04a14460bebcc6bb7988b300'
      },
      {
        handleStatusDesc: '审核通过',
        userName: '张三',
        createTime: '2023-01-01 00:00:00',
        comment: '审核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核通过',
        picUrls: [
          'https://qadn-test-1256017579.cos.ap-guangzhou.myqcloud.com/crm/dsp/web/1724120279416_activity_98516c6b169a4cef88f4947cbab2698-copy.png',
        ],
        videoUrl: ''
      }
    ]
  }
}

export default {
  name: 'materialAuditRecordDialog',
  components: {
    PreviewResourceDialog
  },
  emits: ['submitSuccess', 'afterClose'],
  props: {},
  data() {
    return {
      visible: false,
      loading: false,
      isEdit: false,
      formData: initFormData(),
    }
  },

  methods: {
    viewLogImg({ picUrls = [], videoUrl = '' }) {
      this.$refs.previewResourceDialogRef &&
        this.$refs.previewResourceDialogRef.open(picUrls, videoUrl)
    },

    /**
     * 获取详情
     */
    async getDetail() {
      try {
        this.loading = true
        const res = await this.$api.voice.listAuditRecords({ apId: this.formData.apId })
        const { SysCode: code, MSG: message, data  } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取音频审核记录失败')
        this.formData.logs = data || []
      } catch (err) {
        console.error('getDetail error:', err)
      } finally {
        this.loading = false
      }
    },

    /**
     * 重置数据
     */
    afterClose() {
      this.isEdit = false
      this.formData = initFormData()
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
        this.getDetail()
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

>>> .el-dialog__body {
  padding: 0;
}

// .custom_dialog_body {
//   padding: 40px 20px 20px;
// }

.custom_dialog_footer{
  padding: 10px 20px 20px;
}

.record_list {
  .record_item {
    display: flex;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .item_right {
    flex: 1;
    overflow: hidden;
    margin-left: 20px;
    .name {
      font-size: 16px;
      font-weight: 600;
      line-height: 32px;
    }
    .time {
      font-size: 14px;
      color: #999;
      line-height: 24px;
    }
    .desc {
      margin-top: 10px;
      font-size: 14px;
      color: #333;
      line-height: 22px;
    }
    .attachment {
      margin-top: 10px;
      .icon {
        color: #409EFF;
      }
    }
    .report_info {
      margin-top: 10px;
      .title {
        font-size: 14px;
        font-weight: 600;
        line-height: 24px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
