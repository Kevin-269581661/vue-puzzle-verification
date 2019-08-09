<template>
    <div class="myInfo_box">
        <h4 class="myInfo_title">微信解绑</h4>
        <ul>
            <li class="wx_applet_li">
                小亲快选: 已绑定
                <span class="wx_applet_li_btn" @click="unbindFun">解绑</span>
            </li>
            <li class="wx_applet_li">
                亲邻小助手: 未绑定
                <span class="wx_applet_li_btn">解绑</span>
            </li>
        </ul>
    </div>
</template>

<script>
    import sessFun from "../../commonFun/sessFun.js";
    import api from "../../api/api.js";
    export default {
        name: "wxUnbind",
        data(){
            return {
                sessionData: '',
            }
        },
        mounted(){
            this.sessionData = sessFun.getSess();
            this.getwxBindInfo();
        },
        methods:{
            // 获取微信小程序绑定信息
            getwxBindInfo(){
                console.log('绑定信息')
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                }
                // api.getApi(this.apiVar.UCAPI + '/',params).then(res=>{
                //     console.log('账号与微信绑定信息',res)
                // })
            },
            // 微信小程序解绑
            unbindFun(){
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                }
            },
        },
    }
</script>

<style scoped>
    .myInfo_title{
        font-size:20px;
        font-weight:500;
        color:rgba(0,0,0,0.85);
        -ms-text-align-last: right;
        margin-bottom: 16px;
    }
    .wx_applet_li{
        font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,0.65);
        line-height:30px;
    }
    .wx_applet_li_btn{
        color:rgba(24,144,255,1);
        cursor: pointer;
        display: inline-block;
        text-indent: 12px;
    }
</style>
