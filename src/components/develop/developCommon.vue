<template>
    <div>
        <!--导航栏-->
        <el-menu
            router
            :default-active="isActive"
            class="el-menu-nav"
            mode="horizontal"
            @select="handleSelect"
            background-color="#fff"
            active-text-color="#1890FF">
            <el-menu-item index="">
                <div class="logo_box">
                    <img src="../../assets/images/logo.png" alt="">
                </div>
            </el-menu-item>
            <el-menu-item index="/f_develop">首页</el-menu-item>
            <el-submenu index="3" :show-timeout="80">
                <template slot="title">合同管理</template>
                <el-menu-item index="/f_develop/newConstract">新建合同</el-menu-item>
                <el-menu-item index="/f_develop/constractCfg">合同设置</el-menu-item>
            </el-submenu>
            <el-menu-item index="/f_develop/mediaList">媒体管理</el-menu-item>
            <el-menu-item class="no-hover" index="" style="cursor: default;float: right;padding: 0 0 0 4px">
                <messageNotice></messageNotice>
            </el-menu-item>
            <el-submenu index="6" class="user_center" popper-class="user_center_item" :show-timeout="80">
                <template slot="title">
                    <img class="user_avator" :src="avator" alt="">
                    {{userName}}
                </template>
                <el-menu-item index="/f_develop/myInfo">个人中心</el-menu-item>
                <el-menu-item index="/login">退出登陆</el-menu-item>
            </el-submenu>
        </el-menu>

        <!--body-->
        <router-view></router-view>

        <!--尾部-->
        <div class="ad_index_footer clearfix">
            <p><img src="../../assets/images/home_icon.png" alt="">
                <router-link to="/f_develop"> 回到首页</router-link>
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
    import messageNotice from '../common/components/messageNotice.vue';
    import uTypeToText from "../../commonFun/uTypeToText.js";
    import sessFun from '../../commonFun/sessFun.js';
    import api from "../../api/api"
    export default {
        name: "developCommon",
        components: {
            messageNotice
        },
        data(){
            return{
                newDate: new Date().getFullYear(),
                userName: "",
                openWxBox: false,
                // 账号信息
                sessionData: "",
                avator: require('../../assets/images/index/headimg.png'),
            }
        },
        created(){
            this.getUserName()
        },
        mounted(){
        },
        methods:{
            // 获取用户名称和角色
            getUserName() {
                this.sessionData = sessFun.getSess();
                if (this.sessionData !== null && this.sessionData !== undefined) {
                    if (this.sessionData.uType != 'DEV') {
                        this.$message({
                            type: 'warning',
                            message: '权限异常,请重新登录'
                        })
                        this.$router.push('/login')
                    }
                } else {
                    this.$router.push('/login')
                }
                let utype = this.sessionData.uType
                this.userName = uTypeToText.toText(utype) + '-' + this.sessionData.realName;
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
        },
        computed:{
            isActive(val) {
                console.log(val, 'isActive', this.$route.path)
                let path = this.$route.path
                let routePath = ''
                if (path.includes('/createAccount')) {
                    // routePath = '/admin/accountList'
                } else if(path.includes('/mediaDetail')){
                    // routePath = '/admin/mediaList'
                } else {
                    routePath = path
                }
                return  routePath
            },
        }
    }
</script>

<style lang="scss" scoped>
    .logo_box{
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 16px 0 42px;
    }
    .logo_box img {
        width: 103px;
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
