<template>
  <div class="setting-container">
    <div class="setting-box">
        <refreshComp v-if="refresh" @refreshTable="refreshTable"></refreshComp>
        <spaceComp v-if="space" @spaceSetting="spaceSetting"></spaceComp>
        <!-- <filterComp v-if="filter"></filterComp> -->
        <dragComp :columns="columns" @filterColumn="filterColumn" v-if="filter"></dragComp>
    </div>
  </div>
</template>

<script>
import refreshComp from "./refreshComp.vue";
import spaceComp from "./spaceComp.vue";
import filterComp from "./filterComp.vue";
import dragComp from "./dragComp.vue";

export default {
    props: {
        refresh: {
            type: Boolean,
            default: () => false
        },
        space: {
            type: Boolean,
            default: () => false
        },
        filter: {
            type: Boolean,
            default: () => false
        },
        columns: {
            type: Array,
            default: () => []
        }
    },
    components: {
        refreshComp,
        spaceComp,
        filterComp,
        dragComp
    },
    data() {
        return {};
    },
    methods: {
        refreshTable() {
            this.$emit("refreshTable");
        },
        spaceSetting(size) {
            this.$emit("spaceSetting", size);
        },
        filterColumn(columns) {
            this.$emit("filterColumn", columns)
        }
    },
};
</script>

<style lang="scss" scoped>
.setting-container {
  .setting-box {
    display: flex;
  }
}
</style>>
