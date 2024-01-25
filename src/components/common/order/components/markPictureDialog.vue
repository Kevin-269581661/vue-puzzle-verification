<template>
  <div class="dialog_container">
    <!-- 查看/编辑图片标签-弹框组件 -->
    <el-dialog
      :visible.sync="visible"
      :append-to-body="true"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="`${isEdit ? '编辑' : '查看'}图片`"
      width="1200px"
      @closed="afterClose"
    >
      <div v-loading="dialogLoading" class="dialog_content">
        <div class="custom_dialog_body">
          <div
            :class="{ edit_mark: isCreating }"
            class="picture_wrapper"
            @click="handleClickPictureWrapper"
          >
            <img :src="rowData.url" alt="" class="img" />
            <!-- 显示标签 -->
            <div class="mark_list">
              <div
                v-for="(item, index) in markList"
                :key="index"
                :style="{
                  left: item.left + 'px',
                  top: item.top + 'px'
                }"
                class="mark_item"
              >
                <el-tooltip :content="item.content" placement="top">
                  <div class="mark_icon_box">
                    <i class="el-icon-warning mark_icon" />
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
        <div class="custom_dialog_footer">
          <el-button @click="close" size="small">关闭</el-button>
          <el-button v-if="isEdit" size="small"  @click="handleCreateMark">取消</el-button>
          <el-button v-if="isEdit" type="primary" size="small" @click="handleOk">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import sessFun from "@/commonFun/sessFun.js";
import { getUniqueId} from '@/utils/common.js'

export default {
  name: 'markPictureDialog',
  emits: ['submitSuccess', 'afterClose'],
  props: {},
  data() {
    return {
      visible: false,
      dialogLoading: false,
      isEdit: false,
      rowData: {
        id: null,
        url: ''
      },
      isCreating: false,
      markList: [],
      editMarkData: {
        isShow: false,
        left: 0,
        top: 0,
        inputValue: ''
      }
    }
  },
  methods: {
    /**
     * 创建标签对象
     */
    createMarkItem(left, top, content) {
      const uniKey = getUniqueId()
      return { uniKey, left, top, content }
    },
    /**
     * 显示编辑标记输入框
     */
    showMarkEditBox(left, top) {
      this.editMarkData.left = left
      this.editMarkData.top = top
      this.editMarkData.isShow = true
      this.isCreating = false
    },
    /**
     * 隐藏编辑标记输入框
     */
    hideMarkEditBox() {
      this.editMarkData.left = 0
      this.editMarkData.top = 0
      this.editMarkData.inputValue = ''
      this.editMarkData.isShow = false
      this.isCreating = false
    },
    /**
     * 点击新增标签
     */
    handleCreateMark() {
      this.isCreating = true
      // message.warning('请点击图片选择标签位置')
    },
    /**
     * 确认创建标签
     */
    confirmEdittMark() {
      const { inputValue, left, top } = this.editMarkData
      if (!inputValue) return this.$message.warning('请输入标签描述')
      this.markList.push(this.createMarkItem(left, top, inputValue))
      this.hideMarkEditBox()
    },
    /**
     * 点击图片框
     */
    handleClickPictureWrapper(e) {
      console.log('handleClickPictureWrapper e ===', e)
      // 判断是否是创建标签
      if (this.isCreating) {
        const { offsetX, offsetY } = e
        this.showMarkEditBox(offsetX - 12, offsetY - 12)
      }
    },
    /**
     * 删除标签
     */
    deleteMark(index) {
      this.markList.splice(index, 1)
    },
    /**
     * 确认
     */
    async handleOk() {
      try {
        this.$emit('confirm', {
          fileId: this.rowData.id,
          markList: this.markList
        })
        this.close()
      } catch (err) {
        console.error('handleOk error:', err)
      }
    },
    /**
     * 重置数据
     */
    afterClose() {
      this.hideMarkEditBox()
      this.markList = []
      this.$emit('afterClose')
    },
    /**
     * 打开弹框
     */
    open(row, canMark = false) {
      console.log('open row ===>', row)
      if (this.visible) return
      if (!row) return
      this.rowData = { ...row }
      // 转换标签 JSON
      this.markList = JSON.parse(row.expand || '[]')
      this.isEdit = canMark
      this.visible = true
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

.picture_wrapper {
  width: 1000px;
  height: 600px;
  background: #f5f5f5;
  position: relative;
  margin: 0 auto;
  border: 1px dashed transparent;
  &.edit_mark {
    cursor: pointer;
    border-color: #40a9ff;
  }
  .img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.desc_text {
  text-align: center;
}

.mark_icon_box {
  background: rgba(245, 108, 108, 0.2);
  position: absolute;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.mark_list {
  .mark_item {
    position: absolute;
    z-index: 10;
  }
}

.mark_icon {
  font-size: 24px;
  color: rgb(245, 108, 108);
}

</style>
