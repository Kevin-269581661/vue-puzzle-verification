<!--
 * @Author: penglei
 * @Date: 2021-06-10 16:20:45
 * @LastEditors: penglei
 * @LastEditTime: 2021-06-10 18:46:52
 * @FilePath: /frontend/src/components/common/components/autoAddOption.vue
-->
<template>
  <div class="row-select">
    <div class="row-select__option" v-for="(item, index) in tempValueArr" :key="index">
      <span>{{ item }}</span>
      <span @click="spliceArr(index)">x</span>
    </div>
    <el-input
      v-if="edit"
      size="small"
      v-model="tempInputVal"
      @change="inputChange"
      style="width: 90px"
    ></el-input>
    <div v-else @click="edit = true">+ 选项</div>
  </div>
</template>
<script>
export default {
  name: "autoAddOption",
  components: {},
  props: {
    value: {
      type: [Array, String, Number, Object],
      default: () => [],
    },
  },
  data() {
    return {
      edit: false,
      tempInputVal: "",
      tempValueArr: []
    };
  },
  watch: {
    value(newVal, oldVal) {
      if(Array.isArray(newVal)) {
        this.tempValueArr = newVal
      }
    }
  },
  created() {
    console.log("value-=--", this.value);
  },
  methods: {
    inputChange(val) {
      console.log("-e-", val, this);
      if (this.value.includes(val)) {
        this.$message.warning("该选项已存在！");
      } else {
        this.tempValueArr.push(val)
        this.tempInputVal = ''
        this.$emit("input", this.tempValueArr);
        this.edit = false;
      }
    },
    spliceArr(index) {
      this.tempValueArr.splice(index, 1)
      this.$emit("input", this.tempValueArr);
    }
  },
  mounted() {},
};
</script>

<style scoped lang="scss">
.row-select {
  display: flex;
  align-items: center;
  .row-select__option {
    height: 20px;
    padding: 0 8px;
    margin-right: 8px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
    line-height: 20px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 2px;
    background: rgba(0, 0, 0, 0.04);
  }
}
</style>
