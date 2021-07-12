<!--
 * @Author: penglei
 * @Date: 2021-06-09 14:45:27
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-03 10:32:36
 * @FilePath: /frontend/src/components/develop/contractCfg.vue
-->
<template>
  <div class="contract-config-page">
    <el-breadcrumb separator="/" class="contract-crumb">
      <el-breadcrumb-item>合同管理</el-breadcrumb-item>
      <el-breadcrumb-item>合同设置</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container>
      <el-aside width="200px">
        <el-menu default-active="1">
          <!-- <el-menu-item index="1" @click="showCom('customFiled')">
            <span slot="title"> 自定义字段 </span>
          </el-menu-item> -->
          <el-menu-item index="1" @click="showCom('warnCfg')">
            <span slot="title"> 合同预警 </span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <keep-alive>
          <component :is="comName"></component>
        </keep-alive>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import customFiled from "./components/customFiled.vue"
import warnCfg from "./components/warnCfg.vue"
export default {
  name: "contractCfg",
  components: {
    customFiled,
    warnCfg
  },
  data() {
    return {
      comName: "warnCfg"
    };
  },
  computed: {},
  created() {
  },
  mounted() {},
  methods: {
    showCom(name) {
      this.comName = name
    },
  },
};
</script>

<style lang="scss" scoped>
.contract-crumb {
  margin: 12px 0;
}
.contract-config-page {
  margin: 0 60px;
  position: relative;
}

.el-aside {
  color: #333;
}

.el-main {
  padding: 16px 0 16px 32px;
  text-align: center;
  color: #333;
}

.QNAmenu span {
  color: #303133;
}

.QNAmenu .is-active span {
  color: #108aff;
  width: 100%;
  height: 100%;
  display: inline-block;
}

.contract-config-page .el-container {
  width: 100%;
  height: 100%;
  padding: 16px 32px 16px 0;
  background: #fff;
}

.el-menu {
  box-sizing: border-box;
  height: 100%;
  padding: 7px 0;
}
.contract-config-page /deep/ .el-menu-item.is-active {
  font-weight: 600;
  color: rgba(24, 144, 255, 0.85);
  background-color: #e9f7fe;
  border-right: 2px solid #1890ff;
}
/deep/ .el-menu-item,
.el-submenu__title {
  height: 40px;
  padding-left: 32px !important;
  line-height: 40px;
  font-size: 14px;
}
</style>
