<!--
 * @Author: penglei
 * @Date: 2021-06-11 17:32:36
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-09 17:48:17
 * @FilePath: /frontend/src/components/develop/components/contractInput.vue
-->
<template>
  <div>
    <div class="ad_mediaDetail_wrap clearfix">
      <div>
        <div class="content_top_wrap">
          <div class="content_top_form_wrap">
            <el-form
              :model="contractForm"
              status-icon
              :rules="recRules"
              ref="contractForm"
              label-width="100px"
              class="demo-ruleForm resFrom"
            >
              <el-form-item
                label="基本信息"
                class="baseInfo firstInfo"
              ></el-form-item>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="资源名称">
                    <el-input v-model="resFormData.resName" disabled>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="物业公司" :required="handleType==1">
                    <el-input
                      v-model="resFormData.pmcName"
                      placeholder="物业公司单位名称"
                      :disabled="handleType > 1"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="联系人" prop="contactsName">
                    <el-input
                      v-model="contractForm.contactsName"
                      placeholder="请输入联系人姓名"
                      :clearable="true"
                      @blur="blurFun('contactsName')"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="el_col_box">
                  <el-form-item label="联系人手机号" prop="contactsPhone">
                    <el-input
                      v-model="contractForm.contactsPhone"
                      placeholder="请输入联系人手机号"
                      @blur="blurFun('contactsPhone')"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="76" class="from_row">
                <el-col v-if="handleType > 0" :span="6">
                  <el-form-item label="合同类型">
                    <el-input v-model="contractTypeArr[handleType]" disabled>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="合同开始日期" prop="startDate">
                    <el-date-picker
                      v-model="contractForm.startDate"
                      type="date"
                      value-format="yyyy-MM-dd"
                      :editable="false"
                      placeholder="请选择合同开始日期"
                      @blur="blurFun('startDate')"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="合同结束日期" prop="endDate">
                    <el-date-picker
                      v-model="contractForm.endDate"
                      type="date"
                      value-format="yyyy-MM-dd"
                      :editable="false"
                      placeholder="请选择合同结束日期"
                      :picker-options="{
                        disabledDate(time) {
                          if (contractForm.startDate) {
                            return (
                              time.getTime() <=
                              new Date(contractForm.startDate).getTime()
                            );
                          } else {
                            return false;
                          }
                        },
                      }"
                      @blur="blurFun('endDate')"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <!-- <el-col v-if="handleType == 0 || handleType == 2" :span="6">
                  <el-form-item label="合同媒体数量" prop="mediaNewCnt">
                    <el-input-number
                      v-model="contractForm.mediaNewCnt"
                      controls-position="right"
                      placeholder="请输入合同媒体数量"
                      @blur="blurFun('mediaNewCnt')"
                      :min="1"
                      :max="999"
                      :precision="0"
                    ></el-input-number>
                  </el-form-item>
                </el-col> -->
                <!-- <template v-else> -->
                <el-col :span="6">
                  <el-form-item label="新增媒体数量" prop="mediaNewCnt">
                    <el-input-number
                      v-model="contractForm.mediaNewCnt"
                      controls-position="right"
                      placeholder="请输入合同媒体数量"
                      @blur="blurFun('mediaNewCnt')"
                      :min="0"
                      :max="999"
                      :precision="0"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col v-if="handleType == 1 || handleType == 3" :span="6">
                  <el-form-item label="拆除媒体" prop="demolishMediaIDs">
                    <el-select
                      size="small"
                      placeholder="请选择要拆除媒体"
                      multiple=""
                      v-model="contractForm.demolishMediaIDs"
                      @blur="blurFun('demolishMediaIDs')"
                    >
                      <el-option
                        v-for="item in demolishMediaList"
                        :key="item.mID"
                        :label="item.mTitle"
                        :value="item.mID"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- </template> -->
                <el-col :span="6">
                  <el-form-item label="到期门体归属权" prop="ownership">
                    <el-select
                      placeholder="请选择到期门体归属权"
                      v-model="contractForm.ownership"
                      @blur="blurFun('ownership')"
                    >
                      <el-option label="我方" value="我方"></el-option>
                      <el-option label="物业方" value="物业方"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="合同备注" prop="remark">
                    <el-input
                      v-model="contractForm.remark"
                      placeholder="请输入合同特别条款说明"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="赠送信息" class="baseInfo"></el-form-item>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="赠送车场道闸" prop="freeCarGateCnt">
                    <el-input-number
                      v-model="contractForm.freeCarGateCnt"
                      controls-position="right"
                      placeholder="请输入赠送道闸数量"
                      :min="0"
                      :max="999"
                      :precision="0"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="赠送护栏门" prop="freeGuardrailDoorCnt">
                    <el-input-number
                      v-model="contractForm.freeGuardrailDoorCnt"
                      controls-position="right"
                      placeholder="请输入赠送护栏门数量"
                      :min="0"
                      :max="999"
                      :precision="0"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    label="赠送门禁设备"
                    prop="freeAccessControlCnt"
                  >
                    <el-input-number
                      v-model="contractForm.freeAccessControlCnt"
                      controls-position="right"
                      placeholder="请输入赠送门禁设备数量"
                      :min="0"
                      :max="999"
                      :precision="0"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="赠送IC卡" prop="freeICCardCnt">
                    <el-input-number
                      v-model="contractForm.freeICCardCnt"
                      controls-position="right"
                      placeholder="请输入赠送IC卡数量"
                      :min="0"
                      :max="999"
                      :precision="0"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="赠送ID卡" prop="freeIDCardCnt">
                    <el-input-number
                      v-model="contractForm.freeIDCardCnt"
                      controls-position="right"
                      placeholder="请输入赠送ID卡数量"
                      :min="0"
                      :max="999"
                      :precision="0"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="赠送护栏" prop="freeGuardrailCnt">
                    <el-input-number
                      v-model="contractForm.freeGuardrailCnt"
                      controls-position="right"
                      placeholder="请输入赠送护栏数量"
                      :min="0"
                      :max="999"
                      :precision="0"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="赠送三辊闸" prop="freeTRGateCnt">
                    <el-input-number
                      v-model="contractForm.freeTRGateCnt"
                      controls-position="right"
                      placeholder="请输入赠送三辊闸数量"
                      :min="0"
                      :max="999"
                      :precision="0"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="赠送翼闸" prop="freeWingGateCnt">
                    <el-input-number
                      v-model="contractForm.freeWingGateCnt"
                      controls-position="right"
                      placeholder="请输入赠送翼闸数量"
                      :min="0"
                      :max="999"
                      :precision="0"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="费用信息" class="baseInfo"></el-form-item>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="是否有场地费" prop="isVenueFee">
                    <el-select
                      v-model="contractForm.isVenueFee"
                      placeholder="请选择是否有场地费"
                      @blur="blurFun('isVenueFee')"
                    >
                      <el-option label="是" :value="1"></el-option>
                      <el-option label="否" :value="0"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <template v-if="contractForm.isVenueFee">
                  <el-col :span="6">
                    <el-form-item label="场地费付款方式" prop="venuePayType">
                      <el-select
                        placeholder="请选择场地费付款方式"
                        v-model="contractForm.venuePayType"
                        @blur="blurFun('venuePayType')"
                      >
                        <el-option
                          v-for="item in venuePayTypeList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      :label="
                        contractForm.venuePayType == '固定费用付款'
                          ? '场地费(元/年)'
                          : '场地费(元/门/年)'
                      "
                      prop="venueFee"
                    >
                      <el-input
                        v-model="contractForm.venueFee"
                        placeholder="请输入场地费"
                        controls-position="right"
                        @blur="blurFun('venueFee')"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="场地费应付日期" prop="venueDate">
                      <el-date-picker
                        v-model="contractForm.venueDate"
                        type="date"
                        format="MM 月 dd 日"
                        value-format="MM-dd"
                        :editable="false"
                        placeholder="请选择场地费应付日期"
                        @blur="blurFun('venueDate')"
                      >
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </template>
              </el-row>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="是否有开发费" prop="isDevFee">
                    <el-select
                      v-model="contractForm.isDevFee"
                      placeholder="请选择是否有开发费"
                      @change="isDevFeeChange"
                      @blur="blurFun('isDevFee')"
                    >
                      <el-option label="是" :value="1"></el-option>
                      <el-option label="否" :value="0"></el-option
                    ></el-select>
                  </el-form-item>
                </el-col>
                <template v-if="contractForm.isDevFee">
                  <el-col :span="6">
                    <el-form-item label="开发费付款方式" prop="devPayType">
                      <el-select
                        placeholder="请选择开发费付款方式"
                        v-model="contractForm.devPayType"
                        @blur="blurFun('devPayType')"
                        @change="devPayTypeChange"
                      >
                        <el-option
                          v-for="item in devPayTypeList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      :label="
                        contractForm.devPayType == '按年支付固定费用'
                          ? '开发费(元/年)'
                          : '开发费(元)'
                      "
                      prop="devFee"
                    >
                      <el-input
                        v-model="contractForm.devFee"
                        placeholder="请输入开发费"
                        @blur="blurFun('devFee')"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col
                    v-if="contractForm.devPayType == '按年支付固定费用'"
                    :span="6"
                  >
                    <el-form-item label="开发费应付日期" prop="devDate">
                      <el-date-picker
                        v-model="contractForm.devDate"
                        type="date"
                        format="MM 月 dd 日"
                        value-format="MM-dd"
                        :editable="false"
                        placeholder="请选择开发费应付日期"
                        @blur="blurFun('devDate')"
                      >
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </template>
              </el-row>
              <el-form-item label="附件" class="baseInfo"></el-form-item>
              <el-row :gutter="76" class="from_row">
                <el-col :span="8">
                  <el-upload
                    class=""
                    ref="fileUpload"
                    :action="
                      this.apiVar.qadnUrl + '/addsp/devContract/uploadFile'
                    "
                    :headers="{
                      uid: sessionData.uID,
                      token: sessionData.token,
                    }"
                    :data="{
                      type: 1,
                    }"
                    :file-list="fileList"
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
                      style="padding: 0 15px"
                      >上传文件</el-button
                    >
                  </el-upload>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../../api/api";
