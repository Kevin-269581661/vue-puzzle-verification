<!-- 通用文件上传组件（支持单个或多个） -->
<template>
  <el-upload
    ref="uploadRef"
    class="uploader"
    :class="{ disabled: disabled }"
    :action="uploadUrl"
    :headers="headers"
    :drag="drag"
    :show-file-list="showFileList"
    :list-type="listType"
    :file-list="fileList"
    :http-request="useOss || uploadApi ? handleRequest : undefined"
    :accept="accept"
    :name="name"
    :multiple="false"
    :disabled="disabled"
    :limit="maxCount"
    v-bind="$attrs"
    :before-upload="handleUploadBefore"
    :on-exceed="handleUploadExceed"
    :on-remove="handleUploadRemove"
    :on-change="handleUploadChange"
    :on-success="handleUploadSuccess"
    :on-error="handleUploadError"
    :on-preview="handleUploadPreview"
  >

    <div v-if="listType === 'picture-card'" slot="file" slot-scope="{ file }">
      <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
      <span class="el-upload-list__item-actions">
        <span class="el-upload-list__item-preview" @click="previewImg(file)">
          <i class="el-icon-zoom-in"></i>
        </span>
        <span v-if="!disabled" class="el-upload-list__item-delete" @click="downloadImg(file)">
          <i class="el-icon-download"></i>
        </span>
        <span v-if="!disabled" class="el-upload-list__item-delete" @click="removeImg(file)">
          <i class="el-icon-delete"></i>
        </span>
      </span>
    </div>

    <div v-if="listType === 'text-plain'" slot="file" slot-scope="{ file }">
      <div class="custom_file_list_item">
        <span class="text">{{ file.name }}</span>
        <span v-if="file.status === 'uploading'" class="loading_text">上传中</span>
        <i class="el-icon-close icon" @click="removeImg(file)"></i>
      </div>
    </div>

    <!-- 默认插槽 -->
    <slot>
      <!-- 方形样式-多张图片 -->
      <div v-if="listType === 'picture-card'">
        <i class="el-icon-plus"></i>
      </div>

      <!-- 拖拽样式 -->
      <div v-else-if="drag" v-loading="loading" element-loading-text="上传中" class="drag_box">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </div>

      <!-- 方形样式-单张图片 -->
      <div
        v-else-if="uploaderType === 'img'"
        v-loading="loading"
        element-loading-text="上传中"
        class="square_img_box"
      >
        <div v-if="value" class="img_box" @click.stop="">
          <el-image style="width: 100%; height: 100%" fit="contain" :src="value">
            <div slot="error" class="image_slot">
              <i class="el-icon-picture-outline icon"></i>
            </div>
          </el-image>
          <div class="action_mask">
            <el-tooltip effect="dark" content="查看" placement="top" :enterable="false">
              <i class="el-icon-zoom-in icon" @click="previewImg(fileList[0])"></i>
            </el-tooltip>
            <el-tooltip
              v-if="!disabled"
              effect="dark"
              content="下载"
              placement="top"
              :enterable="false"
            >
              <i class="el-icon-download icon" @click="downloadImg(fileList[0])"></i>
            </el-tooltip>
            <el-tooltip
              v-if="!disabled"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <i class="el-icon-delete icon" @click="removeImg(fileList[0])"></i>
            </el-tooltip>
          </div>
        </div>
        <i v-else class="el-icon-plus add_icon"></i>
      </div>

      <!-- 按钮样式 -->
      <el-button
        v-else-if="uploaderType === 'button'"
        size="small"
        :loading="loading"
        :disabled="disabled"
      >
        {{ loading ? '上传中' : '点击上传' }}
      </el-button>
    </slot>

    <!-- 提示信息 -->
    <slot name="tip">
      <template v-if="showTip" slot="tip">
        <div class="el-upload__tip">请上传{{ accept }}文件，且不超过{{ maxSize }}MB</div>
      </template>
    </slot>
  </el-upload>
</template>

<script>
import { downLoadFileByUrl } from '@/utils/downLoadUtil'
import { getUniqueId } from '@/utils/common'
import sessFun from "@/commonFun/sessFun.js";
import CosUploader from '@/utils/cos-js-sdk-v5-util'

