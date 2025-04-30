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
          <div v-if="formData.recordList.length" class="record_list">
            <div v-for="(item, i) in formData.recordList" class="record_item" :key="i">
              <div class="item_left">
                <el-tag v-if="item.status == -1" color="#909399" size="large">撤回</el-tag>
                <el-tag v-else-if="item.status == 0" color="#E6A23C" size="large">待审核</el-tag>
                <el-tag v-else-if="item.status == 1" color="#67C23A" size="large">通过</el-tag>
                <el-tag v-else-if="item.status == 2" color="#F56C6C" size="large">不通过</el-tag>
              </div>

              <div v-if="item.fileUrl" style="margin-top: -10px">
                <PreviewFileList :list="[item.fileUrl]" />
              </div>

              <div class="item_right">
                <div class="name">审核人：{{ item.auditUserName }}</div>
                <div class="time">{{ item.auditTime }}</div>
                <div class="desc">{{ item.comment }}</div>

                <!-- <div v-if="item.fileUrl" class="attachment">
                  <a-button type="link" @click="handlePreview(item)">
                    <a-icon type="paper-clip" />
                    查看附件
                  </a-button>
                </div> -->
              </div>
            </div>
          </div>
          <el-empty v-else />
        </div>
        <div class="custom_dialog_footer">
          <el-button size="small" @click="close">关 闭</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 图片、视频资源预览-弹框组件 -->
    <!-- <PreviewResourceDialog ref="previewResourceDialogRef" /> -->
  </div>
</template>

<script>
// import PreviewResourceDialog from '@/components/common/components/PreviewResourceDialog/index.vue'
import PreviewFileList from '@/components/common/components/PreviewFileList/index.vue'

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    apId: null,
    recordList: [
      // {
      //   id: 0,
      //   fileId: '',
      //   // 图片
      //   // fileUrl:
      //   //   'https://qadn-test-1256017579.cos.ap-guangzhou.myqcloud.com/crm/dsp/web/1724120279416_activity_98516c6b169a4cef88f4947cbab2698-copy.png',
      //   // 视频
      //   // fileUrl: 'https://qadn-test-1256017579.cos.ap-guangzhou.myqcloud.com/crm/dsp/web/1724161201483_ff2ace1c6608de9fe393dbf88ad6255b.mp4',
      //   // 音频
      //   fileUrl: 'https://qinlin-doorbell.oss-cn-zhangjiakou.aliyuncs.com/wav_0440ba3c199f4134983d62a682f2d99e.wav',
      //   // 其他
      //   // fileUrl: 'https://test-mall-video.oss-cn-zhangjiakou.aliyuncs.com/product_d997233b04a14460bebcc6bb7988b300',
      //   comment:
      //     '审核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核核通过',
      //   //  状态：-1:撤回, 0:待审核, 1:通过, 2:不通过
      //   status: 0,
      //   auditUserName: '张大幅',
      //   auditTime: '2025-03-05'
      // }
    ]
  }
}

export default {
  name: 'materialAuditRecordDialog',
  components: {
    // PreviewResourceDialog,
    PreviewFileList
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
    // handlePreview({ fileUrl = '' }) {
    //   this.$refs.previewResourceDialogRef &&
    //     this.$refs.previewResourceDialogRef.open([
    //       fileUrl,
    //       'https://qadn-test-1256017579.cos.ap-guangzhou.myqcloud.com/crm/dsp/web/1724161201483_ff2ace1c6608de9fe393dbf88ad6255b.mp4',
    //       'https://qinlin-doorbell.oss-cn-zhangjiakou.aliyuncs.com/wav_0440ba3c199f4134983d62a682f2d99e.wav',
    //       'https://test-mall-video.oss-cn-zhangjiakou.aliyuncs.com/product_d997233b04a14460bebcc6bb7988b300'
    //     ])
    // },

    /**
     * 查询素材审核记录（H5审核）
     */
     async listAuditRecords() {
      try {
        this.loading = true
        const res = await this.$api.voice.listAuditRecords({ apId: this.formData.apId })
        const { code, message, data } = res.data || {}
        if (code !== 200) return this.$message.error(message)
        this.formData.recordList = data || []
      } catch (err) {
        console.error('listAuditRecords error:', err)
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
        this.listAuditRecords()
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
  /deep/ .el-tag {
    color: #fff;
  }
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
