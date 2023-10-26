<template>
  <div class="table_search_container">
    <!-- 列表-搜索栏通用组件 -->
    <SearchItems
      v-bind="$attrs"
      :fileds="renderFileds"
      :size="size"
      @change="k => $emit('change', k)"
      @search="$emit('search')"
      @reset="$emit('reset')"
    >
      <!-- 插槽 -->
      <template v-for="(_, name) in $slots" :slot="name" >
        <slot :name="name" />
      </template>
      <template v-if="foldVisible" slot="fold">
        <el-button type="text" :size="size" @click.stop="handleFold">
          {{ isShowAll ? '收起' : '展开' }}<i :class="`el-icon-arrow-${ isShowAll ? 'up' : 'down' }`"></i>
        </el-button>
      </template>
    </SearchItems>
  </div>
</template>

<script>
/*
列表-搜索栏动态配置通用组件

  组件属性：
    value: [Object] 必传 - 搜索栏数据绑定的对象
    fileds: [Object] 必传 - 表单配置对象
    labelWidth: [Number] 非必传（默认自动适应）- 统一标签宽度
    size: [String] 非必传（可选值：medium / small / mini，默认 small）- 尺寸
    defaultCount: [Number] 非必传（默认 5）- 折叠时显示的字段数量

  组件事件：
    change: [Function(key)] 搜索栏数据改变时触发
      参数: key - 改变的字段名
    search: [Function] 点击搜索按钮触发
    reset: [Function] 点击重置按钮触发

  组件用法：

  <TableSearch
    :value="searchData"
    :fileds="searchFileds"
    @change="handleSeachChange"
    @search="handleSearch"
    @reset="handleReset"
  >
    <template slot="filedName1">
      slot
    </template>

    <template slot="filedName2">
      slotContent
    </template>

    <template slot="action">
      <el-button type="plain">导出</el-button>
    </template>
  </TableSearch>

  import TableSearch from "@/components/common/components/TableSearch/index.vue";

  components: {
    TableSearch
  },
  data() {
    return {
      // 搜索栏配置字段项
      searchFileds: {
        filedName: {
          title: string,
          type: 'input' | 'select' | 'date' | 'date-picker' | 'date-picker-two' | 'input-two',
          // 组件属性: 默认带的属性: clearable: true
          props: {

          },
          // 特殊属性
          // type 类型为 select 时使用：必传 - 需要配置 options 属性
          options: [
            {
              value: string | number,
              label: string,
              disabled: boolean, // 非必传（默认 false）- 是否禁用
              render (h) { // 非必传 - 自定义渲染节点

              }
            }
          ],
          // type 类型为 select 时使用：非必传 - 配置 value、label 字段名
          optionKey: {
            value: 'value'
            label: 'label'
          }
          on: {
            change: (e) => {
              console.log('name组件 change  ===', e)
            }
          },
          // 自定义插槽
          slot: 'filedName1',
          // 自定义插槽（ title 有效）
          slotContent: 'filedName2'
        }
      },
      // 搜索栏字段绑定数据源
      searchData: {
        filedName: '',
      },
    }
  },
  methods: {

    headerSeachChange(filed) {
      console.log('headerSeachChange ===', filed, this.searchData[filed])
    },

    handleSearch() {
      console.log('列表搜索 ===')
    },

    handleReset() {
      console.log('列表重置 ===')
    }
  }

 */

import SearchItems from './components/searchItems.vue'

export default {
  name: 'tableSearch',
  components: { SearchItems },
  inheritAttrs: false,
  props: {
    // 表单配置
    fileds: {
      type: Object,
      default() {
        return {}
      }
    },
    size: {
      type: String,
      default: 'small'
    },
    // 默认显示字段数量
    defaultCount: {
      type: Number,
      default: 5
    },
  },
  data() {
    return {
      isShowAll: false
    }
  },
  computed: {
    renderFileds() {
      if (this.isShowAll) return this.fileds
      let obj = {}
      Object.keys(this.fileds)
        .filter((_, i) => i < this.defaultCount)
        .forEach(key => {
          obj[key] = this.fileds[key]
        })
      return obj
    },
    foldVisible() {
      return Object.keys(this.fileds).length > this.defaultCount
    }
  },
  methods: {
    handleFold() {
      this.isShowAll = !this.isShowAll
    }
  },
}
</script>

<style lang="scss" scoped>
.table_search_container {
  padding: 24px 24px 8px;
  box-sizing: border-box;
  .el-button--text {
    padding-left: 0;
    padding-right: 0;
    min-width: 0;
  }
}
</style>
