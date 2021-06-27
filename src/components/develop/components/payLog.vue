<!--
 * @Author: penglei
 * @Date: 2021-06-25 16:57:03
 * @LastEditors: penglei
 * @LastEditTime: 2021-06-27 19:16:35
 * @FilePath: /frontend/src/components/develop/components/payLog.vue
-->
<template>
  <div>
    <el-dialog
      title="付款记录"
      :visible.sync="dialogVisible"
      width="418px"
      :before-close="handleClose"
      :close-on-click-modal="false"
      custom-class="custom-dialog-wrapper pay-log-dialog"
    >
      <div v-loading="loading">
        <div class="board board1">
          <el-timeline class="info-list">
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
                  src="../../../assets/images/develop/statusDanger.png"
                  alt=""
                />
                <el-tooltip content="原因：实付费用有问题" placement="top">
                  <img
                    class="quesition-icon"
                    src="../../../assets/images/question_icon.png"
                  />
                </el-tooltip>
                <el-dropdown
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
                      @confirm="disagreeFun"
                    >
                      <el-dropdown-item slot="reference"
                        >不通过</el-dropdown-item
                      >
                    </el-popconfirm>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>

              <li class="info-item">
                <span class="item-label">支付款项：</span>
                <span class="item-content">
                  {{ ["场地费", "开发费"][logItem.payType - 1] || "" }}
                </span>
              </li>
              <li class="info-item">
                <span class="item-label">申请人：</span>
                <span class="item-content">
                  {{ logItem.createUser || "--" }}
                </span>
              </li>
              <li class="info-item">
                <span class="item-label">应付金额：</span>
                <span class="item-content">
                  {{ (logItem.planPayTotal / 100) | moneyFormat("¥") }}
                </span>
              </li>
              <li class="info-item">
                <span class="item-label">实付金额：</span>
                <span class="item-content">
                  {{ (logItem.actualPayTotal / 100) | moneyFormat("¥") }}
                </span>
              </li>
              <li class="info-item">
                <span class="item-label">银行账号：</span>
                <span class="item-content ellipsis">
                  {{ logItem.bankAccount || "--" }}
                  <img
                    class="copy-img"
                    src="../../../assets/images/develop/copy.png"
                    alt=""
                    @click="copyBankAccount(logItem.bankAccount || '--')"
                  />
                </span>
              </li>
              <li class="info-item">
                <span class="item-label">开户行：</span>
                <span class="item-content ellipsis">
                  {{ logItem.bankName || "--" }}
                </span>
              </li>
              <li class="info-item">
                <span class="item-label">备注：</span>
                <span class="item-content ellipsis">
                  {{ logItem.remark || "--" }}
                </span>
              </li>
              <div>
                <!-- <div class="export_step_box">
                            <img src="../../assets/images/export.png" alt="">
                            《QADN-数据导入-模板》
                            <a :href ='apiVar.qadnUrl + "/importTemplate/手动录入推荐理由.xlsx"'
                            download="数据导入模板.xlsx" class="downloag_btn" @click="dowmLoadFun">点击下载<i class="el-icon-download"></i></a>
                        </div> -->
              </div>
            </el-timeline-item>
          </el-timeline>
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
      custom-class="custom-dialog-wrapper custom-confirm-dialog"
    >
      <div class="content-form">
        <el-input
          type="textarea"
          placeholder="请填写不通过的理由，限制50个字"
          v-model="disagreeTxt"
          resize="none"
          :autosize="{ minRows: 2 }"
          maxlength="50"
          show-word-limit
        ></el-input>
      </div>

      <template slot="footer">
        <el-button @click="reasonVisible = false">取 消</el-button>
        <el-button type="primary" @click="changePayState">确 定</el-button>
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
          </el-select>
        </el-form-item>
        <el-form-item
          class="special-padding"
          label="付款金额："
          prop="actualPayTotal"
          :label-width="formLabelWidth"
        >
          <el-input
            placeholder="请输入付款金额"
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
            v-model="payApplyForm.remark"
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
            :on-error="uploadError"
            :auto-upload="false"
            :multiple="false"
          >
            <el-button
              slot="trigger"
              size="small"
              icon="el-icon-upload2"
              style="padding: 0 15px"
              >上传文件</el-button
            >
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetPayApply(()=>{$emit('update:payApplyVisible', false)})">取 消</el-button>
          <el-button type="primary" @click="createPayRecord">确 定</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../../api/api";
