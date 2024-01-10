<template>
  <div class="dialog_container">
    <!-- 全国单详情-动态-弹框组件 -->
    <el-dialog
      :visible.sync="visible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="true"
      width="800px"
      @closed="afterClose"
    >
      <template slot="title">
        <div class="custom_title_wrapper">
          <span>动态记录</span>
          <el-input
            v-model="searchData.keyword"
            placeholder="输入搜索"
            style="width: 200px"
            size="small"
            @input="handleInputSearch"
          />
        </div>
      </template>
      <div v-loading="tableLoading" class="dialog_content">
        <div class="custom_dialog_body">
          <el-steps v-if="tableList.length" :active="0" direction="vertical">
            <el-step
              v-for="(item, i) in tableList"
              :key="i"
              :title="item.createTime"
              :description="item.content"
            >
              <template slot="icon">
                <div class="circle_dot_icon"></div>
              </template>
            </el-step>
          </el-steps>
          <el-empty v-else />
        </div>
        <div class="custom_dialog_footer">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="pagination.sizes"
            :current-page.sync="pagination.page"
            :page-size="pagination.pageSize"
            :total="pagination.total"
            @current-change="pageChange"
            @size-change="pageSizeChange"
          >
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import searchTableMixin from '@/mixins/searchTableMixin'
import { debounce } from 'lodash'

/**
 * 初始化搜索数据
 */
 const initSearchData = () => ({
  resourceId: null,
  processDetailId: null,
  keyword: ''
})

export default {
  name: 'dynamicListDialog',
  mixins: [searchTableMixin],
  emits: ['submitSuccess', 'afterClose'],
  props: {},
  data() {
    return {
      visible: false,
      dialogLoading: false,
      isEdit: false,
      apiModel: {
        list: this.$api.resource.listOperateRecords
      },
    }
  },
  methods: {
    /**
     * 输入防抖
     */
    handleInputSearch: debounce(function () {
      this.handleSearch()
    }, 800),
    /**
     * 重置数据
     */
    afterClose() {
      this.searchData = initSearchData()
      this.tableList = []
      this.$emit('afterClose')
    },
    /**
     * 打开弹框
     * （弹框打开时调用，一些弹框打开时的初始化处理可以在此方法内进行，譬如：通过 row.id 请求详情...）
     */
    open({
      // 项目id
      resourceId = null,
      // 节点唯一标识
      processDetailId = null
    }) {
      if (this.visible) return
      this.searchData.resourceId = resourceId
      this.searchData.processDetailId = processDetailId
      this.handleSearch()
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
  },
  created() {
    this.initSearchTableMixin({ initSearchData })
  },
}
</script>

<style lang="scss" scoped="scoped">

/deep/ .el-dialog__body {
  padding: 0;
}

/deep/ .el-step__icon.is-text {
  border: 0;
}

.custom_dialog_footer{
  padding: 10px 20px 20px;
}

.circle_dot_icon {
  width: 9px;
  height: 9px;
  border: 2px solid #1890ff;
  background: rgba(24, 144, 255, 0.1);
  border-radius: 50%;
  box-sizing: border-box;
}

.custom_title_wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 30px;
}
</style>
