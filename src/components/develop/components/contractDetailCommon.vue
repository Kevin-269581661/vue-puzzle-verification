<!--
 * @Author: penglei
 * @Date: 2021-06-29 21:39:57
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-07 14:51:07
 * @FilePath: /frontend/src/components/develop/components/contractDetailCommon.vue
-->
<template>
  <div>
    <el-row type="flex" justify="space-between" class="title-row">
      <el-col :span="8" class="row-left">
        <label class="title-label">{{
          contractTypeArr[contractObj.dcType]
        }}</label>
        <div v-if="contractObj.contractNo" class="title-content">
          {{ `（${contractObj.contractNo}）` }}
        </div>
        <div
          v-if="contractObj.dcState !== undefined"
          class="contract-status-name"
          :style="{
            color: stateList[contractObj.dcState].color,
            'border-color': stateList[contractObj.dcState].color,
          }"
        >
          {{ stateList[contractObj.dcState].label }}
        </div>
      </el-col>
      <el-col :span="16" class="row-right">
        <el-button
          v-for="(item, index) in operationArr"
          :key="index"
          size="mini"
          @click="handleContract(contractObj, item)"
          >{{ item }}</el-button
        >
      </el-col>
    </el-row>
    <el-table
      v-if="mediaRelList.length > 0"
      :data="mediaRelList"
      border
      style="width: 100%"
      class="media-table"
    >
      <el-table-column prop="mTitle" label="媒体名称" width="180">
        <template slot-scope="scope">
          <div class="media-cell">
            <span>{{ scope.row.mTitle }}</span>
            <img
              class="media-img"
              v-if="scope.row.isNew && scope.row.state == 1"
              src="../../../assets/images/develop/media1.png"
              alt=""
            />
            <img
              class="media-img"
              v-if="scope.row.isNew && scope.row.state == 0"
              src="../../../assets/images/develop/media0.png"
              alt=""
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mType" label="门体类型" width="180">
      </el-table-column>
      <el-table-column prop="installUserName" label="安装负责人">
      </el-table-column>
      <el-table-column prop="installDate" label="安装/拆除完成日期">
      </el-table-column>
      <el-table-column prop="mState" label="媒体状态">
        <template slot-scope="scope">
          <span
            class="media-state-dot"
            :style="{ background: mediaStatusMap[scope.row.mState].color }"
          >
          </span>
          {{ mediaStatusMap[scope.row.mState].label }}
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
          `${contractTypeArr[contractObj.dcType] || ""}`
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
          `${contractTypeArr[contractObj.dcType] || ""}`
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
      @refreshList="getContractDetail"
    ></add-media-to-contract>
    <!-- 续签弹框 -->
    <next-contract-dialog
      :currentContract="contractObj"
      :mergeVisible.sync="mergeVisible"
      @refreshList="getContractDetail"
    ></next-contract-dialog>
    <!-- 付款记录 -->
    <pay-log
      :currentContract="contractObj"
      :payLogDialogVisible.sync="payLogDialogVisible"
      :payApplyVisible.sync="payApplyVisible"
      @refreshList="getContractDetail"
    ></pay-log>
    <!-- 完成签约 -->
    <sign-contract
      :signVisible.sync="signVisible"
      :dcID="contractObj.id"
      @refreshList="getContractDetail"
    ></sign-contract>
    <!-- 合同审核 -->
    <contract-review-dialog
      :dcID="contractObj.id"
      :contractReviewVisible.sync="contractReviewVisible"
      @refreshList="getContractDetail"
    ></contract-review-dialog>
    <!-- 终止合同弹框 -->
    <el-dialog
      :visible.sync="terminateVisible"
      width="388px"
      top="22vh"
      :show-close="false"
      :close-on-click-modal="false"
      custom-class="custom-dialog-wrapper custom-confirm-dialog"
    >
      <div slot="title"><i class="el-icon-question"></i>是否终止该合同？</div>
      <div class="message-content">
        确定后，<span class="active">{{ contractObj.resName }}</span> 的
        <span class="active">{{
          `${contractTypeArr[contractObj.dcType] || ""}`
        }}</span>
        将被终止
      </div>
      <div class="terminate-box">
        <span class="terminate-title">请选择终止原因：</span>
        <span
          v-for="(reasonItem, index) in reasons"
          :key="index"
          :class="{ 'tag-default': true, 'tag-active': reasonItem.selected }"
          @click="reasonItem.selected = !reasonItem.selected"
          >{{ reasonItem.label }}</span
        >
        <el-input
          class="terminate-input"
          v-if="reasons[6].selected"
          v-model="reasons[6].value"
          size="small"
          placeholder="请填写其他原因"
        ></el-input>
      </div>

      <template slot="footer">
        <el-button @click="terminateVisible = false">取 消</el-button>
        <el-button type="primary" @click="terminateFun">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../../api/api";
