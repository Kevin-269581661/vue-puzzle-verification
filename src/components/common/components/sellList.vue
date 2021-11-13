<template>
  <div>
    <ul class="timeline">
      <li v-for="(item, index) in list" :key="index" class="timeline_item">
        <div class="line_tail"></div>
        <div class="line_head"></div>
        <div class="line_content">
          <p class="time">
            {{ item.time }}
            <span :class="[getcolor(item.type), 'tag']">{{ item.type }}</span>
          </p>
          <div class="u-item">
            <span style="width: 56px">处理人：</span>
            <div class="u-ctn">xxx</div>
          </div>
          <div class="u-item">
            <span>操作：</span>
            <div class="u-ctn">xxx</div>
          </div>
          <div class="u-item">
            <span>说明：</span>
            <div class="u-ctn">
              {{ item.text }}
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  data () {
    return {

    }
  },
  methods: {
    getcolor (type) {
      if (type == '巡点') {
        return 'blue';
      } else if (type == '待维修') {
        return 'yellow';
      } else {
        return 'red';
      }
    },
    toHandle (item) {
      this.$emit('toHandle', item)
    },
  },
}
</script>

<style scoped lang="scss">
/* 处理弹出框日志组件 */
.timeline {
  list-style: none;
  margin: 0;
  padding: 15px;
  height: 390px;
  overflow-x: hidden;
  overflow-y: scroll;
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 1);
}
.timeline::-webkit-scrollbar {
  width: 6px;
  background: #fafafa;
}

.timeline::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #c1c1c1;
  border-radius: 4px;
}
.timeline_item {
  margin: 0 !important;
  padding: 0 0 12px;
  list-style: none;
  position: relative;
}
.line_tail {
  height: 100%;
  border-left: 1px solid #1890ff;
  position: absolute;
  left: 4px;
  top: 3px;
}
.line_head {
  width: 7px;
  height: 7px;
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid #1890ff;
  position: absolute;
  color: #1890ff;
  top: 3px;
}
.line_content {
  padding: 1px 1px 10px 24px;
  font-size: 12px;
  position: relative;
  top: -3px;
}
.line_content .tag {
  font-size: 10px;
  padding: 0 2px;
  border-radius: 2px;
}
.time {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
  position: relative;
}

.content {
  padding: 2px 6px;
  font-size: 14px;
  width: auto;
  color: rgba(0, 0, 0, 0.65);
  border-radius: 0px 30px 30px 40px;
  display: inline-block;
  max-height: 130px;
  height: auto;
  margin-bottom: 2px;
}
.content p:last-child {
  font-size: 12px;
  margin-top: 5px;
}
.timeline_item:last-child .line_tail {
  display: none;
}
.blue {
  border: 1px solid #3c95ff;
  color: #3c95ff;
  background: #cbe0fd;
}
.yellow {
  border: 1px solid #ff7f3c;
  color: #ff7f3c;
  background: #f2dbd6;
}
.red {
  border: 1px solid #ff7070;
  color: #ff7070;
  background: #ffe2e2;
}
.handleBtn {
  color: #1890ff;
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
}

.u-item {
  display: flex;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
  span {
    display: inline-block;
  }
  .u-ctn {
    flex: 1;
  }
}
</style>
