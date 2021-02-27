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
        <el-table-column prop="city" label="城市" min-width="6%">
        </el-table-column>
        <el-table-column prop="district" label="区县" min-width="6%">
        </el-table-column>
        <el-table-column prop="mediaName" label="媒体名称" min-width="6%">
        </el-table-column>
        <el-table-column prop="district" label="投放面" min-width="6%">
        </el-table-column>
        <el-table-column prop="district" label="资产编号" min-width="6%">
        </el-table-column>
        <el-table-column prop="district" label="排期" min-width="6%">
        </el-table-column>
        <el-table-column
          prop="recommendReason"
          label="失败原因"
          show-overflow-tooltip
          min-width="6%"
        >
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="recommendationCurrentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="recommendationPageSize"
        :pager-count="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="recommendationTotalNum"
        style="text-align: right; margin-top: 16px"
      >
      </el-pagination> -->
      <span slot="footer">
        <el-button plain @click="cancelImport">下载表格</el-button>
        <el-button plain @click="dialogErrorPoint = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 时间格式化
import timeFormat from "../../../commonFun/timeFormat.js";
import { api } from "../../../api/api.js";
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
      dialogErrorPoint: false,
      errorPointList: [],
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
            "30"
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
        this.dialogErrorPoint = true;
      });
      /* const h = this.$createElement;
      this.$msgbox({
        title: "",
        message: h("p", null, [
          h("span", null, "成功导入 "),
          h("span", { style: "color: #1890FF" }, "30"),
          h("span", null, " 个点位,"),
          h("span", null, " 问题点位 "),
          h("span", { style: "color: #FA8C16" }, "30"),
          h("span", null, " 个"),
        ]),
        type: "warning",
        showClose: false,
        showCancelButton: true,
        distinguishCancelAndClose: true,
        confirmButtonText: "好 的",
        cancelButtonText: "失败点位",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            setTimeout(() => {
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 3000);
          } else {
            done();
          }
        },
      })
        .then((action) => {
          this.$message({
            type: "info",
            message: "action: " + action,
          });
        })
        .catch((action) => {
          if (action === "cancel") {
            this.$message({
              type: "info",
              message: "查看失败点位",
            });
          }
        }); */
      return;

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
        .postUpload_file(this.importAction + "?apID=404", formData)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.recommendationInnerModal = false;
            this.showRecommendation();
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
    // 导出失败excel
    export2Excel(name) {
      this.isDown = true;
      let resultArr = [];
      /* for (let data of this.setpointArr) {
        let obj = {
          resName: data.resName,
          city: data.city,
          rName: data.rName,
          mVehicle: data.mVehicle,
          mTitle: data.mTitle,
          asLab: data.asLab,
          timeRange: data.timeRange,
          finishTimeRange: data.finishTimeRange,
          assetTag: data.assetTag,
          tradingArea: data.tradingArea,
          cType: data.cType,
          hPrice: data.hPrice / 100,
          hNum: data.hNum == "0" ? "#" : data.hNum,
          fNum: data.fNum == "0" ? "#" : data.fNum,
          chDay: data.chDay,
          adSize: data.mVehicle == "广告门" ? data.adSize : data.picSize,
          adViewSize:
            data.mVehicle == "广告门" ? data.adViewSize : data.lightBoxSize,
          notPush: data.notPush,
          mRemark: data.mRemark,
          resAddress: data.resAddress,
          remark: data.remark,
          trafficState: data.trafficState,
          asName: data.asName,
        };
        resultArr.push(obj);
      } */
      require.ensure([], () => {
        const {
          export_json_to_excel,
        } = require("../../../vendorExcel/Export2Excel");
        const tHeader = [
          "资源名称",
          "城市",
          "区县",
          "媒体名称",
          "投放面",
          "资产编号",
          "排期",
          "失败原因"
        ];
        const filterVal = [
          "resName",
          "city",
          "tradingArea",
          "rName",
          "asLab",
          "timeRange",
          "reason"
        ];
        
        const list = resultArr;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, name);
        this.isDown = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    /* getSessionData() {
      this.sessionData = JSON.parse(sessionStorage.getItem("session_data"));
    }, */
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
