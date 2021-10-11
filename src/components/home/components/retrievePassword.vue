/**
 * 找回密码功能：校验账号——>滑块安全校验——>手机号校验——>设置密码
 */
<template>
  <el-dialog
    class="retrieve-dialog"
    :modal-append-to-body="false"
    :visible.sync="isVisible"
    :show-close="false"
    :before-close="beforeCloseFun"
    :width="['288px', '431px', '288px', '288px', '344px'][step - 1]"
  >
    <div v-if="step == 1" slot="title">输入账号</div>
    <div v-else-if="step == 2" slot="title">安全验证</div>
    <div v-else-if="step == 3" slot="title">输入验证码</div>
    <div v-else-if="step == 4" slot="title">输入新的密码</div>
    <div v-if="step == 5" class="step-success">
      <img src="../../../assets/images/createSuccess.png" alt="" />
      <span class="success-text1">密码重置成功</span>
      <span class="success-text2">恭喜你，密码重置成功，请记牢新的密码</span>
    </div>
    <el-form
      v-else
      label-position="top"
      hide-required-asterisk
      :validate-on-rule-change="false"
      :model="retrieveForm"
      ref="retrieveForm"
      :rules="retrieveRules"
    >
      <el-form-item
        v-if="step == 1"
        prop="account"
        :error="errorMsg"
        label="请输入要找回密码的账号"
      >
        <el-input
          size="small"
          v-model.trim="retrieveForm.account"
          autocomplete="off"
          placeholder="账号"
        ></el-input>
      </el-form-item>
      <div v-else-if="step == 2">
        <SlideVerify @validateSlide="step2"></SlideVerify>
      </div>
      <el-form-item
        v-else-if="step == 3"
        prop="verifyCode"
        :error="errorMsg"
        :label="`已向你的手机${String(accountInfo.phone).replace(
          /(\d{3})(\d{4})(\d{4})/,
          '$1****$3'
        )}发送验证码`"
      >
        <el-input
          size="small"
          v-model.trim="retrieveForm.verifyCode"
          autocomplete="off"
          placeholder="验证码"
        >
          <el-button
            type="text"
            size="small"
            slot="suffix"
            :disabled="sendFlag != '重新发送'"
            @click="sendVerificationCode"
            >{{ sendFlag }}</el-button
          >
        </el-input>
      </el-form-item>
      <el-form-item
        v-else-if="step == 4"
        prop="newPassword"
        :error="errorMsg"
        label="8~30位且必须包含数字、大小写字母"
      >
        <el-input
          size="small"
          show-password
          v-model.trim="retrieveForm.newPassword"
          autocomplete="off"
          placeholder="新的密码"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <template v-if="step == 1">
        <el-button size="small" @click="cancelRetrieve">取 消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="btnLoading"
          @click="step1"
          >下一步</el-button
        >
      </template>
      <template v-if="step == 2"></template>
      <template v-else-if="step == 3">
        <el-button size="small" @click="cancelRetrieve">取 消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="btnLoading"
          @click="step3"
          >下一步</el-button
        >
      </template>
      <template v-else-if="step == 4">
        <el-button size="small" @click="cancelRetrieve">取 消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="btnLoading"
          @click="step4"
          >确 定</el-button
        >
      </template>
      <template v-else-if="step == 5">
        <el-button
          class="success-btn"
          size="small"
          type="primary"
          @click="cancelRetrieve"
          >好 的</el-button
        >
      </template>
    </div>
  </el-dialog>
</template>

<script>
import api from "../../../api/api";
import SlideVerify from "./slideVerify.vue";
export default {
  name: "RetrievePassword",
  components: {
    SlideVerify,
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      btnLoading: false,
      accountInfo: null,
      step: 1,
      retrieveForm: {
        account: "",
        verifyCode: "",
        newPassword: "",
      },
      errorMsg: null,
      retrieveRules: {
        newPassword: [
          {
            required: true,
            pattern: /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])[^\u4e00-\u9fa5]{8,30}$/,
            message: "密码不符合要求，请重新输入",
            trigger: ["blur"],
          },
        ],
      },
      sendFlag: "获取验证码",
    };
  },
  methods: {
    initComponent() {
      this.$refs.retrieveForm && this.$refs.retrieveForm.resetFields();
      this.accountInfo = null;
      this.btnLoading = false;
      this.step = 1;
    },
    beforeCloseFun(done) {
      this.cancelRetrieve();
    },
    cancelRetrieve() {
      this.$emit("update:isVisible", false);
      this.initComponent();
    },
    // 校验账号规则
    validateAccount() {
      let timer = null;
      this.errorMsg = null;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        if (this.retrieveForm.account === "") {
          this.errorMsg = "请输入账号";
        } else {
          this.btnLoading = true;
          this.accountInfo = null;
          let params = {
            sName: this.retrieveForm.account,
          };
          api
            .getApi("/UCAPI/ForgetPwdValiate", params)
            .then((res) => {
              if (res.data.SysCode == 200200) {
                if (/^\d{11}$/.test(String(res.data.data))) {
                  this.accountInfo = {
                    ...params,
                    phone: res.data.data,
                  };
                  this.step = 2;
                } else {
                  this.errorMsg = "手机号获取失败！";
                }
              } else {
                this.errorMsg = res.data.MSG || "账号校验失败！";
              }
            })
            .finally(() => {
              this.btnLoading = false;
            });
        }
      }, 500);
    },
    // 手机号验证码校验规则
    validateVerifyCode() {
      let timer = null;
      this.errorMsg = null;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        if (this.retrieveForm.verifyCode === "") {
          this.errorMsg = "请输入手机验证码！";
        } else {
          this.btnLoading = true;
          api
            .postApi("/UCAPI/CheckVerificationCode", {
              sName: this.accountInfo.sName,
              phone: this.accountInfo.phone,
              type: 4,
              code: this.retrieveForm.verifyCode,
            })
            .then((res) => {
              if (res.data.SysCode == 200200) {
                const result = res.data.data;
                if (result && result.uID) {
                  this.accountInfo.uID = result.uID;
                  this.step = 4;
                } else {
                  this.errorMsg = "手机验证码校验失败！";
                }
              } else {
                this.errorMsg = res.data.MSG || "手机验证码校验失败！";
              }
            })
            .finally(() => {
              this.btnLoading = false;
            });
        }
      }, 500);
    },
    // 更新账号密码
    resetCustomPwd(errorMessage) {
      if (!errorMessage) {
        this.btnLoading = true;
        this.errorMsg = null;
        api
          .postApi("/UCAPI/ResetCustomPwd", {
            uID: this.accountInfo.uID,
            pwd: this.retrieveForm.newPassword,
          })
          .then((res) => {
            if (res.data.SysCode == 200200) {
              this.step = 5;
            } else {
              this.errorMsg = res.data.MSG || "密码设置失败！";
            }
          })
          .finally(() => {
            this.btnLoading = false;
          });
      }
    },
    // 校验账号
    step1() {
      this.validateAccount();
    },
    // 滑块校验
    step2() {
      this.step = 3;
      this.sendVerificationCode();
    },
    // 校验手机号验证码
    step3() {
      this.validateVerifyCode();
    },
    // 校验密码格式
    step4() {
      this.$refs.retrieveForm.validateField("newPassword", this.resetCustomPwd);
    },
    countDown(second) {
      let timer = null;
      if (typeof second == "number") {
        timer = setInterval(() => {
          if (second > 0) {
            this.sendFlag = `${second--}秒后重新发送`;
          } else {
            clearInterval(timer);
            this.sendFlag = "重新发送";
          }
        }, 1000);
      }
    },
    // 发送手机验证码
    sendVerificationCode() {
      this.sendFlag = "发送中...";
      this.errorMsg = null;
      api
        .postApi("/UCAPI/sendVerificationCode", {
          phone: this.accountInfo.phone,
          type: 4,
        })
        .then((res) => {
          if (res.data.SysCode === 200200) {
            this.countDown(60);
          } else {
            this.sendFlag = "重新发送";
            this.errorMsg = res.data.MSG || "验证码发送失败！";
          }
        })
        .catch((err) => {
          console.warn("发送验证码error:", err);
          this.sendFlag = "重新发送";
        });
    },
    //
  },
};
</script>

<style lang="scss" scoped>
.retrieve-dialog {
  /deep/ .el-dialog__header {
    padding: 16px 24px 6px;
    height: 24px;
    line-height: 24px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
  /deep/ .el-dialog__body {
    padding: 0 24px;
    .el-form-item {
      margin-bottom: 14px;
      &.is-error {
        margin-bottom: 26px;
      }
      .el-form-item__label {
        line-height: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
  /deep/ .el-dialog__footer {
    padding: 10px 24px 24px;
    word-spacing: -1em;
    .el-button + .el-button {
      margin-left: 16px;
    }
  }
}
.success-btn {
  display: block;
  margin: 0 auto;
}
.step-success {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  margin-top: -22px;
  img {
    width: 64px;
  }
  .success-text1 {
    margin: 8px 0 4px;
    line-height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
  .success-text2 {
    line-height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>