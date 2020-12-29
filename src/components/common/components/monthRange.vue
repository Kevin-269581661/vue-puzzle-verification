<template>
  <div class="range-month">
    <el-date-picker
      ref="start"
      size="mini"
      v-model="defaultDate[0]"
      type="month"
      value-format="yyyy-MM"
      placeholder="开始月份"
      @change="setValue1">
    </el-date-picker>
    至
    <el-date-picker
      ref="end"
      size="mini"
      v-model="defaultDate[1]"
      type="month"
      value-format="yyyy-MM"
      placeholder="结束月份"
      @change="setValue2">
    </el-date-picker>
  </div>
</template>

<script>
import moment from "moment"
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
    };
  },
  computed: {
    dateRangeArr() {
      return [this.value1, this.value2]
    }
  },
  watch: {
    dateRangeArr(newVal, oldVal) {
      // prop（defaultDate） 会触发 watch， v-model会多次触发watch所以使用@change
      let [temp1, temp2] = this.defaultDate
      if(!temp1) {
        this.$refs.start.focus()
      } else if(!temp2) {
        this.$refs.end.focus()
      } else if(Date.parse(temp1)>Date.parse(temp2)) {
        this.$message.warning('开始月份不能大于结束月份哟~')
      } else {
        // console.log('dateRange---', this.defaultDate)
        this.$emit('changRange', this.params, this.defaultDate)
      }
    },
  },
  methods: {
    setValue1(val) {
      this.value1 = val
    },
    setValue2(val) {
      this.value2 = val
    }
  },
};
</script>

<style lang="scss" scoped>
  .range-month {
    display: flex;
    align-items: center;
  }
</style>
