<template>
  <div class="login_wrap">
    <div class="loginBox">
      <div class="logo">
        <img src="../../assets/images/login_logo.png" alt="" />
        <p>您可信任的社区服务商</p>
      </div>
      <div class="login">
        <div class="loginType">
          <ul class="">
            <li v-bind:class="{ active: isActive == 1}" @click="loginType(1)">
              密码登录
            </li>
            <li v-bind:class="{ active: isActive == 2 }" @click="loginType(2)">
              手机登录
            </li>
            <li v-bind:class="{ active: isActive == 3}" @click="loginType(3)">
              扫码登录
            </li>
          </ul>
        </div>
        <div class="loginInput" v-if="isActive == 1 ">
          <div
            v-if="verified == 'trying'"
            class="login-verify"
          >
            <slide-verify
              :l="42"
              :r="10"
              :w="368"
              :h="155"
              slider-text="向右滑动"
              @success="onSuccess"
              @fail="onFail"
              @refresh="onRefresh"
            ></slide-verify>
            <i class="el-icon-close slide-close" @click.stop="verified = 'fail'"></i>
          </div>
          <template v-else>
            <div class="username">
              <input type="text" name="username" placeholder="账户" v-model="username" />
              <img src="../../assets/images/username_icon.png" alt="" />
            </div>
            <div class="password">
              <input
                type="password"
                name="password"
                placeholder="密码"
                autocomplete="off"
                v-model="password"
                @keydown.13="show($event)"
                @keydown.229="() => {}"
              />
              <img src="../../assets/images/password_icon.png" alt="" />
            </div>
          </template>

          <!-- <div class="remeberUser">
            <el-checkbox v-model="remeAccount">记住账号</el-checkbox>
          </div> -->
          <div class="loginBtn">
            <button id="login" @click="slideVerify()">登&nbsp;录</button>
          </div>
        </div>
        <div class="phone_login" v-if="isActive == 2">
          <template>
            <div class="phone_num">
              <input name="phoneNum" placeholder="手机号"  autocomplete="off" v-model.trim()="phoneNum" />
              <img src="../../assets/images/phone_num_icon.png" alt="" />
            </div>
            <div class="verification_code">
              <input
                placeholder="验证码"
                name="verificationCode"
                autocomplete="off"
                v-model.trim()="verificationCode"
              />
              <img src="../../assets/images/verification_code_icon.png" alt="" />
              <div v-show="!isGetVerificationCode" class="get_code" @click="getVerificationCode">获取验证码</div>
              <div v-show="isGetVerificationCode" class="wait_code">{{waitTime}}秒后可重发</div>
            </div>
          </template>

          <!-- <div class="remeberUser">
            <el-checkbox v-model="remeAccount">记住账号</el-checkbox>
          </div> -->
          <div class="phone_login_btn">
            <el-button :disabled="!verificationCode" type="primary" id="login" @click="phoneLogin">登&nbsp;录</el-button>
          </div>
        </div>
        <div class="weixinLogin" v-if="isActive == 3">
          <div class="weixinCode" v-show="step === 1">
            <div
              class="ws_waiting"
              v-loading="imgLoading"
              element-loading-text="正在获取二维码..."
              element-loading-background="rgba(0, 0, 0, 0.1)"
            >
              <img
                id="codeImgID"
                :src="codeImg"
                alt="二维码"
                v-show="!imgLoading"
                class="ws_img"
              />
              <p v-show="!imgLoading">打开微信扫一扫登录</p>
            </div>
          </div>
          <div class="weixinCode" v-show="step === 2">
            <div class="ws_waiting">
              <i
                class="el-icon-success"
                style="font-size: 48px; color: #409eff"
              ></i>
              <div style="margin-top: 16px">扫码成功，等待确认！</div>
            </div>
          </div>
        </div>
        <div class="tip">
          <p>
            温馨提示：加盟城市请(<a
              :href="apiVar.qadnUrl + '/importTemplate/ApplicationForm.doc'"
              download="申请表"
              >点击并下载申请表</a
            >)，申请平台账号
          </p>
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
        copyright &copy; 2017 Qinlin technology. All rights reserved.
        <a href="http://www.beian.miit.gov.cn">粤ICP备15007183号</a>
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
      >
      <span v-if="bandPhoneNumSetp == 1">亲爱的用户，QADN新增手机号登录功能，绑定手机号码后即可使用手机号登录系统。</span>
      <span v-if="bandPhoneNumSetp == 2">请问您是否成功绑定了手机号码？</span>
      <span slot="footer" class="dialog-footer">
        <div v-if="bandPhoneNumSetp == 1">
          <el-button type="primary" @click="bandPhoneNum">立即绑定</el-button>
        </div>
        <div v-if="bandPhoneNumSetp == 2">
          <el-button @click="noBand">暂不绑定</el-button>
          <el-button type="primary" @click="isBandHandler">已绑定</el-button>
        </div>
      </span>
    </el-dialog>
    <!-- 选择账户弹框 -->
    <el-dialog
      title="请选择登录账号"
      :visible.sync="selectUserDialogVisible"
      width="328px"
      center
      top="30vh"
      :modal="false"
      custom-class="users_info"
      :close-on-click-modal="false"
      :show-close="false"
      >
        <div 
          class="user_info_card"
          v-for="item in userList" 
          :key="item.userId"
          @click="selectUser(item)"
        >
           <div class="head_portrait">
             <img src="../../assets/images/username_icon.png" alt="">
           </div>
           <div class="info"> 
             <div class="name">{{item.userName + '(' + item.userId + ')'}}</div>
             <div class="job" >{{item.userType + ' | ' + item.userCompany}}</div>
           </div>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { Checkbox, MessageBox, Message } from "element-ui";
