<template>
  <div class="dialog_container">
    <!-- 上传图片/视频文件-弹框组件 -->
    <el-dialog
      :visible.sync="visible"
      :append-to-body="true"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="title"
      width="800px"
      @closed="afterClose"
    >
      <div v-loading="dialogLoading" class="dialog_content">
        <div class="custom_dialog_body">
          <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top" label-width="100px" size="small" class="form">

            <el-form-item label="图片：" prop="threeColorPictureList">
              <div class="picture_list_wrapper">
                <div
                  v-for="(item, i) in formData.threeColorPictureList"
                  :key="i"
                  class="picture_list_item"
                >
                  <img :src="item.url" alt="" class="img" />
                  <div class="hover_mask">
                    <i
                      v-if="canUpload"
                      class="el-icon-delete delete_icon"
                      @click="deletePictureItem(i)"
                    />
                    <i class="el-icon-zoom-in view_icon" @click="viewPicture(item)" />
                  </div>
                </div>
              </div>
              <!-- 上传图片按钮 -->
              <el-button v-if="canUpload" type="primary" class="upload_btn" icon="el-icon-upload2" @click="uploadPicture">
                上传图片
              </el-button>
            </el-form-item>

            <el-form-item v-if="isShowVideo" label="视频：" prop="videoUrl">
              <div v-if="formData.videoUrl" class="video_list_wrapper">
                <div class="video_list_item">
                  <video :src="formData.videoUrl" controls="controls"></video>
                </div>
              </div>
              <!-- 上传视频按钮 -->
              <el-button v-if="canUpload" type="primary" icon="el-icon-upload2" class="upload_btn" @click="uploadVideo">
                上传视频
              </el-button>
            </el-form-item>

            <el-form-item v-if="isShowColor" label="颜色：" prop="color">
              {{ formData.confirmExpand }}
            </el-form-item>

            <el-form-item v-if="isShowRejectExpand" label="拒绝原因：" prop="rejectExpand">
              <el-input
                v-if="isEditRejectExpand"
                v-model="formData.rejectExpand"
                type="textarea"
                :maxlength="1000"
                :rows="2"
                placeholder="请输入"
                clearable
              >
              </el-input>
              <div v-else>{{ rowData.rejectExpand }}</div>
            </el-form-item>

          </el-form>
        </div>
        <div class="custom_dialog_footer">
          <template v-if="showFooter">
            <el-button @click="close" size="small">取消</el-button>
            <el-button type="primary" @click="handleOk" size="small">确定</el-button>
          </template>
          <el-button v-else @click="close">关闭</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 上传文件-弹框组件 -->
    <UploadFileDialog
      :title="uploadFileData.title"
      :uploadUrl="uploadFileData.uploadUrl"
      :multiple="uploadFileData.multiple"
      :disabled="uploadFileData.disabled"
      :accept="uploadFileData.accept"
      name="file"
      ref="uploadFileDialogRef"
      @confirm="handleConfirmUpload"
    />

    <!-- 查看/编辑图片标签-弹框组件 -->
    <MarkPictureDialog ref="markPictureDialogRef" @confirm="confirmEdittMark" />
  </div>
</template>

<script>
import sessFun from "@/commonFun/sessFun.js";
import UploadFileDialog from './uploadFileDialog.vue'
import MarkPictureDialog from './markPictureDialog.vue'

const UploadTypeEnum = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO'
}

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    threeColorPictureList: [],
    videoUrl: '',
    rejectExpand: '',
    color: '',
    confirmExpand: ''
  }
}

const initUploadFileData = () => ({
  title: '',
  // uploadUrl: '/addsp/resource/upload',
  multiple: false,
  disabled: false,
  accept: ''
})

