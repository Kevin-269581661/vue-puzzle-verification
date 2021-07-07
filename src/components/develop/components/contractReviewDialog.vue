<!--
 * @Author: penglei
 * @Date: 2021-06-29 16:44:13
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-07 21:27:07
 * @FilePath: /frontend/src/components/develop/components/contractReviewDialog.vue
-->
<template>
  <div>
    <el-dialog
      title="合同审核"
      width="1230px"
      :visible.sync="contractReviewVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
      custom-class="custom-dialog-wrapper contract-detail-page"
      center
    >
      <div v-for="(item, index) in detailArr" :key="index">
        <div class="emphasize-text">{{ item.title }}</div>
        <el-row :gutter="46" class="content-row">
          <el-col
            v-for="(formItem, formIndex) in item.content"
            :key="formIndex"
            :span="6"
            class="detail-item"
          >
            <label class="detail-item-label">{{ `${formItem.label}：` }}</label>
            <div class="detail-item-content">{{ formItem.value }}</div>
          </el-col>
        </el-row>
      </div>
      <!-- 附件 -->
      <div class="emphasize-text">附件</div>
      <el-row :gutter="46" class="content-row">
        <el-col :span="8">
          <div v-for="(item, index) in fileList" :key="index" class="file-item">
            <i class="el-icon-document"></i>
            <span class="file-item__name">{{ item.fileName }}</span>
            <i class="el-icon-download" @click="downloadFile(item)"></i>
          </div>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button @click="reasonVisible = true">不通过</el-button>
        <el-popconfirm
          popper-class="handle-btn-pop"
          placement="top-end"
          confirm-button-text="确定"
          cancel-button-text="取消"
          cancel-button-type="default"
          icon="el-icon-warning"
          icon-color="#FAAD14"
          title="确定通过吗？"
          @confirm="changeContractState(1)"
        >
          <el-button slot="reference">通 过</el-button>
        </el-popconfirm>
      </span>
    </el-dialog>
    <!-- 审核 -->
    <el-dialog
      title="不通过理由"
      :visible.sync="reasonVisible"
      width="368px"
      top="22vh"
      :show-close="false"
      :close-on-click-modal="false"
      custom-class="custom-dialog-wrapper custom-confirm-dialog"
    >
      <div class="content-form">
        <el-input
          type="textarea"
          placeholder="请填写不通过的理由，限制50个字"
          v-model.trim="disagreeTxt"
          resize="none"
          :autosize="{ minRows: 2 }"
          maxlength="50"
          show-word-limit
        ></el-input>
      </div>

      <template slot="footer">
        <el-button @click="reasonVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeContractState(0)"
          >确 定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../../api/api";
import { moneyFormat } from "../../../commonFun/commaFormat";
export default {
  name: "contractReviewDialog",
  props: {
    contractReviewVisible: {
      type: Boolean,
      default: () => false,
    },
    dcID: {
      type: [Number, String],
    },
  },
  data() {
    return {
      reasonVisible: false,
      disagreeTxt: "",
      detailArr: [],
      fileList: [],
    };
  },
  watch: {
    contractReviewVisible: {
      immediate: true,
      handler(newVal, oldVal) {
        newVal && this.dcID && this.getContractDetail();
      },
    },
  },
  created() {},
  methods: {
    // 获取合同详情
    getContractDetail() {
      api
        .getApi("/addsp/devContract/getContractDetail", {
          dcID: this.dcID,
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let tempObj = res.data.data || {};
            for (const key in tempObj) {
              if (Object.hasOwnProperty.call(tempObj, key)) {
                if(tempObj[key]==undefined||tempObj[key]==null) {
                  tempObj[key]="--";
                }
              }
            }
            this.detailArr = [
              {
                title: "基本信息",
                content: [
                  { label: "资源名称", value: tempObj.resName },
                  { label: "物业公司", value: tempObj.pmcName },
                  { label: "联系人", value: tempObj.contactsName },
                  { label: "联系人手机号", value: tempObj.contactsPhone },
                  { label: "合同开始日期", value: tempObj.startDate },
                  { label: "合同结束日期", value: tempObj.endDate },
                  { label: "门体归属权", value: tempObj.ownership },
                  { label: "合同媒体数", value: tempObj.mediaCnt },
                  { label: "合同备注", value: tempObj.remark||"--" },
                ],
              },
              {
                title: "安装信息",
                content: [
                  { label: "赠送车场道闸", value: tempObj.freeCarGateCnt },
                  { label: "赠送护栏门", value: tempObj.freeGuardrailDoorCnt },
                  {
                    label: "赠送门禁设备",
                    value: tempObj.freeAccessControlCnt,
                  },
                  { label: "赠送IC卡", value: tempObj.freeICCardCnt },
                  { label: "赠送ID卡", value: tempObj.freeIDCardCnt },
                  { label: "赠送护栏", value: tempObj.freeGuardrailCnt },
                  { label: "赠送三辊闸", value: tempObj.freeTRGateCnt },
                  { label: "赠送翼闸", value: tempObj.freeWingGateCnt },
                ],
              },
              {
                title: "费用信息",
                content: [
                  {
                    label: "是否有场地费",
                    value: tempObj.isVenueFee ? "是" : "否",
                  },
                  { label: "场地费付款方式", value: tempObj.venuePayType },
                  {
                    label: "场地费",
                    value: moneyFormat(tempObj.venueFee / 100),
                  },
                  {
                    label: "场地费应付日期",
                    value: String(tempObj.venueDate || "").replace(
                      /(\d{1,})(\d{2})$/,
                      "$1月$2日"
                    ),
                  },
                  {
                    label: "是否有开发费",
                    value: tempObj.isDevFee ? "是" : "否",
                  },
                  { label: "开发费付款方式", value: tempObj.devPayType },
                  { label: "开发费", value: moneyFormat(tempObj.devFee / 100) },
                  {
                    label: "开发费应付日期",
                    value: String(tempObj.devDate || "").replace(
                      /(\d{1,})(\d{2})$/,
                      "$1月$2日"
                    ),
                  },
                ],
              },
            ];
            tempObj.fileList = tempObj.fileList || [];
            tempObj.fileList.forEach((item) => {
              item.fileName = item.fileUrl.split("/").pop();
            });
            this.fileList = tempObj.fileList;
          } else {
            this.$message.warning(res.data.MSG || "");
          }
        });
    },
    // 合同审核通过
    changeContractState(flag) {
      let params = {
        dcID: this.dcID,
        passState: flag,
      };
      if (!flag) {
        params.failReason = this.disagreeTxt;
      }
      api.postApi("/addsp/devContract/changeDCState", params).then((res) => {
        if (res.data.SysCode == 200200) {
          this.$emit("update:contractReviewVisible", false);
          this.reasonVisible && (this.reasonVisible = false);
          this.$emit("refreshList");
          this.$message.success(res.data.MSG || "");
        } else {
          this.$message.warning(res.data.MSG || "");
        }
      });
    },
    // 下载附件
    downloadFile(item) {
      var a = document.createElement("a");
      a.download = item.fileName;
      a.href = item.fileUrl;
      $("body").append(a); // 修复firefox中无法触发click
      a.click();
      $(a).remove();
    },
    handleClose(done) {
      this.$emit("update:contractReviewVisible", false);
    },
  },
};
</script>

