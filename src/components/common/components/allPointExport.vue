<template>
  <div class="vacancy_box">
    <el-row>
      <el-col :span="8">
        <span>导出点位：</span>
      </el-col>
      <el-col :span="16">
        <el-radio-group v-model="exportType">
          <el-radio :label="1">按面</el-radio>
          <el-radio :label="2">按媒体</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <p class="button_box">
      <el-button @click="cancelDown()" size="small">取 消</el-button>
      <el-button type="primary" @click="confirmDown()" size="small"
        >确 定</el-button
      >
    </p>
  </div>
</template>

<script>
import api from "../../../api/api.js";
// 时间格式化
import timeFormat from "../../../commonFun/timeFormat.js";
import sheetExcel from "../../../commonFun/sheetExcel.js";
import sessFun from "../../../commonFun/sessFun.js";

export default {
  name: "AllPointExport",
  data() {
    return {
      // 登录信息
      sessionData: {},
      exportType: 1,
    };
  },
  methods: {
    // 获取session数据
    getSessionData() {
      this.sessionData = sessFun.getSess();
    },
    cancelDown() {
      this.$emit("cancelClick", false);
    },
    confirmDown() {
      let loadingPoint = this.$loading({
        lock: true,
        text: "玩命加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      api
        .getApi_file("/addsp/api/v1/excel/export/exportAds", {
          type: this.exportType,
        })
        .then((res) => {
          if (res.data && res.data.SysCode) {
            this.messageFun("warning", res.data.MSG || "导出失败！");
          } else if (res.data) {
            let blob = new Blob([res.data], {
              type: "application/vnd.ms-excel;charset=utf-8",
            });
            let downloadElement = document.createElement("a");
            let href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            downloadElement.download =
              `总点导出-${this.exportType === 1 ? "按面" : "按媒体"}` +
              new Date().getFullYear() +
              (new Date().getMonth() + 1) +
              new Date().getDate() +
              new Date().getHours() +
              new Date().getMinutes() +
              new Date().getSeconds() +
              ".xls"; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
            this.cancelDown();
          } else {
            this.messageFun("warning", "导出失败！");
          }
        })
        .finally(() => {
          loadingPoint.close();
        });
    },

    // 操作提示统一方法
    messageFun(mesType, mes) {
      this.$message({
        message: mes,
        type: mesType,
        showClose: true,
      });
    },
  },
  mounted() {
    this.getSessionData();
  },
  computed: {
    //显示导点位
    /* showNdwBtn () {
      return !(['ADN_BD_KA', 'ADN_BD'].includes(this.sessionData.uType) && this.sessionData.customPermission.proposalPermission == 1);
    }, */
  },
};
</script>

<style lang="scss" scoped>
.vacancy_box {
  /deep/ .el-dialog__body {
    padding-top: 24px;
  }
  .el-row {
    height: 45px;
  }
}
.button_box {
  text-align: right;
}
</style>
