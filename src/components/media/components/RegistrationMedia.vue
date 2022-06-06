<template>
  <div>
    <el-dialog
      title="媒体登记"
      width="358px"
      :visible.sync="dialogVisible"
      :show-close="false"
      :before-close="handleClose"
      :close-on-click-modal="false"
      custom-class="custom-dialog-wrapper registration-media"
      center
    >
      <div class="board">
        <ul class="info-list">
          <li class="info-item">
            <span class="item-label">项目名称：</span>
            <span
              class="item-content ellipsis"
              :title="registrationData.contractName || '--'"
            >
              {{ registrationData.contractName || "--" }}
            </span>
          </li>
          <li class="info-item">
            <span class="item-label">媒体类型：</span>
            <span
              class="item-content ellipsis"
              :title="registrationData.mediaTypeName || '--'"
            >
              {{ registrationData.mediaTypeName || "--" }}
            </span>
          </li>
          <li class="info-item">
            <span class="item-label">媒体名称：</span>
            <span
              class="item-content ellipsis"
              :title="registrationData.mediaTitle || '--'"
            >
              {{ registrationData.mediaTitle || "--" }}
            </span>
          </li>
          <li class="info-item">
            <span class="item-label">资产编号：</span>
            <span
              class="item-content ellipsis"
              :title="registrationData.assetTag || '--'"
            >
              {{ registrationData.assetTag || "--" }}
            </span>
          </li>
          <li class="info-item">
            <span class="item-label">分配方式：</span>
            <el-radio v-model="addResFlag" :label="false"
              >选择现有小区</el-radio
            >
            <el-radio v-model="addResFlag" :label="true">新建小区</el-radio>
          </li>
          <li class="info-item">
            <span class="item-label">归属小区：</span>
            <el-input
              v-if="addResFlag"
              size="small"
              placeholder="请输入新建小区名称"
              v-model="addResName"
            >
            </el-input>
            <el-select
              v-else
              size="small"
              v-model="selectedExistedRes"
              placeholder="请选择现有小区"
              filterable
              :clearable="true"
            >
              <el-option
                v-for="item in existedRes"
                :key="item.resID"
                :label="item.resName"
                :value="item"
              >
              </el-option>
            </el-select>
          </li>
        </ul>
      </div>
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :disabled="loading" type="primary" @click="singleRegister"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="批量登记"
      width="358px"
      :visible.sync="batchDialogVisible"
      :show-close="false"
      :before-close="handleClose"
      :close-on-click-modal="false"
      custom-class="custom-dialog-wrapper registration-media"
      center
    >
      <div class="content-tip" v-if="showBatchDialogTip">
        <p class="info_box">
          <i class="el-icon-warning" style="color: #1890ff"></i>
          请勾选需要登记至该小区的媒体
          <i class="el-icon-close" @click="showBatchDialogTip = false"></i>
        </p>
      </div>
      <div class="board">
        <el-checkbox-group v-model="registerIDs">
          <el-checkbox
            class="checkbox-item"
            v-for="(item, index) in batchRegisterMedias"
            :key="index"
            :label="item.registerId"
            name="type"
          >
            <div class="checkbox-top">
              {{ item.mediaTitle || "--" }}
            </div>
            <div class="checkbox-bottom">
              <span>{{ item.mediaTypeName || "--" }}</span>
              <div
                style="width: 1px; height: 10px; margin: 0 6px; background: #D9D9D9;˝"
              ></div>
              <span>{{ item.assetTag || "--" }}</span>
            </div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer">
        <el-button @click="batchDialogVisible = false">取 消</el-button>
        <el-button :disabled="loading" type="primary" @click="batchRegister"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../../api/api";
