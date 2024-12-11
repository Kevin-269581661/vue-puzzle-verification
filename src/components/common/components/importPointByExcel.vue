<template>
  <div>
    <el-dialog
      title="导入点位"
      :visible.sync="dialogImport"
      width="448px"
      top="23vh"
      :close-on-press-escape="false"
      :show-close="false"
      :center="false"
      custom-class="import-dialog"
    >
      <div class="first-step">
        <span class="step-title">第一步：下载模板并按要求完善表格</span>
        <div class="first-step-body">
          <img
            class="excel-img"
            src="../../../assets/images/export.png"
            alt=""
          />
          《QADN-导入点位》
          <a
            :href="apiVar.qadnUrl + '/importTemplate/adsTemplate_new.xlsx'"
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
        <span class="step-title">第二步：上传编辑好的Excel表格</span>
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
          :fileList="fileList"
        >
          <img src="../../../assets/images/export.png" alt="" />
          <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="cancelImport">取 消</el-button>
        <el-button type="primary" :loading="uploadLoading" @click="commitFile">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 问题点位表格 -->
    <el-dialog
      title="问题点位"
      :visible.sync="dialogErrorPoint"
      top="23vh"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :center="false"
      custom-class="error-point-dialog"
    >
      <el-table
        :data="errorPointList"
        border
        max-height="500"
        style="width: 100%"
      >
        <el-table-column prop="resName" label="资源名称" min-width="6%">
        </el-table-column>
        <el-table-column prop="province" label="省份" min-width="6%">
        </el-table-column>
        <el-table-column prop="city" label="城市" min-width="6%">
        </el-table-column>
        <el-table-column prop="district" label="区域" min-width="6%">
        </el-table-column>
        <el-table-column prop="mVehicle" label="媒介载体" min-width="6%">
        </el-table-column>
        <el-table-column prop="mTitle" label="媒体名称" min-width="6%">
        </el-table-column>
        <el-table-column prop="assetTag" label="资产编号" min-width="6%">
        </el-table-column>
        <el-table-column prop="asLab" label="投放面" min-width="3%">
        </el-table-column>
        <el-table-column prop="date" label="排期" min-width="6%">
        </el-table-column>
        <el-table-column
          prop="failReason"
          label="失败原因"
          show-overflow-tooltip
          min-width="10%"
        >
        </el-table-column>
      </el-table>
      <span slot="footer">
        <el-button plain @click="export2Excel" :disabled="isDown">下载表格</el-button>
        <el-button plain @click="dialogErrorPoint = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 时间格式化
import timeFormat from "../../../commonFun/timeFormat.js";
import { api } from "../../../api/api.js";

