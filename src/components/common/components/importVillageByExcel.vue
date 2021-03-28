<template>
  <div>
    <el-dialog
      title="导入小区"
      :visible.sync="isDialogImport"
      width="448px"
      top="23vh"
      :close-on-press-escape="false"
      :show-close="false"
      :center="false"
      :lock-scroll="false"
      custom-class="import-dialog"
      :close-on-click-modal="false"
    >
      <div class="first-step">
        <span class="step-title">第一步：下载模板并按要求完善表格</span>
        <div class="first-step-body">
          <img
            class="excel-img"
            src="../../../assets/images/export.png"
            alt=""
          />
          《QADN-导入小区模板》
          <!-- TODO:更换小区模板EXCEL下载地址 -->
          <a
            :href="apiVar.qadnUrl + '/importTemplate/communityTemplate.xlsx'"
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
          :file-list="importFileData"
        >
          <img src="../../../assets/images/export.png" alt="" />
          <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="cancelImport">取 消</el-button>
        <el-button type="primary" :loading="uploadLoading" @click="commitFile"
          >提 交</el-button
        >
      </span>
    </el-dialog>
    <!-- 导入结果页面 -->
    <el-dialog
      title="导入结果"
      :visible.sync="dialogResult"
      top="23vh"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :center="false"
      custom-class="error-point-dialog"
    >
      <div class="table-top-tip">
        <h4 class="container">
          <div>
            <i class="el-icon-info" style="color: #1890ff"></i>
            <span
              ><em>{{ successSize }}</em
              >个导入成功，</span
            >
            <span
              ><em class="orange">{{ errorSize }}</em
              >个导入失败个</span
            >
          </div>
          <div>
            <span><em @click="openUnsuccessful">查看失败小区</em></span>
          </div>
        </h4>
      </div>
      <!-- 表格部分 -->
      <el-table
        ref="successSTableRef"
        :data="successShowList"
        border
        max-height="500"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="序号"
          min-width="6%"
          width="50"
          :index="successPageSize * successCurrentPage - successPageSize + 1"
        >
        </el-table-column>
        <el-table-column prop="resName" label="资源" min-width="6%">
        </el-table-column>
        <el-table-column prop="cityName" label="城市" min-width="6%">
        </el-table-column>
        <el-table-column prop="districtName" label="区域" min-width="6%">
        </el-table-column>
        <el-table-column prop="schedule" label="排期" min-width="6%">
        </el-table-column>
        <el-table-column
          prop="actualMediaCnt"
          label="媒体数量（门）"
          min-width="6%"
        >
        </el-table-column
        ><el-table-column prop="planAdsCnt" label="计划投放数量" min-width="6%">
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSuccessSizeChange"
        @current-change="handleSuccessCurrentChange"
        :current-page="successCurrentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="successPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="successSize"
        style="text-align: right"
      >
      </el-pagination>
      <span slot="footer">
        <el-button
          type="primary"
          size="medium "
          @click="addShoppingCart"
          :disabled="isDown"
          style="padding: 0 4px"
          >确定并且添加到购物车</el-button
        >
      </span>
    </el-dialog>
    <!-- 失败小区 -->
    <el-dialog
      title="导入失败的小区"
      :visible.sync="dialogErrorPoint"
      top="23vh"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :center="false"
      custom-class="error-point-dialog"
    >
      <el-table
        ref="errorTableRef"
        :data="errorShowList"
        border
        max-height="500"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="序号"
          min-width="6%"
          width="50"
          :index="errorPageSize * errorCurrentPage - errorPageSize + 1"
          >>
        </el-table-column>
        <el-table-column prop="resName" label="资源" min-width="6%">
        </el-table-column>
        <el-table-column prop="city" label="城市" min-width="6%">
        </el-table-column>
        <el-table-column prop="district" label="区域" min-width="6%">
        </el-table-column>
        <el-table-column prop="date" label="排期" min-width="6%">
        </el-table-column>
        <el-table-column
          prop="planAdsCnt"
          label="计划投放数量（面）"
          min-width="6%"
        >
        </el-table-column>
        <el-table-column
          prop="failReason"
          label="失败原因"
          show-overflow-tooltip
          min-width="10%"
        >
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleErrorSizeChange"
        @current-change="handleErrorCurrentChange"
        :current-page="errorCurrentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="errorPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="errorSize"
        style="text-align: right"
      >
      </el-pagination>
      <span slot="footer">
        <el-button plain @click="dialogErrorPoint = false">关闭</el-button>
        <el-button plain @click="export2Excel" :disabled="isDown"
          >导出</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 时间格式化
// import timeFormat from "../../../commonFun/timeFormat.js";
import { api } from "../../../api/api.js";

