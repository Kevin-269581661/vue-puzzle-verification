<template>
    <div id="app">
        <!--头部-->
        <div class="ad_index_header">
            <div class="logo">
                <img src="../../assets/images/logo.png" alt="">
            </div>
            <ul class="ad_index_nav">
                <li>
                    <router-link :to="{path:'/operate'}" class="nav_fast" id="Home">首页</router-link>
                </li>
                <!-- <li>
                  <router-link :to="{path:'/operate/clientList'}" class="nav_fast" id="clientMana">客户管理</router-link>
                </li> -->
                <li>
                    <router-link :to="{path:'/operate/mediaList'}" class="nav_fast" id="mediaMana">媒体管理</router-link>
                </li>
                <li>
                    <router-link :to="{path:'/operate/planList'}" class="nav_fast" id="planMana">方案管理</router-link>
                </li>
                <li>
                    <router-link :to="{path:'/operate/orderList'}" class="nav_fast" id="orderMana">订单管理</router-link>
                </li>
                <li>
                    <router-link :to="{path:'/operate/publishPriceList'}" class="nav_fast" id="priceMana">刊例价
                    </router-link>
                </li>
                <li>
                    <router-link :to="{path:'/operate/questionAndAnswer'}" class="nav_fast" id="qna">
                        <el-badge value='new'>Q&A</el-badge>
                    </router-link>
                </li>
                <!--<li @click="Notdeveloped"><a href="#">操作指引</a></li>-->
            </ul>
            <div class="handle clearfix">
                <a href="#" class="ad_index_user">
                    <!-- <em>普通运营</em>  -->
                    <img class="ad_index_user_avator" :src="avator" alt="">
                    <i class="uname">{{userName}}</i>
                    <img src="../../assets/images/downArr.png" alt="">
                </a>
                <div class="user_handel_list">
                    <ul>
                        <li><a href="#" @click="openWxBox1 = true">微信授权</a></li>
                        <li>
                            <router-link :to="{path:'/operate/changePwd'}">修改密码
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
    import sessFun from '../../commonFun/sessFun.js'

    export default {
        name: 'images',
        data() {
            return {
                newDate: new Date().getFullYear(),
                userName: '',
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
                // 账号登录信息
                sessionData: {},
                // 头像
                avator: require('../../assets/images/index/headimg.png'),
            }
        },
        created() {
            console.log("开始创建created");
            this.sessionData = sessFun.getSess();
            console.log("this.sessionData", this.sessionData);
            if (this.sessionData !== null && this.sessionData !== undefined) {
                if (this.sessionData.uType !== "OP") {
                    this.$message({
                        type: "warning",
                        message: "权限异常,请重新登录"
                    });
                    this.$router.push("/login");
                }
            } else {
                this.$router.push("/login");
            }
            this.avator = this.sessionData.headPic || require('../../assets/images/index/headimg.png')
        },
        methods: {

            // 获取用户名称和角色
            getUserName() {
                // let data = JSON.parse(sessionStorage.getItem('session_data'));
                let data = this.sessionData;
                let utype = data.uType;
                this.userName = uTypeToText.toText(utype) + '-' + data.realName;
                console.log(this.userName)
            },
            /* routerNav:function (path) {
                    // this.$router.push({ path: path })
                    this.$router.push(path)
                },*/
            //未开放功能
            Notdeveloped() {
                this.$message({
                    type: 'warning',
                    message: '该功能暂未开放',
                    duration: 1500,
                });
            },
            navActive() {
                //刷新保持选中导航条
                let ind = this.$route.path.lastIndexOf('/');
                let path1 = this.$route.path.substr(ind + 1);
                switch (path1) {
                    case 'operate':
                        $('#Home').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        break;
                    case 'mediaList' || 'mediaDetail' || 'mediaInput':
                        $('#mediaMana').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        break;
                    case 'clientList' || 'clientDetail' :
                        $('#clientMana').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        break;
                    case 'planList' || 'planDetail' :
                        $('#planMana').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        break;
                    case 'accountList' || 'createAccount':
                        $('#accountMana').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        break;
                    case  'publishPriceList':
                        $('#priceMana').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        break;
                    case  'ordeDetail' || 'orderList':
                        $('#orderMana').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        break;
                    case  'questionAndAnswer':
                        $('#qna').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        break;

                }
            }
        },
        watch: {
            "$route": "navActive"
        },
        mounted: function () {
            this.getUserName();
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
    }


</script>

<style>
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
    .ad_index_user_avator{
        width: 34px;
        height: 34px;
        border-radius: 50%;
        vertical-align: middle;
    }
</style>