import sessFun from "../../../commonFun/sessFun.js";
export default {
  name: "resInput",
  props: {
    resFormData: {
      type: Object,
      default: {
        resID: "",
        resName: "",
        pmcName: "",
      },
    },
    handleType: {
      type: [Number, String],
      default: () => 0,
    },
    dcID: {
      type: [Number, String],
      default: () => "",
    },
    originID: {
      type: [Number, String],
      default: () => "",
    },
    startDate: {
      type: String,
      default: () => "",
    },
  },
  data() {
    let validateSpace = (rule, value, callback) => {
      this.isResError = false;
      if (value) {
        if (value.match(/^\s+$/)) {
          callback(new Error("所填内容不能为空格!"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let validatePrice = (rule, value, callback) => {
      let reg = /^\d+(\.\d+)?$/;
      if (value !== "" && !reg.test(value)) {
        callback(new Error("只能输入数字!"));
      } else {
        if (value > 9999999) {
          callback(new Error("不得大于9999999!"));
        } else {
          callback();
        }
      }
    };
    // 判断是否包含有特殊字符 // “/”
    let validateSpecialString = (rule, value, callback) => {
      let reg = /[\/]/;
      if (reg.test(value)) {
        callback(new Error("不可填写特殊符号!"));
      } else {
        callback();
      }
    };
    return {
      contractTypeArr: {
        0: "首签合同",
        1: "续签合同",
        2: "加门合同",
        3: "补充协议",
      },
      devPayTypeList: [
        { label: "按年支付固定费用", value: "按年支付固定费用" },
        { label: "一次性支付固定费用", value: "一次性支付固定费用" },
      ],
      venuePayTypeList: [
        { label: "固定费用付款", value: "固定费用付款" },
        { label: "按装门数付款", value: "按装门数付款" },
      ],
      additional: {},
      //资源表单
      contractForm: {
        id: "", // 合同id
        contactsName: "", // 联系人
        contactsPhone: "", // 联系人手机号
        startDate: "", // 合同开始日期
        endDate: "", // 合同结束日期
        ownership: "", // 到期门体归属权
        remark: "", // 合同备注
        mediaNewCnt: "", // 合同媒体数量（首签和加门都是新增）
        demolishMediaIDs: [], // 合同拆除媒体

        freeCarGateCnt: "", // 赠送车场道闸
        freeGuardrailDoorCnt: "", // 赠送护栏门
        freeGuardrailCnt: "", // 赠送的护栏个数
        freeTRGateCnt: "", // 赠送的三辊闸个数
        freeWingGateCnt: "", // 赠送翼闸

        freeAccessControlCnt: "", // 赠送门禁设备个数
        freeICCardCnt: "", // 赠送IC卡个数
        freeIDCardCnt: "", // 赠送ID卡个数

        isVenueFee: "", // 是否有场地费
        venuePayType: "", // 场地费付款方式
        venueFee: "", // 场地费
        venueDate: "", // 场地费应付日期
        isDevFee: "", // 是否有开发费
        devPayType: "", // 开发费付款方式
        devFee: "", // 开发费
        devDate: "", // 开发费应付日期
      },
      recRules: {
        contactsName: [
          {
            required: true,
            message: "请输入联系人名称!",
            trigger: ["blur"],
          },
        ],
        contactsPhone: [
          {
            required: true,
            message: "请输入联系人手机号!",
            trigger: ["blur"],
          },
        ],
        startDate: [
          {
            required: true,
            message: "请选择合同开始日期!",
            trigger: "blur",
          },
        ],
        endDate: [
          {
            required: true,
            message: "请选择合同结束日期!",
            trigger: "blur",
          },
          {
            validator: this.validEndDate,
            trigger: "blur",
          },
        ],
        ownership: [
          {
            required: true,
            message: "请选择到期门体归属权!",
            trigger: ["change", "blur"],
          },
        ],
        mediaNewCnt: [
          { required: true, message: "请输入合同媒体数量!", trigger: "blur" },
          { type: "number", message: "请输入数值!", trigger: "blur" },
        ],
        demolishMediaIDs: [
          {
            validator: this.checkDemolishMedia,
            trigger: ["change", "blur"],
          },
        ],
        isVenueFee: [
          { required: true, message: "请选择是否有场地费!", trigger: "change" },
        ],
        venuePayType: [
          {
            required: true,
            message: "请选择场地费付款方式!",
            trigger: ["blur", "change"],
          },
        ],
        venueFee: [
          {
            required: true,
            message: "请输入场地费!",
            trigger: ["blur", "change"],
          },
          {
            validator: validatePrice,
            trigger: ["change", "blur"],
          },
        ],
        venueDate: [
          {
            required: true,
            message: "请选择场地费应付日期!",
            trigger: "change",
          },
        ],
        isDevFee: [
          { required: true, message: "请选择是否有开发费!", trigger: "change" },
        ],
        devPayType: [
          {
            required: true,
            message: "请选择开发费付款方式!",
            trigger: "change",
          },
        ],
        devFee: [
          { required: true, message: "请输入开发费!", trigger: "blur" },
          {
            validator: validatePrice,
            trigger: ["change", "blur"],
          },
        ],
        devDate: [
          {
            required: true,
            message: "请选择开发费应付日期!",
            trigger: "change",
          },
        ],
      },

      fileList: [],
      PathHaveEdit: false, // 新建/编辑
      doUpload: this.apiVar.qadnUrl + "/advertisement/UpLoad",

      resData: { resID: "" }, // 创建资源成功，保存返回来的数据
      sessionData: sessFun.getSess(),
      submitBtnIsAble: false, // 防止多次点击
      demolishMediaList: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getContractDetail(this.dcID);
  },
  mounted: function () {
    if (this.handleType) {
      this.getDemolishMediaList();
    }
  },
  methods: {
    // 开发费重置
    isDevFeeChange() {
      this.contractForm.devPayType = "";
      this.contractForm.devFee = "";
      this.contractForm.devDate = "";
    },
    // 场地费重置
    isVenueFeeChange() {
      this.contractForm.venuePayType = "";
      this.contractForm.venueFee = "";
      this.contractForm.venueDate = "";
    },
    // devPayType
    devPayTypeChange() {
      this.contractForm.devDate = "";
    },
    // 校验结束日期
    validEndDate(rule, value, callback) {
      if (value) {
        if (
          this.contractForm.startDate &&
          this.contractForm.endDate &&
          this.contractForm.endDate < this.contractForm.startDate
        ) {
          callback(new Error("合同结束日期必须大于合同开始日期!"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 拆除媒体不能全选
    checkDemolishMedia(rule, value, callback) {
      if (value) {
        if (value.length == this.demolishMediaList.length) {
          callback(new Error("拆除媒体不能全选!"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 获取可删除媒体
    getDemolishMediaList() {
      api
        .getApi("/addsp/devContract/demolishMediaList", {
          originIDs: this.originID,
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.demolishMediaList = res.data.data || [];
          } else {
            this.$message.warning(res.data.MSG || "");
          }
        });
    },
    // 编辑时获取合同详情
    getContractDetail(dcID = "") {
      if (!dcID) return;
      api
        .getApi("/addsp/devContract/getContractDetail", {
          dcID: dcID.split(",")[0],
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            const tempResultObj = res.data.data || {};
            Object.assign(this.additional, {
              id: tempResultObj.id,
              // 补充协议保留原合同编号
              contractNo: tempResultObj.contractNo,
            });
            this.resFormData.resName = tempResultObj.resName || "";
            this.resFormData.resID = tempResultObj.resID || "";
            if (this.handleType >= 0) {
              this.resFormData.pmcName = tempResultObj.pmcName || "";
            }
            if (this.handleType == 2) {
              // 加门合同只保留部分信息
              this.contractForm.contactsName = tempResultObj.contactsName || "";
              this.contractForm.contactsPhone =
                tempResultObj.contactsPhone || "";
              return;
            }
            for (const key in this.contractForm) {
              let tempValue = tempResultObj[key];
              if (
                Object.hasOwnProperty.call(this.contractForm, key) &&
                tempValue !== null
              ) {
                if (
                  (key == "venueDate" || key == "devDate") &&
                  typeof tempValue == "number"
                ) {
                  // 日期（月 日）Number 转 String
                  tempValue = (
                    tempValue < 1000 ? "0" + tempValue : tempValue + ""
                  ).replace(/^(\d{2})/, "$1-");
                }
                if (
                  (key == "venueFee" || key == "devFee") &&
                  typeof tempValue == "number"
                ) {
                  // 金额 分 转 元
                  tempValue = Number(tempValue / 100).toFixed(2);
                }
                this.contractForm[key] = tempValue;
              }
            }
            if (this.startDate) {
              // 合同续签时合同开始日期
              this.contractForm.startDate = this.startDate;
              this.contractForm.endDate = "";
            }
            tempResultObj.fileList = tempResultObj.fileList || [];
            tempResultObj.fileList.forEach((item) => {
              item.name = item.fileUrl.split("/").pop();
            });
            this.fileList = tempResultObj.fileList;
          } else {
            this.$message.warning(res.data.MSG || "");
          }
        });
    },
    fileChange(file, fileList) {
      // 文件大小不能超过10M
      this.fileList = fileList;
      if (file.size <= 10 * 1024 * 1024) {
        this.fileList = fileList;
      } else {
        this.$message.warning("文件大小不能超过10M!");
        this.deleteErrorFile(file, fileList);
      }
      console.log("fileChange--", file, fileList);
    },
    fileProgress(event, file, fileList) {
      console.log("fileEvent--", event);
    },
    uploadSuccess(response, file, fileList) {
      console.log("response", response, file);
      if (response.SysCode == 200200) {
        file.fileUrl = response.data.fileUrl || "";
        file.id = response.data.id || "";
        // 提交合同
        if (this.fileList.every((item) => item.id)) {
          this.$emit(
            "submitContract",
            this.fileList.map((item) => item.id).join(",")
          );
        } else {
          console.warn("存在未上传合同");
        }
      } else {
        this.deleteErrorFile(file, fileList);
        this.$message.warning(response.MSG);
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
      this.$message.warning("附件上传失败！");
    },
    beforeRemove(file, fileList) {
      this.fileList = fileList;
    },
    // 手动上传文件
    async submitUpload() {
      // 续签时可以编辑物业名称
      if (this.handleType == 1) {
        await this.postEditMsg();
      }
      console.log("手动上传文件--");
      if (this.fileList.every((item) => item.id)) {
        this.$emit(
          "submitContract",
          this.fileList.map((item) => item.id).join(",")
        );
      } else {
        this.$refs.fileUpload.submit();
      }
    },
    // 资源输入框和下拉框失去光标
    blurFun(name) {
      console.log("name", name);
      // 手动触发校验
      this.$refs.contractForm.validateField(name, (valid) => {
        // console.log('错误提示信息',valid)
        if (!valid) {
          console.log("校验通过");
        } else {
          console.log("校验不通过");
        }
      });
    },
    // 修改资源
    postEditMsg() {
      if(!this.resFormData.pmcName) {
        this.$message.warning("请输入物业公司单位名称！");
        return;
      }
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        service: "SetResCT",
        data: {
          resid: this.resFormData.resID,
          pmc: this.resFormData.pmcName || "",
        },
      };
      return new Promise((resolve) => {
        let resLoading = this.$loading({
          lock: true,
          text: "资源修改中...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        api
          .postApi_new(this.apiVar.Media, params)
          .then((res) => {
            console.log("修改资源信息", res);
            if (res.data.SysCode == 200200) {
              resLoading.close();
              resolve(true);
            } else {
              this.$message.warning("资源保存失败！");
              resLoading.close();
              resolve(false);
            }
          })
          .catch((error) => {
            resLoading.close();
            resolve(false);
          });
      });
    },
    // 资源图片上传前验证格式和大小
    beforeUpload_res(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 4;

      if (!isJPG) {
        sessFun.messageFun("warning", "上传图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt2M) {
        sessFun.messageFun("warning", "上传图片大小不能超过 4MB!");
      }
      return isJPG && isLt2M;
    },
    // 资源图片上传成功
    handleDownSuccess(res) {
      console.log("上传资源图片", res);
      if (this.contractForm.fullViewUrl) {
        this.contractForm.fullViewUrl =
          this.contractForm.fullViewUrl + "," + res[0].pURL;
      } else {
        this.contractForm.fullViewUrl = res[0].pURL;
      }
    },
    // 删除原资源图片，进行重新选择
    handleRemoveR(file, fileList) {
      console.log("删除或修改了资源图片", file, fileList);
      if (this.contractForm.fullViewUrl && file.url) {
        let tempPicArr = this.contractForm.fullViewUrl.split(",");
        let resArr = tempPicArr.filter((item) => {
          if (file.response) {
            return file.response[0].pURL != item;
          } else {
            return file.url != item;
          }
        });
        this.contractForm.fullViewUrl = resArr.join(",");
      }
    },

    // 表单验证
    submitForm() {
      this.submitBtnIsAble = true;
      let timer = setTimeout(() => {
        this.submitBtnIsAble = false;
        clearTimeout(timer);
      }, 500);
      // 资源表单校验
      let validateResArr = [
        "contactsName",
        "contactsPhone",
        "startDate",
        "endDate",
        "ownership",
        "mediaNewCnt",
        "isVenueFee",
        "isDevFee",
      ];
      if (this.handleType == 1 || this.handleType == 3) {
        validateResArr.push("demolishMediaIDs");
      }
      if (this.contractForm.isVenueFee) {
        validateResArr.push(...["venuePayType", "venueFee", "venueDate"]);
      }
      if (this.contractForm.isDevFee) {
        let tempArr = ["devPayType", "devFee"];
        this.contractForm.devPayType == "按年支付固定费用" &&
          tempArr.push("devDate");
        validateResArr.push(...tempArr);
      }
      let validatesPro = []; //Promise.all要用到的参数, 存放每次请求的Promise对象
      for (let key of validateResArr) {
        let validate = new Promise((resolve, reject) => {
          this.$refs.contractForm.validateField(key, (valid) => {
            // valid为错误信息，不为空这表示错误
            if (!valid) {
              resolve(true);
            } else {
              reject(false);
            }
          });
        });
        validatesPro.push(validate);
      }
      return Promise.all(validatesPro)
        .then((res) => {
          // 验证全部通过
          return true;
        })
        .catch((err) => {
          console.log("验证失败", err);
          this.$message.warning("必填项信息不能为空或填写有误！");
          return false;
        });
    },
    //重置表单数据
    resetForm() {
      this.$refs["contractForm"].resetFields();
    },
    // 清除表单校验
    clearFromValidate() {
      console.log("清除表单校验------");
      let timer = setTimeout(() => {
        this.$refs["contractForm"].clearValidate();
        clearTimeout(timer);
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.content_top_wrap {
  background: #ffffff;
}
.content_top_wrap .content_top_form_wrap {
  padding: 0 0 16px;
}

/deep/ .el-form.demo-ruleForm {
  display: flex;
  flex-wrap: wrap;
}

.from_row {
  width: 100%;
  margin: 0 10px !important;
}

/deep/ .from_row .el-form-item {
  width: 100%;
}

/deep/ .el-cascader {
  width: 100%;
}

/deep/ .el-select {
  width: 100%;
}

/deep/ .el-input-number {
  padding-right: 0;
}

.el_col_box {
  position: relative;
}

/deep/ .el_col_box .el-autocomplete {
  width: calc(100% - 82px);
}
.the_same_error {
  position: absolute;
  bottom: 2px;
  left: 38px;
  font-size: 12px;
  color: rgb(245, 108, 108);
  font-family: "PingFangSC-Regular", "Microsoft YaHei";
}
.the_same_error > i {
  font-size: 12px;
  color: rgb(245, 108, 108);
}

.get_resName_btn {
  width: 66px;
  min-width: 66px;
}

/*经纬度*/
.form_item_box_son {
  width: 49%;
  margin-right: 1%;
  float: left;
}

.col_lng_lat {
  position: relative;
}

.lng_lat_map_btn {
  position: absolute;
  left: 100px;
  top: 6px;
  color: rgba(24, 144, 255, 1);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.el-input {
  width: 100%;
  height: 34px;
}

/deep/ .el-input__inner,
.el-input-number {
  height: 32px;
  text-align: left;
  line-height: 35px;
  padding-right: 20px;
  text-align: left;
}
/deep/ .el-input-number {
  width: 100%;
  padding-right: 0;
}
/deep/ .el-input__suffix {
  right: 0;
}

/*计数器*/
/deep/ .el-input-number__decrease,
/deep/ .el-input-number__increase {
  background-color: transparent !important;
}

/deep/ .el-icon-arrow-down {
  position: relative;
  top: 1px;
}

/deep/ .el-input-number .el-input__suffix {
  right: 42px !important;
}

/deep/
  .el-input-number.is-controls-right
  .el-input-number__decrease
  [class*="el-icon"],
.el-input-number.is-controls-right
  .el-input-number__increase
  [class*="el-icon"] {
  position: relative;
  top: 2px;
}

/deep/ .el-form-item {
  margin-bottom: 16px;
}

/deep/ .form_item_box_son .el-form-item {
  margin-bottom: 0;
}

/deep/ .el-form-item.is-required .el-form-item__label:before {
  position: absolute;
  right: 0;
  bottom: 0;
  line-height: 20px;
}

/deep/ .el-form-item.floor_house_item.is-required .el-form-item__label:before {
  left: 73px;
}

/deep/ .el-form-item.lng_lat_form_item.is-required .el-form-item__label:before {
  left: 46px;
}

/deep/ .el-form-item.baseInfo.firstInfo {
  padding-top: 0;
  margin-top: 0;
  border: none;
}

/deep/ .el-form-item.baseInfo {
  width: calc(100% - 64px);
  margin: 18px 32px 10px;
  padding-left: 16px;
  background: rgba(245, 246, 250, 1);
}

/deep/ .el-form-item.baseInfo .el-form-item__label {
  font-size: 16px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  line-height: 42px;
  color: rgba(44, 49, 60, 1);
}

/deep/ .el-popper[x-placement^="bottom"] {
  margin-top: 3px !important;
}

/deep/ .el-popper[x-placement^="bottom"] {
  margin-top: 3px !important;
  top: 200px !important;
}

.el-form-item_unit {
  position: relative;
}

.el-form-item_unit span {
  position: absolute;
  left: 212px;
  color: #666666;
  top: 0;
}

/*上传图片*/
/deep/ .el-upload--picture-card {
  width: 110px;
  height: 110px;
  position: relative;
  top: 10px;
}

/deep/ .el-upload--picture-card i {
  position: relative;
  top: -15px;
}

/deep/ .el-upload-list--picture-card .el-upload-list__item {
  width: 110px;
  height: 110px;
  position: relative;
  top: 9px;
  left: 0;
}

.upload_img_wrap {
  width: 120px;
  height: 125px;
  overflow: hidden;
}
/*资源改版*/
/deep/ .el-scrollbar__wrap {
  display: none;
}
/deep/ .el-form-item__label {
  position: relative;
  float: none;
  line-height: 32px;
  color: rgba(0, 0, 0, 0.85);
}
/deep/ .el-form-item__content {
  margin-left: 0 !important;
}
/deep/ .el-tabs__item {
  width: 80px;
  font-size: 16px;
  text-align: center;
}
/deep/ .el-dialog {
  width: 670px;
}
/deep/ .el-dialog__header {
  text-align: center;
}
/deep/ .el-carousel__item {
  text-align: center;
}
/deep/ .map_dialog .el-dialog__header {
  text-align: left;
}
/deep/ .map_dialog .el-dialog__body {
  padding: 10px 20px;
}

/deep/ .el-textarea__inner {
  height: 78px !important;
  resize: none;
  position: relative;
  top: 3px;
}

/deep/ .el-textarea .el-textarea__inner::-webkit-scrollbar {
  width: 6px;
  background: #fafafa;
}

/deep/ .el-textarea .el-textarea__inner::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #c1c1c1;
  border-radius: 4px;
}

/deep/ .el-cascader {
  line-height: 40px;
}

/deep/ .el-tabs__nav {
  height: 52px;
  line-height: 52px;
}

/deep/ .el-input-number .el-input__inner {
  text-align: left !important;
}
</style>
