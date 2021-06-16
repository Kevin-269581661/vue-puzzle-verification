<!--
 * @Author: penglei
 * @Date: 2021-06-15 10:52:08
 * @LastEditors: penglei
 * @LastEditTime: 2021-06-16 20:26:46
 * @FilePath: /frontend/src/components/develop/components/constractFinished.vue
-->
<template>
  <div class="createSuccess">
    <div class="successIcon">
      <img src="../../../assets/images/createSuccess.png" alt="" />
      <h2>创建成功</h2>
      <p>创建时间：{{ createDate }}</p>
    </div>
    <div class="planPanel">
      <ul>
        <li><em>资源名称：</em>{{ recFormData.resName || "" }}</li>
        <li><em>物业公司：</em>{{ recFormData.pmc || "" }}</li>
        <li>
          <em>合同期限：</em
          >{{
            `${constractFormData.startDate} 至 ${constractFormData.endDate}`
          }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import timeFormat from "../../../commonFun/timeFormat.js";
export default {
  name: "constractFinished",
  props: {
    recFormData: {
      type: Object,
      required: true,
      default: () => {},
    },
    constractFormData: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      createDate: null,
    };
  },
  watch: {},
  computed: {},
  mounted() {
    this.createDate = timeFormat.returnDayCount(0, "/");
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
/*完成创建*/
.createSuccess {
  padding-bottom: 48px;
}
.successIcon img {
  width: 72px;
}

.successIcon h2 {
  font-size: 24px;
  color: #333333;
  margin-top: 22px;
  margin-bottom: 8px;
  font-weight: bold;
}

.successIcon p {
  font-size: 14px;
  color: #999999;
  margin-bottom: 16px;
}

.planPanel,
.successIcon {
  text-align: center;
}
.planPanel {
  width: 557px;
  background: #fafafa;
  border-radius: 2px;
  padding: 19px 0;
  box-sizing: border-box;
  margin: 0 auto;
}
.planPanel ul {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  height: 100%;
}
.planPanel ul li {
  padding-left: 207px;
  text-align: left;
  font-size: 14px;
  color: #666666;
  margin-bottom: 10px;
}

.planPanel ul li em {
  font-size: 14px;
  color: #333333;
}
</style>
