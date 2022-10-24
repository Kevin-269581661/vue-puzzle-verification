<template>
  <div class="setting-container">
    <div class="setting-box">

        <slot name="refresh">
            <refreshComp @refreshTable="refreshTable"></refreshComp>
        </slot>


        <slot name="space">
            <spaceComp @spaceSetting="spaceSetting"></spaceComp>
        </slot>


        <slot name="filter">
            <filterComp></filterComp>
        </slot>

    </div>
  </div>
</template>

<script>
import refreshComp from "./refreshComp.vue";
import spaceComp from "./spaceComp.vue";
import filterComp from "./filterComp.vue";

export default {
  components: {
    refreshComp,
    spaceComp,
    filterComp,
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
  },
};
</script>

<style lang="scss" scoped>
.setting-container {
  .setting-box {
    float: right;
    display: flex;
    width: 90px;
    justify-content: space-between;
  }
}
</style>>
