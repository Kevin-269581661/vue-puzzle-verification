<template>
    <div class="login_wrap">
      <div class="loginBox">
        <div class="logo">
          <img src="../../assets/images/login_logo.png" alt="" />
          <p>您可信任的智慧社区服务商</p>
        </div>

        <div class="login">
          <div class="login_type">
            <ul class="">

              <li v-bind:class="{ active: isActive == 2 }" @click="setLoginType(2)">
                手机登录
              </li>

              <!-- <li v-bind:class="{ active: isActive == 1 }" @click="setLoginType(1)">
                密码登录
              </li> -->

              <li v-bind:class="{ active: isActive == 3 || isActive == 4 }" @click="setLoginType(3)">
                扫码登录
              </li>
            </ul>
          </div>

          <!-- 密码登录 -->
          <div class="loginInput" v-if="isActive == 1">
            <div v-if="verified == 'trying'" class="login-verify">
              <slide-verify
                :l="42"
                :r="10"
                :w="368"
                :h="200"
                slider-text="向右滑动"
                :imgs="slideImgArr"
                @success="onSuccess"
                @fail="onFail"
                @refresh="onRefresh"
              ></slide-verify>
              <i
                class="el-icon-close slide-close"
                @click.stop="verified = 'fail'"
              ></i>
            </div>
            <template v-else>
              <div class="username">
                <el-input
                  type="text"
                  name="username"
                  placeholder="账户"
                  v-model="username"
                >
                  <img
                    slot="prefix"
                    src="../../assets/images/username_icon.png"
                    alt=""
                  />
                </el-input>
              </div>
              <div class="password">
                <el-input
                  show-password
                  type="password"
                  name="password"
                  placeholder="密码"
                  autocomplete="off"
                  v-model="password"
                  @keydown.native.13="show($event)"
                  @keydown.native.229="() => {}"
                >
                  <img
                    slot="prefix"
                    src="../../assets/images/password_icon.png"
                    alt=""
                  />
                </el-input>
              </div>
            </template>

            <div class="forget-password" @click="showRetrieveDialog = true">
              忘记密码
            </div>
            <div class="loginBtn">
              <button id="login" @click="slideVerify()">登&nbsp;录</button>
            </div>
          </div>

          <!-- 手机登录 -->
          <div class="phone_login" v-if="isActive == 2 || isActive == 4">
            <div class="phone_num">
              <el-input
                v-model.trim="phoneNum"
                name="phoneNum"
                placeholder="请输入11位手机号码"
                autocomplete="off"
                maxlength="11"
                oninput="value=value.replace(/[^\d]/g,'')"
              >
                <img
                  slot="prefix"
                  src="../../assets/images/phone_num_icon.png"
                  alt=""
                />
              </el-input>
            </div>
            <div class="verification_code">
              <el-input
                v-model.trim="verificationCode"
                placeholder="验证码"
                name="verificationCode"
                autocomplete="off"
                maxlength="6"
                oninput="value=value.replace(/[^\d]/g,'')"
              >
                <img
                  slot="prefix"
                  src="../../assets/images/verification_code_icon.png"
                  alt=""
                />
              </el-input>
              <div
                v-show="!isGetVerificationCode"
                class="get_code"
                @click="getVerificationCode"
              >
                获取验证码
              </div>
              <div v-show="isGetVerificationCode" class="wait_code">
                {{ waitTime }}秒后可重发
              </div>
            </div>
            <div v-if="isActive == 4" class="first_wx_bind_msg">首次使用微信扫码登录需先绑定账号，后续只需要使用微信扫码即可完成自动登录。</div>
            <!-- 扫码首次绑定登录，这里不显示 -->
            <div v-else class="check_agree_box_phone">
              <el-checkbox v-model="isCheckAgree">
                登录即代表同意<a
                  target="_blank"
                  style="color: #1890ff"
                  :href="settings.loginAgreement.url"
                >
                  《{{ settings.loginAgreement.name }}》
                </a>
              </el-checkbox>
            </div>
            <div class="phone_login_btn">
              <el-button
                type="primary"
                id="login"
                :disabled="!verificationCode"
                :loading="loginBtnLoading"
                @click="handlePhoneLogin"
              >
                {{ isActive == 4 ? '绑定并登录' : '登 录' }}
                </el-button>
            </div>
          </div>

          <!-- 微信扫码登录 -->
          <div class="weixinLogin" v-if="isActive == 3">
            <div
              v-loading="!isGetWxLoginCode"
              element-loading-text="拼命获取二维码..."
              element-loading-background="transparent"
              class="wx_code_wrapper"
            >
              <div id="wx_login_qrcode" class="wx_login_qrcode"></div>
            </div>

            <div class="check_agree_box">
              <el-checkbox v-model="isCheckAgree">
                登录即代表同意<a
                  target="_blank"
                  style="color: #1890ff"
                  :href="settings.loginAgreement.url"
                >
                  《{{ settings.loginAgreement.name }}》
                </a>
              </el-checkbox>
            </div>
          </div>

        </div>
      </div>

      <!--背景canvas特效 -->
      <!-- <div>
             <canvas id="Mycanvas"></canvas>
           </div>-->

      <!--背景图片动画-->
      <div class="backgroundImg">
        <img src="../../assets/images/loginBg.png" alt="" />
      </div>
      <div class="footer">
        <p>
          深圳市亲邻科技有限公司 版权所有
          <a href="https://beian.miit.gov.cn/" target="_blank"
            >粤ICP备15007183号</a
          >
        </p>
      </div>

      <!-- 绑定手机号码弹框 -->
      <el-dialog
        title="绑定手机号码"
        :visible.sync="bandPhoneDialogVisible"
        width="372px"
        :modal="false"
        top="30vh"
        :show-close="false"
        custom-class="band_phone_dialog"
      >
        <span
          >亲爱的用户，QADN新增手机号登录功能，绑定手机号码后即可使用手机号登录系统。</span
        >
        <span slot="footer" class="dialog-footer">
          <div>
            <el-button type="primary" @click="bandPhoneNum">立即绑定</el-button>
          </div>
        </span>
      </el-dialog>

      <!-- 选择账户弹框 -->
      <el-dialog
        title="请选择登录账号"
        :visible.sync="selectUserDialogVisible"
        width="400px"
        center
        top="25vh"
        :modal="false"
        custom-class="users_info"
        :close-on-click-modal="false"
        :show-close="false"
      >
        <div
          v-loading="selectAccountDialogLoading"
          element-loading-text="拼命获取登录数据中..."
          class="select_account_list_wrapper"
        >
          <div class="select_account_list">
            <div
              v-for="item in userList"
              class="user_info_card"
              :key="item.id"
              @click="handleSelectUser(item)"
            >
              <div class="head_portrait">
                <img v-if="item.userPortrait" :src="item.userPortrait" alt="" />
                <img
                  v-else
                  src="../../assets/images/user_default_portrait.png"
                  alt=""
                />
              </div>
              <div class="info">
                <div class="name">
                  {{ item.realName + "(" + item.userName + ")" }}
                </div>
                <div class="job">{{ item.roleName + " | " + item.companyName }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>

      <!-- 找回密码弹框 -->
      <RetrievePassword :isVisible.sync="showRetrieveDialog"></RetrievePassword>
    </div>
  </template>

  <script>
  import { Checkbox, MessageBox, Message } from "element-ui";
  import utils from "../../commonFun/utils.js";
  import api from "../../api/api";
  import { addRoutes } from "../../router";
  // import { emitCustomEvent } from "../../commonFun/matomoRule";
  import RetrievePassword from "./components/retrievePassword.vue";
  import Aegis from 'aegis-web-sdk';
  import settings from '@/settings'

  export default {
    name: "login",
    components: {
      elCheckbox: Checkbox,
      RetrievePassword
    },
    data() {
      return {
        settings,
        verified: "beforeTry",
        loading: false,
        // 登录方式 1：密码登录 2：手机登录 3：扫码登录 4：微信首次扫码登录未绑定，走验证码登录（登录后自动绑定微信）
        isActive: 2,
        showRetrieveDialog: false,
        username: "", //lxj
        password: "", //qinlin888
        realName: "",
        checke: false,
        codeImg: "", // 二维码图片地址
        imgLoading: true, // 二维码loading
        // isWs: false,
        codeLoading: "", // 扫码登录时的loading
        condeLoginData: "", // 扫码登录返回的登录信息
        timer: "", // 轮询验证二维码是否加载完成
        isLogin: false,
        bandPhoneDialogVisible: false, //绑定手机号提示框
        //手机号码
        phoneNum: "",
        //手机验证码
        verificationCode: "",
        //是否发送验证码
        isGetVerificationCode: false,
        //获取验证码倒计时
        waitTime: 60,
        //验证码倒计时定时器标记
        waitTimer: null,
        //选择账号弹框
        selectUserDialogVisible: false,
        //账号列表
        userList: [],
        //防止多次发生验证码
        getCodeLock: false,
        //背景动画参数
        /*   circleArr : [],
              WIDTH: '',
              HEIGHT: '',
              POINT: 13,
              canvas: '',
              context:'',*/
        slideImgArr: [
          "/static/images/loginSlideBg/01.jpg",
          "/static/images/loginSlideBg/02.jpg",
          "/static/images/loginSlideBg/03.jpg",
          "/static/images/loginSlideBg/04.jpg",
          "/static/images/loginSlideBg/05.jpg",
          "/static/images/loginSlideBg/06.jpg",
          "/static/images/loginSlideBg/07.jpg",
          "/static/images/loginSlideBg/08.jpg",
          "/static/images/loginSlideBg/09.jpg",
          "/static/images/loginSlideBg/10.jpg",
        ],
        // 微信用户数据
        wxUserInfo: {
          unionId: '',
          openId: ''
        },
        loginBtnLoading: false,
        isGetWxLoginCode: false,
        selectAccountDialogLoading: false,
        isCheckAgree: false,
        wxLoginState: null
      };
    },

    methods: {
      onSuccess() {
        this.verified = "success";
        this.doLogin();
        console.log("verified", this.verified);
      },
      onFail() {
        // this.verified = "fail"
        console.log("verified", this.verified);
      },
      onRefresh() {
        // this.verified = "refresh"
        console.log("verified", this.verified);
      },
      // 获取所有行业信息并保存
      getIndustry() {
        api
          .getApi(this.apiVar.Advertisement + "/GetIndustry", { act: "all" })
          .then((res) => {
            let arr = res.data;
            sessionStorage.setItem("industry", JSON.stringify(arr));
          });
      },
      //键盘
      show: function (ev) {
        let e = ev || window.ev;
        if (e.keyCode === 13) {
          this.slideVerify();
        }
      },
      // 滑动验证
      slideVerify() {
        if (
          this.username === "" ||
          this.username == null ||
          this.password === "" ||
          this.password == null
        ) {
          MessageBox.alert("用户名和密码不能为空", "用户登录", {
            showClose: false,
            confirmButtonText: "确定",
          });
          return;
        }
        this.verified = "trying";
      },

      //登录
      doLogin: function () {
        let name = this.username;
        let pass = this.password;
        let loginParams = {};
        if (this.GetRequest("code")) {
          loginParams = { code: this.GetRequest("code") };
        } else {
          if (name === "" || name == null || pass === "" || pass == null) {
            MessageBox.alert("用户名和密码不能为空", "用户登录", {
              showClose: false,
              confirmButtonText: "确定",
            });
            return;
          }
          loginParams = { username: name, pwd: pass };
        }
        const loadingEl = this.$loading({
          lock: true,
          text: "正在登录...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        api
          .postApi(this.apiVar.UCAPI + "/Login", loginParams)
          .then((res) => {
            let userMsg = res.data;
            // console.log('userMsg ===', userMsg)
            if (userMsg) {
              if (!userMsg.SysCode) {
                // 判断是否绑定手机号
                // 如果没有绑定弹出绑定提示窗口
                if (!userMsg.bindPhone) {
                  loadingEl.close();
                  this.bandPhoneDialogVisible = true;
                } else {
                  // 绑定了继续执行下面的流程
                  // 储存行业信息
                  // 埋点
                  const aegis = new Aegis({
                      id: '8lZw7Sojz5m46qw32K', // 上报 id
                      uin: userMsg.uID, // 用户唯一 ID（可选）
                      reportApiSpeed: true, // 接口测速
                      reportAssetSpeed: true, // 静态资源测速
                      spa: true, // spa 应用页面跳转的时候开启 pv 计算
                  });
                  this.getIndustry();
                  userMsg.username = name;
                  sessionStorage.setItem("session_data", JSON.stringify(userMsg));
                  utils.setLocalData(userMsg)
                  //判断权限
                  this.authentication(userMsg, "userName");
                  this.setLoginTypeCache()
                }
              } else {
                if (userMsg.SysCode == "400403") {
                  Message({
                    message: "账号角色权限不足",
                    type: "warning",
                  });
                } else {
                  Message({
                    message: "用户名或密码错误！",
                    type: "warning",
                  });
                }
                loadingEl.close();
              }
            } else {
              Message({
                message: "登录异常！",
                type: "warning",
              });
              loadingEl.close();
            }
          })
          .finally(() => {
            loadingEl.close();
          })
          .catch((err) => {
            console.log(err);
            loadingEl.close();
          });
        this.isLogin = true;
      },

      /**
       * 设置登录方式
       * @param type 1密码登录 2手机登录 3扫码登录
       */
      setLoginType(type) {
        //根据点击的登录方式显示active
        this.isActive = type;
        if (this.isActive === 1) {
          this.notWxLogin();
        } else if (this.isActive === 2) {
          this.notWxLogin();
        } else if (this.isActive === 3) {
          this.isLogin = false;
          this.initWxLogin()
        }
      },

      /**
       * 微信扫码登录-初始化二维码
       */
      initWxLogin() {
        this.$nextTick(() => {
          this.wxLoginState = Math.ceil(Math.random() * 1000)
          var obj = new WxLogin({
            self_redirect: true,
            id: "wx_login_qrcode",
            appid: settings.wxScanLoginConfig.appId,
            scope: "snsapi_login",
            redirect_uri: settings.wxScanLoginConfig.redirectUri,
            state: this.wxLoginState,
            style: 'black',
            // 切换二维码登录样式，值为1时二维码登录将切换到新样式。
            // stylelite: 1,
            href: 'data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxle2Rpc3BsYXk6IG5vbmU7fSAgICAgCi5pbXBvd2VyQm94IC5xcmNvZGUgewogICAgZGlzcGxheTogYmxvY2s7CiAgICB3aWR0aDogMTc4cHg7CiAgICBtYXJnaW46IDE2cHggYXV0byAwOwogICAgYm9yZGVyOiAxcHggc29saWQgI2UyZTJlMjsKfQouaW1wb3dlckJveCAuc3RhdHVzIHsKICAgIHBhZGRpbmc6IDdweCAwOwogICAgdGV4dC1hbGlnbjogY2VudGVyOwp9Ci5pbXBvd2VyQm94ICAuc3RhdHVzX3R4dCB7CiAgICB0ZXh0LWFsaWduOiBsZWZ0Owp9Ci5pbXBvd2VyQm94IC5zdGF0dXMgcDpudGgtb2YtdHlwZSgyKSB7CiAgICBkaXNwbGF5OiBub25lOwp9',
            onReady: (isReady) => {
              this.isGetWxLoginCode = isReady
              console.log('isReady ===', isReady)
            }
          });
        })
      },

      /**
       * 微信扫码登录-接收微信码数据
       */
      async wxLoginIframeEvent(event) {
        if (event.origin !== settings.wxScanLoginConfig.redirectOrigin) return;
        if (Number(event.data.state) !== this.wxLoginState) return
        console.log('微信扫码登录收到子消息 ====', event);
        if (!this.isCheckAgree) {
          // 刷新微信登录二维码
          this.isGetWxLoginCode = false;
          this.initWxLogin()
          this.$message.warning(`请勾选同意《${settings.loginAgreement.name}》`)
          return
        }
        const code = event.data.code
        if (code) {
          this.getWxUserInfo(code)
        } else {
          this.$message.error('操作失败，请重试~')
        }
      },

      /**
       * 微信扫码登录-获取绑定的用户信息
       */
      getWxUserInfo(wxCode) {
        console.log('getWxUserInfo wxCode ===', wxCode)
        this.$api.UCAPI.wxQrCodeUserBindInfo({ code: wxCode })
          .then(res => {
            const { SysCode: code, MSG: message, data } = res.data || {}
            if (code !== 200200 || !data) {
              this.$message.error(message || '获取数据失败')
              // 刷新微信登录二维码
              this.isGetWxLoginCode = false;
              this.isActive === 3
              this.initWxLogin()
              return
            }
            this.wxUserInfo.unionId = data.unionId
            this.wxUserInfo.openId = data.openId
            // 已绑定手机号
            if (data.userList && data.userList.length) {
              this.userList = data.userList
              // 如果只有一个账号，直接登录
              if (this.userList.length === 1) {
                this.handleSelectUser(this.userList[0])
              } else {
                this.selectUserDialogVisible = true
              }
            }
            // 未绑定（首次没绑定），走验证码登录（登录后自动绑定微信）
            else {
              this.setLoginType(4)
            }
          })
        .catch(err => {
          this.$message.error(String(err) || '获取数据失败')
          console.error('getWxUserInfo error:', err)
          // 刷新微信登录二维码
          this.isGetWxLoginCode = false;
          this.isActive === 3
          this.initWxLogin()
        })
      },

      /**
       * 微信扫码登录-通过码登录
       */
       async wxQrcodeLogin(info) {
        try {
          this.selectAccountDialogLoading = true
          const res = await this.$api.UCAPI.wxQrcodeLogin({
            // 选中的用户id
            id: info.id,
            phone: info.phone,
            wxUnionId: this.wxUserInfo.unionId
          })
          const { SysCode: code, MSG: message, data: userInfo } = res.data || {}
          if (code !== 200200 || !userInfo) {
            this.selectUserDialogVisible = false;
            this.$message.error(message || '登录失败，请刷新后重试~')
            return
          }
          this.getIndustry();
          sessionStorage.setItem("session_data", JSON.stringify(userInfo));
          utils.setLocalData(userInfo)
          this.authentication(userInfo, "phoneNum");
          this.setLoginTypeCache()
          // 埋点
          const aegis = new Aegis({
            id: '8lZw7Sojz5m46qw32K', // 上报 id
            uin: userInfo.uID, // 用户唯一 ID（可选）
            reportApiSpeed: true, // 接口测速
            reportAssetSpeed: true, // 静态资源测速
            spa: true, // spa 应用页面跳转的时候开启 pv 计算
          })
        } catch (err) {
          this.$message.error(String(err) || '登录失败，请刷新后重试~')
          console.error('wxQrcodeLogin error:', err)
          this.selectAccountDialogLoading = false
          this.selectUserDialogVisible = false;
        }
      },

      /**
       * 手机验证码登录
       */
      async phoneCodeLogin(info) {
        try {
          const fromWxQrCode = this.isActive == 4
          this.selectAccountDialogLoading = true
          const res = await this.$api.UCAPI.phoneCodeLogin({
            // 选中的用户id
            fromWxQrCode,
            wxOpenId: fromWxQrCode ? this.wxUserInfo.openId: null,
            wxUnionId: fromWxQrCode? this.wxUserInfo.unionId: null,
            code: this.verificationCode,
            phone: this.phoneNum,
            id: info.id,
            userName: info.userName,
            companyId: info.companyId,
            roleId: info.roleId,
          })
          this.selectAccountDialogLoading = false
          const { SysCode: code, MSG: message, data: userInfo } = res.data || {}
          if (code !== 200200 || !userInfo) {
            this.loginBtnLoading = false
            this.selectUserDialogVisible = false;
            this.$message.error(message || '登录失败')
            return
          }
          this.getIndustry();
          sessionStorage.setItem("session_data", JSON.stringify(userInfo));
          utils.setLocalData(userInfo)
          this.authentication(userInfo, "wx");
          this.setLoginTypeCache()
          // 埋点
          const aegis = new Aegis({
            id: '8lZw7Sojz5m46qw32K', // 上报 id
            uin: userInfo.uID, // 用户唯一 ID（可选）
            reportApiSpeed: true, // 接口测速
            reportAssetSpeed: true, // 静态资源测速
            spa: true, // spa 应用页面跳转的时候开启 pv 计算
          })
        } catch (err) {
          this.$message.error(String(err) || '登录失败')
          console.error('phoneCodeLogin error:', err)
          this.selectAccountDialogLoading = false
          this.selectUserDialogVisible = false;
          this.loginBtnLoading = false
        }
      },

      GetRequest(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
        var context = "";
        if (r != null) context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined"
          ? ""
          : context;
      },
      // 绑定手机号
      bandPhoneNum() {
        //打开提示绑定手机模态框
        let userCenterUrl = {
          dev: "https://test-qadp.qinlinad.com/",
          test: "https://test-qadp.qinlinad.com/",
          gray: "https://user-admin.qinlinad.com/",
          prod: "https://user-admin.qinlinad.com/",
        }[this.env];
        window.location.href = `${userCenterUrl}login?mark=bindPhoneNum&source=qadn&userName=${this.username}`;
      },
      // 非微信登录 清除状态
      notWxLogin() {
        this.isLogin = true;
        this.isGetWxLoginCode = false;
        this.selectAccountDialogLoading = false
      },

      /**
       * 获取验证码
       */
      getVerificationCode() {
        // 判断是否输入手机号
        if (!/^1\d{10}$/.test(this.phoneNum)) {
          return this.$message.warning("请输入正确的手机号");
        }
        // 防止多次点击
        if (this.getCodeLock) return;
        this.getCodeLock = true;
        let params = { phone: this.phoneNum, type: 3 };
        api
          .getApi(this.apiVar.UCAPI + "/sendVerificationCode", params)
          .then(({ data }) => {
            console.log("sendVerificationCode: ", data);
            if (data.SysCode == 200200) {
              this.isGetVerificationCode = true;
              this.$message.success("验证码已发送");
              this.waitTimer = setInterval(() => {
                this.waitTime -= 1;
                if (this.waitTime <= 0) {
                  clearInterval(this.waitTimer);
                  this.isGetVerificationCode = false;
                  this.waitTime = 60;
                }
              }, 1000);
            } else {
              this.$message.error(data.MSG);
            }
            this.getCodeLock = false;
          })
          .catch((error) => {
            this.$message.error("发送验证码失败");
            this.getCodeLock = false;
          });
      },

      /**
       * 手机登录
       */
      handlePhoneLogin() {
        if (!this.isCheckAgree && this.isActive == '2') {
          this.$message.warning(`请勾选同意《${settings.loginAgreement.name}》`)
          return
        }
        if (!/^1\d{10}$/.test(this.phoneNum)) {
          return this.$message.warning("请输入正确的手机号");
        }
        if (!this.verificationCode) {
          return this.$message.warning("请输入验证码");
        }
        this.loginBtnLoading = true;
        api
          .postApi(this.apiVar.UCAPI + "/getUserListByPhoneCode", {
            phone: this.phoneNum,
            code: this.verificationCode,
          })
          .then(({ data }) => {
            if (data.SysCode == 200200) {
              this.userList = data.data || []
              // 如果只有一个账户则直接进入首页
              if (this.userList.length === 1) {
                this.handleSelectUser(this.userList[0])
              }
              // 如果有多个账户选择登录用户再进入首页
              else if (this.userList.length > 1) {
                this.selectUserDialogVisible = true;
              }
              // 未绑定账号
              else {
                this.loginBtnLoading = false
                this.$message.error("该手机号尚未绑定账号");
              }
            } else {
              this.loginBtnLoading = false
              this.$message.error(data.MSG);
            }
          })
          .catch((error) => {
            this.loginBtnLoading = false
            this.$message.error("登录失败");
          });
      },

      /**
       * 缓存本次登录方式
       */
      setLoginTypeCache() {
        const loginType = this.isActive == 4 ? 3 : this.isActive;
        localStorage.setItem("last_login_type", loginType);
      },

      /**
       * 读取上次缓存登录方式
       */
      getLoginTypeCache() {
        const lastLoginType = localStorage.getItem("last_login_type");
        this.isCheckAgree = !!lastLoginType
        if (lastLoginType) this.setLoginType(Number(lastLoginType));
      },

      /**
       * 选择登录用户
       */
      async handleSelectUser(info) {
        console.log('选择用户登录 handleSelectUser ===', info);
        // 如果是已绑定的扫码登录
        if (this.isActive == 3) this.wxQrcodeLogin(info)
        else this.phoneCodeLogin(info)
      },

      /**
       * 权限判断 保留以前账号登录及扫码登录的逻辑并且兼容手机登录
       */
      authentication(data, loginType) {
        let { uType, asName = "", username = "" } = data;
        // 超级管理员
        if (uType === "ADN_SM") {
          addRoutes("ADN_SM");
          this.$router.push("/superOperate");
        }
        // 全国媒介/媒介/总部AE
        else if (["ADN_MD_COUNTRY", "ADN_MD", 'ADN_AE_HQ'].includes(uType)) {
          if (data.customPermission.proposalPermission == 1) {
            // 判断直营媒介
            addRoutes(uType, true);
          } else {
            // 判断加盟媒介(旧权限)
            addRoutes(uType);
          }
          this.$router.push("/media");
        }
        // KA销售/销售
        else if (["ADN_BD_KA", "ADN_BD"].includes(uType)) {
          if (data.customPermission.proposalPermission == 1) {
            // 判断直营销售
            addRoutes(uType, true);
          } else {
            // 判断加盟销售(旧权限)
            addRoutes(uType);
          }
          this.$router.push("/sale");
        }
        // 运营
        else if (uType === "ADN_OP") {
          addRoutes("ADN_OP");
          this.$router.push("/operate");
        }
        // 广告主
        else if (uType === "AD") {
          addRoutes("AD");
          this.$router.push("/adOwner");
        }
        // 系统管理员
        else if (uType === "ADN_SA") {
          addRoutes("ADN_SA");
          this.$router.push("/admin");
        }
        // 开发人员/资产人员/开发总监
        else if (
          ["ADN_DEV", "ADN_DEV_ASSET", "ADN_DEV_LEADER"].includes(uType)
        ) {
          this.$confirm('开发功能全新升级上线，点击【进入】将为您跳转至新版页面', '提示', {
            confirmButtonText: '进入',
            cancelButtonText: '取消'
          }).then(() => {
            // 不同环境跳转链接
            let digitizationDomainConfig = {
              dev: 'http://localhost:3000',
              test: 'https://test-crm.qinlinad.com',
              gray: 'https://crm.qinlinkeji.com',
              prod: 'https://crm.qinlinkeji.com',
            };
            window.open(`${digitizationDomainConfig[this.env]}/login?uid=${data.uID}&token=${data.token}`, "_self")
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        }
        // 工程人员（微信登录）
        else if (loginType == "wx" && uType === "ADN_EP") {
          addRoutes("ADN_EP");
          // 是否开通后台权限由小程序端判断
          this.$router.push("/f_engineer/orderList");
        }
        // 工程人员（账号登录）
        else if (
          ["userName", "phoneNum"].includes(loginType) &&
          uType === "ADN_EP" &&
          data.backstagePermission == 1
        ) {
          addRoutes("ADN_EP");
          this.$router.push("/f_engineer/orderList");
        } else {
          Message({
            message: "账号角色权限异常",
            type: "warning",
          });
        }
      },
    },

    mounted: function () {
      // 移除社区画像信息
      sessionStorage.removeItem("portraitInfo");
      if (this.GetRequest("code")) {
        this.doLogin();
      }
      // 父页面接收 iframe 的回复
      window.addEventListener('message', this.wxLoginIframeEvent)
      this.getLoginTypeCache()
    },

    beforeDestroy() {
      // 清除监听事件
      window.removeEventListener('message', this.wxLoginIframeEvent)
    },
  };
  </script>
  <style lang="scss" scoped>
  .ws_waiting {
    width: 300px;
    height: 280px;
    margin: 0 auto;
  }

  /deep/ .el-form-item__content {
    margin-left: 0 !important;
  }
  .backgroundImg {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
  }

  .backgroundImg > img {
    width: 100%;
    height: 100%;
    animation: kenburns 10s infinite;

    -webkit-animation: kenburns 10s infinite;
    -moz-animation: kenburns 10s infinite;
    -o-animation: kenburns 10s infinite;
  }

  @keyframes kenburns {
    0% {
      transform: scale(1.1);

      -webkit-transform: scale(1.1);
      -moz-transform: scale(1.1);
      -o-transform: scale(1.1);
    }
    50% {
      transform: scale(1);

      -webkit-transform: scale(1);
      -moz-transform: scale(1);
      -o-transform: scale(1);
    }
    100% {
      transform: scale(1.1);

      -webkit-transform: scale(1.1);
      -moz-transform: scale(1.1);
      -o-transform: scale(1.1);
    }
  }

  .login_wrap {
    position: fixed;
    width: 100%;
    height: 100%;
  }

  .logo {
    margin-top: 125px;
    margin-bottom: 34px;
    text-align: center;
  }

  .logo img {
    width: 245px;
    margin-bottom: 10px;
  }

  .logo p {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }

  .login {
    position: relative;
    width: 100%;
    .login_type {
      display: flex;
      justify-content: center;
      width: 100%;
      margin-bottom: 24px;
      font-size: 16px;
      ul {
        display: flex;
        justify-content: space-between;
        width: 364px;
        li {
          height: 40px;
          padding: 0 18px;
          line-height: 40px;
          text-align: center;
          cursor: pointer;
        }
      }
    }
  }
  /*选中*/
  .active {
    color: #1890ff;
    border-bottom: 2px solid #1890ff;
  }

  .username input,
  .password input,
  .phone_num input,
  .verification_code input {
    position: relative;
    box-sizing: border-box;
    width: 368px;
    height: 38px;
    padding-left: 36px;
    font-size: 16px;
    border: 1px solid #d9d9d9 !important;
    border-radius: 4px;
    outline: none;
    &::-webkit-input-placeholder {
      height: 24px;
      color: rgba(0, 0, 0, 0.25);
      font-family: PingFangSC-Regular, PingFang SC;
      font-size: 14px;
      font-weight: 400;
      line-height: 24px;
    }
  }

  .username,
  .password,
  .forget-password,
  .loginBtn,
  .phone_login_btn,
  .phone_num,
  .verification_code {
    position: relative;
    width: 368px;
    margin: 0 auto;
    text-align: center;
  }
  .verification_code,
  .password {
    margin: 24px auto;
  }

  .verification_code {
    .get_code,
    .wait_code {
      position: absolute;
      top: 50%;
      right: 12px;
      height: 38px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-size: 14px;
      font-weight: 400;
      line-height: 38px;
      transform: translateY(-50%);
      user-select: none;
    }
    .get_code {
      color: #1890ff;
      cursor: pointer;
    }
    .wait_code {
      color: rgba(0, 0, 0, 0.25);
    }
  }

  .loginInput,
  .phone_login {
    /deep/ .el-input--prefix .el-input__inner {
      padding-left: 36px;
      padding-right: 36px;
    }
    img {
      position: absolute;
      top: 50%;
      left: 8px;
      width: 16px;
      transform: translateY(-50%);
    }
  }

  input::placeholder {
    color: rgba(0, 0, 0, 0.25);
  }

  .forget-password {
    margin-bottom: 24px;
    font-size: 14px;
    text-align: left;
    color: #1890ff;
    cursor: pointer;
  }

  /deep/ .el-checkbox {
    color: #666;
  }

  /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #1890ff;
  }

  .loginBtn button {
    width: 100%;
    height: 40px;
    color: #fff;
    font-size: 16px;
    background-color: #1890ff;
    border: none;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
  }
  .phone_login_btn button {
    width: 100%;
    height: 40px;
    color: #fff;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
  }

  .tip {
    width: 100%;
    margin: 25px auto;
  }

  .tip p {
    color: #999;
    font-size: 12px;
    text-align: center;
  }

  .tip p a {
    color: #1890ff;
    font-size: 12px;
  }

  /*扫码登录*/
  .weixinLogin {
    width: 100%;
    text-align: center;
  }

  .weixinLogin img {
    margin-bottom: 10px;
  }

  .footer {
    position: sticky;
    top: calc(100vh - 48px);
    width: 100%;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
    text-align: center;
  }

  .footer a {
    color: rgba(0, 0, 0, 0.45);
    text-decoration: underline;
  }
  .login-verify {
    position: relative;
    left: 50%;
    z-index: 9;
    display: inline-block;
    margin-bottom: 16px;
    transform: translateX(-50%);
    /* background: rgba(0, 0, 0, 0.65); */
    .slide-close {
      position: absolute;
      top: 4px;
      right: 34px;
      color: rgba(255, 255, 255, 0.5);
      font-size: 26px;
      font-weight: 600;
      cursor: pointer;
    }
    /deep/ .slide-verify {
      canvas {
        border-radius: 4px;
      }
    }
  }
  // 选择账户弹框
  /deep/ .users_info {
    .el-dialog__title {
      color: rgba(0, 0, 0, 0.85);
      font-family: PingFangSC-Medium, PingFang SC;
      font-size: 16px;
      font-weight: 500;
    }
    .el-dialog__header {
      padding: 16px;
    }
    .el-dialog__body {
      padding-top: 0;
      padding-left: 0;
      padding-right: 0;
    }
    .user_info_card {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      width: 100%;
      height: 64px;
      padding: 12px;
      margin-bottom: 12px;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 4px;
      cursor: pointer;
      &:last-child {
        margin-bottom: 0;
      }
      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
      .head_portrait {
        overflow: hidden;
        width: 40px;
        height: 40px;
        margin-right: 8px;
        border-radius: 50%;
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
        }
      }
      .info {
        .name {
          height: 20px;
          margin-bottom: 2px;
          color: #000;
          font-family: PingFangSC-Regular, PingFang SC;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
        }
        .job {
          height: 18px;
          width: 220px;
          color: #999;
          font-family: PingFangSC-Regular, PingFang SC;
          font-size: 12px;
          font-weight: 400;
          line-height: 18px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  //提示绑定手机号码弹窗
  /deep/ .band_phone_dialog {
    width: 372px;
    background: #ffffff;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    .el-dialog__header {
      padding: 12px 24px 8px;
      .el-dialog__title {
        height: 24px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 24px;
      }
    }
    .el-dialog__body {
      padding: 0 24px;
      span {
        height: 44px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
      }
    }
    .el-dialog__footer {
      padding: 16px 24px 24px;
    }
  }

  .first_wx_bind_msg {
    width: 368px;
    color: #e0282e;
    font-size: 14px;
    line-height: 20px;
    margin: 10px auto;
  }


  .wx_code_wrapper {
    height: 247px;
    width: 296px;
    margin: 0 auto;
    /deep/ .el-loading-spinner {
      .el-loading-text {
        color: #999;
      }
      .path {
        stroke: #999;
      }
    }
  }

  .select_account_list_wrapper {
    max-height: 300px;
    overflow: hidden auto;
    .select_account_list {
      padding: 20px 20px 0;
    }
  }

  .check_agree_box {
    margin-top: 12px;
    text-align: center;
    /deep/ .el-checkbox__label {
      color: #666 !important;
    }
  }

  .check_agree_box_phone {
    margin-bottom: 12px;
    text-align: center;
    /deep/ .el-checkbox__label {
      color: #666 !important;
    }
  }
  </style>

  <style>
  .wx_login_qrcode  iframe {
    height: 247px;
    width: 296px;
    border: none;
    outline: none;
    display: block;
    margin: 0 auto;
  }
  </style>
