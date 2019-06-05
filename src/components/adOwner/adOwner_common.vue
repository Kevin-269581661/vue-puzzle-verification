<template>
    <div id="app">
        <!--头部-->
        <div class="ad_index_header">
            <div class="logo">
                <img src="../../assets/images/logo.png" alt="">
            </div>
            <ul class="ad_index_nav">
                <li>
                    <router-link :to="{path:'/adOwner'}" class="nav_fast" id="Home">首页</router-link>
                </li>
                <!-- <li>
                  <router-link :to="{path:'/adOwner/planList'}" class="nav_fast" id="planMana">方案管理</router-link>
                </li> -->
                <li>
                    <router-link :to="{path:'/adOwner/orderList'}" class="nav_fast" id="orderMana">订单管理</router-link>
                </li>
                <li>
                    <router-link :to="{path:'/adOwner/ADReport'}" id="qinlinzk">亲邻智邻
                    </router-link>
                </li>
            </ul>
            <div class="message-box">
                <div @click="openMesBox()">
                    <el-badge :value="messLen" class="item">
                        <i class="el-icon-bell"></i>
                    </el-badge>
                </div>
                <el-dialog
                    title="消息通知"
                    class="message-box-push"
                    :visible.sync="showMessBox"
                    :append-to-body="true"
                    width="50%">
                    <el-collapse v-model="activeNames" @change="handleChange(activeNames)">
                        <el-collapse-item :name="index" v-for="(item,index) in orderArr" :key="index">
                            <template slot="title">
                                <p class="collapse-title"
                                   :class="item.ReadState == 1 ?'readColor':''">
                                    <span v-if="item.aiState == 1">画像审核 <i style="font-style: normal">已通过</i></span>
                                    <span v-if="item.aiState == 2">画像审核 <i style="font-style: normal">被拒绝</i></span>
                                    <span>{{formatTime(item.pTime)}}</span>
                                </p>
                            </template>
                            <div  :class="item.ReadState == 1 ?'readColor':''">{{item.apName}} 的用户画像申请
                                <span v-if="item.aiState == 1"><i style="color: #1890FF;font-style: normal">已通过</i></span>
                                <span v-if="item.aiState == 2"><i style="color: #ff7373;font-style: normal">被拒绝</i></span>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                    <span slot="footer" class="dialog-footer"></span>
                </el-dialog>
            </div>
            <div class="handle clearfix">
                <a href="#" class="ad_index_user">
                    <i class="uname">{{userName}}</i>
                    <img src="../../assets/images/downArr.png" alt="">
                </a>
                <div class="user_handel_list">
                    <ul>
                        <li><a href="#" @click="openWxBox1 = true">微信授权</a></li>
                        <li>
                            <router-link :to="{path:'/adOwner/changePwd'}">修改密码
                            </router-link>
                        </li>
                        <li>
                            <router-link :to="{path:'/login'}">退出登陆</router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <!--微信授权弹框-->
            <div>
                <!--扫码授权-->
                <el-dialog
                    title="微信授权"
                    :visible.sync="openWxBox1"
                    width="30%"
                >
                    <div class="wx-authority">
                        <div class="wx-code-box">
                            <img src="../../assets/images/code.jpg" alt="">
                        </div>
                        <div class="wx-authority-box">
                            <p>想扫码登录平台？</p>
                            <p>请使用微信扫描二维码进行授权</p>
                        </div>
                    </div>
                </el-dialog>
                <!--授权成功-->
                <el-dialog
                    title="微信授权"
                    :visible.sync="openWxBox2"
                    width="30%"
                >
                    <div class="wx-authority">
                        <div class="wx-authority-success">
                            <img src="../../assets/images/createSuccess.png" alt="">
                            <h2>授权成功</h2>
                            <p>以后可以使用微信扫码登录平台了哦</p>
                        </div>
                        <div class="wx-authority-success-box">
                            <el-button type="primary" round @click="openWxBox2 = false">确定</el-button>
                        </div>
                    </div>
                </el-dialog>
                <!--已授权-->
                <el-dialog
                    title="微信授权"
                    :visible.sync="openWxBox3"
                    width="30%"
                >
                    <div class="wx-authority">
                        <div class="wx-authority-success">
                            <img src="../../assets/images/alreadyLock.png" alt="">
                            <h2>已授权</h2>
                            <p>点击立即解绑可以更换绑定微信哦</p>
                        </div>
                        <div class="wx-authority-success-box">
                            <el-button type="danger" round @click="openWxBox4 = true;openWxBox3 = false">立即解绑
                            </el-button>
                        </div>
                    </div>
                </el-dialog>
                <!--解除绑定-->
                <el-dialog
                    title="微信授权"
                    :visible.sync="openWxBox4"
                    width="30%"
                >
                    <div class="wx-authority">
                        <div class="wx-code-box">
                            <img src="../../assets/images/code.jpg" alt="">
                        </div>
                        <div class="wx-authority-box">
                            <p style="line-height: 40px">请使用微信扫描二维码解除绑定</p>
                        </div>
                    </div>
                </el-dialog>
                <!--解绑成功-->
                <el-dialog
                    title="微信授权"
                    :visible.sync="openWxBox5"
                    width="30%"
                >
                    <div class="wx-authority">
                        <div class="wx-authority-success">
                            <img src="../../assets/images/createSuccess.png" alt="">
                            <h2>解绑成功</h2>
                            <p>使用新的微信账号登录请重新授权</p>
                        </div>
                        <div class="wx-remove-success-box">
                            <el-button type="primary" round>确定</el-button>
                            <el-button round>绑定新账号</el-button>
                        </div>
                    </div>
                </el-dialog>
            </div>
        </div>
        <router-view></router-view>
        <!--尾部-->
        <div class="ad_index_footer clearfix">
            <p><img src="../../assets/images/home_icon.png" alt="">
                <router-link to="/sale"> 回到首页</router-link>
                | Copyright &copy;{{newDate}} 亲邻科技线上产品部
            </p>
        </div>
    </div>
