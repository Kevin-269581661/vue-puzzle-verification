<template>
    <div style="margin-left: 8px;">
        <span style="cursor: pointer" @click="refreshTable">
            <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                <i style="font-size: 22px; color: rgba(0, 0, 0, 0.65);" class="el-icon-refresh-right"></i>
            </el-tooltip>
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

<style lang="scss">
</style>
