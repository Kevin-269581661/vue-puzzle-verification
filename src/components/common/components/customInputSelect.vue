<template>
  <!-- 带自定义输入的选择器组件 -->
  <div class="custom_input_select">
    <el-input
      ref="inputRef"
      v-if="isShowCustomInput"
      v-model.trim="inputStr"
      :size="size"
      placeholder="请输入"
      @change="inputChange"
    >
      <div slot="prepend" class="slot_wapper">
        <div class="label_box">{{ customItemLabel }}</div>
        <el-select
          v-model="modelValue"
          multiple
          collapseTags
          @change="selectChange"
        >
          <el-option
            v-for="(item, index) of selectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            @click.native="selectOptionClick(index)"
          ></el-option>
        </el-select>
      </div>
    </el-input>

    <el-select
      v-else
      v-model="modelValue"
      :size="size"
      multiple
      collapseTags
      filterable
      clearable
      placeholder="请选择"
      style="width: 100%"
      @change="selectChange"
    >
      <el-option
        v-for="(item, index) in selectOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        @click.native="selectOptionClick(index)"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'

export default {
  name: 'customInputSelect',
  props: {
    // v-model 绑定的数据
    value: {
      type: Array,
      default: () => []
    },
    // 下拉数据
    options: {
      type: Array,
      default: () => ([
        // { label: '选项1', value: '1', isCustom: true }
      ])
    },
    // medium / small / mini，默认 small
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      isShowCustomInput: false,
      inputStr: '',
      selectOptions: [],
      customItemLabel: ''
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  computed: {
    modelValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('change', val)
      }
    },
  },
  watch: {
    options: {
      handler(val) {
        this.selectOptions = cloneDeep(val)
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 输入改变
     */
    inputChange () {
      if (!this.modelValue.length) return
      const currentVal = this.modelValue[this.modelValue.length - 1]
      const currentIndex = this.selectOptions.findIndex(item => item.value === currentVal)
      if (currentIndex !== -1) {
        this.$set(this.selectOptions, currentIndex, {
          ...this.selectOptions[currentIndex],
          label: `${this.customItemLabel}（${this.inputStr}）`,
          value: this.inputStr
        })
      }
      // console.log('this.selectOptions ===', this.selectOptions)
    },
    /**
     * 选择改变
     */
    selectChange (val) {
      // console.log('handleChange === ', val)
      // console.log('handleChange selectOptions === ', this.selectOptions)
      const customValues = this.selectOptions.filter(item => item.isCustom).map(item => item.value)
      // console.log('handleChange customValues === ', customValues)
      if (val.length) {
        this.isShowCustomInput = customValues.includes(val[val.length - 1])
      } else {
        this.isShowCustomInput  = false
      }
      if (this.isShowCustomInput) {
        const currentVal = val[val.length - 1]
        // console.log('handleChange currentVal === ', currentVal)
        const currentItem = this.selectOptions.find(item => item.value === currentVal)
        // console.log('handleChange currentItem === ', currentItem)
        if (currentItem) {
          this.inputStr = currentItem.value
          this.customItemLabel = currentItem.label.replace(/([\(（].*[\)）])/g, '')
        }
        this.$refs.inputRef && this.$refs.inputRef.focus()
      } else {
        this.inputStr = ''
      }
    },
    /**
     * 点击选项
     */
    selectOptionClick (index) {
      console.log('selectOptionClick index ====', index)
      const currentItem = this.selectOptions[index]
      console.log('selectOptionClick index ==== this.modelValue', this.modelValue)

      // const isCheck =
    }

  }
}
</script>

<style lang="scss" scoped="scoped">
.custom_input_select {

  /deep/ .el-input .el-input-group__prepend {
    border-radius: 4px 0 0 4px;
    box-sizing: border-box !important;
    padding: 0;
    width: 80px;
    border: none;
  }

  /deep/ .el-input .el-input-group__prepend .el-select{
    margin: 0;
    width: 80px;
    border-radius: 4px 0 0 4px;
    background-color: transparent;
  }

  /deep/ .el-select .el-select__tags{
    height: 100%;
    overflow: auto;
  }

  .slot_wapper {
    position: relative;
    z-index: 1;
    &::before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border: 1px solid #DCDFE6;
      border-right: 0;
      border-radius: 4px 0 0 4px;
      box-sizing: border-box;
    }


    .label_box {
      border: 1px solid #DCDFE6;
      border-right: 0;
      border-radius: 4px 0 0 4px;
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: calc(100% - 28px);
      background-color: #F5F7FA;
      z-index: 100;
      padding-left: 10px;
      display: flex;
      align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      box-sizing: border-box;
    }
  }
}
</style>