</template>

<script>
    import uTypeToText from '../../commonFun/uTypeToText.js'
    // 时间格式化
    import dateFormat from "../../commonFun/timeFormat.js";
    import sessFun from "../../commonFun/sessFun.js";
    import {api} from '../../api/api';

    export default {
        name: 'images',
        data() {
            return {
                newDate: new Date().getFullYear(),
                // 登录信息
                sessionData:{},
                userName: '',
                showMore: false,
                //扫码授权
                openWxBox1: false,
                //授权成功
                openWxBox2: false,
                //已授权
                openWxBox3: false,
                //解除绑定
                openWxBox4: false,
                //解绑成功
                openWxBox5: false,

                //消息
                showMessBox: false,
                activeMess: 'first',
                status: 1,
                orderArr: [],
                activeNames: [],
                num: [],
                messLen: 0,
            }
        },
        created() {
            this.sessionData = sessFun.getSess();
            this.getInitData()
        },

        methods: {
            handleClick(name) {
                console.log(name);
            },
            // 获取用户名称和角色
            getUserName() {
                let data = this.sessionData;
                let utype = data.uType;
                this.userName = uTypeToText.toText(utype) + '-' + data.realName;
                console.log(this.userName)
            },
            routerNav: function (path) {
                // this.$router.push({ path: path })
                this.$router.push(path)
            },
            //消息盒子
            getInitData() {
                // uid[必填]       申请人ID
                // tooken[必填]    登陆凭证
                let sessionData = this.sessionData;
                let info = {
                    uid: sessionData.uID,
                    tooken: sessionData.token
                };
                api.getApi(this.apiVar.QZhike + '/GetMess', info).then(res => {
                        console.log('GetMess--', res.data);
                        if (res.data.length) {
                            let arr = res.data.concat();
                            let result = [];
                            let unRead = [];
                            for (let data of arr) {
                                if (data.aiState != 0) {
                                    let format = {
                                        apName: data.apName ? data.apName : '',
                                        rescount: data.rescount ? data.rescount : '',
                                        apID: data.apID ? data.apID : '',
                                        aiTime: data.aiTime ? data.aiTime : '',
                                        total: data.total ? data.total : '',
                                        aiState: data.aiState ? data.aiState : '',
                                        pTime: data.pTime ? data.pTime : '',
                                        ReadState: data.ReadState,
                                    };
                                    result.push(format);
                                }
                                //未读
                                if (data.ReadState == 0) {
                                    unRead.push(data)
                                }
                            }
                            console.log('lastData--', result);
                            this.messLen = unRead.length;
                            this.orderArr = result;
                        }
                        else if (res.data.SysCode == 100302) {
                            this.loginTimeout();
                        } else {
                            this.$message.warning(res.data.MSG);
                        }
                    }
                );
            },
            openMesBox() {
                this.showMessBox = true;
                for (let i in this.orderArr) {
                    if (this.orderArr[i].reading == 1) {
                        //已读
                        this.orderArr.push(this.orderArr[i]);
                        this.orderArr.splice(i, 1);

                        // this.messLen = this.messLen - 1
                    }
                }
            },
            //已读
            handleChange(val) {
                console.log('消息---', val);
                if(val.length!==0){
                    for (let data of val) {
                        this.num.push(data);
                        // this.orderArr[i].reading = 1;
                        console.log(this.orderArr[data]);
                        if (this.orderArr[data].ReadState === 0) {
                            let sessionData = this.sessionData;
                            let info = {
                                uid: sessionData.uID,
                                tooken: sessionData.token,
                                ptime: dateFormat.toDateTime(this.orderArr[data].pTime),
                            };
                            //点一下就已读
                            api.getApi(this.apiVar.QZhike + '/UpdateRead', info).then(res => {
                                console.log(res.data);
                                if (res.data.MSG == '消息已读') {
                                    this.orderArr[data].ReadState = 1;
                                    this.messLen = this.messLen - 1
                                }else if(res.data.MSG == '失败'){
                                    this.loginTimeout()
                                }
                            })
                        }
                    }
                }


            },
            loginTimeout() {
                this.$message.warning("登录超时,请重新登录");
                this.$router.push("/login");
            },
            // 时间格式规范
            formatTime(val) {
                if (val) {
                    return dateFormat.timestampFormat(val);
                }
            },
            //已读消息

            navActive() {
                //刷新保持选中导航条
                let ind = this.$route.path.lastIndexOf('/');
                let path1 = this.$route.path.substr(ind + 1);
                console.log(path1);
                switch (path1) {
                    case 'sale':
                        $('#Home').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        break;
                    case 'ADplanList' || 'planDetail' || 'createPlan':
                        $('#planMana').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        break;

                    case  'ADorderList' || 'orderList':
                        $('#orderMana').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        break;
                    case 'ADReport':
                        $('#qinlinzk').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });

                }
            }
        },
        mounted: function () {
            this.getUserName();
            // this.name = sessionStorage.getItem("real_name");
            $(function () {
                $('.ad_index_nav').children('li').click(function () {
                    $(this).children('a').css({
                        "color": "#fff",
                        "border-bottom": "3px solid #fff"
                    }).parents().siblings().children('a').css({
                        "color": "#999",
                        "border-bottom": "none"
                    });
                });
                //修改密码
                $('.handle').hover(function () {
                    $('.user_handel_list').show();
                }, function () {
                    $('.user_handel_list').hide();
                });
                $('.user_handel_list').find('a').click(function () {
                    $(this).parents('.user_handel_list').hide();
                })
            });

            this.navActive();
        },
        watch: {
            "$route": "navActive",
            messLen(newVal, oldVal) {
                console.log('消息长度--', newVal, oldVal);
                this.messLen = newVal
            },
        },
    }
