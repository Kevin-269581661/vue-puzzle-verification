<!-- 订单/方案详情-导出点位明细-收藏管理-弹框组件 -->
<template>
  <div>
    <el-dialog
      top="8vh"
      width="80%"
      append-to-body
      show-close
      title="收藏管理"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @closed="afterClose"
    >
      <el-table
        ref="tableRef"
        v-loading="tableLoading"
        height="700"
        element-loading-text="玩命加载中.."
        element-loading-spinner="el-icon-loading"
        highlight-current-row
        style="width: 100%"
        class="table_box"
        :data="collectList"
      >

        <el-table-column label="序号" type="index" width="60"></el-table-column>

        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="drop_transform_warpper">
              <div class="drop_card part_left">
                <div class="card_header">未选择</div>
                <div class="drop_list">
                  <div v-for="(item, i) in scope.row.unselectedFields" class="drop_item" :key="item.key">
                    <span class="text" :title="item.name">{{ item.name }}</span>
                  </div>
                </div>
              </div>

              <div class="drop_card part_right">
                <div class="card_header">已选择</div>
                <div class="drop_list">
                  <div v-for="(item, i) in scope.row.selectedFields" class="drop_item selected" :key="item.key">
                    <span class="text" :title="item.name">{{ item.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="名称" prop="name" show-overflow-tooltip></el-table-column>

        <el-table-column  label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="cancelCollect(scope.row, scope.$index)">取消收藏</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'collectExportPointDialog',
  emits: ['getCollectList', 'afterClose'],
  props: {
    collectList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      visible: false,
      tableLoading: false
    };
  },
  methods: {
    /**
     * 取消收藏
     */
    async cancelCollect({ id, name }, index) {
      try {
        await this.$confirm(`确定要取消收藏【${name}】吗？`, '提示', { type: 'warning' })
        this.tableLoading = true
        const res = await this.$api.adPlan.deleteSpaceExportTemplate({
          templateId: id
        })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '操作失败')
        this.$message.success('操作成功')
        this.getCollectList()
      } catch (err) {
        console.error('cancelCollect err: ', err)
      } finally {
        this.tableLoading = false
      }
    },

    /**
     * 获取收藏列表
     */
     getCollectList() {
      this.tableLoading = true
      this.$emit('getCollectList', {
        onComplete: () => {
          this.tableLoading = false
        }
      })
    },

    /**
     * 重置数据
     */
     afterClose() {
      this.$emit('afterClose')
    },

    /**
     * 打开弹框
     */
    open() {
      if (this.visible) return
      this.visible = true
    },

    /**
     * 关闭弹框
     */
    close() {
      if (!this.visible) return
      this.visible = false
    }
  },
};
</script>

<style>
.collect_export_point_dialog_tooltip {
  max-width: 600px !important;
}
</style>

<style lang="scss" scoped>
.table_box /deep/ .cell {
  height: unset;
}

.drop_transform_warpper {
  display: flex;
  justify-content: space-around;
  height: 500px;
  width: 600px;
  margin: 0 auto;
  .drop_card {
    width: 40%;
    height: 100%;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
  }
  .card_header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #ebeef5;
  }
  .drop_list {
    flex: 1;
    padding: 10px;
    box-sizing: border-box;
    overflow: hidden auto;
    .drop_item {
      width: 100%;
      height: 28px;
      padding: 0 30px 0 10px;
      border: 1px solid #f4f4f4;
      border-radius: 4px;
      margin-bottom: 10px;
      background-color: #f4f4f4;
      position: relative;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      user-select: none;
      &:last-child {
        margin-bottom: 0;
      }
      &:hover .icon {
        display: block;
      }
      &.selected {
        color: #409eff;
        border-color: #d9ecff;
        background-color: #ecf5ff;
      }
      &.ghost {
        opacity: 0;
      }
      .text {
        flex: 1;
        line-height: 28px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .icon {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        cursor: pointer;
        display: none;
        &.add {
          color: #409EFF;
        }
        &.delete {
          color: #F56C6C;
        }
      }
    }
  }

}
</style>
