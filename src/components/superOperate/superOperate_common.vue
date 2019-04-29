<template>
    <div id="app">
        <!--头部-->
        <div class="ad_index_header">
            <div class="logo">
                <img src="../../assets/images/logo.png" alt="">
            </div>
            <ul class="ad_index_nav">
                <li>
                    <router-link :to="{path:'/superOperate'}" class="nav_fast" id="Home">首页</router-link>
                </li>
                <li @mouseenter="showKJFS = true" @mouseleave="showKJFS = false">
                    <a href="#" class="nav_fast more" id="kjfs">常用模块 <i class="fa fa-angle-down"></i>
                        <ul class="fast_list_fir" v-show="showKJFS">
                            <li>
                                <router-link :to="{path:'/superOperate/mediaList'}" id="mediaMana">媒体管理</router-link>
                            </li>
                            <li>
                                <router-link :to="{path:'/superOperate/clientList'}" id="clientMana">客户管理</router-link>
                            </li>
                            <li>
                                <router-link :to="{path:'/superOperate/planList'}" id="planMana">方案管理</router-link>
                            </li>
                            <li>
                                <router-link :to="{path:'/superOperate/orderList'}" id="orderMana">订单管理</router-link>
                            </li>
                        </ul>
                    </a>
                </li>
                <li>
                    <router-link :to="{path:'/superOperate/dataAnalysis'}" class="nav_fast" id="dataAnalysis">经营分析</router-link>
                    <!--<a class="nav_fast">数据分析</a>-->
                </li>
                <li @mouseenter="showMore = true" @mouseleave="showMore = false">
                    <a href="#" class="nav_fast more" id="More">其他模块<i class="fa fa-angle-down"></i>
                        <ul class="fast_list_fir" v-show="showMore">
                            <li>
                                <router-link :to="{path:'/superOperate/accountList'}" id="accountMana">账号管理
                                </router-link>
                            </li>
                            <li>
                                <router-link :to="{path:'/superOperate/ADlimitList'}" id="ADlimit">广告限制</router-link>
                            </li>
                            <li v-if="showCompany">
                                <router-link :to="{path:'/superOperate/companyList'}" class="nav_fast" id="company">公司管理</router-link>
                            </li>
                            <li>
                                <router-link :to="{path:'/superOperate/publishPriceList'}" id="priceMana">刊例价
                                </router-link>
                            </li>
                        </ul>
                    </a>
                </li>
                <li>
                    <router-link :to="{path:'/superOperate/photoGallery'}" id="Photos">案例库</router-link>
                </li>
                <li v-if="showQinlin">
                    <router-link :to="{path:'/superOperate/ADqinlinzk'}" class="nav_fast" id="ADqinlinzk">智邻数图</router-link>
                </li>
                <li @mouseenter="showMes = true" @mouseleave="showMes = false" class="ad_index_nav_li">
                    <img src="../../assets/images/import.png" alt="" class="ad_index_nav_li_img">
                    <a href="#" class="nav_fast more" id="mes">辅助资料<i class="fa fa-angle-down"></i>
                        <ul class="fast_list_fir" v-show="showMes">
                            <li>
                                <router-link :to="{path:'/superOperate/questionAndAnswer'}" id="qna">操作说明</router-link>
                            </li>
                            <li>
                                <router-link :to="{path:'/superOperate/compact'}" id="compact">合同下载</router-link>
                            </li>
                        </ul>
                    </a>
                </li>
                <li>
                    <router-link :to="{path:'/superOperate/tvOrderList'}" class="nav_fast" id="TVAdvertising">
                        <!-- <el-badge value='new'>电视广告</el-badge> -->
                        电视广告
                    </router-link>
                </li>
            </ul>
            <div class="handle clearfix">
                <a href="#" class="ad_index_user">
                    <!-- <em>超级运营</em> -->
                    <img class="ad_index_user_avator" :src="avator" alt="">
                    <i class="uname">{{userName}}</i>
                    <i class="fa fa-angle-down"></i>
                </a>
                <div class="user_handel_list">
                    <ul>
                        <li>
                            <!-- <router-link :to="{path:'/superOperate/changePwd'}">修改密码
                            </router-link> -->
                            <router-link :to="{path:'/superOperate/myInfo'}">个人中心
                            </router-link>
                        </li>
                        <li><a href="#" @click="openWxBox1 = true">微信授权</a></li>
                        <li>
                            <router-link :to="{path:'/login'}">退出登陆</router-link>
                        </li>
                    </ul>
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
        </div>

        <router-view></router-view>

        <!--尾部-->
        <div class="ad_index_footer clearfix">
            <p><img src="../../assets/images/home_icon.png" alt="">
                <router-link to="/superOperate"> 回到首页</router-link>
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
                // 是否显示亲邻
                showQinlin: false,
                showKJFS: false,
                userName: '',
                showMore: false,
                showMes: false,
                showCompany: false,
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
                //  超运账号登录信息
                SMData: '',
                // 头像
                avator: require('../../assets/images/index/headimg.png'),
            }
        },
        created() {
            console.log('开始创建created')
            this.SMData = JSON.parse(sessionStorage.getItem('session_data'))
            console.log('this.SMData', this.SMData)
            if (this.SMData !== null && this.SMData !== undefined) {
                if (this.SMData.uType !== 'SM') {
                    this.$message({
                        type: 'warning',
                        message: '权限异常,请重新登录'
                    })
                    this.$router.push('/login')
                }
            } else {
                this.$router.push('/login')
            }
            this.avator = this.SMData.headPic || require('../../assets/images/index/headimg.png')
        },
        watch: {
            "$route": "navActive"
        },
        methods: {
            // 获取用户名称和角色
            getUserName() {
                // let data = JSON.parse(sessionStorage.getItem('session_data'));
                let utype = this.SMData.uType;
                this.userName = uTypeToText.toText(utype) + '-' + this.SMData.realName;
                console.log(this.userName)
            },
            routerNav: function (path) {
                // this.$router.push({ path: path })
                this.$router.push(path)
            },
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
                console.log('刷新保持选中导航条',path1);

                switch (path1) {
                    case 'superOperate':
                        $('#Home').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        // $('#More').find('a').css({
                        //     "color": "#999"
                        // });
                        // $('#kjfs').find('a').css({
                        //     "color": "#999"
                        // });
                        break;
                    case 'mediaList':
                    case 'mediaDetail':
                    case 'mediaInput':
                        $('#kjfs').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        $('#MediaMana').addClass('active')
                        $('#More').find('a').css({
                            "color": "#999"
                        })
                        break;
                    case 'clientList':
                    case 'clientDetail':
                        $('#kjfs').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        $('#clientMana').addClass('active')
                        $('#More').find('a').css({
                            "color": "#999"
                        })
                        break;
                    case 'planList':
                    case 'planDetail':
                        $('#kjfs').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        $('#planMana').addClass('active')
                        $('#More').find('a').css({
                            "color": "#999"
                        })
                        break;
                    case 'photoGallery':
                    case 'ludanReport':
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
                    case 'accountList':
                    case 'createAccount':
                        $('#More').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        $('#accountMana').addClass('active')
                        $('#kjfs').find('a').css({
                            "color": "#999"
                        })
                        break;
                    case 'orderList':
                    case 'orderDetail':
                        $('#kjfs').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        $('#orderMana').addClass('active')
                        $('#More').find('a').css({
                            "color": "#999"
                        })
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
                    case 'ADlimitList':
                        $('#More').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        $('#ADlimit').addClass('active')
                        $('#kjfs').find('a').css({
                            "color": "#999"
                        })
                        break;
                    case 'ADqinlinzk':
                        $('#ADqinlinzk').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        $('#ADqinlinzk').addClass('active')
                        $('#kjfs').find('a').css({
                            "color": "#999"
                        })
                        break;
                    case 'dataAnalysis':
                        $('#dataAnalysis').css({
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
                    case 'questionAndAnswer':
                        $('#mes').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        $('#qna').addClass('active')
                        $('#More').find('a').css({
                            "color": "#999"
                        })
                        break;
                    case 'compact':
                        $('#mes').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        $('#compact').addClass('active')
                        break
                    case 'tvOrderList':
                    case 'tvOrderDetail':
                        $('#TVAdvertising').css({
                            "color": "#fff",
                            "border-bottom": "3px solid #fff"
                        }).parents().siblings().children('a').css({
                            "color": "#999",
                            "border-bottom": "none"
                        });
                        break;
                }
            },
            // 是否显示亲邻
            getIsShowQinlin(){
                let accountArr = [611,612,613,1,657,610,609,608,607,605,3,1151];
                let account = JSON.parse(sessionStorage.getItem('session_data')).uID;
                if(accountArr.includes(account)){
                    sessionStorage.setItem('AD_apid', -1);
                    sessionStorage.setItem('ctList_data', '100,31,38,1,6,8,11,14');
                    sessionStorage.setItem('aiTime', '2018-09-20 11:23:25');
                    this.showQinlin = true;
                }
            },
            // 是否显示公司管理
            getIsShowCom(){
                let sess = JSON.parse(sessionStorage.getItem('session_data'));
                if(sess.uType == 'SM' && sess.ascType == 0){
                    this.showCompany = true;
                }
            },
        },
        mounted: function () {
            this.getUserName();
            this.getIsShowCom();
            this.getIsShowQinlin();
            $(function () {
                // 	$('.ad_index_nav').children('li').click(function () {
                // 		$(this).children('a').css({
                // 			"color": "#fff",
                // 			"border-bottom": "3px solid #fff"
                // 		}).parents().siblings().children('a').css({
                // 			"color": "#999",
                // 			"border-bottom": "none"
                // 		});
                // 	});
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

    a.active {
        color: #ffffff !important;
    }

    .nav_fast em {
        display: inline-block;
        font-size: 15px;
        transform: rotateZ(90deg);
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
    .nav_fast .el-badge__content{
        padding: 0 3px 3px;
        border: none;
        height: 12px;
        line-height: 12px;
    }
    .ad_index_user_avator{
        width: 34px;
        height: 34px;
        border-radius: 50%;
        vertical-align: middle;
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

