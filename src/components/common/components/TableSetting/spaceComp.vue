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
      <el-dropdown-item command="medium">默认</el-dropdown-item>
      <el-dropdown-item command="small">中等</el-dropdown-item>
      <el-dropdown-item command="mini">紧凑</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  methods: {
    handleCommand(command) {
      this.$emit("spaceSetting", command);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
