<!--
 * @Author: penglei
 * @Date: 2021-06-25 16:57:03
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-13 11:34:31
 * @FilePath: /frontend/src/components/develop/components/payLog.vue
-->
<template>
  <div>
    <el-dialog
      title="付款记录"
      :visible.sync="payLogDialogVisible"
      width="418px"
      :before-close="handleClose"
      :close-on-click-modal="false"
      custom-class="custom-dialog-wrapper pay-log-dialog"
    >
      <div v-loading="loading">
        <div class="board board1">
          <el-timeline v-if="payLogArr.length" class="info-list">
            <el-timeline-item
              v-for="(logItem, index) in payLogArr"
              :key="index"
              hide-timestamp
              placement="top"
            >
              <div class="log-top">
                <span class="log-top__timestamp">{{ logItem.updateTime }}</span>
                <img
                  class="pay-status"
                  :src="payState[logItem.payState].url"
                  alt=""
                />
                <el-tooltip
                  v-if="logItem.payState == -1"
                  :content="'原因：' + logItem.failReason || '--'"
                  placement="top"
                >
                  <img
                    class="quesition-icon"
                    src="../../../assets/images/question_icon.png"
                  />
                </el-tooltip>
                <el-dropdown
                  v-if="
                    sessionData.devManageLevel == 2 && logItem.payState == 0
                  "
                  :hide-on-click="false"
                  trigger="click"
                  size="medium"
                  class="handle-pay-dropdown"
                >
                  <span class="el-dropdown-link">
                    审核<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-popconfirm
                      popper-class="handle-btn-pop"
                      placement="top-end"
                      confirm-button-text="确定"
                      cancel-button-text="取消"
                      cancel-button-type="default"
                      icon="el-icon-warning"
                      icon-color="#FAAD14"
                      title="确定通过吗？"
                      @confirm="agreeFun(logItem)"
                    >
                      <el-dropdown-item slot="reference">通过</el-dropdown-item>
                    </el-popconfirm>
                    <el-popconfirm
                      popper-class="handle-btn-pop"
                      placement="top-end"
                      confirm-button-text="确定"
                      cancel-button-text="取消"
                      cancel-button-type="default"
                      icon="el-icon-warning"
                      icon-color="#FAAD14"
                      title="确定不通过吗？"
                      @confirm="disagreeFun(logItem)"
                    >
                      <el-dropdown-item slot="reference"
                        >不通过</el-dropdown-item
                      >
                    </el-popconfirm>
                  </el-dropdown-menu>
                </el-dropdown>
                <span
                  v-if="
                    sessionData.devManageLevel == 0 && logItem.payState == -1
                  "
                  class="el-dropdown-link"
                  @click="reApplyPayFun(logItem)"
                >
                  重新申请
                </span>
                <span
                  v-if="
                    sessionData.devManageLevel == 1 && logItem.payState == 1
                  "
                  class="el-dropdown-link"
                  @click="finishPayFun(logItem)"
                >
                  完成付款
                </span>
                <el-popconfirm
                  v-if="
                    sessionData.devManageLevel == 1 && logItem.payState == 2
                  "
                  popper-class="handle-btn-pop"
                  class="no-pop-wrap"
                  placement="top-end"
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  cancel-button-type="default"
                  icon="el-icon-warning"
                  icon-color="#FAAD14"
                  title="确定完成开票吗？"
                  @confirm="finishReceipt(logItem)"
                >
                  <span slot="reference" class="el-dropdown-link">
                    完成开票
                  </span>
                </el-popconfirm>
              </div>

              <li class="info-item">
                <span class="item-label">支付款项：</span>
                <span class="item-content">
                  {{ ["场地费", "开发费", "其它"][logItem.payType - 1] || "" }}
                </span>
              </li>
              <li class="info-item">
                <span class="item-label">申请人：</span>
                <span class="item-content">
                  {{ logItem.createUserName || "--" }}
                </span>
              </li>
              <li class="info-item">
                <span class="item-label">应付金额：</span>
                <span class="item-content">
                  {{ (logItem.planPayTotal / 100) | moneyFormat("¥", 0) }}
                </span>
              </li>
              <li class="info-item">
                <span class="item-label">实付金额：</span>
                <span class="item-content">
                  {{ (logItem.actualPayTotal / 100) | moneyFormat("¥", 0) }}
                </span>
              </li>
              <li class="info-item">
                <span class="item-label">银行账号：</span>
                <span class="item-content ellipsis">
                  {{ logItem.bankAccount || "--" }}
                  <svg
                    class="copy-img"
                    @click="copyBankAccount(logItem.bankAccount || '--')"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1.001 1.001 0 0 1 3 21l.003-14c0-.552.45-1 1.007-1H7zM5.003 8L5 20h10V8H5.003zM9 6h8v10h2V4H9v2z"
                      fill="rgba(188,197,199,0.72)"
                    />
                  </svg>
                </span>
              </li>
              <li class="info-item">
                <span class="item-label">开户行：</span>
                <span class="item-content ellipsis">
                  {{ logItem.bankName || "--" }}
                </span>
              </li>
              <li
                v-if="logItem.payState == 2 || logItem.payState == 3"
                class="info-item"
              >
                <span class="item-label">付款完成日期：</span>
                <span class="item-content ellipsis">
                  {{ logItem.finishDate || "--" }}
                </span>
              </li>
              <li class="info-item">
                <span class="item-label">备注：</span>
                <span class="item-content ellipsis">
                  {{ logItem.remark || "--" }}
                </span>
              </li>
              <div v-if="logItem.fileList.length" class="append-box">
                <div class="append-box__title">附件</div>
                <div
                  v-for="(fileitem, fileIndex) in logItem.fileList"
                  :key="fileIndex"
                  class="file-item"
                >
                  <i class="el-icon-document"></i>
                  <span class="file-item__name">{{ fileitem.fileName }}</span>
                  <i
                    class="el-icon-download"
                    @click="downloadFile(fileitem)"
                  ></i>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
          <div v-else class="empty-log">
            <no-search-result></no-search-result>
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="handleClose">关 闭</el-button>
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
      custom-class="custom-dialog-wrapper custom-confirm-dialog form-dialog"
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
        <el-button type="primary" @click="changePayState(0)">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 付款申请 -->
    <el-dialog
      title="付款申请"
      width="388px"
      custom-class="custom-dialog-wrapper pay-apply-dialog"
      :visible.sync="payApplyVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escap="false"
      :before-close="resetPayApply"
    >
      <el-form
        ref="payApplyForm"
        :model="payApplyForm"
        :rules="payApplyFormRules"
        label-position="right"
      >
        <el-form-item
          label="支付款项："
          prop="payType"
          :label-width="formLabelWidth"
        >
          <el-select
            placeholder="请选择支付款项"
            v-model="payApplyForm.payType"
            size="small"
          >
            <el-option label="场地费" :value="1"></el-option>
            <el-option label="开发费" :value="2"></el-option>
            <el-option label="其它" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            currentContract[['venueDate', 'devDate'][payApplyForm.payType - 1]]
          "
          label="付款年份："
          prop="finishYear"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            v-model="payApplyForm.finishYear"
            size="small"
            type="year"
            value-format="yyyy"
            placeholder="请选择付款年份"
            :picker-options="{
              disabledDate,
            }"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          class="special-padding"
          label="付款金额："
          prop="actualPayTotal"
          :label-width="formLabelWidth"
        >
          <el-input
            :placeholder="
              payApplyForm.payType == 3
                ? '请输入付款金额'
                : `应付金额：${payApplyForm.planPayTotal}`
            "
            v-model.number="payApplyForm.actualPayTotal"
            size="small"
            maxlength="7"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="银行账号："
          prop="bankAccount"
          :label-width="formLabelWidth"
        >
          <el-input
            placeholder="请输入客户银行账号"
            v-model="payApplyForm.bankAccount"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="开户行："
          prop="bankName"
          :label-width="formLabelWidth"
        >
          <el-input
            placeholder="请输入客户开户行"
            v-model="payApplyForm.bankName"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="备注："
          prop="remark"
          :label-width="formLabelWidth"
        >
          <el-input
            type="textarea"
            placeholder="请输入备注信息"
            v-model.trim="payApplyForm.remark"
            autosize
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="附件：" :label-width="formLabelWidth">
          <el-upload
            class=""
            ref="fileUpload"
            :action="this.apiVar.qadnUrl + '/addsp/devContract/uploadFile'"
            :headers="{
              uid: sessionData.uID,
              token: sessionData.token,
            }"
            :data="{
              type: 2,
              dcID: '',
            }"
            name="file"
            :file-list="payApplyFileList"
            :on-change="fileChange"
            :on-progress="fileProgress"
            :on-success="uploadSuccess"
            :before-remove="beforeRemove"
            :on-error="uploadError"
            :auto-upload="false"
            :multiple="false"
          >
            <el-button
              slot="trigger"
              size="small"
              icon="el-icon-upload2"
              style="padding: 0 15px; color: rgba(0, 0, 0, 0.65)"
              >上传文件</el-button
            >
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="
              resetPayApply(() => {
                $emit('update:payApplyVisible', false);
              })
            "
            >取 消</el-button
          >
          <el-button type="primary" @click="submitUpload">确 定</el-button>
        </div>
      </span>
    </el-dialog>
    <!-- 完成付款 -->
    <finish-pay
      :finishPayVisible.sync="finishPayVisible"
      :payLog="currentLogItem"
      @refreshPayLog="getPayRecordList"
    ></finish-pay>
  </div>
