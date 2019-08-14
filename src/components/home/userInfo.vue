<template>
	<div class="myInfo_box">
		<h4>基本资料</h4>
		<div class="userInfo_box">
            <div class="info_left">
                <img :src="userInfo.data.url" alt="" class="img_box">
                <!-- <el-button size="small" style="margin-top: 5px;">更换头像</el-button> -->
                <el-upload
                    :action="uploadUrl"
                    :http-request="uploadImg"
                    :on-preview="handlePreview"
                    :before-upload="beforeAvatarUpload"
                    :show-file-list="false">
                    <el-button plain size="small" type="default" style="margin-top: 5px;">更换头像</el-button>
                </el-upload>
            </div>
            <div class="info_right">
                <el-row>
                    <el-col :span="8">
                        <span>{{userInfo.title.account ||"--"}}</span>
                        <span>{{userInfo.data.account ||"--"}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span>{{userInfo.title.dep ||"--"}}</span>
                        <span>{{userInfo.data.dep ||"--"}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span>{{userInfo.title.company ||"--"}}</span>
                        <span>{{userInfo.data.company ||"--"}}</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <span>{{userInfo.title.username ||"--"}}</span>
                        <span>{{userInfo.data.username ||"--"}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span>{{userInfo.title.super ||"--"}}</span>
                        <span>{{userInfo.data.super ||"--"}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span>{{userInfo.title.phone ||"--"}}</span>
                        <span>{{userInfo.data.phone ||"--"}}</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <span>{{userInfo.title.role ||"--"}}</span>
                        <span>{{userInfo.data.role ||"--"}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span>{{userInfo.title.duty ||"--"}}</span>
                        <span>{{userInfo.data.duty ||"--"}}</span>
                    </el-col>
                    <el-col :span="8">
                        <span>{{userInfo.title.email ||"--"}}</span
                        >
                        <span>{{userInfo.data.email ||"--"}}</span>
                    </el-col>
                </el-row>
            </div>
		</div>
	</div>
</template>

<script>
import api from "../../api/api.js";
import { Message } from 'element-ui';
import sessFun from "../../commonFun/sessFun.js";

export default {
    name: "userInfo",
    data() {
        return {
            sessionData: '',
            uploadUrl: '/apiVar.UCAPI/UpdateUserInfo',
            // uploadUrl: 'http://beta.qinlinad.com/apiVar.UCAPI/UpdateUserInfo',
            fileData:{
                uid: '',
                token: '',
            },
            userInfo:{
                title: {
                    account: '账号:',
                    dep: '部门:',
                    company: '所在公司:',
                    username: '姓名:',
                    super: '上级:',
                    phone: '手机:',
                    role: '角色:',
                    duty: '职务:',
                    email: '邮箱地址:',
                    url: '头像链接:',
                },
                data:{
                    account: 'xiongpeisha',
                    dep: '销售部',
                    company: '亲邻科技有限公司',
                    username: '熊佩莎',
                    super: '曾俊超',
                    phone: '13631275100',
                    role: '销售',
                    duty: '销售总监',
                    email: 'xiongpeisha@qinlinkeji.com',
                    url: require('../../assets/images/alreadyLock.png'),
                }
            },
        };
    },
    created(){
        this.getSess();
        this.getUserInfo();
    },
    methods: {
        getSess(){
            this.sessionData = sessFun.getSess();
            this.fileData = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
            };
            this.uploadUrl = this.uploadUrl+'?uid='+this.sessionData.uID+'&token='+this.sessionData.token;
        },
        // 获取用户信息
        getUserInfo(){
            let sess = this.sessionData;
            let info = {
                uid: sess.uID,
                token: sess.token,
                userId: sess.uID
            };
            api.postApi(this.apiVar.UCAPI+'/GetUser', info).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 200200){
                    let result = res.data.data;
                    let userinfo = this.setData(result);
                    this.userInfo.data = userinfo;
                }else if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }else{
                    Message.warning(res.data.MSG);
                }
            }).catch(err =>{
                console.log(err);
            });
        },
        // 上传
        uploadImg(item){
            let formData = new FormData();
            formData.append('headPic', item.file);
            let sess = this.sessionData;
            api.postUpload_file(this.apiVar.UCAPI+'/UpdateUserInfo?uid='+sess.uID+'&token='+sess.token, formData).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 400200){
                    let result = res.data.data;
                    let userinfo = this.setData(result);
                    this.userInfo.data = userinfo;
                    this.sessionData.headPic = userinfo.url;
                    sessionStorage.setItem('session_data', JSON.stringify(this.sessionData));
                    this.$router.go(0);
                }else if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }else{
                    Message.warning(res.data.MSG);
                }
            });
        },
        // 数据格式化
        setData(result){
            let obj = {
                uID: result.uID,
                account: result.sName,
                dep: result.division ? result.division : "",
                username: result.realName,
                super: result.puName ? result.puName : "",
                phone: result.phone,
                role: result.uType,
                duty: result.position ? result.position : "",
                email: result.email ? result.email : "",
                company: result.asName ? result.asName : "",
                url: result.headPic ? result.headPic : require('../../assets/images/index/niu.png')
            };
            return obj;
        },
        // 限制只能上传png,jpeg格式的照片
        beforeAvatarUpload(file) {
            const isIMAGE = file.type === "image/jpeg" || file.type === "image/png";
            const isLt1M = file.size / 1024 / 1024 < 8;

            if (!isIMAGE) {
                Message.error("只能上传jpg/png图片!");
            }
            if (!isLt1M) {
                Message.error("上传文件大小不能超过 8MB!");
            }
            return isIMAGE&&isLt1M;
        },
        handlePreview(file) {
            console.log(file);
        },
        loginTimeout() {
			Message.warning("登录超时,请重新登录");
			this.$router.push("/login");
		},
    }
};
</script>

<style scoped>
h4 {
    font-size: 20px;
    color: #000;
    width: 100%;
    font-weight:600;
    text-align: left;
}
.userInfo_box{
    display: flex;
    margin-top: 20px;
}
.info_left{
    flex: 1;
}
.info_right{
    flex: 4;
    text-align: left;
}
/deep/ .info_right .el-row{
    line-height: 32px;
}
/deep/ .info_right .el-row span{
    font-size: 14px;
    color:rgba(102,102,102,1);
}
.img_box{
    display: block;
    margin: 0 auto;
    width: 72px;
    height: 72px;
    border-radius: 50%;
}

</style>
