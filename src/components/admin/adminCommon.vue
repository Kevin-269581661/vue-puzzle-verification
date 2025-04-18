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

            <el-menu-item index="/admin">账号管理</el-menu-item>

            <el-menu-item index="/admin/companyList">公司管理</el-menu-item>

            <el-menu-item index="/admin/mediaList">媒体管理</el-menu-item>

            <!--<el-menu-item index="/admin/SMqinlinzk">亲邻智邻</el-menu-item>-->
            <!--<el-menu-item index="/admin/communityPortrait" v-show="showQinlin">亲邻智邻</el-menu-item>-->

            <el-submenu index="8" :show-timeout="80" v-show="showQinlin">
                <template slot="title">亲邻智邻</template>
                <el-menu-item index="/admin/communityPortrait">社区画像</el-menu-item>
                <el-menu-item index="/admin/communityRank">社区排名</el-menu-item>
            </el-submenu>

            <el-submenu index="7" :show-timeout="80" popper-class="submenu">
                <template slot="title">系统管理</template>
                <el-menu-item index="/admin/ADlimitList">广告限制</el-menu-item>
                <el-menu-item index="/admin/notice">公告通知</el-menu-item>
                <el-menu-item index="/admin/mediaType">媒体类型</el-menu-item>
            </el-submenu>

            <el-submenu index="6" class="user_center" popper-class="user_center_item" :show-timeout="80">
                <template slot="title">
                    <img class="user_avator" :src="avator" alt="">
                    {{userName}}
                </template>
                <el-menu-item index="/admin/myInfo">个人中心</el-menu-item>
                <el-menu-item index="/login">退出登录</el-menu-item>
            </el-submenu>
        </el-menu>

        <!--body-->
        <router-view></router-view>

        <!--尾部-->
        <div class="ad_index_footer clearfix">
            <p>
                深圳市亲邻科技有限公司 版权所有 <a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备15007183号</a>
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

        <!-- 检测绑定微信登录-弹框组件 -->
        <CheckBindWxDialog />
    </div>
</template>

<script>
    import uTypeToText from "../../commonFun/uTypeToText.js";
    import sessFun from '../../commonFun/sessFun.js';
    import api from "../../api/api"
    import CheckBindWxDialog from '@/components/common/components/checkBindWxDialog.vue'

    export default {
        name: "adminCommon",
        components:{
            CheckBindWxDialog
        },
        data(){
            return{
                newDate: new Date().getFullYear(),
                userName: "",
                openWxBox: false,
                // 媒介账号信息
                sessionData: "",
                avator: require('../../assets/images/index/headimg.png'),
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
                this.sessionData = sessFun.getSess();
                if (this.sessionData !== null && this.sessionData !== undefined) {
                    if (this.sessionData.uType !== 'ADN_SA') {
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
                // console.log(val, 'isActive', this.$route.path)
                let path = this.$route.path
                let routePath = ''
                if (path.includes('/createAccount')) {
                    routePath = '/admin/accountList'
                } else if(path.includes('/mediaDetail')){
                    routePath = '/admin/mediaList'
                } else {
                    routePath = path
                }
                return  routePath
            },
        }
    }
</script>

<style scoped>
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