export default {
  name: "importVillageByExcel",
  props: {
    isDialogImport: {
      type: Boolean,
      default: false,
    },
    //导入表格上传的地址
    importAction: {
      type: String,
      default: "",
    },
    importInfoData: {
      type: Object,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      successList: [],
      successSize: 0,
      errorList: [],
      errorSize: 0,
      //每页显示的数据量
      successPageSize: 10,
      errorPageSize: 10,
      //成功小区第几页
      successCurrentPage: 1,
      // 失败小区
      errorCurrentPage: 1,
      fileList: [],
      //失败小区弹窗
      dialogErrorPoint: false,
      //导入结果弹窗
      dialogResult: false,
      // 登录信息
      // sessionData: {},
      // importAction: "/advertisement/UpdateOrderAdsWithExcel",
      importFileData: [],
      // 失败点位下载按钮状态
      isDown: false,
      uploadLoading: false,
      handleTime: "",
    };
  },
  computed: {
    successShowList() {
      if (this.successList) {
        if (this.$refs.successSTableRef) {
          this.$refs.successSTableRef.bodyWrapper.scrollTop = 0;
        }
        return this.successList.slice(
          (this.successCurrentPage - 1) * this.successPageSize,
          this.successCurrentPage * this.successPageSize
        );
      }
    },
    errorShowList() {
      if (this.errorList) {
        if (this.$refs.errorTableRef) {
          this.$refs.errorTableRef.bodyWrapper.scrollTop = 0;
        }
        return this.errorList.slice(
          (this.errorCurrentPage - 1) * this.errorPageSize,
          this.errorCurrentPage * this.errorPageSize
        );
      }
    },
  },
  created() {},
  watch: {
    importInfoData: {
      handler(newVal, oldVal) {
        this.successList = newVal.successList ? newVal.successList : [];
        this.successSize = this.successList.length;
        this.errorList = newVal.errorList ? newVal.errorList : [];
        this.errorSize = this.errorList.length;
      },
      deep: true,
    },
  },
  methods: {
    //清除组件保留的数据
    // 取消导入
    cancelImport() {
      // this.isDialogImport = false;
      this.$emit("update:isDialogImport", false);
      this.uploadLoading = false;
      this.importFileRemove();
    },
    // 导入模版下载, 阻止冒泡事件
    dowmLoadFun(event) {
      event.stopPropagation();
    },
    importUploadFile(file, fileList) {
      this.importFileData = fileList;
    },
    importFileRemove(file, fileList) {
      this.importFileData = [];
    },
    commitFile() {
      this.$emit("update:isDialogImport", false);
      //执行上传小区excel文件
      this.$emit("submitBtn", this.importFileData);

      this.importFileRemove();
      // this.dialogResult = true;
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
      this.handleTime = new Date().getTime();
      api
        .postUpload_file(
          this.importAction +
            "?apID=" +
            sessionStorage.getItem("order_apid") +
            "&mark=" +
            this.handleTime,
          formData
        )
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let resData = res.data.data;
            if (resData.sucessNum > 0) {
              // 刷新换点表格
              this.refreshChangePointList();
            }
            if (resData.errorNum > 0) {
              const h = this.$createElement;
              this.$msgbox({
                title: "",
                message: h("p", null, [
                  h("span", null, "成功导入 "),
                  h(
                    "span",
                    { style: "color: #1890FF" },
                    resData.sucessNum || 0
                  ),
                  h("span", null, " 个点位,"),
                  h("span", null, " 问题点位 "),
                  h("span", { style: "color: #FA8C16" }, resData.errorNum || 0),
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
                .then((action) => {})
                .catch((action) => {
                  if (action === "cancel") {
                    this.errorList = resData.errorList || [];
                    this.dialogErrorPoint = true;
                  }
                });
            } else if (resData.sucessNum > 0) {
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
                    {
                      style:
                        "color: #1890FF; font-size: 16px; font-weight: 600;",
                    },
                    resData.sucessNum || 0
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
              }).then((action) => {});
            }
          } else {
            this.$message.warning(res.data.MSG);
          }
        })
        .catch((res) => {})
        .finally((_) => {
          this.uploadLoading = false;
        });
    },
    //加入购物车,emit一个函数并且传递要加入购物车的数据，父组件触发加入购物车
    addShoppingCart() {
      this.dialogResult = false;
      this.$emit("skipAndAddShopping", this.successList);
    },
    // 导出失败excel
    export2Excel() {
      this.isDown = true;
      require.ensure([], () => {
        const {
          export_json_to_excel,
        } = require("../../../vendorExcel/Export2Excel");
        const tHeader = ["资源", "城市", "区域", "排期", "投放面", "失败原因"];
        const filterVal = [
          "resName",
          "city",
          "district",
          "date",
          "asLab",
          "failReason",
        ];

        const list = this.errorList;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "导入失败点位");
        this.isDown = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    //查看失败小区
    openUnsuccessful() {
      this.dialogErrorPoint = true;
    },
    handleSuccessSizeChange(val) {
      this.successPageSize = val;
    },
    handleSuccessCurrentChange(val) {
      this.successCurrentPage = val;
    },
    handleErrorSizeChange(val) {
      this.errorPageSize = val;
    },
    handleErrorCurrentChange(val) {
      this.errorCurrentPage = val;
    },
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
  text-align: center;
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

.table-top-tip {
  background: #e6f7ff;
  border: 1px solid #bae7ff;
  border-radius: 4px;
  margin: 16px 0;
  padding: 9.5px;
}

.table-top-tip /deep/ .el-icon-info {
  margin-right: 4px;
}

.table-top-tip .container {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.table-top-tip em {
  font-size: 14px;
  font-weight: normal;
  margin: 0 6px;
  cursor: pointer;
  color: #1890ff;
}
.table-top-tip .orange {
  color: #f87126;
}
/deep/ .el-input__inner {
  width: 100%;
}
/deep/ .el-dialog__footer {
  text-align: center;
}
</style>