// 时间格式化
import sessFun from "../../../commonFun/sessFun.js";
import dialogTable from "../../../components/common/components/dialogTable.vue";
export default {
  name: "paylog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false,
    },
    payApplyVisible: {
      type: Boolean,
      default: () => false,
    },
    showMatchResult: {
      type: Boolean,
      default: () => false,
    },
    apID: {
      type: [String, Number],
    },
    rejectAdPlan: {
      type: Array,
      default: () => [],
    },
    ADLimit: {
      type: Array,
      default: () => [],
    },
    customPermission: {
      type: Object,
      default: () => {},
    },
    // 销售配点次数
    matchCnt: {
      type: Number,
      default: () => 10,
    },
  },
  components: {
    dialogTable,
  },
  data() {
    return {
      payLogArr: [],
      disagreeTxt: "",
      reasonVisible: false,
      formLabelWidth: "85px",
      payApplyForm: {
        payType: 1,
        finshYear: 0,
        planPayTotal: 0,
        actualPayTotal: 0,
        bankAccount: "",
        bankName: "",
        remark: "",
      },
      payApplyFormRules: {
        payType: [{ required: true, trigger: "blur" }],
        actualPayTotal: [
          { required: true, message: "付款金额不能为空", trigger: "blur" },
          { type: "number", message: "必须为数字值", trigger: "blur" },
        ],
      },
      payApplyFileList: [],
      sessionData: null,
      matched: false,
      trafficAndmType: {
        excludeTrafficStateList: [],
        excludeMTypeList: [],
      },
      loading: false,
      showDialogTable: false,
      showFailDialogTable: false,
      showAsignPointTableData: false,
      intentionInfo: {
        customerBudget: 0,
        customerDemand: "",
        pdEndDate: "",
        pdStartDate: "",
        planAdSpaceCount: 0,
        planResCount: 0,
      },
      formDataObj: {
        matchRange: "1",
        pointDemand: [],
        aFaceRate: 50,
        aFaceRateChecked: false,
        apExclude: "",
        adLimits: [],
        excludeTrafficStateList: [],
        excludeMTypeList: [],
      },
      tipObj: {
        selectLab1: 0,
        selectLab2: 0,
        selectLab3: 0,
      },
      intentionTableData: [],
      intentionTableColumn: [
        {
          label: "资源",
          prop: "resName",
          minWidth: "100px",
          tip: true,
        },
        {
          label: "城市",
          prop: "city",
          minWidth: "100px",
          tip: true,
        },
        {
          label: "区域",
          prop: "region",
          minWidth: "100px",
          tip: true,
        },

        {
          label: "媒体数量(门)",
          prop: "resMediaCount",
          width: "120px",
          align: "right",
        },
        {
          label: "计划投放数量(面)",
          prop: "planPdNum",
          width: "160px",
          align: "right",
        },
      ],
      failTableData: [],
      failTableColumn: [
        {
          label: "资源",
          prop: "resName",
          minWidth: "100px",
          tip: true,
        },
        {
          label: "城市",
          prop: "city",
          minWidth: "100px",
          tip: true,
        },
        {
          label: "区域",
          prop: "region",
          minWidth: "100px",
          tip: true,
        },
        {
          label: "排期",
          prop: "period",
          minWidth: "160px",
          value: (row) => `${row.pdStartDate}~${row.pdEndDate}`,
          tip: true,
        },
        {
          label: "总媒体数(门)",
          prop: "resMediaCount",
          width: "120px",
          align: "right",
        },
        {
          label: "计划投放点位(面)",
          prop: "planPdNum",
          width: "160px",
          align: "right",
        },
        {
          label: "已配点位(面)",
          prop: "actualPdNum",
          width: "160px",
          align: "right",
        },
        {
          label: "失败原因",
          prop: "failReasonDesc",
          width: "160px",
        },
      ],
      asignPointTableLoading: false,
      asignPointTableData: [],
      asignPointTableColumn: [
        {
          label: "资源",
          prop: "resName",
          minWidth: "160px",
          tip: true,
        },
        {
          label: "城市",
          prop: "city",
          minWidth: "100px",
          tip: true,
        },
        {
          label: "区域",
          prop: "region",
          minWidth: "100px",
          tip: true,
        },
        {
          label: "排期",
          prop: "schedules",
          minWidth: "180px",
          tip: true,
        },
        {
          label: "已配/计划",
          prop: "mediaNum",
          width: "100px",
          value: (row) => `${row.actualPdNum}/${row.planPdNum}`,
          align: "right",
        },
        {
          label: "媒体名称",
          prop: "mTitle",
          width: "100px",
        },
        {
          label: "投放面",
          prop: "asLab",
          width: "80px",
          value: (row) => `${row.asLab}面`,
        },
      ],
    };
  },
  watch: {
    dialogVisible(val) {
      val && this.getPayRecordList();
    },
    showMatchResult(val) {
      val && (this.matched = true) && this.getSuccessPoint();
    },
  },
  created() {
    this.sessionData = sessFun.getSess();
  },
  mounted() {
    this.getPayRecordList();
  },
  methods: {
    //
    fileChange(file, fileList) {
      this.payApplyFileList = fileList;
      console.log("fileChange--", file);
    },
    //
    fileProgress(event, file, fileList) {
      console.log("event--=-", event, fileList);
    },
    uploadSuccess(response, file, fileList) {
      console.log("response", response, file);
      if (response.SysCode == 200200) {
        // 继续创建
        file.fileUrl = response.data.fileUrl || "";
        file.id = response.data.id || "";
      } else {
        this.$message.warning(response.MSG);
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
    // 提交付款申请
    createPayRecord() {
      if (!this.payApplyFileList.every((item) => item.id && item.fileUrl)) {
        // 还有文件未上传
        console.log("payApplyFileList", this.payApplyFileList);
        this.$refs.fileUpload.submit();
      } else {
        this.$refs.payApplyForm.validate((valid) => {
          if (valid) {
            console.log("success---", this.payApplyForm);
            api
              .postApi("/addsp/devContract/createPayRecord", {
                ...this.payApplyForm,
                dcID: "",
                fileIDs: this.payApplyFileList.map((item) => item.id).join(","),
              })
              .then((res) => {
                if (res.data.SysCode == 200200) {
                } else {
                  this.$message.warning(res.data.MSG || "");
                  this.$emit('update:payApplyVisible', false);
                }
              });
          } else {
            console.warn("valid---");
            return false;
          }
        });
      }
    },
    // 付款申请不通过确认框
    disagreeFun() {
      this.reasonVisible = true;
    },
    // 付款申请不通过
    changePayState() {
      console.log("不通过理由", this.disagreeTxt);
      if (this.disagreeTxt !== 0)
        api
          .postApi("/addsp/devContract/changePayState", {
            dcpID: "",
            passState: 0,
            failReason: "",
          })
          .then((res) => {
            if (res.data.SysCode == 200200) {
            } else {
              this.$message.warning(res.data.MSG || "审核失败！");
            }
          });
    },
    // 获取付款记录
    getPayRecordList() {
      return new Promise((resolve) => {
        api
          .getApi("/addsp/devContract/payRecordList?dcID=")
          .then((res) => {
            if (res.data.SysCode == 200200) {
            } else {
              this.$message.warning(res.data.MSG);
            }
          })
          .finally(() => {
            this.payLogArr = [
              {
                actualPayTotal: 0,
                bankAccount: "string",
                bankName: "string",
                createTime: "2021-06-24 10:30:53",
                createUser: 0,
                dcID: 0,
                fileIDs: "string",
                fileList: [
                  {
                    createTime: "2021-06-24T10:30:53.613Z",
                    dcID: 0,
                    dcpID: 0,
                    fileUrl: "string",
                    id: 0,
                    type: 0,
                    uID: 0,
                  },
                ],
                finishDate: "string",
                id: 0,
                payState: 0,
                //payType: 1-场地费 2-开发费
                payType: 1,
                planPayTotal: 0,
                remark: "string",
                updateTime: "2021-06-24 10:30:53",
              },
            ];
            this.payLogArr = this.payLogArr.concat(this.payLogArr);
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
    // 获取该用户下的配点次数
    getMatchCnt() {
      this.loading = true;
      return new Promise((resolve) => {
        api
          .getApi("/addsp/match/getMatchCnt?apID=" + this.apID)
          .then((res) => {
            if (res.data.SysCode == 200200) {
              // this.matchCnt = res.data.data||10
              this.$emit("update:matchCnt", res.data.data || 10);
              this.loading = false;
              resolve(true);
            } else {
              sessFun.messageFun("warning", res.data.MSG);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    // 重新配点
    rematchPoint() {
      this.$confirm(
        this.sessionData.uType == "BD"
          ? "本次配点结果质量高，重新配点可能会错失最优点位配置，确定放弃本次配点结果吗？"
          : "重新配点会清除原配点结果信息",
        "是否重新配点？",
        {
          confirmButtonText: "确 定",
          dangerouslyUseHTMLString: true,
          type: "warning",
          iconClass: "el-icon-question",
          showCancelButton: true,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          showClose: false,
          customClass: "messageBoxCustom messageBoxCustomWarning",
        }
      )
        .then((_) => {
          this.matched = false;
          this.showAsignPointTableData = false;
          this.$emit("openAddPoint");
        })
        .catch(() => {
          sessFun.messageFun("info", "已取消");
        });
    },
    // 配点结果添加到购物车
    merge2ShopList() {
      this.$emit("merge2ShopList", this.asignPointTableData);
      this.showAsignPointTableData = false;
      this.$emit("closeAddPoint");
    },
    // 销售保存配点结果到方案中
    BDSaveMatchToPlan() {
      this.$confirm(
        "即将以本次配点结果覆盖方案中现有的点位，原保存的点位将被移除！",
        "是否保存配点？",
        {
          confirmButtonText: "确 定",
          dangerouslyUseHTMLString: true,
          type: "warning",
          iconClass: "el-icon-question",
          showCancelButton: true,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          showClose: false,
          customClass: "messageBoxCustom messageBoxCustomWarning",
        }
      )
        .then((_) => {
          this.$emit("merge2ShopList", this.asignPointTableData);
          this.showAsignPointTableData = false;
          this.$emit("closeAddPoint");
        })
        .catch(() => {
          sessFun.messageFun("info", "已取消保存");
        });
    },
    // 获取意向信息
    getIntentionInfo() {
      this.loading = true;
      return new Promise((resolve) => {
        api
          .getApi("/addsp/proposal/getSummarize?apID=" + this.apID)
          .then((res) => {
            if (res.data.SysCode == 200200) {
              resolve(true);
              this.loading = false;
              Object.assign(this.intentionInfo, res.data.data);
            } else {
              resolve(false);
              sessFun.messageFun("warning", res.data.MSG);
            }
          })
          .catch((err) => {
            resolve(false);
            console.log(err);
          });
      });
    },
    // 意向小区列表
    getIntentionList() {
      api
        .getApi("/addsp/proposal/getProposalResInfo?apID=" + this.apID)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.showDialogTable = true;
            this.intentionTableData = res.data.data;
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 配点
    matchRes() {
      let params = {};
      if (this.formDataObj.aFaceRateChecked && this.sessionData.uType == "MD") {
        params.aFaceRate = this.formDataObj.aFaceRate || 0;
      } else if (this.sessionData.uType == "BD") {
        params.aFaceRate = this.formDataObj.aFaceRate || 50;
      }
      this.formDataObj.pointDemand.forEach((item) => {
        params[item] = true;
      });
      console.log("formDataObj", this.formDataObj, params);
      new Promise((resolve, reject) => {
        api
          .postApi_json("/addsp/match/matchRes", {
            ...params,
            apID: this.apID,
            isSingleMediaChoose: params.isSingleMediaChoose || false,
            apExclude: this.formDataObj.apExclude,
            adLimits: this.formDataObj.adLimits,
            isSingleConnectChoose: params.isSingleConnectChoose || false,
            isSpaceTimeLongFirst: params.isSpaceTimeLongFirst || false,
            allMatch: this.formDataObj.matchRange * 1,
            excludeMTypeList: this.formDataObj.excludeMTypeList,
            excludeTrafficStateList: this.formDataObj.excludeTrafficStateList,
          })
          .then((res) => {
            if (res.data.SysCode == 200200) {
              resolve(res.data.data);
              // 获取销售已配点次数
              this.sessionData.uType == "BD" && this.getMatchCnt();
            } else {
              sessFun.messageFun("warning", res.data.MSG);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }).then((matchRes) => {
        this.reasonVisible = false;
        if (matchRes) {
          this.$confirm(
            `计划投放<span style='color: #1890ff; font-weight: 600;'> ${
              matchRes.planAdSpaceCount
            } </span>个点位，成功<span style='color: #1890ff; font-weight: 600;'> ${
              matchRes.faceCount
            } </span>个，失败<span style='color: rgba(250, 173, 20, 1); font-weight: 600;'> ${
              matchRes.planAdSpaceCount - matchRes.faceCount
            } </span>个`,
            "恭喜您，配点成功！",
            {
              confirmButtonText: "查看详情",
              dangerouslyUseHTMLString: true,
              type: "success",
              showCancelButton: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              showClose: false,
              customClass: "messageBoxCustom",
            }
          ).then(() => {
            this.getSuccessPoint(matchRes);
          });
        } else if (matchRes === null) {
          this.$confirm(`所选配点条件匹配不到任何点位`, "配点失败！", {
            confirmButtonText: "关闭",
            dangerouslyUseHTMLString: true,
            type: "warning",
            iconClass: "el-icon-question",
            showCancelButton: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            showClose: false,
            customClass: "messageBoxCustom messageBoxCustomWarning",
          }).then(() => {
            // this.dialogMatchRangeFormVisible = false
          });
        }
      });
    },
    // 查询配点结果概要
    getMatchSummary(apID) {
      return new Promise((resolve) => {
        api
          .getApi("/addsp/match/matchSummary?apID=" + apID)
          .then((res) => {
            if (res.data.SysCode == 200200) {
              Object.assign(this.tipObj, res.data.data);
              if (Array.isArray(this.tipObj.proposalCountGroup)) {
                this.tipObj.proposalCountGroup.forEach((item) => {
                  if (item.resPdNum == 1) {
                    this.tipObj.selectLab1 = item.resCount || 0;
                  } else if (item.resPdNum == 2) {
                    this.tipObj.selectLab2 = item.resCount || 0;
                  } else if (item.resPdNum == 3) {
                    this.tipObj.selectLab3 = item.resCount || 0;
                  }
                });
              }
              resolve(true);
            } else {
              sessFun.messageFun("warning", res.data.MSG);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    // 查询配点成功结果
    async getSuccessPoint(matchRes) {
      if (matchRes) {
        // 弹框中选择配点
        Object.assign(this.tipObj, matchRes);
        if (Array.isArray(this.tipObj.proposalCountGroup)) {
          this.tipObj.proposalCountGroup.forEach((item) => {
            if (item.resPdNum == 1) {
              this.tipObj.selectLab1 = item.resCount || 0;
            } else if (item.resPdNum == 2) {
              this.tipObj.selectLab2 = item.resCount || 0;
            } else if (item.resPdNum == 3) {
              this.tipObj.selectLab3 = item.resCount || 0;
            }
          });
        }
      } else {
        // 查看已配点方案的配点详情
        // this.intentionInfo.resPdNumGroup = this.tipObj.proposalCountGroup||[]
        // this.intentionInfo.planResCount = this.tipObj.planResCount||0
      }
      this.showAsignPointTableData = true;
      this.asignPointTableLoading = true;
      api
        .getApi("/addsp/match/successProposal?apID=" + this.apID)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.asignPointTableData = res.data.data || [];
            let getAdPrice = (data) => {
              if (!data.asPrice) return 0;
              if (data.mVehicle === "道闸") {
                return data.asPrice / 100;
              } else {
                if (data.asPrice) {
                  return data.asPrice / 700;
                } else {
                  if (data.grade === "A") {
                    return 3080 / 7;
                  } else if (data.grade === "B") {
                    return 2380 / 7;
                  } else if (data.grade === "C") {
                    return 1800 / 7;
                  } else {
                    return 1900 / 7;
                  }
                }
              }
            };
            for (let i = 0; i < this.asignPointTableData.length; i++) {
              let item = this.asignPointTableData[i];
              item.asIDs = item.asID;
              item.asLabs = item.asLab;
              item.buildPrice = item.hPrice / 100;
              item.buildType = item.cType;
              item.origin = item.region;
              item.mediaName = item.mTitle;
              item.mediaLevel = item.grade || "";
              item.adLimit = item.notPush;
              item.mapCenter = item.mapCenter || "--"; // 地图中心点名称
              item.reference = "";
              item.rid = item.cityCode;
              item.address = item.address || "";
              item.dNum = item.dNum || ""; // 出入口数
              item.houseNum = item.hNum;
              item.buildNum = item.fNum;
              item.liveYear = item.chDay;
              item.A_B = item.asLab;
              item.checkBox = {
                A: item.asLab == "A" ? true : false,
                B: item.asLab == "B" ? true : false,
                ABC: item.asLab == "ABC" ? true : false,
              };
              item.box = { A: false, B: false };
              item.connData = {
                connectResName: "",
                connectMedia: "",
                commentWorkRes: "",
                commentworkMedia: "",
              };
              item.connID = item.connID || ""; // 连排门id
              item.industryInfos = item.industryInfos || []; // 同行业资源回避
              item.adPrice = getAdPrice(item); // 点位价格
              item.mediaLevel = item.mediaLevel; // 媒体等级
              item.asrID = item.asrID; // 所属公司id
              item.asName = item.asName; // 所属公司名称
              item.remark = item.remark;
              item.trafficState = item.trafficState || "";
              item.electrifyState = item.electrifyState || "";
            }
            this.asignPointTableLoading = false;
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 查询配点失败结果
    getFailRes() {
      api
        .getApi("/addsp/match/failProposal?apID=" + this.apID)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.failTableData = res.data.data || [];
            this.showFailDialogTable = true;
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 下载配点结果（成功和失败）
    downLoadMatchResult() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      api.getApi_file("/addsp/match/export?apID=" + this.apID).then((res) => {
        let blob = new Blob([res.data], {
          type: "application/vnd.ms-excel;charset=utf-8",
        });
        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = decodeURIComponent(
          res.headers["content-disposition"]
        ).split("=")[1]; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
        loading.close();
      });
    },
    // 下载意向小区
    export2Excel() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      require.ensure([], () => {
        const {
          export_json_to_excel,
        } = require("../../../vendorExcel/Export2Excel");
        const tHeader = [
          "资源",
          "城市",
          "区域",
          "排期",
          "媒体数量（门）",
          "计划投放数量（面）",
        ];
        const filterVal = [
          "resName",
          "city",
          "region",
          "period",
          "resMediaCount",
          "planPdNum",
        ];
        const data = this.formatJson(filterVal, this.intentionTableData);
        export_json_to_excel(tHeader, data, "意向小区");
        loading.close();
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) =>
          j == "period" ? `${v.pdStartDate}-${v.pdEndDate}` : v[j]
        )
      );
    },
    handleClose(done) {
      this.$emit("update:dialogVisible", false);
    },
    closeAsignPointTable() {
      if (this.matched) {
        this.showAsignPointTableData = false;
        this.handleClose();
        return;
      }
      this.$confirm("关闭后，所配点位将被清除", "是否取消配点？", {
        confirmButtonText: "确 定",
        dangerouslyUseHTMLString: true,
        type: "warning",
        iconClass: "el-icon-question",
        showCancelButton: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: false,
        customClass: "messageBoxCustom messageBoxCustomWarning",
      })
        .then((_) => {
          this.showAsignPointTableData = false;
          this.handleClose();
        })
        .catch(() => {
          sessFun.messageFun("info", "已取消");
        });
    },
    deleteAsignItem(scope, currentPage, currentPageSize) {
      this.asignPointTableLoading = true;
      api
        .getApi("/addsp/match/removeSpace?id=" + scope.row.id)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.getMatchSummary(this.apID);
            this.asignPointTableData.splice(
              (currentPage - 1) * currentPageSize + scope.$index * 1,
              1
            );
            this.asignPointTableLoading = false;
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss">
.el-dropdown-link {
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
@import "../../../assets/component.scss";
/deep/ .custom-confirm-dialog {
  border-radius: 4px;
  .el-dialog__header {
    padding-bottom: 6px;
    border: none !important;
    .el-dialog__title {
      font-size: 16px;
      color: rgba($color: #000, $alpha: 0.85);
    }
  }
  .el-dialog__body {
    border: none !important;
    .content-form {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 24px;
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
      width: 40px;
      margin-left: 8px;
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
  .el-dialog__footer {
    .el-button + .el-button {
      margin-left: 10px;
    }
  }
  .board {
    padding: 16px 0;
    & + .board {
      border-top: 1px solid rgba(233, 233, 233, 1);
    }
  }
  .board1 .info-item {
    display: flex;
    margin-top: 4px;
    color: rgba(0, 0, 0, 0.85);
    .active {
      color: rgba(24, 144, 255, 1);
      cursor: pointer;
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
    }
    .el-form-item__content {
      line-height: unset;
      .el-input__inner {
        color: rgba(0, 0, 0, 0.65);
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
    border-bottom: unset;
    .el-dialog__title {
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
    }
  }
  .el-dialog__body {
    padding: 0 24px;
    border-bottom: unset;
  }
  .el-dialog__footer {
    padding: 8px 24px 24px;
    .dialog-footer__button {
      word-spacing: -1em;
      .el-button + .el-button {
        margin-left: 16px;
      }
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
.merge-btn {
  padding: 0 10px;
}
.cell-ellipsis {
  min-width: 30px;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
