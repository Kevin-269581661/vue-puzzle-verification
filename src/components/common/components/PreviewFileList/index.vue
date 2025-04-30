<!-- 文件列表（预览）-组件 -->
<template>
  <div>
    <div class="media_preview_list">
      <div
        v-for="(item, i) in mediaList"
        class="media_preview_item_wrapper"
        :style="{ padding: itemPadding }"
        :key="i"
      >
        <div
          class="media_preview_item"
          :style="{
            width: itemWidth,
            height: itemHeight
          }"
          :title="item.name"
        >
          <!-- 图片 -->
          <template v-if="item.type === MediaTypeEnum.IMAGE">
            <img
              width="100%"
              height="100%"
              class="media_img"
              :src="item.url"
              @click="previewImg(item.url)"
            />
          </template>

          <!-- 视频 -->
          <template v-else-if="item.type === MediaTypeEnum.VIDEO">
            <div class="media_video_wrapper" @click="previewVideo(item.url)">
              <video class="media_video" width="100%" height="100%" :src="item.url" />
              <div class="media_video_mask">
                <img src="@/assets/images/video_play_icon.png" class="play_icon" />
              </div>
            </div>
          </template>

          <!-- 音频 -->
          <template v-else-if="item.type === MediaTypeEnum.AUDIO">
            <div class="media_other" @click="previewAudio(item.url)">
              <i class="el-icon-service" style="font-size: 30px;color: #999;margin-bottom: 5px;"></i>
            </div>
          </template>

          <!-- 其他  -->
          <template v-else>
            <div class="media_other" @click="previewOther(item.url)">
              <i class="el-icon-document" style="font-size: 30px;color: #999;margin-bottom: 5px;" />
              <span class="text">其它类型文件</span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 视频播放预览-弹框组件 -->
    <PlayVideoDialog ref="playVideoDialogRef" autoplay />

    <PlayAudioDialog ref="playAudioDialogRef" autoplay />
  </div>
</template>

<script>
import PlayVideoDialog from './playVideoDialog.vue'
import PlayAudioDialog from './playAudioDialog.vue'
import { getUniqueId, previewFile } from '@/utils/common'

const MediaTypeEnum = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  OTHER: 'other'
}

export default {
  name: 'previewFileList',
  components: {
    PlayVideoDialog,
    PlayAudioDialog
  },
  emits: [],
  props: {
    list: {
      type: Array,
      default: () => []
    },
    itemWidth: {
      type: String,
      default: '120px'
    },
    itemHeight: {
      type: String,
      default: '120px'
    },
    gutter: {
      type: [Number, Array],
      default: 10
    }
  },
  data() {
    return {
      MediaTypeEnum,
      visible: false,
      loading: false,
      mediaList: []
    }
  },

  computed: {
    itemPadding() {
      if (Array.isArray(this.gutter)) {
        const [x, y] = this.gutter
        return `${x}px ${y}px`
      }
      if (typeof this.gutter === 'number') {
        return `${this.gutter}px`
      }
      return this.gutter
    }
  },

  watch: {
    list: {
      handler(newVal) {
        this.mediaList = newVal.map(url => {
          const name = url.split('/').pop()
          const type = this.getMediaTypeByUrl(url)
          const key = getUniqueId()
          return {
            type,
            url,
            name,
            key
          }
        })
      },
      immediate: true
    }
  },

  methods: {
    /**
     * 根据url获取媒体类型
     */
    getMediaTypeByUrl(url) {
      if (!url) return ''
      const fileName = url.split('/').pop()
      let suffix = fileName.split('.').pop()
      if (!suffix) return MediaTypeEnum.OTHER
      suffix = suffix.toLowerCase()
      switch (suffix) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
          return MediaTypeEnum.IMAGE
        case 'mp4':
        case 'avi':
        case 'wmv':
        case 'mov':
        case '3gp':
        case 'flv':
        case 'mkv':
        case 'mpeg':
        case 'asf':
        case 'rmvb':
          return MediaTypeEnum.VIDEO
        case 'mp3':
        case 'wav':
        case 'wma':
        case 'aac':
        case 'flac':
        case 'ogg':
          return MediaTypeEnum.AUDIO
        default:
          return MediaTypeEnum.OTHER
      }
    },

    previewImg(url) {
      this.$hevueImgPreview(url)
    },

    previewVideo(url) {
      this.$refs.playVideoDialogRef && this.$refs.playVideoDialogRef.open(url)
    },

    previewAudio(url) {
      this.$refs.playAudioDialogRef && this.$refs.playAudioDialogRef.open(url)
    },

    previewOther(url) {
      previewFile(url)
    }
  },

  mounted() {},

  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
.media_preview_list {
  display: flex;
  flex-wrap: wrap;

  .media_preview_item_wrapper {
    padding: 10px;
    .media_preview_item {
      width: 120px;
      height: 120px;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      padding: 5px;
      // background-color: #f4f4f4;
      &:hover {
        border-color: #ccc;
      }
    }
  }

  .media_img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    cursor: pointer;
  }

  .media_video_wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    cursor: pointer;
    .media_video {
      width: 100%;
      height: 100%;
    }
    .media_video_mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      width: 100%;
      height: 100%;
      // background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      .play_icon {
        width: 30px;
        height: 30px;
      }
    }
  }

  .media_other {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    .icon {
      font-size: 30px;
      color: #999;
      margin-bottom: 5px;
    }
    .text {
      color: #999;
      font-size: 12px;
    }
  }
}
</style>
