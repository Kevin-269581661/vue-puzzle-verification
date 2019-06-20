<template>
    <div id="sale">
        <!--头部 -->
        <div class="ad_index_header">
            <div class="logo">
                <img src="../../assets/images/logo.png" alt="">
            </div>
            <ul class="ad_index_nav">
                <li>
                    <router-link :to="{path:'/sale'}" class="nav_fast" id="Home">首页</router-link>
                </li>
                <li>
                    <router-link :to="{path:'/sale/clientList'}" id="clientMana">客户管理</router-link>
                </li>
                <li>
                    <router-link :to="{path:'/sale/planList'}" id="planMana">方案管理</router-link>
                </li>
                <li>
                    <router-link :to="{path:'/sale/orderList'}" id="orderMana">订单管理</router-link>
                </li>
                <li>
                    <router-link :to="{path:'/sale/photoGallery'}" id="Photos">案例库</router-link>
                </li>
                <li @mouseenter="showMore = true" @mouseleave="showMore = false" class="ad_index_nav_li">
                    <img src="../../assets/images/import.png" alt="" class="ad_index_nav_li_img">
                    <a href="#" class="nav_fast more" id="More">辅助资料<i class="fa fa-angle-down"></i>
                        <ul class="fast_list_fir" v-show="showMore">
                            <li>
                                <router-link :to="{path:'/sale/publishPriceList'}" id="priceMana">刊例价
                                </router-link>
                            </li>
                            <li>
                                <router-link :to="{path:'/sale/questionAndAnswer'}" id="qna">操作说明</router-link>
                            </li>
                            <li>
                                <router-link :to="{path:'/sale/compact'}" id="compact">文件下载</router-link>
                            </li>
                        </ul>
                    </a>
                </li>
                <li>
                    <router-link :to="{path:'/sale/tvOrderList'}" class="nav_fast" id="TVAdvertising">
                        电视广告
                    </router-link>
                </li>
            </ul>
            <div class="handle clearfix">
                <a href="#" class="ad_index_user">
                    <!-- <em>销售</em>  -->
                    <img class="ad_index_user_avator" :src="avator" alt="">
                    <i class="uname">{{userName}}</i>
                    <img src="../../assets/images/downArr.png" alt="">
                </a>
                <div class="user_handel_list">
                    <ul>
                        <li>
                            <!-- <router-link :to="{path:'/sale/changePwd'}">修改密码
                            </router-link> -->
                            <router-link :to="{path:'/sale/myInfo'}">个人中心
                            </router-link>
                        </li>
                        <li><a href="#" @click="openWxBox1 = true">微信授权</a></li>
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

    export default {
        name: 'images',
        data() {
            return {
                newDate: new Date().getFullYear(),
                showKJFS: false,
                // 是否显示亲邻
                showQinlin: false,
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
                // 销售账号登录信息
                saleData: '',
                avator: require('../../assets/images/index/headimg.png'),
            }
        },
        created() {
            this.saleData = JSON.parse(sessionStorage.getItem('session_data'))
            if (this.saleData !== null && this.saleData !== undefined) {
                if (this.saleData.uType !== 'BD') {
                    this.$message({
                        type: 'warning',
                        message: '权限异常,请重新登录'
                    })
                    this.$router.push('/login')
                }
            } else {
                this.$router.push('/login')
            }
            this.avator = this.saleData.headPic || require('../../assets/images/index/headimg.png')
        },
        methods: {
            // 是否显示亲邻
            getIsShowQinlin(){
                // let accountArr = [611,612,613,1,657,610,609,608,607,605,3,1151];
                // let accountArr = [110100,310100,440100,440300,500100,510100,0];
                let companyList = ['999','1','2','3','4','5','6','7']
                let account = JSON.parse(sessionStorage.getItem('session_data')).asrID;
                for(let data of companyList){
                    if(data == account){
                        sessionStorage.setItem('AD_apid', -1);
                        sessionStorage.setItem('ctList_data', '100,31,38,1,6,8,11,14');
                        sessionStorage.setItem('aiTime', '2018-09-20 11:23:25');
                        this.showQinlin = true;
                        return;
                    }
                }
            },
            // 获取用户名称和角色
            getUserName() {
                // let data = JSON.parse(sessionStorage.getItem('session_data'));
                let utype = this.saleData.uType;
                this.userName = uTypeToText.toText(utype) + '-' + this.saleData.realName;
                console.log(this.userName)
            },
            routerNav: function (path) {
                // this.$router.push({ path: path })
                this.$router.push(path)
            },
            //操作指引
            Notdeveloped() {
                this.$message({
                    type: 'warning',
                    message: '该功能暂未开放',
                    duration: 1500
                });
            },
            navActive() {
                //刷新保持选中导航条
                let ind = this.$route.path.lastIndexOf('/');
                let path1 = this.$route.path.substr(ind + 1);
                console.log('刷新保持选中导航条',path1);

                switch (path1) {

                    case 'sale':
                        $('#Home').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        $('#More').find('a').css({
                            "color": "#999"
                        });
                        $('#kjfs').find('a').css({
                            "color": "#999"
                        });
                        break;
                    case 'clientList':
                    case 'clientDetail':
                    case 'createClient':
                        $('#clientMana').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        $('#More').find('a').css({
                            "color": "#999"
                        });
                        break;
                    case 'planList':
                    case 'planDetail':
                    case "createPlan":
                    case "editPlan":
                        $('#planMana').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        $('#More').find('a').css({
                            "color": "#999"
                        });
                        break;
                    case 'photoGallery':
                        $('#Photos').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        $('#More').find('a').css({
                            "color": "#999"
                        });
                        $('#kjfs').find('a').css({
                            "color": "#999"
                        });
                        break;
                    case 'orderList':
                    case 'orderDetail':
                        $('#orderMana').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        $('#More').find('a').css({
                            "color": "#999"
                        });
                        break;
                    case 'publishPriceList':
                        $('#More').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        $('#priceMana').addClass('active')
                        $('#kjfs').find('a').css({
                            "color": "#999"
                        })
                        break;
                    case  'questionAndAnswer':
                        $('#More').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        $('#qna').addClass('active')
                        $('#kjfs').find('a').css({
                            "color": "#999"
                        })
                        break;
                    case 'compact':
                        $('#More').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        $('#compact').addClass('active')
                        $('#kjfs').find('a').css({
                            "color": "#999"
                        })
                        break;
                    case 'tvOrderList':
                    case 'advertTV':
                    case 'tvOrderDetail':
                        $('#TVAdvertising').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        $('#More').find('a').css({
                            "color": "#999"
                        });
                        $('#kjfs').find('a').css({
                            "color": "#999"
                        });
                        break;
                }
            },
        },
        mounted: function () {
            this.getUserName();
            this.getIsShowQinlin();
            // this.name = sessionStorage.getItem("real_name");
            $(function () {
                $('.fast_list_fir').find('a').click(function () {
                    // $(this).addClass('active').parents().siblings().find('a').removeClass('active')
                    $(this).css('color', '#fff').parents().siblings().find('a').css('color', '#999')
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
            "$route": "navActive"
        },
    }
</script>

<style>
    .fast_list_fir {
        background-color: #444444;
        position: relative;
        z-index: 99999;
        width: 100px;
        /*left: -11px;*/
        top: 20px;
    }

    .fast_list_fir li {

        border-bottom: 1px solid #666666;
    }

    .fast_list_fir li a {
        display: inline-block;
        width: 100px;
        text-align: center;
        font-size: 14px;
        line-height: 36px;
        font-weight: normal;
        color: #999999;
    }

    .fast_list_fir li a:hover {
        color: #ffffff !important;
        border-bottom: none !important;
    }
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
    a.active {
        color: #ffffff !important;
    }
    .ad_index_nav_li{
        position: relative;
    }
    .ad_index_nav_li_img{
        position: absolute;
        width: 26px;
        height: 26px;
        right: -3px;
        top:-10px;
    }
</style>
