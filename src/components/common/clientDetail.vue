<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav clearfix">
            <p>
                <a href="#">客户管理</a>
                <em> / </em>
                <a href="#">客户详情</a>
            </p>
        </div>

        <!--媒体信息-->
        <div class="ad_mediaInfo">
            <div class="ad_mediaInfo_head">
                <h2>客户详情</h2>
            </div>
            <div class="ad_mediaInfoPanel">
                <div class="clientInfo">
                    <h4>客户信息</h4>
                    <ul>
                        <li>
                            <em>联系人：</em>{{userInfo.realName}}</li>
                        <li>
                            <em>邮箱：</em>{{userInfo.email}}</li>
                        <li>
                            <em>手机号码：</em>{{userInfo.phone }}</li>
                        <li>
                            <em>账户名：</em>{{userInfo.sName}}</li>
                        <li>
                            <em>职位：</em>{{userInfo.position }}</li>
                        <li>
                            <em>固定电话：</em>{{userInfo.telephone }}</li>
                        <li>
                            <em>所在地：</em>{{userInfo.rName }}</li>
                        <li>
                            <em>事业部：</em>{{userInfo.division}}</li>
                        <li>
                            <em>所有人：</em>{{userInfo.puName}}</li>
                    </ul>
                </div>
                <div class="companyInfo">
                    <h4>公司信息</h4>
                    <ul>
                        <li>
                            <em>公司名称：</em>{{companyInfo.cName}}</li>
                        <li>
                            <em>公司地址：</em>{{companyInfo.cAddress}}</li>
                        <li>
                            <em>行业：</em>{{companyInfo.iName}}</li>
                        <li>
                            <em>公司品牌：</em>{{companyInfo.cBrand}}</li>
                        <li>
                            <em>所在城市：</em>{{companyInfo.rName}}</li>
                        <li>
                            <em>备注：</em>{{companyInfo.cRemark}}</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="content_bottom_btn">
            <el-button type="primary" @click="editClient" v-if="role=='BD'">编辑</el-button>
            <el-button @click="goBack">返回</el-button>
        </div>
    </div>
</template>

<script>
import api from "../../api/api.js";
// 区域转换成中文
import areaToText from "../../commonFun/areaToText_new.js";
// 行业转换为中文
import industryToText from "../../commonFun/industryToText.js";
import { Button } from "element-ui";
export default {
    name: "clientDetail",
    components: {
        elButton: Button
    },
    data() {
        return {
            // 登录信息
            sessionData:{},
            role: "",
            userInfo: {
                realName: "",
                email: "",
                phone: "",
                position: "",
                telephone: "",
                rName: "",
                division: "",
                puName: "",
                sName: ""
            },
            companyInfo: {
                cName: "",
                cAddress: "",
                cBrand: "",
                rName: "",
                cRemark: "",
                iName: ""
            }
        };
    },
    created() {
        this.getRole();
        this.getInitData();
    },
    methods: {
        // 获取角色
        getRole() {
            this.sessionData = JSON.parse(sessionStorage.getItem("session_data"));
            this.role = this.sessionData.uType;
            console.log(this.role);
        },
        // 返回
        goBack() {
            this.$router.push("./clientList");
        },
        // 获取公司的基本信息
        getInitData() {
            let info = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                customerId: sessionStorage.getItem('customerId')
            };
            api.getApi(this.Advertisement+'/GetCustomerInfo', info).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }else{
                    if(!res.data.SysCode){
                        let info = res.data;
                        let BInfo = {
                            cID: info.cID,
                            rID: info.crID,
                            cName: info.cName,
                            cAddress: info.cAddress,
                            cBrand: info.cBrand,
                            rName: info.rName,
                            cRemark: info.cRemark,
                            iID: info.iID,
                            iName: ""
                        };
                        let uInfo = {
                            uID: info.uID,
                            uWho: info.uWho,
                            rID: info.rID,
                            realName: info.realName,
                            email: info.email,
                            phone: info.phone,
                            position: info.position,
                            telephone: info.telephone,  
                            rName: "",
                            division: info.division,
                            puName: info.puName,
                            sName: info.sName,
                            joinTime: info.joinTime
                        };
                        if (info.rID) {
                            uInfo.rName = areaToText.toTextCity(uInfo.rID);
                        }
                        let arr = JSON.parse(sessionStorage.getItem("industry"));
                        // 行业中文
                        let text = industryToText.getText(BInfo.iID, arr);
                        // 公司信息所在行业
                        BInfo.iName = text;
                        this.companyInfo = BInfo;
                        this.userInfo = uInfo;
                    }
                }
            });
        },
        // 编辑信息
        editClient() {
            sessionStorage.setItem(
                "companyInfo",
                JSON.stringify(this.companyInfo)
            );
            this.$router.push("./editClient");
        },
        loginTimeout(){
            Message.warning("登录超时,请重新登录");
            this.$router.push("/login");
        },
    }
};
</script>

