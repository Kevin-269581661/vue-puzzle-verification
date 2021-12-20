<template>
  <div class="range-month">
    <el-date-picker
      ref="start"
      size="mini"
      :clearable="clearable"
      :editable="false"
      v-model="defaultDate[0]"
      type="month"
      value-format="yyyy-MM"
      format="yyyy-MM"
      placeholder="开始月份"
      @change="setValue1">
    </el-date-picker>
    &nbsp;至&nbsp;
    <el-date-picker
      ref="end"
      size="mini"
      :clearable="clearable"
      :editable="false"
      v-model="defaultDate[1]"
      type="month"
      value-format="yyyy-MM"
      format="yyyy-MM"
      placeholder="结束月份"
      @change="setValue2">
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
      default: ()=>['', '']
    },
    clearable: {
      type: Boolean,
      default: ()=>true
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
      }
      if(Date.parse(temp1)>Date.parse(temp2)) {
        this.$message.warning('开始月份不能大于结束月份哟~')
      } else {
        // console.log('dateRange---params', this.params)
        // console.log('dateRange---defaultDate', this.defaultDate)
        this.defaultDate.forEach((item,index)=>{
          if(typeof item!=='string'){
            let year=item.getFullYear()
            let month
            month = item.getMonth() + 1;
            if (month < 10) {
              month = "0" + month;
            }
            this.defaultDate[index]=year+'-'+month
          }
          console.log('item：',item)
        })
        this.defaultDate.forEach((item,index)=>{ 
          let dateArr=item.split('-')
          if(index==1){
            //起始时间
            this.defaultDate[index]=dateArr[0]+'-'+dateArr[1]+'-01'
          }else{
            //截止时间
            this.defaultDate[index]=dateArr[0]+'-'+dateArr[1]+'-'+new Date(dateArr[0], dateArr[1], 0).getDate();
          }
        })
        // console.log('newDefaultDate',this.defaultDate)
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
