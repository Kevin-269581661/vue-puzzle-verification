<template>
  <!-- 通用动态配置表格组件 -->
  <div class="table_list_container">
    <slot name='tableHeader'></slot>
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="dataSource"
      :border="true"
      height="700"
      style="width: 100%"
      element-loading-text="玩命加载中..."
      element-loading-spinner="el-icon-loading"
      highlight-current-row
      tooltip-effect="dark"
    >
      <template v-for="col in columns">
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

        <el-table-column
          v-else-if="col.type === 'selection'"
          :key="col.key || 'selection'"
          :align="col.align || 'center'"
          :header-align="col.headerAlign || 'center'"
          type="selection"
          width="55"
          fixed="left">
        </el-table-column>

        <el-table-column
          v-else-if="col.slot"
          :label="col.title"
          :key="col.key || col.dataIndex"
          :width="col.width"
          :min-width="col.minWidth"
          :fixed="col.fixed"
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
          :label="col.title"
          :key="col.key || col.dataIndex"
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
            <span v-else>{{ scope.row[col.dataIndex] }}</span>
          </template>
        </el-table-column>
      </template>

      <NoSearchResult slot="empty"/>
    </el-table>
  </div>
</template>

<script>
/*
表格-通用动态配置组件
  组件属性：
    columns: [Array] 必传 - 表格列配置数组
    dataSource: [Array] 必传 - 表格数据数组
    loading: [Boolean] 非必传（默认 false） - 表格加载状态

  组件事件：

  组件用法：

  template:

    <TableList :columns="tableColumns" :dataSource="tableList" :loading="tableLoading">

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
      tableList: [
        { name: '张三', age: 20, address: '上海市普陀区金沙江路 1518 弄'},
        { name: '张三', age: 20, address: '上海市普陀区金沙江路 1518 弄'},
        { name: '张三', age: 20, address: '上海市普陀区金沙江路 1518 弄'},
      ],
      tableColumns: [
          {
            title: '姓名',
            dataIndex: 'name',
          },
          {
            // 必传 - 列头文字
            title: '年龄',
            // 非必传 - 字段名
            dataIndex: 'age',
            // 非必传 - 唯一key，有 dataIndex 可不用加
            key: 'age',
            // 非必传（默认 false） - 是否是显示标签样式
            isTagStyle: false,
            // 非必传（默认 、） - 必需跟 isTagStyle 一起使用，分隔符
            splitChar: '、',
            // 非必传 - 自定义列插槽（开启之后，需要自定义处理渲染逻辑）
            slot: 'age'
          },
          {
            title: '住址',
            dataIndex: 'address',
            key: 'address',
          },
        ]
    }
 */

import { deserialize } from '@/utils/common'
import NoSearchResult from "@/components/common/components/noSearchResult.vue";

export default {
  name: 'tableList',
  components: {
    NoSearchResult
  },
  props: {
    /**
     * 表格列配置
     */
    columns: {
      type: Array,
      required: true
    },
    /**
     * 表格数据
     */
    dataSource: {
      type: Array,
      default: () => []
    },
    /**
     * 数据加载 loading
     */
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getTagList(row, col) {
      const val = deserialize(row[col.dataIndex])
      if (!val) return []
      return typeof val === 'string' ? val.split(col.splitChar || '、') : val
    }
  },
};
</script>

<style lang="scss" scoped>
.table_list_container {
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
