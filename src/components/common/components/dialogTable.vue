<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :width="width"
    :before-close="handleClose"
    :close-on-click-modal="false"
    custom-class="adjust-dialog"
    center
  >
    <div>
      <slot name="table-comment"></slot>
      <el-table :data="tableData" style="width: 100%"
        v-loading="loading"
        element-loading-text="玩命加载中..."
        element-loading-spinner="el-icon-loading"
        border>
        <el-table-column v-for="(item, index) in tableColumn" :key="index" 
          :prop="item.prop" 
          :label="item.label" 
          :width="item.width" 
          :minWidth="item.minWidth" 
          :show-overflow-tooltip="item.tip"
          :align="item.align">
        </el-table-column>
        <slot name="otherColumn"></slot>
        <!-- <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >查看</el-button
            >
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">配 点</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "dialogTable",
  props: {
    visible: {
      type: Boolean,
      default: () => false,
    },
    title: {
      type: String,
      default: () => "",
    },
    width: {
      type: String,
    },
    tableColumn: {
      type: Array,
      default: ()=>[]
    },
    tableData: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      dialogVisible: true,
      loading: false
    };
  },
  watch: {
    visible(val) {
      val && (this.dialogVisible = true) && this.$emit("resetVisible");
    },
  },
  mounted() {
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .adjust-dialog {
  .el-dialog__header {
    text-align: left;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
  }
  .el-dialog__header {
    padding: 16px 24px;
  }
  .el-dialog__body {
    border-bottom: 1px solid rgba(233, 233, 233, 1);
  }
  .el-dialog__footer {
  }
}
</style>
