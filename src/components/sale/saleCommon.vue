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
            <el-menu-item index="">
                <div class="logo_box">
                    <img src="../../assets/images/logo.png" alt="">
                </div>
            </el-menu-item>
            <el-menu-item index="/sale">首页</el-menu-item>
            <el-menu-item index="/sale/clientList">客户管理</el-menu-item>
            <el-menu-item index="/sale/planList">方案管理</el-menu-item>
            <el-menu-item index="/sale/orderList">订单管理</el-menu-item>
            <el-menu-item index="/sale/photoGallery">案例库</el-menu-item>
            <el-submenu index="8">
                <template slot="title">
                    辅助资料
                </template>
                <el-menu-item index="/sale/publishPriceList">刊例价</el-menu-item>
                <el-menu-item index="/sale/questionAndAnswer">操作说明</el-menu-item>
                <el-menu-item index="/sale/compact">文件下载</el-menu-item>
            </el-submenu>
            <el-menu-item index="/sale/tvOrderList">电视广告</el-menu-item>
            <el-submenu index="9" class="user_center">
                <template slot="title">
                    <img class="user_avator" :src="avator" alt="">
                    {{userName}}
                </template>
                <el-menu-item index="/sale/myInfo">个人中心</el-menu-item>
                <!--<el-menu-item index="" @click.native="openWxBox = true">微信授权</el-menu-item>-->
                <el-menu-item index="/login">退出登陆</el-menu-item>
            </el-submenu>
        </el-menu>
        <!--body-->
        <router-view></router-view>

        <!--尾部-->
        <div class="ad_index_footer clearfix">
            <p><img src="../../assets/images/home_icon.png" alt="">
                <router-link to="/sale"> 回到首页</router-link>
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
    export default {
        name: "saleCommon",
        data(){
            return{
                newDate: new Date().getFullYear(),
                userName: "",
                openWxBox: false,
                // 账号信息
                sessionData: "",
                avator: require('../../assets/images/index/headimg.png'),
                // 是否为全国权限
                isNation: false,
            }
        },
        created(){
            this.getUserName()
        },
        mounted(){
            this.getIsShowQinlin();
        },
        methods:{
            // 获取用户名称和角色
            getUserName() {
                this.sessionData = JSON.parse(sessionStorage.getItem('session_data'))
                if (this.sessionData !== null && this.sessionData !== undefined) {
                    if (this.sessionData.uType !== 'BD') {
                        this.$message({
                            type: 'warning',
                            message: '权限异常,请重新登录'
                        })
                        this.$router.push('/login')
                    }
                } else {
                    this.$router.push('/login')
                }
                this.avator = this.sessionData.headPic || require('../../assets/images/index/headimg.png')
                let utype = this.sessionData.uType;
                this.userName = uTypeToText.toText(utype) + '-' + this.sessionData.realName;
                console.log(this.userName)
            },
            // 是否显示亲邻
            getIsShowQinlin(){
                // let accountArr = [611,612,613,1,657,610,609,608,607,605,3,1151];
                // let accountArr = [110100,310100,440100,440300,500100,510100,0];
                let companyList = ['999','1','2','3','4','5','6','7']
                let account = this.sessionData.asrID;
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
            // 路由切换
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
                // 退出登录
                if(key === '/login'){
                    sessionStorage.clear();
                }
            },
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
    .wx-authority {
        text-align: center;
    }
</style>
