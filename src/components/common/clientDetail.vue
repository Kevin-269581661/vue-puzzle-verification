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
                <h4>客户信息</h4>
                <el-row class="row_box">
                    <el-col :span="8">
                        <span class="row_title">联系人：</span><span>{{userInfo.realName || '--'}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="row_title">邮箱：</span><span>{{userInfo.email || '--'}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="row_title">手机号码：</span><span>{{userInfo.phone || '--'}}</span>
                    </el-col>
                </el-row>
                <el-row class="row_box">
                    <el-col :span="8">
                        <span class="row_title">账户名：</span><span>{{userInfo.sName || '--'}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="row_title">职位：</span><span>{{userInfo.position || '--'}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="row_title">固定电话：</span><span>{{userInfo.telephone || '--'}}</span>
                    </el-col>
                </el-row>
                <el-row class="row_box">
                    <el-col :span="8">
                        <span class="row_title">所在地：</span><span>{{userInfo.rName || '--'}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="row_title">事业部：</span><span>{{userInfo.division || '--'}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="row_title">所有人：</span><span>{{userInfo.puName || '--'}}</span>
                    </el-col>
                </el-row>
            </div>
            <div class="mediaList_handel">
                <h4>公司信息</h4>
                <el-row class="row_box">
                    <el-col :span="8">
                        <span class="row_title">公司名称：</span><span>{{companyInfo.cName || '--'}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="row_title">公司地址：</span><span>{{companyInfo.cAddress || '--'}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="row_title">行业：</span><span>{{companyInfo.iName || '--'}}</span>
                    </el-col>
                </el-row>
                <el-row class="row_box">
                    <el-col :span="8">
                        <span class="row_title">公司品牌：</span><span>{{companyInfo.cBrand || '--'}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="row_title">所在城市：</span><span>{{companyInfo.rName || '--'}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="row_title">备注：</span><span>{{companyInfo.cRemark || '--'}}</span>
                    </el-col>
                </el-row>
            </div>
        </div>

        <div class="content_bottom_btn">
            <el-button type="primary" @click="editClient" v-if="role=='BD'" >编辑</el-button>
            <el-button plain @click="goBack" >返回</el-button>
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
    }
};
</script>

<style scoped>
.mediaList_handel {
    margin: 24px 32px;
    border-left: 1px solid rgb(245,246,250);
    border-right: 1px solid rgb(245,246,250);
    border-bottom: 1px solid rgb(245,246,250);
    font-size: 14px;
}

.mediaList_handel h4 {
    font-size: 16px;
    color: #333333;
    font-weight:600;
    padding-left: 16px;
    height: 42px;
    line-height: 42px;
    background:rgba(245,246,250,1);
}

.mediaList_handel span{
    color: #666666;
}
.row_box{
    margin: 16px 0;
    padding-left: 16px;
}
.mediaList_handel .row_title{
    color: #333333;
}
/*按钮*/
.content_bottom_btn {
    text-align: center;
    margin-top: 40px;
}
</style>


