<template>
  <!-- 带自定义输入的选择器组件 -->
  <div class="custom_input_select">
    <el-input
      ref="inputRef"
      v-if="isShowCustomInput"
      v-model.trim="inputStr"
      :size="size"
      placeholder="请输入"
      clearable
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
            @click.native="(e) => selectOptionClick(index, e)"
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
        @click.native="(e) => selectOptionClick(index, e)"
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
      customItemLabel: '',
      modelValue: []
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  computed: {
    // modelValue: {
    //   get() {
    //     return this.value
    //   },
    //   set(val) {
    //     this.$emit('change', val)
    //   }
    // },
  },
  watch: {
    options: {
      handler(val) {
        this.selectOptions = val.map(item => {
          return {
            ...item,
            inputStr: ''
          }
        })
      },
      immediate: true
    },
    value(newVal) {
      if (newVal && newVal.length) {
        this.modelValue = newVal.map(item => {
          let currentItem = this.selectOptions.find(cell => cell.value === item)
          if (currentItem) return item
          currentItem = this.selectOptions.find(cell => cell.inputStr === item)
          return currentItem.value
        })
      } else {
        this.isShowCustomInput = false
        this.modelValue = []
      }
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
          label: `${this.customItemLabel}（${this.inputStr || '请输入'}）`,
          inputStr: this.inputStr
        })
      }
      let newVal = this.modelValue.map(item => {
        const currentItem = this.selectOptions[currentIndex]
        if (item === currentItem.value && currentItem.isCustom) {
          return this.inputStr
        }
        return item
      })
      this.$emit('change', newVal)
    },
    /**
     * 选择改变
     */
    selectChange (val) {
      const customValues = this.selectOptions.filter(item => item.isCustom).map(item => item.value)
      if (val.length) {
        this.isShowCustomInput = customValues.includes(val[val.length - 1])
      } else {
        this.isShowCustomInput  = false
      }
      const currentVal = val[val.length - 1]
      const currentItem = this.selectOptions.find(item => item.value === currentVal)
      if (this.isShowCustomInput) {
        if (currentItem) {
          this.inputStr = currentItem.inputStr
          this.customItemLabel = currentItem.label.replace(/([\(（].*[\)）])/g, '')
        }
        this.$refs.inputRef && this.$refs.inputRef.focus()
      } else {
        this.inputStr = ''
      }
      let newVal = val.map(item => {
        if (item === currentItem.value && currentItem.isCustom) {
          return this.inputStr
        }
        return item
      })
      this.$emit('change', newVal)
    },
    /**
     * 点击选项
     */
    selectOptionClick (index, e) {
      // console.log('selectOptionClick index ====', index, e.target.classList)

      // const currentItem = this.selectOptions[index]
      // // console.log('selectOptionClick index ==== this.modelValue', this.modelValue)

      // let isCheck = false
      // e.target.classList.forEach((item) => {
      //   isCheck = item === 'selected'
      // })

      // console.log('selectOptionClick isCheck ====', isCheck)

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
