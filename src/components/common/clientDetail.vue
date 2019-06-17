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
        <div class="mediaList_wrap">
            <div class="mediaList_head">
                <h2>客户详情</h2>
            </div>
            <div class="mediaList_handel">
                <div class="clientInfo">
                    <h4>客户信息</h4>
                    <ul>
                        <li>
                            <em>联系人：</em>{{userInfo.realName || '--'}}</li>
                        <li>
                            <em>邮箱：</em>{{userInfo.email || '--'}}</li>
                        <li>
                            <em>手机号码：</em>{{userInfo.phone || '--'}}</li>
                        <li>
                            <em>账户名：</em>{{userInfo.sName || '--'}}</li>
                        <li>
                            <em>职位：</em>{{userInfo.position || '--'}}</li>
                        <li>
                            <em>固定电话：</em>{{userInfo.telephone || '--'}}</li>
                        <li>
                            <em>所在地：</em>{{userInfo.rName || '--'}}</li>
                        <li>
                            <em>事业部：</em>{{userInfo.division || '--'}}</li>
                        <li>
                            <em>所有人：</em>{{userInfo.puName || '--'}}</li>
                    </ul>
                </div>
                <div class="companyInfo">
                    <h4>公司信息</h4>
                    <ul>
                        <li>
                            <em>公司名称：</em>{{companyInfo.cName || '--'}}</li>
                        <li>
                            <em>公司地址：</em>{{companyInfo.cAddress || '--'}}</li>
                        <li>
                            <em>行业：</em>{{companyInfo.iName || '--'}}</li>
                        <li>
                            <em>公司品牌：</em>{{companyInfo.cBrand || '--'}}</li>
                        <li>
                            <em>所在城市：</em>{{companyInfo.rName || '--'}}</li>
                        <li>
                            <em>备注：</em>{{companyInfo.cRemark || '--'}}</li>
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
import sessFun from "../../commonFun/sessFun.js";
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
            this.sessionData = sessFun.getSess();
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
            api.getApi(this.apiVar.Advertisement+'/GetCustomerInfo', info).then(res =>{
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
/*客户信息*/
.mediaList_wrap {
    width: 92%;
    margin: 0 auto;
    height: 346px;
    background: #ffffff;
    border: 1px solid #e6e7e9;
}

.mediaList_head {
    width: 100%;
    padding: 12px 0;
    border-bottom: 1px solid #dedede;
}

.mediaList_head h2 {
    font-size: 16px;
    color: #2c313c;
    font-weight: bold;
    padding-left: 16px;
    height: 24px;
    border-left: 2px solid #465d89;
}

.mediaList_handel {
    padding: 18px 24px;
}

.mediaList_handel h4 {
    font-size: 14px;
    color: #333333;
    font-weight: bold;
}

.mediaList_handel ul li {
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

.mediaList_handel ul li,
.remarkBox p {
    font-size: 14px;
}
.mediaList_handel ul li em,
.remarkBox em {
    color: #333333;
}

/*按钮*/
.content_bottom_btn {
    text-align: center;
    margin-top: 40px;
}
</style>


