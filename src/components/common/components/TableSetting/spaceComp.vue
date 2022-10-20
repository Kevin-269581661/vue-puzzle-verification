<template>
  <el-dropdown
    placement="bottom"
    :hide-on-click="false"
    trigger="click"
    @command="handleCommand"
  >
    <el-tooltip
      class="item"
      effect="dark"
      content="密度"
      placement="top"
      style="cursor: pointer"
    >
      <span class="el-dropdown-link">
        <i style="font-size: 22px" class="el-icon-d-caret"></i>
      </span>
    </el-tooltip>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        command="medium"
        :class="size === 'medium' ? 'item-focus' : ''"
        >默认</el-dropdown-item
      >
      <el-dropdown-item
        command="small"
        :class="size === 'small' ? 'item-focus' : ''"
        >中等</el-dropdown-item
      >
      <el-dropdown-item
        command="mini"
        :class="size === 'mini' ? 'item-focus' : ''"
        >紧凑</el-dropdown-item
      >
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { addLocalCache, getLocalCache } from "@/utils/user.js";
export default {
  data() {
    return {
      size: "medium",
    };
  },
  mounted() {
    const size = getLocalCache("rowSpace");
    this.size = size || "medium";
  },
  methods: {
    handleCommand(command) {
      addLocalCache("rowSpace", command);
      const size = getLocalCache("rowSpace");
      this.size = size || "medium";
      this.size = command;
      this.$emit("spaceSetting", command);
    },
  },
};
</script>

<style lang="scss" scoped>
.item-focus {
  background-color: #e8f4ff;
  color: #46a6ff;
}
</style>
