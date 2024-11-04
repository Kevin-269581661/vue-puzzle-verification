<!-- 导入失败结果-弹框组件 -->
<template>
  <el-dialog
    top="5vh"
    width="90%"
    append-to-body
    show-close
    :title="`导入${targetName}失败信息`"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="afterClose"
  >
    <div class="dialog_content">
      <div class="custom_dialog_body">
        <TextAlert v-if="showHeader" showIcon class="alert_box">
          <span>成功处理 <span class="blue_text">{{ successSize }}</span> 条数据，失败 <span class="red_text">{{ pagination.total }}</span> 条：</span>
        </TextAlert>

        <TableList
          :columns="tableColumns"
          :dataSource="tableList"
          :loading="loading"
          :showSetting="false"
        >
        </TableList>

        <div class="pagination_wrapper">
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
      <div class="custom_dialog_footer">
        <el-button size="small" @click="close">关闭</el-button>
        <el-button type="primary" size="small" :loading="loading" @click="exportExcel">导出</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import TableList from "@/components/common/components/TableList/index.vue"
import TextAlert from "@/components/common/components/TextAlert/index.vue"
import dayjs from "dayjs";

export default {
  name: 'failListDialog',
  components: { TableList, TextAlert },
  emits: ['submitSuccess', 'afterClose'],
  props: {
    targetName: {
      type: String,
      default: ''
    },
    showHeader: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      totalList: [],
      tableColumns: [],
      // 成功数
      successSize: 0,
      pagination: {
        // 当前页码
        page: 1,
        // 每页条数
        pageSize: 10,
        // 总条数
        total: 0,
        // 每页条数选项
        sizes: [10, 20, 50],
      },
    }
  },
  computed: {
    tableList() {
      if (!this.totalList.length) return []
      const start = (this.pagination.page - 1) * this.pagination.pageSize
      const end = start + this.pagination.pageSize
      return this.totalList.slice(start, end)
    }
  },
  methods: {
    /**
     * 导出结果
     */
    exportExcel() {
      if (this.loading) return
      this.loading = true
      require.ensure([], () => {
        const {
          export_json_to_excel,
        } = require("@/vendorExcel/Export2Excel");
        const tHeader = this.tableColumns.map(it => it.title)
        const filterVal = this.tableColumns.map(it => it.dataIndex)
        const list = this.totalList
        const data = this.formatJson(filterVal, list);
        const timeTxt = dayjs().format('YYYY-MM-DD HH:mm:ss')
        export_json_to_excel(tHeader, data, `${this.targetName}导入失败信息${timeTxt}`);
        this.loading = false
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },

    /**
     * 分页-切换页数
     */
    pageChange (val) {
      this.pagination.page = val
    },

    /**
     * 分页-切换页大小
     */
    pageSizeChange (val) {
      this.pagination.page = 1
      this.pagination.pageSize = val
    },

    /**
     * 重置数据
     */
    afterClose() {
      this.loading = false
      this.totalList = []
      this.tableColumns = []
      this.successSize = 0
      this.$emit('afterClose')
    },

    /**
     * 打开弹框
     */
    open({ list, columns, successSize = 0 }) {
      if (this.visible) return
      this.visible = true
      this.totalList = list || []
      this.tableColumns = columns || []
      this.pagination.page = 1
      this.pagination.total = this.totalList.length
      this.successSize = successSize
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

.alert_box {
  margin-bottom: 10px;
}

.blue_text {
  color: #1890FF;
  font-weight: 600;
}

.red_text {
  color: #F56C6C;
  font-weight: 600;
}

</style>
