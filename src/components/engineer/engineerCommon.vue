<template>
    <div>
        <!--导航栏-->
        <el-menu
            router
            :default-active="$route.path"
            class="el-menu-nav"
            mode="horizontal"
            @select="handleSelect"
            background-color="#444"
            text-color="#999999"
            active-text-color="#fff">
            <el-menu-item index="" class="no-hover">
                <div class="logo_box">
                    <img src="../../assets/images/logo.png" alt="">
                </div>
            </el-menu-item>
            <el-menu-item index="/engineer">首页</el-menu-item>
            <el-submenu index="9" class="user_center" :show-timeout="80">
                <template slot="title">
                    <img class="user_avator" :src="avator" alt="">
                    {{userName}}
                </template>
                <el-menu-item index="/engineer/myInfo">个人中心</el-menu-item>
                <!--<el-menu-item index="" @click.native="openWxBox = true">微信授权</el-menu-item>-->
                <el-menu-item index="/login">退出登陆</el-menu-item>
            </el-submenu>
            <el-menu-item class="no-hover" index="" style="cursor: default;float: right;padding: 0 10px 0 0">
                <questionTip></questionTip>
            </el-menu-item>
        </el-menu>

        <!--body-->
        <router-view></router-view>

        <!--尾部-->
        <div class="ad_index_footer clearfix">
            <p><img src="../../assets/images/home_icon.png" alt="">
                <router-link to="/engineer"> 回到首页</router-link>
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
    import uTypeToText from '../../commonFun/uTypeToText.js'
    import sessFun from '../../commonFun/sessFun.js';
    import api from "../../api/api"
    import questionTip from '../common/components/questionTip.vue';
    export default {
        name: "engineerCommon",
        components: {
            questionTip
        },
        data(){
            return{
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
        created(){
            this.getUserName()
        },
        mounted(){
            // 是否显示社区画像
            this.getIsShowQinlin();
        },
        methods:{
            // 是否显示亲邻
            getIsShowQinlin(){
                let portraitInfo = JSON.parse(sessionStorage.getItem('portraitInfo'))
                if (portraitInfo && portraitInfo.length) {
                    this.showQinlin = true;
                } else {
                    let params = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token
                    }
                    api.getApi(this.apiVar.portrait + 'ascrInfo/getAscrList', params).then(res => {
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
                this.sessionData = sessFun.getSess();
                console.log("this.sessionData", this.sessionData);
                if (this.sessionData !== null && this.sessionData !== undefined) {
                    if (this.sessionData.uType !== "EP") {
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
                let utype =  this.sessionData.uType;
                this.userName = uTypeToText.toText(utype) + '-' +  this.sessionData.realName;
                console.log(this.userName)
            },
            // 路由切换
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
                // 退出登录
                if(key === '/login'){
                    sessionStorage.clear();
                }
            },
            goResContrastMap(){
                const {href} = this.$router.resolve({
                    path: '/resContrastMap',
                })
                window.open(href, '_blank')
            }
        }
    }
</script>

<style scoped>
    .logo_box{
        margin: 0 16px 0 42px;
    }
    /*用户中心*/
    /deep/.el-menu--horizontal>.el-submenu.user_center{
        float: right;
    }
    .user_center /deep/ .el-submenu__title{
        font-size: 14px;
    }
    /*头像*/
    .user_avator{
        width: 34px;
        height: 34px;
        border-radius: 50%;
        vertical-align: middle;
    }
</style>
