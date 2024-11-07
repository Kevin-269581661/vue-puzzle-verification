<!-- 监播列表-导入门店-弹框组件 -->
<template>
  <div>
    <el-dialog
      width="600px"
      append-to-body
      show-close
      title="导入新增门店"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @closed="afterClose"
    >
      <div v-loading="loading" class="dialog_content">
        <div class="custom_dialog_body">
          <el-form ref="formRef" class="form" label-width="100px" size="small"  :model="formData" :rules="formRules">

            <el-form-item label="选择文件：" >
              <el-button
                type="primary"
                icon="el-icon-download"
                style="margin-bottom: 20px"
                @click="downloadTemplate"
              >
                下载导入模板
              </el-button>

              <div class="item_box">
                <FileUpload
                  ref="uploaderRef"
                  drag
                  showFileList
                  listType="text-plain"
                  accept=".xls,.xlsx"
                  :showTip="false"
                  :maxSize="10"
                  :uploadApi="$api.detecting.importShops"
                  :uploadParams="formData"
                  :handleUploadRes="handleUploadRes"
                  @success="uploadSuccess"
                />
                <TextAlert v-if="isUploadFinish" showIcon class="alert_box">
                  <div v-if="failList.length">
                    成功处理 <span class="blue_text">{{ successSize }}</span> 条数据，失败 <span class="red_text">{{ failList.length }}</span> 条，<a href="javaScript:;" class="nav-text" @click="openFailResultDialog">查看失败列表明细</a>
                  </div>
                  <div v-else>成功处理 <span class="blue_text">{{ successSize }}</span> 条数据</div>
                </TextAlert>
                <div class="desc">注：上传中请勿关闭弹窗，否则上传将被取消！</div>
              </div>
            </el-form-item>

          </el-form>
        </div>
        <div class="custom_dialog_footer">
          <el-button size="small" @click="close">关 闭</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 失败结果弹框 -->
    <FailListDialog ref="failListDialogRef" showHeader />
  </div>
</template>

<script>
import FileUpload from '@/components/common/components/FileUpload/index.vue'
import FailListDialog from '@/components/common/components/failListDialog/index.vue'
import TextAlert from "@/components/common/components/TextAlert/index.vue"
import { downLoadFileByUrl } from '@/utils/downLoadUtil'

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    itemId: null,
  }
}

export default {
  name: 'importShopDialog',
  components: { FileUpload, FailListDialog, TextAlert },
  emits: ['submitSuccess', 'afterClose'],
  props: {},
  data() {
    return {
      visible: false,
      loading: false,
      isEdit: false,
      formData: initFormData(),
      formRules: {},
      // 失败列表明细
      failList: [],
      // 成功数
      successSize: 0,
      isUploadFinish: false
    }
  },

  methods: {
    /**
     * 下载模板
     */
     downloadTemplate() {
      const url = this.apiVar.qadnUrl + '/importTemplate/导入新增门店模板.xlsx'
      downLoadFileByUrl(url)
    },

    handleUploadRes(res) {
      const { SysCode: code, MSG: message, data } = res.data || {}
      if (code !== 200200) throw new Error(message || '上传失败 code != 200')
      this.failList = data.failList || []
      this.successSize = data.successCnt || 0
      return ''
    },

    uploadSuccess() {
      this.isUploadFinish = true
      if (this.failList.length) {
        this.$refs.uploaderRef && this.$refs.uploaderRef.reset()
        this.openFailResultDialog()
        return
      }
      this.$emit('submitSuccess')
    },

    /**
     * 打开处理结果弹窗
     */
     openFailResultDialog() {
      if (!this.failList.length) return
      const successSize = this.successSize
      const list = this.failList
      const columns = [
        {
          title: '媒体位ID',
          dataIndex: 'assetTag',
        },
        {
          title: '投放面',
          dataIndex: 'asLab',
        },
        {
          title: '投放排期',
          dataIndex: 'time',
        },
        {
          title: '错误原因',
          dataIndex: 'reason',
        }
      ]
      this.$refs.failListDialogRef && this.$refs.failListDialogRef.open({ list, columns, successSize })
    },

    /**
     * 重置数据
     */
    afterClose() {
      this.isEdit = false
      this.formData = initFormData()
      this.failList = []
      this.successSize = 0
      this.isUploadFinish = false
      this.$refs['formRef'] && this.$refs['formRef'].clearValidate()
      this.$refs.uploaderRef && this.$refs.uploaderRef.reset()
      this.$emit('afterClose')
    },

    /**
     * 打开弹框
     */
    open(itemId) {
      if (!itemId) return
      if (this.visible) return
      this.visible = true
      this.formData.itemId = itemId
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

.item_box {
  background: #fafafa;
  padding: 10px;
  border-radius: 4px;
  padding-left: 15px;
}

.desc {
  color: #F56C6C;
  color: 14px;
  line-height: 22px;
  margin-top: 8px;
}

.nav-text {
  color: #4aa6fc;
}

.alert_box {
  margin-top: 10px;
}

.blue_text {
  color: #1890FF;
  font-weight: 600;
}

.red_text {
  color: #F56C6C;
  font-weight: 600;
}

</style>
