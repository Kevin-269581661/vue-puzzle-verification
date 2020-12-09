<template>
    <div id="app">
        <!--导航栏-->
        <el-menu
            router
            :default-active="isActive"
            class="el-menu-nav"
            mode="horizontal"
            @select="handleSelect"
            background-color="#fff"
            active-text-color="#1890FF">
            <el-menu-item index="" class="no-hover" style="cursor: default">
                <div class="logo_box">
                    <img src="../../assets/images/logo.png" alt="">
                </div>
            </el-menu-item>
            <el-menu-item index="/media">首页</el-menu-item>

            <el-submenu index="6" :show-timeout="80" popper-class="submenu">
                <template slot="title">媒体管理</template>
                <el-menu-item index="/media/mediaList">媒体列表</el-menu-item>
                <el-menu-item index="/media/maintainList">媒体维护</el-menu-item>
                <!--<el-menu-item index="/media/adsDialPlate" v-if="!isNation">点位表盘</el-menu-item>-->
            </el-submenu>
            <el-menu-item v-if="isNation" index="/media/planList">方案管理</el-menu-item>
            <el-submenu v-if="!isNation" index="5" :show-timeout="80" popper-class="submenu">
                <template slot="title">方案管理</template>
                <el-menu-item index="/media/planList">方案列表</el-menu-item>
                <el-menu-item index="/media/adsDialPlate">点位表盘</el-menu-item>
            </el-submenu>
            <el-menu-item index="/media/orderList">订单管理</el-menu-item>
            <!--<el-menu-item index="/media/projectList">工程管理</el-menu-item>-->
            <el-submenu index="7" :show-timeout="80" popper-class="submenu">
                <template slot="title">工程管理</template>
                <el-menu-item index="/media/projectList">上画任务</el-menu-item>
                <el-menu-item index="/media/paintedCount">上画统计</el-menu-item>
                <el-menu-item index="/media/paintedPath" v-if="!isNation">线路管理</el-menu-item>
            </el-submenu>
            <el-menu-item index="/media/photoGallery">图片库</el-menu-item>
            <el-submenu index="10" :show-timeout="80" v-show="showQinlin" popper-class="submenu">
                <template slot="title">亲邻智邻</template>
                <el-menu-item index="/media/communityPortrait">社区画像</el-menu-item>
                <el-menu-item index="/media/communityRank">社区排名</el-menu-item>
                <el-menu-item index="" @click="goResContrastMap">资源对比</el-menu-item>
            </el-submenu>
            <el-submenu index="8" :show-timeout="80" popper-class="submenu two-word-submenu">
                <template slot="title">
                    更多
                </template>
                <el-menu-item index="/media/publishPriceList">刊例价</el-menu-item>
                <el-menu-item index="/media/compact">资料下载</el-menu-item>
            </el-submenu>
            <!--<el-menu-item index="/media/communityPortrait" v-show="showQinlin">亲邻智邻</el-menu-item>-->

            <el-submenu index="9" class="user_center" popper-class="user_center_item submenu" :show-timeout="80">
                <template slot="title">
                    <img class="user_avator" :src="avator" alt="">
                    {{userName}}
                </template>
                <span class="my-balance">余额：¥0.00</span>
                <el-menu-item index="/media/myInfo" class="index-menu-item">个人中心</el-menu-item>
                <!--<el-menu-item index="" @click.native="openWxBox = true">微信授权</el-menu-item>-->
                <el-menu-item index="/login" class="index-menu-item">退出登陆</el-menu-item>
            </el-submenu>
            <el-menu-item class="no-hover" index="" style="cursor: default;float: right;padding: 0 0 0 4px">
                <messageNotice></messageNotice>
            </el-menu-item>
            <el-menu-item class="no-hover" index="" style="cursor: default;float: right;padding: 0 10px 0 10px;">
                <questionTip></questionTip>
            </el-menu-item>
        </el-menu>

        <!--body-->
        <router-view></router-view>

        <!--尾部-->
        <div class="ad_index_footer clearfix">
            <p><img src="../../assets/images/home_icon.png" alt="">
                <router-link to="/media"> 回到首页</router-link>
                | Copyright &copy;{{newDate}} 亲邻科技线上产品部
            </p>
        </div>
        <!--扫码授权-->
        <el-dialog title="微信授权" :visible.sync="openWxBox" width="30%">
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
    </div>
