<template>
  <el-dialog
    title="导入点位"
    :visible.sync="dialogImport"
    width="448px"
    top="23vh"
    :close-on-press-escape="false"
    :show-close="false"
    :center="false"
  >
    <div class="first-step">
      <span class="step-title">第一步：下载模板并按要求完善表格</span>
      <div class="first-step-body">
        <img class="excel-img" src="../../../assets/images/export.png" alt="" />
        《QADN-导入点位》
        <a
          :href="apiVar.qadnUrl + '/importTemplate/adsTemplate.xlsx'"
          download="点位导入模板.xlsx"
          class="downloag_btn"
          @click="dowmLoadFun"
          >点击下载<img
            class="down-excel-img"
            src="../../../assets/images/downExcel.png"
            alt=""
          />
        </a>
      </div>
    </div>
    <div class="second-step">
      <span class="step-title">第二步：上传编辑好的Excle表格</span>
      <el-upload
        ref="importRes"
        drag
        :action="importAction"
        :show-file-list="true"
        :on-change="importUploadFile"
        :on-remove="importFileRemove"
        :auto-upload="false"
        :limit="1"
        :multiple="false"
      >
        <img src="../../../assets/images/export.png" alt="" />
        <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
      </el-upload>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button plain @click="cancelImport">取 消</el-button>
      <el-button type="primary" @click="commitFile">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
// 时间格式化
import timeFormat from "../../../commonFun/timeFormat.js";
import {api} from "../../../api/api.js";
// excel导出
// import sheetExcel from "../../../commonFun/sheetExcel.js";

export default {
  name: "importPointByExcel",
  props: {
    dialogImportPoint: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogImport: false,
      // 登录信息
      sessionData: {},
      // 成功小区
      successList: [],
      // 失败小区数据
      errorList: [],
      importAction: "/advertisement/RecommendReasonImport",
      importFileData: [],
    };
  },
  computed: {},
  created() {},
  watch: {
    dialogImportPoint(val) {
      val && (this.dialogImport = true) && this.resetDialogImportPoint();
    },
  },
  methods: {
    // 重置dialogImportPoint
    resetDialogImportPoint() {
      this.$emit("resetDialogImportPoint");
    },
    // 取消导入
    cancelImport() {
      this.dialogImport = false;
    },
    // 导入模版下载
    dowmLoadFun(event) {
      // 阻止冒泡事件
      event.stopPropagation();
    },
    importUploadFile(file, fileList) {
      this.importFileData = [file];
    },
    /* handleSizeChange(val) {
      this.recommendationPageSize = val;
    },
    handleCurrentChange(val) {
      this.recommendationCurrentPage = val;
    }, */
    importFileRemove(file, fileList) {
      console.log(file, fileList);
      this.importFileData = fileList;
    },
    commitFile() {
      if (
        Array.isArray(this.importFileData) &&
        this.importFileData.length == 0
      ) {
        this.$message.warning('请先上传excel文件哦~')
        return;
      }
      let formData = new FormData();
      formData.append("file", this.importFileData[0].raw);
      // 上传文件
      this.uploadLoading = true;
      api
        .postUpload_file(
          this.importAction + "?apID=404",
          formData
        )
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.recommendationInnerModal = false;
            this.showRecommendation();
          } else {
            this.$message.warning(res.data.MSG)
          }
        })
        .catch((res) => {
          console.log(res);
        })
        .finally((_) => {
          this.uploadLoading = false;
        });
    },
    getSessionData() {
      this.sessionData = JSON.parse(sessionStorage.getItem("session_data"));
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .el-dialog__header {
  padding: 12px 24px;
}
/deep/ .el-dialog__body {
  padding: 4px 24px 24px;
}
/deep/ .el-dialog__footer {
  text-align: right;
}
.step-title {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
}
.first-step-body {
  width: 400px;
  height: 48px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  box-sizing: border-box;
  margin: 16px 0;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #dadada;
}
.second-step {
  /deep/ .el-upload-dragger {
    height: 128px;
    padding-top: 33px;
    .el-upload__text {
      margin-top: 10px;
    }
  }
}
.excel-img {
  width: 28px;
  vertical-align: middle;
  margin: 0 6px 0 16px;
}
.down-excel-img {
  width: 12.9px;
  margin-left: 9px;
}
/deep/ .el-upload-dragger {
  margin: 16px 0 0 0;
}
.downloag_btn {
  display: flex;
  align-items: center;
  margin: 0 20px 0 auto;
  cursor: pointer;
  color: rgba(102, 102, 102, 1);
}
</style>
