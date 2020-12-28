<template>
  <div class="range-month">
    <el-date-picker
      ref="start"
      size="mini"
      v-model="value1"
      type="month"
      value-format="yyyy-MM"
      placeholder="开始月份">
    </el-date-picker>
    至
    <el-date-picker
      ref="end"
      size="mini"
      v-model="value2"
      type="month"
      value-format="yyyy-MM"
      placeholder="结束月份">
    </el-date-picker>
  </div>
</template>

<script>
export default {
  name: "monthRange",
  props: {
    params: {
      type: Array,
      default: ()=>[]
    },
    defaultDate: {
      type: Array,
      required: true,
      default: ()=>[new Date(), new Date()]
    }
  },
  data() {
    return {
      value1: '',
      value2: '',
      timeout: null
    };
  },
  computed: {
    dateRangeArr() {
      return [this.value1, this.value2]
    }
  },
  watch: {
    defaultDate(newVal, oldVal) {
      [this.value1, this.value2] = newVal
    },
    dateRangeArr(newVal, oldVal) {
      let [temp1, temp2] = newVal
      if(!temp1) {
        this.$refs.start.focus()
      } else if(!temp2) {
        this.$refs.end.focus()
      } else if(Date.parse(temp1)>Date.parse(temp2)) {
        this.$message.warning('开始月份不能大于结束月份哟~')
      } else {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          console.log('---2', newVal)
          this.$emit('changRange', this.params, newVal)
        }, 800)
      }
    },
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
  .range-month {
    display: flex;
    align-items: center;
  }
</style>
