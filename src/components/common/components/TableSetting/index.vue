<template>
  <div class="setting-container">
    <div class="setting-box">
      <refreshComp @refreshTable="refreshTable"></refreshComp>
      <spaceComp @spaceSetting="spaceSetting"></spaceComp>
      <filterComp></filterComp>
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
  padding: 16px 0px;
  width: 100%;
  .setting-box {
    float: right;
    display: flex;
    width: 90px;
    justify-content: space-between;
  }
}
</style>>
