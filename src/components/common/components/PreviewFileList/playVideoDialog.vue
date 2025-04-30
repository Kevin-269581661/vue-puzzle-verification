<!-- 视频播放预览-弹框组件 -->
<template>
  <el-dialog
    width="850px"
    top="5vh"
    append-to-body
    show-close
    :title="title"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="afterClose"
  >
    <div v-loading="loading" class="dialog_content">
      <div class="custom_dialog_body">
        <video
          v-if="videoUrl"
          ref="videoRef"
          class="video"
          controls
          preload="metadata"
          :src="videoUrl"
          @error="onError"
        />
      </div>
      <div class="custom_dialog_footer">
        <el-button size="small" @click="close">关 闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'playVideoDialog',
  emits: ['afterClose'],
  props: {
    autoplay: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '视频播放'
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      videoUrl: ''
    }
  },

  methods: {
    /**
     * 播放视频
     */
    play() {
      if (this.videoUrl) {
        this.$refs.videoRef && this.$refs.videoRef.play()
      } else {
        throw new Error('play error: videoUrl is empty')
      }
    },

    /**
     * 暂停视频
     */
    pause() {
      if (this.videoUrl) {
        this.$refs.videoRef && this.$refs.videoRef.pause()
      } else {
        throw new Error('pause error: videoUrl is empty')
      }
    },

    onError(err) {
      console.error('video play error:', err)
      this.$message.error('视频播放失败')
    },

    /**
     * 重置数据
     */
    afterClose() {
      this.loading = false
      this.videoUrl = ''
      this.$emit('afterClose')
    },

    /**
     * 打开弹窗
     */
    open(url) {
      if (this.visible) return
      this.visible = true
      this.videoUrl = url
      if (this.autoplay) {
        this.$nextTick(() => {
          this.play()
        })
      }
    },

    /**
     * 关闭弹窗
     */
    close() {
      if (!this.visible) return
      this.visible = false
    }
  },

  mounted() {},

  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 0;
}

.custom_dialog_footer{
  padding: 10px 20px 20px;
}

.custom_dialog_body {
  height: calc(88vh - 150px);
  .video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