</script>


<style scoped>

    /*#app {*/
        /*padding-top: 60px;*/
    /*}*/

    .readColor {
        color: #999999;
    }

    /*消息*/
    .ad_index_header {
        position: relative;
        top: 0;
        left: 0;
        z-index: 999;
    }

    i.el-icon-bell {
        font-size: 20px !important;
        color: #ffffff;
        margin-right: 20px;
        cursor: pointer;
    }

    .item /deep/ .el-badge__content.is-fixed {
        right: 30px;
        width: 10px !important;
        height: 10px !important;
        line-height: 11px;
        cursor: pointer;
    }

    .message-box {
        position: absolute;
        right: 120px;
        top: 17px;
    }

    .clear-message {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #525253;
        text-align: center;
        cursor: pointer;
    }

    /*消息通知*/
    .collapse-title {
        display: flex;
        justify-content: space-between;
        padding-right: 20px;
    }

    /*滚动条*/
    .message-box-push /deep/ .el-dialog__body {
        height: 355px;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    .message-box-push /deep/ .el-dialog__body::-webkit-scrollbar {
        width: 4px;
        background: #fafafa;
    }

    .message-box-push /deep/ .el-dialog__body::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #c1c1c1;
    }

    /*绑定账号*/
    .wx-authority {
        text-align: center;
    }

    .wx-code-box {
        display: inline-block;
        width: 200px;
        height: 200px;
        border: 1px solid #E0E0E0;
        margin-bottom: 17px;
        position: relative;
    }

    .wx-code-box img {
        width: 200px;
        height: 200px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
    }

    .wx-authority-box {
        width: 280px;
        height: 60px;
        display: inline-block;
        border-radius: 100px;
        background-color: #E8E8E8;
        line-height: 20px;
        padding: 10px;
        box-sizing: border-box;
        font-size: 14px;
        color: #303133;
    }

    /*授权成功*/
    .wx-authority-success img {
        width: 72px;
        height: 72px;
    }

    .wx-authority-success h2 {
        font-size: 24px;
        color: #333333;
        margin-bottom: 8px;
        margin-top: 24px;
    }

    .wx-authority-success p {
        font-size: 14px;
        color: #999999;
    }

    .wx-authority-success-box, .wx-remove-success-box {
        margin-top: 60px;
    }

    .wx-authority-success-box button {
        width: 210px;
        height: 42px;
    }

    /*解绑成功*/
    .wx-remove-success-box button {
        width: 140px;
        height: 42px;
    }

    .wx-remove-success-box .el-button--default:hover {
        color: #606266;
        border-color: #dcdfe6;
        background-color: #fcfcfc;
    }

    /*.message-box-push /deep/ .el-dialog{*/
    /*height: 405px;*/
    /*overflow-y: scroll;*/
    /*overflow-x: hidden;*/
    /*}*/

    .message-box-push /deep/ .el-dialog::-webkit-scrollbar {
        width: 4px;
        background: #fafafa;
    }

    .message-box-push /deep/ .el-dialog::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/

        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #c1c1c1;
        border-radius: 4px;
    }

</style>
<style>
    .adOwner-message .el-tabs__header {
        margin-bottom: 0 !important;
    }

    .adOwner-message .el-badge {
        margin-right: 12px;
    }

    .adOwner-message .el-tabs__item {
        color: #525253;
    }

    .el-popper[x-placement^=bottom] {
        padding-bottom: 0;
    }

</style>
