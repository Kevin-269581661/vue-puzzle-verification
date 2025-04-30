<!-- 音频播放预览-弹框组件 -->
<template>
  <el-dialog
    width="350px"
    top="30vh"
    append-to-body
    show-close
    :title="title"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="afterClose"
  >
    <div v-loading="loading" class="dialog_content">
      <div class="custom_dialog_body">
        <audio
          v-if="audioUrl"
          ref="audioRef"
          class="audio"
          controls
          preload="metadata"
          :src="audioUrl"
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
  name: 'playAudioDialog',
  emits: ['afterClose'],
  props: {
    autoplay: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '音频播放'
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      audioUrl: ''
    }
  },

  methods: {
    /**
     * 播放视频
     */
    play() {
      if (this.audioUrl) {
        this.$refs.audioRef && this.$refs.audioRef.play()
      } else {
        throw new Error('play error: audioUrl is empty')
      }
    },

    /**
     * 暂停视频
     */
    pause() {
      if (this.audioUrl) {
        this.$refs.audioRef && this.$refs.audioRef.pause()
      } else {
        throw new Error('pause error: audioUrl is empty')
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
      this.audioUrl = ''
      this.$emit('afterClose')
    },

    /**
     * 打开弹窗
     */
    open(url) {
      if (this.visible) return
      this.visible = true
      this.audioUrl = url
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
  height: 60px;
  text-align: center;
}
</style>