import { moneyFormat } from "../../../commonFun/commaFormat";
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
        2: "加门合同",
        3: "补充协议合同",
      },
      stateList: {
        "-1": { label: "不通过", color: "#F5222D" },
        0: { label: "待审核", color: "#FFAA00" },
        1: { label: "待签约", color: "#FFAA00" },
        2: { label: "待安装", color: "#FFAA00" },
        3: { label: "待拆除", color: "#FFAA00" },
        4: { label: "正常", color: "#1890FF" },
        5: { label: "合同到期", color: "#CDD4DA" },
        6: { label: "强制终止", color: "#CDD4DA" },
      },
      // 角色
      roleArr: ["0", "1", "2"],
      operationAuthorityArr: {
        编辑: ["000", "00-1", "010", "020", "01-1", "02-1", "030", "03-1"],
        删除: [
          "000",
          "00-1",
          "001",
          // "002",
          // "003",
          "010",
          "020",
          "01-1",
          "02-1",
          "011",
          "021",
          // "012",
          // "022",
          // "013",
          // "033",
          "030",
          "03-1",
          "031",
          // "032",
        ],
        重新提交: ["00-1", "01-1", "02-1", "03-1"],
        媒体录入: ["002", "012", "022", "032"],
        续签: [
          "004",
          "005",
          "006",
          "014",
          "024",
          "015",
          "025",
          "016",
          "026",
          "034",
          "035",
          "036",
        ],
        补充协议: ["004", "014", "024", "034"],
        加门: ["004", "014", "024", "034"],
        付款: ["004", "005", "014", "024", "015", "025", "034", "035"],
        付款记录: [
          "004",
          "005",
          "006",
          "014",
          "024",
          "015",
          "025",
          "016",
          "026",
          "034",
          "035",
          "036",
          "204",
          "205",
          "206",
          "214",
          "224",
          "215",
          "225",
          "216",
          "226",
          "104",
          "105",
          "106",
          "114",
          "124",
          "115",
          "125",
          "116",
          "126",
          "134",
          "135",
          "136",
        ],
        审核: ["200", "210", "220", "230"],
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
        { label: "业委会不通过", value: "", selected: false },
        { label: "修路/封路", value: "", selected: false },
        { label: "小区改造", value: "", selected: false },
        { label: "更换物业", value: "", selected: false },
        { label: "竞品取代", value: "", selected: false },
        { label: "我方原因", value: "", selected: false },
        { label: "其它", value: "", selected: false },
      ],
      // 媒体状态
      mediaStatusMap: {
        0: { label: "禁用", color: "rgba(245,34,45,1)" },
        1: { label: "正常", color: "rgba(82,196,26,1)" },
        2: { label: "待安装", color: "rgba(196,203,211,1)" },
        3: { label: "待维修", color: "rgba(250,173,20,1)" },
        4: { label: "已拆除", color: "rgba(24,144,255,1)" },
      },
    };
  },
  watch: {
    dcID: {
      immediate: true,
      handler(newVal, oldVal) {
        /* clearTimeout(timeOut);
        timeOut = setTimeout(() => {}, 500); */
        newVal && this.getContractDetail();
      },
    },
  },
  created() {},
  methods: {
    // 合同终止
    terminateFun() {
      if (this.reasons[6].selected && !this.reasons[6].value) {
        this.$message.warning("请填写其它原因！");
        return;
      }
      let stopReason = this.reasons.reduce((pre, cur) => {
        cur.selected && cur.value !== "" && pre.push(cur.value);
        return pre;
      }, []);
      if (stopReason.length) {
        api
          .postApi("/addsp/devContract/changeDCState", {
            dcID: this.contractObj.id,
            passState: 0,
            stopReason: stopReason.join(","),
          })
          .then((res) => {
            if (res.data.SysCode == 200200) {
              this.getContractDetail();
              this.terminateVisible = false;
              this.$message.success(res.data.MSG || "合同终止成功！");
            } else {
              this.$message.warning(res.data.MSG || "");
            }
          });
      } else {
        this.$message.warning("请选择终止原因");
      }
    },
    // 合同删除
    deleteContractFun() {
      api
        .postApi("/addsp/devContract/delete", {
          dcID: this.contractObj.id,
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            // this.getContractDetail();
            this.$emit("refresh");
            this.deleteContractVisible = false;
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
    // 验证是否可以续签和补签
    valiateNextContract(originIDs) {
      return new Promise((resolve, reject) => {
        api
          .getApi("/addsp/devContract/valiateNextContract", {
            originIDs,
          })
          .then((res) => {
            if (res.data.SysCode == 200200) {
              resolve(true);
            } else {
              this.$message.warning("尚有续签/补充协议申请未完成！");
              resolve(false);
            }
          })
          .catch((error) => {
            resolve(false);
          });
      });
    },
    // 合同操作
    async handleContract(row, operation) {
      this.contractObj = row;
      switch (operation) {
        case "编辑":
          if (row.dcType > 0) {
            this.$router.push({
              path: "./nextContract",
              query: {
                dcID: row.id,
                originID: row.originID || "",
                handleType: row.dcType,
                edit: 1,
              },
            });
          } else {
            this.$router.push({
              path: "./editContract",
              query: { resID: row.resID, dcID: row.id },
            });
          }
          break;
        case "删除":
          this.deleteContractVisible = true;
          break;
        case "重新提交":
          this.resubmitVisible = true;
          break;
        case "媒体录入":
          this.correlateMediaMode = true;
          break;
        case "续签":
          this.mergeVisible = true;
          break;
        case "补充协议":
          if (await this.valiateNextContract(row.originID)) {
            this.$router.push({
              path: "./nextContract",
              query: {
                dcID: row.id,
                originID: row.originID || "",
                handleType: 3,
              },
            });
          }
          break;
        case "加门":
          this.$router.push({
            path: "./nextContract",
            query: {
              dcID: row.id,
              originID: row.originID || "",
              handleType: 2,
            },
          });
          break;
        case "付款":
          this.payApplyVisible = true;
          break;
        case "付款记录":
          this.payLogDialogVisible = true;
          break;
        case "审核":
          this.contractReviewVisible = true;
          break;
        case "完成签约":
          this.signVisible = true;
          break;
        case "合同终止":
          this.terminateVisible = true;
          break;
      }
    },
    // 获取当前列表操作权限
    getContractOperation() {
      let tempNo = `${
          this.roleArr[
            JSON.parse(sessionStorage.getItem("session_data")).devManageLevel
          ]
        }${this.contractObj.dcType}${this.contractObj.dcState}`,
        tempArr = [];
      if (this.contractObj.isOperate) {
        for (const key in this.operationAuthorityArr) {
          if (Object.hasOwnProperty.call(this.operationAuthorityArr, key)) {
            this.operationAuthorityArr[key].includes(tempNo) &&
              tempArr.push(key);
          }
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
                  {
                    label: "场地费",
                    value: moneyFormat(tempObj.venueFee / 100),
                  },
                  {
                    label: "场地费应付日期",
                    value: String(tempObj.venueDate || "").replace(
                      /(\d{2})$/,
                      "-$1"
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
                      /(\d{2})$/,
                      "-$1"
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
            // isNew: 本次合同新增和拆除媒体 state: 0-拆除 1-新增
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
<style lang="scss">
.custom-dialog-wrapper {
  .el-dialog__header {
    padding: 16px 24px;
    text-align: left;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
  }
  .el-dialog__body {
    padding: 0 24px;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
  }
  .el-dialog__footer {
    padding: 11px 20px;
  }
  .el-pagination__sizes .el-input--mini .el-input__inner {
    height: 28px;
  }
}
.custom-confirm-dialog {
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
</style>
<style lang="scss" scope>
.media-table {
  margin: 16px 12px;
  width: calc(100% - 24px);
  .el-table__body-wrapper,
  .el-table__empty-block {
    min-height: unset;
  }
  .media-state-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 4px;
  }
  .media-cell {
    position: relative;
    .media-img {
      position: absolute;
      right: 0;
      top: 5px;
      width: 32px;
      height: 18px;
    }
  }
}
.contract-borde {
  padding: 18px 0;
  & + .contract-borde {
    border-top: 1px solid #e6e7e9;
  }
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
  border-radius: 2px;
  border: 1px solid #91d5ff;
  line-height: 22px;
  font-size: 12px;
  color: #1890ff;
  white-space: nowrap;
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
.terminate-box {
  padding-left: 40px;
  margin-top: 24px;
  .terminate-title {
    display: block;
    line-height: 22px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
  .tag-default {
    display: inline-block;
    box-sizing: border-box;
    height: 32px;
    padding: 0px 12px;
    margin: 8px 8px 0 0;
    line-height: 32px;
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e8e8e8;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
  }
  .terminate-input {
    margin-top: 8px;
  }
  .tag-active {
    color: #1890ff;
    border: 1px solid #1890ff;
  }
}
</style>