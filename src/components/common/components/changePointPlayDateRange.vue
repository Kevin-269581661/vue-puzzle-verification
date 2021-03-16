<template>
  <div>
    <el-dialog
      title="更改排期"
      :visible.sync="dialogShow"
      width="448px"
      top="23vh"
      :close-on-press-escape="false"
      :show-close="false"
      :center="false"
      custom-class="import-dialog"
    >
      <div class="tip-selected">
        <i class="el-icon-info" style="color: #1890ff"></i>
        <h4>
          共选中 <span>{{ changeList.length }}</span> 个点位
        </h4>
      </div>
      <el-date-picker
        v-model="dateValue"
        type="date"
        placeholder="请选择投放结束日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
      >
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="cancel">取 消</el-button>
        <el-button type="primary" @click="beforeCommit">确 定</el-button>
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
        <el-table-column prop="mTitle" label="媒体名称" min-width="6%">
        </el-table-column>
        <el-table-column prop="asLab" label="投放面" min-width="3%">
        </el-table-column>
        <el-table-column prop="assetTag" label="资产编号" min-width="6%">
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
// excel导出
// import sheetExcel from "../../../commonFun/sheetExcel.js";

export default {
  name: "changePointPlayDateRange",
  props: {
    changeRangeDialog: {
      type: Boolean,
      default: false,
    },
    handleTime: {
      type: [Number,String],
      required: true
    },
    changeList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogShow: false,
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
      dateValue: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now();
        },
      },
      isDown: false,
      uploadLoading: false
    };
  },
  computed: {},
  created() {},
  watch: {
    changeRangeDialog(val) {
      val && (this.dialogShow = true) && this.resetDialog();
    },
  },
  methods: {
    resetDialog() {
      this.$emit("resetDialogChangeRange");
    },
    // 取消
    cancel() {
      this.dialogShow = false;
      this.uploadLoading = false;
    },
    /* handleSizeChange(val) {
      this.recommendationPageSize = val;
    },
    handleCurrentChange(val) {
      this.recommendationCurrentPage = val;
    }, */
    beforeCommit() {
      this.dialogShow = false;
      this.$confirm(
        "点击确定后，将更改选中的点位的排期",
        "是否更改选中点位的排期",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.commit();
        })
        .catch(() => {});
    },
    commit() {
      let info = {
        apID : sessionStorage.getItem("order_apid"),
        lIDs: this.changeList.map(item=>item.lID).join(','),
        mark: this.handleTime,
        endDate: this.dateValue,
      };
      this.uploadLoading = true;
      api
        .postApi(this.apiVar.Advertisement + "/ChangeAdLaunch", info)
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
                  h("span", null, "成功更改 "),
                  h("span", { style: "color: #1890FF" }, resData.sucessNum||0),
                  h("span", null, " 个点位的排期, "),
                  h("span", { style: "color: #FA8C16" }, resData.errorNum||0),
                  h("span", null, " 个"),
                  h("span", null, "失败")
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
                    "成功更改 "
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
                    "  个点位的排期"
                  ),
                ]),
                type: "success",
                showClose: false,
                confirmButtonText: "好 的",
              }).then((action) => {
              })
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
      this.$emit('refreshCurrentTable')
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
          "城市",
          "区县",
          "媒体名称",
          "投放面",
          "资产编号",
          "排期",
          "失败原因",
        ];
        const filterVal = [
          "resName",
          "city",
          "district",
          "mTitle",
          "asLab",
          "assetTag",
          "date",
          "failReason"
        ];

        const list = this.errorPointList;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '排期更改失败点位');
        this.isDown = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
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
  .el-date-editor.el-input {
    width: 100%;
  }
}
/deep/ .import-dialog .el-dialog__footer {
  display: block;
  text-align: right;
}
.tip-selected {
  background: #e6f7ff;
  border: 1px solid #bae7ff;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 5px;
  h4 {
    font-size: 14px;
    display: inline-block;
  }
  p {
    font-size: 14px;
    font-weight: normal;
    display: inline-block;
    margin-left: 10px;
  }
  span {
    font-size: 14px;
    font-weight: normal;
    margin: 0 6px;
    cursor: pointer;
    color: #1890ff;
  }
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
</style>
