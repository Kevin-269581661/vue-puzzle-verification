<template>
  <span style="cursor: pointer" @click="refreshTable">
    <i style="font-size: 22px" class="el-icon-refresh-left"></i>
  </span>
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
