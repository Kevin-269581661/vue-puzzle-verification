<template>
    <div style="margin-left: 8px;">
        <span style="cursor: pointer" @click="refreshTable">
            <i style="font-size: 22px; color: rgba(0, 0, 0, 0.85);" class="el-icon-refresh-left"></i>
        </span>
    </div>
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
