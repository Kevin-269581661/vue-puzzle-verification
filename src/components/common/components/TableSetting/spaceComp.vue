<template>
    <div style="margin-left: 8px;">
        <el-dropdown
        placement="bottom"
        :hide-on-click="false"
        trigger="click"
        @command="handleCommand"
        >
            <span class="el-dropdown-link" style="cursor: pointer">
                <el-tooltip class="item" effect="dark" content="密度" placement="top">
                    <i style="font-size: 22px; color: rgba(0, 0, 0, 0.65);" class="el-icon-d-caret"></i>
                </el-tooltip>
            </span>
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
    </div>
</template>

<script>
import { addLocalCache, getLocalCache } from "@/utils/user.js";
export default {
  props: {
    cacheKey: {
        type: String,
        default: () => ''
    }
  },
  data() {
    return {
      size: "medium",
    };
  },
  mounted() {
    const size = getLocalCache(`${this.cacheKey}-rowSpace`);
    this.size = size || "medium";
  },
  methods: {
    handleCommand(command) {
      addLocalCache(`${this.cacheKey}-rowSpace`, command);
      const size = getLocalCache(`${this.cacheKey}-rowSpace`);
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
