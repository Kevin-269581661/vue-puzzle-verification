<!--
 * @Author: penglei
 * @Date: 2022-05-26 21:00:12
 * @LastEditors: penglei
 * @LastEditTime: 2022-05-26 21:06:10
 * @FilePath: /frontend/src/components/common/components/Alter/ScheduleAlterCountry.vue
-->
<template>
  <div>
    <el-tooltip class="item" effect="dark" placement="top">
      <slot slot="content">
        <div class="content_wrapper">
          <div
            class="content_item"
            v-for="(item, index) in scheduleData"
            :key="index"
          >
            {{ getScheduleStr(item, index, true) }}
          </div>
        </div>
      </slot>
      <alter class="alter_class">
        <span class="span_class">
          共
          <b>{{ scheduleData.length }}</b>
          个排期，分别为：
          <span class="schedule_text_wrapper">
            <span
              class="span_class"
              v-for="(item, index) in scheduleData"
              :key="index"
            >
              {{ getScheduleStr(item, index) }}
            </span>
          </span>
        </span>
      </alter>
    </el-tooltip>
  </div>
</template>
<script>
import Alter from "./index.vue";
import { api } from "../../../../api/api.js";
export default {
  components: {
    Alter,
  },
  props: {
    detailData: {
      type: Object,
      default: () => {},
    },
    companyId: {
      type: [String, Number],
    },
  },
  data() {
    return {
      scheduleData: [
        // {
        //   apID: 1234, //方案id
        //   pbStar: '2021年07月27日', //开始时间
        //   pbEnd: '2021年07月28日', //结束时间
        //   dateNum: '22', //周数/天数
        //   sideCount: '4', //面数
        //   dateType: '1', //时间单位（周/天） 天1 周2
        // },
      ],
    };
  },
  watch: {
    detailData: {
      handler(val, oldVal) {
        let apID = val.apID;
        //如果是订单详情进入的话，val.apState应该不存在是undefined
        let requestType =
          val.apState == 1 || val.apState == -1 ? "plan" : "order";
        this.getScheduleAlertData(apID, requestType); //获取选点排期alter框信息
      },
      deep: true,
    },
  },
  created() {},
  methods: {
    //获取选点排期alter框信息
    getScheduleAlertData(apID) {
      let info = {
        apID,
        companyId: this.companyId
      };
      api
        .getApi("/national/api/v1/nationalAdPlan/getScheduleInfo", info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.scheduleData = res.data.data;
          } else {
            Message.warning(res.data.MSG);
          }
        })
        .catch((res) => {});
    },
    //根据scheduleData 获得scheduleStr
    getScheduleStr(item, index, istooltip = false) {
      let { pbStar, pbEnd, dateNum, sideCount, weekNum } = item;
      // let unit = dateType == 1 ? '天' : '周'
      let last = index == this.scheduleData.length - 1 ? "" : "、";
      istooltip && (last = "");
      let weekStr = weekNum ? `${weekNum}周` : "";
      let dateStr = dateNum ? `${dateNum}天` : "";
      return `${pbStar}-${pbEnd}（${weekStr}${dateStr}，${sideCount}面）${last}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.alter_class {
  .span_class {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
  }
  .schedule_text_wrapper {
    font-size: 0;
  }

  b {
    color: #1890ff;
  }
}
.content_wrapper {
  .content_item {
    line-height: 18px;
    word-break: break-all;
  }
}
</style>