export default {
  name: "importPointByExcel",
  props: {
    dialogImportPoint: {
      type: Boolean,
      default: false,
    },
    handleTime: {
      type: [Number,String],
      required: true
    },
  },
  data() {
    return {
      fileList: [],
      dialogImport: false,
      dialogErrorPoint: false,
      errorPointList: [],
      // 登录信息
      sessionData: {},
      // 成功小区
      successList: [],
      // 失败小区数据
      errorList: [],
      importAction: "/advertisement/UpdateOrderAdsWithExcel",
      importFileData: [],
      // 失败点位下载按钮状态
      isDown: false,
      uploadLoading: false
    };
  },
  computed: {},
  created() {},
  watch: {
    dialogImportPoint(val) {
      val && (this.dialogImport = true) && this.resetDialogImportPoint();
    },
    dialogImport(val) {
      !val && (this.fileList = [])
    }
  },
  methods: {
    // 重置dialogImportPoint
    resetDialogImportPoint() {
      this.$emit("resetDialogImportPoint");
    },
    // 取消导入
    cancelImport() {
      this.dialogImport = false;
      this.uploadLoading = false;
    },
    // 导入模版下载, 阻止冒泡事件
    dowmLoadFun(event) {
      event.stopPropagation();
    },
    importUploadFile(file, fileList) {
      this.fileList = fileList
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
        this.$message.warning("请先上传excel文件哦~");
        return;
      }
      let formData = new FormData();
      formData.append("file", this.importFileData[0].raw);
      // 上传文件
      this.uploadLoading = true;
      api
        .postUpload_file(this.importAction + '?apID=' + sessionStorage.getItem("order_apid") + '&mark=' + this.handleTime, formData)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let resData = res.data.data;
            if(resData.sucessNum>0) {
              // 刷新换点表格
              this.refreshChangePointList()
            }
            if(resData.errorNum>0) {
              const h = this.$createElement;
              this.$msgbox({
                title: "",
                message: h("p", null, [
                  h("span", null, "成功导入 "),
                  h("span", { style: "color: #1890FF" }, resData.sucessNum||0),
                  h("span", null, " 个点位,"),
                  h("span", null, " 问题点位 "),
                  h("span", { style: "color: #FA8C16" }, resData.errorNum||0),
                  h("span", null, " 个"),
                ]),
                type: "warning",
                showClose: false,
                showCancelButton: true,
                distinguishCancelAndClose: true,
                confirmButtonText: "好 的",
                cancelButtonText: "失败点位",
                beforeClose: (action, instance, done) => {
                  if(action === "confirm") {
                    done();
                  } else {
                    instance.cancelButtonLoading = true;
                    instance.cancelButtonText = "执行中...";
                    setTimeout(() => {
                      instance.cancelButtonLoading = false;
                      done();
                    }, 300);
                  }
                },
              })
                .then((action) => {
                })
                .catch((action) => {
                  if (action === "cancel") {
                    this.errorPointList = resData.errorList || []
                    this.dialogErrorPoint = true
                  }
                });
            } else if(resData.sucessNum>0) {
              const h = this.$createElement;
              this.$msgbox({
                title: "",
                message: h("p", null, [
                  h(
                    "span",
                    {
                      style:
                        "color: rgba(0, 0, 0, 0.85); font-size: 16px; font-weight: 600;",
                    },
                    "成功导入 "
                  ),
                  h(
                    "span",
                    { style: "color: #1890FF; font-size: 16px; font-weight: 600;" },
                    resData.sucessNum||0
                  ),
                  h(
                    "span",
                    {
                      style:
                        "color: rgba(0, 0, 0, 0.85); font-size: 16px; font-weight: 600;",
                    },
                    " 个点位"
                  ),
                ]),
                type: "success",
                showClose: false,
                confirmButtonText: "好 的",
              }).then((action) => {
              });
            }
          } else {
            this.$message.warning(res.data.MSG);
          }
        })
        .catch((res) => {
          console.log(res);
        })
        .finally((_) => {
          this.uploadLoading = false;
        });
    },
    // 刷新更换点位表格
    refreshChangePointList() {
      this.$emit('refreshCurrentTable', [])
    },
    // 导出失败excel
    export2Excel() {
      this.isDown = true;
      require.ensure([], () => {
        const {
          export_json_to_excel,
        } = require("../../../vendorExcel/Export2Excel");
        const tHeader = [
          "资源名称",
          '省份',
          "城市",
          "区域",
          '媒介载体',
          "媒体名称",
          "资产编号",
          "投放面",
          "投放排期",
          "失败原因"
        ];
        const filterVal = [
          "resName",
          'province',
          "city",
          "district",
          'mVehicle',
          "mTitle",
          "assetTag",
          "asLab",
          "date",
          "failReason"
        ];

        const list = this.errorPointList;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '导入失败点位');
        this.isDown = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    }
  },
};
</script>

<style scoped lang="scss">
/deep/ .import-dialog .el-dialog__header {
  padding: 12px 24px;
}
/deep/ .import-dialog .el-dialog__body {
  padding: 4px 24px 24px;
}
/deep/ .import-dialog .el-dialog__footer {
  display: block;
  text-align: right;
}

/deep/ .error-point-dialog {
  .el-dialog__header {
    padding: 19px 24px;
    border-bottom: 1px solid #e9e9e9;
  }
  .el-dialog__body {
    padding: 24px;
  }
  .el-button + .el-button {
    margin-left: 14px;
  }
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
