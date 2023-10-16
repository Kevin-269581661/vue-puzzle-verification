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
      element-loading-text="玩命加载中.."
      element-loading-spinner="el-icon-loading"
      highlight-current-row
      tooltip-effect="dark"
    >
      <template v-for="col in columns">
        <el-table-column v-if="col.type === 'index'" :key="col.key || 'index'" label="序号" type="index" width="80" fixed="left"></el-table-column>
        <el-table-column v-else-if="col.type === 'selection'" :key="col.key || 'selection'" type="selection" width="55" fixed="left"></el-table-column>
        <el-table-column v-else-if="col.slot" :label="col.title" :key="col.key || col.dataIndex" :width="col.width" :min-width="col.minWidth" :fixed="col.fixed">
          <template slot-scope="scope">
            <slot :name="col.slot" :row="scope.row">
              <!-- <span>{{ scope.row }}</span> -->
            </slot>
          </template>
        </el-table-column>
        <el-table-column v-else :label="col.title" :key="col.key || col.dataIndex" :prop="col.dataIndex" :width="col.width" :min-width="col.minWidth" :fixed="col.fixed"></el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
/*
 用法：

  html:

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
            key: 'name',
          },
          {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
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

export default {
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
  data() {
    return {


    }
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
.table_list_container {

}
</style>>