</template>

<script>
import api from "../../../api/api";
// 时间格式化
import sessFun from "../../../commonFun/sessFun.js";
import dialogTable from "../../../components/common/components/dialogTable.vue";
import finishPay from "./finishPay.vue";
import noSearchResult from "../../../components/common/components/noSearchResult.vue";
export default {
  name: "paylog",
  props: {
    currentContract: {
      type: Object,
      default: () => {},
    },
    payLogDialogVisible: {
      type: Boolean,
      default: () => false,
    },
    payApplyVisible: {
      type: Boolean,
      default: () => false,
    },
  },
  components: {
    dialogTable,
    finishPay,
    noSearchResult,
  },
  data() {
    return {
      loading: false,
      payLogArr: [],
      disagreeTxt: "",
      reasonVisible: false,
      formLabelWidth: "85px",
      payApplyForm: {
        payType: 1,
        finishYear: "",
        planPayTotal: 0,
        actualPayTotal: "",
        bankAccount: "",
        bankName: "",
        remark: "",
      },
      payApplyFormRules: {
        payType: [
          { required: true, message: "支付款项不能为空", trigger: "blur" },
        ],
        finishYear: [
          { required: true, message: "付款年份不能为空", trigger: "blur" },
        ],
        actualPayTotal: [
          { required: true, message: "付款金额不能为空", trigger: "blur" },
          { type: "number", message: "必须为数字值", trigger: "blur" },
        ],
        bankAccount: [
          {
            pattern: /^[\da-zA-Z]{1,}$/,
            message: "请输入数字或英文字母",
            trigger: "blur",
          },
        ],
      },
      payApplyFileList: [],
      sessionData: null,
      finishPayVisible: false,
      currentLogItem: {},
      payState: {
        "-1": {
          label: "不通过",
          color: "#E51E28",
          url: "../../../static/images/payFail.png",
        },
        0: {
          label: "待审核",
          color: "#FAAD14",
          url: "../../../static/images/payReview.png",
        },
        1: {
          label: "待付款",
          color: "#FAAD14",
          url: "../../../static/images/payWait.png",
        },
        2: {
          label: "待开票",
          color: "#FAAD14",
          url: "../../../static/images/payBill.png",
        },
        3: {
          label: "已完成",
          color: "#CDD4DA",
          url: "../../../static/images/payFinish.png",
        },
      },
    };
  },
  watch: {
    payLogDialogVisible: {
      immediate: true,
      handler(newVal, oldVal) {
        newVal && this.getPayRecordList();
      },
    },
    "payApplyForm.payType": {
      handler(newPayType) {
        this.payTypeChange(newPayType);
      },
      // immediate: true,
    },
    currentContract: {
      handler(newContract) {
        this.payTypeChange(this.payApplyForm.payType);
      },
      immediate: true,
    },
  },
  created() {
    this.sessionData = sessFun.getSess();
  },
  mounted() {},
  methods: {
    // 支付款项改变时触发
    payTypeChange(newPayType) {
      // 支付款项
      let payType = ["venueFee", "devFee"][newPayType - 1],
        // 应付金额
        tempFee = this.currentContract[payType];
      if (tempFee !== null && tempFee !== undefined) {
        if (
          newPayType == 1 &&
          this.currentContract.venuePayType == "按装门数付款" &&
          this.currentContract.mediaCnt
        ) {
          // 场地费(元/门/年)
          this.payApplyForm.planPayTotal = Number(
            (tempFee * this.currentContract.mediaCnt) / 100
          ).toFixed(0);
        } else {
          this.payApplyForm.planPayTotal = Number(tempFee / 100).toFixed(0);
        }
      }
    },
    // 付款年份限制
    disabledDate(time) {
      if (this.currentContract.startDate && this.currentContract.endDate) {
        return !(
          time.getFullYear() >=
            new Date(this.currentContract.startDate).getFullYear() &&
          time.getFullYear() <=
            new Date(this.currentContract.endDate).getFullYear()
        );
      } else {
        return false;
      }
    },
    // 下载附件
    downloadFile(item) {
      let fileFormat = item.fileName.split(".").pop();
      if (
        [
          "png",
          "jpg",
          "jpeg",
          "bmp",
          "gif",
          "webp",
          "psd",
          "svg",
          "tiff",
        ].includes(fileFormat)
      ) {
        // 图片下载
        let image = new Image();
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = function () {
          let canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          let context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, image.width, image.height);
          let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
          let a = document.createElement("a"); // 生成一个a元素
          let event = new MouseEvent("click"); // 创建一个单击事件
          a.download = item.fileName; // 设置图片名称
          a.href = url; // 将生成的URL设置为a.href属性
          a.dispatchEvent(event); // 触发a的单击事件
        };
        image.src = item.fileUrl;
      } else {
        var a = document.createElement("a");
        a.download = item.fileName;
        a.href = item.fileUrl;
        document.body.appendChild(a);
        a.click(); //点击下载
        document.body.removeChild(a); //下载完成移除元素
      }
    },
    fileChange(file, fileList) {
      if (file.size <= 10 * 1024 * 1024) {
        this.payApplyFileList = fileList;
      } else {
        this.$message.warning("文件大小不能超过10M!");
        this.deleteErrorFile(file, fileList);
      }
      console.log("fileChange--", file);
    },
    fileProgress(event, file, fileList) {
      console.log("event--=-", event, fileList);
    },
    uploadSuccess(response, file, fileList) {
      if (response.SysCode == 200200) {
        file.fileUrl = response.data.fileUrl || "";
        file.id = response.data.id || "";
        // 继续付款
        if (this.payApplyFileList.every((item) => item.id)) {
          this.createPayRecord(
            this.payApplyFileList.map((item) => item.id).join(",")
          );
        } else {
          console.warn("存在未上传合同");
        }
      } else {
        this.deleteErrorFile(file, fileList);
        this.$message.warning(response.MSG || "");
      }
    },
    deleteErrorFile(file, fileList) {
      for (let i = 0; i < fileList.length; ) {
        if (fileList[i].uid === file.uid) {
          fileList.splice(i, 1);
          break;
        } else {
          i++;
        }
      }
    },
    uploadError(err, file, fileList) {
      console.warn("上传失败", err);
      this.$message.warning(file.name + "附件上传失败！");
    },
    // 重置付款申请表单
    resetPayApply(done) {
      if (this.$refs.payApplyForm) {
        this.$refs.payApplyForm.resetFields();
        done();
      }
    },
    beforeRemove(file, fileList) {
      this.payApplyFileList = fileList;
    },
    // 手动上传文件
    submitUpload() {
      console.log("手动上传文件--");
      if (this.payApplyFileList.every((item) => item.id)) {
        this.createPayRecord(
          this.payApplyFileList.map((item) => item.id).join(",")
        );
      } else {
        // 还有文件未上传
        this.$refs.fileUpload.submit();
      }
    },
    // 提交付款申请
    createPayRecord(fileIDs) {
      this.$refs.payApplyForm.validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            text: "请耐心等待...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          let params = {
            ...this.payApplyForm,
            dcID: this.currentContract.id,
            fileIDs,
          };
          params.actualPayTotal = params.actualPayTotal * 100;
          params.planPayTotal = params.planPayTotal * 100;
          api
            .postApi("/addsp/devContract/createPayRecord", params)
            .then(async (res) => {
              if (res.data.SysCode == 200200) {
                this.resetPayApply(() => {
                  this.$emit("update:payApplyVisible", false);
                });
                // 重新申请需要手动更改状态
                if (this.payApplyForm.id) {
                  await this.changePayState(1);
                }
                this.$emit("refreshList");
              } else {
                this.$message.warning(res.data.MSG || "");
              }
            })
            .finally((res) => {
              loading.close();
            });
        } else {
          console.warn("valid---");
        }
      });
    },
    // 重新申请付款
    reApplyPayFun(logItem) {
      console.log("重新申请付款", logItem);
      let {
        id,
        payType,
        finishYear,
        planPayTotal,
        actualPayTotal,
        bankAccount,
        bankName,
        remark,
      } = logItem;
      this.payApplyForm = {
        id,
        payType,
        finishYear: finishYear + "",
        planPayTotal,
        actualPayTotal: Number(actualPayTotal / 100),
        bankAccount,
        bankName,
        remark,
      };
      this.currentLogItem = logItem;
      this.$emit("update:payApplyVisible", true);
    },
    // 完成付款
    finishPayFun(logItem) {
      this.currentLogItem = logItem;
      this.finishPayVisible = true;
    },
    // 完成开票
    finishReceipt(logItem) {
      this.currentLogItem = logItem;
      this.changePayState(1);
    },
    // 通过审核弹框
    agreeFun(logItem) {
      this.currentLogItem = logItem;
      this.changePayState(1);
    },
    // 付款申请不通过确认框
    disagreeFun(logItem) {
      this.currentLogItem = logItem;
      this.reasonVisible = true;
    },
    // 付款申请审核
    changePayState(flag) {
      let params = {
        dcpID: this.currentLogItem.id,
        passState: flag,
      };
      if (!flag) {
        if (this.disagreeTxt) {
          params.failReason = this.disagreeTxt;
        } else {
          this.$message.warning("请输入不通过理由！");
          return;
        }
      }
      return new Promise((resolve) => {
        api
          .postApi("/addsp/devContract/changePayState", params)
          .then((res) => {
            if (res.data.SysCode == 200200) {
              this.reasonVisible && (this.reasonVisible = false);
              this.getPayRecordList();
              resolve(true);
            } else {
              this.$message.warning(res.data.MSG || "操作失败！");
              resolve(false);
            }
          })
          .catch((error) => {
            resolve(false);
          });
      });
    },
    // 获取付款记录
    getPayRecordList() {
      this.loading = true;
      return new Promise((resolve) => {
        api
          .getApi("/addsp/devContract/payRecordList", {
            dcID: this.currentContract.id,
          })
          .then((res) => {
            if (res.data.SysCode == 200200) {
              (res.data.data || []).forEach((item) => {
                item.fileList = item.fileList || [];
                item.fileList.forEach((fileItem) => {
                  fileItem.fileName = fileItem.fileUrl.split("/").pop();
                });
              });
              this.payLogArr = res.data.data || [];
            } else {
              this.$message.warning(res.data.MSG);
            }
          })
          .finally(() => {
            this.loading = false;
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    // 复制银行账号
    copyBankAccount(bankAccount) {
      let oInput = document.createElement("input");
      oInput.value = bankAccount;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.style.display = "none";
      this.$message.success("复制成功");
    },
    handleClose(done) {
      this.$emit("update:payLogDialogVisible", false);
    },
  },
};
</script>
<style lang="scss">
.el-dropdown-link {
  margin: 0 0 0 auto;
  cursor: pointer;
  color: #409eff;
}

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
/* 付款记录 */
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
<style lang="scss" scoped>
/* 不通过理由 */
/deep/ .form-dialog {
  .el-dialog__header {
    padding: 16px 24px 24px !important;
  }
}
/* 付款记录 */
/deep/ .pay-log-dialog {
  .el-timeline-item__wrapper {
    padding-left: 15px;
  }
  .el-timeline-item__node--normal {
    width: 6px;
    height: 6px;
    margin-top: 5px;
    background: #ffffff;
    border: 1px solid #1890ff;
  }
  .el-timeline-item__tail {
    left: 3px;
    margin-top: 5px;
    border-left: 1px solid #1890ff;
  }
  .log-top {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .log-top__timestamp {
      line-height: 24px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }
    .pay-status {
      height: 18px;
      margin-left: 8px;
    }
    .no-pop-wrap {
      margin: 0 0 0 auto;
    }
    .quesition-icon {
      width: 14px;
      height: 14px;
      margin-left: 5px;
      border-radius: 50%;
      vertical-align: middle;
      -webkit-filter: brightness(0.75);
      filter: brightness(0.75);
    }
    .handle-pay-dropdown {
      margin-left: auto;
    }
  }
  .el-dialog__body {
    max-height: 500px !important;
    overflow: auto !important;
  }
  .el-dialog__footer {
    .el-button + .el-button {
      margin-left: 10px;
    }
  }
  .board {
    min-height: 380px;
    padding: 16px 0;
    & + .board {
      border-top: 1px solid rgba(233, 233, 233, 1);
    }
  }
  .board1 {
    .info-item {
      display: flex;
      align-items: center;
      margin-top: 4px;
      color: rgba(0, 0, 0, 0.85);
      .active {
        color: rgba(24, 144, 255, 1);
        cursor: pointer;
      }
      .item-label {
        white-space: nowrap;
      }
      .item-content {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
        &.ellipsis {
          width: 270px;
          display: inline-block;
          vertical-align: text-bottom;
          overflow: hidden;
        }
        .copy-img {
          width: 16px;
          height: 16px;
          vertical-align: middle;
          cursor: pointer;
        }
      }
    }
    .empty-log {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 100px;
      text-align: center;
    }
  }
  .append-box {
    margin-top: 8px;
    border: 1px solid #e8e8e8;
    .append-box__title {
      height: 40px;
      line-height: 40px;
      padding: 0 12px;
      font-size: 14px;
      font-weight: 600;
      background: #f5f6fa;
      color: rgba(0, 0, 0, 0.85);
    }
    .file-item {
      display: flex;
      align-items: center;
      flex-flow: rwo nowrap;
      box-sizing: border-box;
      height: 32px;
      padding: 7px 8px;
      margin: 7px 4px 2px;
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
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &:hover {
        background: rgba(0, 0, 0, 0.04);
        border-radius: 4px;
        .el-icon-download {
          display: block;
          cursor: pointer;
        }
      }
    }
  }
}
/* 付款申请 */
/deep/ .pay-apply-dialog {
  border-radius: 4px;
  ::placeholder {
    /*Firefox,Chrome,Opera*/
    font-size: 14px;
    color: rgba(0, 0, 0, 0.25);
  }
  :-ms-input-placeholder {
    /*InternetExplorer10-11*/
    font-size: 14px;
    color: rgba(0, 0, 0, 0.25);
  }
  ::-ms-input-placeholder {
    /*MicrosoftEdge*/
    font-size: 14px;
    color: rgba(0, 0, 0, 0.25);
  }
  .el-form-item {
    margin-bottom: 16px;
    .el-form-item__label {
      padding: 0;
      line-height: 32px;
      white-space: nowrap;
      color: rgba(0, 0, 0, 0.85);
      &:before {
        margin-right: 0;
      }
    }
    .el-form-item__content {
      line-height: unset;
      .el-input__inner {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
      }
      .el-textarea__inner {
        font-size: 14px;
      }
      .el-date-editor {
        width: 100%;
      }
      .el-input-group__append {
        padding: 4px 12px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.25);
      }
      .el-select {
        width: 100%;
      }
    }
  }
  .special-padding.el-form-item {
    .el-input-group__append {
      padding: 4px 9px;
    }
  }
  .el-dialog__header {
    padding: 16px 24px;
    border-bottom: unset !important;
    .el-dialog__title {
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
    }
  }
  .el-dialog__body {
    padding: 0 24px;
    border-bottom: unset !important;
  }
  .el-dialog__footer {
    padding: 8px 24px 24px;
    word-spacing: -1em;
    .el-button + .el-button {
      margin-left: 16px;
    }
  }
}
.table-top-tip {
  display: flex;
  align-items: baseline;
  margin: 0 0 16px;
  padding: 8px;
  border: 1px solid #bae7ff;
  border-radius: 4px;
  background: #e6f7ff;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
  .el-icon-info {
    color: #1890ff;
    margin-right: 4px;
  }
  h4 {
    font-size: 14px;
    display: inline-block;
  }
  .tip-active {
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    color: #1890ff;
    &.right {
      margin-left: auto;
    }
    &.warn {
      color: rgba(250, 102, 20, 1);
    }
  }
  .tip-active-handle {
    font-weight: 400;
  }
  .divide-border {
    display: inline-block;
    width: 1px;
    height: 14px;
    margin: 0 8px;
    vertical-align: middle;
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>
