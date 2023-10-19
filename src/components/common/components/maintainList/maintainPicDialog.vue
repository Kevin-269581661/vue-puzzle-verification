<template>
  <div class="dialog_container">
    <!-- 媒体维护-照片弹框 -->
    <el-dialog
      :visible.sync="visible"
      :append-to-body="true"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="巡点照片"
      width="60%"
      @closed="close"
    >
      <div v-loading="dialogLoading" class="dialog_content">
        <div class="custom_dialog_body">
          <div style="display: flex; justify-content: center">
            <p
              v-for="(item, index) of imgList"
              :key="index"
              style="margin: 0px 10px; text-align: center"
            >
              <img :src="item.url" alt="" style="width: 240px; height: 360px" />
              <span style="width: 100%; display: inline-block; text-align: center">
                <span class="img_span_style">{{
                  item.uploadType == 'album' ? '相册上传' : '手机拍摄'
                }}</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'maintainPicDialog',
  data() {
    return {
      dialogLoading: false,
      visible: false,
      imgList: []
    }
  },
  methods: {
    /**
     * 打开弹框
     */
    open(list) {
      if (!list || !Array.isArray(list)) return
      this.imgList = list
      this.visible = true
    },
    /**
     * 关闭弹框
     */
    close() {
      if (this.visible) {
        this.imgList = []
        this.visible = false
      }
    }
  }
}
</script>

<style lang="scss" scoped="scoped">
.dialog_container {
  /deep/ .el-dialog__body {
    padding: 0;
  }

  .custom_dialog_footer{
    padding: 10px 20px 20px;
  }

  .img_span_style {
    border-radius: 12px;
    color: #fff;
    width: 130px;
    display: inline-block;
    text-align: center;
    font-size: 12px;
    background: #979797;
  }
}
</style>
