<template>
  <div class="time_frame_select">
    <!-- 时段选择器 - 组件 -->
    <table class="table_box" cellpadding="0" cellspacing="0">
      <colgroup>
        <col width="66px">
        <col v-for="i in 48" :key="i" width="12px">
      </colgroup>
      <thead>
        <tr>
          <th rowspan="2">星期/时间</th>
          <th colspan="24">00 : 00 - 12 : 00</th>
          <th colspan="24">00 : 00 - 12 : 00</th>
        </tr>
        <tr>
          <th v-for="i in 24" :key="i" colspan="2">{{ i - 1 > 9 ? i - 1 : '0' + (i - 1) }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in selectDataList" :key="i">
          <td class="day_box">{{ dayList[i] }}</td>
          <td
            v-for="(col, j) in row"
            :key="j"
            :class="{active: col === 1}"
            @click="handleTdClick(i, j)"
            @mousedown="handleTdMouseDown($event, i, j)"
          >
            <!-- {{ col }} -->
          </td>
        </tr>
      </tbody>
    </table>
    <div class="footer_box">
      <div class="tip_bar">
        <span>请用鼠标点选时间段</span>
        <el-button type="text" class="clear_btn" size="small" @click="clearSelect">清空</el-button>
      </div>
      <div v-if="isShowSelectList" class="selected_list">
        <div v-for="(value, key) in selectFormatObj" :key="key" class="selected_item">
          <span class="day_text">{{ key }}：</span>
          <div>
            <span v-for="(item, i) in value" :key="i" class="time_text">{{ i === value.length - 1 ? item : item + '、' }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

const initSelectDataList = () => {
  let list = []
  for (let i = 0; i < 7; i++) {
    list.push(Array(48).fill(0))
  }
  return list
}

export default {
  name: 'timeFrameSelect',
  props: {
    value: {
      type: Array,
      require: true

    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  // emits: ['change'],
  data () {
    return {
      dayList: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      selectDataList: initSelectDataList(),
      selectFormatObj: {},
    };
  },
  computed: {
    isShowSelectList() {
      return !!Object.keys(this.selectFormatObj).length
    }
  },
  watch: {
    // value: {
    //   handler (val) {
    //     console.log('value === ', val)
    //     if (!val || !val.length) {
    //       this.selectDataList = initSelectDataList()
    //     } else {
    //       this.selectDataList = JSON.parse(JSON.stringify(val))
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
    selectDataList: {
      handler (val) {
        console.log('selectDataList === ', val)
        this.handleSelectDataFormat()
        let newValue = []
        if (JSON.stringify(val) !== JSON.stringify(initSelectDataList())) {
          newValue = val.map(item => item.join(''))
        }
        this.$emit('change', newValue)
      },
      deep: true
    }
  },
  methods: {
    formatNumer(num) {
      return num < 10 ? '0' + num : num
    },
    getFormateTime(minutes) {
      let hourStr = '', minuteStr = ''
      hourStr = this.formatNumer(Math.floor(minutes / 60))
      minuteStr = this.formatNumer(minutes % 60)
      return `${hourStr} : ${minuteStr}`
    },
    /**
     * 解析数据显示时段
     */
    handleSelectDataFormat() {
      let obj = {}, list = [], isContinuous = true
      this.selectDataList.forEach((row, rIndex) => {
        const dayStr = this.dayList[rIndex]
        row.forEach((col, cIndex) => {
          if (col) {
            if (!isContinuous) isContinuous = true
            let startMinutes = cIndex * 30
            let endMinutes = (cIndex + 1) * 30
            let endTimeStr = this.getFormateTime(endMinutes)
            if (endTimeStr === '24 : 00') endTimeStr = '23 : 59'
            let resStr = this.getFormateTime(startMinutes) + ' - ' + endTimeStr
            list.push(resStr)
          } else {
            isContinuous = false
          }
          if (!isContinuous && list.length) {
            if (!(dayStr in obj)) obj[dayStr] = []
            obj[dayStr].push(JSON.parse(JSON.stringify(list)))
            list = []
          }
        })
        // 处理最后一次
        if (list.length) {
          if (!(dayStr in obj)) obj[dayStr] = []
          obj[dayStr].push(JSON.parse(JSON.stringify(list)))
          list = []
        }
      })
      console.log('obj ====', obj)
      const newObj = {}
      Object.keys(obj).forEach(key => {
        newObj[key] = []
        let newList = []
        obj[key].forEach(list => {
          // 合并时段
          if (list.length > 1) {
            let start = list[0].split(' - ')[0]
            let end = list[list.length - 1].split(' - ')[1]
            // list.length = 0
            // list.push(start + ' - ' + end)
            newList.push(start + ' - ' + end)
          } else {
            newList.push(list[0])
          }
        })
        newObj[key] = newList
      })
      console.log('newObj ====', newObj)
      this.selectFormatObj = newObj
    },
    handleTdClick (rowIndex, colIndex) {
      // console.log('handleTdClick === ', rowIndex, colIndex)
      const newVal = this.selectDataList[rowIndex][colIndex] ? 0 : 1
      this.$set(this.selectDataList[rowIndex], colIndex, newVal)
      // console.log('handleTdClick === ', this.selectDataList)
    },
    handleTdMouseDown (e, rowIndex, colIndex) {
      // console.log('handleTdMouseDown === ', e, rowIndex, colIndex)
      let isClick = true
      let startX = e.clientX
      let startY = e.clientY
      let startOffsetX = e.offsetX
      let startOffsetY = e.offsetY
      // 边框宽度 1px
      let width = e.target.clientWidth + 1
      let height = e.target.clientHeight + 1
      let changeHistorySet = new Set()

      console.log('handleTdMouseDown === ',e, startX, startY, startOffsetX, startOffsetY)

      let handleTdMouseMove =  (e) => {
        isClick = false
        let endX = e.clientX
        let endY = e.clientY
        let endOffsetX = e.offsetX
        let endOffsetY = e.offsetY
        let distanceX = endX - startX
        let distanceY = endY - startY
        console.log('handleTdMouseMove === ', distanceX, distanceY, endOffsetX, endOffsetY)
        let countX = 0
        let countY = 0
        let isRight = false
        let isDown = false
        // 向右
        if (distanceX > 0) {
          isRight = true
          countX = Math.ceil((distanceX + startOffsetX) / width)
        }
        // 向左
        else if (distanceX < 0) {
          isRight = false
          countX = Math.ceil((Math.abs(distanceX) + (width - startOffsetX)) / width)
        }
        // 向下
        if (distanceY > 0) {
          isDown = true
          countY = Math.ceil((distanceY + startOffsetY) / height)
        }
        // 向上
        else if (distanceY < 0) {
          isDown = false
          countY = Math.ceil((Math.abs(distanceY) + (height - startOffsetY)) / height)
        }

        const checkOnceRender = (rowIndex, colIndex) => {
          const positionId = `${rowIndex}_${colIndex}`
          if (!changeHistorySet.has(positionId)) {
            changeHistorySet.add(positionId)
            // const newVal =  this.selectDataList[rowIndex][colIndex] ? 0 : 1
            const newVal =  1
            this.$set(this.selectDataList[rowIndex], colIndex, newVal)
          }
        }

        for (let i = 0; i < countX; i++) {
          let newColIndex = 0
          if (isRight) {
            newColIndex = colIndex + i
            if (newColIndex > 47) break
            checkOnceRender(rowIndex, newColIndex)
          } else {
            newColIndex = colIndex - i
            if (newColIndex < 0) break
            checkOnceRender(rowIndex, newColIndex)
          }
          for (let j = 0; j < countY; j++) {
            let newRowIndex = 0
            if (isDown) {
              newRowIndex = rowIndex + j
              if (newRowIndex > 6) break
              checkOnceRender(newRowIndex, newColIndex)
            } else {
              newRowIndex = rowIndex - j
              if (newRowIndex < 0) break
              checkOnceRender(newRowIndex, newColIndex)
            }
          }
        }
      }

      let handleTdMouseUp =  (e) => {
        changeHistorySet.clear()
        document.removeEventListener("mousemove", handleTdMouseMove)
        document.removeEventListener("mouseup", handleTdMouseUp)
      }
      document.addEventListener("mousemove", handleTdMouseMove);
      document.addEventListener("mouseup", handleTdMouseUp);
    },

    clearSelect() {
      this.selectDataList = initSelectDataList()
    }
  },
  mounted () {
    if (!this.value || !this.value.length) {
      this.selectDataList = initSelectDataList()
    } else {
      let list = this.value.map(item => {
        return item.split('').map(cell => Number(cell))
      })
      console.log('mounted list ===== ', list)
      this.selectDataList = list
    }
  },

};
</script>

<style lang="scss" scoped>
.time_frame_select {
  width: 642px;
  .table_box {
    border-collapse: collapse;
    td,th {
      border: 1px solid rgba(0, 0, 0, 0.06);
      height: 28px;
      user-select: none;
    }
    th {
      color: rgba(0, 0, 0, 0.85);
      text-align: center;
      font-family: Roboto;
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      background: #FAFAFA;
    }
    td {
      color: rgba(0, 0, 0, 0.85);
      text-align: center;
      font-family: Roboto;
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      &.active {
        background: #1890FF;
      }
    }
    .day_box {
      background: #FAFAFA;
    }
  }

  .footer_box {
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-top: none;
    .tip_bar {
      color: rgba(0, 0, 0, 0.85);
      text-align: center;
      font-family: Roboto;
      font-size: 14px;
      font-weight: 500;
      line-height: 22px;
      position: relative;
      height: 40px;
      line-height: 40px;
    }
    .clear_btn {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    .selected_list {
      border-top: 1px solid rgba(0, 0, 0, 0.06);
      background: #FAFAFA;
      padding: 8px 16px;
      .selected_item {
        color: rgba(0, 0, 0, 0.85);
        text-align: left;
        font-family: Roboto;
        font-size: 14px;
        font-weight: 500;
        line-height: 22px;
        display: flex;
        .day_text, .time_text {
          white-space: nowrap;
        }
      }
    }
  }
}

</style>
