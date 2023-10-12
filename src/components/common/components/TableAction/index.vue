<template>
  <div class="table_action_container">
    <!-- 列表操作按钮组件 -->
    <template v-for="(item, i) in singleButtonList" >
      <slot v-if="item.slot" :name="item.slot"></slot>
      <el-button
        v-else-if="item.isShow"
        :key="i"
        :type="item.type || 'text'"
        @click="onClick(item)"
      >
        {{ item.text }}
      </el-button>
    </template>
    <!-- 折叠的部分 -->
    <el-dropdown v-if="filterFoldButtonList.length" :hide-on-click="true" @command="handleCommand">
      <span class="el-dropdown-link"> 更多<i class="el-icon-arrow-down el-icon--right"></i> </span>
      <template slot="dropdown">
        <el-dropdown-menu>
          <template v-for="(item, i) in filterFoldButtonList">
            <el-dropdown-item v-if="item.isShow" :key="i" :command="item.text">
              {{ item.text }}
            </el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>

export default {
  name: 'tableAction',
  props: {
    actionList: {
      type: Array,
      require: true,
      default: () => {
        return [
          /*
          {
            text: '查看', // 按钮文字
            type: 'primary', // 按钮类型，默认 text
            // 点击触发的函数: 回调参数（item, index）
            onClick: this.toForm,
            // 是否渲染（可选：相当于v-if）
            visible: true,
            // 是否不折叠（可选：不传默认折叠）
            single: true,
            slot: 'xxx', // 自定义插槽
          },
          */
        ]
      }
    },
  },
  data() {
    return {
      singleButtonList: [],
      foldButtonList: []
    }
  },
  watch: {
    actionList: {
      handler(newVal) {
        let singleButtonList = []
        let foldButtonList = []
        newVal.forEach((item) => {
          let newItem = {
            ...item,
            isShow: this.checkCondition(item)
          }
          if (item.single) {
            singleButtonList.push(newItem)
          } else {
            foldButtonList.push(newItem)
          }
        })
        this.singleButtonList = singleButtonList
        this.foldButtonList = foldButtonList
      },
      deep: true
    }
  },
  computed: {
    /**
     * 检查权限
     */
    filterFoldButtonList() {
      return this.foldButtonList.filter((item) => {
        return this.checkCondition(item)
      })
    }
  },
  methods: {
    checkCondition(item) {
      if (item.hasOwnProperty('visible') && !item.visible) {
        return false
      }
      return true
    },

    onClick(item) {
      if (typeof item.onClick === 'function') {
        item.onClick()
      } else {
        console.error('onClick 属性应该为 function 类型')
      }
    },

    handleCommand(command) {
      let item = this.foldButtonList.find((cell) => cell.text === command)
      if (item && typeof item.onClick === 'function') {
        item.onClick()
      } else {
        console.error('onClick 属性应该为 function 类型')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table_action_container {
  height: 100%;
  display: inline-flex;
  align-items: center;

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
    margin-left: 8px;
    height: 32px;
    line-height: 32px;
  }

  .dropdown_arrow_icon {
    width: 12px;
    height: 12px;
    color: #409eff;
    margin-left: 5px;
  }

  .el-button {
    min-width: 0;
    height: 32px;
    line-height: 32px;
  }
}
</style>