<style lang="scss">
.handle-btn-pop {
  padding: 12px 16px;
  .el-popconfirm__main {
    margin-bottom: 12px;
  }
  .el-popconfirm__action {
    .el-button {
      height: 24px;
      line-height: 24px;
      font-size: 14px;
      width: 50px;
      min-width: unset;
      & + .el-button {
        margin-left: 8px;
      }
    }
  }
}
</style>
<style lang="scss" scope>
/deep/ .custom-confirm-dialog {
  border-radius: 4px;
  .el-dialog__header {
    padding: 24px 24px 8px;
    border: none !important;
    .el-dialog__title {
      font-size: 16px;
      color: rgba($color: #000, $alpha: 0.85);
    }
    .el-icon-question {
      margin-right: 16px;
      color: #fa8c16;
      &:before {
        font-size: 21px;
      }
    }
  }
  .el-dialog__body {
    border: none !important;
    .content-form {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 24px;
      /* 完成签约和付款 */
      .el-form-item {
        &:last-child {
          margin-bottom: 0;
        }
        .el-form-item__label {
          padding: 0;
          line-height: 32px;
        }
        .el-form-item__content {
          line-height: 32px;
        }
        .el-date-editor {
          width: 100%;
        }
      }
    }
    /* 重新提交和删除合同 */
    .message-content {
      padding-left: 40px;
      line-height: 22px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      & .active {
        color: #1890ff;
        font-weight: 600;
      }
    }

    .el-select {
      width: 100%;
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
}
.contract-detail-page {
  position: relative;
  .title-row {
    margin: 8px 24px;
    .title-label,
    .title-content {
      white-space: nowrap;
    }
    .row-left {
      display: flex;
      align-items: center;
      height: 32px;
      font-size: 20px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 32px;
    }
    .row-right {
      text-align: right;
    }
  }
  .content-row {
    padding: 0 23px;
  }
  .emphasize-text {
    padding: 10px 16px;
    margin: 24px 12px 8px;
    line-height: 22px;
    font-size: 16px;
    font-weight: 600;
    background: #f5f6fa;
    color: #333333;
  }
  .detail-item {
    display: flex;
    align-items: center;
    line-height: 22px;
    font-size: 14px;
    padding: 8px 24px;
    .detail-item-label {
      white-space: nowrap;
      color: rgba(0, 0, 0, 0.85);
    }
    .detail-item-content {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: rgba(0, 0, 0, 0.65);
    }
  }
  .detail-common {
    padding: 24px 24px;
    background: #ffffff;
    border: 1px solid #e6e7e9;
    .detail-common-title {
      margin: 8px 24px 0;
      line-height: 28px;
      font-size: 20px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
    }
  }
  .contract-status {
    margin-top: 8px;
    text-align: right;
    .contract-status__text {
      height: 22px;
      margin-right: 25px;
      line-height: 22px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
    }
    .contract-status-name {
      height: 28px;
      margin-right: 25px;
      line-height: 28px;
      font-size: 20px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
    }
    .contract-status__dot {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 6px;
      background: linear-gradient(180deg, #faad14 0%, #ffaa00 100%);
    }
  }
  .file-item {
    display: flex;
    align-items: center;
    flex-flow: rwo nowrap;
    box-sizing: border-box;
    height: 32px;
    padding: 0 8px;
    margin-bottom: 10px;
    .el-icon-download {
      display: none;
      margin: 0 0 0 auto;
      font-size: 20px;
      font-weight: 600;
      color: #1890ff;
    }
    .file-item__name {
      margin-left: 6px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
    }
    &:hover {
      background: rgba(0, 0, 0, 0.04);
      border-radius: 4px;
      .el-icon-download {
        display: block;
      }
    }
  }
}
</style>