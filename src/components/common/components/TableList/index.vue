<template>
  <!-- 通用表格组件 -->
  <div class="table_list_container" :style="{ height: height || null }">
    <!-- 工具栏 -->
    <div v-if="showSetting" class="table_tool_box">
      <div class="tool_left">
        <slot name='tableTool'></slot>
      </div>
      <!-- 列设置 -->
      <TableSetting
        :columns="totalColumns"
        :cacheKey="currentPageName"
        refresh
        space
        filter
        @refreshTable="$emit('refreshTable')"
        @filterColumn="filterColumn"
        @spaceSetting="tableSizeChange"
      />
    </div>
    <!-- 表格 -->
    <div class="table_list_wrapper">
      <el-table
        ref="tableRef"
        v-loading="loading"
        :height="height ? '100%' : null"
        :data="dataSource"
        :border="true"
        :key="tableKey"
        :size="tableSize"
        :row-key="rowKey ? rowKey : null"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        highlight-current-row
        tooltip-effect="dark"
        @sort-change="e => $emit('sortChange', e)"
      >
        <template v-for="col in tableColumns">
          <el-table-column
            v-if="col.type === 'index'"
            :key="col.key || 'index'"
            :align="col.align || 'center'"
            :header-align="col.headerAlign || 'center'"
            label="序号"
            type="index"
            width="80"
            fixed="left">
          </el-table-column>

          <!-- type="selection" -->
          <el-table-column
            v-else-if="col.type === 'selection'"
            :key="col.key || 'selection'"
            :align="col.align || 'center'"
            :header-align="col.headerAlign || 'center'"
            width="55"
            fixed="left"
          >
            <template slot="header" slot-scope="scope">
              <el-checkbox v-model="isSelectedAllInCurrentPage" @change="handleSelectAll"></el-checkbox>
            </template>
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row[selectKey]" @change="val => handleSelectionChange(val, scope.row)"></el-checkbox>
            </template>
          </el-table-column>

          <el-table-column
            v-else-if="col.slot"
            v-bind="col.props || null"
            :label="col.title"
            :key="col.key || col.dataIndex"
            :column-key="col.key || col.dataIndex"
            :prop="col.dataIndex || col.slot"
            :width="col.width || null"
            :min-width="col.minWidth || null"
            :fixed="col.fixed || null"
            :align="col.align || 'center'"
            :header-align="col.headerAlign || 'center'"
          >
            <template slot-scope="scope">
              <slot :name="col.slot" :row="scope.row">
                <!-- <span>{{ scope.row }}</span> -->
              </slot>
            </template>
          </el-table-column>

          <el-table-column
            v-else
            v-bind="col.props || null"
            :label="col.title"
            :key="col.key || col.dataIndex"
            :column-key="col.key || col.dataIndex"
            :prop="col.dataIndex"
            :width="col.isTagStyle ? '350' : col.width"
            :min-width="col.minWidth"
            :fixed="col.fixed"
            :align="col.align || 'center'"
            :header-align="col.headerAlign || 'center'"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <!-- 标签样式 -->
              <div v-if="col.isTagStyle && scope.row[col.dataIndex]" class="tag_wraper">
                <span v-for="(item, i) in getTagList(scope.row, col)"
                  :key="i" class="tag_box">
                  {{ item }}
                </span>
              </div>
              <!-- 默认样式 -->
              <span v-else>{{ formatValue(scope.row[col.dataIndex]) }}</span>
            </template>
          </el-table-column>
        </template>

        <NoSearchResult slot="empty"/>
      </el-table>
    </div>
  </div>
</template>

<script>
/*
表格-通用动态配置组件
  组件属性：
    columns: [Array] 必传 - 表格列配置数组
    dataSource: [Array] 必传 - 表格数据数组
    loading: [Boolean] 非必传（默认 false） - 表格加载状态
    showSetting: [Boolean] 非必传（默认 true） - 是否显示工具栏

  组件事件：
    @refreshTable 刷新列表接口数据（对应父组件 getTableList）
    @selectionChange 列表勾选

  组件插槽：
    v-slot="tableTool" 表格工具栏


  组件用法：

    template:

      <TableList :columns="tableColumns" :dataSource="tableList" :loading="tableLoading" @refreshTable="getTableList">

        <template slot="age" slot-scope="slotProps">
          <span>{{ slotProps.row.age }}</span>
        </template>

      </TableList>

    js:

      import TableList from "@/components/common/components/TableList/index.vue";

      components: {
        TableList
      },
      data() {
        tableLoading: false,
        tableList: [],
        tableColumns: [
            {
              title: '序号',
              type: 'index',
            },
            {
              // 必传 - 列头文字
              title: '年龄',
              // 非必传 - 字段名
              dataIndex: 'age',
              // 非必传 - 唯一key，有 dataIndex 可不用加
              key: 'age',
              // 非必传
              fixed: null,
              // 非必传
              width: null,
              // 非必传
              minWidth: null,
              // 非必传
              align: 'center',
              // 非必传
              headerAlign: 'center'
              // 非必传（默认 false） - 是否是显示标签样式
              isTagStyle: false,
              // 非必传（默认 、） - 必需跟 isTagStyle 一起使用，分隔符
              splitChar: '、',
              // 非必传 - 自定义列插槽（开启之后，需要自定义处理渲染逻辑）
              slot: 'age'
            },
            {
              title: '操作',
              key: 'action',
              slot: 'action',
              fixed: 'right',
            },
          ]
      }

 */

