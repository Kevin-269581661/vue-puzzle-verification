<template>
    <div class="login_wrap">
        <div class="loginBox">
            <div class="logo">
                <img src="../../assets/images/login_logo.png" alt="">
                <p>您可信任的社区服务商</p>
            </div>
            <div class="login">
                <ul class="loginType">
                    <li v-bind:class="{active:isActive}"
                        @click="loginType"
                    >密码登录
                    </li>
                    <li v-bind:class="{active:!isActive}"
                        @click="loginType">扫码登录
                    </li>
                </ul>
                <div class="loginInput" v-if="isActive">
                    <div class="username">
                        <input type="text" placeholder="账户" v-model="username">
                        <img src="../../assets/images/usericon.png" alt="">
                    </div>
                    <div class="password">
                        <input type="password" placeholder="密码" v-model="password" @keyup="show($event)">
                        <img src="../../assets/images/passicon.png" alt="">
                    </div>
                    <div class="remeberUser">
                        <el-checkbox v-model="remeAccount">记住账号</el-checkbox>
                    </div>
                    <div class="loginBtn">
                        <button id="login" @click="doLogin()">登&nbsp;录</button>
                    </div>
                </div>
                <div class="weixinLogin" v-if="!isActive">
                    <div class="weixinCode" v-show="step === 1">
                        <div class="ws_waiting" v-loading="imgLoading"
                             element-loading-text="正在获取二维码..."
                             element-loading-background="rgba(0, 0, 0, 0.1)">
                            <img id="codeImgID" :src="codeImg" alt="二维码" v-show="!imgLoading" class="ws_img">
                            <p v-show="!imgLoading">打开微信扫一扫登录</p>
                        </div>
                    </div>
                    <div class="weixinCode" v-show="step === 2">
                        <div class="ws_waiting">
                            <i class="el-icon-success" style="font-size: 48px;color: #409EFF"></i>
                            <div style="margin-top: 16px">扫码成功，等待确认！</div>
                        </div>
                    </div>
                </div>
                <div class="tip">
                    <p>温馨提示：加盟城市请(<a href="/ApplicationForm.doc" download="申请表">点击并下载申请表</a>)，申请平台账号</p>
                </div>
            </div>
        </div>
        <!--背景canvas特效 -->
        <!-- <div>
           <canvas id="Mycanvas"></canvas>
         </div>-->
        <!--背景图片动画-->
        <div class="backgroundImg">
            <img src="../../assets/images/loginBg.png" alt="">
        </div>
        <div class="footer">
            <p>copyright &copy; 2017 Qinlin technology. All rights reserved. 粤ICP备15007183号</p>
        </div>
    </div>
</template>

