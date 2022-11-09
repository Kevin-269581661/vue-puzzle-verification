<!--
    组件相关参数：
        refresh：是否开启刷新，默认false
        space：是否开启密度，默认false
        filter：是否开启列筛选，默认false

        columns：表头数据（
            包括：
                id，
                label：表头列字段，
                prop：与表体数据对应的字段，
                width：列宽度，
                isChecked：默认勾选，
                fix：默认固定（not：不固定；left：左侧固定；right：右侧固定）
            ）
        例如：{ id: 0, label: "资源名称", prop: "resName", width: "120", isChecked: true, fix:"left" },

        refreshTable：刷新列表的函数（在父组件中重新请求数据）
        spaceSetting：更新列表密度的函数（返回间距size给父组件）
        filterColumn：筛选/冻结列表的函数（返回表头数据给父组件，根据情况需要给table添加key来更新表格）
 -->

<template>
  <div class="setting-container">
    <div class="setting-box">
        <refreshComp v-if="refresh" @refreshTable="refreshTable"></refreshComp>
        <spaceComp v-if="space" @spaceSetting="spaceSetting"></spaceComp>
        <filterComp :cacheKey="cacheKey" :columns="columns" @filterColumn="filterColumn" v-if="filter"></filterComp>
    </div>
  </div>
</template>

<script>
import refreshComp from "./refreshComp.vue";
import spaceComp from "./spaceComp.vue";
import filterComp from "./filterComp.vue";

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
        },
        cacheKey: {
            type: String,
            default: () => ''
        }
    },
    components: {
        refreshComp,
        spaceComp,
        filterComp
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
