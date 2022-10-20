<template>
  <el-tooltip
    class="item"
    effect="dark"
    content="刷新"
    placement="top"
    style="cursor: pointer"
  >
    <span @click="refreshTable">
      <i style="font-size:22px;" class="el-icon-refresh-left"></i>
    </span>
  </el-tooltip>
</template>

<script>
export default {
  methods: {
    refreshTable() {
      this.$emit("refreshTable");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
