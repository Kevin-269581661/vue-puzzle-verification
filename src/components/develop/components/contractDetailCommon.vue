<!--
 * @Author: penglei
 * @Date: 2021-06-29 21:39:57
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-04 11:20:21
 * @FilePath: /frontend/src/components/develop/components/contractDetailCommon.vue
-->
<template>
  <div>
    <el-row type="flex" justify="space-between" class="title-row">
      <el-col :span="6" class="row-left">
        <label class="title-label">{{
          contractTypeArr[contractObj.dcType]
        }}</label>
        <div v-if="contractObj.contractNo" class="title-content">
          {{ `（${contractObj.contractNo}）` }}
        </div>
        <div class="contract-status-name">
          {{ stateList[contractObj.dcState] }}
        </div>
      </el-col>
      <el-col :span="18" class="row-right">
        <el-button
          v-for="(item, index) in operationArr"
          :key="index"
          size="mini"
          @click="handleContract(item)"
          >{{ item }}</el-button
        >
      </el-col>
    </el-row>
    <el-table
      v-if="mediaRelList.length>0"
      :data="mediaRelList"
      border
      style="width: 100%"
      class="media-table"
    >
      <el-table-column prop="mTitle" label="媒体名称" width="180">
      </el-table-column>
      <el-table-column prop="mType" label="媒体类型" width="180">
      </el-table-column>
      <el-table-column prop="installUserName" label="安装负责人"> </el-table-column>
      <el-table-column prop="installDate" label="安装/拆除完成日期">
      </el-table-column>
      <el-table-column prop="mState" label="媒体状态">
        <template slot-scope="scope">
          {{mediaStatusMap[scope.row.mState]}}
        </template>
      </el-table-column>
    </el-table>
    <div v-for="(item, index) in detailArr" :key="index" class="contract-borde">
      <div class="emphasize-text">{{ item.title }}</div>
      <el-row :gutter="46" class="content-row">
        <el-col
          v-for="(formItem, formIndex) in item.content"
          :key="formIndex"
          :span="6"
          class="detail-item"
        >
          <label class="detail-item-label">{{ `${formItem.label}：` }}</label>
          <div class="detail-item-content">{{ formItem.value || "" }}</div>
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
    <!-- 重新提交审核 -->
    <el-dialog
      :visible.sync="resubmitVisible"
      width="388px"
      top="22vh"
      :show-close="false"
      :close-on-click-modal="false"
      custom-class="custom-dialog-wrapper custom-confirm-dialog"
    >
      <div slot="title"><i class="el-icon-question"></i>是否重新提交审核？</div>
      <div class="message-content">
        确定后，<span class="active">{{ contractObj.resName }}</span> 的
        <span class="active">{{
          `${contractTypeArr[contractObj.dcType] || ""}合同`
        }}</span>
        将被重新提交审核
      </div>

      <template slot="footer">
        <el-button @click="resubmitVisible = false">取 消</el-button>
        <el-button type="primary" @click="resubmitFun">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 合同删除 -->
    <el-dialog
      :visible.sync="deleteContractVisible"
      width="388px"
      top="22vh"
      :show-close="false"
      :close-on-click-modal="false"
      custom-class="custom-dialog-wrapper custom-confirm-dialog"
    >
      <div slot="title"><i class="el-icon-question"></i>是否删除该合同？</div>
      <div class="message-content">
        确定后，<span class="active">{{ contractObj.resName }}</span> 的
        <span class="active">{{
          `${contractTypeArr[contractObj.dcType] || ""}合同`
        }}</span>
        将被删除
      </div>

      <template slot="footer">
        <el-button @click="deleteContractVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteContractFun">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 关联媒体至合同 -->
    <add-media-to-contract
      :currentContract="contractObj"
      :correlateMediaMode.sync="correlateMediaMode"
      @searchFormat="getContractDetail"
    ></add-media-to-contract>
    <!-- 续签弹框 -->
    <next-contract-dialog
      :mergeVisible.sync="mergeVisible"
    ></next-contract-dialog>
    <!-- 付款记录 -->
    <pay-log
      :currentContract="contractObj"
      :payLogDialogVisible.sync="payLogDialogVisible"
      :payApplyVisible.sync="payApplyVisible"
      @refreshList="getContractDetail"
    ></pay-log>
    <!-- 完成签约 -->
    <sign-contract :signVisible="signVisible"></sign-contract>
    <!-- 合同审核 -->
    <contract-review-dialog
      :dcID="contractObj.id"
      :contractReviewVisible.sync="contractReviewVisible"
      @refreshList="getContractDetail"
    ></contract-review-dialog>
  </div>
