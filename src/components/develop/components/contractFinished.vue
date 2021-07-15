<!--
 * @Author: penglei
 * @Date: 2021-06-15 10:52:08
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-15 17:23:57
 * @FilePath: /frontend/src/components/develop/components/contractFinished.vue
-->
<template>
  <div class="create-success">
    <div class="successIcon">
      <img src="../../../assets/images/createSuccess.png" alt="" />
      <h2>{{ edit ? "编辑成功" : "创建成功" }}</h2>
      <p>{{ `${edit ? "编辑时间" : "创建时间"}：${createDate}` }}</p>
    </div>
    <div class="planPanel">
      <ul>
        <li><em>资源名称：</em>{{ resFormData.resName || "" }}</li>
        <li><em>物业公司：</em>{{ resFormData.pmcName || "" }}</li>
        <li>
          <em>合同期限：</em
          >{{ `${contractFormData.startDate} 至 ${contractFormData.endDate}` }}
        </li>
      </ul>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script>
import timeFormat from "../../../commonFun/timeFormat.js";
export default {
  name: "contractFinished",
  props: {
    resFormData: {
      type: Object,
      required: true,
      default: () => {},
    },
    contractFormData: {
      type: Object,
      required: true,
      default: () => {},
    },
    edit: {
      type: Boolean,
      default: () => false,
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
    this.createDate = timeFormat.returnDayCount(0, "-");
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
/*完成创建*/
.create-success {
  padding-bottom: 32px;
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
  width: fit-content;
  margin: 0 auto 0;
  height: 100%;
}
.planPanel ul li {
  margin-bottom: 16px;
  line-height: 22px;
  text-align: left;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  &:last-child {
    margin-bottom: 0;
  }
}

.planPanel ul li em {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}
</style>
