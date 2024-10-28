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
        <TableList
          :columns="tableColumns"
          :dataSource="tableList"
          :loading="loading"
          :showSetting="false"
        >
        </TableList>
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
import dayjs from "dayjs";

export default {
  name: 'failListDialog',
  components: { TableList },
  emits: ['submitSuccess', 'afterClose'],
  props: {
    targetName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      tableList: [],
      tableColumns: [],
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
        const list = this.tableList
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
     * 重置数据
     */
    afterClose() {
      this.loading = false
      this.tableList = []
      this.tableColumns = []
      this.$emit('afterClose')
    },

    /**
     * 打开弹框
     */
    open({ list, columns }) {
      if (this.visible) return
      this.visible = true
      this.tableList = list || []
      this.tableColumns = columns || []
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

</style>