import timeFormat from "../../../commonFun/timeFormat.js";
import sessFun from "../../../commonFun/sessFun.js";
export default {
  name: "registrationMedia",
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false,
    },
    registrationData: {
      type: Object,
      default: () => {},
    },
    apID: {
      type: [String, Number],
    },
  },
  components: {},
  data() {
    return {
      timeFormat,
      sessionData: null,
      loading: false,
      addResFlag: false,
      // 现有小区
      existedRes: [],
      selectedExistedRes: null,
      addResName: "",
      batchDialogVisible: false,
      showBatchDialogTip: true,
      singleRegisterResID: null,
      // 项目下待登记媒体
      batchRegisterMedias: [],
      // 批量登记的媒体注册ID
      registerIDs: [],
    };
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.getOwnRes();
      }
    },
    batchDialogVisible(val) {},
    showMatchResult(val) {
      val && (this.matched = true) && this.getSuccessPoint();
    },
  },
  created() {
    this.sessionData = sessFun.getSess();
  },
  mounted() {},
  methods: {
    // 分页获取当前登录用户的所属公司旗下管理的小区
    getOwnRes() {
      api
        .getApi("/addsp/api/v1/resInfo/pageOwn", {
          pageNum: 1,
          pageSize: 100,
          resName: "",
        })
        .then((res) => {
          if (
            res.data.SysCode == 200200 &&
            res.data.data &&
            res.data.data.list
          ) {
            this.existedRes = res.data.data.list || [];
          } else {
            sessFun.messageFun("warning", res.data.MSG || "现有小区查询失败！");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 批量登记媒体至小区
    batchRegister() {
      if (Array.isArray(this.registerIDs) && this.registerIDs.length) {
        api
          .postApi_json("/addsp/api/v1/register/batch", {
            registerIDs: this.registerIDs,
            resID: this.singleRegisterResID,
          })
          .then((res) => {
            if (res.data.SysCode == 200200) {
              this.batchDialogVisible = false;
              this.$emit("refreshWorkplace");
              sessFun.messageFun(
                "success",
                res.data.MSG || "批量登记媒体成功！"
              );
            } else {
              sessFun.messageFun(
                "warning",
                res.data.MSG || "批量登记媒体失败！"
              );
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.registerIDs = [];
            this.singleRegisterResID = null;
          });
      } else {
        sessFun.messageFun("warning", "请先选择需要登记的媒体！");
      }
    },
    // 单个媒体登记
    singleRegister() {
      if (this.registrationData.registerId) {
        let params = {
          registerID: this.registrationData.registerId,
        };
        if (this.addResFlag === true) {
          if (this.addResName) {
            params.newResName = this.addResName;
          } else {
            sessFun.messageFun("warning", "请输入新建小区名称！");
            return;
          }
        }
        if (this.addResFlag === false) {
          if (this.selectedExistedRes) {
            params.resID = this.selectedExistedRes.resID;
          } else {
            sessFun.messageFun("warning", "请选择现有小区！");
            return;
          }
        }
        this.loading = true;
        api
          .postApi_json("/addsp/api/v1/register/relRes", params)
          .then((res) => {
            if (res.data.SysCode == 200200) {
              sessFun.messageFun("success", res.data.MSG || "媒体登记成功！");
              this.getUnregisteredMedia(
                res.data.data,
                this.addResFlag
                  ? params.newResName
                  : this.selectedExistedRes.resName
              );
            } else {
              sessFun.messageFun("warning", res.data.MSG || "媒体登记失败！");
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        sessFun.messageFun("warning", "媒体信息获取失败！");
      }
    },
    // 查询该项目下未登记媒体
    getUnregisteredMedia(singleRegisterResID, resName) {
      this.loading = true;
      // 清空单个媒体登记返回的小区信息
      this.singleRegisterResID = null;
      api
        .getApi(
          "/addsp/api/v1/register/listWait?projectId=" +
            this.registrationData.projectId
        )
        .then((res) => {
          if (res.data.SysCode == 200200 && res.data.data) {
            this.batchRegisterMedias = res.data.data || [];
            if (this.batchRegisterMedias.length === 0) {
              this.handleClose();
              return;
            }
            this.singleRegisterResID = singleRegisterResID;
            this.$confirm(
              `该项目当前存在 <span style='color: #1890ff; font-weight: 600;'> ${
                this.batchRegisterMedias.length || 0
              } </span>个待登记的媒体，可批量登记至 <span style='color: #1890ff; font-weight: 600;'> ${
                resName || "--"
              } </span>`,
              "完成登记",
              {
                confirmButtonText: "查 看",
                dangerouslyUseHTMLString: true,
                type: "success",
                showCancelButton: true,
                closeOnClickModal: true,
                closeOnPressEscape: false,
                showClose: false,
                customClass: "messageBoxCustom",
              }
            )
              .then(() => {
                this.batchDialogVisible = true;
              })
              .catch(() => {
                this.$emit("refreshWorkplace");
              });
            // 关闭单个媒体登记弹框
            this.handleClose();
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleClose() {
      this.$emit("update:dialogVisible", false);
      this.addResFlag = false;
      this.existedRes = [];
      this.selectedExistedRes = null;
      this.addResName = "";
    },
  },
};
</script>
<style lang="scss">
.el-message-box__wrapper {
  top: 15vh;
  bottom: unset;
}
.messageBoxCustomWarning {
  .el-message-box__status {
    color: #fa8c16;
  }
}
.messageBoxCustom.el-message-box {
  width: 388px;
  border: unset;
  box-sizing: border-box;
  padding: 24px 24px !important;
  .el-message-box__btns button:nth-child(2) {
    margin-left: 16px;
  }
  .el-button--primary {
    background-color: rgba(24, 144, 255, 1);
  }
  .el-message-box__header {
    padding: 0;
    .el-message-box__title {
      padding-left: 41px;
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
    }
  }
  .el-message-box__content {
    padding: 8px 0 24px;
    .el-message-box__status {
      position: absolute;
      top: -20px;
    }
    .el-message-box__message p {
      width: 300px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
    }
  }
  .el-message-box__status + .el-message-box__message {
    padding-left: 40px;
  }
  .el-message-box__status::before {
    padding-left: 0;
  }
  .el-message-box__btns {
    padding: 0;
  }
}
</style>
<style lang="scss" scoped>
@import "../../../assets/component.scss";
/deep/ .registration-media {
  border-radius: 4px;
  .el-dialog__header {
    padding-bottom: 0;
    border: none !important;
    .el-dialog__title {
      font-size: 16px;
      color: rgba($color: #000, $alpha: 0.85);
    }
  }
  .el-dialog__body {
    border: none !important;
    .content-tip {
      height: 32px;
      margin-top: 16px;
      background: rgba(230, 247, 255, 1);
      border-radius: 4px;
      border: 1px solid rgba(145, 213, 255, 1);
      line-height: 32px;
      padding: 0 16px;
      position: relative;
      font-weight: 400;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      .el-icon-close {
        cursor: pointer;
        margin-left: 24px;
        position: absolute;
        top: 9px;
        right: 8px;
      }
    }
    .el-radio {
      margin-right: 24px;
    }
    .el-radio__label {
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
    }
  }
  .el-dialog__footer {
    display: flex;
    justify-content: flex-end;
    padding: 24px;
    .el-button + .el-button {
      margin-left: 16px;
    }
  }
  .el-checkbox {
    line-height: 27px;
  }
  .el-checkbox__label {
    padding-left: 8px;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: rgba(0, 0, 0, 0.65);
  }
  .el-checkbox-group {
    display: flex;
    flex-flow: column;
  }
  .el-select--small {
    width: 100%;
  }
  .board {
    padding: 16px 0;
    .checkbox-item {
      padding: 10px 12px;
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 4px;
      margin-right: 0;
      & + .checkbox-item {
        margin-top: 8px;
      }
      .checkbox-top {
        font-weight: 600;
        line-height: 22px;
        color: #000000;
        margin-bottom: 2px;
      }
      .checkbox-bottom {
        font-size: 12px;
        line-height: 18px;
        display: flex;
        align-items: center;
        color: rgba(0, 0, 0, 0.45);
      }
      .el-checkbox__input {
        vertical-align: top;
        margin-top: 4px;
      }
    }
    .info-item {
      display: flex;
      line-height: 22px;
      & + .info-item {
        margin-top: 16px;
      }
      .item-content.ellipsis {
        max-width: 240px;
        display: inline-block;
        vertical-align: text-bottom;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .item-label {
        white-space: nowrap;
      }
    }
  }
}
.cell-ellipsis {
  min-width: 30px;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