import utils from "../../commonFun/utils.js";
import api from "../../api/api";
import { addRoutes } from "../../router";
export default {
  name: "login",
  components: {
    elCheckbox: Checkbox,
  },
  data() {
    return {
      verified: "beforeTry",
      loading: false,
      isActive: 1,
      remeAccount: false,
      username: "", //lxj
      password: "", //qinlin888
      realName: "",
      checke: false,
      websock: "", // websocket连接
      codeImg: "", // 二维码图片地址
      imgLoading: true, // 二维码loading
      // isWs: false,
      step: 1, // 扫码登录的步骤
      codeLoading: "", // 扫码登录时的loading
      condeLoginData: "", // 扫码登录返回的登录信息
      timer: "", // 轮询验证二维码是否加载完成
      isLogin: false,
      bandPhoneDialogVisible:false ,//绑定手机号提示框
      bandPhoneNumSetp:1 ,//绑定手机步骤 
      //手机号码
      phoneNum:"",
      //手机验证码
      verificationCode:"",
      //是否发送验证码
      isGetVerificationCode:false,
      //获取验证码倒计时
      waitTime:60,
      //验证码倒计时定时器标记
      waitTimer:null,
      //选择账号弹框
      selectUserDialogVisible:false,
      //账号列表
      userList:[
        {
          userName:'许小树',
          userId:'123456',
          userType:'媒介',
          userCompany:'广州市媒介xxxx公司',
          url:''
        },
        {
          userName:'许大树',
          userId:'654321',
          userType:'销售',
          userCompany:'广州市销售xxxx公司',
          url:''
        }
      ]
      //背景动画参数
      /*   circleArr : [],
            WIDTH: '',
            HEIGHT: '',
            POINT: 13,
            canvas: '',
            context:'',*/
    };
  },
  mounted: function () {
    // 移除社区画像信息
    sessionStorage.removeItem("portraitInfo");
    //页面加载调用获取cookie值
    /* this.username = utils.getCookie('username');
    this.password = utils.getCookie('password');
    if (this.username !== '' && this.password !== '') {
      this.remeAccount = true;
    } */
    if (this.GetRequest("code")) {
      this.doLogin();
    }
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

      //接口
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
        this.loading = this.$loading({
          lock: true,
          text: "正在登录...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        //判断复选框是否勾选，勾选则调用配置cookie方法
        /* if (this.remeAccount === true) {
          utils.setCookie('username', name, 7);
          utils.setCookie('password', pass, 7);
        } else {
          utils.clearCookie('username')
          utils.clearCookie('password')
        } */
        loginParams = { username: name, pwd: pass };
      }
      api.postApi(this.apiVar.UCAPI + '/Login', loginParams).then(res => {
        let userMsg = res.data;
        // console.log('登录返回的数据', res.data)
        if (userMsg) {
          if (!userMsg.SysCode) {
            //判断是否绑定手机号
            // 如果没有绑定弹出绑定提示窗口
            // if (!userMsg.isBand) {
            if (!1) {
              this.$nextTick(()=>{
                this.loading.close();
                this.bandPhoneDialogVisible = true
              })
            }else{
              //绑定了继续执行下面的流程
              // 储存行业信息
              this.getIndustry();
              userMsg.username = name
              sessionStorage.setItem("session_data", JSON.stringify(userMsg));
              //判断权限
              this.authentication(userMsg,'accountNumber')
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
              this.loading.close();
            }
          } else {
            Message({
              message: "登录异常！",
              type: "warning",
            });
            this.loading.close();
          }
        })
        .catch((err) => {
          console.log(err);
          this.loading.close();
        });
      this.isLogin = true;
      if (this.websock !== "") {
        this.websock.close();
      }
    },
    // 判断是否使用扫码登录
    /**
     * @description: 
     * @param {*} type 1密码登录 2手机登录 3扫码登录
     * @return {*}
     */    
    loginType(type) {
      //根据点击的登录方式显示active
      this.isActive = type
      if(this.isActive === 1){
        this.notWxLogin()
      }else if(this.isActive === 2){
        this.notWxLogin()
      }else if (this.isActive === 3) {
        this.isLogin = false;
        this.initWebsocket();
      } 
    },
    // 扫码登录，初始化websocket
    initWebsocket() {
      if ("WebSocket" in window) {
        // let wsUrl = "wss://www.qinlinad.com/UCAPI/ScanLogin?type=PC"
        // let wsUrl = "wss://test-qadn.qinlindmp.com/UCAPI/ScanLogin?type=PC"
        let wsUrl = this.apiVar.wsUrl;
        this.websock = new WebSocket(wsUrl); // 这里面的this都指向vue
        this.websock.onopen = this.websocketOpen;
        this.websock.onmessage = this.websocketOnMessage;
        this.websock.onclose = this.websocketClose;
        this.websock.onerror = this.websocketError;
        this.isLogin = false;
      } else {
        this.$message.warning("您的浏览器不支持 WebSocket!");
      }
    },
    websocketOpen() {
      // 打开
      console.log("WebSocket连接成功");
    },
    websocketOnMessage(res) {
      // 数据接收
      console.log(typeof res.data, "数据接收", res.data);
      let wsData = JSON.parse(res.data);
      if (wsData.step === 1) {
        this.step = 1;
        console.log("获取二维码");
        this.codeImg = wsData.qrurl; //
        // this.imgLoading = false
        this.codeImgLoading();
      } else if (wsData.step === 2) {
        this.step = 2;
        console.log("扫码成功");
      } else if (wsData.step === 3) {
        this.codeLoading = this.$loading({
          lock: true,
          text: "正在登录...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        this.step = 3;
        console.log("扫码成功后点击确认按钮");
        this.condeLoginData = res.data;
        let params = {
          uid: wsData.uid !== undefined ? wsData.uid : "",
          token: wsData.token !== undefined ? wsData.token : "",
        };
        this.loginFun(params);
      }
    },
    websocketClose() {
      //  关闭
      // console.log("WebSocket关闭", this.websock.readyState);
      if (!this.isLogin) {
        Message({
          message: "扫码登录超时，请重新扫码！",
          type: "warning",
        });
        this.initWebsocket();
      }
    },
    websocketError(event) {
      // 失败
      console.log("WebSocket连接失败", event);
    },
    //扫码登录接口
    loginFun(data) {
      let params = data;
      api.postApi(this.apiVar.UCAPI + "/UserLogin", params).then((res) => {
        console.log("UserLogin", res);
        let isLogin = res.data;
        if (
          isLogin !== "" &&
          isLogin !== null &&
          !isLogin.SysCode &&
          isLogin.IsLogin !== false
        ) {
          this.isLogin = true;
          this.websock.close(); // 关闭websocket连接
          this.getIndustry(); //  储存行业信息
          // isLogin.username = name
          sessionStorage.setItem("session_data", JSON.stringify(isLogin)); // isLogin.realName
          this.codeLoading.close();
          //判断权限
          this.authentication(isLogin,'wx')
        } else {
          Message({
            message: "扫码登录异常！",
            type: "warning",
          });
          this.isLogin = false;
          this.initWebsocket();
        }
        this.codeLoading.close();
      });
    },
    // 判断二维码图片的加载
    codeImgLoading() {
      if (!this.isLogin) {
        let imgInfo = document.getElementById("codeImgID");
        this.timer = setInterval(() => {
          if (imgInfo.complete) {
            // console.log('加载完毕')
            this.imgLoading = false;
            clearInterval(this.timer);
          }
        }, 50);
      } else {
        console.log("非扫码登录");
      }
    },
    /**
     * [获取URL中的参数名及参数值的集合]
     * 示例URL:http://htmlJsTest/getrequest.html?uid=admin&rid=1&fid=2&name=小明
     * @param {[string]} urlStr [当该参数不为空的时候，则解析该url中的参数集合]
     * @return {[string]}       [参数集合]
     */
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
    bandPhoneNum(){
      //打开提示绑定手机模态框
      const href  = 'http://www.baidu.com'
      window.open(href, '_blank')
      setTimeout(() => {
        this.bandPhoneNumSetp = 2
      }, 500);
    },
    //  判断是否绑定手机号
    isBandHandler(){
      console.log('判断是否绑定手机号');
      //如果绑定了进入qfad首页
      //如果没有绑定
      // this.bandPhoneNumSetp = 1
    },
    //暂不绑定
    noBand(){
      this.bandPhoneDialogVisible = false
      this.bandPhoneNumSetp = 1 
    },
    // 非微信登录 清除状态
    notWxLogin(){
      this.isLogin = true;
      if (this.websock) {
        this.websock.close();
        clearInterval(this.timer);
      }
    },
    // 获取验证码
    getVerificationCode(){
      //判断是否输入手机号
      if (this.verifyPhoneNum(this.phoneNum)) return
      // 防止多次点击
      if (this.isGetVerificationCode) return
      this.isGetVerificationCode = true
      console.log("发送验证码");
      this.waitTimer = setInterval(() => {
        this.waitTime -= 1;
        if (this.waitTime <= 0) {
          clearInterval(this.waitTimer)
          this.isGetVerificationCode = false
          this.waitTime=60
        }
      }, 1000);
    },
    //校验手机号
    verifyPhoneNum(phoneNum){
      let reg = /^(?:(?:\+|00)86)?1\d{10}$/
      if (!reg.test(phoneNum)) {
       return this.$message.warning('请输入正确的手机号')
      }
    },
    //手机登录
    phoneLogin(){
      if (this.verifyPhoneNum(this.phoneNum)) return
      console.log('手机登录');
      //校验是否输入验证码

      //成功后
      //如果有多个账户选择登录用户再进入首页
      this.selectUserDialogVisible = true
      //如果只有一个账户则直接进入首页

    },
    //选择登录用户
    selectUser(info){
      console.log(info,'选择用户登录');
      this.selectUserDialogVisible = false
    },
    
    /**
     * @description: 权限判断 保留以前账号登录及扫码登录的逻辑并且兼容手机登录
     * @param {*} data 登录接口返回的数据
     * @param {*} loginType 登录方式 'accountNumber'.账号密码 'phoneNum'.手机登录 'wx'微信扫码
     * @return {*}
     */    
    authentication(data,loginType){
      if (data.uType === "ADN_SM") {
        addRoutes("SM");
        this.$router.push("/superOperate");
      } else if (["ADN_MD_COUNTRY", "ADN_MD"].includes(data.uType)) {
        if (data.customPermission.proposalPermission == 1) {
          // 判断直营媒介
          addRoutes('MD', true)
        } else {
          // 判断加盟媒介(旧权限)
          addRoutes('MD')
        }
        this.$router.push("/media");
      } else if (["ADN_BD_COUNTRY", "ADN_BD_KA", "ADN_BD"].includes(data.uType)) {
        //TODO:手机号登录的username问题？
        if (loginType == 'accountNumber') {
          sessionStorage.setItem("username", this.username);   // 用户为销售时，存起username以便创建方案的时候使用
        }
        if (data.customPermission.proposalPermission == 1) {
          // 判断直营销售
          addRoutes('BD', true)
        } else {
          // 判断加盟销售(旧权限)
          addRoutes('BD')
        }
        this.$router.push('/sale')
      } else if (data.uType === 'ADN_OP') {
        addRoutes('OP')
        this.$router.push('/operate')
      } else if (data.uType === 'AD') {
        addRoutes('AD')
        this.$router.push('/adOwner')
      } else if (data.uType === 'ADN_SA') {
        addRoutes('SA')
        this.$router.push('/admin')
      } else if (['ADN_DEV', 'ADN_DEV_ASSET', 'ADN_DEV_LEADER'].includes(data.uType)) {
        addRoutes('DEV')
        this.$router.push('/f_develop')
      } else if (loginType == 'wx' && data.uType === 'ADN_EP'  ) {
        addRoutes('EP')
        // 是否开通后台权限由小程序端判断
        this.$router.push("/f_engineer/orderList");
      }else if (['accountNumber','phoneNum'].includes(loginType)&& data.uType === 'ADN_EP' && data.backstagePermission == 1 ) {
        addRoutes('EP')
        this.$router.push("/f_engineer/orderList");
      } else {
        Message({
          message: "账号角色权限异常",
          type: "warning",
        });
        if (loginType == 'wx') {
          this.isLogin = false;
          this.initWebsocket();
        }
      }
    }
  },
  beforeDestroy(data) {
    if (this.loading) {
      this.loading.close();
    }
  },
};
</script>
<style lang="scss" scoped>
.weixinCode img {
  width: 240px;
  height: 260px;
}

.ws_waiting {
  width: 300px;
  height: 280px;
  margin: 0 auto;
}

@media all and (max-width: 1420px) {
  .weixinCode img {
    width: 220px;
    height: 240px;
  }
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
  color: rgba(0, 0, 0, .45);
  font-size: 14px;
}

.login {
  position: relative;
  width: 100%;
  .loginType {
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
    color: rgba(0, 0, 0, .25);
    font-family: PingFangSC-Regular, PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
  }
}

.username,
.password,
.remeberUser,
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
    color: rgba(0, 0, 0, .25);
  }
}

.loginInput,
.phone_login {
  img {
    position: absolute;
    top: 50%;
    left: 12px;
    width: 16px;
    transform: translateY(-50%);
  }
}

input::placeholder {
  color: rgba(0, 0, 0, .25);
}

.remeberUser {
  margin-bottom: 24px;
  font-size: 14px;
  text-align: left;
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
  position: absolute;
  bottom: 42px;
  left: 0;
  width: 100%;
  color: rgba(0, 0, 0, .45);
  font-size: 12px;
  text-align: center;
}

.footer a {
  color: rgba(0, 0, 0, .45);
  text-decoration: underline;
}
.login-verify {
  /* position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0; */
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
    color: rgba(255, 255, 255, .5);
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
    color: rgba(0, 0, 0, .85);
    font-family: PingFangSC-Medium, PingFang SC;
    font-size: 16px;
    font-weight: 500;
  }
  .el-dialog__header {
    padding: 16px;
  }
  .el-dialog__body {
    padding-top: 0;
  }
  .user_info_card {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 280px;
    height: 64px;
    padding: 12px;
    margin-bottom: 12px;
    background: rgba(0, 0, 0, .05);
    border-radius: 4px;
    cursor: pointer;
    &:last-child {
      margin-bottom: 0;
    }
    &:hover {
      background: rgba(0, 0, 0, .1);;
    }
    .head_portrait {
      overflow: hidden;
      width: 40px;
      height: 40px;
      margin-right: 8px;
      border-radius: 50%;
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
        color: #999;
        font-family: PingFangSC-Regular, PingFang SC;
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
      }
    }
  }
}
</style>
