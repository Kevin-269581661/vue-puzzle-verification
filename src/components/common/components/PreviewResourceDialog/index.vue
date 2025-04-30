<!-- 图片、视频资源预览-弹框组件 -->
<template>
  <el-dialog
    width="800px"
    append-to-body
    show-close
    custom-class="common-dialog-class"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="afterClose"
  >
    <div slot="title" class="posReletive common-line--before">
      <span class="marginLeft20 fontsize18bold">{{ title }}</span>
    </div>

    <div v-loading="loading" class="dialog_content">
      <div class="custom_dialog_body">
        <el-form
          ref="formRef"
          label-position="top"
          label-width="120px"
          size="small"
          class="form"
          :model="formData"
          :rules="formRules"
        >
          <el-form-item
            v-if="formData.imgUrlList && formData.imgUrlList.length"
            label="图片"
            prop="imgUrlList"
          >
            <div class="img_list">
              <div v-for="(url, i) in formData.imgUrlList" class="img_list_item" :key="i">
                <el-image style="width: 100%; height: 100%" fit="contain" :src="url">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <div class="hover_mask">
                  <el-tooltip effect="dark" content="查看" placement="top" :enterable="false">
                    <i class="el-icon-zoom-in icon" @click="previewImg(i)" />
                  </el-tooltip>
                  <el-tooltip effect="dark" content="下载" placement="top" :enterable="false">
                    <i class="el-icon-download icon" @click="downloadImg(url)"></i>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item v-if="formData.videoUrl" label="视频" prop="videoUrl">
            <div class="video_list_wrapper">
              <div class="video_list_item">
                <video :src="formData.videoUrl" controls="controls"></video>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="custom_dialog_footer">
        <el-button size="small" @click="close">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { downLoadFileByUrl } from '@/utils/downLoadUtil'

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    imgUrlList: [
      // 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
      // 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
      // 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg'
    ],
    // videoUrl: 'https://test-mall-video.oss-cn-zhangjiakou.aliyuncs.com/product_d997233b04a14460bebcc6bb7988b300'
    videoUrl: ''
  }
}

export default {
  name: 'PreviewResourceDialog',
  emits: ['submitSuccess', 'afterClose'],
  props: {
    title: {
      type: String,
      default: '附件'
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      isEdit: false,
      formData: initFormData(),
      formRules: {}
    }
  },
  methods: {
    previewImg(index) {
      this.$hevueImgPreview({
        // 开启多图预览模式
        multiple: true,
        // 多图预览，默认展示第x张图片
        nowImgIndex: index,
        // 需要预览的多图数组
        imgList: this.formData.imgUrlList
      })
    },

    async downloadImg(url) {
      try {
        await downLoadFileByUrl(url)
      } catch (error) {
        this.$message.error(String(error) || '下载失败')
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
     */
    open(imgUrlList, videoUrl) {
      if (this.visible) return
      this.visible = true
      this.formData.imgUrlList = imgUrlList
      this.formData.videoUrl = videoUrl
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

.custom_dialog_body {
  // padding: 20px;
}

.custom_dialog_footer{
  padding: 10px 20px 20px;
}

.img_list {
  display: flex;
  flex-wrap: wrap;
  .img_list_item {
    width: 220px;
    height: 220px;
    margin-right: 10px;
    margin-bottom: 10px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    padding: 5px;
    position: relative;
    &:hover .hover_mask {
      visibility: visible;
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
      display: flex;
      align-items: center;
      justify-content: center;
      visibility: hidden;
      .icon {
        font-size: 26px;
        color: #fff;
        cursor: pointer;
        & + .icon {
          margin-left: 20px;
        }
      }
    }
  }
}

.form >>> .el-form-item__label {
  height: 42px;
  background: #f5f6fa;
  padding: 0 20px;
  line-height: 42px;
  font-size: 16px;
  font-weight: 600;
  color: #2c313c;
  margin-bottom: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.video_list_wrapper {
  display: flex;
  flex-wrap: wrap;
  .video_list_item {
    width: 100%;
    height: 350px;
    margin-right: 10px;
    margin-bottom: 10px;
    video {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
