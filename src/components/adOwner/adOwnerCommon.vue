<template>
    <div>
        <!--导航栏-->
        <el-menu
            router
            :default-active="$route.path"
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
            <el-menu-item index="/adOwner">首页</el-menu-item>
            <el-menu-item index="/adOwner/orderList">订单管理</el-menu-item>
            <el-submenu index="8" :show-timeout="80" v-show="showQinlin">
                <template slot="title">亲邻智邻</template>
                <el-menu-item index="/adOwner/communityPortrait">社区画像</el-menu-item>
                <el-menu-item index="/adOwner/communityRank">社区排名</el-menu-item>
            </el-submenu>
            <el-submenu index="9" class="user_center">
                <template slot="title">
                    <img class="user_avator" :src="avator" alt="">
                    {{userName}}
                </template>
                <el-menu-item index="/adOwner/myInfo">个人中心</el-menu-item>
                <!--<el-menu-item index="" @click.native="openWxBox = true">微信授权</el-menu-item>-->
                <el-menu-item index="/login">退出登陆</el-menu-item>
            </el-submenu>
        </el-menu>
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
                        <div :class="item.ReadState == 1 ?'readColor':''">{{item.apName}} 的用户画像申请
                            <span v-if="item.aiState == 1"><i style="color: #1890FF;font-style: normal">已通过</i></span>
                            <span v-if="item.aiState == 2"><i style="color: #ff7373;font-style: normal">被拒绝</i></span>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                <span slot="footer" class="dialog-footer"></span>
            </el-dialog>
        </div>
        <!--body-->
        <router-view></router-view>

        <!--尾部-->
        <div class="ad_index_footer clearfix">
            <p><img src="../../assets/images/home_icon.png" alt="">
                <router-link to="/adOwner"> 回到首页</router-link>
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
        name: "adOwnerCommon",
        data(){
            return{
                newDate: new Date().getFullYear(),
                userName: "",
                openWxBox: false,
                // 账号信息
                sessionData: "",
                avator: require('../../assets/images/index/headimg.png'),
                //消息
                showMessBox: false,
                activeMess: 'first',
                status: 1,
                orderArr: [],
                activeNames: [],
                num: [],
                messLen: 0,
                //
                showQinlin: false
            }
        },
        created(){

            this.getUserName()
            this.getInitData()
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
                    if (this.sessionData.uType !== "AD") {
                        this.$message({
                            type: "warning",
                            message: "权限异常,请重新登录"
                        });
                        this.$router.push("/login");
                    }
                    if(this.sessionData.uType == 'ADN_MD_COUNTRY'){
                        this.isNation = true
                    }
                } else {
                    this.$router.push("/login");
                }
                this.avator = this.sessionData.headPic || require('../../assets/images/index/headimg.png')
                let utype = this.sessionData.uType;
                this.userName = uTypeToText.toText(utype) + "-" + this.sessionData.realName;
            },
            // 路由切换
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
                // 退出登录
                if(key === '/login'){
                    sessionStorage.clear();
                }
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
                        } else {
                            sessFun.messageFun('warning',res.data.MSG)
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
                if (val.length !== 0) {
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
                                } else if (res.data.MSG == '失败') {
                                    sessFun.loginTimeout()
                                }
                            })
                        }
                    }
                }
            },
            // 时间格式规范
            formatTime(val) {
                if (val) {
                    return dateFormat.timestampFormat(val);
                }
            },
        },
        watch: {
            messLen(newVal, oldVal) {
                console.log('消息长度--', newVal, oldVal);
                this.messLen = newVal
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
        right: 145px;
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
</style>