</template>

<script>
    import uTypeToText from "../../commonFun/uTypeToText.js";
    import api from "../../api/api"
    import messageNotice from '../common/components/messageNotice.vue';
    import questionTip from '../common/components/questionTip.vue';

    export default {
        name: "mediaCommon",
        components: {
            messageNotice,
            questionTip
        },
        data() {
            return {
                newDate: new Date().getFullYear(),
                userName: "",
                openWxBox: false,
                // 媒介账号信息
                sessionData: "",
                avator: require('../../assets/images/index/headimg.png'),
                // 是否为全国权限
                isNation: false,
                //
                showQinlin: false,
            }
        },
        created() {
            this.getUserName()
        },
        mounted() {
            // 是否显示社区画像
            this.getIsShowQinlin();
        },
        methods: {
            // 是否显示亲邻
            getIsShowQinlin() {
                let portraitInfo = JSON.parse(sessionStorage.getItem('portraitInfo'))
                if (portraitInfo && portraitInfo.length) {
                    this.showQinlin = true;
                } else {
                    let params = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token
                    }
                    api.getApi(this.apiVar.portrait + 'ascrInfo/getAscrList', params).then(res => {
                        console.log('用户权限城市和默认小区res', res)
                        if (res.data.SysCode === 200200) {
                            let portraitInfo = res.data.data
                            sessionStorage.setItem("portraitInfo", JSON.stringify(portraitInfo));
                            if (portraitInfo.length) {
                                this.showQinlin = true;
                            } else {
                                this.showQinlin = false;
                            }
                        } else {
                            this.showQinlin = false;
                        }
                    })
                }


            },
            // 获取用户名称和角色
            getUserName() {
                this.sessionData = JSON.parse(sessionStorage.getItem("session_data"));
                if (this.sessionData !== null && this.sessionData !== undefined) {
                    if (this.sessionData.uType !== "MD") {
                        this.$message({
                            type: "warning",
                            message: "权限异常,请重新登录"
                        });
                        this.$router.push("/login");
                    }
                    if (this.sessionData.mediaManageLevel == 1) {
                        this.isNation = true
                    }
                } else {
                    this.$router.push("/login");
                }
                this.avator = this.sessionData.headPic || require('../../assets/images/index/headimg.png')
                let utype = this.sessionData.uType;
                this.userName = uTypeToText.toText(utype) + "-" + this.sessionData.realName;
                console.log(this.userName);
            },
            // 路由切换
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
                // 退出登录
                if (key === '/login') {
                    sessionStorage.clear();
                }
            },
            goResContrastMap(){
                const {href} = this.$router.resolve({
                    path: '/resContrastMap',
                })
                window.open(href, '_blank')
            }
        },
        computed: {
            isActive(val) {
                // console.log(val, 'isActive', this.$route.path)
                let path = this.$route.path
                let routePath = ''
                if (path.includes('/mediaDetail') || path.includes('/mediaEdit') || path.includes('/mediaInput')) {
                    // 媒体管理
                    routePath = '/media/mediaList'
                } else if (path.includes('/editPlan') || path.includes('/planDetail') || path.includes('/createPlan')) {
                    // 方案管理
                    routePath = '/media/planList'
                } else if (path.includes('/orderDetail')) {
                    // 订单管理
                    routePath = '/media/orderList'
                } else if (path.includes('/projectDetail') ) {
                    // 工程管理
                    routePath = '/media/projectList'
                } else {
                    routePath = path
                }
                return routePath
            },
        }
    }
</script>

<style scoped>
    .my-balance {
        display: block;
        width: calc(100% - 24px);
        padding: 5px 12px 0;
        text-align: left;
        color: rgba(0, 0, 0, 0.85); 
        font-size: 14px; 
        line-height: 18px;
    }
    .my-balance::after {
        display: block;
        content: '';
        height: 1px;
        margin: 10px 0 2px;
        background: #F1F1F1;
    }
    .index-menu-item {
        text-align: left;
    }
    .logo_box {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 16px 0 32px;
    }
    .logo_box img {
        width: 103px;
    }

    /*用户中心*/
    /deep/ .el-menu--horizontal > .el-submenu.user_center {
        float: right;
    }

    .user_center /deep/ .el-submenu__title {
        font-size: 14px;
    }

    /*头像*/
    .user_avator {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        vertical-align: middle;
    }
</style>
