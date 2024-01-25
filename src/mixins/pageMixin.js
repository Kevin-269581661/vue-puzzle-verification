/**
 * 页面通用统一 mixin 封装
 */

import sessFun from "../../commonFun/sessFun.js";

export default {
  data() {
    return {
      pageLoading: false,
      // 登录信息
      sessionData: {},
      // 预加载数据
      preparedData: {},
    }
  },
  methods: {

  },
  mounted() {
    this.sessionData = sessFun.getSess();

  }
}
