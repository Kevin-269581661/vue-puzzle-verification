<template>
    <div class="myInfo_box">
        <h4 class="myInfo_title">微信解绑</h4>
        <ul>
            <li class="wx_applet_li">
                小亲快选: {{wxBindData.BD ? '已绑定' : '未绑定'}}
                <span class="wx_applet_li_btn" @click="unbindFun('1')" v-show="wxBindData.BD">解绑</span>
            </li>
            <li class="wx_applet_li">
                亲邻小助手: {{wxBindData.EP ? '已绑定' : '未绑定'}}
                <span class="wx_applet_li_btn" @click="unbindFun('0')" v-show="wxBindData.EP">解绑</span>
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
                wxBindData: {
                    BD: false,
                    EP: false,
                },
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
                api.getApi(this.apiVar.UCAPI + '/GetWeChatBindInfo',params).then(res=>{
                    console.log('账号与微信绑定信息',res)
                    if (res.data.SysCode == 200200) {
                        // 0-小助手，1-移动端选点
                        let resData = res.data.data
                        if (resData.length) {
                            resData.includes(1) ? this.wxBindData.BD = true : this.wxBindData.BD = false
                            resData.includes(0) ? this.wxBindData.EP = true : this.wxBindData.EP = false
                        } else {
                            this.wxBindData.BD = false
                            this.wxBindData.EP = false
                        }
                    } else {
                        sessFun.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 小程序要解绑的类型，0-小助手，1-移动端选点
            unbindFun(val){
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    type: val
                }
                console.log('解绑参数',params)
                api.getApi(this.apiVar.UCAPI + '/UnbindUser', params).then(res => {
                    console.log('账号与微信绑定信息', res)
                    if (res.data.SysCode == 200200) {
                        sessFun.messageFun('success', '解绑成功')
                        if (val == '0') {
                            this.wxBindData.EP = false
                        } else if (val == '1') {
                            this.wxBindData.BD = false
                        }
                    } else {
                        sessFun.messageFun('warning', res.data.MSG)
                    }
                })
            },
        },
    }
</script>

<style scoped>
    .myInfo_title{
        font-size:20px;
        font-weight:600;
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
