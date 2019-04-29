<template>
    <div class="bottom">
        <div class="ad_mediaMana_wrap">
            <div class="ad_mediaMana_nav clearfix">
                <p>
                    <a href="#">账号管理</a>
                    <em> / </em>
                    <a href="#" v-if="!isEdit">创建账号</a>
                    <a href="#" v-else>修改账号</a>
                </p>
            </div>
            <!--客户信息-->
            <div class="mediaMana_content_top">
                <div class="content_top_wrap">
                    <div class="content_top_head">
                        <h2>账号信息</h2>
                    </div>
                    <div class="content_top_form_wrap">
                        <el-form :model="accountForm" status-icon :rules="accountRules" ref="accountForm"
                                 label-width="120px" class="demo-ruleForm">
                            <el-form-item label="账号:" prop="account">
                                <el-input v-model="accountForm.account" placeholder="请输入账号"
                                          :disabled="isEdit"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名:" prop="realName">
                                <el-input v-model="accountForm.realName" placeholder="请输入真实姓名"></el-input>
                            </el-form-item>
                            <el-form-item label="所属公司" prop="company">
                                <el-select v-model="accountForm.company" placeholder="请选择所属公司" filterable @change="companyChange" size="small">
                                    <el-option v-for="item in companyArr" :key="item.value" :value="item.value" :label="item.label"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="角色" prop="role">
                                <el-select v-model="accountForm.role" placeholder="请选择角色" :disabled="isEdit" @change="roleSelect" size="small">
                                    <el-option v-for="item in roleArr" :key="item.value" :value="item.value" :label="item.label"></el-option>
                                </el-select>
                            </el-form-item>
                            <template v-if="type==0 && isSM">
                                <el-form-item label="可开通全国销售">
                                    <el-switch v-model="accountForm.saleManageLevel" :active-value="1" :inactive-value="0" active-color="#13ce66"></el-switch>
                                </el-form-item>
                                <el-form-item label="可开通全国媒介">
                                    <el-switch v-model="accountForm.mediaManageLevel" :active-value="1" :inactive-value="0" active-color="#13ce66"></el-switch>
                                </el-form-item>
                            </template>
                            <template v-if="isSale ">
                                <el-form-item label="销售类别:" prop="roleLevel" v-if="sessionData.saleManageLevel">
                                    <el-select v-model="accountForm.saleManageLevel" placeholder="请选择角色">
                                        <el-option :value="1" label="全国销售"></el-option>
                                        <el-option :value="0" label="地方销售"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="上级:" prop="boss" v-if="!isEdit">
                                    <el-autocomplete v-model="accountForm.boss" :fetch-suggestions="querySearchAsync" placeholder="请输入账号" @select="handleSelect">
                                    </el-autocomplete>
                                </el-form-item>
                                <el-form-item label="上级:" v-if="isEdit">
                                    <el-input disabled="disabled" :value="accountForm.boss"></el-input>
                                </el-form-item>
                            </template>
                            <template v-if="sessionData.mediaManageLevel && isMedia ">
                                <el-form-item label="媒介类别:" prop="roleLevel">
                                    <el-select v-model="accountForm.mediaManageLevel" placeholder="请选择角色">
                                        <el-option :value="1" label="全国媒介"></el-option>
                                        <el-option :value="0" label="地方媒介"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                            <el-form-item label="部门:" prop="division">
                                <el-input v-model="accountForm.division" placeholder="请输入部门"></el-input>
                            </el-form-item>
                            <el-form-item label="职务:" prop="position">
                                <el-input v-model="accountForm.position" placeholder="请输入职务"></el-input>
                            </el-form-item>
                            <el-form-item label="手机号码:" prop="phone">
                                <el-input v-model="accountForm.phone" maxlength="11" minlength="8"
                                          placeholder="请输入手机号码"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱:" prop="email">
                                <el-input v-model="accountForm.email" placeholder="请输入邮箱" type="email"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
            <div class="content_bottom_btn">
                <el-button @click="submitForm('accountForm')">{{isEdit?'保存':'创建'}}</el-button>
                <el-button type="default" @click="resetForm()">取消</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        Form,
        FormItem,
        Select,
        Option,
        Input,
        Button,
        MessageBox,
        Message,
        Autocomplete
    } from "element-ui";
    import api from "../../api/api";

    export default {
        name: "createClient",
        components: {
            elForm: Form,
            elFormItem: FormItem,
            elSelect: Select,
            elOption: Option,
            elInput: Input,
            elButton: Button,
            elAutocomplete: Autocomplete
        },
        data() {
            let validateAccount = (rule, value, callback) => {
                let reg = /^[^\u4e00-\u9fa5]{0,}$/;
                if (!reg.test(value)) {
                    callback(new Error("只能输入字母、数字、符号"));
                } else {
                    callback();
                }
            };
            let validateAssetId = (rule, value, callback) => {
                let szReg = /^1[34578]\d{9}$/;
                let HKszReg = /^\d{8}$/;        // 香港号码
                // console.log('szReg',szReg,'HKszReg',HKszReg)
                if (!szReg.test(value) && !HKszReg.test(value)) {
                    callback(new Error("请输入正确的手机号码"));
                } else {
                    callback();
                }
            };
            let validateBoss = (rule, value, callback) => {
                if (value) {
                    if (!this.accountForm.puID) {
                        callback(new Error("请输入正确的账号并进行选择"));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            return {
                timeout: null,
                isEdit: false, //新建/修改
                // 角色列表
                roleArr: [
                    {
                        label: '超级管理员',
                        value: 'SM'
                    },
                    {
                        label: '媒介',
                        value: 'MD'
                    },
                    {
                        label: '销售',
                        value: 'BD'
                    },
                    {
                        label: '运营',
                        value: 'OP'
                    },
                    {
                        label: '工程人员',
                        value: 'EP'
                    },
                ],
                // 公司列表
                companyArr: [
                    {
                        label: '亲邻科技',
                        value: 1
                    },
                    {
                        label: '亲邻科技2',
                        value: 2
                    },
                ],
                //表单
                accountForm: {
                    account: "",
                    realName: "",
                    role: "",
                    company: '',
                    boss: "",
                    position: "",
                    phone: "",
                    division: "",
                    email: "",
                    saleManageLevel: "",
                    mediaManageLevel: ""
                },
                accountRules: {
                    account: [
                        {
                            required: true,
                            message: "账号不能为空",
                            trigger: "blur"
                        },
                        {
                            max: 50,
                            message: "最多只能输入50个字节",
                            trigger: "blur"
                        },
                        {validator: validateAccount, trigger: "blur"}
                    ],
                    realName: [
                        {
                            required: true,
                            message: "姓名不能为空",
                            trigger: "blur"
                        },
                        {
                            max: 30,
                            message: "最多只能输入30个字节",
                            trigger: "blur"
                        }
                    ],
                    role: [
                        {required: true, message: "角色不能为空", trigger: "blur"}
                    ],
                    company: [
                        {
                            required: true,
                            message: "请选择所属公司",
                            trigger: "blur"
                        }
                    ],
                    position: [
                        {
                            max: 20,
                            message: "最多只能输入20个字节",
                            trigger: "blur"
                        }
                    ],
                    division: [
                        {
                            max: 20,
                            message: "最多只能输入20个字节",
                            trigger: "blur"
                        }
                    ],
                    phone: [
                        {
                            required: true,
                            message: "请输入手机号码",
                            trigger: "blur"
                        },
                        {validator: validateAssetId, trigger: "blur"}
                    ],
                    email: [
                        {
                            type: "email",
                            message: "请输入正确的邮箱地址",
                            trigger: "blur"
                        }
                    ],
                    boss: [{validator: validateBoss, trigger: "blur"}]
                },
                // 登录信息
                sessionData:'',
                // 登录者的公司属性(0平台商，1媒体主)
                type: '',
                // 是否选择了媒介或者销售
                isSale: false,
                isMedia: false,
                isSM: false,
            };
        },
        mounted() {
            this.getSession();
            this.getCompany();
            this.getInitEditInfo();
        },
        methods: {
            // 登录信息及角色数据
            getSession(){
                this.sessionData = JSON.parse(sessionStorage.getItem("session_data"));
                let {ascType} = this.sessionData;
                this.type = ascType;
                // if(ascType == 0){
                //     this.roleArr = [
                //         {
                //             label: '管理员',
                //             value: 'SM'
                //         }
                //     ];
                // }else{
                //     this.roleArr = [
                //         {
                //             label: '超级管理员',
                //             value: 'SM'
                //         },
                //         {
                //             label: '媒介',
                //             value: 'MD'
                //         },
                //         {
                //             label: '销售',
                //             value: 'BD'
                //         },
                //         {
                //             label: '运营',
                //             value: 'OP'
                //         },
                //         {
                //             label: '工程人员',
                //             value: 'EP'
                //         },
                //     ];
                // }
                console.log(this.roleArr);
            },
            // 公司数据
            getCompany(){
                let sess = this.sessionData;
                if(sess.ascType == 0){
                    let info = {
                        uid: sess.uID,
                        token: sess.token,
                    };
                    api.getApi(this.UCAPI+'/getCompany', info).then(res =>{
                        console.log(res.data);
                        if(res.data.SysCode == 200200){
                            let result = [];
                            for(let data of res.data.data){
                                let obj = {
                                    label: data.asName,
                                    value: data.asrID,
                                };
                                result.push(obj);
                            }
                            this.companyArr = result;
                        }else if(res.data.SysCode == 100302){
                            this.loginTimeout();
                        }else{
                            Message.warning(res.data.MSG);
                        }
                    }).catch(err=>{
                        console.log(err);
                    });
                }else{
                    this.companyArr = [
                        {
                            label: sess.asName,
                            value: sess.asrID
                        }
                    ];
                }
            },
            // 选择角色
            roleSelect(val){
                // let type = this.type;
                // if(type == 1 && val ==='BD'){
                //     this.isSale = true;
                //     this.isMedia = false;
                // }else if(type == 1 && val == 'MD'){
                //     this.isMedia = true;
                //     this.isSale = false;
                // }else{
                //     this.isMedia = false;
                //     this.isSale = false;
                // }
                let type = this.type;
                if(val ==='SM'){
                    this.isSM = true;
                    this.isSale = false;
                    this.isMedia = false;
                }else if(val ==='BD'){
                    this.isSale = true;
                    this.isMedia = false;
                    this.isSM = false;
                }else if(val == 'MD'){
                    this.isMedia = true;
                    this.isSale = false;
                    this.isSM = false;
                }else{
                    this.isMedia = false;
                    this.isSale = false;
                    this.isSM = false;
                }
            },
            // 选择公司
            companyChange(val){
                console.log(val);
            },
            // 输入账号获取上级信息(远程搜索)
            querySearchAsync(queryString, callback) {
                let sessionData = this.sessionData;
                if (queryString) {
                    let isOnlyID = false;
                    if(this.accountForm.company){
                        isOnlyID = true;
                    }else{
                        Message.warning('请先选择所属公司');
                        return;
                    }
                    if(isOnlyID){
                        let info = {
                            uid: sessionData.uID,
                            token: sessionData.token,
                            asrID: this.accountForm.company,
                            uType: 'BD',
                            sname: queryString
                        };
                        api.postApi(this.UCAPI + "/CheckUserName", info)
                            .then(res => {
                                if (res.data.SysCode == 200200) {
                                    if(res.data.data.uID){
                                        let data = res.data.data;
                                        data.value = data.realName;
                                        this.accountForm.boss = data.realName;
                                        this.accountForm.puID = data.uID;
                                        var results = [data];
                                        clearTimeout(this.timeout);
                                        this.timeout = setTimeout(() => {
                                            callback(results);
                                        }, 3000 * Math.random());
                                    }else{
                                        Message.warning('该公司下没有此销售');
                                    }
                                }else if(res.data.SysCode == 100302){
                                    this.loginTimeout();
                                }else{
                                    Message.warning(res.data.MSG);
                                }
                            });
                    }
                }
            },
            handleSelect(item) {
                console.log(item);
            },
            //根据登录用户的权限设置创建新帐号的上级
            submitForm(formName) {
                console.log("item", formName);
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.isEdit) {
                            this.postEditInfo();
                        } else {
                            this.createFun();
                        }
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            // 修改账户信息接口
            postEditInfo() {
                // uid         int【必填】     当前用户UserID
                // toid        int【必填】     被操作的UserID
                // rn          String          真实姓名
                // phone       String          移动电话
                // telephone   String          固定电话
                // email       String          电子邮箱
                // position    String          职务
                // division    String          所属部门
                let accForm = this.accountForm;
                let sess = this.sessionData;
                let account = {
                    uid: sess.uID,
                    token: sess.token,
                    realname: "",
                    sname: "",
                    utype: "",
                    division: "",
                    position: "",
                    phone: "",
                    email: "",
                    puid: "",
                    asrID: "",
                    saleManageLevel: "",
                    mediaManageLevel: "",
                    uID: "",
                };
                account.realname = accForm.realName; // 姓名
                account.uID = accForm.uID; // 姓名
                account.sname = accForm.account;
                account.utype = accForm.role; // 用户类型：SM、OP、BD、MD、AD
                account.division = accForm.division; // 职务
                account.position = accForm.position; // 部门
                account.phone = accForm.phone;
                account.email = accForm.email;
                account.asrID = accForm.company;
                account.saleManageLevel = accForm.saleManageLevel;
                account.mediaManageLevel = accForm.mediaManageLevel;
                if (accForm.puID) {
                    account.puid = actFrom.puID;
                }
                console.log(account);
                api.postApi(this.UCAPI+"/RegUser", account)
                    .then(res => {
                        console.log(res);
                        let data = res.data;
                        if (data.SysCode == 200200) {
                            MessageBox.alert(data.MSG + "<br>", "修改用户", {
                                showClose: false,
                                dangerouslyUseHTMLString: true,
                                confirmButtonText: "确定"
                            }).then(res => {
                                this.resetForm();
                            });
                        } else if(res.data.SysCode == 100302){
                            this.loginTimeout();
                        } else {
                            // Message.info('程序出错了,请稍后重试！');
                            Message.warning(res.data.MSG);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            //注册接口
            createFun() {
                console.log("accountForm", this.accountForm);
                let actFrom = this.accountForm;
                let sess = this.sessionData;
                let account = {
                    uid: sess.uID,
                    token: sess.token,
                    realname: "",
                    sname: "",
                    utype: "",
                    division: "",
                    position: "",
                    phone: "",
                    email: "",
                    puid: "",
                    asrID: "",
                    saleManageLevel: "",
                    mediaManageLevel: "",
                };
                account.realname = actFrom.realName; // 姓名
                account.sname = actFrom.account;
                account.utype = actFrom.role; // 用户类型：SM、OP、BD、MD、AD
                account.division = actFrom.division; // 职务
                account.position = actFrom.position; // 部门
                account.phone = actFrom.phone;
                account.email = actFrom.email;
                account.asrID = actFrom.company;
                account.saleManageLevel = actFrom.saleManageLevel;
                account.mediaManageLevel = actFrom.mediaManageLevel;
                if (actFrom.puID) {
                    account.puid = actFrom.puID;
                }
                console.log('提交的账号信息', account);
                api.postApi(this.UCAPI+"/RegUser", account)
                    .then(res => {
                        console.log(res);
                        let data = res.data;
                        if (data.SysCode === 100302 || data.MSG === '登陆超时') {
                            this.loginTimeout();
                        } else if(data.SysCode === 100300 || data.MSG === '注册失败，可能是账户名称已被占用'){
                            this.$message({
                                message: '注册失败，可能是账户名称已被占用',
                                type: 'warning'
                            })
                        }else {
                            if(data.SysCode == 200200){
                                MessageBox.alert(
                                    data.MSG + "<br>",
                                    "注册用户",
                                    {
                                        showClose: false,
                                        dangerouslyUseHTMLString: true,
                                        confirmButtonText: "确定"
                                    }
                                ).then(res => {
                                    this.resetForm()
                                });
                            }else{
                                Message.warning(data.MSG);
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            //重置表单
            resetForm() {
                if (this.isEdit) {
                    if(this.sessionData.uType == 'SA'){
                        this.$router.push('./admin');
                    }else{
                        this.$router.push("./accountList");
                    }
                } else {
                    this.$refs["accountForm"].resetFields();
                    window.history.go(-1);
                }
            },
            // 获取修改账户初始信息
            getInitEditInfo() {
                let inputPath = this.$route.fullPath; //this.$route.path
                if (inputPath.indexOf("edit=y") !== -1) {
                    let userId = sessionStorage.getItem('userId');
                    let sess = this.sessionData;
                    if(userId){
                        let info = {
                            uid: sess.uID,
                            token: sess.token,
                            userId: userId
                        };
                        api.postApi(this.UCAPI+'/GetUser', info).then(res =>{
                            console.log(res.data);
                            if(res.data.SysCode == 200200){
                                this.isEdit = true;
                                let result = res.data.data;
                                let editInfo = {
                                    uID: result.uID,
                                    account: result.sName,
                                    realName: result.realName,
                                    role: result.uType,
                                    boss: result.puName ? result.puName : "",
                                    position: result.position ? result.position : "",
                                    phone: result.phone?result.phone:'',
                                    division: result.division ? result.division : "",
                                    email: result.email ? result.email : "",
                                    company: result.asrID ? result.asrID : "",
                                    saleManageLevel: result.saleManageLevel?result.saleManageLevel:'',
                                    mediaManageLevel: result.mediaManageLevel?result.mediaManageLevel:'',
                                }
                                console.log('editInfo-----', editInfo);
                                this.accountForm = editInfo;
                                this.roleSelect(editInfo.role);
                            }else if(res.data.SysCode == 100302){
                                this.loginTimeout();
                            }else{
                                Message.warning(res.data.MSG);
                            }
                        }).catch(err =>{
                            console.log(err);
                        });
                    }else{
                        this.$router.push("./createAccount");
                        this.isEdit = false;
                    }
                } else {
                    this.isEdit = false;
                    sessionStorage.removeItem("account_detail");
                }
            },
            loginTimeout() {
                Message.warning("登录超时,请重新登录");
                this.$router.push("/login");
            },
        }
    };
</script>

<style scoped>
    /*面包屑导航*/
    .ad_mediaMana_nav {
        position: relative;
        height: 0;
    }

    .ad_mediaMana_nav p {
        padding-left: 57px;
        position: absolute;
        left: 0;
        top: 12px;
        font-size: 14px;
        line-height: 18px;
    }

    .ad_mediaMana_nav p em {
        font-size: 14px;
        color: #d9d9d9;
        line-height: 18px;
    }

    .ad_mediaMana_nav p a {
        color: #666;
    }

    .ad_mediaMana_nav p a:nth-of-type(1) {
        color: #999;
    }

    .ad_mediaMana_wrap {
        margin-bottom: 109px;
        position: relative;
    }

    /*wrap*/
    .mediaMana_content_top {
        padding: 42px 60px 0 60px;
    }

    .content_top_wrap,
    .content_bottom_wrap {
        background: #ffffff;
        border: 1px solid #dedede;
        padding-top: 3px;
    }

    .content_top_wrap .content_top_head {
        width: 100%;
        height: 35px;
        border-bottom: 1px solid #dedede;
    }

    .content_bottom_wrap .content_bottom_head {
        width: 100%;
        height: 35px;
        border-bottom: 1px solid #dedede;
    }

    .content_top_wrap .content_top_head h2,
    .content_bottom_wrap .content_bottom_head h2 {
        font-size: 16px;
        color: #2c313c;
        font-weight: bold;
        padding-left: 16px;
        height: 24px;
        margin-top: 8px;
    }

    .content_top_wrap .content_top_form_wrap,
    .content_bottom_wrap .content_bottom_form_wrap {
        padding: 18px;
    }

    /deep/ .el-form.demo-ruleForm {
        width: 342px;
        margin: 0 auto;
    }

    /*按钮*/
    .content_bottom_btn {
        position: absolute;
        bottom: -100px;
        margin-bottom: 22px;
        left: 45.3%;
    }

    .content_bottom_btn button {
        width: 80px;
        height: 34px;
        outline: none;
        cursor: pointer;
    }

    .content_bottom_btn button.create {
        background: #108ee9;
        border-radius: 2px;
        font-size: 14px;
        border: none;
        color: #ffffff;
    }

    .content_bottom_btn button.cancel {
        background: #f5f6fa;
        border: none;
        font-size: 14px;
        color: #979797;
    }

    /*tags样式*/
    .el-tag + .el-tag {
        margin-left: 5px;
    }

    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        width: 90px !important;
        margin-left: 10px !important;
        vertical-align: bottom;
    }

    /deep/ .input-new-tag .el-input__inner {
        width: 90px !important;
        height: 34px;
        position: relative;
        top: -5px;
        left: -9px;
    }

    /deep/ .input-new-tag .el-input__suffix {
        top: -4px;
        right: 14px;
    }

    /deep/ .button-new-tag {
        margin-left: 0;
        position: relative;
        top: -1px;
    }

    /deep/ .tags .el-form-item__error {
        display: none;
    }

    /deep/ .tags .el-input {
        width: 90px !important;
        height: 34px;
    }

    /deep/ .el-tag {
        height: 34px;
        line-height: 32px;
    }

    /deep/ .button-new-tag {
        height: 34px;
        line-height: 32px;
    }

    /*客户信息表单*/
    .el-input {
        width: 240px;
        height: 34px;
    }

    /deep/ .el-input__inner {
        width: 240px;
        height: 34px;
    }

    /deep/ .RlngNlat .el-form-item__content {
        margin-left: -1px !important;
    }

    /deep/ .lngNlat .el-input__inner {
        width: 118px;
    }

    /deep/ .rmb .el-input__inner {
        padding-left: 30px;
    }

    /deep/ .lngNlat .el-input {
        width: 118px;
    }

    /deep/ .el-form-item {
        margin-bottom: 2px;
    }

    /deep/ .el-popper[x-placement^="bottom"] {
        margin-top: 3px !important;
    }

    /deep/ .el-textarea__inner {
        width: 240px;
        height: 76px !important;
        resize: none;
        position: relative;
        top: 3px;
    }

    /deep/ .el-form-item__error {
        top: 22%;
        left: 255px;
        width: 200px;
    }

    /deep/ .el-popper[x-placement^="bottom"] {
        margin-top: 3px !important;
        top: 200px !important;
    }

    .bottom {
        height: 672px;
    }

    /*1440*/
    @media all and (min-width: 1420px) {
        .bottom {
            height: 802px;
        }
    }

    /*1920*/
    @media all and (min-width: 1900px) {
        .mediaMana_content_bottom .content_bottom_btn {
            position: absolute;
            bottom: -66px;
            left: 896px;
        }

        .bottom {
            height: 875px;
        }
    }
</style>