</template>

<script>
import api from "../../../api/api";
import PayLog from "../components/payLog.vue";
import NextContractDialog from "../components/nextContractDialog.vue";
import AddMediaToContract from "../components/addMediaToContract.vue";
import SignContract from "../components/signContract";
import ContractReviewDialog from "../components/contractReviewDialog.vue";
export default {
  name: "contractDetailCommon",
  components: {
    PayLog,
    NextContractDialog,
    AddMediaToContract,
    SignContract,
    ContractReviewDialog,
  },
  props: {
    dcID: {
      type: [Number, String],
      default: "",
    },
  },
  data() {
    return {
      detailArr: [],
      fileList: [],
      contractTypeArr: {
        0: "首签合同",
        1: "续签合同",
        2: "补充协议",
        3: "加门合同",
      },
      stateList: {
        "-1": "审核不通过",
        0: "待审核",
        1: "待签约",
        2: "待安装",
        3: "待拆除",
        4: "正常",
        5: "合同到期",
        6: "强制终止",
      },
      // 角色
      roleArr: ["0", "1", "2"],
      operationAuthorityArr: {
        编辑: ["000", "00-1", "010", "020", "01-1", "02-1", "030", "03-1"],
        删除: ["000", "00-1", "001", "002", "003", "010", "020", "01-1", "02-1", "011", "021", "012", "022", "013", "023", "030", "03-1", "031", "032"],
        重新提交: ["00-1", "01-1", "02-1", "03-1"],
        媒体录入: ["002", "012", "022", "032"],
        续签: ["004", "005", "006", "014", "024", "015", "025", "016", "026", "034", "035", "036"],
        补充协议: ["004", "014", "024", "034"],
        加门: ["004", "014", "024", "034"],
        付款: ["004", "005", "014", "024", "015", "025", "034", "035"],
        付款记录: ["004", "005", "006", "014", "024", "015", "025", "016", "026", "034", "035", "036", "204", "205", "206", "214", "224", "215", "225", "216", "226", "104", "105", "106", "114", "124", "115", "125", "116", "126", "134", "135", "136"],
        审核: ["200", "210", "220"],
        完成签约: ["101", "111", "121", "131"],
        合同终止: ["104", "114", "124", "134"],
      },
      operationArr: [],
      contractObj: {},
      mediaRelList: [],
      // 录入媒体弹框
      correlateMediaMode: false,
      // 续签合同
      mergeVisible: false,
      // 付款记录
      payLogDialogVisible: false,
      // 付款申请
      payApplyVisible: false,
      // 删除合同弹框
      deleteContractVisible: false,
      // 签约弹框
      signVisible: false,
      // 重新提交弹框
      resubmitVisible: false,
      // 合同审核弹框
      contractReviewVisible: false,
      // 终止合同弹框
      terminateVisible: false,
      reasons: [
        { label: "业委会不通过", val: "", selected: false },
        { label: "修路/封路", val: "", selected: false },
        { label: "小区改造", val: "", selected: false },
        { label: "更换物业", val: "", selected: false },
        { label: "竞品取代", val: "", selected: false },
        { label: "我方原因", val: "", selected: false },
        { label: "其它", val: "", selected: false },
      ],
      // 媒体状态
      mediaStatusMap: {
        0: "禁用",
        1: "正常",
        2: "待安装",
        3: "待维修",
        4: "已拆除"
      },
    };
  },
  watch: {
    dcID: {
      immediate: true,
      handler(newVal, oldVal) {
        newVal && this.getContractDetail();
      },
    },
  },
  created() {},
  methods: {
    // 合同删除
    deleteContractFun() {
      api
        .postApi("/addsp/devContract/delete", {
          dcID: this.contractObj.id,
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.$message.success(res.data.MSG || "合同删除成功！");
          } else {
            this.$message.warning(res.data.MSG || "");
          }
        });
    },
    // 重新提交
    resubmitFun() {
      api
        .postApi("/addsp/devContract/changeDCState", {
          dcID: this.contractObj.id,
          passState: 1,
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.getContractDetail();
            this.resubmitVisible = false;
            this.$message.success(res.data.MSG || "重新提交成功！");
          } else {
            this.$message.warning(res.data.MSG || "");
          }
        });
    },

    // 合同操作
    handleContract(operation) {
      switch (operation) {
        case "编辑":
          this.$router.push({path: "./editContract", query: {resID: this.contractObj.resID, dcID: this.contractObj.id}});
          break;
        case "删除":
          this.deleteContractVisible = true;
          break;
        case "重新提交":
          break;
        case "媒体录入":
          break;
        case "续签":
          break;
        case "补充协议":
          break;
        case "加门":
          break;
        case "付款":
          break;
        case "付款记录":
          break;
        case "审核":
          break;
        case "完成签约":
          this.signVisible = true;
          break;
        case "合同终止":
          break;
      }
    },
    // 获取当前列表操作权限
    getContractOperation() {
      let tempNo = `${
          this.roleArr[JSON.parse(sessionStorage.getItem("session_data")).devManageLevel]
        }${this.contractObj.dcType}${this.contractObj.dcState}`,
        tempArr = [];
      for (const key in this.operationAuthorityArr) {
        if (Object.hasOwnProperty.call(this.operationAuthorityArr, key)) {
          this.operationAuthorityArr[key].includes(tempNo) && tempArr.push(key);
        }
      }
      this.operationArr = tempArr;
    },
    // 获取合同详情
    getContractDetail() {
      api
        .getApi("/addsp/devContract/getContractDetail", {
          dcID: this.dcID,
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let tempObj = res.data.data || {};
            this.contractObj = tempObj;
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
                  // {label: "赠送护栏", value: tempObj.freeGuardrailDoorCnt},
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
                  { label: "场地费", value: tempObj.venueFee },
                  { label: "场地费应付日期", value: tempObj.venueDate },
                  {
                    label: "是否有开发费",
                    value: tempObj.isDevFee ? "是" : "否",
                  },
                  { label: "开发费付款方式", value: tempObj.devPayType },
                  { label: "开发费", value: tempObj.devFee },
                  { label: "开发费应付日期", value: tempObj.devDate },
                ],
              }
            ];
            tempObj.fileList = tempObj.fileList || [];
            tempObj.fileList.forEach((item) => {
              item.fileName = item.fileUrl.split("/").pop();
            });
            this.fileList = tempObj.fileList;
            this.mediaRelList = tempObj.mediaRelList || [];
            this.getContractOperation();
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
  },
};
</script>
<style lang="scss" scope>
@import "../../../assets/component.scss";
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
.media-table {
  margin: 16px 12px;
  width: calc(100% - 24px);
  .el-table__body-wrapper, .el-table__empty-block {
    min-height: unset;
  }
}
.contract-borde + .contract-borde {
  padding: 18px 0;
  border-top: 1px solid #E6E7E9;
}
.title-row {
  margin: 8px 12px;
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
  padding: 0 12px;
}
.emphasize-text {
  padding: 10px 0;
  margin: 0 12px 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  line-height: 22px;
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
.contract-status-name {
  height: 22px;
  padding: 0 8px;
  margin-left: 8px;
  background: #e6f7ff;
  border-radius: 2px;
  border: 1px solid #91d5ff;
  font-size: 12px;
  color: #1890ff;
  line-height: 22px;
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
</style>