export default {
  name: 'FileUpload',
  emits: ['change', 'success', 'error', 'preview'],
  props: {
    //  v-model 绑定的图片 url，会根据绑定的数据类型自动判断赋值相同类型的值
    //  如果是数组，则上传多张图片，数组元素为图片的 url
    value: {
      type: [String, Array],
      default: ''
    },
    // 是否开启 OSS 上传，优先级最高！（默认不开启）
    useOss: {
      type: Boolean,
      default: false
    },
    // 上传方法（传了这个，uploadUrl 则不需要传！ ）
    uploadApi: {
      type: Function
    },
    // 请求路径
    uploadUrl: {
      type: String,
      default: `${process.env.API_ROOT}addsp/upload`
    },
    // 请求参数
    uploadParams: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 处理上传之后接口返回的数据
    handleUploadRes: {
      type: Function
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 接受上传的文件类型：  audio/*, video/*, image/*
    // '.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.jpeg,.jpg,.png'
    accept: {
      type: String,
      default: ''
    },
    // 发到后台的文件参数名
    name: {
      type: String,
      default: 'file'
    },
    maxCount: {
      type: Number,
      default: 1
    },
    // 文件大小限制（MB）
    maxSize: {
      type: Number,
      default: 5
    },
    // 是否可拖拽上传
    drag: {
      type: Boolean,
      default: false
    },
    // 是否显示提示信息
    showTip: {
      type: Boolean,
      default: true
    },
    // 上传组件类型
    uploaderType: {
      type: String,
      validator: val => ['img', 'button'].includes(val),
      default: 'img'
    },
    listType: {
      type: String,
      validator: val => ['text', 'picture', 'picture-card', 'text-plain'].includes(val),
      default: 'text'
    },
    // 是否自定义预览（若是，会触发绑定事件 preview）
    isCustomPreview: {
      type: Boolean,
      default: false
    },
    // 是否显示文件列表
    showFileList: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    const headers = {}
    try {
      const { token = '', uID: uid = '' } = sessFun.getSess() || {}
      headers.token = token
      headers.uid = uid
    } catch (err) {
      console.error('data error: ', err)
    }
    return {
      headers,
      loading: false,
      uploadProgress: 0,
      loadingTip: '上传中（0%）',
      fileList: [],
      cosUploader: null,
    }
  },
  watch: {
    value: {
      handler(newVal) {
        console.log('watch value ===', newVal)
        if (newVal) {
          if (Array.isArray(newVal)) {
            this.fileList = this.toFileList(newVal)
          } else if (typeof newVal === 'string') {
            this.fileList = this.toFileList(newVal.split(','))
          } else {
            throw new Error('v-model 绑定的数据必须是【数组】或【字符串】类型')
          }
        } else {
          this.fileList = []
        }
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 退出登录，返回登录页
     */
    logout() {
      // this.setGlobalState && this.setGlobalState({ isLogin: false })
      // if (!window.__POWERED_BY_QIANKUN__) this.$router.push('/')
    },

    /**
     * 自定义上传请求
     */
    async handleRequest(params) {
      // console.log('handleRequest params ===', params)
      try {
        const formData = new FormData()
        formData.append(this.name, params.file)
        Object.keys(this.uploadParams).forEach(key => {
          formData.append(key, this.uploadParams[key])
        })
        this.loading = true
        this.uploadProgress = 0
        let res = null
        if (this.useOss) {
          this.cosUploader = CosUploader.create()
          res = await this.cosUploader.uploadFile({
            file: params.file,
            onProgress: (percent) => {
              this.uploadProgress = percent * 100
              // params.onProgress(percent)
            }
          })
        } else if (this.uploadApi && typeof this.uploadApi === 'function') {
          res = await this.uploadApi(formData)
        } else {
          throw new Error('上传接口未配置')
        }
        params.onSuccess(res, params.file)
      } catch (err) {
        console.error('handleRequest error:', err)
        params.onError(err, params.file)
      } finally {
        this.loading = false
      }
    },

    /**
     * 文件超出个数限制时的钩子
     */
    handleUploadExceed() {
      this.$message.warning(`文件超出个数限制`)
    },

    /**
     * 上传文件之前的钩子
     */
    handleUploadBefore(file) {
      // 文件大小校验
      if (file.size > this.maxSize * 1024 * 1024) {
        // fileList.pop()
        this.$message.warning(`请上传大小小于${this.maxSize}MB的文件`)
        return false
      }
      this.loading = true
      return true
    },

    /**
     * 点击移除文件时的回调
     */
    handleUploadRemove(file, fileList) {
      // console.log('handleUploadRemove ===', file, fileList)
      this.fileList = fileList
      this.$emit('change', this.getModelValue(this.fileList))
    },

    handleUploadChange() {},

    /**
     * 文件上传成功时的钩子
     */
    handleUploadSuccess(res, fileInfo) {
      console.log('handleUploadSuccess ===', res, fileInfo)
      this.loading = false
      try {
        // 返回结果是数组
        let url = ''
        if (this.handleUploadRes && typeof this.handleUploadRes === 'function') {
          url = this.handleUploadRes(res)
        } else if (this.useOss) {
          if (res.statusCode !== 200) {
            throw new Error('文件上传失败')
          }
          url = `https://${res.Location}`
        } else {
          if (res.code !== 200) {
            throw new Error('文件上传失败: ' + res.message)
          }
          url = res.data
        }
        const { name, size, type: mime, uid: key } = fileInfo.raw
        this.fileList.push({ name, size, mime, key, url })
        this.$message.success(`《${fileInfo.name}》上传完毕`)
        this.$emit('change', this.getModelValue(this.fileList))
        this.$emit('success', this.fileList)
      } catch (err) {
        console.error('handleUpload error: ', err)
        this.$message.error('上传失败: ' + err)
        this.$emit('error')
      }
    },

    /**
     * 文件上传失败时的钩子
     */
    handleUploadError(err) {
      this.loading = false
      this.$message.error('上传失败')
      this.$emit('error', err)
    },

    getModelValue(list) {
      const urlList = this.toUrlList(list)
      if (Array.isArray(this.value)) {
        return urlList
      } else {
        return urlList.join(',')
      }
    },

    handleUploadPreview(file) {
      if (this.isCustomPreview) {
        this.$emit('preview', file.url)
        return
      }
      this.$hevueImgPreview(file.url)
    },

    /**
     * 移除单张已上传的图片
     */
    removeImg(file) {
      this.fileList = this.fileList.filter(item => item.key !== file.key)
      this.$emit('change', this.getModelValue(this.fileList))
    },

    previewImg(file) {
      if (this.isCustomPreview) {
        this.$emit('preview', file.url)
        return
      }
      this.$hevueImgPreview(file.url)
    },

    async downloadImg(file) {
      try {
        await downLoadFileByUrl(file.url)
      } catch (error) {
        this.$message.error(String(error) || '下载失败')
      }
    },

    /**
     * 重置数据
     */
    reset() {
      this.loading = false
      this.fileList = []
      this.uploadProgress = 0
      try {
        this.$refs.uploadRef && this.$refs.uploadRef.abort()
        this.$refs.uploadRef && this.$refs.uploadRef.clearFiles()
      } catch (err) {
        console.log('reset error: ', err)
      }
    },

    /**
     * 获取文件名
     */
    getNameByUrl(url) {
      return url.split('/').pop()
    },

    /**
     * 处理上传后的文件列表, 处理成 urlList
     */
    toUrlList(list) {
      let newList = []
      list.forEach(item => {
        let url = ''
        if (item.url) url = item.url
        newList.push(url)
      })
      return newList
    },

    toFileList(list) {
      return list.map(item => {
        return {
          key: getUniqueId(),
          name: this.getNameByUrl(item),
          url: item
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped="scoped">
.uploader {
  /deep/ .el-loading-mask {
    min-width: 0 !important;
  }

  /deep/ .el-upload-dragger {
    padding: 0;
    height: 180px;
  }

  /deep/ .el-upload--picture-card {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  /deep/ .el-button:focus, .el-button:hover {
    color: #3367d6;
    border-color: rgb(51,103,214);
    background-color: rgba(51,103,214, 0.1);
  }

  /deep/ .el-upload-list__item.is-success .el-upload-list__item-name:focus,
  /deep/ .el-upload-list__item.is-success .el-upload-list__item-name:hover{
    color: #409EFF;
  }

  /deep/ .el-upload-list__item {
    transition: none;
  }

  &.disabled {
    .square_img_box {
      border-color: rgba(0, 0, 0, 0.15);
      cursor: not-allowed;
      &:hover {
        border-color: #d9d9d9;
      }
    }
    .add_icon {
      background-color: #f5f5f5;
    }
  }

  .square_img_box {
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409eff;
      .img_box .action_mask {
        // display: block;
        visibility: visible;
      }
    }
    .add_icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .img_box {
      width: 178px;
      height: 178px;
      position: relative;
      .action_mask {
        background-color: rgba(0, 0, 0, 0.3);
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: default;
        // display: none;
        visibility: hidden;
        .icon {
          font-size: 22px;
          color: #fff;
          cursor: pointer;
          & + .icon {
            margin-left: 24px;
          }
        }
      }
    }
  }

  /deep/ .el-image .image_slot {
    width: 100%;
    height: 100%;
    color: #f1f1f1;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      font-size: 48px;
    }
  }
}

.custom_file_list_item {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  .text {
    max-width: calc(100% - 80px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .loading_text {
    font-size: 12px;
    color: #E6A23C;
    line-height: 25px;
    margin-left: 5px;
  }
}
</style>