import { deserialize, isNotEmpty } from '@/utils/common'
import NoSearchResult from "@/components/common/components/noSearchResult.vue";
import TableSetting from "@/components/common/components/TableSetting/index.vue";

export default {
  name: 'tableList',
  components: {
    NoSearchResult,
    TableSetting
  },
  props: {
    /**
     * 必传-表格列配置
     */
    columns: {
      type: Array,
      required: true
    },
    /**
     * 必传-表格数据
     */
    dataSource: {
      type: Array,
      default: () => []
    },
    /**
     * 表格为 selection 时，作为判断是否勾选的 key
     */
     selectKey: {
      type: String,
      default: 'isSelected'
    },
    /**
     * 行唯一id（起到优化作用）
     */
    rowKey: {
      type: String,
      default: ''
    },
    /**
     * 数据加载 loading
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * 是否显示工具栏（默认显示）
     */
    showSetting: {
      type: Boolean,
      default: true
    },
    /**
     * 组件总高度（一般传 '100%'，由父元素决定，不传则自动撑开）
     */
    height: {
      type: String,
      default: ''
    }
  },
  emits: ['refreshTable', 'selectionChange', 'sortChange'],
  data () {
    return {
      // 表格行距
      tableSize: '',
      totalColumns: [],
      tableKey: '',
      isSelectedAllInCurrentPage: false,
      selectedList: []
    }
  },
  computed: {
    currentPageName() {
      return this.$route.path.split('/').pop()
    },
    tableColumns() {
      // console.log('this.totalColumns ===', this.totalColumns)
      return this.totalColumns.filter(item => item.isChecked)
    }
  },
  watch: {
    columns: {
      handler(val) {
        // console.log('watch columns ===', val)
        this.totalColumns = val.map(item => {
          let { title: label, dataIndex: prop, isChecked = true, fixed = null, type } = item
          if (['index', 'selection'].includes(type)) {
            fixed = 'left'
          }
          return {
            ...item,
            id: prop,
            label,
            prop,
            isChecked,
            fix: fixed ? fixed : 'not'
          }
        })
      },
      deep: true,
      immediate: true
    },
    dataSource (newVal) {
      this.checkSelectedAll()
    }
  },
  methods: {
    formatValue(val) {
      return isNotEmpty(val) ? val : '--'
    },

    /**
     * 点击列表全选
     */
    handleSelectAll() {
      this.dataSource.forEach(row => {
        row[this.selectKey] = this.isSelectedAllInCurrentPage
        this.handleSelect(this.isSelectedAllInCurrentPage, row)
      })
      this.$emit('selectionChange', this.selectedList)
    },
    /**
     * 列表勾选事件
     */
    handleSelectionChange(isSelected, row) {
      this.handleSelect(isSelected, row)
      this.checkSelectedAll()
      this.$emit('selectionChange', this.selectedList)
    },
    /**
     * 处理列表单行勾选
     */
    handleSelect(isSelected, row) {
      let index = -1
      if (this.rowKey) {
        index = this.selectedList.findIndex(item => item[this.rowKey] === row[this.rowKey])
      } else {
        index = this.selectedList.findIndex(item => JSON.stringify(item) === JSON.stringify(row))
      }
      if (index !== -1 && !isSelected) {
        this.selectedList.splice(index, 1)
      } else if (index === -1 && isSelected) {
        this.selectedList.push(row)
      }
    },
    /**
     * 检查是否全选了本页
     */
    checkSelectedAll() {
      this.isSelectedAllInCurrentPage = this.dataSource.every(item => item[this.selectKey])
    },
    /**
     * 处理标签样式列
     */
    getTagList(row, col) {
      const val = deserialize(row[col.dataIndex])
      if (Array.isArray(val)) return val
      if (!val && val !== 0) return []
      return String(val).split(col.splitChar || '、')
    },
    /**
     * 改变列表行距
     */
    tableSizeChange(size) {
      this.tableSize = size
    },
    /**
    * 列展示
    */
    filterColumn(columns) {
      this.totalColumns = columns
      // 触发重新渲染表格
      this.tableKey = Math.random()
    },
  },
};
</script>

<style lang="scss" scoped>

.table_list_container {
  width: 100%;
  display: flex;
  flex-direction: column;

  /deep/ .el-table .el-table__header-wrapper th.el-table__cell{
    background-color: #fafafa !important;
  }

  /deep/ .el-table .el-table__header th.el-table__cell{
    background-color: #fafafa !important;
  }

  .table_tool_box {
    width: 100%;
    display: flex;
    align-items: center;
    padding-bottom: 16px;
    .tool_left {
      flex: 1;
    }
  }

  .table_list_wrapper {
    flex: 1;
    overflow: hidden;
  }

  .tag_wraper {
    display: flex;
    align-items: center;
    height: 100%;
    // flex-wrap: wrap;
    .tag_box {
      display: inline-block;
      white-space: nowrap;
      overflow: visible;
      height: 22px;
      line-height: 22px;
      text-align: center;
      padding: 0 8px;
      background: linear-gradient(0deg, #E6F7FF, #E6F7FF),linear-gradient(0deg, #91D5FF, #91D5FF);
      border: 1px solid #91D5FF ;
      font-size: 12px;
      color: #1890FF;
      border-radius: 4px;
      & + .tag_box {
        margin-left: 8px;
      }
    }
  }
}
</style>>