<script>
    import {Checkbox, MessageBox, Message} from 'element-ui';
    import utils from '../../commonFun/utils.js';
    import api from '../../api/api'

    export default {
        name: "login",
        components: {
            elCheckbox: Checkbox,
        },
        data() {
            return {
                loading: false,
                isActive: true,
                remeAccount: false,
                username: '', //lxj
                password: '', //qinlin888
                realName: '',
                checke: false,
                websock: '',          // websocket连接
                codeImg: '',          // 二维码图片地址
                imgLoading: true,     // 二维码loading
                isWs: false,
                step: 1,                // 扫码登录的步骤
                codeLoading: '',       // 扫码登录时的loading
                condeLoginData: '',   // 扫码登录返回的登录信息
                timer: '',             // 轮询验证二维码是否加载完成
                isLogin: false,
                //背景动画参数
                /*   circleArr : [],
                      WIDTH: '',
                      HEIGHT: '',
                      POINT: 13,
                      canvas: '',
                      context:'',*/
            }
        },
        mounted: function () {
            //  this.canvanFun()
            //页面加载调用获取cookie值
            this.username = utils.getCookie('username');
            this.password = utils.getCookie('password');
            if (this.username !== '' && this.password !== '') {
              this.remeAccount = true;
            }
        },
        methods: {
            // 获取所有行业信息并保存
            getIndustry() {
                api.getApi(this.Advertisement + '/GetIndustry', {act: 'all'}).then(res => {
                    let arr = res.data;
                    sessionStorage.setItem('industry', JSON.stringify(arr));
                });
            },
            //键盘
            show: function (ev) {
                let e = ev || window.ev;
                if (e.keyCode === 13) {
                    this.doLogin()
                }
            },
            //登录
            doLogin: function () {
                let name = this.username;
                let pass = this.password;
                if (name === '' || name == null || pass === '' || pass == null) {
                    MessageBox.alert('请输入正确的用户名', '用户登录', {
                        showClose: false,
                        confirmButtonText: '确定',
                    });
                    return;
                }
                let loading = this.$loading({
                    lock: true,
                    text: '正在登录...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                //判断复选框是否勾选，勾选则调用配置cookie方法
                if (this.remeAccount === true) {
                    utils.setCookie('username', name, 7);
                    utils.setCookie('password', pass, 7);
                } else {
                    utils.clearCookie('username')
                    utils.clearCookie('password')
                }
                //接口
                let loginParams = {username: name, pwd: pass};
                // api.getApi(this.UCAPI + '/Login', loginParams).then(res => {
                api.postApi(this.UCAPI + '/Login', loginParams).then(res => {
                    let userMsg = res.data;
                    console.log('登录返回的数据', res.data)
                    if (userMsg) {
                        if (!userMsg.SysCode) {
                            // 储存行业信息
                            this.getIndustry();
                            userMsg.username = name
                            sessionStorage.setItem("session_data", JSON.stringify(userMsg));//userMsg.realName
                            loading.close()
                            if (userMsg.uType === 'SM') {
                                //sessionStorage.getItem("real_name") 获取session的值
                                this.$router.push('/superOperate')
                            } else if (userMsg.uType === 'MD') {
                                this.$router.push('/media')
                            } else if (userMsg.uType === 'BD') {
                                sessionStorage.setItem("username", name);   // 用户为销售时，存起username以便创建方案的时候使用
                                this.$router.push('/sale')
                            } else if (userMsg.uType === 'AD') {
                                this.$router.push('/adOwner')
                            } else if (userMsg.uType === 'OP') {
                                this.$router.push('/operate')
                            } else if (userMsg.uType === 'SA') {
                                this.$router.push('/admin')
                            } else {
                                Message({
                                    message: '账号角色权限异常',
                                    type: 'warning'
                                })
                            }
                        } else {
                            Message({
                                message: '用户名或密码错误！',
                                type: 'warning'
                            })
                        }
                    } else {
                        setTimeout(function () {
                            Message({
                                message: '登录异常！',
                                type: 'warning'
                            })
                        }, 500)
                    }
                    loading.close()
                }).catch(err => {
                    console.log(err);
                    loading.close()
                });
                this.isLogin = true
                if (this.websock !== '') {
                    this.websock.close();
                }
            },
            // 判断是否使用扫码登录
            loginType() {
                this.isActive = !this.isActive;
                console.log('isActive', this.isActive, 'this.isWs', this.isWs)
                if (this.isActive === false && this.isWs === false) {
                    console.log('扫码登录')
                    this.isWs = true
                    this.isLogin = false
                    this.initWebsocket()
                } else {
                    this.isWs = false
                    this.isLogin = true
                    this.websock.close();
                    clearInterval(this.timer)
                }
            },
            // 扫码登录，初始化websocket
            initWebsocket() {
                if ("WebSocket" in window) {
                    let wsuri = "wss://www.qinlinad.com/UCAPI/ScanLogin?type=PC"
                    // let wsuri = "wss://beta.qinlinad.com/UCAPI/ScanLogin?type=PC"
                    this.websock = new WebSocket(wsuri);// 这里面的this都指向vue
                    this.websock.onopen = this.websocketOpen
                    this.websock.onmessage = this.websocketOnMessage
                    this.websock.onclose = this.websocketClose
                    this.websock.onerror = this.websocketError
                    this.isLogin = false
                } else {
                    this.$message.warning('您的浏览器不支持 WebSocket!')
                }
            },
            websocketOpen() {              // 打开
                console.log("WebSocket连接成功")
            },
            websocketOnMessage(res) {        // 数据接收
                console.log(typeof(res.data), '数据接收', res.data)
                let wsData = JSON.parse(res.data)
                if (wsData.step === 1) {
                    this.step = 1
                    console.log('获取二维码')
                    this.codeImg = wsData.qrurl //'https://beta.qinlinad.com/QRCodeImg/QRCode60003.jpg'
                    // this.imgLoading = false
                    this.codeImgLoading()
                } else if (wsData.step === 2) {
                    this.step = 2
                    console.log('扫码成功')
                } else if (wsData.step === 3) {
                    this.codeLoading = this.$loading({
                        lock: true,
                        text: '正在登录...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    })
                    this.step = 3
                    console.log('扫码成功后点击确认按钮')
                    this.condeLoginData = res.data
                    let params = {
                        uid: wsData.uid !== undefined ? wsData.uid : '',
                        token: wsData.token !== undefined ? wsData.token : ''
                    }
                    this.loginFun(params)
                }
            },
            websocketClose() {           //  关闭
                // console.log("WebSocket关闭", this.websock.readyState);
                if (!this.isLogin) {
                    Message({
                        message: '扫码登录超时，请重新扫码！',
                        type: 'warning'
                    })
                    this.initWebsocket()
                }
            },
            websocketError(event) {      // 失败
                console.log("WebSocket连接失败", event);
            },
            //扫码登录接口
            loginFun(data) {
                let params = data
                api.postApi(this.UCAPI + '/UserLogin', params).then(res => {
                    console.log('UserLogin', res)
                    let isLogin = res.data
                    if (isLogin !== '' && isLogin !== null && !isLogin.SysCode && isLogin.IsLogin !== false) {
                        this.isLogin = true
                        this.websock.close()                            // 关闭websocket连接
                        this.getIndustry()                              //  储存行业信息
                        // isLogin.username = name
                        sessionStorage.setItem("session_data", JSON.stringify(isLogin));// isLogin.realName
                        this.codeLoading.close()
                        if (isLogin.uType === 'SM') {
                            this.$router.push('/superOperate')
                        } else if (isLogin.uType === 'MD') {
                            this.$router.push('/media')
                        } else if (isLogin.uType === 'BD') {
                            this.$router.push('/sale')
                        } else if (isLogin.uType === 'OP') {
                            this.$router.push('/operate')
                        } else if (isLogin.uType === 'AD') {
                            this.$router.push('/adOwner')
                        } else if (isLogin.uType === 'SA') {
                            this.$router.push('/admin')
                        } else {
                            Message({
                                message: '账号角色权限异常',
                                type: 'warning'
                            })
                            this.isLogin = false
                            this.initWebsocket()
                        }
                    } else {
                        Message({
                            message: '扫码登录异常！',
                            type: 'warning'
                        })
                        this.isLogin = false
                        this.initWebsocket()
                    }
                    this.codeLoading.close()
                })
            },
            // 判断二维码图片的加载
            codeImgLoading() {
                if (!this.isLogin) {
                    let imgInfo = document.getElementById('codeImgID')
                    this.timer = setInterval(() => {
                        if (imgInfo.complete) {
                            // console.log('加载完毕')
                            this.imgLoading = false
                            clearInterval(this.timer)
                        }
                    }, 50)
                } else {
                    console.log('非扫码登录')
                }

            },
            // 生成max和min之间的随机数
            /*  num (max, _min) {
                    let min = arguments[1] || 0
                    return Math.floor(Math.random()*(max-min+1)+min)
                },
                //初始化生成原点
                init () {
                    this.circleArr = []
                    for (let i = 0; i < this.POINT; i++) {
                    this.circleArr.push(this.drawCricle(this.context, this.num(this.WIDTH), this.num(this.HEIGHT), this.num(12, 2), this.num(10, -10) / 40, this.num(10, -10) / 40));
                    }
                    this.draw()
                },
                //线条：开始xy坐标，结束xy坐标，线条透明度
                Line (x, y, _x, _y, o) {
                    this.beginX = x,
                    this.beginY = y,
                    this.closeX = _x,
                    this.closeY = _y,
                    this.o = o
                },
                //点：圆心xy坐标，半径，每帧移动xy的距离
                Circle (x, y, r, moveX, moveY) {
                    this.x = x,
                    this.y = y,
                    this.r = r,
                    this.moveX = moveX,
                    this.moveY = moveY
                },
                // 绘制原点
                drawCricle (cxt, x, y, r, moveX, moveY) {
                    let circle = new this.Circle(x, y, r, moveX, moveY)
                    cxt.beginPath()
                    cxt.arc(circle.x, circle.y, circle.r, 0, 2*Math.PI)
                    cxt.closePath()
                    cxt.fill()
                    return circle
                },
                //绘制线条
                drawLine (cxt, x, y, _x, _y, o) {
                    let line = new this.Line(x, y, _x, _y, o)
                    cxt.beginPath()
                    cxt.strokeStyle = 'rgba(0,0,0,'+ o +')'
                    cxt.moveTo(line.beginX, line.beginY)
                    cxt.lineTo(line.closeX, line.closeY)
                    cxt.closePath()
                    cxt.stroke()

                },
                //每帧绘制
                draw () {
                    this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
                    for (let i = 0; i < this.POINT; i++) {
                    this.drawCricle(this.context, this.circleArr[i].x, this.circleArr[i].y, this.circleArr[i].r)
                    }
                    for (let i = 0; i < this.POINT; i++) {
                    for (let j = 0; j < this.POINT; j++) {
                        if (i + j < this.POINT) {
                        let A = Math.abs(this.circleArr[i+j].x - this.circleArr[i].x),
                            B = Math.abs(this.circleArr[i+j].y - this.circleArr[i].y);
                        let lineLength = Math.sqrt(A*A + B*B);
                        let C = 1/lineLength*7-0.009;
                        let lineOpacity = C > 0.03 ? 0.03 : C;
                        if (lineOpacity > 0) {
                            this.drawLine(this.context, this.circleArr[i].x, this.circleArr[i].y, this.circleArr[i+j].x, this.circleArr[i+j].y, lineOpacity);
                        }
                        }
                    }
                    }
                },
                canvanFun(){
                    //  let WIDTH = window.innerWidth, HEIGHT = window.innerHeight, POINT = 35;
                    this.WIDTH = window.innerWidth
                    this.HEIGHT = window.innerHeight
                    console.log('WIDTH:',this.WIDTH+'HEIGHT:'+this.HEIGHT)

                    this.canvas = document.getElementById('Mycanvas');
                    this.canvas.width = this.WIDTH
                    this.canvas.height = this.HEIGHT;
                    this.context = this.canvas.getContext('2d');
                    this.context.strokeStyle = 'rgba(0,0,0,0.1)'
                    this.context.strokeWidth = 1
                //    this.context.fillStyle = 'rgba(193,193,193,0.3)'
                    this.context.fillStyle = 'rgba(0,0,0,0.1)'
                    //  let circleArr = [];
                    this.init();
                    let that = this
                    setInterval(function () {
                    for (let i = 0; i < that.POINT; i++) {
                        let cir = that.circleArr[i];
                        cir.x += cir.moveX;
                        cir.y += cir.moveY;
                        if (cir.x > that.WIDTH) cir.x = 0;
                        else if (cir.x < 0) cir.x = that.WIDTH;
                        if (cir.y > that.HEIGHT) cir.y = 0;
                        else if (cir.y < 0) cir.y = that.HEIGHT;

                    }
                    that.draw()
                    //  document.getElementsByClassName('login_wrap')[0].style.background = "url('"+Mycanvas.toDataURL()+"')"loginWrap
                    }, 30);
                }*/
        },
    }

</script>
<style scoped>
    .weixinCode img {
        width: 240px;
        height: 260px;
    }

    .ws_waiting {
        height: 280px;
        width: 300px;
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

    /*  #Mycanvas{
        position:absolute;
        z-index:-1;
        top:0;
      }*/
    .backgroundImg {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: -1;
    }

    .backgroundImg > img {
        width: 100%;
        height: 100%;
        animation: kenburns 10s infinite;;
        -webkit-animation: kenburns 10s infinite;
        -o-animation: kenburns 10s infinite;
        -moz-animation: kenburns 10s infinite;
    }

    @keyframes kenburns {
        0% {
            transform: scale(1.1);
            -webkit-transform: scale(1.1);
            -o-transform: scale(1.1);
            -moz-transform: scale(1.1);
        }
        50% {
            transform: scale(1.0);
            -webkit-transform: scale(1.0);
            -o-transform: scale(1.0);
            -moz-transform: scale(1.0);
        }
        100% {
            transform: scale(1.1);
            -webkit-transform: scale(1.1);
            -o-transform: scale(1.1);
            -moz-transform: scale(1.1);
        }
    }

    .login_wrap {
        position: fixed;
        width: 100%;
        height: 100%;
        /* background: url("../../assets/images/loginBg.png") no-repeat;
         background-size: cover;*/
    }

    .logo {
        text-align: center;
        margin-top: 125px;
        margin-bottom: 34px;
    }

    .logo img {
        width: 245px;
        margin-bottom: 10px;
    }

    .logo p {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
    }

    .login {
        position: relative;
        width: 100%;
        /*display: flex;
        justify-content: center;
        align-items: center;*/
    }

    .login .loginType {
        width: 100%;
        text-align: center;
        font-size: 16px;
    }

    .loginType li {
        display: inline-block;
        width: 100px;
        height: 40px;
        text-align: center;
        margin-bottom: 24px;
        cursor: pointer;
        margin-right: 40px;
        margin-left: 40px;
    }

    /*选中*/
    .active {
        border-bottom: 2px solid #1890FF;
        color: #1890FF;
    }

    .username input, .password input {
        border: 1px solid #D9D9D9 !important;
        border-radius: 4px;
        width: 368px;
        height: 38px;
        outline: none;
        position: relative;
        padding-left: 30px;
        font-size: 16px;
        box-sizing: border-box;
    }

    .username, .password, .remeberUser, .loginBtn {
        width: 368px;
        margin: 0 auto;
        text-align: center;
        position: relative;
    }

    .password {
        margin-top: 24px;
        margin-bottom: 24px;
    }

    .loginInput img {
        position: absolute;
        left: 10px;
        top: 13px;
        width: 12px;
    }

    input::placeholder {
        color: rgba(0, 0, 0, 0.25);
    }

    .remeberUser {
        font-size: 14px;
        text-align: left;
        margin-bottom: 24px;
    }

    /deep/ .el-checkbox {
        color: #666;
    }

    /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #1890FF;
    }

    .loginBtn button {
        width: 100%;
        height: 40px;
        color: #ffffff;
        font-size: 16px;
        border: none;
        background-color: #1890FF;
        outline: none;
        cursor: pointer;
        border-radius: 4px;
    }

    .tip {
        margin: 25px auto;
        width: 100%;
    }

    .tip p {
        text-align: center;
        font-size: 12px;
        color: #999999;
    }

    .tip p a {
        font-size: 12px;
        color: #1890FF;
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
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 42px;
        left: 0;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
    }


</style>