export default {
  name: 'uploadPictureVideoDialog',
  components:{ UploadFileDialog, MarkPictureDialog },
  emits: ['submitSuccess', 'afterClose'],
  props: {
    title: {
      type: String,
      default: '文件详情'
    },
    /**
     * 是否显示视频
     */
    isShowVideo: {
      type: Boolean,
      default: false
    },
    /**
     * 能否上传
     */
    canUpload: {
      type: Boolean,
      default: false
    },
    /**
     * 能否打标签
     */
    canMarkImage: {
      type: Boolean,
      default: false
    },
    /**
     * 是否显示拒绝原因
     */
    isShowRejectExpand: {
      type: Boolean,
      default: false
    },
    /**
     * 是否可编辑拒绝原因
     */
    isEditRejectExpand: {
      type: Boolean,
      default: false
    },
    /**
     * 是否显示选择颜色
     */
    isShowColor: {
      type: Boolean,
      default: false
    },
    /**
     * 是否可编辑颜色
     */
    canEditColor: {
      type: Boolean,
      default: false
    },
    showFooter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      dialogLoading: false,
      isEdit: false,
      formData: initFormData(),
      formRules: {
        threeColorPictureList: [{ required: true, message: '请上传图片', trigger: 'blur' }],
        videoUrl: [{ required: this.isShowVideo, message: '请上传视频', trigger: 'blur' }],
        rejectExpand: [{ required: this.isEditRejectExpand, message: '请输入拒绝原因', trigger: 'blur' }],

      },
      rowData: {
        fileList: [],
        processDetailId: null,
        // 状态:1.确认,2.待确认,3.拒绝(回到确认),4.已完成
        status: null,
        videoUrl: '',
        // status=3:拒绝原因
        rejectExpand: ''
      },
      UploadTypeEnum,
      uploadType: null,
      uploadFileData: initUploadFileData()
      // 预加载数据
      // preparedData: {
      //   colorOptions: []
      // }
    }
  },
  methods: {
    /**
     * 打开上传弹框
     */
    openUploadFileModal(title, accept, multiple) {
      this.uploadFileData = {
        ...initUploadFileData(),
        title: title || '上传文件',
        accept: accept || '',
        multiple: multiple || false
      }
      this.$refs.uploadFileDialogRef && this.$refs.uploadFileDialogRef.open()
    },
    /**
     * 上传确认
     */
    handleConfirmUpload(fileList) {
      console.log('handleConfirmUpload ===', fileList)
      if (this.uploadType === UploadTypeEnum.IMAGE) {
        this.formData.threeColorPictureList = [...this.formData.threeColorPictureList, ...fileList]
      } else {
        this.formData.videoUrl = fileList[0].url
      }
    },
    /**
     * 上传图片
     */
    uploadPicture() {
      this.uploadType = UploadTypeEnum.IMAGE
      this.openUploadFileModal('上传图片', '.jpeg,.jpg,.png', true)
    },
    /**
     * 上传视频
     */
    uploadVideo() {
      this.uploadType = UploadTypeEnum.VIDEO
      this.openUploadFileModal('上传视频', 'video/*')
    },
    /**
     * 删除已上传图片
     */
    deletePictureItem(index) {
      this.formData.threeColorPictureList.splice(index, 1)
    },
    /**
     * 查看/打标图片
     */
    viewPicture(item) {
      this.$refs.markPictureDialogRef && this.$refs.markPictureDialogRef.open(item, this.canMarkImage)
    },
    /**
     * 打标确认
     */
    confirmEdittMark({ fileId, markList }) {
      this.formData.threeColorPictureList.forEach((item) => {
        if (item.id === fileId) {
          // 打标字段为JSON 字符串
          item.expand = JSON.stringify(markList)
        }
      })
    },
    /**
     * 提交表单
     */
    async handleOk() {
      if (this.dialogLoading) return
      try {
        const isPass = await this.$refs['formRef'].validate()
        if (!isPass) return
      } catch (err) {
        return
      }
      try {
        this.dialogLoading = true
        const { threeColorPictureList, videoUrl, rejectExpand } = this.formData
        let res = null
        if (this.isEditRejectExpand) {
          // status 为 3，拒绝
          const expandList = this.formData.threeColorPictureList
            .map((item) => {
              return {
                fileId: item.id,
                expand: item.expand
              }
            })
            .filter((item) => item.expand)
          // await this.$api.resource.reject({
          //   processDetailId: rowData.processDetailId,
          //   rejectExpand,
          //   expandList
          // })
        } else {
          // status 为 1 ，确认上传
          res = await this.$api.resource.uploadNodeFiles({
            processDetailId: this.rowData.processDetailId,
            urls: threeColorPictureList,
            videoUrl
          })
        }
        const { SysCode: code, MSG: message, data } = res.data
        if (code !== 200200) return this.$message.error(message || '操作失败')
        this.$message.success('操作成功')
        this.$emit('submitSuccess')
        this.close()
      } catch (err) {
        this.$message.error(String(err) || '操作失败')
        console.error('onSubmit error:', err)
      } finally {
        this.dialogLoading = false
      }
    },
    /**
     * 重置数据
     */
    afterClose() {
      this.formData = initFormData()
      this.$refs['formRef'] && this.$refs['formRef'].clearValidate()
      this.$emit('afterClose')
    },
    /**
     * 打开弹框
     * （弹框打开时调用，一些弹框打开时的初始化处理可以在此方法内进行，譬如：通过 row.id 请求详情...）
     */
    open(row) {
      if (this.visible) return
      if (!row) return
      this.isEdit = true
      this.rowData = row
      // 回显
      this.formData.threeColorPictureList = row.fileList ? [...row.fileList] : []
      this.formData.videoUrl = row.videoUrl
      this.formData.rejectExpand = row.rejectExpand
      // this.formData.color = row.confirmExpand
      this.formData.confirmExpand = row.confirmExpand
      this.visible = true
    },
    /**
     * 关闭弹框
     * （可以处理一些收尾操作，如：清除定时器、事件监听等等）
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

/deep/ .el-button {
  padding-left: 8px;
  padding-right: 8px;
}

.custom_dialog_footer{
  padding: 10px 20px 20px;
}

.picture_list_wrapper {
  display: flex;
  flex-wrap: wrap;
  .picture_list_item {
    width: 100px;
    height: 100px;
    margin-right: 10px;
    margin-bottom: 10px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    padding: 5px;
    position: relative;
    &:hover .hover_mask {
      display: block;
    }
    .hover_mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      display: none;
      text-align: center;
      .view_icon {
        font-size: 26px;
        color: #fff;
        cursor: pointer;
        line-height: 100px;
      }
      .delete_icon {
        position: absolute;
        top: -10px;
        right: -10px;
        z-index: 20;
        font-size: 22px;
        color: #f56c6c;
        cursor: pointer;
      }
    }
    .img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}

.video_list_wrapper {
  display: flex;
  flex-wrap: wrap;
  .video_list_item {
    width: 300px;
    height: 200px;
    margin-right: 10px;
    margin-bottom: 10px;
    video {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}

.upload_btn {
  position: absolute;
  top: -44px;
  left: 85px;
  z-index: 10;
}
</style>
