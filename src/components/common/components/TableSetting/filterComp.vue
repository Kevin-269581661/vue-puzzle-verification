<template>
  <el-popover placement="bottom" width="40" trigger="click">
    <div class="filter-top">
      <el-checkbox>列展示</el-checkbox>
      <span>重置</span>
    </div>
    <div class="filter-left">
      <div>固定在左侧</div>
      <div>不固定</div>
      <div>固定在右侧</div>
      <el-tree
        :data="data"
        node-key="id"
        show-checkbox
        default-expand-all
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
      >
      </el-tree>
    </div>
    <span slot="reference" style="cursor: pointer">
      <i style="font-size: 22px" class="el-icon-setting"></i>
    </span>
  </el-popover>
</template>

<script>
export default {
  data() {
    return {
      data: [
        { id: 1, label: "资源名称" },
        { id: 2, label: "媒体类型" },
        { id: 4, label: "媒体名称" },
        { id: 5, label: "投放面" },
        { id: 6, label: "资产编号" },
        { id: 7, label: "资源类型" },
        { id: 8, label: "城市" },
        { id: 9, label: "区域" },
        { id: 10, label: "商圈" },
        { id: 11, label: "媒体位置" },
        { id: 12, label: "媒体ID" },
        { id: 13, label: "设备ID" },
        { id: 14, label: "设备类型" },
        { id: 15, label: "创建日期" },
        { id: 16, label: "操作" },
      ],
    };
  },
  methods: {
    allowDrop(draggingNode, dropNode, type) {
      if (type !== "inner") {
        return true;
      } else {
        return false;
      }
    },
    allowDrag(draggingNode) {
      console.log(draggingNode);
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-top {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  /deep/ .el-checkbox {
    padding: 12px;
  }
  span {
    cursor: pointer;
    color: #1890ff;
    padding: 12px 12px;
  }
}

/deep/ .el-popover {
  padding: 0;
}
</style>