<style scoped>
/*面包屑导航*/
    .ad_mediaDetail_wrap {
        position: relative;
    }
    .ad_mediaDetail_nav{
        width: 92%;
        margin: 0 auto;
    }
    .ad_mediaDetail_nav p {
        position: absolute;
        left: 0;
        top: 12px;
        font-size: 14px;
        line-height: 18px;
    }

    .ad_mediaDetail_nav p a {
        color: #666;
    }

    .ad_mediaDetail_nav {
        height: 42px;
        position: relative;
    }

    /*wrap*/
    .mediaList_wrap {
        width: 92%;
        background: #ffffff;
        border: 1px solid #e6e7e9;
        margin: 0 auto;
    }

    .mediaList_wrap .mediaList_head {
        width: 100%;
        height: 24px;
        padding: 12px 0;
        border-bottom: 1px solid #e6e7e9;
    }

    .mediaList_wrap .mediaList_head h2 {
        font-size: 16px;
        color: #2c313c;
        height: 24px;

        padding-left: 14px;
        font-weight: bold;
    }

    .mediaList_wrap .mediaList_container {
        width: 98%;
        margin: 24px auto;
    }

/*客户信息*/
.ad_mediaInfo {
    width: 92%;
    margin: 0 auto;
    height: 346px;
    background: #ffffff;
    border: 1px solid #e6e7e9;
}

.ad_mediaInfo_head {
    width: 100%;
    padding: 12px 0;
    border-bottom: 1px solid #dedede;
}

.ad_mediaInfo_head h2 {
    font-size: 16px;
    color: #2c313c;
    font-weight: bold;
    padding-left: 16px;
    height: 24px;
    border-left: 2px solid #465d89;
}

.ad_mediaInfo .ad_mediaInfoPanel {
    padding: 18px 24px;
}

.ad_mediaInfo .ad_mediaInfoPanel h4 {
    font-size: 14px;
    color: #333333;
    font-weight: bold;
}

.ad_mediaInfo .ad_mediaInfoPanel ul.ml157 {
    margin-left: 20%;
}

.ad_mediaInfo .ad_mediaInfoPanel ul li {
    width: 33.2%;
    font-size: 14px;
    color: #666666;
    margin-top: 14px;
}

.clientInfo {
    margin-bottom: 24px;
    height: 130px;
}

.clientInfo,
.companyInfo {
    clear: both;
}

.clientInfo ul li,
.companyInfo ul li {
    float: left;
}

.ad_mediaInfoPanel ul li,
.remarkBox p {
    font-size: 14px;
}
.ad_mediaInfoPanel ul li em,
.remarkBox em {
    color: #333333;
}

/*按钮*/
/deep/ .el-button--default:focus,
.el-button--default:hover {
    color: #606266;
    border-color: #dcdfe6;
    background-color: #fcfcfc;
}
.content_bottom_btn {
    text-align: center;
    margin-top: 40px;
}
.content_bottom_btn /deep/ .el-button {
    width: 76px;
    height: 34px;
}

.content_bottom_btn /deep/ .el-button span {
    position: relative;
    top: -2px;
}
.content_bottom_btn /deep/ .el-button span a {
    color: #606266;
}

</style>


